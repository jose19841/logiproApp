// src/features/orders/pages/OrderCreatePage.jsx
import { useNavigate } from "react-router-dom";
import { alertError, alertSuccess } from "@shared/components/alerts/swal";
import useCreateOrder from "@/features/orders/hooks/useCreateOrder";
import OrderForm from "@/features/orders/components/OrderForm";

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const { createOrderFn, loading } = useCreateOrder();

  const handleSubmit = async (dto) => {
    try {
      const response = await createOrderFn(dto);
      await alertSuccess(
        "Pedido creado",
        `El pedido #${response.numeroPedido} ha sido creado exitosamente.`
      );
      navigate("/orders");
    } catch (err) {
      alertError(
        "Error",
        err?.response?.data?.mensaje || err?.message || "No se pudo crear el pedido"
      );
    }
  };

  const handleCancel = () => {
    navigate("/orders");
  };

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
          <h4 className="mb-0">Crear Nuevo Pedido</h4>
        </div>
        <p className="text-muted mb-0">
          Complete el formulario para registrar un nuevo pedido de materiales.
        </p>
      </div>

      {/* Form Card */}
      <div className="card">
        <div className="card-body">
          <OrderForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitLabel="Crear Pedido"
            isEdit={false}
          />
        </div>
      </div>
    </div>
  );
}
