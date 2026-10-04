/**
 * chatService.ts — calls POST /api/v1/chat on the FastAPI backend.
 *
 * Mirrors the shape of diagnosisService.ts so both services are consistent.
 *
 * The backend is stateless: it receives the full conversation history on every
 * turn and returns the next assistant reply.  History management lives in the
 * frontend (AssistantPage state).
 */

import type { Locale } from '../i18n/translations';
import type { ChatMessage } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';
const API_KEY  = import.meta.env.VITE_API_KEY  ?? '';

// ─── Request / response shapes ────────────────────────────────────────────────
// Must match the Pydantic models in backend/main.py.

export interface ChatMessagePayload {
  role:    'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessagePayload[];
  locale:   Locale;
}

export interface ChatResponse {
  reply: string;
}

// ─── Error type ───────────────────────────────────────────────────────────────
export interface ChatServiceError {
  code:        'NETWORK' | 'SERVER' | 'RATE_LIMIT' | 'UNKNOWN';
  status?:     number;
  message:     string;
  userMessage: string;
}

// ─── Main function ────────────────────────────────────────────────────────────
/**
 * Send the current conversation history to the backend and return the
 * assistant's reply as a plain string.
 *
 * @param history  Full ChatMessage[] from AssistantPage state (user + assistant turns).
 * @param locale   Farmer's active locale — passed to the model so it responds
 *                 in the right language when the message is ambiguous.
 *
 * @throws {Error & ChatServiceError}  On any network or server failure.
 */
export async function sendChatMessage(
  history:  ChatMessage[],
  locale:   Locale,
): Promise<string> {
  // Strip fields the backend doesn't need; keep only role + content.
  const messages: ChatMessagePayload[] = history
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  if (messages.length === 0) {
    throw buildError('UNKNOWN', 'No messages to send.', 'Please type a message first.');
  }

  const body: ChatRequest = { messages, locale };

  let response: Response;
  try {
    response = await fetch(`${API_BASE}/api/v1/chat`, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'X-API-Key': API_KEY } : {}),
      },
      body: JSON.stringify(body),
    });
  } catch {
    throw buildError(
      'NETWORK',
      'Network request to /api/v1/chat failed.',
      "Couldn't reach the assistant. Check your internet connection and try again.",
    );
  }

  if (!response.ok) {
    const detail = await response.json().catch(() => ({ detail: 'Unknown error' }));
    const msg    = detail?.detail ?? `Server error ${response.status}`;

    if (response.status === 429) {
      throw buildError('RATE_LIMIT', msg, 'The assistant is busy right now. Please try again in a moment.');
    }
    if (response.status === 503) {
      throw buildError('SERVER', msg, 'The assistant service is not ready yet. Please try again shortly.');
    }
    if (response.status === 401) {
      throw buildError('SERVER', msg, 'The assistant service is not configured correctly. Please try again shortly.');
    }
    throw buildError('SERVER', msg, "The assistant couldn't respond right now. Please try again.");
  }

  const data = (await response.json()) as ChatResponse;
  return data.reply;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildError(
  code:        ChatServiceError['code'],
  message:     string,
  userMessage: string,
  status?:     number,
): Error & ChatServiceError {
  const err = new Error(message) as Error & ChatServiceError;
  err.code        = code;
  err.message     = message;
  err.userMessage = userMessage;
  if (status !== undefined) err.status = status;
  return err;
}
