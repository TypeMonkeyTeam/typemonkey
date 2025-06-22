import axios from "axios";
import { API_ROUTES } from "./routes";
import { logout } from "../helpers/authHelper";

const BASE_URL = "https://typemonkey.ru";
let accessToken = localStorage.getItem("access_token");

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // для refresh_token в куках
  headers: {},
});

//  Добавляем access_token в каждый запрос
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//  Автообновление access_token при 401
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
        return api(originalRequest); // повтор запроса
      } catch (refreshErr) {
        console.error("Ошибка обновления токена:", refreshErr);
        logout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

// 🔧 Универсальный запрос
const handleRequest = async (method, endpoint, data = null, options = {}) => {
  try {
    const config = {
      headers: {
        ...options.customHeaders,
      },
      params: options.params || {},
    };

    // Только для обычных данных — явно указываем Content-Type
    if (!(data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    let response;
    switch (method) {
      case "get":
        response = await api.get(endpoint, config);
        break;
      case "post":
        response = await api.post(endpoint, data, config);
        break;
      case "patch":
        response = await api.patch(endpoint, data, config);
        break;
      case "delete":
        response = await api.delete(endpoint, config);
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

// Экспорт удобных методов
export const get = (endpoint, options = {}) =>
  handleRequest("get", endpoint, null, options);

export const post = (endpoint, data, options = {}) =>
  handleRequest("post", endpoint, data, options);

export const patch = (endpoint, data, options = {}) =>
  handleRequest("patch", endpoint, data, options);

export const del = (endpoint, options = {}) =>
  handleRequest("delete", endpoint, null, options);

export default api;
