// src/features/materials/hooks/useUpdateMaterial.js
import { useState } from "react";
import { updateMaterial } from "@/features/materials/services/materialsApi";

/**
 * Hook para actualizar un material
 * @returns {Object} { updateMaterialFn, loading, error, success }
 */
export default function useUpdateMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateMaterialFn = async (id, dto) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await updateMaterial(id, dto);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error updating material:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo actualizar el material.";
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

  return { updateMaterialFn, loading, error, success, reset };
}
