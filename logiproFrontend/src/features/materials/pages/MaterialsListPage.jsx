// src/features/materials/pages/MaterialsListPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import useMaterials from "@/features/materials/hooks/useMaterials";
import useDeleteMaterial from "@/features/materials/hooks/useDeleteMaterial";
import MaterialFilters from "@/features/materials/components/MaterialFilters";
import MaterialList from "@/features/materials/components/MaterialList";
import MaterialDetail from "@/features/materials/components/MaterialDetail";

export default function MaterialsListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [filters, setFilters] = useState({});
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const { data, loading, error, reload } = useMaterials(filters);
  const { deleteMaterialFn, loading: deleting } = useDeleteMaterial();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleView = (material) => {
    setSelectedMaterial(material);
  };

  const handleEdit = (material) => {
    navigate(`/materials/${material.id}/edit`);
  };

  const handleDelete = async (material) => {
    const confirmed = await toast.showConfirm(
      "¿Eliminar material?",
      `¿Está seguro que desea eliminar el material #${material.id}? Esta acción no se puede deshacer.`,
      "Eliminar",
      "Cancelar"
    );
    if (!confirmed) return;

    try {
      await deleteMaterialFn(material.id);
      toast.showSuccess("Material eliminado", `El material #${material.id} ha sido eliminado exitosamente.`);
      reload();
    } catch (err) {
      toast.showError("Error", err?.response?.data?.mensaje || err?.message || "No se pudo eliminar el material");
    }
  };

  const handleCloseDetail = () => {
    setSelectedMaterial(null);
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Materiales</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/materials/new")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Material
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
      <MaterialFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <MaterialList
        data={data}
        loading={loading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Detail Modal */}
      {selectedMaterial && (
        <MaterialDetail
          material={selectedMaterial}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
