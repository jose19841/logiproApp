// src/features/suppliers/hooks/useListSuppliers.js
import { useEffect, useState } from "react";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";

export default function useListSuppliers() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    setLoading(true);
    setErr("");
    try {
      const data = await listSuppliers();
      setRows(data || []);
    } catch (error) {
      console.error("Error loading suppliers:", error);
      setErr(error?.response?.data?.mensaje || error?.message || "Error loading suppliers");
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
