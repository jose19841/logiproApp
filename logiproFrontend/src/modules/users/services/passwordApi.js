import apiClient from "../../../services/apiClient";

/**
 * PUT /api/usuarios/mi-clave
 * Cambia la clave del usuario autenticado.
 * payload: { claveActual, nuevaClave, confirmarClave }
 * Respuesta esperada: 204 No Content
 */
export async function changeMyPassword(payload) {
  const token =
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("No hay sesión válida (falta accessToken).");
  }

  await apiClient.put("/api/usuarios/mi-clave", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
