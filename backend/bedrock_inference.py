"""
bedrock_inference.py — crop disease diagnosis via Amazon Bedrock (Amazon Nova).

This is the default diagnosis provider. Rather than loading a model file on this
machine, it sends the leaf photograph to a multimodal foundation model on Amazon
Bedrock and asks it to choose exactly one label from the PlantVillage taxonomy in
taxonomy.py. The taxonomy then maps that label to the crop, severity, status and
agronomic recommendations the frontend expects.

Why a foundation model instead of a locally trained classifier:
  * no dataset to source and no training run to schedule
  * no model artifact to ship or keep in sync
  * nothing to host, so no GPU and no idle endpoint cost — billed per request

Trade-off worth remembering: the confidence value returned here is the model's
own self-report, not a calibrated softmax probability from a purpose-trained
classifier. Treat it as a rough signal, not a measurement.

Requires:
    pip install boto3

Environment:
    AWS_REGION             region with a bedrock-runtime endpoint (default us-east-1)
    AWS_PROFILE            optional named profile; blank uses the default chain
    BEDROCK_MODEL_ID       Nova model id that accepts image input
    BEDROCK_MAX_IMAGE_DIM  longest edge, in px, images are downscaled to
    BEDROCK_MAX_TOKENS     cap on generated tokens
    BEDROCK_TEMPERATURE    sampling temperature (0 for classification)
"""

import io
import json
import os
import re
from typing import Any

import boto3
from botocore.config import Config as BotoConfig
from botocore.exceptions import (
    BotoCoreError,
    ClientError,
    NoCredentialsError,
    NoRegionError,
)
from PIL import Image, ImageOps

from taxonomy import (
    CROP_MAP,
    DISPLAY_NAMES,
    PLANTVILLAGE_CLASSES,
    RECOMMENDATIONS,
    SEVERITY_MAP,
    STATUS_MAP,
)

# ─── Config ──────────────────────────────────────────────────────────────────
DEFAULT_REGION = "us-east-1"
DEFAULT_MODEL_ID = "amazon.nova-lite-v1:0"
DEFAULT_MAX_IMAGE_DIM = 1024
DEFAULT_MAX_TOKENS = 400
DEFAULT_TEMPERATURE = 0.0

# Bedrock's runtime API does not exist in every region. af-south-1 (Cape Town)
# carries only the control plane, so pointing this at an African region fails at
# the network layer rather than with a useful error.
KNOWN_RUNTIME_REGIONS_NOTE = (
    "Use a region that has a bedrock-runtime endpoint (for example us-east-1 or "
    "eu-central-1). Bedrock's runtime API is not available in af-south-1."
)

# The label the model returns when the photo is not one of the 15 known classes.
UNSUPPORTED_LABEL = "unsupported"


def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        return int(raw)
    except ValueError:
        print(f"[warn] {name}={raw!r} is not an integer - falling back to {default}")
        return default


def _env_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        return float(raw)
    except ValueError:
        print(f"[warn] {name}={raw!r} is not a number - falling back to {default}")
        return default


