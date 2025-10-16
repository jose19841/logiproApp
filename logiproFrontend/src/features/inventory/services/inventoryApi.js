// src/features/inventory/services/inventoryApi.js
import apiClient from "@shared/services/apiClient";

const BASE_PATH = "/api/inventario";

/**
 * POST /api/inventario
 * Crea un registro de inventario para un material en un sector
 * @param {import('./types').CrearInventarioRequest} dto
 * @returns {Promise<import('./types').InventarioResponse>}
 */
export async function createInventario(dto) {
  const { data } = await apiClient.post(BASE_PATH, dto);
  return data;
}

/**
 * GET /api/inventario
 * Lista inventario con paginación y filtros opcionales
 * @param {import('./types').ListarInventarioParams} params
 * @returns {Promise<import('./types').InventarioResponse[]>}
 */
export async function listInventario(params = {}) {
  const { data } = await apiClient.get(BASE_PATH, { params });
  return data;
}

/**
 * GET /api/inventario/{id}
 * Obtiene un registro de inventario por ID
 * @param {number} id - Inventario ID
 * @returns {Promise<import('./types').InventarioResponse>}
 */
export async function getInventarioById(id) {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
}

/**
 * PUT /api/inventario/{id}
 * Actualiza cantidades mín./máx. y/o reasigna sector/material
 * @param {number} id - Inventario ID
 * @param {import('./types').ActualizarInventarioRequest} dto
 * @returns {Promise<import('./types').InventarioResponse>}
 */
export async function updateInventario(id, dto) {
  const { data } = await apiClient.put(`${BASE_PATH}/${id}`, dto);
  return data;
}

/**
 * DELETE /api/inventario/{id}
 * Elimina un registro de inventario
 * @param {number} id - Inventario ID
 * @returns {Promise<void>}
 */
export async function deleteInventario(id) {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
