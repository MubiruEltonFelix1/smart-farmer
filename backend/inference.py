"""
inference.py — loads the ONNX model and runs predictions on leaf images.

Drop your trained plantvillage.onnx file into backend/model/ and this module
handles everything: preprocessing, inference, and mapping outputs to the
DiagnosisResult shape the frontend expects.
"""

import io
import numpy as np
import onnxruntime as ort
from PIL import Image

# ─── Class labels ────────────────────────────────────────────────────────────
# Must match the alphabetical order ImageFolder assigns during training.
# torchvision.datasets.ImageFolder sorts class folders alphabetically.
PLANTVILLAGE_CLASSES = [
    "Pepper__bell___Bacterial_spot",                    # 0
    "Pepper__bell___healthy",                           # 1
    "Potato___Early_blight",                            # 2
    "Potato___healthy",                                 # 3
    "Potato___Late_blight",                             # 4
    "Tomato__Target_Spot",                              # 5
    "Tomato__Tomato_mosaic_virus",                      # 6
    "Tomato__Tomato_YellowLeaf__Curl_Virus",            # 7
    "Tomato_Bacterial_spot",                            # 8
    "Tomato_Early_blight",                              # 9
    "Tomato_healthy",                                   # 10
    "Tomato_Late_blight",                               # 11
    "Tomato_Leaf_Mold",                                 # 12
    "Tomato_Septoria_leaf_spot",                        # 13
    "Tomato_Spider_mites_Two_spotted_spider_mite",      # 14
]

# ─── Human-readable display names ────────────────────────────────────────────
DISPLAY_NAMES = {
    "Pepper__bell___Bacterial_spot":               "Bacterial Spot",
    "Pepper__bell___healthy":                      "Healthy",
    "Potato___Early_blight":                       "Early Blight",
    "Potato___healthy":                            "Healthy",
    "Potato___Late_blight":                        "Late Blight",
    "Tomato__Target_Spot":                         "Target Spot",
    "Tomato__Tomato_mosaic_virus":                 "Tomato Mosaic Virus",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "Yellow Leaf Curl Virus",
    "Tomato_Bacterial_spot":                       "Bacterial Spot",
    "Tomato_Early_blight":                         "Early Blight",
    "Tomato_healthy":                              "Healthy",
    "Tomato_Late_blight":                          "Late Blight",
    "Tomato_Leaf_Mold":                            "Leaf Mold",
    "Tomato_Septoria_leaf_spot":                   "Septoria Leaf Spot",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Spider Mites (Two-spotted)",
}

# ─── Crop name mapping ───────────────────────────────────────────────────────
CROP_MAP = {
    "Pepper__bell___Bacterial_spot":               "Bell Pepper",
    "Pepper__bell___healthy":                      "Bell Pepper",
    "Potato___Early_blight":                       "Potato",
    "Potato___healthy":                            "Potato",
    "Potato___Late_blight":                        "Potato",
    "Tomato__Target_Spot":                         "Tomato",
    "Tomato__Tomato_mosaic_virus":                 "Tomato",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "Tomato",
    "Tomato_Bacterial_spot":                       "Tomato",
    "Tomato_Early_blight":                         "Tomato",
    "Tomato_healthy":                              "Tomato",
    "Tomato_Late_blight":                          "Tomato",
    "Tomato_Leaf_Mold":                            "Tomato",
    "Tomato_Septoria_leaf_spot":                   "Tomato",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Tomato",
}

# ─── Severity mapping ────────────────────────────────────────────────────────
SEVERITY_MAP = {
    "Pepper__bell___Bacterial_spot":               "High",
    "Pepper__bell___healthy":                      "Healthy",
    "Potato___Early_blight":                       "Moderate",
    "Potato___healthy":                            "Healthy",
    "Potato___Late_blight":                        "High",
    "Tomato__Target_Spot":                         "Moderate",
    "Tomato__Tomato_mosaic_virus":                 "High",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "High",
    "Tomato_Bacterial_spot":                       "High",
    "Tomato_Early_blight":                         "Moderate",
    "Tomato_healthy":                              "Healthy",
    "Tomato_Late_blight":                          "High",
    "Tomato_Leaf_Mold":                            "Moderate",
    "Tomato_Septoria_leaf_spot":                   "Moderate",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Moderate",
}

