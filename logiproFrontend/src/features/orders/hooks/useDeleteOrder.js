// src/features/orders/hooks/useDeleteOrder.js
import { useState } from "react";
import { deleteOrder } from "@/features/orders/services/ordersApi";

/**
 * Hook para eliminar un pedido
 */
export default function useDeleteOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const deleteOrderFn = async (id) => {
    setLoading(true);
    setError("");
    try {
      const response = await deleteOrder(id);
      return response;
    } catch (err) {
      console.error("Error deleting order:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo eliminar el pedido.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrderFn, loading, error };
}
