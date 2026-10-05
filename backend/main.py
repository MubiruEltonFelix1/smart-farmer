"""
main.py — FastAPI server for Kebeera crop disease diagnosis.

Endpoints:
  POST /api/v1/diagnose   — accepts a leaf image, returns DiagnosisResult JSON
  GET  /api/v1/health     — liveness check plus the active diagnosis provider

The diagnosis engine is pluggable and selected with DIAGNOSIS_PROVIDER:

  bedrock (default)  calls Amazon Bedrock (Amazon Nova) — no local model, no GPU
  onnx               runs a local .onnx file — see requirements-onnx.txt

Both providers are held to the same interface so this file does not care which
one is active:
  startup()  -> (ready: bool, detail: str)
  describe() -> dict
  diagnose(image_bytes, crop_hint, location_hint) -> dict

Run locally:
  cd backend
  uvicorn main:app --reload --port 8000
"""

import base64
import importlib
import os
import secrets
import sys
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

# Windows consoles default to a legacy code page (cp1252 in most locales). A log
# line containing any character outside that code page would raise
# UnicodeEncodeError and take the process down, which is a nasty way to lose a
# server to a stray emoji, so make both streams tolerant before anything prints.
for _stream in (sys.stdout, sys.stderr):
    try:
        _stream.reconfigure(errors="replace")
    except (AttributeError, ValueError):  # not a TextIOWrapper, or already detached
        pass

load_dotenv(Path(__file__).resolve().with_name(".env"))

# ─── Config ──────────────────────────────────────────────────────────────────
PROVIDER_NAME = os.getenv("DIAGNOSIS_PROVIDER", "bedrock").strip().lower() or "bedrock"
KNOWN_PROVIDERS = {"bedrock": "bedrock_inference", "onnx": "inference"}

# Origins allowed to call the API.
# In production replace this with your actual frontend domain.
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:4173",
).split(",")
ALLOWED_ORIGIN_REGEX = os.getenv(
    "ALLOWED_ORIGIN_REGEX",
    r"https://[a-zA-Z0-9-]+\.vercel\.app",
).strip() or None

MAX_BYTES = 10 * 1024 * 1024  # 10 MB

# Max characters accepted in a single chat message from the frontend.
# Long enough for a detailed question; short enough to stop prompt-stuffing.
MAX_CHAT_MSG_CHARS = 2000
# Max number of messages the frontend may send per request (full history).
MAX_CHAT_HISTORY   = 80  # 40 turns × 2

# ─── API key ─────────────────────────────────────────────────────────────────
# A shared secret required on /api/v1/diagnose. Leave it unset and the check is
# skipped, so local development needs no configuration.
#
# Be clear-eyed about what this does and does not buy you. The frontend ships the
# key inside its JavaScript bundle, so anyone who reads the bundle can extract
# it. It therefore stops URL-pasting, scanners and drive-by abuse; it does not
# stop a determined person. The real ceilings on cost are Lambda reserved
# concurrency and API Gateway throttling, not this.
#
# Genuine authentication is not possible here without users to authenticate
# against. If the product grows a login, replace this with Cognito or another
# OIDC provider.
API_KEY = os.getenv("API_KEY", "").strip()

# auto_error=False so the handler below decides the response, rather than
# FastAPI returning its own shape before our code runs. Declaring it as a
# security scheme also gives the /docs page an Authorize button, which is how
# you will test this endpoint by hand.
_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def require_api_key(key: str | None = Depends(_api_key_header)) -> None:
    """
    FastAPI dependency enforcing the shared-secret header, when one is configured.

    compare_digest is used rather than == so the comparison takes the same time
    regardless of how many leading characters match, which avoids leaking the
    key one byte at a time through response timing.
    """
    if not API_KEY:
        return  # not configured: open, which is the local development default
    if not key or not secrets.compare_digest(key, API_KEY):
        raise HTTPException(
            status_code=401,
            detail="Invalid or missing API key.",
            headers={"WWW-Authenticate": "ApiKey"},
        )


def _load_provider():
    """
    Import the configured provider module.

    Imports are deferred so that choosing Bedrock never requires onnxruntime to
    be installed, and choosing ONNX never requires boto3.
    """
    module_name = KNOWN_PROVIDERS.get(PROVIDER_NAME)
    if module_name is None:
        raise RuntimeError(
            f"DIAGNOSIS_PROVIDER={PROVIDER_NAME!r} is not recognised. "
            f"Valid values: {', '.join(sorted(KNOWN_PROVIDERS))}."
        )
    try:
        return importlib.import_module(module_name)
    except ImportError as exc:
        raise RuntimeError(
            f"DIAGNOSIS_PROVIDER={PROVIDER_NAME!r} needs the {module_name!r} module, "
            f"but it could not be imported: {exc}. Install the matching requirements "
            "file in backend/."
        ) from exc