# ─── Status mapping ──────────────────────────────────────────────────────────
STATUS_MAP = {
    "Pepper__bell___Bacterial_spot":               "Affected",
    "Pepper__bell___healthy":                      "Healthy",
    "Potato___Early_blight":                       "Potentially affected",
    "Potato___healthy":                            "Healthy",
    "Potato___Late_blight":                        "Affected",
    "Tomato__Target_Spot":                         "Potentially affected",
    "Tomato__Tomato_mosaic_virus":                 "Affected",
    "Tomato__Tomato_YellowLeaf__Curl_Virus":       "Affected",
    "Tomato_Bacterial_spot":                       "Affected",
    "Tomato_Early_blight":                         "Potentially affected",
    "Tomato_healthy":                              "Healthy",
    "Tomato_Late_blight":                          "Affected",
    "Tomato_Leaf_Mold":                            "Potentially affected",
    "Tomato_Septoria_leaf_spot":                   "Potentially affected",
    "Tomato_Spider_mites_Two_spotted_spider_mite": "Potentially affected",
}

# ─── Recommendations ─────────────────────────────────────────────────────────
RECOMMENDATIONS = {
    "Pepper__bell___Bacterial_spot": [
        "Remove and destroy infected leaves and fruit immediately.",
        "Avoid overhead irrigation — water at the base of the plant.",
        "Apply copper-based bactericide (e.g., copper hydroxide) as a preventive spray.",
        "Rotate crops — do not plant peppers in the same spot for at least 2 years.",
        "Disinfect tools between plants to prevent spreading the bacteria.",
    ],
    "Pepper__bell___healthy": [
        "Your bell pepper plant appears healthy — keep up current practices.",
        "Continue regular scouting for early signs of bacterial spot or anthracnose.",
        "Maintain adequate spacing for good air circulation.",
        "Keep a record of this diagnosis for your farm history.",
    ],
    "Potato___Early_blight": [
        "Remove and dispose of infected lower leaves to slow spread.",
        "Apply a fungicide containing chlorothalonil or mancozeb every 7–10 days.",
        "Avoid wetting foliage when irrigating — use drip irrigation if possible.",
        "Ensure plants receive adequate potassium to strengthen resistance.",
        "Rotate potatoes with non-solanaceous crops each season.",
    ],
    "Potato___healthy": [
        "Your potato plant appears healthy — maintain current practices.",
        "Monitor regularly for early signs of late blight, especially after rain.",
        "Hill soil around stems to prevent tuber greening and reduce disease entry.",
        "Keep a record of this diagnosis for your farm history.",
    ],
    "Potato___Late_blight": [
        "Act immediately — late blight can destroy an entire crop within days.",
        "Remove and destroy all visibly infected plant parts; do not compost them.",
        "Apply a systemic fungicide (e.g., metalaxyl or cymoxanil) without delay.",
        "Avoid working in the field when foliage is wet to prevent further spread.",
        "Notify your local agricultural extension office — late blight spreads to neighbouring farms.",
        "Consider harvesting tubers early if infection is severe.",
    ],
    "Tomato__Target_Spot": [
        "Remove heavily infected leaves and dispose of them away from the field.",
        "Improve air circulation by pruning suckers and spacing plants adequately.",
        "Apply a fungicide containing chlorothalonil or azoxystrobin at first sign.",
        "Avoid overhead watering; irrigate at the base of the plant.",
        "Rotate tomatoes with non-solanaceous crops each season.",
    ],
    "Tomato__Tomato_mosaic_virus": [
        "Remove and destroy all infected plants — there is no cure for mosaic virus.",
        "Wash hands thoroughly with soap before handling healthy plants.",
        "Disinfect tools with 10% bleach solution between uses.",
        "Control aphids and other sap-sucking insects that spread the virus.",
        "Use certified virus-free seed or resistant varieties for the next planting.",
        "Do not smoke near plants — tobacco mosaic virus can contaminate hands.",
    ],
    "Tomato__Tomato_YellowLeaf__Curl_Virus": [
        "Remove and destroy infected plants immediately to reduce virus spread.",
        "Control whitefly populations with yellow sticky traps and insecticides.",
        "Apply insecticidal soap or neem oil to reduce whitefly numbers.",
        "Use reflective mulch to deter whiteflies from landing on plants.",
        "Plant resistant tomato varieties (TYLCV-resistant) in future seasons.",
        "Create physical barriers (insect-proof netting) for seedlings.",
    ],
    "Tomato_Bacterial_spot": [
        "Remove infected leaves and fruit; do not leave debris on the soil.",
        "Apply copper-based bactericide every 7–10 days during warm, wet weather.",
        "Avoid overhead irrigation and working with plants when they are wet.",
        "Use disease-free transplants and certified seed for future crops.",
        "Rotate tomatoes with non-solanaceous crops for at least 2 years.",
    ],
    "Tomato_Early_blight": [
        "Remove and destroy lower infected leaves at first sign of the disease.",
        "Apply a fungicide (chlorothalonil, mancozeb, or copper-based) every 7–10 days.",
        "Mulch around the base of plants to prevent soil splash onto leaves.",
        "Water at the base of the plant to keep foliage dry.",
        "Ensure adequate plant nutrition — nitrogen deficiency worsens early blight.",
    ],
    "Tomato_healthy": [
        "Your tomato plant appears healthy — continue current management practices.",
        "Scout regularly for early signs of blight, bacterial spot, or viral symptoms.",
        "Maintain consistent watering to avoid blossom-end rot.",
        "Keep a record of this diagnosis for your farm history.",
    ],
    "Tomato_Late_blight": [
        "Act immediately — late blight can collapse a tomato crop within a week.",
        "Remove and destroy all infected plant material; do not compost it.",
        "Apply a systemic fungicide (metalaxyl or cymoxanil) as soon as possible.",
        "Avoid wetting foliage; irrigate at the base of the plant.",
        "Notify neighbouring growers — late blight spreads rapidly via wind-borne spores.",
        "Consider early harvest of any marketable fruit before infection worsens.",
    ],
    "Tomato_Leaf_Mold": [
        "Improve ventilation in the growing area — leaf mold thrives in humid, enclosed conditions.",
        "Remove and destroy infected leaves to reduce fungal spore load.",
        "Apply a fungicide (chlorothalonil or copper-based) at first sign of symptoms.",
        "Keep foliage dry by watering at the base and spacing plants for airflow.",
        "Use resistant tomato varieties in future plantings if leaf mold is a recurring problem.",
    ],
    "Tomato_Septoria_leaf_spot": [
        "Remove infected leaves immediately, starting from the bottom of the plant.",
        "Apply a fungicide (chlorothalonil, mancozeb, or copper) every 7–10 days.",
        "Mulch the soil surface to prevent spore splash from the soil to leaves.",
        "Avoid overhead watering and working with wet plants.",
        "Rotate tomatoes away from this plot for at least 2 years.",
    ],
    "Tomato_Spider_mites_Two_spotted_spider_mite": [
        "Inspect the underside of leaves for tiny mites and fine webbing.",
        "Spray plants forcefully with water to knock mites off leaves.",
        "Apply neem oil, insecticidal soap, or an approved miticide (e.g., abamectin).",
        "Avoid over-fertilising with nitrogen — lush growth attracts spider mites.",
        "Introduce predatory mites (Phytoseiidae) as a biological control if available.",
        "Monitor weekly and reapply treatment after rain or irrigation.",
    ],
}

