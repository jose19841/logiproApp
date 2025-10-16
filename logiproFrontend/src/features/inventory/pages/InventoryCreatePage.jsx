// src/features/inventory/pages/InventoryCreatePage.jsx
import { useNavigate } from "react-router-dom";
import { alertConfirm, alertError, alertSuccess } from "@shared/components/alerts/swal";
import useCreateInventory from "@/features/inventory/hooks/useCreateInventory";
import InventoryForm from "@/features/inventory/components/InventoryForm";

export default function InventoryCreatePage() {
  const navigate = useNavigate();
  const { createInventarioFn, loading } = useCreateInventory();

  const handleSubmit = async (dto) => {
    const ok = await alertConfirm(
      "¿Crear inventario?",
      "Se creará un nuevo registro de inventario con los datos ingresados."
    );
    if (!ok.isConfirmed) return;

    try {
      const response = await createInventarioFn(dto);
      await alertSuccess("Inventario creado", `El inventario #${response.id} ha sido creado exitosamente.`);
      navigate("/inventory");
    } catch (error) {
      alertError(
        "Error al crear inventario",
        error?.response?.data?.mensaje || error?.message || "No se pudo crear el inventario"
      );
    }
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Nuevo Inventario</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={handleCancel}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Inventario
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <InventoryForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitLabel="Crear Inventario"
          />
        </div>
      </div>
    </div>
  );
}
