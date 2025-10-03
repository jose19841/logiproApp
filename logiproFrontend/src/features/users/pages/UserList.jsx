// src/features/users/pages/UserList.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "@shared/components/DataTable";
import useList from "@/features/users/hooks/useList";

export default function UserList() {
  const getEstadoBadgeClass = (estado) => {
    const map = {
      ACTIVO: "bg-success",
      INACTIVO: "bg-secondary",
      SUSPENDIDO: "bg-danger"
    };
    return `badge ${map[estado] || "bg-info"}`;
  };

  const ESTADOS = ["ACTIVO", "INACTIVO", "SUSPENDIDO"];
  const ESTADO_ICONS = { ACTIVO: "bg-success", INACTIVO: "bg-secondary", SUSPENDIDO: "bg-danger" };

  const navigate = useNavigate();
  const { rows, loading, err, reload, changeState, showStatesFor, toggleStatesMenu } = useList();
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = useMemo(
    () => [
      { key: "usuario", label: "Usuario", sortable: true },
      { key: "nombreCompleto", label: "Nombre", sortable: true },
      { key: "email", label: "Email", sortable: true },
      { key: "rol", label: "Rol", sortable: true, align: "center" },
      {
        key: "estado",
        label: "Estado",
        sortable: true,
        align: "center",
        render: (value) => <span className={getEstadoBadgeClass(value)}>{value ?? "-"}</span>,
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
                  onClick={() => setSelectedUser(row)}
                >
                  <i className="bi bi-eye text-primary"></i>
                  Ver detalles
                </button>
              </li>

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleStatesMenu(row.id);
                  }}
                >
                  <i className="bi bi-arrow-repeat text-info"></i>
                  Cambiar estado
                  <i className={`bi ms-auto ${showStatesFor === row.id ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>
              </li>

              {showStatesFor === row.id && (
                <>
                  {ESTADOS.map(estado => (
                    <li key={estado}>
                      <button
                        className={`dropdown-item ps-5 d-flex align-items-center gap-2 py-1 ${row.estado === estado ? "active" : ""}`}
                        onClick={() => changeState(row, estado)}
                        disabled={row.estado === estado}
                      >
                        <span className={`badge ${ESTADO_ICONS[estado]}`} style={{width: '8px', height: '8px', borderRadius: '50%'}}></span>
                        {estado.charAt(0) + estado.slice(1).toLowerCase()}
                        {row.estado === estado && <i className="bi bi-check-lg ms-auto text-success"></i>}
                      </button>
                    </li>
                  ))}
                </>
              )}

              <li><hr className="dropdown-divider" /></li>

              <li>
                <button
                  className="dropdown-item d-flex align-items-center gap-2 py-2"
                  onClick={() => navigate(`/usuarios/${row.id}/editar`)}
                >
                  <i className="bi bi-pencil text-warning"></i>
                  Editar datos
                </button>
              </li>
            </ul>
          </div>
        ),
      },
    ],
    [changeState, navigate, showStatesFor, toggleStatesMenu]
  );

  const closeModal = () => setSelectedUser(null);

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div />
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/usuarios/nuevo")}
          >
            + Nuevo usuario
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

      <DataTable
        columns={columns}
        data={rows}
        loading={loading}
        error={err}
        emptyMessage="No hay usuarios aún."
        rowKey="id"
      />

      {selectedUser && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  <i className="bi bi-person-circle me-2"></i>
                  Detalles del Usuario
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
                          <i className="bi bi-person me-2"></i>
                          Información Personal
                        </h6>
                        <div className="row">
                          <div className="col-md-6">
                            <label className="form-label text-muted small">Nombre Completo</label>
                            <p className="fw-semibold mb-2">{selectedUser.nombreCompleto || 'No especificado'}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label text-muted small">DNI</label>
                            <p className="fw-semibold mb-2">{selectedUser.dni || 'No especificado'}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label text-muted small">Email</label>
                            <p className="fw-semibold mb-2">{selectedUser.email || 'No especificado'}</p>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label text-muted small">Teléfono</label>
                            <p className="fw-semibold mb-2">{selectedUser.telefono || 'No especificado'}</p>
                          </div>
                          <div className="col-12">
                            <label className="form-label text-muted small">Domicilio</label>
                            <p className="fw-semibold mb-0">{selectedUser.domicilio || 'No especificado'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="card-title text-muted mb-3">
                          <i className="bi bi-gear me-2"></i>
                          Información del Sistema
                        </h6>
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label text-muted small">Usuario</label>
                            <p className="fw-semibold mb-2">
                              <code className="bg-white px-2 py-1 rounded">{selectedUser.usuario}</code>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label text-muted small">Rol</label>
                            <p className="fw-semibold mb-2">
                              <span className={`badge ${selectedUser.rol === 'ADMIN' ? 'bg-primary' : 'bg-secondary'}`}>
                                {selectedUser.rol}
                              </span>
                            </p>
                          </div>
                          <div className="col-md-4">
                            <label className="form-label text-muted small">Estado</label>
                            <p className="fw-semibold mb-2">
                              <span className={getEstadoBadgeClass(selectedUser.estado)}>
                                {selectedUser.estado}
                              </span>
                            </p>
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
                    navigate(`/usuarios/${selectedUser.id}/editar`);
                  }}
                >
                  <i className="bi bi-pencil me-2"></i>
                  Editar Usuario
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
