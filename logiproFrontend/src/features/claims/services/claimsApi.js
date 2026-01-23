// src/features/claims/services/claimsApi.js
import apiClient from "@shared/services/apiClient";

const BASE_PATH = "/api/reclamos";

/**
 * POST /api/reclamos
 * @param {Object} dto - { numReclamo, descripcion, proveedorId, estado?, detalleReclamoId }
 */
export async function createClaim(dto) {
  const { data } = await apiClient.post(BASE_PATH, dto);
  return data;
}

/**
 * GET /api/reclamos
 */
export async function listClaims() {
  const { data } = await apiClient.get(BASE_PATH);
  return data;
}

/**
 * GET /api/reclamos/{id}
 */
export async function getClaimById(id) {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
}

/**
 * PATCH /api/reclamos/{id}/estado
 * @param {number} id - Claim ID
 * @param {string} estado - PENDIENTE | EN_PROCESO | RESUELTO | CERRADO
 */
export async function changeClaimState(id, estado) {
  const { data } = await apiClient.patch(`${BASE_PATH}/${id}/estado`, { estado });
  return data;
}

/**
 * GET /api/reclamos/estado/{estado}
 * @param {string} estado - PENDIENTE | EN_PROCESO | RESUELTO | CERRADO
 */
export async function listClaimsByEstado(estado) {
  const { data } = await apiClient.get(`${BASE_PATH}/estado/${estado}`);
  return data;
}

/**
 * DELETE /api/reclamos/{id}
 * @param {number} id - Claim ID
 */
export async function deleteClaim(id) {
  const { data } = await apiClient.delete(`${BASE_PATH}/${id}`);
  return data;
}
