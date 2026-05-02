import axios, { AxiosError } from "axios";
import type {
  ClearChatResponse,
  CreateChatResponse,
  GetChatsResponse,
} from "../types/chat.types";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/chats`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Error Helper ─────────────────────────────────────────────────────────────
export function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return fallback;
}

/**
 * Fetch all messages for a session in chronological order.
 */
export async function getAllChatsAPI(sessionId: string): Promise<GetChatsResponse> {
  const { data } = await api.get<GetChatsResponse>("/", {
    params: { session_id: sessionId },
  });
  return data;
}

/**
 * Send a user message and receive the AI response.
 * @param payload - `{ content, session_id }`
 */
export async function sendMessageAPI(payload: {
  content: string;
  session_id: string;
}): Promise<CreateChatResponse> {
  const { data } = await api.post<CreateChatResponse>("/", payload);
  return data;
}

/**
 * Delete all messages belonging to a session.
 */
export async function clearChatAPI(sessionId: string): Promise<ClearChatResponse> {
  const { data } = await api.delete<ClearChatResponse>("/clear/user", {
    params: { session_id: sessionId },
  });
  return data;
}
