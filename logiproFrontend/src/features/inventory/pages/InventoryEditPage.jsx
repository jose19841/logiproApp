// src/features/inventory/pages/InventoryEditPage.jsx
import { useParams, useNavigate } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import useInventoryDetail from "@/features/inventory/hooks/useInventoryDetail";
import useUpdateInventory from "@/features/inventory/hooks/useUpdateInventory";
import InventoryForm from "@/features/inventory/components/InventoryForm";

export default function InventoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const { inventario, loading: loadingDetail, error: errorDetail } = useInventoryDetail(id);
  const { updateInventarioFn, loading: updating } = useUpdateInventory();

  const handleSubmit = async (dto) => {
    const confirmed = await toast.showConfirm(
      "¿Actualizar inventario?",
      "Se actualizará el inventario con los datos ingresados.",
      "Actualizar",
      "Cancelar"
    );
    if (!confirmed) return;

    try {
      const response = await updateInventarioFn(id, dto);
      toast.showSuccess("Inventario actualizado", `El inventario #${response.id} ha sido actualizado exitosamente.`);
      navigate("/inventory");
    } catch (error) {
      toast.showError(
        "Error al actualizar inventario",
        error?.response?.data?.mensaje || error?.message || "No se pudo actualizar el inventario"
      );
    }
  };

  const handleCancel = () => {
    navigate("/inventory");
  };

  if (loadingDetail) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando inventario...</p>
        </div>
      </div>
    );
  }

  if (errorDetail) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errorDetail}
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={handleCancel}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Inventario
        </button>
      </div>
    );
  }

  if (!inventario) {
    return (
      <div className="container-fluid">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No se encontró el inventario.
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={handleCancel}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Inventario
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Editar Inventario #{inventario.id}</h4>
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
            initialValues={inventario}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={updating}
            submitLabel="Actualizar Inventario"
          />
        </div>
      </div>
    </div>
  );
}