# ─── Image preprocessing ─────────────────────────────────────────────────────
IMG_SIZE = (224, 224)

# ImageNet mean/std — standard for EfficientNet
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def preprocess(image_bytes: bytes) -> np.ndarray:
    """
    Convert raw image bytes to a normalised NCHW float32 tensor.
    Shape: (1, 3, 224, 224)
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(IMG_SIZE, Image.BILINEAR)
    arr = np.array(img, dtype=np.float32) / 255.0   # HWC, [0,1]
    arr = (arr - MEAN) / STD                         # normalise
    arr = arr.transpose(2, 0, 1)                     # HWC → CHW
    arr = np.expand_dims(arr, axis=0)                # → NCHW
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
    outputs    = session.run(None, {input_name: tensor})
    logits     = outputs[0][0]           # shape: (num_classes,)
    probs      = softmax(logits)

    top_idx    = int(np.argmax(probs))
    top_label  = PLANTVILLAGE_CLASSES[top_idx]
    confidence = round(float(probs[top_idx]) * 100, 1)

    return {
        "crop":            CROP_MAP[top_label],
        "disease":         DISPLAY_NAMES[top_label],
        "confidence":      confidence,
        "severity":        SEVERITY_MAP[top_label],
        "status":          STATUS_MAP[top_label],
        "recommendations": RECOMMENDATIONS[top_label],
    }
