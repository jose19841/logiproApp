// src/features/inventory/hooks/useUpdateInventory.js
import { useState } from "react";
import { updateInventario } from "@/features/inventory/services/inventoryApi";

/**
 * Hook para actualizar un inventario
 * @returns {Object} { updateInventarioFn, loading, error, success }
 */
export default function useUpdateInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateInventarioFn = async (id, dto) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await updateInventario(id, dto);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error updating inventory:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo actualizar el inventario.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError("");
    setSuccess(false);
  };

  return { updateInventarioFn, loading, error, success, reset };
}
