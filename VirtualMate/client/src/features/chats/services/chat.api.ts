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
 * Fetch all chat messages in chronological order.
 */
export async function getAllChatsAPI(): Promise<GetChatsResponse> {
  const { data } = await api.get<GetChatsResponse>("/");
  return data;
}

/**
 * Send a user message and receive the AI response.
 */
export async function sendMessageAPI(
  message: string,
): Promise<CreateChatResponse> {
  const { data } = await api.post<CreateChatResponse>("/", { message });
  return data;
}

/**
 * Delete all messages in the conversation history.
 */
export async function clearChatAPI(): Promise<ClearChatResponse> {
  const { data } = await api.delete<ClearChatResponse>("/delete/all");
  return data;
}
