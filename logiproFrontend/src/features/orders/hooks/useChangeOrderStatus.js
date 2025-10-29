// src/features/orders/hooks/useChangeOrderStatus.js
import { useState } from "react";
import { changeOrderStatus } from "@/features/orders/services/ordersApi";

/**
 * Hook para cambiar el estado de un pedido
 */
export default function useChangeOrderStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeStatusFn = async (id, nuevoEstado) => {
    setLoading(true);
    setError("");
    try {
      const response = await changeOrderStatus(id, nuevoEstado);
      return response;
    } catch (err) {
      console.error("Error changing order status:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo cambiar el estado del pedido.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { changeStatusFn, loading, error };
}
