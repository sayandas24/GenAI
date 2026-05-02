import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/session`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getUserSessionsAPI(userId: string) {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await api.get(`/user?user_id=${userId}`);
  return response.data;
}

async function createNewSessionAPI({ user_id, avatar_id }: { user_id: string, avatar_id: string }) {
  if (!user_id || !avatar_id) {
    throw new Error("User id and avatar id are required");
  }

  const response = await api.post(`/`, { user_id, avatar_id });
  return response.data;
}

export { getUserSessionsAPI, createNewSessionAPI };
