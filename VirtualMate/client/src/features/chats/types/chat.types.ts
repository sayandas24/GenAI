// ─── Shared Backend Envelope ──────────────────────────────────────────────────
export interface ApiEnvelope<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// ─── Domain Models ────────────────────────────────────────────────────────────
export interface Chat {
  _id: string;
  content: string;
  role: "user" | "model";
  session_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  _id: string;
  user_id: string;
  avatar_id: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response Types ───────────────────────────────────────────────────────
export type GetChatsResponse = ApiEnvelope<Chat[]>;
export type CreateChatResponse = ApiEnvelope<{ chat: Chat }>;
export type ClearChatResponse = ApiEnvelope<null>;
export type SessionResponse = ApiEnvelope<Session>;
