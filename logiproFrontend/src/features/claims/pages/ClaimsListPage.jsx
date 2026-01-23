// src/features/claims/pages/ClaimsListPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useToast from "@shared/hooks/useToast";
import DataTable from "@shared/components/DataTable";
import useListClaims from "@/features/claims/hooks/useListClaims";
import { changeClaimState, deleteClaim } from "@/features/claims/services/claimsApi";
import { listSuppliers } from "@/features/suppliers/services/suppliersApi";

const ESTADOS = {
  PENDIENTE: { label: "Pendiente", variant: "warning" },
  EN_PROCESO: { label: "En Proceso", variant: "primary" },
  RESUELTO: { label: "Resuelto", variant: "success" },
  CERRADO: { label: "Cerrado", variant: "secondary" }
};

export default function ClaimsListPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { rows, loading, err, reload } = useListClaims();
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [estadoFilter, setEstadoFilter] = useState("");
  const [proveedorFilter, setProveedorFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await listSuppliers();
        setSuppliers(data || []);
      } catch (error) {
        console.error("Error loading suppliers:", error);
      }
    };
    fetchSuppliers();
  }, []);

  // Client-side filtering
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // Filter by estado
    if (estadoFilter) {
      filtered = filtered.filter(row => row.estado === estadoFilter);
    }

    // Filter by proveedor
    if (proveedorFilter) {
      filtered = filtered.filter(row => row.proveedorId === parseInt(proveedorFilter));
    }

    // Filter by fechas
    if (fechaDesde) {
      filtered = filtered.filter(row => {
        if (!row.fechaCreacion) return false;
        return new Date(row.fechaCreacion) >= new Date(fechaDesde);
      });
    }
    if (fechaHasta) {
      filtered = filtered.filter(row => {
        if (!row.fechaCreacion) return false;
        return new Date(row.fechaCreacion) <= new Date(fechaHasta);
      });
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
  }, [rows, estadoFilter, proveedorFilter, searchTerm, fechaDesde, fechaHasta]);

  const handleEdit = (claim) => {
    navigate(`/claims/${claim.id}/edit`);
  };

  const handleDelete = async (claim) => {
    const confirmed = await toast.showConfirm(
      "¿Eliminar reclamo?",
      `¿Está seguro que desea eliminar el reclamo #${claim.numReclamo}?`,
      "Eliminar",
      "Cancelar"
    );
    if (!confirmed) return;

    try {
      await deleteClaim(claim.id);
      toast.showSuccess("Reclamo eliminado", `El reclamo #${claim.numReclamo} ha sido eliminado.`);
      reload();
    } catch (error) {
      console.error("Error deleting claim:", error);
      toast.showError("Error", error?.response?.data?.mensaje || error?.message || "No se pudo eliminar el reclamo");
    }
  };

  const handleChangeStateClick = async (claim) => {
    // Preparar opciones de estado
    const estadoOptions = Object.entries(ESTADOS).reduce((acc, [key, value]) => {
      acc[key] = value.label;
      return acc;
    }, {});

    // Mostrar selector de estado directamente usando Swal
    const { value: newEstado, isConfirmed } = await Swal.fire({
      title: 'Cambiar Estado del Reclamo',
      html: `
        <div style="text-align: left; padding: 0 0.5rem; margin-bottom: 1rem;">
          <p class="mb-2"><strong>Reclamo:</strong> #${claim.numReclamo}</p>
          <p class="mb-0"><strong>Estado actual:</strong> <span class="badge bg-${ESTADOS[claim.estado]?.variant}">${ESTADOS[claim.estado]?.label || claim.estado}</span></p>
        </div>
      `,
      input: 'select',
      inputOptions: estadoOptions,
      inputValue: claim.estado,
      showCancelButton: true,
      confirmButtonText: 'Cambiar',
      cancelButtonText: 'Cancelar',
      customClass: {
        htmlContainer: 'swal-html-container-custom'
      },
      width: '500px',
      padding: '1.5rem',
      didOpen: () => {
        // Aplicar estilos al select para evitar desborde
        const selectInput = Swal.getInput();
        if (selectInput) {
          selectInput.style.width = 'calc(100% - 2rem)';
          selectInput.style.maxWidth = 'calc(100% - 2rem)';
          selectInput.style.margin = '0 1rem';
          selectInput.style.padding = '0.5rem';
          selectInput.style.boxSizing = 'border-box';
          selectInput.style.fontSize = '1rem';
        }

        // Ajustar el contenedor del input
        const inputContainer = Swal.getHtmlContainer();
        if (inputContainer) {
          inputContainer.style.overflow = 'visible';
          inputContainer.style.padding = '0';
          inputContainer.style.margin = '0';
        }
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Por favor seleccione un estado';
        }
      }
    });

    if (isConfirmed && newEstado && newEstado !== claim.estado) {
      try {
        await changeClaimState(claim.id, newEstado);
        toast.showSuccess("Estado actualizado", `El reclamo #${claim.numReclamo} ahora está ${ESTADOS[newEstado].label}.`);
        reload();
      } catch (error) {
        console.error("Error changing claim state:", error);
        toast.showError("Error", error?.response?.data?.mensaje || error?.message || "No se pudo cambiar el estado");
      }
    }
  };

  const columns = useMemo(
    () => [
      { key: "id", label: "ID", sortable: true, align: "center" },
      { key: "numReclamo", label: "N° Reclamo", sortable: true },
      {
        key: "descripcion",
        label: "Descripción",
        sortable: true,
        render: (value) => (
          <span style={{ maxWidth: "300px", display: "inline-block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
        label: "Acciones",
        align: "center",
        render: (_, row) => (
          <div className="btn-group btn-group-sm" role="group">
            <button
              className="btn btn-outline-primary"
              onClick={() => setSelectedClaim(row)}
              title="Ver detalle"
            >
              <i className="bi bi-eye"></i>
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={() => handleEdit(row)}
              title="Editar"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => handleChangeStateClick(row)}
              title="Cambiar estado"
            >
              <i className="bi bi-arrow-repeat"></i>
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => handleDelete(row)}
              title="Eliminar"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    []
  );

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
            <div className="col-md-3">
              <label htmlFor="searchTerm" className="form-label small">
                N° Reclamo / Descripción
              </label>
              <input
                id="searchTerm"
                type="text"
                className="form-control"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="proveedorFilter" className="form-label small">
                Proveedor
              </label>
              <select
                id="proveedorFilter"
                className="form-select"
                value={proveedorFilter}
                onChange={(e) => setProveedorFilter(e.target.value)}
              >
                <option value="">Todos</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label htmlFor="estadoFilter" className="form-label small">
                Estado
              </label>
              <select
                id="estadoFilter"
                className="form-select"
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
              >
                <option value="">Todos</option>
                {Object.entries(ESTADOS).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label htmlFor="fechaDesde" className="form-label small">
                Fecha Desde
              </label>
              <input
                id="fechaDesde"
                type="date"
                className="form-control"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="fechaHasta" className="form-label small">
                Fecha Hasta
              </label>
              <input
                id="fechaHasta"
                type="date"
                className="form-control"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>
          </div>
          {(estadoFilter || proveedorFilter || searchTerm || fechaDesde || fechaHasta) && (
            <div className="mt-2">
              <small className="text-muted">
                Mostrando {filteredRows.length} de {rows.length} reclamos
              </small>
              <button
                className="btn btn-link btn-sm ms-2 p-0"
                onClick={() => {
                  setEstadoFilter("");
                  setProveedorFilter("");
                  setSearchTerm("");
                  setFechaDesde("");
                  setFechaHasta("");
                }}
              >
                Limpiar filtros
              </button>
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
                        <h6 className="card-title mb-3">
                          <i className="bi bi-info-circle me-2"></i>
                          Información del Reclamo
                        </h6>
                        <div className="row">
                          <div className="col-md-3">
                            <label className="form-label small">ID</label>
                            <p className="fw-semibold mb-2">
                              <code className="bg-white px-2 py-1 rounded">{selectedClaim.id}</code>
                            </p>
                          </div>
                          <div className="col-md-5">
                            <label className="form-label small">Número de Reclamo</label>
                            <p className="fw-semibold mb-2">{selectedClaim.numReclamo || 'No especificado'}</p>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label small">Estado</label>
                            <p className="mb-2">
                              <span className={`badge bg-${ESTADOS[selectedClaim.estado]?.variant || 'secondary'}`}>
                                {ESTADOS[selectedClaim.estado]?.label || selectedClaim.estado}
                              </span>
                            </p>
                          </div>
                          <div className="col-12">
                            <label className="form-label small">Descripción</label>
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
                          <h6 className="card-title mb-3">
                            <i className="bi bi-truck me-2"></i>
                            Información del Proveedor
                          </h6>
                          <div className="row">
                            <div className="col-md-3">
                              <label className="form-label small">ID Proveedor</label>
                              <p className="fw-semibold mb-2">
                                <code className="bg-white px-2 py-1 rounded">{selectedClaim.proveedorId}</code>
                              </p>
                            </div>
                            <div className="col-md-9">
                              <label className="form-label small">Nombre</label>
                              <p className="fw-semibold mb-2">{selectedClaim.proveedorNombre}</p>
                            </div>
                            {selectedClaim.proveedorDescripcion && (
                              <div className="col-12">
                                <label className="form-label small">Descripción</label>
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
                          <h6 className="card-title mb-3">
                            <i className="bi bi-list-ul me-2"></i>
                            Detalles Adicionales
                          </h6>
                          <div className="row">
                            <div className="col-md-12">
                              <label className="form-label small">ID Detalle</label>
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
                    handleChangeStateClick(selectedClaim);
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
