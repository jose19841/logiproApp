// src/features/inventory/hooks/useDeleteInventory.js
import { useState } from "react";
import { deleteInventario } from "@/features/inventory/services/inventoryApi";

/**
 * Hook para eliminar un inventario
 * @returns {Object} { deleteInventarioFn, loading, error, success }
 */
export default function useDeleteInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const deleteInventarioFn = async (id) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await deleteInventario(id);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error deleting inventory:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo eliminar el inventario.";
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

  return { deleteInventarioFn, loading, error, success, reset };
}
