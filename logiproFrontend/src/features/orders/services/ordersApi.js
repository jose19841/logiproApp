// src/features/orders/services/ordersApi.js
import apiClient from "@shared/services/apiClient";

const BASE_PATH = "/api/pedidos";

/**
 * GET /api/pedidos
 * @param {Object} params - { proveedorId, estado, fechaDesde, fechaHasta, materialId, numeroPedido, usuarioId, page, size, sortBy, sortDir }
 */
export async function listOrders(params = {}) {
  const { data } = await apiClient.get(BASE_PATH, { params });
  return data;
}

/**
 * GET /api/pedidos/{id}
 * @param {number} id - Order ID
 */
export async function getOrderById(id) {
  const { data } = await apiClient.get(`${BASE_PATH}/${id}`);
  return data;
}

/**
 * POST /api/pedidos
 * @param {Object} dto - { proveedorId, fechaPedido, fechaEntregaEstimada, observaciones, usuarioId, detalles: [{ materialId, cantidadSolicitada, precioUnitario }] }
 */
export async function createOrder(dto) {
  const { data } = await apiClient.post(BASE_PATH, dto);
  return data;
}

/**
 * PUT /api/pedidos/{id}
 * @param {number} id - Order ID
 * @param {Object} dto - { fechaPedido, fechaEntregaEstimada, observaciones, detalles }
 */
export async function updateOrder(id, dto) {
  const { data } = await apiClient.put(`${BASE_PATH}/${id}`, dto);
  return data;
}

/**
 * DELETE /api/pedidos/{id}
 * @param {number} id - Order ID
 */
export async function deleteOrder(id) {
  const { data } = await apiClient.delete(`${BASE_PATH}/${id}`);
  return data;
}

/**
 * PATCH /api/pedidos/{id}/estado?nuevoEstado={estado}
 * @param {number} id - Order ID
 * @param {string} nuevoEstado - PENDIENTE | EN_PROCESO | CANCELADO
 */
export async function changeOrderStatus(id, nuevoEstado) {
  const { data } = await apiClient.patch(`${BASE_PATH}/${id}/estado`, null, {
    params: { nuevoEstado }
  });
  return data;
}

/**
 * POST /api/pedidos/recepcion
 * @param {Object} dto - { pedidoId, fechaEntregaReal, detallesRecepcion: [{ materialId, cantidadRecibida }] }
 */
export async function registerReception(dto) {
  const { data } = await apiClient.post(`${BASE_PATH}/recepcion`, dto);
  return data;
}
