// src/features/materials/hooks/useMaterialDetail.js
import { useEffect, useState } from "react";
import { getMaterialById } from "@/features/materials/services/materialsApi";

/**
 * Hook para obtener el detalle de un material por ID
 * @param {number|string} id - ID del material
 */
export default function useMaterialDetail(id) {
  const [material, setMaterial] = useState(null);
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
      const data = await getMaterialById(id);
      setMaterial(data);
    } catch (err) {
      console.error("Error loading material detail:", err);
      setError(err?.response?.data?.mensaje || err?.message || "No se pudo cargar el detalle del material.");
      setMaterial(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const reload = () => load();

  return { material, loading, error, reload };
}
