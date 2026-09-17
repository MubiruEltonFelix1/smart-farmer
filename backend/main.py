"""
main.py — FastAPI server for Smart Farmer crop disease diagnosis.

Endpoints:
  POST /api/v1/diagnose   — accepts a leaf image, returns DiagnosisResult JSON
  GET  /api/v1/health     — liveness check

Run locally:
  cd backend
  uvicorn main:app --reload --port 8000
"""

import base64
import io
import os
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from inference import load_model, predict

load_dotenv()

# ─── Config ──────────────────────────────────────────────────────────────────
MODEL_PATH = os.getenv(
    "MODEL_PATH",
    str(Path(__file__).parent / "model" / "cassava.onnx"),
)

# Origins allowed to call the API.
# In production replace "*" with your actual frontend domain.
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:4173",
).split(",")


# ─── Lifespan: load model once at startup ────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    model_file = Path(MODEL_PATH)
    if not model_file.exists():
        print(
            f"\n⚠️  Model file not found at: {MODEL_PATH}"
            "\n   The server will start but /api/v1/diagnose will return 503"
            "\n   until you place cassava.onnx in backend/model/\n"
        )
        app.state.session = None
    else:
        print(f"✅  Loading model from {MODEL_PATH} …")
        app.state.session = load_model(MODEL_PATH)
        print("✅  Model loaded and ready.")
    yield
    # cleanup on shutdown (nothing needed for ONNX sessions)


# ─── App ─────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Smart Farmer — Crop Diagnosis API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ─── Health ──────────────────────────────────────────────────────────────────
@app.get("/api/v1/health")
def health():
    model_ready = app.state.session is not None
    return {
        "status": "ok" if model_ready else "degraded",
        "model_loaded": model_ready,
    }


# ─── Diagnose ────────────────────────────────────────────────────────────────
@app.post("/api/v1/diagnose")
async def diagnose(
    image: UploadFile | None = File(default=None),
    image_b64: str | None = Form(default=None),
    crop: str | None = Form(default=None),       # cropHint from frontend
    location: str | None = Form(default=None),   # locationHint from frontend
):
    """
    Accept a leaf image and return a diagnosis.

    The frontend (diagnosisService.ts) sends the image as a base64 data URL
    in the `image` form field.  This endpoint handles both:
      - multipart file upload  (UploadFile via `image` field)
      - base64 data URL string (string via `image` field — how the frontend sends it)

    Returns JSON matching the DiagnosisResult TypeScript interface.
    """
    if app.state.session is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Place cassava.onnx in backend/model/ and restart.",
        )

    # ── Read raw image bytes ──────────────────────────────────────────────────
    image_bytes: bytes | None = None

    # Case 1: frontend sends base64 data URL as a plain form string
    if image_b64:
        try:
            # strip "data:image/jpeg;base64," prefix if present
            b64_data = image_b64.split(",")[-1]
            image_bytes = base64.b64decode(b64_data)
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

    # ── Validate size (10 MB) ─────────────────────────────────────────────────
    MAX_BYTES = 10 * 1024 * 1024
    if len(image_bytes) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="Image exceeds 10 MB limit.")

    # ── Run inference ─────────────────────────────────────────────────────────
    try:
        result = predict(image_bytes, app.state.session)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {str(exc)}",
        )

    return result
