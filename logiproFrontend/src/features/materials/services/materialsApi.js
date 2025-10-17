// src/features/materials/services/materialsApi.js
import apiClient from "@shared/services/apiClient";

const BASE_PATH = "/api/materiales";

/**
 * GET /api/materiales
 * @param {Object} params - { page, size, cantidad, proveedorId, calidadId, tipoMaterialId }
 */
export async function listMaterials(params = {}) {
  const { data } = await apiClient.get(BASE_PATH, { params });
  return data;
}

/**
 * GET /api/materiales/{id}
 * @param {number} id - Material ID
 */
export async function getMaterialById(id) {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
}

/**
 * POST /api/materiales
 * @param {Object} dto - { cantidad, proveedorId, calidadId, tipoMaterialId }
 */
export async function createMaterial(dto) {
  const { data } = await apiClient.post(BASE_PATH, dto);
  return data;
}

/**
 * PUT /api/materiales/{id}
 * @param {number} id - Material ID
 * @param {Object} dto - { cantidad, proveedorId, calidadId, tipoMaterialId }
 */
export async function updateMaterial(id, dto) {
  const { data } = await apiClient.put(`${BASE_PATH}/${id}`, dto);
  return data;
}

/**
 * DELETE /api/materiales/{id}
 * @param {number} id - Material ID
 */
export async function deleteMaterial(id) {
  const { data } = await apiClient.delete(`${BASE_PATH}/${id}`);
  return data;
}
