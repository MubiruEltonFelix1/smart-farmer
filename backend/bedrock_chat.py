"""
bedrock_chat.py — conversational AI for the SmartFarmer farmer assistant.

Uses Amazon Bedrock (Amazon Nova) in text-only mode to power the in-app chat.
Nova Micro is the default: it is the cheapest Nova tier, handles text well,
and a farming Q&A session never needs image input.

The module exposes the same three-function interface as bedrock_inference.py so
main.py can treat both providers uniformly:

  startup()  -> (ready: bool, detail: str)
  describe() -> dict
  chat(messages, locale, system_override) -> str

Environment variables
─────────────────────
CHAT_MODEL_ID      Bedrock model to use for chat (default: amazon.nova-micro-v1:0)
CHAT_MAX_TOKENS    Token budget for each reply   (default: 600)
CHAT_TEMPERATURE   Sampling temperature          (default: 0.5 — conversational)

The AWS credential variables (AWS_REGION, AWS_PROFILE, AWS_ACCESS_KEY_ID,
AWS_SECRET_ACCESS_KEY) are shared with bedrock_inference.py and resolved by
the same boto3 credential chain.
"""

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

# ─── Config ──────────────────────────────────────────────────────────────────
DEFAULT_REGION       = "us-east-1"
# Nova Micro: text-only, cheapest, fast — perfect for Q&A chat.
# Switch to amazon.nova-lite-v1:0 or amazon.nova-pro-v1:0 for richer replies.
DEFAULT_CHAT_MODEL   = "amazon.nova-micro-v1:0"
DEFAULT_MAX_TOKENS   = 600
DEFAULT_TEMPERATURE  = 0.5   # some variation keeps replies natural

# ─── SmartFarmer system prompt ────────────────────────────────────────────────
# Gives the model its role, hard limits, and the agricultural context it needs.
# Keep it tight: every token here is billed on every request.
SMARTFARMER_SYSTEM_PROMPT = """You are SmartFarmer AI, a helpful conversational assistant \
built for smallholder farmers in Uganda and East Africa.

Your job:
- Give helpful answers to the user's questions across a broad range of \
topics. Use your farming expertise for questions about crop diseases, pest \
control, planting, weather, soil management, and post-harvest handling.
- Give clear, actionable answers. Keep replies concise by default, but provide \
more detail when the user asks for it or the question requires it.
- Be culturally appropriate and use examples relevant to Uganda (matooke, \
cassava, maize, coffee, tomato, Irish potato, rice).
- When the farmer writes in Luganda or Runyankole, reply in the same language. \
If you are unsure of the language, reply in English.
- Do not assume every question is about farming. Answer general questions \
normally and ask a clarifying question when the user's request is ambiguous.

Hard limits:
- Never claim to be a human, doctor, or emergency service.
- Do not give specific pesticide dosages unless you know the exact product, \
crop, and local label. Instead say "follow the label dosage" and name the \
active ingredient.
- For high-risk disease outbreaks affecting more than 20 % of a farm, always \
recommend the farmer contacts their local agricultural extension officer.
- Do not provide instructions that could cause serious harm. For medical, \
legal, financial, or other high-stakes questions, provide general information \
and recommend consulting a qualified local professional.

If you cannot answer confidently, say so. For farming questions, suggest the \
farmer consults their district extension officer or the nearest NAADS office \
when appropriate."""


# ─── Errors ──────────────────────────────────────────────────────────────────
class ChatError(Exception):
    """
    Chat failure carrying the HTTP status to return and a message safe to
    display in the farmer's UI.
    """

    def __init__(self, status_code: int, message: str, user_message: str | None = None):
        super().__init__(message)
        self.status_code  = status_code
        self.message      = message
        self.user_message = user_message or (
            "Sorry, I couldn't respond right now. Please try again."
        )


# ─── Config helpers ───────────────────────────────────────────────────────────
def _env_int(name: str, default: int) -> int:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        return int(raw)
    except ValueError:
        print(f"[warn] {name}={raw!r} is not an integer — falling back to {default}")
        return default


