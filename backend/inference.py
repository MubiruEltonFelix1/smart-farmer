"""
inference.py — optional local ONNX provider for Kebeera crop diagnosis.

This is NOT the default engine. The default is Amazon Bedrock, which needs no
local model at all. Use this module only when you have an exported model file and
want to run inference on this machine:

    DIAGNOSIS_PROVIDER=onnx

It loads a `.onnx` model (produced by backend/train/train.py), preprocesses the
leaf image exactly the way training did, runs the forward pass, and maps the
winning class onto the shared taxonomy.

Requires the extra dependencies in backend/requirements-onnx.txt, which are NOT
needed for the default Bedrock path:

    pip install -r backend/requirements-onnx.txt

The class labels, display names and agronomic recommendations all live in
taxonomy.py so the two providers can never disagree about them.
"""

import io
import os
from pathlib import Path
from typing import Any

import numpy as np
import onnxruntime as ort
from PIL import Image

from taxonomy import (
    CROP_MAP,
    DISPLAY_NAMES,
    PLANTVILLAGE_CLASSES,
    RECOMMENDATIONS,
    SEVERITY_MAP,
    STATUS_MAP,
)

# ─── Config ──────────────────────────────────────────────────────────────────
# Defaults to <backend>/model/plantvillage.onnx, resolved relative to this file
# so it does not matter which directory uvicorn is launched from. A relative
# MODEL_PATH taken from the environment is resolved against the current working
# directory instead, which is what a caller setting it would expect.
DEFAULT_MODEL_PATH = str(Path(__file__).parent / "model" / "plantvillage.onnx")


class OnnxProviderError(Exception):
    """
    Provider failure carrying the HTTP status the API should return plus a
    message safe to show a farmer. Mirrors the Bedrock provider's contract so
    main.py can treat both identically.
    """

    def __init__(self, status_code: int, message: str, user_message: str | None = None):
        super().__init__(message)
        self.status_code = status_code
        self.message = message
        self.user_message = user_message or (
            "We couldn't analyze this image right now. Please try again shortly."
        )


# ─── Image preprocessing ─────────────────────────────────────────────────────
IMG_SIZE = (224, 224)

# ImageNet mean/std — standard for EfficientNet, and what train.py normalises with.
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def preprocess(image_bytes: bytes) -> np.ndarray:
    """
    Convert raw image bytes to a normalised NCHW float32 tensor.

    Shape: (1, 3, 224, 224). This must stay equivalent to the val_transform in
    train.py or accuracy silently degrades.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE, Image.BILINEAR)
    arr = np.array(img, dtype=np.float32) / 255.0   # HWC, [0,1]
    arr = (arr - MEAN) / STD                        # normalise
    arr = arr.transpose(2, 0, 1)                    # HWC → CHW
    arr = np.expand_dims(arr, axis=0)               # → NCHW
    return arr


def softmax(logits: np.ndarray) -> np.ndarray:
    e = np.exp(logits - np.max(logits))
    return e / e.sum()


# ─── Model loader (singleton) ────────────────────────────────────────────────
_session: ort.InferenceSession | None = None


def load_model(model_path: str) -> ort.InferenceSession:
    """Load the ONNX model once and cache the session."""
    global _session
    if _session is None:
        _session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"],
        )
    return _session


# ─── Inference ───────────────────────────────────────────────────────────────
def _forward(tensor: np.ndarray, session: ort.InferenceSession) -> dict[str, Any]:
    """Run the model on an already-prepared tensor and map the winning class."""
    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: tensor})
    logits = outputs[0][0]           # shape: (num_classes,)
    probs = softmax(logits)

    top_idx = int(np.argmax(probs))
    top_label = PLANTVILLAGE_CLASSES[top_idx]
    confidence = round(float(probs[top_idx]) * 100, 1)

    return {
        "crop":            CROP_MAP[top_label],
        "disease":         DISPLAY_NAMES[top_label],
        "confidence":      confidence,
        "severity":        SEVERITY_MAP[top_label],
        "status":          STATUS_MAP[top_label],
        "recommendations": RECOMMENDATIONS[top_label],
    }


def predict(image_bytes: bytes, session: ort.InferenceSession) -> dict[str, Any]:
    """
    Run inference on raw image bytes.

    Returns a dict matching the DiagnosisResult TypeScript interface:
    {crop, disease, confidence, severity, status, recommendations}

    Note this raises whatever PIL raises for an undecodable image. diagnose()
    translates that into a 422; callers using predict() directly should do the
    same rather than reporting it as a server fault.
    """
    return _forward(preprocess(image_bytes), session)


# ─── Provider interface (see main.py) ────────────────────────────────────────
def model_path() -> str:
    return os.getenv("MODEL_PATH") or DEFAULT_MODEL_PATH


def startup() -> tuple[bool, str]:
    """
    Prepare the ONNX session. Called once by main.py at startup.

    Returns (ready, detail). A missing model file is reported rather than raised
    so the server still starts and /api/v1/health can explain the problem.
    """
    path = model_path()
    if not Path(path).is_file():
        return False, (
            f"model file not found at {path}. Train one with "
            "`python backend/train/train.py`, or point MODEL_PATH at an existing "
            ".onnx file."
        )
    try:
        load_model(path)
    except Exception as exc:
        return False, f"failed to load the ONNX model at {path}: {exc}"
    return True, f"local ONNX model loaded from {path}"


def describe() -> dict[str, Any]:
    """Provider details for the health endpoint."""
    return {
        "provider": "onnx",
        "model": model_path(),
        "classes": len(PLANTVILLAGE_CLASSES),
    }


def diagnose(
    image_bytes: bytes,
    crop_hint: str | None = None,
    location_hint: str | None = None,
) -> dict[str, Any]:
    """
    Diagnose a leaf image with the local model.

    crop_hint and location_hint are accepted for interface parity with the
    Bedrock provider. A trained classifier has no way to use them, so they are
    ignored rather than silently altering behaviour.
    """
    del crop_hint, location_hint  # accepted for interface parity only

    session = _session
    if session is None:
        ready, detail = startup()
        if not ready:
            raise OnnxProviderError(503, detail)
        session = _session
    if session is None:  # pragma: no cover — startup() guarantees a session
        raise OnnxProviderError(503, "ONNX session unavailable after startup.")

    # Decoding the upload is a client-input concern, not a server fault, so it
    # maps to 422 the same way the Bedrock provider does. Only a genuine failure
    # of the model itself is a 500.
    try:
        tensor = preprocess(image_bytes)
    except Exception as exc:
        raise OnnxProviderError(
            422,
            f"Could not decode the uploaded image: {exc}",
            "That file doesn't look like a readable photo. Please try a JPEG or PNG.",
        ) from exc

    try:
        return _forward(tensor, session)
    except Exception as exc:
        raise OnnxProviderError(500, f"ONNX inference failed: {exc}") from exc
