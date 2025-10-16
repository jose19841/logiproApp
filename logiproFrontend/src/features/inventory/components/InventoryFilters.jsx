// src/features/inventory/components/InventoryFilters.jsx
import { useState, useEffect } from "react";
import { listMaterials } from "@/features/materials/services/materialsApi";
import apiClient from "@shared/services/apiClient";

export default function InventoryFilters({ filters, onFilterChange, onClearFilters }) {
  const [sectores, setSectores] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [localFilters, setLocalFilters] = useState({
    inicio: filters.inicio || 0,
    limite: filters.limite || 20,
    sectorId: filters.sectorId || "",
    materialId: filters.materialId || ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectoresData, materialesData] = await Promise.all([
          apiClient.get("/api/inventario/sectores").then(res => res.data).catch(() => []),
          listMaterials().catch(() => [])
        ]);

        setSectores(sectoresData || []);
        setMateriales(materialesData || []);
      } catch (error) {
        console.error("Error loading filter data:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    const filtersToApply = {};
    if (localFilters.inicio) filtersToApply.inicio = parseInt(localFilters.inicio, 10);
    if (localFilters.limite) filtersToApply.limite = parseInt(localFilters.limite, 10);
    if (localFilters.sectorId) filtersToApply.sectorId = parseInt(localFilters.sectorId, 10);
    if (localFilters.materialId) filtersToApply.materialId = parseInt(localFilters.materialId, 10);

    onFilterChange?.(filtersToApply);
  };

  const handleClear = () => {
    setLocalFilters({
      inicio: 0,
      limite: 20,
      sectorId: "",
      materialId: ""
    });
    onClearFilters?.();
  };

  if (loadingData) {
    return (
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="spinner-border spinner-border-sm text-primary" role="status">
            <span className="visually-hidden">Cargando filtros...</span>
          </div>
          <span className="ms-2 text-muted">Cargando filtros...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h6 className="card-title mb-3">Filtros</h6>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="inicio" className="form-label">Inicio</label>
            <input
              type="number"
              id="inicio"
              name="inicio"
              className="form-control"
              value={localFilters.inicio}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="limite" className="form-label">Límite</label>
            <input
              type="number"
              id="limite"
              name="limite"
              className="form-control"
              value={localFilters.limite}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div className="col-md-3">
            <label htmlFor="sectorId" className="form-label">Sector</label>
            <select
              id="sectorId"
              name="sectorId"
              className="form-select"
              value={localFilters.sectorId}
              onChange={handleChange}
            >
              <option value="">-- Todos --</option>
              {sectores.map((sector) => (
                <option key={sector.id} value={sector.id}>
                  {sector.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3">
            <label htmlFor="materialId" className="form-label">Material</label>
            <select
              id="materialId"
              name="materialId"
              className="form-select"
              value={localFilters.materialId}
              onChange={handleChange}
            >
              <option value="">-- Todos --</option>
              {materiales.map((material) => (
                <option key={material.id} value={material.id}>
                  Material #{material.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={handleApplyFilters}
          >
            <i className="bi bi-funnel me-2"></i>
            Aplicar Filtros
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClear}
          >
            <i className="bi bi-x-circle me-2"></i>
            Limpiar
          </button>
        </div>
      </div>
    </div>
  );
}
