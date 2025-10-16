// src/features/inventory/services/types.js

/**
 * @typedef {Object} CrearInventarioRequest
 * @property {number} sectorId - ID del sector (requerido)
 * @property {number} materialId - ID del material (requerido)
 * @property {number} cantidadMinima - Cantidad mínima (>= 0, requerido)
 * @property {number} cantidadMaxima - Cantidad máxima (>= 0, requerido)
 */

/**
 * @typedef {Object} ActualizarInventarioRequest
 * @property {number} inventarioId - ID del inventario (requerido, se setea desde path param)
 * @property {number} [cantidadMinima] - Cantidad mínima (>= 0, opcional)
 * @property {number} [cantidadMaxima] - Cantidad máxima (>= 0, opcional)
 * @property {number} [sectorId] - ID del sector (opcional, para reasignación)
 * @property {number} [materialId] - ID del material (opcional, para reasignación)
 */

/**
 * @typedef {Object} ListarInventarioParams
 * @property {number} [inicio=0] - Offset de paginación (default: 0)
 * @property {number} [limite=20] - Límite de resultados (default: 20)
 * @property {number} [sectorId] - Filtro opcional por sector
 * @property {number} [materialId] - Filtro opcional por material
 */

/**
 * @typedef {Object} InventarioResponse
 * @property {number} id - ID del inventario
 * @property {number} cantidadMinima - Cantidad mínima configurada
 * @property {number} cantidadMaxima - Cantidad máxima configurada
 * @property {number} sectorId - ID del sector
 * @property {string} sectorNombre - Nombre del sector
 * @property {number} materialId - ID del material
 * @property {string} materialNombre - Nombre del material
 */

export {};
