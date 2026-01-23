// src/features/materials/pages/MaterialCreatePage.jsx
import { useNavigate } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import useCreateMaterial from "@/features/materials/hooks/useCreateMaterial";
import MaterialForm from "@/features/materials/components/MaterialForm";

export default function MaterialCreatePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { createMaterialFn, loading } = useCreateMaterial();

  const handleSubmit = async (dto) => {
    const confirmed = await toast.showConfirm(
      "¿Crear material?",
      "Se creará un nuevo material con los datos ingresados.",
      "Crear",
      "Cancelar"
    );
    if (!confirmed) return;

    try {
      const response = await createMaterialFn(dto);
      toast.showSuccess("Material creado", `El material #${response.id} ha sido creado exitosamente.`);
      navigate("/materials");
    } catch (error) {
      toast.showError(
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