def _env_float(name: str, default: float) -> float:
    raw = os.getenv(name)
    if raw is None or raw.strip() == "":
        return default
    try:
        return float(raw)
    except ValueError:
        print(f"[warn] {name}={raw!r} is not a number — falling back to {default}")
        return default


def _resolve_config() -> dict[str, Any]:
    return {
        "region":      os.getenv("AWS_REGION",      DEFAULT_REGION).strip() or DEFAULT_REGION,
        "profile":     (os.getenv("AWS_PROFILE") or "").strip() or None,
        "model_id":    os.getenv("CHAT_MODEL_ID",   DEFAULT_CHAT_MODEL).strip() or DEFAULT_CHAT_MODEL,
        "max_tokens":  _env_int(  "CHAT_MAX_TOKENS", DEFAULT_MAX_TOKENS),
        "temperature": _env_float("CHAT_TEMPERATURE", DEFAULT_TEMPERATURE),
    }


# ─── Boto3 client (singleton per region+profile) ─────────────────────────────
_client: Any = None
_client_sig: tuple[str, str | None] | None = None


def _get_client(region: str, profile: str | None = None):
    global _client, _client_sig
    sig = (region, profile)
    if _client is not None and _client_sig == sig:
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
    _client_sig = sig
    return _client


# ─── Startup / describe ───────────────────────────────────────────────────────
def startup() -> tuple[bool, str]:
    """
    Check that AWS credentials can be resolved. No network call — same
    conservative approach as bedrock_inference.py.
    """
    cfg = _resolve_config()
    try:
        session = (
            boto3.Session(profile_name=cfg["profile"])
            if cfg["profile"]
            else boto3.Session()
        )
        creds = session.get_credentials()
    except Exception as exc:  # noqa: BLE001
        return False, f"could not resolve AWS credentials: {exc}"

    if creds is None:
        return False, (
            "no AWS credentials found. Run `aws configure` or set "
            "AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY."
        )

    summary = (
        f"chat_model={cfg['model_id']}, region={cfg['region']}, "
        f"max_tokens={cfg['max_tokens']}"
    )
    return True, f"{summary} (credentials resolved)"


def describe() -> dict[str, Any]:
    cfg = _resolve_config()
    return {
        "provider":   "bedrock-chat",
        "chat_model": cfg["model_id"],
        "region":     cfg["region"],
        "max_tokens": cfg["max_tokens"],
    }


