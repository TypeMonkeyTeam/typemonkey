import axios from "axios";

// const TOKEN = import.meta.env.VITE_API_TOKEN;
// const headers = { Authorization: `Bearer ${TOKEN}` };

const BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const handleRequest = async (method, endpoint, data = null) => {
  try {
    let response;

    switch (method) {
      case "get":
        response = await api.get(endpoint);
        break;
      case "post":
        response = await api.post(endpoint, data);
        break;
      case "patch":
        response = await api.patch(endpoint, data);
        break;
      case "delete":
        response = await api.delete(endpoint);
        break;
      default:
        throw new Error("Неподдерживаемый метод запроса");
    }

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("API error:", error);

    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status || 500,
    };
  }
};

export const get = (endpoint) => handleRequest("get", endpoint);
export const post = (endpoint, data) => handleRequest("post", endpoint, data);
export const patch = (endpoint, data) => handleRequest("patch", endpoint, data);
export const del = (endpoint) => handleRequest("delete", endpoint);
