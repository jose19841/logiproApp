// src/features/orders/hooks/useOrderById.js
import { useEffect, useState } from "react";
import { getOrderById } from "@/features/orders/services/ordersApi";

/**
 * Hook para obtener un pedido por ID
 * @param {number} id - Order ID
 */
export default function useOrderById(id) {
  const [data, setData] = useState(null);
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
      const response = await getOrderById(id);
      setData(response);
    } catch (err) {
      console.error("Error loading order by id:", err);
      setError(err?.response?.data?.mensaje || err?.message || "No se pudo cargar el pedido.");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const reload = () => load();

  return { data, loading, error, reload };
}
