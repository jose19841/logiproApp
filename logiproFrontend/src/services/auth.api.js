// src/modules/login/services/auth.api.js
import { clearAccessToken, setAccessToken, setUser } from "../auth/session";
import apiClient from "./apiClient";
import { httpRequest } from "./httpService"; // ← wrapper con Authorization

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

/**
 * Cambio de contraseña (usuario logueado)
 * Backend (asumido): POST /auth/change-password
 * Body: { actualClave, nuevaClave, repetirClave }
 * Respuesta OK: 204 (o 200) sin body
 */
export async function changePassword({ actualClave, nuevaClave, repetirClave }) {
  const res = await httpRequest({
    method: "POST",
    url: "/auth/change-password", // ajustá si tu endpoint tiene otro path real
    data: { actualClave, nuevaClave, repetirClave },
  });
  return res?.status === 204 || res?.status === 200;
}

/**
 * Recuperación de contraseña (paso 1)
 * Backend: POST /auth/forgot
 * Body: { identifier }
 * Respuesta OK: 200 { message }
 */
export async function recoverPassword(identifier) {
  const { data } = await apiClient.post("/auth/forgot", { identifier });
  return data; // { message: string }
}

/**
 * Recuperación de contraseña (paso 2)
 * Backend: POST /auth/reset
 * Body: { token, nuevaClave }
 * Respuesta OK: 204 No Content (o 200)
 * Error: 400 { message: "Token inválido o expirado" }
 */
export async function resetPassword(token, nuevaClave) {
  const res = await apiClient.post("/auth/reset", { token, nuevaClave });
  return res?.status === 204 || res?.status === 200;
}
