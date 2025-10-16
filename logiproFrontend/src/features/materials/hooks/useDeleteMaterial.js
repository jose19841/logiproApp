// src/features/materials/hooks/useDeleteMaterial.js
import { useState } from "react";
import { deleteMaterial } from "@/features/materials/services/materialsApi";

/**
 * Hook para eliminar un material
 * @returns {Object} { deleteMaterialFn, loading, error, success }
 */
export default function useDeleteMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const deleteMaterialFn = async (id) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await deleteMaterial(id);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error deleting material:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo eliminar el material.";
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

  return { deleteMaterialFn, loading, error, success, reset };
}
