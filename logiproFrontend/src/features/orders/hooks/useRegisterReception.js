// src/features/orders/hooks/useRegisterReception.js
import { useState } from "react";
import { registerReception } from "@/features/orders/services/ordersApi";

/**
 * Hook para registrar la recepción de un pedido
 */
export default function useRegisterReception() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const registerReceptionFn = async (dto) => {
    setLoading(true);
    setError("");
    try {
      const response = await registerReception(dto);
      return response;
    } catch (err) {
      console.error("Error registering reception:", err);
      const errorMsg = err?.response?.data?.mensaje || err?.message || "No se pudo registrar la recepción del pedido.";
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { registerReceptionFn, loading, error };
}
