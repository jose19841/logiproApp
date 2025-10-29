// src/features/orders/hooks/useUpdateOrder.js
import { useState } from "react";
import { updateOrder } from "@/features/orders/services/ordersApi";

/**
 * Hook para actualizar un pedido existente
 */
export default function useUpdateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateOrderFn = async (id, dto) => {
    setLoading(true);
    setError("");
    try {
      const response = await updateOrder(id, dto);
      return response;
    } catch (err) {
      console.error("Error updating order:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo actualizar el pedido.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderFn, loading, error };
}
