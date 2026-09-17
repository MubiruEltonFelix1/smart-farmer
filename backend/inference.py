"""
inference.py — loads the ONNX model and runs predictions on leaf images.

Drop your trained cassava.onnx file into backend/model/ and this module
handles everything: preprocessing, inference, and mapping outputs to the
DiagnosisResult shape the frontend expects.
"""

import io
import numpy as np
import onnxruntime as ort
from PIL import Image

# ─── Class labels ────────────────────────────────────────────────────────────
# Must match the order used during training.
# Based on the Kaggle Cassava Leaf Disease Classification dataset.
CASSAVA_CLASSES = [
    "Cassava Bacterial Blight",
    "Cassava Brown Streak Disease",
    "Cassava Green Mite",
    "Cassava Mosaic Disease",
    "Healthy",
]

# ─── Severity mapping ────────────────────────────────────────────────────────
SEVERITY_MAP = {
    "Cassava Bacterial Blight":    "High",
    "Cassava Brown Streak Disease":"High",
    "Cassava Green Mite":          "Moderate",
    "Cassava Mosaic Disease":      "Moderate",
    "Healthy":                     "Healthy",
}

# ─── Status mapping ──────────────────────────────────────────────────────────
STATUS_MAP = {
    "Cassava Bacterial Blight":    "Affected",
    "Cassava Brown Streak Disease":"Affected",
    "Cassava Green Mite":          "Potentially affected",
    "Cassava Mosaic Disease":      "Potentially affected",
    "Healthy":                     "Healthy",
}

# ─── Recommendations ─────────────────────────────────────────────────────────
RECOMMENDATIONS = {
    "Cassava Bacterial Blight": [
        "Remove and destroy infected plant parts immediately.",
        "Avoid moving tools or plant material between fields.",
        "Apply copper-based bactericide if available locally.",
        "Monitor neighbouring plants closely over the next 5–7 days.",
        "Contact your extension officer — this disease spreads quickly.",
    ],
    "Cassava Brown Streak Disease": [
        "Rogue out (uproot and destroy) severely infected plants.",
        "Use certified disease-free planting material for the next season.",
        "Control whitefly populations, which spread this virus.",
        "Do not use stem cuttings from affected plants.",
        "Report to your local agricultural office for regional tracking.",
    ],
    "Cassava Green Mite": [
        "Inspect the underside of leaves for mite colonies.",
        "Apply neem-based spray or other approved miticides.",
        "Avoid over-fertilising with nitrogen, which encourages mites.",
        "Introduce natural predators (predatory mites) if available.",
        "Monitor weekly and reapply treatment after rain.",
    ],
    "Cassava Mosaic Disease": [
        "Inspect nearby plants for similar symptoms within 24–48 hours.",
        "Remove severely affected leaves to reduce viral load.",
        "Avoid moving plant material from affected areas to healthy parts.",
        "Use mosaic-resistant cassava varieties in the next planting.",
        "Contact your local extension officer if symptoms persist.",
    ],
    "Healthy": [
        "Your crop appears healthy — continue current management practices.",
        "Monitor regularly, especially during wet seasons.",
        "Keep a record of this diagnosis for your farm history.",
    ],
}

# ─── Image preprocessing ─────────────────────────────────────────────────────
IMG_SIZE = (224, 224)

# ImageNet mean/std — standard for EfficientNet / MobileNet / ResNet
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def preprocess(image_bytes: bytes) -> np.ndarray:
    """
    Convert raw image bytes to a normalised NCHW float32 tensor.
    Shape: (1, 3, 224, 224)
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE, Image.BILINEAR)
    arr = np.array(img, dtype=np.float32) / 255.0          # HWC, [0,1]
    arr = (arr - MEAN) / STD                                # normalise
    arr = arr.transpose(2, 0, 1)                            # HWC → CHW
    arr = np.expand_dims(arr, axis=0)                       # → NCHW
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
def predict(image_bytes: bytes, session: ort.InferenceSession) -> dict:
    """
    Run inference on raw image bytes.

    Returns a dict matching the DiagnosisResult TypeScript interface:
    {
        crop, disease, confidence, severity, status, recommendations
    }
    """
    tensor = preprocess(image_bytes)

    input_name = session.get_inputs()[0].name
    outputs = session.run(None, {input_name: tensor})
    logits = outputs[0][0]                  # shape: (num_classes,)
    probs  = softmax(logits)

    top_idx   = int(np.argmax(probs))
    top_label = CASSAVA_CLASSES[top_idx]
    confidence = round(float(probs[top_idx]) * 100, 1)

    return {
        "crop":            "Cassava",
        "disease":         top_label,
        "confidence":      confidence,
        "severity":        SEVERITY_MAP[top_label],
        "status":          STATUS_MAP[top_label],
        "recommendations": RECOMMENDATIONS[top_label],
    }
