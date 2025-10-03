// src/features/users/services/userApi.js
import apiClient from "@shared/services/apiClient";

/**
 * POST /api/usuarios/registrar
 * Envía Bearer JWT SIN tocar apiClient.
 */
export async function registerUser(form) {
  const token =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No hay sesión válida (falta accessToken).");
  }

  const { data } = await apiClient.post("/api/usuarios/registrar", form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
