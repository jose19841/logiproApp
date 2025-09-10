import { clearAccessToken, setAccessToken } from "../auth/session";
import apiClient from "./apiClient";

// 👉 URL base ya la maneja apiClient con VITE_API_URL

// Login: recibe credenciales, guarda tokens y devuelve user
export async function login(username, password) {
  const { data } = await apiClient.post("/auth/login", { username, password });

  if (data?.accessToken) setAccessToken(data.accessToken);
  if (data?.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken);

  return data; // { accessToken, refreshToken, user }
}

// Refresh: rota access y refresh
export async function refresh() {
  const refreshToken = sessionStorage.getItem("refreshToken");
  if (!refreshToken) return null;

  try {
    const { data } = await apiClient.post("/auth/refresh", { refreshToken });
    if (data?.accessToken) setAccessToken(data.accessToken);
    if (data?.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken);
    return data.accessToken;
  } catch {
    clearAccessToken();
    sessionStorage.removeItem("refreshToken");
    return null;
  }
}

// Logout: invalida refresh en backend y limpia cliente
export async function logout() {
  const refreshToken = sessionStorage.getItem("refreshToken");
  try {
    if (refreshToken) {
      await apiClient.post("/auth/logout-all", { refreshToken });
    }
  } catch {
    // no pasa nada si falla logout
  }
  clearAccessToken();
  sessionStorage.removeItem("refreshToken");
}
