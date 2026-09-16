import type { DiagnosisResult } from '../types';
import { MOCK_DIAGNOSIS } from '../data';

/**
 * Mock diagnosis service.
 * Replace `analyzeCropImage` with a real API call when your ML backend is ready.
 *
 * Example backends:
 *   - FastAPI + TensorFlow/PyTorch
 *   - Google Vertex AI
 *   - AWS SageMaker
 *   - Azure Custom Vision
 *   - ONNX Runtime (edge)
 */

export interface AnalysisRequest {
  image: File | Blob | string; // File object, Blob, or base64 data URL
  cropHint?: string;           // Optional: helps narrow model selection
  locationHint?: string;       // Optional: country/region for localized guidance
}

export interface AnalysisError {
  code: 'IMAGE_QUALITY' | 'UNSUPPORTED_CROP' | 'NETWORK' | 'SERVER' | 'UNKNOWN';
  message: string;
  userMessage: string;
}

const SIMULATED_DELAY_MS = 2800;

/**
 * Analyze a crop image and return a diagnosis result.
 * Currently returns realistic mock data after a simulated delay.
 * Swap the implementation below with your real API call.
 */
export async function analyzeCropImage(
  _request: AnalysisRequest
): Promise<DiagnosisResult> {
  // Simulate network + inference latency
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));

  // TODO: Replace mock with real API call:
  //
  // const formData = new FormData();
  // formData.append('image', request.image);
  // if (request.cropHint) formData.append('crop', request.cropHint);
  //
  // const response = await fetch('/api/v1/diagnose', {
  //   method: 'POST',
  //   body: formData,
  // });
  //
  // if (!response.ok) throw new ApiError(response);
  // return response.json() as Promise<DiagnosisResult>;

  return {
    ...MOCK_DIAGNOSIS,
    timestamp: new Date(),
  };
}

/**
 * Validate that an image file is suitable for analysis.
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  const MAX_SIZE_MB = 10;

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please use a JPEG, PNG, or WebP image.',
    };
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return {
      valid: false,
      error: `Image must be smaller than ${MAX_SIZE_MB}MB.`,
    };
  }

  return { valid: true };
}
