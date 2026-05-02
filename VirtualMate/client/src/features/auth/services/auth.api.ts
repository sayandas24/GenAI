import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/authenticate`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

async function authenticateAPI(userdata: any) {
  const response = await api.post("/", userdata);

  console.log(response.data, "response");

  return response.data;
}

export { authenticateAPI };
