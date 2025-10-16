// src/features/materials/pages/MaterialCreatePage.jsx
import { useNavigate } from "react-router-dom";
import { alertConfirm, alertError, alertSuccess } from "@shared/components/alerts/swal";
import useCreateMaterial from "@/features/materials/hooks/useCreateMaterial";
import MaterialForm from "@/features/materials/components/MaterialForm";

export default function MaterialCreatePage() {
  const navigate = useNavigate();
  const { createMaterialFn, loading } = useCreateMaterial();

  const handleSubmit = async (dto) => {
    const ok = await alertConfirm(
      "¿Crear material?",
      "Se creará un nuevo material con los datos ingresados."
    );
    if (!ok.isConfirmed) return;

    try {
      const response = await createMaterialFn(dto);
      await alertSuccess("Material creado", `El material #${response.id} ha sido creado exitosamente.`);
      navigate("/materials");
    } catch (error) {
      alertError(
        "Error al crear material",
        error?.response?.data?.mensaje || error?.message || "No se pudo crear el material"
      );
    }
  };

  const handleCancel = () => {
    navigate("/materials");
  };

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Nuevo Material</h4>
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
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            submitLabel="Crear Material"
          />
        </div>
      </div>
    </div>
  );
}
