// src/features/orders/components/OrderFilters.jsx
import { useState, useEffect } from "react";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";
import { listMaterials } from "@/features/materials/services/materialsApi";

/**
 * Componente de filtros para pedidos
 * @param {Object} filters - Filtros actuales
 * @param {Function} onFilterChange - Callback al cambiar filtros
 * @param {Function} onClearFilters - Callback para limpiar filtros
 */
export default function OrderFilters({ filters = {}, onFilterChange, onClearFilters }) {
  const [suppliers, setSuppliers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  const estados = [
    { value: "PENDIENTE", label: "Pendiente" },
    { value: "EN_PROCESO", label: "En Proceso" },
    { value: "RECIBIDO", label: "Recibido" },
    { value: "CANCELADO", label: "Cancelado" }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, materialsData] = await Promise.all([
          listSuppliers().catch(() => []),
          listMaterials().catch(() => [])
        ]);

        setSuppliers(suppliersData || []);
        // Si materials devuelve un objeto paginado
        setMaterials(materialsData?.content || materialsData || []);
      } catch (error) {
        console.error("Error loading filter data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field, value) => {
    onFilterChange?.({ ...filters, [field]: value });
  };

  const hasActiveFilters =
    filters.proveedorId ||
    filters.estado ||
    filters.fechaDesde ||
    filters.fechaHasta ||
    filters.numeroPedido ||
    filters.materialId;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3">
          {/* Número de Pedido */}
          <div className="col-md-3">
            <label htmlFor="filter-numeroPedido" className="form-label small">
              Número de Pedido
            </label>
            <input
              type="text"
              id="filter-numeroPedido"
              className="form-control"
              placeholder="Ej: PED-2025-001"
              value={filters.numeroPedido || ""}
              onChange={(e) => handleChange("numeroPedido", e.target.value)}
            />
          </div>

          {/* Proveedor */}
          <div className="col-md-3">
            <label htmlFor="filter-proveedorId" className="form-label small">
              Proveedor
            </label>
            <select
              id="filter-proveedorId"
              className="form-select"
              value={filters.proveedorId || ""}
              onChange={(e) => handleChange("proveedorId", e.target.value)}
              disabled={loading}
            >
              <option value="">Todos</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div className="col-md-3">
            <label htmlFor="filter-estado" className="form-label small">
              Estado
            </label>
            <select
              id="filter-estado"
              className="form-select"
              value={filters.estado || ""}
              onChange={(e) => handleChange("estado", e.target.value)}
            >
              <option value="">Todos</option>
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
          </div>

          {/* Material */}
          <div className="col-md-3">
            <label htmlFor="filter-materialId" className="form-label small">
              Material
            </label>
            <select
              id="filter-materialId"
              className="form-select"
              value={filters.materialId || ""}
              onChange={(e) => handleChange("materialId", e.target.value)}
              disabled={loading}
            >
              <option value="">Todos</option>
              {materials.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.tipoMaterialNombre || `Material #${material.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha Desde */}
          <div className="col-md-3">
            <label htmlFor="filter-fechaDesde" className="form-label small">
              Fecha Desde
            </label>
            <input
              type="date"
              id="filter-fechaDesde"
              className="form-control"
              value={filters.fechaDesde || ""}
              onChange={(e) => handleChange("fechaDesde", e.target.value)}
            />
          </div>

          {/* Fecha Hasta */}
          <div className="col-md-3">
            <label htmlFor="filter-fechaHasta" className="form-label small">
              Fecha Hasta
            </label>
            <input
              type="date"
              id="filter-fechaHasta"
              className="form-control"
              value={filters.fechaHasta || ""}
              onChange={(e) => handleChange("fechaHasta", e.target.value)}
            />
          </div>
        </div>

        {/* Botón limpiar filtros */}
        {hasActiveFilters && (
          <div className="mt-3">
            <button
              type="button"
              className="btn btn-link btn-sm p-0"
              onClick={onClearFilters}
            >
              <i className="bi bi-x-circle me-1"></i>
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
