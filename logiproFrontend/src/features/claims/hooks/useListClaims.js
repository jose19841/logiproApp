// src/features/claims/hooks/useListClaims.js
import { useEffect, useState } from "react";
import { listClaims } from "@/features/claims/services/claimsApi";

export default function useListClaims() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listClaims();
      setRows(data || []);
    } catch (error) {
      console.error("Error loading claims:", error);
      setErr(error?.response?.data?.mensaje || error?.message || "No se pudo cargar el listado de reclamos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reload = () => load();

  return { rows, loading, err, reload };
}
