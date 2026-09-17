import type { DiagnosisResult } from '../types';

/**
 * Diagnosis service — calls the FastAPI backend at /api/v1/diagnose.
 *
 * During local development, Vite proxies /api → http://localhost:8000
 * so no CORS issues arise.  In production, set VITE_API_BASE to your
 * deployed API URL (e.g. https://api.smartfarmer.ai).
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export interface AnalysisRequest {
  image: File | Blob | string; // File object, Blob, or base64 data URL
  cropHint?: string;           // Optional: helps narrow model selection
  locationHint?: string;       // Optional: country/region for localised guidance
}

export interface AnalysisError {
  code: 'IMAGE_QUALITY' | 'UNSUPPORTED_CROP' | 'NETWORK' | 'SERVER' | 'UNKNOWN';
  message: string;
  userMessage: string;
}

/**
 * Analyze a crop image and return a diagnosis result.
 * Sends the image to POST /api/v1/diagnose and returns the parsed JSON.
 */
export async function analyzeCropImage(
  request: AnalysisRequest
): Promise<DiagnosisResult> {
  const formData = new FormData();

  if (typeof request.image === 'string') {
    // Frontend sends a base64 data URL from FileReader — pass it as a form field
    formData.append('image_b64', request.image);
  } else {
    // File or Blob object — multipart upload
    formData.append('image', request.image);
  }

  if (request.cropHint)     formData.append('crop',     request.cropHint);
  if (request.locationHint) formData.append('location', request.locationHint);

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/v1/diagnose`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    throw buildError(
      'NETWORK',
      'Network request failed.',
      'Unable to reach the analysis server. Check your internet connection and try again.'
    );
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => ({ detail: 'Unknown error' }));
    const msg = detail?.detail ?? `Server error ${response.status}`;

    if (response.status === 503) {
      throw buildError('SERVER', msg, 'The AI model is not ready yet. Please try again shortly.');
    }
    if (response.status === 413) {
      throw buildError('IMAGE_QUALITY', msg, 'Image is too large. Please use an image under 10 MB.');
    }
    throw buildError('SERVER', msg, "We couldn't analyze this image. Try a clearer photo in good lighting.");
  }

  const result = (await response.json()) as DiagnosisResult;

  // Attach a timestamp if the server didn't include one
  return {
    ...result,
    timestamp: result.timestamp ? new Date(result.timestamp) : new Date(),
  };
}

/**
 * Validate that an image file is suitable for analysis before uploading.
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  const MAX_SIZE_MB = 10;

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Please use a JPEG, PNG, or WebP image.' };
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { valid: false, error: `Image must be smaller than ${MAX_SIZE_MB} MB.` };
  }

  return { valid: true };
}

// ─── Internal helper ─────────────────────────────────────────────────────────
function buildError(
  code: AnalysisError['code'],
  message: string,
  userMessage: string
): Error & { code: string; userMessage: string } {
  const err = new Error(message) as Error & { code: string; userMessage: string };
  err.code = code;
  err.userMessage = userMessage;
  return err;
}
