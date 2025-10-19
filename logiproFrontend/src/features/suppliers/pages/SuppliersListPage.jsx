// src/features/suppliers/pages/SuppliersListPage.jsx
import useListSuppliers from "@/features/suppliers/hooks/useListSuppliers";
import DataTable from "@shared/components/DataTable";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertConfirm, alertError, alertSuccess } from "@shared/components/alerts/swal";
import { changeSupplierStatus } from "@/features/suppliers/services/suppliersApi";

export default function SuppliersListPage() {
  const navigate = useNavigate();
  const { rows, loading, err, reload } = useListSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleChangeStatus = async (supplier) => {
    const action = supplier.habilitado ? "inhabilitar" : "habilitar";
    const ok = await alertConfirm(
      `¿${action.charAt(0).toUpperCase() + action.slice(1)} proveedor?`,
      `¿Está seguro de que desea ${action} al proveedor "${supplier.nombre}"?`
    );
    if (!ok.isConfirmed) return;

    try {
      await changeSupplierStatus(supplier.id, !supplier.habilitado);
      await alertSuccess(
        "Estado actualizado",
        `El proveedor "${supplier.nombre}" ha sido ${action === "habilitar" ? "habilitado" : "inhabilitado"}.`
      );
      reload();
    } catch (error) {
      console.error("Error changing supplier status:", error);
      alertError("Error", error?.response?.data?.mensaje || error?.message || "No se pudo cambiar el estado");
    }
  };

  const columns = useMemo(
    () => [
      { key: "id", label: "ID", sortable: true, align: "center" },
      { key: "nombre", label: "Nombre", sortable: true },
      {
        key: "descripcion",
        label: "Descripción",
        sortable: true,
        render: (value) => value || "-"
      },
      {
        key: "habilitado",
        label: "Estado",
        sortable: true,
        align: "center",
        render: (value) => (
          <span className={`badge bg-${value ? 'success' : 'danger'}`}>
            {value ? 'Habilitado' : 'Inhabilitado'}
          </span>
        )
      },
      {
        key: "acciones",
        label: "Acciones",
        align: "center",
        render: (_, row) => (
          <div className="btn-group btn-group-sm" role="group">
            <button
              className="btn btn-outline-primary"
              onClick={() => setSelectedSupplier(row)}
              title="Ver detalle"
            >
              <i className="bi bi-eye"></i>
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={() => navigate(`/suppliers/${row.id}/edit`)}
              title="Editar"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className={`btn btn-outline-${row.habilitado ? 'danger' : 'success'}`}
              onClick={() => handleChangeStatus(row)}
              title={row.habilitado ? 'Inhabilitar' : 'Habilitar'}
            >
              <i className={`bi bi-${row.habilitado ? 'x-circle' : 'check-circle'}`}></i>
            </button>
          </div>
        ),
      },
    ],
    [navigate, handleChangeStatus]
  );

  const closeModal = () => setSelectedSupplier(null);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Proveedores</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/suppliers/new")}
          >
            + Nuevo Proveedor
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={reload}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        error={err}
        emptyMessage="No hay proveedores registrados."
        rowKey="id"
      />

      {/* View Details Modal */}
      {selectedSupplier && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <i className="bi bi-truck me-2"></i>
                  Detalles Proveedor
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title mb-3">
                          <i className="bi bi-info-circle me-2"></i>
                          Información del Proveedor
                        </h6>
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label small">ID</label>
                            <p className="fw-semibold mb-2">
                              <code className="bg-white px-2 py-1 rounded">{selectedSupplier.id}</code>
                            </p>
                          </div>
                          <div className="col-md-8">
                            <label className="form-label small">Nombre</label>
                            <p className="fw-semibold mb-2">{selectedSupplier.nombre || 'No especificado'}</p>
                          </div>
                          <div className="col-12">
                            <label className="form-label small">Descripción</label>
                            <p className="fw-semibold mb-0">{selectedSupplier.descripcion || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    closeModal();
                    navigate(`/suppliers/${selectedSupplier.id}/edit`);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar Proveedor
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
