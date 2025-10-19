// src/features/materials/components/MaterialFilters.jsx
import { useState, useEffect } from "react";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";
import apiClient from "@shared/services/apiClient";

/**
 * Componente de filtros para materiales
 * @param {Object} filters - Filtros actuales
 * @param {Function} onFilterChange - Callback al cambiar filtros
 * @param {Function} onClearFilters - Callback para limpiar filtros
 */
export default function MaterialFilters({ filters = {}, onFilterChange, onClearFilters }) {
  const [suppliers, setSuppliers] = useState([]);
  const [tiposMaterial, setTiposMaterial] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersData, tiposData] = await Promise.all([
          listSuppliers().catch(() => []),
          apiClient.get("/api/materiales/tipos-material").then(res => res.data).catch(() => [])
        ]);

        setSuppliers(suppliersData || []);
        setTiposMaterial(tiposData || []);
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
    filters.tipoMaterialId ||
    filters.cantidadMin ||
    filters.cantidadMax;

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row g-3">
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

          {/* Tipo de Material */}
          <div className="col-md-3">
            <label htmlFor="filter-tipoMaterialId" className="form-label small">
              Tipo de Material
            </label>
            <select
              id="filter-tipoMaterialId"
              className="form-select"
              value={filters.tipoMaterialId || ""}
              onChange={(e) => handleChange("tipoMaterialId", e.target.value)}
              disabled={loading}
            >
              <option value="">Todos</option>
              {tiposMaterial.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre || `#${tipo.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Rango de Cantidad - Mínimo */}
          <div className="col-md-3">
            <label htmlFor="filter-cantidadMin" className="form-label small">
              Cantidad Mín.
            </label>
            <input
              type="number"
              id="filter-cantidadMin"
              className="form-control"
              placeholder="Min"
              value={filters.cantidadMin || ""}
              onChange={(e) => handleChange("cantidadMin", e.target.value)}
              min="0"
            />
          </div>

          {/* Rango de Cantidad - Máximo */}
          <div className="col-md-3">
            <label htmlFor="filter-cantidadMax" className="form-label small">
              Cantidad Máx.
            </label>
            <input
              type="number"
              id="filter-cantidadMax"
              className="form-control"
              placeholder="Max"
              value={filters.cantidadMax || ""}
              onChange={(e) => handleChange("cantidadMax", e.target.value)}
              min="0"
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
