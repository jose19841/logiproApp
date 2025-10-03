// src/features/users/services/userList.js
import apiClient from "@shared/services/apiClient";

const BASE = "/api/usuarios";

// Adjunta Authorization desde storage (solo sessionStorage, sin refresh automático)
function authHeaders() {
  const token = sessionStorage.getItem("accessToken"); // ← solo sessionStorage
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * GET /api/usuarios
 * Trae todos los usuarios
 */
export async function fetchUsers() {
  const { data } = await apiClient.get(BASE, { headers: authHeaders() });
  return data;
}

/**
 * GET /api/usuarios/{id}
 * Trae el detalle de un usuario
 */
export async function fetchUserById(id) {
  const { data } = await apiClient.get(`${BASE}/${id}`, { headers: authHeaders() });
  return data;
}

/**
 * PATCH /api/usuarios/{id}/estado?estado=REGISTRADO|ACTIVO|INACTIVO|SUSPENDIDO
 * Cambia el estado del usuario
 */
export async function changeUserState(id, estado) {
  const { data } = await apiClient.patch(
    `${BASE}/${id}/estado`,
    null,
    { params: { estado }, headers: authHeaders() }
  );
  return data;
}

/**
 * PUT /api/usuarios/{id}
 * Actualiza datos de un usuario
 */
export async function updateUser(id, payload) {
  const { data } = await apiClient.put(
    `${BASE}/${id}`,
    payload,
    { headers: authHeaders() }
  );
  return data;
}
