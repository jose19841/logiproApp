// src/features/materials/pages/MaterialEditPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import { alertConfirm, alertError, alertSuccess } from "@shared/components/alerts/swal";
import useMaterialDetail from "@/features/materials/hooks/useMaterialDetail";
import useUpdateMaterial from "@/features/materials/hooks/useUpdateMaterial";
import MaterialForm from "@/features/materials/components/MaterialForm";

export default function MaterialEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { material, loading: loadingMaterial, error: errorMaterial } = useMaterialDetail(id);
  const { updateMaterialFn, loading: updating } = useUpdateMaterial();

  const handleSubmit = async (dto) => {
    const ok = await alertConfirm(
      "¿Actualizar material?",
      `Se actualizará el material #${id} con los nuevos datos.`
    );
    if (!ok.isConfirmed) return;

    try {
      await updateMaterialFn(id, dto);
      await alertSuccess("Material actualizado", `El material #${id} ha sido actualizado exitosamente.`);
      navigate("/materials");
    } catch (error) {
      alertError(
        "Error al actualizar material",
        error?.response?.data?.mensaje || error?.message || "No se pudo actualizar el material"
      );
    }
  };

  const handleCancel = () => {
    navigate("/materials");
  };

  if (loadingMaterial) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-2 text-muted">Cargando material...</p>
        </div>
      </div>
    );
  }

  if (errorMaterial) {
    return (
      <div className="container-fluid">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errorMaterial}
        </div>
        <button
          className="btn btn-outline-secondary"
          onClick={handleCancel}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Materiales
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Editar Material #{id}</h4>
        <button
          className="btn btn-outline-secondary"
          onClick={handleCancel}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Volver a Materiales
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <MaterialForm
            initialValues={material}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={updating}
            submitLabel="Actualizar Material"
          />
        </div>
      </div>
    </div>
  );
}
