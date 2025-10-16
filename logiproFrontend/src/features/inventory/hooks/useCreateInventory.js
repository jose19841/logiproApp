// src/features/inventory/hooks/useCreateInventory.js
import { useState } from "react";
import { createInventario } from "@/features/inventory/services/inventoryApi";

/**
 * Hook para crear un inventario
 * @returns {Object} { createInventarioFn, loading, error, success }
 */
export default function useCreateInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const createInventarioFn = async (dto) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await createInventario(dto);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error creating inventory:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo crear el inventario.";
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

  return { createInventarioFn, loading, error, success, reset };
}