# ─── Errors ──────────────────────────────────────────────────────────────────
class DiagnosisError(Exception):
    """
    Provider failure carrying the HTTP status the API should return plus a
    message safe to show a farmer.
    """

    def __init__(self, status_code: int, message: str, user_message: str | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.user_message = user_message or (
            "We couldn't analyze this image right now. Please try again shortly."
        )


# ─── Image preparation ───────────────────────────────────────────────────────
def prepare_image(image_bytes: bytes, max_dim: int) -> bytes:
    """
    Normalise an uploaded photo into a JPEG suitable for Bedrock.

    Three things happen here, all of which matter:

    1. EXIF orientation is applied. Phone cameras almost always store the sensor
       image unrotated and record the real orientation in EXIF. Without this the
       model can receive a sideways or upside-down leaf.
    2. The longest edge is capped at `max_dim`. Nova rescales images internally
       anyway and bills per image token, and a modern phone photo is far larger
       than the model can use. Downscaling here cuts tokens, cost and latency.
    3. Everything is re-encoded as JPEG, which is one of the formats the Converse
       API accepts (png, jpeg, gif, webp).

    Raises DiagnosisError(422) if the bytes are not a readable image.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = ImageOps.exif_transpose(img)
        img = img.convert("RGB")
    except Exception as exc:
        raise DiagnosisError(
            422,
            f"Could not decode the uploaded image: {exc}",
            "That file doesn't look like a readable photo. Please try a JPEG or PNG.",
        ) from exc

    if max(img.size) > max_dim:
        img.thumbnail((max_dim, max_dim), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=88, optimize=True)
    return buf.getvalue()


# ─── Prompt ──────────────────────────────────────────────────────────────────
def _build_system_prompt() -> str:
    """
    Build the system prompt.

    The label list is generated from PLANTVILLAGE_CLASSES rather than written out
    by hand so it can never drift out of sync with the taxonomy module.
    """
    labels = "\n".join(f"  - {c}" for c in PLANTVILLAGE_CLASSES)
    return (
        "You are a plant pathologist examining a single photograph of a crop leaf.\n"
        "\n"
        "Choose exactly one label from this list. The labels are dataset identifiers "
        "and their underscores carry meaning (a crop/disease separator and "
        "sometimes a word separator), so copy the chosen label character for "
        "character:\n"
        f"{labels}\n"
        f"  - {UNSUPPORTED_LABEL}\n"
        "\n"
        "Rules:\n"
        "1. Base your answer only on what is visible in the image. Do not guess from "
        "the filename, the request text, or what is common in the region.\n"
        "2. If the leaf belongs to a crop that is not covered by the list, or the "
        "photo is too blurry, too dark, or does not clearly show a leaf, answer "
        f'"{UNSUPPORTED_LABEL}". A wrong confident answer is worse than saying the '
        "photo cannot be assessed.\n"
        "3. Several diseases look alike. Distinguish them by lesion shape, colour, "
        "margin and distribution rather than by which is most familiar.\n"
        "4. Reply with a single JSON object and nothing else. No markdown fences, no "
        "commentary before or after.\n"
        "\n"
        "The JSON object must have exactly these keys:\n"
        '  "label"       one of the labels above, or "unsupported"\n'
        '  "confidence"  integer 0-100 for how certain you are of the label\n'
        '  "reasoning"   one short sentence naming the visual evidence you used\n'
    )


def _clean_hint(value: str, limit: int) -> str:
    """
    Normalise a caller-supplied hint before it reaches the prompt.

    The hint is interpolated inside a quoted sentence, so drop the characters
    that would let it break out of those quotes, and cap the length so an
    oversized value cannot inflate the request. The hint is advisory only: the
    system prompt tells the model to follow the image over anything the caller
    claims, and the answer is still constrained to the taxonomy.
    """
    kept = "".join(ch for ch in value if ch.isalnum() or ch in " ,.-'()/")
    return " ".join(kept.split())[:limit]


def _build_user_prompt(crop: str | None, location: str | None) -> str:
    lines = ["Diagnose this leaf photograph."]
    if crop:
        hint = _clean_hint(crop, 64)
        if hint:
            lines.append(
                f'The user believes the crop is "{hint}". This is a hint only. If '
                "the image contradicts it, follow the image."
            )
    if location:
        hint = _clean_hint(location, 128)
        if hint:
            lines.append(f'It was photographed in "{hint}".')
    lines.append("Respond with the JSON object only.")
    return "\n".join(lines)


# ─── Response parsing ────────────────────────────────────────────────────────
_JSON_BLOCK = re.compile(r"\{.*\}", re.DOTALL)


def _extract_json_object(text: str) -> dict[str, Any]:
    """
    Pull a JSON object out of a model response.

    Prompted JSON is not schema-enforced — Amazon Nova does not yet support
    Bedrock's structured-output feature — so the response may arrive wrapped in
    markdown fences or padded with a sentence. Strip the obvious wrappers, then
    fall back to the outermost brace pair.
    """
    cleaned = text.strip()

    # Drop ```json ... ``` or ``` ... ``` fences.
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```[a-zA-Z]*\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)
        cleaned = cleaned.strip()

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed
    except json.JSONDecodeError:
        pass

    match = _JSON_BLOCK.search(cleaned)
    if match:
        try:
            parsed = json.loads(match.group(0))
            if isinstance(parsed, dict):
                return parsed
        except json.JSONDecodeError:
            pass

    raise DiagnosisError(
        502,
        f"Model did not return parseable JSON. Raw response: {text[:500]!r}",
        "We couldn't read the analysis result. Please try again.",
    )


def _coerce_confidence(raw: Any) -> float:
    """
    Turn whatever the model produced into a 0-100 float.

    The prompt asks for an integer 0-100, so "1" means one percent. Models
    sometimes ignore that and answer on a probability scale instead ("0.92").
    Only a value strictly between 0 and 1 is read as a probability. Note the
    strict inequality: treating 1 as a probability would turn a low-confidence
    "1" into a displayed 100%, which is the worst possible inversion on a
    diagnosis screen.
    """
    if isinstance(raw, bool):
        return 0.0
    if isinstance(raw, (int, float)):
        value = float(raw)
        if 0 < value < 1:
            value *= 100
        return round(max(0.0, min(100.0, value)), 1)
    if isinstance(raw, str):
        found = re.search(r"-?\d+(?:\.\d+)?", raw)
        if found:
            value = float(found.group(0))
            if 0 < value < 1:
                value *= 100
            return round(max(0.0, min(100.0, value)), 1)
    return 0.0


def _unsupported_result(confidence: float, reasoning: str) -> dict[str, Any]:
    """
    Build a result for a photo the taxonomy cannot classify.

    Uses the 'Needs attention' status, which is part of the frontend's status
    union and deliberately unused by the 15 disease classes, so the UI can
    distinguish "we could not assess this" from "this leaf is healthy".
    """
    note = reasoning.strip() or "The image did not clearly match a supported crop disease."
    return {
        "crop": "Unrecognised",
        "disease": "Unable to identify",
        "confidence": confidence,
        "severity": "Low",
        "status": "Needs attention",
        "recommendations": [
            "Retake the photo in natural daylight with a single leaf filling the frame.",
            "Smart Farmer currently recognises diseases of tomato, potato and bell pepper only.",
            "Maize, cassava, beans, banana, coffee and rice are not supported yet.",
            "For crops outside this list, consult your local agricultural extension officer.",
            f"What the model saw: {note}",
        ],
    }


# ─── Client (singleton) ──────────────────────────────────────────────────────
_client: Any = None
_client_signature: tuple[str, str | None] | None = None


def get_client(region: str, profile: str | None = None):
    """
    Return a cached bedrock-runtime client.

    Building a boto3 client is not free, so it is created once per (region,
    profile) pair and reused. Timeouts are set explicitly because botocore's
    default read timeout is short for an image-bearing request.
    """
    global _client, _client_signature

    signature = (region, profile)
    if _client is not None and _client_signature == signature:
        return _client

    session = boto3.Session(profile_name=profile) if profile else boto3.Session()
    _client = session.client(
        "bedrock-runtime",
        region_name=region,
        config=BotoConfig(
            connect_timeout=10,
            read_timeout=60,
            retries={"max_attempts": 3, "mode": "standard"},
        ),
    )
    _client_signature = signature
    return _client


def _resolve_config() -> dict[str, Any]:
    return {
        "region": os.getenv("AWS_REGION", DEFAULT_REGION).strip() or DEFAULT_REGION,
        "profile": (os.getenv("AWS_PROFILE") or "").strip() or None,
        "model_id": os.getenv("BEDROCK_MODEL_ID", DEFAULT_MODEL_ID).strip()
        or DEFAULT_MODEL_ID,
        "max_image_dim": _env_int("BEDROCK_MAX_IMAGE_DIM", DEFAULT_MAX_IMAGE_DIM),
        "max_tokens": _env_int("BEDROCK_MAX_TOKENS", DEFAULT_MAX_TOKENS),
        "temperature": _env_float("BEDROCK_TEMPERATURE", DEFAULT_TEMPERATURE),
    }


def check_credentials() -> tuple[bool, str]:
    """
    Best-effort startup check that credentials can be resolved at all.

    This deliberately does NOT make a network call, so it needs no IAM
    permissions beyond what the SDK uses to find credentials. It exists so the
    server can warn loudly at startup instead of failing on the user's first
    upload.
    """
    cfg = _resolve_config()
    try:
        session = (
            boto3.Session(profile_name=cfg["profile"])
            if cfg["profile"]
            else boto3.Session()
        )
        creds = session.get_credentials()
    except Exception as exc:  # noqa: BLE001 — surface any resolution failure as a warning
        return False, f"could not resolve AWS credentials: {exc}"

    if creds is None:
        return False, (
            "no AWS credentials found. Run `aws configure`, or set "
            "AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY, or attach an IAM role."
        )
    return True, "credentials resolved"


def startup() -> tuple[bool, str]:
    """
    Prepare the Bedrock provider. Called once by main.py at startup.

    This deliberately makes no network call. It only confirms that credentials
    can be resolved, so a misconfigured machine warns at boot instead of failing
    on the user's first upload. IAM permissions and model access are only truly
    proven by the first real request.
    """
    cfg = _resolve_config()
    ok, message = check_credentials()
    summary = (
        f"model={cfg['model_id']}, region={cfg['region']}, "
        f"max_image_dim={cfg['max_image_dim']}"
    )
    if ok:
        return True, f"{summary} ({message})"
    return False, f"{summary} - {message}"


def describe() -> dict[str, Any]:
    """Provider details for the health endpoint."""
    cfg = _resolve_config()
    return {
        "provider": "bedrock",
        "model": cfg["model_id"],
        "region": cfg["region"],
        "max_image_dim": cfg["max_image_dim"],
    }


# ─── Diagnosis ───────────────────────────────────────────────────────────────
def diagnose(
    image_bytes: bytes,
    crop_hint: str | None = None,
    location_hint: str | None = None,
) -> dict[str, Any]:
    """
    Diagnose a leaf photograph.

    Returns a dict matching the DiagnosisResult TypeScript interface:
        {crop, disease, confidence, severity, status, recommendations}

    Raises DiagnosisError, which carries both the HTTP status to return and a
    farmer-friendly message.
    """
    cfg = _resolve_config()

    prepared = prepare_image(image_bytes, cfg["max_image_dim"])

    try:
        client = get_client(cfg["region"], cfg["profile"])
    except BotoCoreError as exc:
        # BotoCoreError covers every client-construction failure: missing region,
        # missing credentials, and a bad AWS_PROFILE (ProfileNotFound), which is
        # a configuration error and must not surface as a 500.
        raise DiagnosisError(
            503,
            f"Bedrock client could not be created: {exc}",
            "The analysis service is not configured yet. Please try again shortly.",
        ) from exc

    try:
        response = client.converse(
            modelId=cfg["model_id"],
            system=[{"text": _build_system_prompt()}],
            messages=[
                {
                    "role": "user",
                    "content": [
                        # AWS documents image-then-text for Nova on the Converse API.
                        {
                            "image": {
                                "format": "jpeg",
                                "source": {"bytes": prepared},
                            }
                        },
                        {
                            "text": _build_user_prompt(crop_hint, location_hint)
                        },
                    ],
                }
            ],
            inferenceConfig={
                "maxTokens": cfg["max_tokens"],
                "temperature": cfg["temperature"],
            },
        )
    except ClientError as exc:
        raise _translate_client_error(exc, cfg["model_id"]) from exc
    except (NoCredentialsError, NoRegionError) as exc:
        raise DiagnosisError(
            503,
            f"AWS credentials or region unavailable: {exc}",
            "The analysis service is not configured yet. Please try again shortly.",
        ) from exc
    except BotoCoreError as exc:
        raise DiagnosisError(
            502,
            f"Could not reach Amazon Bedrock: {exc}",
            "We couldn't reach the analysis service. Please check your connection and try again.",
        ) from exc

    text = _read_text_block(response)

    payload = _extract_json_object(text)
    raw_label = str(payload.get("label", "")).strip()
    confidence = _coerce_confidence(payload.get("confidence"))
    reasoning = str(payload.get("reasoning", "")).strip()

    # The model is told to copy labels exactly, but a stray space or a lowercased
    # label should not fail the request.
    label = _match_label(raw_label)

    if label is None:
        if _normalise_label(raw_label).lower() == UNSUPPORTED_LABEL:
            return _unsupported_result(confidence, reasoning)
        # A label that is neither valid nor explicitly unsupported means the model
        # went off-script. Fall back to the unsupported path rather than inventing
        # a disease, and keep the raw value in the logs for debugging.
        print(
            f"[warn] Bedrock returned a label outside the taxonomy: "
            f"{raw_label!r}. Falling back to the unsupported result."
        )
        return _unsupported_result(confidence, reasoning)

    return {
        "crop": CROP_MAP[label],
        "disease": DISPLAY_NAMES[label],
        "confidence": confidence,
        "severity": SEVERITY_MAP[label],
        "status": STATUS_MAP[label],
        "recommendations": RECOMMENDATIONS[label],
    }


def _normalise_label(raw_label: str) -> str:
    """
    Strip the decoration a model adds when echoing a bulleted list.

    Removes surrounding whitespace, a leading bullet, and trailing punctuation.
    No taxonomy label starts or ends with any of these characters, so this is
    lossless for valid input.
    """
    candidate = raw_label.strip()
    candidate = candidate.lstrip("-•* \t").strip()
    return candidate.strip(".,;:!\"'`").strip()


def _match_label(raw_label: str) -> str | None:
    """
    Resolve a model-reported label to a taxonomy key.

    Tolerates the small formatting drift a model introduces when echoing a
    bulleted list, plus case differences. Still requires an exact match against
    the taxonomy after normalisation, so a misspelling yields None rather than
    the nearest label.
    """
    candidate = _normalise_label(raw_label)
    if candidate in PLANTVILLAGE_CLASSES:
        return candidate
    lowered = candidate.lower()
    for known in PLANTVILLAGE_CLASSES:
        if known.lower() == lowered:
            return known
    return None


def _read_text_block(response: dict[str, Any]) -> str:
    """
    Concatenate every text block in a Converse response.

    `content` is a list and Nova can emit more than one block, so reading
    content[0] directly is not safe.
    """
    try:
        blocks = response["output"]["message"]["content"]
    except (KeyError, TypeError) as exc:
        raise DiagnosisError(
            502,
            f"Unexpected Bedrock response shape: {response!r}",
            "We couldn't read the analysis result. Please try again.",
        ) from exc

    parts = [b["text"] for b in blocks if isinstance(b, dict) and "text" in b]
    text = "".join(parts).strip()
    if not text:
        raise DiagnosisError(
            502,
            f"Bedrock returned no text content: {response!r}",
            "We couldn't read the analysis result. Please try again.",
        )
    return text


def _translate_client_error(exc: ClientError, model_id: str) -> DiagnosisError:
    """Map a botocore ClientError onto an HTTP status and a useful message."""
    code = exc.response.get("Error", {}).get("Code", "Unknown")
    detail = exc.response.get("Error", {}).get("Message", str(exc))

    if code in ("AccessDeniedException", "UnauthorizedException"):
        return DiagnosisError(
            503,
            f"Bedrock denied access ({code}): {detail}. This usually means Bedrock "
            "model access has not been enabled for this account yet, or the IAM "
            "principal is missing bedrock:InvokeModel. Enabling model access also "
            "requires the aws-marketplace:Subscribe, aws-marketplace:Unsubscribe "
            "and aws-marketplace:ViewSubscriptions permissions.",
            "The analysis service isn't fully set up yet. Please try again shortly.",
        )
    if code in ("ThrottlingException", "TooManyRequestsException"):
        return DiagnosisError(
            429,
            f"Bedrock throttled the request: {detail}",
            "The analysis service is busy right now. Please try again in a moment.",
        )
    if code == "ValidationException":
        return DiagnosisError(
            400,
            f"Bedrock rejected the request ({model_id}): {detail}. Check that "
            "BEDROCK_MODEL_ID names a model that accepts image input — "
            "amazon.nova-micro-v1:0 is text only.",
            "We couldn't analyze this image. Please try a different photo.",
        )
    if code in ("ResourceNotFoundException", "ModelNotReadyException"):
        return DiagnosisError(
            503,
            f"Model {model_id} is not available in this region: {detail}. "
            + KNOWN_RUNTIME_REGIONS_NOTE,
            "The analysis service isn't fully set up yet. Please try again shortly.",
        )
    return DiagnosisError(
        502,
        f"Bedrock call failed ({code}): {detail}",
        "We couldn't analyze this image. Please try again shortly.",
    )