# ─── Main chat function ───────────────────────────────────────────────────────
def chat(
    messages: list[dict[str, str]],
    locale: str = "en",
    system_override: str | None = None,
) -> str:
    """
    Send a conversation to Bedrock and return the assistant's reply as a string.

    Parameters
    ----------
    messages : list of {"role": "user"|"assistant", "content": str}
        The full conversation history in Bedrock Converse format.  The caller
        is responsible for keeping this under the model's context window.
        A maximum of 40 turns (80 messages) is enforced here as a safety cap.
    locale : str
        The farmer's preferred language ("en", "lg", "nyn"). This is appended
        to the system prompt so the model knows which language to respond in
        when the farmer's message is ambiguous.
    system_override : str | None
        Replaces the default SMARTFARMER_SYSTEM_PROMPT entirely. Intended for
        testing only.

    Returns
    -------
    str
        The assistant's reply text, ready to render in the chat UI.

    Raises
    ------
    ChatError
        On any Bedrock or credential failure. Carries status_code and
        user_message safe to show the farmer.
    """
    cfg = _resolve_config()

    # ── Validate / truncate history ──────────────────────────────────────────
    # Keep the most recent 40 turns (80 messages) to stay inside context limits.
    MAX_TURNS = 40
    if len(messages) > MAX_TURNS * 2:
        messages = messages[-(MAX_TURNS * 2):]

    # Bedrock Converse requires alternating user/assistant roles, starting with user.
    # Filter out any system-role messages that may have come from the frontend.
    converse_messages = [
        {"role": m["role"], "content": [{"text": m["content"]}]}
        for m in messages
        if m.get("role") in ("user", "assistant") and m.get("content", "").strip()
    ]

    if not converse_messages or converse_messages[0]["role"] != "user":
        raise ChatError(400, "Conversation must start with a user message.", "Please send a message first.")

    # ── Build system prompt ───────────────────────────────────────────────────
    system_text = system_override or SMARTFARMER_SYSTEM_PROMPT

    # Append language hint so the model knows what to do with ambiguous input.
    LANG_HINTS = {
        "lg":  "\n\nThe farmer is using the app in Luganda. When they write in Luganda, reply in Luganda.",
        "nyn": "\n\nThe farmer is using the app in Runyankole. When they write in Runyankole, reply in Runyankole.",
    }
    system_text += LANG_HINTS.get(locale, "")

    # ── Call Bedrock ──────────────────────────────────────────────────────────
    try:
        client = _get_client(cfg["region"], cfg["profile"])
    except BotoCoreError as exc:
        raise ChatError(
            503,
            f"Bedrock client could not be created: {exc}",
            "The assistant service is not configured yet. Please try again shortly.",
        ) from exc

    try:
        response = client.converse(
            modelId=cfg["model_id"],
            system=[{"text": system_text}],
            messages=converse_messages,
            inferenceConfig={
                "maxTokens":   cfg["max_tokens"],
                "temperature": cfg["temperature"],
            },
        )
    except ClientError as exc:
        raise _translate_client_error(exc, cfg["model_id"]) from exc
    except (NoCredentialsError, NoRegionError) as exc:
        raise ChatError(
            503,
            f"AWS credentials or region unavailable: {exc}",
            "The assistant service is not configured yet. Please try again shortly.",
        ) from exc
    except BotoCoreError as exc:
        raise ChatError(
            502,
            f"Could not reach Amazon Bedrock: {exc}",
            "Couldn't reach the assistant. Check your connection and try again.",
        ) from exc

    # ── Extract reply text ────────────────────────────────────────────────────
    try:
        blocks = response["output"]["message"]["content"]
        parts  = [b["text"] for b in blocks if isinstance(b, dict) and "text" in b]
        text   = "".join(parts).strip()
    except (KeyError, TypeError) as exc:
        raise ChatError(
            502,
            f"Unexpected Bedrock response shape: {response!r}",
            "Couldn't read the assistant's reply. Please try again.",
        ) from exc

    if not text:
        raise ChatError(
            502,
            "Bedrock returned an empty reply.",
            "The assistant didn't respond. Please try again.",
        )

    return text


# ─── Error translation ────────────────────────────────────────────────────────
def _translate_client_error(exc: ClientError, model_id: str) -> ChatError:
    code   = exc.response.get("Error", {}).get("Code",    "Unknown")
    detail = exc.response.get("Error", {}).get("Message", str(exc))

    if code in ("AccessDeniedException", "UnauthorizedException"):
        return ChatError(
            503,
            f"Bedrock denied access ({code}): {detail}. Enable model access in the "
            "AWS console and ensure the IAM role has bedrock:InvokeModel.",
            "The assistant service isn't set up yet. Please try again shortly.",
        )
    if code in ("ThrottlingException", "TooManyRequestsException"):
        return ChatError(
            429,
            f"Bedrock throttled the request: {detail}",
            "The assistant is busy right now. Please try again in a moment.",
        )
    if code == "ValidationException":
        return ChatError(
            400,
            f"Bedrock rejected the request ({model_id}): {detail}",
            "Couldn't send your message. Please try again.",
        )
    if code in ("ResourceNotFoundException", "ModelNotReadyException"):
        return ChatError(
            503,
            f"Chat model {model_id} is not available: {detail}",
            "The assistant service isn't set up yet. Please try again shortly.",
        )
    return ChatError(
        502,
        f"Bedrock chat failed ({code}): {detail}",
        "The assistant couldn't respond right now. Please try again shortly.",
    )