# ─── Lifespan: prepare the provider once at startup ──────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.provider_name = PROVIDER_NAME
    app.state.provider = None
    app.state.ready = False
    app.state.detail = "provider has not started yet"

    # ── Diagnosis provider ────────────────────────────────────────────────────
    try:
        module = _load_provider()
    except RuntimeError as exc:
        app.state.detail = str(exc)
        print(f"\n[warn] {exc}\n   Starting anyway so /api/v1/health can report it.\n")
        yield
        return

    app.state.provider = module

    ready, detail = module.startup()
    app.state.ready = ready
    app.state.detail = detail

    if ready:
        print(f"[ok] Diagnosis provider '{PROVIDER_NAME}' ready - {detail}")
    else:
        print(
            f"\n[warn] Diagnosis provider '{PROVIDER_NAME}' is not ready - {detail}"
            "\n   The server will start, but /api/v1/diagnose will return 503."
            "\n   See backend/.env.example for the configuration this needs.\n"
        )

    # ── Chat provider (bedrock_chat or mock_chat) ─────────────────────────────
    # Prefer the mock provider for local development when explicitly enabled.
    # Otherwise, still fall back gracefully if AWS credentials/config are missing
    # so the assistant remains usable without a full Bedrock setup.
    try:
        use_mock_chat = os.getenv("ENABLE_MOCK_CHAT", "").strip().lower() in ("1", "true", "yes")

        if use_mock_chat:
            import mock_chat as _chat_module  # noqa: PLC0415
            chat_ready, chat_detail = _chat_module.startup()
            app.state.chat_module = _chat_module
            app.state.chat_ready = chat_ready
            app.state.chat_detail = chat_detail
            if chat_ready:
                print("[ok] Chat provider ready - mock chat fallback enabled")
            else:
                print(f"\n[warn] Mock chat provider is not ready - {chat_detail}\n")
        else:
            import bedrock_chat as _chat_module  # noqa: PLC0415
            chat_ready, chat_detail = _chat_module.startup()
            if chat_ready:
                app.state.chat_module = _chat_module
                app.state.chat_ready = True
                app.state.chat_detail = chat_detail
                print(f"[ok] Chat provider ready - {chat_detail}")
            else:
                import mock_chat as _fallback_module  # noqa: PLC0415
                fallback_ready, fallback_detail = _fallback_module.startup()
                app.state.chat_module = _fallback_module
                app.state.chat_ready = fallback_ready
                app.state.chat_detail = (
                    f"Bedrock chat unavailable ({chat_detail}); using mock chat fallback."
                )
                print(
                    f"\n[warn] Bedrock chat is not ready - {chat_detail}\n"
                    f"   Falling back to local mock chat. ({fallback_detail})\n"
                )
    except ImportError as exc:
        app.state.chat_module = None
        app.state.chat_ready = False
        app.state.chat_detail = f"chat module could not be imported: {exc}"
        print(f"\n[warn] Chat module unavailable: {exc}\n")

    yield
    # nothing to tear down


# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Kebeera — Crop Diagnosis API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ─── Health ──────────────────────────────────────────────────────────────────
@app.get("/api/v1/health")
def health():
    provider = app.state.provider
    diag_details = provider.describe() if provider is not None else {"provider": PROVIDER_NAME}

    chat_module  = getattr(app.state, "chat_module", None)
    chat_details = chat_module.describe() if chat_module is not None else {"provider": "bedrock-chat"}

    return {
        "status": "ok" if app.state.ready else "degraded",
        "ready":  app.state.ready,
        "detail": app.state.detail,
        "chat_ready":  getattr(app.state, "chat_ready",  False),
        "chat_detail": getattr(app.state, "chat_detail", "not initialised"),
        **diag_details,
        "chat": chat_details,
    }


