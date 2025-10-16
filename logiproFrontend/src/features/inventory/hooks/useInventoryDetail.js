// src/features/inventory/hooks/useInventoryDetail.js
import { useEffect, useState } from "react";
import { getInventarioById } from "@/features/inventory/services/inventoryApi";

/**
 * Hook para obtener el detalle de un inventario por ID
 * @param {number|string} id - ID del inventario
 */
export default function useInventoryDetail(id) {
  const [inventario, setInventario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await getInventarioById(id);
      setInventario(data);
    } catch (err) {
      console.error("Error loading inventory detail:", err);
      setError(err?.response?.data?.mensaje || err?.message || "No se pudo cargar el detalle del inventario.");
      setInventario(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const reload = () => load();

  return { inventario, loading, error, reload };
}
