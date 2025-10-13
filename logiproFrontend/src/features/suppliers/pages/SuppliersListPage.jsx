// src/features/suppliers/pages/SuppliersListPage.jsx
import useListSuppliers from "@/features/suppliers/hooks/useListSuppliers";
import DataTable from "@shared/components/DataTable";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SuppliersListPage() {
  const navigate = useNavigate();
  const { rows, loading, err, reload } = useListSuppliers();
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID", sortable: true, align: "center" },
      { key: "nombre", label: "Name", sortable: true },
      {
        key: "descripcion",
        label: "Description",
        sortable: true,
        render: (value) => (
          <span className="text-muted">
            {value || "-"}
          </span>
        )
      },
      {
        key: "acciones",
        label: "",
        align: "end",
        render: (_, row) => (
          <div className="dropdown">
            <button
              className="btn btn-sm btn-outline-secondary border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Actions"
              title="Actions"
              style={{ fontSize: '18px', lineHeight: 1 }}
            >
              ⋮
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{minWidth: '200px'}}>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => setSelectedSupplier(row)}
                >
                  <i className="bi bi-eye text-primary"></i>
                  Ver Detalles
                </button>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => navigate(`/suppliers/${row.id}/edit`)}
                >
                  <i className="bi bi-pencil text-warning"></i>
                  Editar
                </button>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    [navigate]
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
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        error={err}
        emptyMessage="No suppliers yet."
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
                        <h6 className="card-title text-muted mb-3">
                          <i className="bi bi-info-circle me-2"></i>
                          Informacion Proveedor
                        </h6>
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label text-muted small">ID</label>
                            <p className="fw-semibold mb-2">
                              <code className="bg-white px-2 py-1 rounded">{selectedSupplier.id}</code>
                            </p>
                          </div>
                          <div className="col-md-8">
                            <label className="form-label text-muted small">Nombre</label>
                            <p className="fw-semibold mb-2">{selectedSupplier.nombre || 'Not specified'}</p>
                          </div>
                          <div className="col-12">
                            <label className="form-label text-muted small">Descripcion</label>
                            <p className="fw-semibold mb-0">{selectedSupplier.descripcion || 'Not specified'}</p>
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
                  Edit Proveedor
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
