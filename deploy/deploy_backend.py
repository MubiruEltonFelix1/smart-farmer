"""
deploy_backend.py — provision the Smart Farmer diagnosis API on AWS Lambda.

Creates, or updates in place, everything the backend needs to run without your
machine:

    IAM role            execution role with Bedrock permissions scoped to models
    Lambda function     running the FastAPI app through the Mangum adapter
    API Gateway HTTP API  public HTTPS endpoint in front of it
    Stage throttling    a ceiling on request rate
    Reserved concurrency  a hard ceiling on how fast you can be billed
    Budget alert        optional, emails you before spending runs away

It is idempotent. Run it as many times as you like; existing resources are
updated rather than duplicated.

Recommended first run, which changes nothing and only reports what your
credentials are missing:

    python deploy/deploy_backend.py --check

Then, once the permissions are in place:

    python deploy/build_lambda_package.py
    python deploy/deploy_backend.py --allowed-origins https://your-site.vercel.app

Cost note: Lambda and API Gateway bill per request with no idle charge, so a
demo that nobody is using costs approximately nothing. The reserved concurrency
cap is what stops a runaway or hostile client from changing that.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import secrets
import sys
import time
from pathlib import Path

import boto3
from botocore.exceptions import (
    BotoCoreError,
    ClientError,
    ConnectionClosedError,
    ConnectTimeoutError,
    EndpointConnectionError,
    NoCredentialsError,
    ReadTimeoutError,
)

# A Windows console on a legacy code page raises UnicodeEncodeError on any
# character outside it, and this script prints AWS error text we do not control.
# Same guard as backend/main.py, for the same reason.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(errors="replace")
    except (AttributeError, ValueError):
        pass

# ─── Paths ───────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
ZIP_PATH = SCRIPT_DIR / "build" / "smart-farmer-lambda.zip"
ARTIFACT_BUCKET_PREFIX = "smart-farmer-lambda-artifacts"
ARTIFACT_KEY = "smart-farmer-lambda.zip"

# ─── Fixed resource names ────────────────────────────────────────────────────
FUNCTION_NAME = "smart-farmer-diagnose"
ROLE_NAME = "smart-farmer-lambda-role"
INLINE_POLICY_NAME = "smart-farmer-bedrock-access"
API_NAME = "smart-farmer-api"
STAGE_NAME = "$default"
LAMBDA_PERMISSION_ID = "apigateway-invoke"

LAMBDA_RUNTIME = "python3.12"
LAMBDA_ARCH = "x86_64"
LAMBDA_MEMORY_MB = 1024
LAMBDA_TIMEOUT_S = 29
# API Gateway HTTP APIs cap the integration timeout at 30 seconds. Lambda's own
# timeout is set one second lower so that a slow model call surfaces as a Lambda
# timeout with a readable error, rather than API Gateway returning a bare 504.
INTEGRATION_TIMEOUT_MS = 30_000

DEFAULT_REGION = "us-east-1"
DEFAULT_MODEL_ID = "amazon.nova-lite-v1:0"
DEFAULT_MAX_IMAGE_DIM = "1024"
DEFAULT_MAX_TOKENS = "400"
DEFAULT_TEMPERATURE = "0"
DEFAULT_CONCURRENCY = 5
DEFAULT_RATE_LIMIT = 5
DEFAULT_BURST_LIMIT = 10

# Actions this script needs. Used by --check to report what is missing before
# anything is created.
REQUIRED_ACTIONS = [
    "sts:GetCallerIdentity",
    "iam:GetRole",
    "iam:CreateRole",
    "iam:AttachRolePolicy",
    "iam:PutRolePolicy",
    "lambda:GetFunction",
    "lambda:CreateFunction",
    "lambda:UpdateFunctionCode",
    "lambda:UpdateFunctionConfiguration",
    "lambda:PutFunctionConcurrency",
    "lambda:AddPermission",
    "apigateway:GET",
    "apigateway:POST",
    "apigateway:PATCH",
]

OPTIONAL_ACTIONS = ["budgets:ModifyBudget", "budgets:ViewBudget"]


def log(step: str, message: str) -> None:
    print(f"  [{step}] {message}", flush=True)


def heading(text: str) -> None:
    print(f"\n=== {text} ===", flush=True)


def fail(message: str, hint: str | None = None) -> None:
    print(f"\nFAILED: {message}", file=sys.stderr)
    if hint:
        print(f"\n{hint}", file=sys.stderr)
    sys.exit(1)


def error_code(exc: ClientError) -> str:
    return exc.response.get("Error", {}).get("Code", "")


def is_access_denied(exc: ClientError) -> bool:
    return error_code(exc) in ("AccessDenied", "AccessDeniedException", "UnauthorizedOperation")


def artifact_bucket_name(account: str, region: str) -> str:
    return f"{ARTIFACT_BUCKET_PREFIX}-{account}-{region}"


def ensure_artifact_package(session, region: str, account: str) -> tuple[str, str]:
    """Upload the Lambda zip to S3 so Lambda can fetch it server-side."""
    s3 = session.client("s3", region_name=region)
    bucket = artifact_bucket_name(account, region)
    zip_bytes = ZIP_PATH.read_bytes()
    digest = hashlib.sha256(zip_bytes).hexdigest()[:16]
    key = f"{ARTIFACT_KEY.rsplit('.', 1)[0]}-{digest}.zip"

    try:
        if region == "us-east-1":
            s3.create_bucket(Bucket=bucket)
        else:
            s3.create_bucket(
                Bucket=bucket,
                CreateBucketConfiguration={"LocationConstraint": region},
            )
        log("new", f"created artifact bucket {bucket}")
    except ClientError as exc:
        code = error_code(exc)
        if code not in ("BucketAlreadyOwnedByYou", "BucketAlreadyExists"):
            raise
        log("ok", f"artifact bucket exists: {bucket}")

    s3.put_object(Bucket=bucket, Key=key, Body=zip_bytes)
    log("ok", f"uploaded {ZIP_PATH.name} to s3://{bucket}/{key}")
    return bucket, key


# ─── Preflight ───────────────────────────────────────────────────────────────
def preflight(session, region: str) -> dict:
    heading("Preflight")
    sts = session.client("sts")
    try:
        identity = sts.get_caller_identity()
    except NoCredentialsError:
        fail(
            "no AWS credentials found.",
            "Run `aws configure`, or set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY.",
        )
    except BotoCoreError as exc:
        fail(f"could not reach AWS: {exc}")

    account = identity["Account"]
    log("ok", f"account {account}")
    log("ok", f"identity {identity['Arn']}")
    log("ok", f"region {region}")

    if not ZIP_PATH.is_file():
        fail(
            f"deployment package not found at {ZIP_PATH}.",
            "Build it first:\n    python deploy/build_lambda_package.py",
        )
    size_mb = ZIP_PATH.stat().st_size / 1_048_576
    log("ok", f"package {size_mb:.1f} MB")
    if size_mb > 50:
        fail(
            f"package is {size_mb:.1f} MB, over Lambda's 50 MB direct-upload limit.",
            "Upload it to S3 and deploy from there, or reduce the bundle.",
        )

    return {"account": account, "arn": identity["Arn"]}


def check_permissions(session, identity: dict, region: str, want_budget: bool) -> None:
    """
    Report which required actions the current principal is allowed to perform.

    Prefers IAM's policy simulator, which answers precisely and changes nothing.
    Many restricted users cannot call it, so falls back to probing read-only
    endpoints and says so, rather than pretending the answer is complete.
    """
    heading("Permission check (nothing is created by this)")

    actions = REQUIRED_ACTIONS + (OPTIONAL_ACTIONS if want_budget else [])
    iam = session.client("iam")

    try:
        response = iam.simulate_principal_policy(
            PolicySourceArn=identity["arn"],
            ActionNames=actions,
        )
        allowed, denied = [], []
        for result in response.get("EvaluationResults", []):
            (allowed if result.get("EvalDecision") == "allowed" else denied).append(
                result["EvalActionName"]
            )

        print(f"\n  allowed ({len(allowed)}):")
        for action in sorted(allowed):
            print(f"    + {action}")

        if denied:
            print(f"\n  MISSING ({len(denied)}):")
            for action in sorted(denied):
                print(f"    - {action}")
            print(
                "\n  Grant these to the IAM user before deploying. The quickest route\n"
                "  for a personal account is to attach a broader deployment policy\n"
                "  temporarily, deploy, then narrow it again."
            )
        else:
            print("\n  All required actions are allowed. Ready to deploy.")
        return

    except ClientError as exc:
        if not is_access_denied(exc):
            raise
        print(
            "  iam:SimulatePrincipalPolicy is not permitted here, so exact action\n"
            "  checks are unavailable. Falling back to probing read-only endpoints.\n"
            "  This proves read access only; write access is confirmed on deploy."
        )

    probes = [
        ("iam:GetRole", lambda: iam.get_role(RoleName=ROLE_NAME)),
        ("lambda:ListFunctions", lambda: session.client("lambda", region_name=region)
            .list_functions(MaxItems=1)),
        ("apigateway:GET", lambda: session.client("apigatewayv2", region_name=region)
            .get_apis(MaxResults="1")),
        ("bedrock:ListFoundationModels", lambda: session.client("bedrock", region_name=region)
            .list_foundation_models()),
    ]

    print()
    missing = []
    for label, call in probes:
        try:
            call()
            print(f"    + {label}")
        except ClientError as exc:
            if is_access_denied(exc):
                print(f"    - {label}   <-- DENIED")
                missing.append(label)
            else:
                # A different error (e.g. missing resource) still proves permission.
                print(f"    + {label}")

    try:
        bedrock = session.client("bedrock", region_name=region)
        models = bedrock.list_foundation_models(byProvider="amazon")["modelSummaries"]
        ids = {m["modelId"] for m in models if m.get("modelLifecycle", {}).get("status") == "ACTIVE"}
        print(f"\n    Bedrock: {len(ids)} active Amazon models visible in {region}")
    except ClientError:
        pass

    if missing:
        print(f"\n  Denied: {', '.join(missing)}")
        print("  Deploying requires at minimum Lambda and API Gateway write access.")
    else:
        print("\n  Read probes passed. Write access is confirmed on deploy.")


# ─── IAM ─────────────────────────────────────────────────────────────────────
def ensure_role(session, region: str, account: str) -> tuple[str, bool]:
    heading("IAM execution role")
    iam = session.client("iam")

    trust_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {"Service": "lambda.amazonaws.com"},
                "Action": "sts:AssumeRole",
            }
        ],
    }

    # Scoped to foundation models and inference profiles rather than "*", so the
    # function cannot be pointed at arbitrary Bedrock resources later by accident.
    bedrock_policy = {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "InvokeModels",
                "Effect": "Allow",
                "Action": [
                    "bedrock:InvokeModel",
                    "bedrock:InvokeModelWithResponseStream",
                ],
                "Resource": [
                    f"arn:aws:bedrock:{region}::foundation-model/*",
                    f"arn:aws:bedrock:*:{account}:inference-profile/*",
                ],
            },
            {
                # Bedrock enables model access on first invoke by calling AWS
                # Marketplace. Without these the first request fails with
                # AccessDeniedException and the cause is not obvious.
                "Sid": "AutoEnableModelAccess",
                "Effect": "Allow",
                "Action": [
                    "aws-marketplace:Subscribe",
                    "aws-marketplace:Unsubscribe",
                    "aws-marketplace:ViewSubscriptions",
                ],
                "Resource": "*",
            },
        ],
    }

    created = False
    try:
        role = iam.get_role(RoleName=ROLE_NAME)["Role"]
        log("ok", f"role exists: {role['Arn']}")
    except iam.exceptions.NoSuchEntityException:
        role = iam.create_role(
            RoleName=ROLE_NAME,
            AssumeRolePolicyDocument=json.dumps(trust_policy),
            Description="Execution role for the Smart Farmer diagnosis Lambda.",
        )["Role"]
        created = True
        log("new", f"created role {role['Arn']}")

    iam.attach_role_policy(
        RoleName=ROLE_NAME,
        PolicyArn="arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
    )
    log("ok", "attached AWSLambdaBasicExecutionRole (CloudWatch logs)")

    iam.put_role_policy(
        RoleName=ROLE_NAME,
        PolicyName=INLINE_POLICY_NAME,
        PolicyDocument=json.dumps(bedrock_policy),
    )
    log("ok", "wrote inline Bedrock policy")

    if created:
        # A brand-new role is not usable by Lambda for several seconds. Without
        # this wait the first deploy fails with a confusing role-validation error.
        log("wait", "new role must propagate; waiting 12s")
        time.sleep(12)

    return role["Arn"], created


# ─── Lambda ──────────────────────────────────────────────────────────────────
def ensure_function(session, region: str, role_arn: str, env_vars: dict) -> str:
    heading("Lambda function")
    lam = session.client("lambda", region_name=region)
    account = session.client("sts", region_name=region).get_caller_identity()["Account"]
    artifact_bucket, artifact_key = ensure_artifact_package(session, region, account)
    code_location = {"S3Bucket": artifact_bucket, "S3Key": artifact_key}

    common_config = {
        "Runtime": LAMBDA_RUNTIME,
        "Role": role_arn,
        "Handler": "lambda_handler.handler",
        "Timeout": LAMBDA_TIMEOUT_S,
        "MemorySize": LAMBDA_MEMORY_MB,
        "Environment": {"Variables": env_vars},
        "Architectures": [LAMBDA_ARCH],
    }

    try:
        lam.get_function(FunctionName=FUNCTION_NAME)
        exists = True
    except lam.exceptions.ResourceNotFoundException:
        exists = False

    if exists:
        log("ok", f"function exists: {FUNCTION_NAME}")

        lam.update_function_code(FunctionName=FUNCTION_NAME, **code_location)
        log("ok", "uploaded new code")
        lam.get_waiter("function_updated").wait(FunctionName=FUNCTION_NAME)

        # Configuration cannot be changed while a code update is in flight.
        lam.update_function_configuration(FunctionName=FUNCTION_NAME, **common_config)
        log("ok", "applied configuration (timeout, memory, env vars)")
        lam.get_waiter("function_updated").wait(FunctionName=FUNCTION_NAME)
    else:
        log("new", f"creating function {FUNCTION_NAME}")
        # A freshly created IAM role occasionally needs a moment more than the
        # sleep in ensure_role. Lambda uploads can also fail transiently when
        # the AWS endpoint stalls, so retry rather than failing the whole deploy.
        last_error: Exception | None = None
        for attempt in range(1, 6):
            try:
                lam.create_function(
                    FunctionName=FUNCTION_NAME,
                    Description="Smart Farmer crop-disease diagnosis API (Bedrock + Nova).",
                    Code=code_location,
                    Publish=False,
                    **common_config,
                )
                last_error = None
                break
            except ClientError as exc:
                last_error = exc
                if error_code(exc) == "InvalidParameterValueException" and attempt < 5:
                    log("wait", f"role not ready yet, retry {attempt}/5 in 8s")
                    time.sleep(8)
                else:
                    raise
            except (
                ConnectionClosedError,
                ConnectTimeoutError,
                EndpointConnectionError,
                ReadTimeoutError,
                TimeoutError,
            ) as exc:
                last_error = exc
                if attempt < 5:
                    log("wait", f"Lambda endpoint timed out, retry {attempt}/5 in 8s")
                    time.sleep(8)
                else:
                    raise
        if last_error is not None:
            raise last_error

        log("ok", "created; waiting for it to become active")
        lam.get_waiter("function_active").wait(FunctionName=FUNCTION_NAME)

    function_arn = lam.get_function(FunctionName=FUNCTION_NAME)["Configuration"]["FunctionArn"]
    log("ok", function_arn)
    return function_arn


def set_concurrency(session, region: str, limit: int) -> None:
    heading("Reserved concurrency (spend ceiling)")
    lam = session.client("lambda", region_name=region)
    lam.put_function_concurrency(
        FunctionName=FUNCTION_NAME,
        ReservedConcurrentExecutions=limit,
    )
    log("ok", f"capped at {limit} concurrent executions")


def resolve_api_key(lam, provided: str | None) -> tuple[str, str]:
    """
    Decide which API key to configure, and say where it came from.

    Order matters. An explicitly passed key wins. Otherwise reuse whatever the
    deployed function already has, because generating a fresh key on every deploy
    would silently break a frontend that was built with the previous one. A new
    key is only minted when there is genuinely nothing to reuse.
    """
    if provided:
        return provided, "from --api-key"

    try:
        config = lam.get_function_configuration(FunctionName=FUNCTION_NAME)
        existing = config.get("Environment", {}).get("Variables", {}).get("API_KEY", "")
        if existing:
            return existing, "reused from the deployed function"
    except ClientError:
        pass  # function does not exist yet

    return secrets.token_urlsafe(32), "newly generated"


# ─── API Gateway ─────────────────────────────────────────────────────────────
def ensure_api(session, region: str, account: str, function_arn: str,
               rate_limit: int, burst_limit: int) -> str:
    heading("API Gateway HTTP API")
    apigw = session.client("apigatewayv2", region_name=region)

    existing = next(
        (a for a in apigw.get_apis().get("Items", []) if a["Name"] == API_NAME),
        None,
    )
    if existing:
        api_id = existing["ApiId"]
        log("ok", f"API exists: {api_id}")
    else:
        api_id = apigw.create_api(
            Name=API_NAME,
            ProtocolType="HTTP",
            Description="Public endpoint for the Smart Farmer diagnosis API.",
        )["ApiId"]
        log("new", f"created API {api_id}")

    integrations = apigw.get_integrations(ApiId=api_id).get("Items", [])
    if integrations:
        integration_id = integrations[0]["IntegrationId"]
        apigw.update_integration(
            ApiId=api_id,
            IntegrationId=integration_id,
            IntegrationUri=function_arn,
            TimeoutInMillis=INTEGRATION_TIMEOUT_MS,
        )
        log("ok", "updated Lambda integration")
    else:
        integration_id = apigw.create_integration(
            ApiId=api_id,
            IntegrationType="AWS_PROXY",
            IntegrationUri=function_arn,
            PayloadFormatVersion="2.0",
            TimeoutInMillis=INTEGRATION_TIMEOUT_MS,
        )["IntegrationId"]
        log("new", "created Lambda integration")

    routes = apigw.get_routes(ApiId=api_id).get("Items", [])
    if not any(r["RouteKey"] == "$default" for r in routes):
        apigw.create_route(
            ApiId=api_id,
            RouteKey="$default",
            Target=f"integrations/{integration_id}",
        )
        log("new", "created $default route (forwards every path to FastAPI)")
    else:
        log("ok", "$default route exists")

    # The $default stage normally appears with the API. Create it if it is absent
    # so throttling always has somewhere to attach.
    stages = apigw.get_stages(ApiId=api_id).get("Items", [])
    if not any(s["StageName"] == STAGE_NAME for s in stages):
        apigw.create_stage(ApiId=api_id, StageName=STAGE_NAME, AutoDeploy=True)
        log("new", f"created {STAGE_NAME} stage")

    apigw.update_stage(
        ApiId=api_id,
        StageName=STAGE_NAME,
        DefaultRouteSettings={
            "ThrottlingRateLimit": rate_limit,
            "ThrottlingBurstLimit": burst_limit,
        },
    )
    log("ok", f"throttled to {rate_limit}/s sustained, {burst_limit} burst")

    try:
        lam = session.client("lambda", region_name=region)
        lam.add_permission(
            FunctionName=FUNCTION_NAME,
            StatementId=LAMBDA_PERMISSION_ID,
            Action="lambda:InvokeFunction",
            Principal="apigateway.amazonaws.com",
            SourceArn=f"arn:aws:execute-api:{region}:{account}:{api_id}/*",
        )
        log("ok", "granted API Gateway permission to invoke the function")
    except ClientError as exc:
        if error_code(exc) == "ResourceConflictException":
            log("ok", "invoke permission already present")
        else:
            raise

    return f"https://{api_id}.execute-api.{region}.amazonaws.com"


def ensure_budget(session, account: str, email: str, limit_usd: float) -> None:
    heading("Budget alert")
    budgets = session.client("budgets", region_name="us-east-1")
    name = "smart-farmer-monthly"

    try:
        budgets.describe_budget(AccountId=account, BudgetName=name)
        exists = True
    except ClientError as exc:
        if error_code(exc) in ("NotFoundException", "ResourceNotFoundException"):
            exists = False
        elif is_access_denied(exc):
            log("skip", "no permission to manage budgets; skipping")
            return
        else:
            raise

    budget = {
        "BudgetName": name,
        "BudgetLimit": {"Amount": str(limit_usd), "Unit": "USD"},
        "TimeUnit": "MONTHLY",
        "BudgetType": "COST",
    }
    notification = {
        "Notification": {
            "NotificationType": "ACTUAL",
            "ComparisonOperator": "GREATER_THAN",
            "Threshold": 80.0,
            "ThresholdType": "PERCENTAGE",
        },
        "Subscribers": [{"SubscriptionType": "EMAIL", "Address": email}],
    }

    if exists:
        budgets.update_budget(AccountId=account, NewBudget=budget)
        budgets.update_notification(
            AccountId=account, BudgetName=name,
            OldNotification=notification["Notification"],
            NewNotification=notification,
        )
        log("ok", f"updated ${limit_usd:.0f}/month budget")
    else:
        budgets.create_budget(
            AccountId=account,
            Budget=budget,
            NotificationsWithSubscribers=[notification],
        )
        log("new", f"created ${limit_usd:.0f}/month budget, alerting {email} at 80%")

    print(
        "\n  Note: a budget ALERTS, it does not stop spending. The concurrency\n"
        "  cap is what actually bounds how fast you can be billed."
    )


# ─── Main ────────────────────────────────────────────────────────────────────
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Deploy the Smart Farmer diagnosis API to AWS Lambda.",
    )
    parser.add_argument("--check", action="store_true",
                        help="report missing permissions and create nothing")
    parser.add_argument("--region", default=DEFAULT_REGION)
    parser.add_argument("--model-id", default=DEFAULT_MODEL_ID)
    parser.add_argument("--max-image-dim", default=DEFAULT_MAX_IMAGE_DIM)
    parser.add_argument("--max-tokens", default=DEFAULT_MAX_TOKENS)
    parser.add_argument("--temperature", default=DEFAULT_TEMPERATURE)
    parser.add_argument("--concurrency", type=int, default=DEFAULT_CONCURRENCY)
    parser.add_argument("--rate-limit", type=int, default=DEFAULT_RATE_LIMIT)
    parser.add_argument("--burst-limit", type=int, default=DEFAULT_BURST_LIMIT)
    parser.add_argument("--allowed-origins", default="http://localhost:5173",
                        help="comma-separated browser origins; set this to your "
                             "deployed frontend domain or CORS will block it")
    parser.add_argument("--budget-email", default=None,
                        help="create a monthly budget alert sent to this address")
    parser.add_argument("--budget-usd", type=float, default=5.0)
    parser.add_argument("--api-key", default=None,
                        help="shared secret required on /api/v1/diagnose. If omitted, "
                             "an existing deployed key is reused, or a new one is "
                             "generated on first deploy.")
    args = parser.parse_args()

    print("\nSmart Farmer - backend deployment")
    session = boto3.Session(region_name=args.region)

    try:
        identity = preflight(session, args.region)

        if args.check:
            check_permissions(session, identity, args.region, bool(args.budget_email))
            print("\nNothing was created. Re-run without --check to deploy.\n")
            return

        lam_client = session.client("lambda", region_name=args.region)
        api_key, key_origin = resolve_api_key(lam_client, args.api_key)

        env_vars = {
            "DIAGNOSIS_PROVIDER": "bedrock",
            "AWS_REGION": args.region,
            "BEDROCK_MODEL_ID": args.model_id,
            "BEDROCK_MAX_IMAGE_DIM": args.max_image_dim,
            "BEDROCK_MAX_TOKENS": args.max_tokens,
            "BEDROCK_TEMPERATURE": args.temperature,
            "ALLOWED_ORIGINS": args.allowed_origins,
            "API_KEY": api_key,
        }
        # AWS_PROFILE is intentionally absent. On Lambda credentials come from the
        # execution role, and setting a profile name would break resolution.

        role_arn, _ = ensure_role(session, args.region, identity["account"])
        function_arn = ensure_function(session, args.region, role_arn, env_vars)
        set_concurrency(session, args.region, args.concurrency)
        api_base = ensure_api(
            session, args.region, identity["account"], function_arn,
            args.rate_limit, args.burst_limit,
        )

        if args.budget_email:
            ensure_budget(session, identity["account"], args.budget_email, args.budget_usd)

        heading("Done")
        print(f"\n  API base URL : {api_base}")
        print(f"  Health check : {api_base}/api/v1/health   (open, no key needed)")
        print(f"  Diagnose     : POST {api_base}/api/v1/diagnose")
        print(f"  Interactive  : {api_base}/docs")
        print("\n  Verify it is live:")
        print(f'    curl.exe "{api_base}/api/v1/health"')
        print(f"\n  API key ({key_origin}):\n    {api_key}")
        print("\n  Test a diagnosis from the command line:")
        print(f'    curl.exe -X POST "{api_base}/api/v1/diagnose" '
              f'-H "X-API-Key: {api_key}" -F "image=@C:\\path\\to\\leaf.jpg"')
        print("\n  Then point the frontend at it. Add BOTH of these in Vercel and")
        print("  REDEPLOY, because Vite bakes values in at build time:")
        print(f"\n    VITE_API_BASE = {api_base}")
        print(f"    VITE_API_KEY  = {api_key}\n")
        print("  The key ends up inside the JavaScript bundle, so treat it as public.")
        print("  It blocks scanners and casual abuse, not a determined attacker.")
        print("  Reserved concurrency and throttling are what actually cap the bill.\n")

    except ClientError as exc:
        if is_access_denied(exc):
            fail(
                f"AWS denied {error_code(exc)}.\n\n{exc}",
                "Your IAM user is missing permissions. Run this to see exactly "
                "which:\n    python deploy/deploy_backend.py --check",
            )
        fail(f"AWS error {error_code(exc)}: {exc}")
    except KeyboardInterrupt:
        print("\n\nCancelled. Resources already created were left in place; "
              "re-run to continue.\n")


if __name__ == "__main__":
    main()
