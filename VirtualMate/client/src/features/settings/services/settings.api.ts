import axios, { AxiosError } from "axios";

export interface GetApiKeyPayload {
  password: string;
}

export interface UpdateApiKeyPayload {
  password: string;
  geminiApiKey: string;
}

export interface ApiKeyResponse {
  geminiApiKey: string;
}

export interface SettingsMessageResponse {
  message: string;
}

const api = axios.create({
  baseURL: "http://localhost:4000/api/settings",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export function extractErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  return fallback;
}

/** POST /api/settings/api-key — password-gated read */
export async function getApiKeyAPI(payload: GetApiKeyPayload): Promise<ApiKeyResponse> {
  const { data } = await api.post<ApiKeyResponse>("/api-key", payload);
  return data;
}

/** PUT /api/settings/api-key — password-gated update */
export async function updateApiKeyAPI(payload: UpdateApiKeyPayload): Promise<SettingsMessageResponse> {
  const { data } = await api.put<SettingsMessageResponse>("/api-key", payload);
  return data;
}
