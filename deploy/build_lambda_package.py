"""
build_lambda_package.py — build the AWS Lambda deployment zip.

Produces deploy/build/smart-farmer-lambda.zip, ready to hand to
deploy/deploy_backend.py.

Why this exists rather than a plain `pip install -r` + zip:

  * Lambda runs Linux. This machine is Windows. Installing normally would bundle
    .pyd Windows binaries that fail to import at runtime with a confusing error.
    So dependencies are fetched as manylinux wheels, cross-platform.
  * Only the application modules that belong on Lambda are copied. Everything is
    listed explicitly rather than globbed, so a stray .env or a test file cannot
    silently end up inside a published artifact.
  * The result is verified before you ship it: the script asserts the bundle
    contains Linux shared objects, contains no Windows binaries, and actually
    holds every module the handler imports.

Run from anywhere:

    python deploy/build_lambda_package.py

Options:
    --arch x86_64|arm64    Lambda CPU architecture (default x86_64)
    --python 3.12          Lambda runtime version (default 3.12)
"""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

# A Windows console on a legacy code page raises UnicodeEncodeError on any
# character outside it. Same guard as backend/main.py, for the same reason.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(errors="replace")
    except (AttributeError, ValueError):
        pass

# ─── Paths ───────────────────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
BACKEND_DIR = REPO_ROOT / "backend"

BUILD_DIR = SCRIPT_DIR / "build"
PACKAGE_DIR = BUILD_DIR / "package"
ZIP_PATH = BUILD_DIR / "smart-farmer-lambda.zip"

REQUIREMENTS = BACKEND_DIR / "requirements-lambda.txt"

# Application modules that go into the package.
#
# inference.py is included even though the ONNX dependencies are not, and it can
# therefore never actually run on Lambda. main.py imports providers lazily, so it
# is never loaded unless DIAGNOSIS_PROVIDER=onnx, in which case the error message
# explains what is missing. Shipping it keeps the deployed tree identical to the
# local one, which is easier to reason about than a package that differs.
APP_MODULES = [
    "main.py",
    "lambda_handler.py",
    "bedrock_inference.py",
    "inference.py",
    "taxonomy.py",
]

# Requirements for an import to succeed at runtime. If any of these is missing
# from the zip, the handler fails on the first invocation rather than at build
# time, which is a much worse place to find out.
REQUIRED_IN_ZIP = [
    "main.py",
    "lambda_handler.py",
    "bedrock_inference.py",
    "taxonomy.py",
    "PIL/Image.py",
    "pydantic/__init__.py",
    "fastapi/__init__.py",
    "starlette/__init__.py",
    "mangum/__init__.py",
    "botocore/__init__.py",
    "boto3/__init__.py",
]

# Manylinux platform tag per Lambda architecture.
PLATFORM_TAGS = {
    "x86_64": "manylinux2014_x86_64",
    "arm64": "manylinux2014_aarch64",
}


def log(message: str) -> None:
    print(f"[build] {message}", flush=True)


def fail(message: str) -> None:
    print(f"\n[build] FAILED: {message}", file=sys.stderr, flush=True)
    sys.exit(1)


def clean() -> None:
    """Remove any previous build so stale artefacts cannot leak into the zip."""
    if BUILD_DIR.exists():
        log(f"clearing {BUILD_DIR.relative_to(REPO_ROOT)}")
        shutil.rmtree(BUILD_DIR)
    PACKAGE_DIR.mkdir(parents=True, exist_ok=True)
    BUILD_DIR.mkdir(parents=True, exist_ok=True)


