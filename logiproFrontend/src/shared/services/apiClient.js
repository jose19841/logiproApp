import axios from "axios";
import { getAccessToken, setAccessToken, getRefreshToken, clearAccessToken } from "@shared/utils/session";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8080";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

// Singleton global para HMR estable
const g = globalThis;
if (!g.__LOGIPRO_API_CLIENT__) {
  g.__LOGIPRO_API_CLIENT__ = axios.create({
    baseURL: BASE_URL,
    headers: DEFAULT_HEADERS,
  });
}
const apiClient = g.__LOGIPRO_API_CLIENT__;

// Registrar interceptores una sola vez por instancia
if (!apiClient.__INTERCEPTORS_REGISTERED__) {
  // Request interceptor: adjuntar Authorization header automáticamente
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: manejar 401 con refresh automático
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error?.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Promesa global única para refresh
      if (!g.__LOGIPRO_REFRESH_PROMISE__) {
        g.__LOGIPRO_REFRESH_PROMISE__ = (async () => {
          try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            const bareClient = axios.create({
              baseURL: BASE_URL,
              headers: DEFAULT_HEADERS,
            });

            const { data } = await bareClient.post("/auth/refresh", { refreshToken });

            if (data?.accessToken) {
              setAccessToken(data.accessToken);
              if (data?.refreshToken) {
                sessionStorage.setItem("refreshToken", data.refreshToken);
              }
              return data.accessToken;
            }
            throw new Error("No access token in refresh response");
          } catch (err) {
            clearAccessToken();
            window.location.assign("/login");
            throw err;
          } finally {
            g.__LOGIPRO_REFRESH_PROMISE__ = null;
          }
        })();
      }

      try {
        const newToken = await g.__LOGIPRO_REFRESH_PROMISE__;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  );

  apiClient.__INTERCEPTORS_REGISTERED__ = true;
}

export default apiClient;
