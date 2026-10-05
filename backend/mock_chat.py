"""
mock_chat.py — a tiny local chat provider for development.

This module implements the same interface expected by `main.py` so the
frontend chat UI can be exercised without Amazon Bedrock credentials.

Enable it by setting `ENABLE_MOCK_CHAT=1` in `backend/.env` (or the
environment). It's intentionally simple and synchronous.
"""

from typing import Any


def startup() -> tuple[bool, str]:
    return True, "mock chat provider ready"


def describe() -> dict[str, Any]:
    return {
        "provider": "mock-chat",
        "chat_model": "mock-model",
        "region": "local",
        "max_tokens": 64,
    }


def chat(messages: list[dict[str, str]], locale: str = "en", system_override: str | None = None) -> str:
    # Simple behaviour: reply with a friendly note and echo the last user message.
    last_user = None
    for m in reversed(messages):
        if m.get("role") == "user" and m.get("content", "").strip():
            last_user = m.get("content")
            break

    if not last_user:
        return "Hello — this is a local mock assistant. Send a message and I'll echo it back."

    return f"[mock reply] I received: {last_user}"
