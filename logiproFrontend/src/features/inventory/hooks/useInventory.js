// src/features/inventory/hooks/useInventory.js
import { useEffect, useState } from "react";
import { listInventario } from "@/features/inventory/services/inventoryApi";

/**
 * Hook para listar inventario con filtros y paginación
 * @param {Object} filters - Filtros: { inicio, limite, sectorId, materialId }
 */
export default function useInventory(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listInventario(filters);
      setData(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error("Error loading inventory:", err);
      setError(err?.response?.data?.mensaje || err?.message || "No se pudo cargar el listado de inventario.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [JSON.stringify(filters)]);

  const reload = () => load();

  return { data, loading, error, reload };
}
