import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/avatar`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

async function getAllAvatarsAPI() {
  const response = await api.get("/all");
  console.log(response.data, "all avatars \n\n\n");
  return response.data;
}

export default getAllAvatarsAPI;
