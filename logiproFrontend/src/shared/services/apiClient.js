import axios from "axios";
import { getAccessToken, setAccessToken, getRefreshToken, clearAccessToken } from "@shared/utils/session";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

let interceptorsRegistered = false;
let refreshPromise = null;

if (!interceptorsRegistered) {
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

      // Solo manejar 401 y evitar loops infinitos
      if (error?.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }

      // Marcar para evitar reintentos infinitos
      originalRequest._retry = true;

      // Carrera de refresh: usar promesa única
      if (!refreshPromise) {
        refreshPromise = (async () => {
          try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Cliente bare sin interceptores para evitar ciclos
            const bareClient = axios.create({
              baseURL: "http://localhost:8080",
              headers: { "Content-Type": "application/json" },
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
            // Refresh falló: limpiar sesión y redirigir
            clearAccessToken();
            window.location.assign("/login");
            throw err;
          } finally {
            refreshPromise = null;
          }
        })();
      }

      try {
        const newToken = await refreshPromise;
        // Actualizar header del request original y reintentar
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  );

  interceptorsRegistered = true;
}

export default apiClient;
