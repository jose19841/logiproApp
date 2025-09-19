import { clearAccessToken, setAccessToken, setUser } from "../auth/session";
import apiClient from "./apiClient";

// 👉 URL base ya la maneja apiClient con VITE_API_URL

// Login: recibe credenciales, guarda tokens y devuelve user
export async function login(usuario, clave) {
  // el backend espera {usuario, clave}
  const { data } = await apiClient.post("/auth/login", { usuario, clave });

  if (data?.accessToken) setAccessToken(data.accessToken);
  if (data?.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken);
  if (data?.user) setUser(data.user);

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
