// src/features/users/pages/UserDetail.jsx
import { useNavigate, useParams } from "react-router-dom";
import useDetail from "@/features/users/hooks/useDetail";


export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useDetail(id);

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <span className="spinner-border spinner-border-sm" role="status"></span>
        <span>Cargando usuario...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/usuarios")}
        >
          ← Volver al listado
        </button>
      </div>
    );
  }

  const renderEstado = (estado) => {
    const cls =
      estado === "ACTIVO"
        ? "badge bg-success"
        : estado === "INACTIVO"
        ? "badge bg-secondary"
        : estado === "SUSPENDIDO"
        ? "badge bg-danger"
        : estado === "REGISTRADO"
        ? "badge bg-info"
        : "badge bg-light text-dark";
    return <span className={cls}>{estado ?? "-"}</span>;
  };

  return (
    <div className="container-fluid">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Detalle de Usuario</h5>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate("/usuarios")}
          >
            ← Volver
          </button>
        </div>
        <div className="card-body">
          <dl className="row mb-0">
            <dt className="col-sm-3">Usuario</dt>
            <dd className="col-sm-9">{user.usuario}</dd>

            <dt className="col-sm-3">Nombre</dt>
            <dd className="col-sm-9">{user.nombre}</dd>

            <dt className="col-sm-3">Apellido</dt>
            <dd className="col-sm-9">{user.apellido}</dd>

            <dt className="col-sm-3">Email</dt>
            <dd className="col-sm-9">{user.email}</dd>

            <dt className="col-sm-3">Rol</dt>
            <dd className="col-sm-9">{user.rol?.nombre || user.rol}</dd>

            <dt className="col-sm-3">Estado</dt>
            <dd className="col-sm-9">{renderEstado(user.estado)}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
