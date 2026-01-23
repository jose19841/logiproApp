// src/features/orders/pages/OrderEditPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import useOrderById from "@/features/orders/hooks/useOrderById";
import useUpdateOrder from "@/features/orders/hooks/useUpdateOrder";
import OrderForm from "@/features/orders/components/OrderForm";

export default function OrderEditPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams();
  const { data: order, loading: loadingOrder, error } = useOrderById(id);
  const { updateOrderFn, loading: updating } = useUpdateOrder();

  const handleSubmit = async (dto) => {
    try {
      const response = await updateOrderFn(id, dto);
      toast.showSuccess(
        "Pedido actualizado",
        `El pedido #${response.numeroPedido} ha sido actualizado exitosamente.`
      );
      navigate("/orders");
    } catch (err) {
      toast.showError(
        "Error",
        err?.response?.data?.mensaje || err?.message || "No se pudo actualizar el pedido"
      );
    }
  };

  const handleCancel = () => {
    navigate("/orders");
  };

  if (loadingOrder) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || "No se pudo cargar el pedido"}
        </div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    );
  }

  // No permitir editar pedidos recibidos o cancelados
  if (order.estado === "RECIBIDO" || order.estado === "CANCELADO") {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No se puede editar un pedido en estado {order.estado}
        </div>
        <button className="btn btn-secondary" onClick={handleCancel}>
          <i className="bi bi-arrow-left me-2"></i>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleCancel}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <h4 className="mb-0">Editar Pedido #{order.numeroPedido}</h4>
        </div>
        <p className="text-muted mb-0">
          Modifique los datos del pedido. Los cambios se guardarán al confirmar.
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        <div className="card-body">
          <OrderForm
            initialValues={order}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={updating}
            submitLabel="Actualizar Pedido"
            isEdit={true}
          />
        </div>
      </div>
    </div>
  );
}
