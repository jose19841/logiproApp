// src/features/orders/hooks/useOrders.js
import { useEffect, useState, useRef } from "react";
import { listOrders } from "@/features/orders/services/ordersApi";

/**
 * Hook para listar pedidos con filtros, paginado y orden
 * @param {Object} filters - Filtros: { proveedorId, estado, fechaDesde, fechaHasta, materialId, numeroPedido, usuarioId, page, size, sortBy, sortDir }
 */
export default function useOrders(filters = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const debounceTimer = useRef(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await listOrders(filters);

      // Si el backend devuelve un objeto paginado con content
      if (response?.content) {
        setData(response.content || []);
        setPagination({
          page: response.number || 0,
          size: response.size || 10,
          totalElements: response.totalElements || 0,
          totalPages: response.totalPages || 0
        });
      } else {
        // Si devuelve un array directo
        setData(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setError(err?.response?.data?.mensaje || err?.message || "No se pudo cargar el listado de pedidos.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [
    filters.proveedorId,
    filters.estado,
    filters.fechaDesde,
    filters.fechaHasta,
    filters.materialId,
    filters.numeroPedido,
    filters.usuarioId
  ]);

  const reload = () => load();

  return { data, loading, error, pagination, reload };
}
