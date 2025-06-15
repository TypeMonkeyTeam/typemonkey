import axios from "axios";
import { API_ROUTES } from "./routes";
import { logout } from "../helpers/authHelper";

const BASE_URL = "http://localhost:8080";
let accessToken = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Чтобы refresh_token передавался в куках
  headers: {
    "Content-Type": "application/json",
  },
});

//  Установка access token в каждый запрос
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Автообновление access token при 401 ошибке
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes(API_ROUTES.auth.refresh)
    ) {
      originalRequest._retry = true;
      try {
        const res = await api.post(API_ROUTES.auth.refresh);

        accessToken = res.data.access_token;
        localStorage.setItem("access_token", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest); // Повторяем оригинальный запрос
      } catch (refreshErr) {
        console.error("Ошибка обновления токена:", refreshErr);

        // 🧹 Очищаем access_token и можно редиректить
        logout();

        // Дополнительно: можно вызвать logout() тут, если он есть
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

//  Универсальный метод для использования в компонентах
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
      error:
        error.response?.data?.description ||
        error.response?.data?.message ||
        error.message,
      status: error.response?.status || 500,
    };
  }
};

export const get = (endpoint) => handleRequest("get", endpoint);
export const post = (endpoint, data) => handleRequest("post", endpoint, data);
export const patch = (endpoint, data) => handleRequest("patch", endpoint, data);
export const del = (endpoint) => handleRequest("delete", endpoint);

export default api;
