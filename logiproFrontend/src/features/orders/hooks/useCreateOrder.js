// src/features/orders/hooks/useCreateOrder.js
import { useState } from "react";
import { createOrder } from "@/features/orders/services/ordersApi";

/**
 * Hook para crear un nuevo pedido
 */
export default function useCreateOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createOrderFn = async (dto) => {
    setLoading(true);
    setError("");
    try {
      const response = await createOrder(dto);
      return response;
    } catch (err) {
      console.error("Error creating order:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo crear el pedido.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrderFn, loading, error };
}