def install_dependencies(arch: str, python_version: str) -> None:
    """
    Install the runtime dependencies as Linux wheels into the package directory.

    --only-binary=:all: is the important flag: it refuses to fall back to a
    source distribution, so a package without a manylinux wheel fails loudly
    here instead of producing a broken bundle.
    """
    platform_tag = PLATFORM_TAGS[arch]
    if not REQUIREMENTS.is_file():
        fail(f"requirements file not found: {REQUIREMENTS}")

    log(f"installing dependencies as {platform_tag} wheels for python {python_version}")

    cmd = [
        sys.executable, "-m", "pip", "install",
        "--quiet",
        "--disable-pip-version-check",
        "--target", str(PACKAGE_DIR),
        "--platform", platform_tag,
        "--python-version", python_version,
        "--only-binary=:all:",
        "--upgrade",
        "-r", str(REQUIREMENTS),
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print(result.stdout)
        print(result.stderr, file=sys.stderr)
        fail(
            "pip could not resolve Linux wheels for every dependency. A package "
            "in requirements-lambda.txt probably has no manylinux build."
        )


def copy_application_code() -> None:
    """Copy the application modules to the package root."""
    for module in APP_MODULES:
        source = BACKEND_DIR / module
        if not source.is_file():
            fail(f"expected application module is missing: {source}")
        shutil.copy2(source, PACKAGE_DIR / module)
    log(f"copied {len(APP_MODULES)} application modules")


def prune_junk() -> None:
    """
    Strip bytecode caches and pip metadata that serve no purpose at runtime.

    __pycache__ directories are removed because Lambda compiles the modules on
    cold start regardless, and they only inflate the download.
    """
    removed = 0
    for cache in PACKAGE_DIR.rglob("__pycache__"):
        if cache.is_dir():
            shutil.rmtree(cache, ignore_errors=True)
            removed += 1
    if removed:
        log(f"pruned {removed} __pycache__ directories")


def verify_bundle() -> None:
    """
    Prove the bundle is a Linux bundle before it is zipped.

    This is the check that catches the single most common packaging mistake, and
    it is much cheaper to fail here than after a deployment.
    """
    windows_binaries = list(PACKAGE_DIR.rglob("*.pyd"))
    if windows_binaries:
        names = ", ".join(str(p.relative_to(PACKAGE_DIR)) for p in windows_binaries[:5])
        fail(
            f"bundle contains Windows extension modules ({names}). "
            "Dependencies were not installed for Linux."
        )

    shared_objects = list(PACKAGE_DIR.rglob("*.so"))
    if not shared_objects:
        fail(
            "bundle contains no Linux shared objects (.so). The compiled "
            "dependencies (pydantic-core, Pillow) are missing or wrong."
        )

    for required in REQUIRED_IN_ZIP:
        if not (PACKAGE_DIR / required).exists():
            fail(f"bundle is missing a module the handler needs at runtime: {required}")

    log(f"verified: {len(shared_objects)} Linux shared objects, 0 Windows binaries")


def write_zip() -> None:
    """
    Zip the package with its contents at the archive root.

    Root-level layout matters: it is what makes the Lambda handler string
    'lambda_handler.handler' resolve.
    """
    with zipfile.ZipFile(ZIP_PATH, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(PACKAGE_DIR.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(PACKAGE_DIR))
    log(f"wrote {ZIP_PATH.relative_to(REPO_ROOT)}")


def report() -> None:
    unzipped = sum(f.stat().st_size for f in PACKAGE_DIR.rglob("*") if f.is_file())
    zipped = ZIP_PATH.stat().st_size

    print()
    print(f"  unzipped : {unzipped / 1_048_576:8.1f} MB   (Lambda limit 250 MB)")
    print(f"  zipped   : {zipped / 1_048_576:8.1f} MB   (direct upload limit 50 MB)")
    print(f"  file     : {ZIP_PATH}")
    print()
    print("  next: python deploy/deploy_backend.py --check")


def main() -> None:
    parser = argparse.ArgumentParser(description="Build the Lambda deployment zip.")
    parser.add_argument("--arch", choices=sorted(PLATFORM_TAGS), default="x86_64")
    parser.add_argument("--python", dest="python_version", default="3.12")
    args = parser.parse_args()

    print()
    log(f"repo root: {REPO_ROOT}")
    clean()
    install_dependencies(args.arch, args.python_version)
    copy_application_code()
    prune_junk()
    verify_bundle()
    write_zip()
    report()


if __name__ == "__main__":
    main()