# ─── Diagnose ────────────────────────────────────────────────────────────────
# /api/v1/health is deliberately left open so uptime checks and your own
# "is it deployed?" checks work without the key. It reveals nothing sensitive.
@app.post("/api/v1/diagnose", dependencies=[Depends(require_api_key)])
async def diagnose(
    image: UploadFile | None = File(default=None),
    image_b64: str | None = Form(default=None),
    # max_length keeps an oversized or hostile hint out of the model prompt.
    # Values are also sanitised again in the provider before interpolation.
    crop: str | None = Form(default=None, max_length=64),        # cropHint from the frontend
    location: str | None = Form(default=None, max_length=128),   # locationHint from the frontend
):
    """
    Accept a leaf image and return a diagnosis.

    The frontend (diagnosisService.ts) sends the image as a base64 data URL in
    the `image_b64` form field. This endpoint also accepts a multipart file
    upload in the `image` field so the API stays usable from curl and other
    clients.

    Returns JSON matching the DiagnosisResult TypeScript interface.
    """
    provider = app.state.provider
    if provider is None:
        raise HTTPException(status_code=503, detail=app.state.detail)

    # ── Read raw image bytes ─────────────────────────────────────────────────
    image_bytes: bytes | None = None

    # Case 1: frontend sends a base64 data URL as a plain form string
    if image_b64:
        try:
            # strip a "data:image/jpeg;base64," prefix if present
            b64_data = image_b64.split(",")[-1]
            image_bytes = base64.b64decode(b64_data, validate=False)
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid base64 image data.")

    # Case 2: multipart file upload
    elif image and image.filename:
        image_bytes = await image.read()

    else:
        raise HTTPException(
            status_code=422,
            detail="No image provided. Send an image file or a base64 data URL.",
        )

    # ── Validate size (10 MB) ────────────────────────────────────────────────
    if len(image_bytes) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit.")

    # ── Run the diagnosis ────────────────────────────────────────────────────
    # Both providers are synchronous and block for the length of a network round
    # trip (Bedrock) or a forward pass (ONNX). Calling them directly from this
    # async endpoint would stall the event loop and serialise every other
    # request behind it, so hand the work to the threadpool.
    try:
        return await run_in_threadpool(
            provider.diagnose,
            image_bytes,
            crop_hint=crop,
            location_hint=location,
        )
    except Exception as exc:
        # Providers raise typed errors carrying the HTTP status to return and a
        # message that is safe to show a farmer. Anything without a status_code
        # is a bug here, so it becomes a 500 rather than leaking a traceback.
        status_code = getattr(exc, "status_code", None)
        if status_code is not None:
            print(f"[warn] Diagnosis failed ({status_code}): {exc}")
            raise HTTPException(
                status_code=status_code,
                detail=getattr(exc, "user_message", "Analysis failed."),
            ) from exc

        print(f"[error] Unexpected diagnosis failure: {exc!r}")
        raise HTTPException(
            status_code=500,
            detail="Analysis failed unexpectedly. Please try again.",
        ) from exc


# ─── Chat request / response models ──────────────────────────────────────────
class ChatMessageIn(BaseModel):
    """A single turn in the conversation history sent by the frontend."""
    role:    Literal["user", "assistant"]
    content: str = Field(..., max_length=MAX_CHAT_MSG_CHARS)


class ChatRequest(BaseModel):
    """
    Body for POST /api/v1/chat.

    `messages` is the full conversation history (newest last), matching the
    ChatMessage[] shape used by AssistantPage.tsx.  The backend appends nothing
    to it — the caller is the source of truth for history.

    `locale` tells the model which language to prefer when the farmer's message
    is ambiguous (en / lg / nyn).
    """
    messages: list[ChatMessageIn] = Field(..., min_length=1, max_length=MAX_CHAT_HISTORY)
    locale:   str                  = Field(default="en", max_length=8)


class ChatResponse(BaseModel):
    reply: str


# ─── Chat ─────────────────────────────────────────────────────────────────────
@app.post("/api/v1/chat", response_model=ChatResponse, dependencies=[Depends(require_api_key)])
async def chat_endpoint(body: ChatRequest):
    """
    Accept a conversation history and return the next assistant reply.

    The frontend sends the full message history on every turn so the model has
    context.  This endpoint is stateless: it does not store anything — history
    lives in the frontend (AssistantPage state + mockAuthService).

    Returns JSON: { "reply": "<assistant text>" }
    """
    chat_module = getattr(app.state, "chat_module", None)
    if chat_module is None:
        raise HTTPException(
            status_code=503,
            detail=getattr(app.state, "chat_detail", "Chat module is not available."),
        )

    if not getattr(app.state, "chat_ready", False):
        raise HTTPException(
            status_code=503,
            detail=getattr(app.state, "chat_detail", "Chat service is not ready yet."),
        )

    # Sanitise locale to the three supported values; fall back to English.
    locale = body.locale.strip().lower()
    if locale not in ("en", "lg", "nyn"):
        locale = "en"

    messages = [{"role": m.role, "content": m.content} for m in body.messages]

    try:
        reply = await run_in_threadpool(chat_module.chat, messages, locale)
    except Exception as exc:
        status_code  = getattr(exc, "status_code",  None)
        user_message = getattr(exc, "user_message", None)

        if status_code is not None:
            print(f"[warn] Chat failed ({status_code}): {exc}")
            raise HTTPException(
                status_code=status_code,
                detail=user_message or "Chat failed.",
            ) from exc

        print(f"[error] Unexpected chat failure: {exc!r}")
        raise HTTPException(
            status_code=500,
            detail="The assistant couldn't respond right now. Please try again.",
        ) from exc

    return ChatResponse(reply=reply)
