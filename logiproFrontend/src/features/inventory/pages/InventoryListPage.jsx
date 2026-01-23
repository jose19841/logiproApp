// src/features/inventory/pages/InventoryListPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import useInventory from "@/features/inventory/hooks/useInventory";
import useDeleteInventory from "@/features/inventory/hooks/useDeleteInventory";
import InventoryFilters from "@/features/inventory/components/InventoryFilters";
import InventoryList from "@/features/inventory/components/InventoryList";
import InventoryDetail from "@/features/inventory/components/InventoryDetail";

export default function InventoryListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [filters, setFilters] = useState({});
  const [selectedInventario, setSelectedInventario] = useState(null);

  const { data, loading, error, reload } = useInventory(filters);
  const { deleteInventarioFn, loading: deleting } = useDeleteInventory();

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleView = (inventario) => {
    setSelectedInventario(inventario);
  };

  const handleEdit = (inventario) => {
    navigate(`/inventory/${inventario.id}/edit`);
  };

  const handleDelete = async (inventario) => {
    const confirmed = await toast.showConfirm(
      "¿Eliminar inventario?",
      `¿Está seguro que desea eliminar el inventario #${inventario.id}? Esta acción no se puede deshacer.`,
      "Eliminar",
      "Cancelar"
    );
    if (!confirmed) return;

    try {
      await deleteInventarioFn(inventario.id);
      toast.showSuccess("Inventario eliminado", `El inventario #${inventario.id} ha sido eliminado exitosamente.`);
      reload();
    } catch (err) {
      toast.showError("Error", err?.response?.data?.mensaje || err?.message || "No se pudo eliminar el inventario");
    }
  };

  const handleCloseDetail = () => {
    setSelectedInventario(null);
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Inventario</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/inventory/new")}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Nuevo Inventario
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
      <InventoryFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Table */}
      <InventoryList
        data={data}
        loading={loading}
        error={error}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Detail Modal */}
      {selectedInventario && (
        <InventoryDetail
          inventario={selectedInventario}
          onClose={handleCloseDetail}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
