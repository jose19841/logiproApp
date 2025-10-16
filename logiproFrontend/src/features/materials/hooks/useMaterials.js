// src/features/materials/hooks/useMaterials.js
import { useEffect, useState } from "react";
import { listMaterials } from "@/features/materials/services/materialsApi";

/**
 * Hook para listar materiales con filtros, paginado y orden
 * @param {Object} filters - Filtros: { page, size, cantidad, reclamoId, proveedorId, calidadId, tipoMaterialId, sortBy, sortDir }
 */
export default function useMaterials(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listMaterials(filters);

      // Si el backend devuelve un objeto paginado con content
      if (response?.content) {
        setData(response.content || []);
        setPagination({
          page: response.number || 0,
          size: response.size || 10,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0
        });
      } else {
        // Si devuelve un array directo
        setData(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error("Error loading materials:", err);
      setError(err?.response?.data?.mensaje || err?.message || "No se pudo cargar el listado de materiales.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [JSON.stringify(filters)]);

  const reload = () => load();

  return { data, loading, error, pagination, reload };
}
