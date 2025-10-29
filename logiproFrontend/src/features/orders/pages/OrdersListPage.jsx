// src/features/orders/pages/OrdersListPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { alertConfirm, alertError, alertSuccess } from "@shared/components/alerts/swal";
import useOrders from "@/features/orders/hooks/useOrders";
import useDeleteOrder from "@/features/orders/hooks/useDeleteOrder";
import useChangeOrderStatus from "@/features/orders/hooks/useChangeOrderStatus";
import OrderFilters from "@/features/orders/components/OrderFilters";
import OrderList from "@/features/orders/components/OrderList";
import OrderDetail from "@/features/orders/components/OrderDetail";

export default function OrdersListPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data, loading, error, reload } = useOrders(filters);
  const { deleteOrderFn, loading: deleting } = useDeleteOrder();
  const { changeStatusFn, loading: changingStatus } = useChangeOrderStatus();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleView = (order) => {
    setSelectedOrder(order);
  };

  const handleEdit = (order) => {
    navigate(`/orders/${order.id}/edit`);
  };

  const handleDelete = async (order) => {
    const ok = await alertConfirm(
      "¿Eliminar pedido?",
      `¿Está seguro que desea eliminar el pedido #${order.numeroPedido}? Esta acción no se puede deshacer.`
    );
    if (!ok.isConfirmed) return;

    try {
      await deleteOrderFn(order.id);
      await alertSuccess("Pedido eliminado", `El pedido #${order.numeroPedido} ha sido eliminado exitosamente.`);
      reload();
    } catch (err) {
      alertError("Error", err?.response?.data?.mensaje || err?.message || "No se pudo eliminar el pedido");
    }
  };

  const handleChangeStatus = async (order) => {
    // Validar si puede cambiar de estado
    if (order.estado === "RECIBIDO" || order.estado === "CANCELADO") {
      alertError("No disponible", "No se puede cambiar el estado de un pedido recibido o cancelado.");
      return;
    }

    // Mostrar opciones de estado
    const result = await Swal.fire({
      title: "Cambiar estado",
      html: `<p>Pedido: <strong>${order.numeroPedido}</strong></p><p>Estado actual: <strong>${order.estado}</strong></p>`,
      input: "select",
      inputOptions: {
        "PENDIENTE": "Pendiente",
        "EN_PROCESO": "En Proceso",
        "RECIBIDO": "Recibido",
        "CANCELADO": "Cancelado"
      },
      inputPlaceholder: "Seleccione el nuevo estado",
      showCancelButton: true,
      confirmButtonText: "Cambiar",
      cancelButtonText: "Cancelar",
      didOpen: () => {
        const select = Swal.getInput();
        if (select) {
          select.style.width = '95%';
          select.style.margin = '0 auto';
        }
      }
    });

    if (!result.isConfirmed || !result.value) return;

    try {
      await changeStatusFn(order.id, result.value);
      await alertSuccess("Estado actualizado", `El estado del pedido ha sido actualizado a: ${result.value.replace(/_/g, " ")}`);
      reload();
    } catch (err) {
      alertError("Error", err?.response?.data?.mensaje || err?.message || "No se pudo cambiar el estado del pedido");
    }
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Pedidos</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/orders/new")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Pedido
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={reload}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            {loading ? "Actualizando..." : "Refrescar"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <OrderFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <OrderList
        data={data}
        loading={loading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangeStatus={handleChangeStatus}
      />

      {/* Detail Modal */}
      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
