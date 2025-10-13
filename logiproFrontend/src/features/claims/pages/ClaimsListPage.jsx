// src/features/claims/pages/ClaimsListPage.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertConfirm, alertError, alertSuccess } from "@shared/components/alerts/swal";
import DataTable from "@shared/components/DataTable";
import useListClaims from "@/features/claims/hooks/useListClaims";
import { changeClaimState } from "@/features/claims/services/claimsApi";

const ESTADOS = {
  PENDIENTE: { label: "Pendiente", variant: "warning" },
  EN_PROCESO: { label: "En Proceso", variant: "primary" },
  RESUELTO: { label: "Resuelto", variant: "success" },
  CERRADO: { label: "Cerrado", variant: "secondary" }
};

export default function ClaimsListPage() {
  const navigate = useNavigate();
  const { rows, loading, err, reload } = useListClaims();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Client-side filtering
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Filter by estado
    if (estadoFilter) {
      filtered = filtered.filter(row => row.estado === estadoFilter);
    }

    // Search by numReclamo or descripcion
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(row =>
        row.numReclamo?.toLowerCase().includes(term) ||
        row.descripcion?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [rows, estadoFilter, searchTerm]);

  const columns = useMemo(
    () => [
      { key: "id", label: "ID", sortable: true, align: "center" },
      { key: "numReclamo", label: "N° Reclamo", sortable: true },
      {
        key: "descripcion",
        label: "Descripción",
        sortable: true,
        render: (value) => (
          <span className="text-muted" style={{ maxWidth: "300px", display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value || "-"}
          </span>
        )
      },
      {
        key: "estado",
        label: "Estado",
        sortable: true,
        align: "center",
        render: (value) => {
          const estado = ESTADOS[value] || { label: value, variant: "secondary" };
          return (
            <span className={`badge bg-${estado.variant}`}>
              {estado.label}
            </span>
          );
        }
      },
      {
        key: "proveedorNombre",
        label: "Proveedor",
        sortable: true,
        render: (value) => value || "-"
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
              aria-label="Acciones"
              title="Acciones"
              style={{ fontSize: '18px', lineHeight: 1 }}
            >
              ⋮
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{minWidth: '200px'}}>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => setSelectedClaim(row)}
                >
                  <i className="bi bi-eye text-primary"></i>
                  Ver detalles
                </button>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => handleChangeState(row)}
                >
                  <i className="bi bi-arrow-repeat text-info"></i>
                  Cambiar estado
                </button>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    []
  );

  const handleChangeState = async (claim) => {
    const ok = await alertConfirm(
      "¿Cambiar estado?",
      `El reclamo #${claim.numReclamo} está actualmente en estado ${ESTADOS[claim.estado]?.label || claim.estado}. ¿Desea cambiarlo?`
    );
    if (!ok.isConfirmed) return;

    // Mostrar selector de estado
    const estadoOptions = Object.entries(ESTADOS).reduce((acc, [key, value]) => {
      acc[key] = value.label;
      return acc;
    }, {});

    const { value: newEstado, isConfirmed } = await alertConfirm(
      `Seleccione el nuevo estado`,
      "",
      "Cambiar"
    ).then(() => {
      return window.Swal.fire({
        title: `Seleccione el nuevo estado`,
        input: 'select',
        inputOptions: estadoOptions,
        inputValue: claim.estado,
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Por favor seleccione un estado';
          }
        }
      });
    });

    if (isConfirmed && newEstado && newEstado !== claim.estado) {
      try {
        await changeClaimState(claim.id, newEstado);
        await alertSuccess("Estado actualizado", `El reclamo #${claim.numReclamo} ahora está ${ESTADOS[newEstado].label}.`);
        reload();
      } catch (error) {
        console.error("Error changing claim state:", error);
        alertError("Error", error?.response?.data?.mensaje || error?.message || "No se pudo cambiar el estado");
      }
    }
  };

  const closeModal = () => setSelectedClaim(null);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Reclamos</h4>
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/claims/new")}
          >
            + Nuevo Reclamo
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={reload}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Refrescar"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="estadoFilter" className="form-label small text-muted">
                Filtrar por Estado
              </label>
              <select
                id="estadoFilter"
                className="form-select"
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
              >
                <option value="">Todos los Estados</option>
                {Object.entries(ESTADOS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-8">
              <label htmlFor="searchTerm" className="form-label small text-muted">
                Buscar por N° Reclamo o Descripción
              </label>
              <input
                id="searchTerm"
                type="text"
                className="form-control"
                placeholder="Ingrese número de reclamo o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          {(estadoFilter || searchTerm) && (
            <div className="mt-2">
              <small className="text-muted">
                Mostrando {filteredRows.length} de {rows.length} reclamos
              </small>
              {(estadoFilter || searchTerm) && (
                <button
                  className="btn btn-link btn-sm ms-2 p-0"
                  onClick={() => {
                    setEstadoFilter("");
                    setSearchTerm("");
                  }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredRows}
        loading={loading}
        error={err}
        emptyMessage="No hay reclamos aún."
        rowKey="id"
      />

      {/* View Details Modal */}
      {selectedClaim && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Detalles del Reclamo
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  aria-label="Cerrar"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title text-muted mb-3">
                          <i className="bi bi-info-circle me-2"></i>
                          Información del Reclamo
                        </h6>
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label text-muted small">ID</label>
                            <p className="fw-semibold mb-2">
                              <code className="bg-white px-2 py-1 rounded">{selectedClaim.id}</code>
                            </p>
                          </div>
                          <div className="col-md-5">
                            <label className="form-label text-muted small">Número de Reclamo</label>
                            <p className="fw-semibold mb-2">{selectedClaim.numReclamo || 'No especificado'}</p>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label text-muted small">Estado</label>
                            <p className="mb-2">
                              <span className={`badge bg-${ESTADOS[selectedClaim.estado]?.variant || 'secondary'}`}>
                                {ESTADOS[selectedClaim.estado]?.label || selectedClaim.estado}
                              </span>
                            </p>
                          </div>
                          <div className="col-12">
                            <label className="form-label text-muted small">Descripción</label>
                            <p className="fw-semibold mb-2">{selectedClaim.descripcion || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedClaim.proveedorNombre && (
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title text-muted mb-3">
                            <i className="bi bi-truck me-2"></i>
                            Información del Proveedor
                          </h6>
                          <div className="row">
                            <div className="col-md-3">
                              <label className="form-label text-muted small">ID Proveedor</label>
                              <p className="fw-semibold mb-2">
                                <code className="bg-white px-2 py-1 rounded">{selectedClaim.proveedorId}</code>
                              </p>
                            </div>
                            <div className="col-md-9">
                              <label className="form-label text-muted small">Nombre</label>
                              <p className="fw-semibold mb-2">{selectedClaim.proveedorNombre}</p>
                            </div>
                            {selectedClaim.proveedorDescripcion && (
                              <div className="col-12">
                                <label className="form-label text-muted small">Descripción</label>
                                <p className="fw-semibold mb-0">{selectedClaim.proveedorDescripcion}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedClaim.detalleReclamoId && (
                    <div className="col-12">
                      <div className="card border-0 bg-light">
                        <div className="card-body">
                          <h6 className="card-title text-muted mb-3">
                            <i className="bi bi-list-ul me-2"></i>
                            Detalles Adicionales
                          </h6>
                          <div className="row">
                            <div className="col-md-12">
                              <label className="form-label text-muted small">ID Detalle</label>
                              <p className="fw-semibold mb-0">
                                <code className="bg-white px-2 py-1 rounded">{selectedClaim.detalleReclamoId}</code>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    closeModal();
                    handleChangeState(selectedClaim);
                  }}
                >
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Cambiar Estado
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
