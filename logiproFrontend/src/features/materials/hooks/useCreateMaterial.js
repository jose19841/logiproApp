// src/features/materials/hooks/useCreateMaterial.js
import { useState } from "react";
import { createMaterial } from "@/features/materials/services/materialsApi";

/**
 * Hook para crear un material
 * @returns {Object} { createMaterialFn, loading, error, success }
 */
export default function useCreateMaterial() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const createMaterialFn = async (dto) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await createMaterial(dto);
      setSuccess(true);
      return response;
    } catch (err) {
      console.error("Error creating material:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo crear el material.";
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

  return { createMaterialFn, loading, error, success, reset };
}
