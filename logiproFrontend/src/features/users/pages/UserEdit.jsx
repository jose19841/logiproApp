// src/features/users/pages/UserEdit.jsx
import { useNavigate, useParams } from "react-router-dom";
import useEdit from "@/features/users/hooks/useEdit";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { form, onChange, submit, loading, saving, notFound } = useEdit(id);

  if (loading) {
    return (
      <div className="d-flex align-items-center gap-2 text-muted">
        <span className="spinner-border spinner-border-sm" role="status" />
        <span>Cargando usuario...</span>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate("/usuarios")}>
          ← Volver al listado
        </button>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    const ok = await submit();
    if (ok) navigate(`/usuarios/${id}`);
  }

  return (
    <div className="container-fluid">
      <form className="card p-3 shadow-sm" onSubmit={onSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Editar usuario</h5>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate(`/usuarios/${id}`)}
              disabled={saving}
            >
              Volver
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        {/* Datos personales */}
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className="form-control"
                name="nombre"
                value={form.nombre}
                onChange={onChange}
                maxLength={100}
                disabled={saving}
                required
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className="form-control"
                name="apellido"
                value={form.apellido}
                onChange={onChange}
                maxLength={100}
                disabled={saving}
                required
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">DNI</label>
              <input
                type="text"
                className="form-control"
                name="dni"
                value={form.dni}
                onChange={onChange}
                maxLength={25}
                disabled={saving}
                required
              />
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Teléfono</label>
              <input
                type="text"
                className="form-control"
                name="telefono"
                value={form.telefono}
                onChange={onChange}
                maxLength={25}
                disabled={saving}
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={onChange}
                maxLength={100}
                disabled={saving}
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Domicilio</label>
              <input
                type="text"
                className="form-control"
                name="domicilio"
                value={form.domicilio}
                onChange={onChange}
                maxLength={100}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        <hr className="my-3" />

        {/* Credenciales / Rol / Estado */}
        <div className="row">
          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Usuario</label>
              <input
                type="text"
                className="form-control"
                name="usuario"
                value={form.usuario}
                onChange={onChange}
                minLength={4}
                maxLength={20}
                disabled
              />
              <div className="form-text">El nombre de usuario no se puede cambiar.</div>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Rol</label>
              <select
                className="form-select"
                name="rol"
                value={form.rol}
                onChange={onChange}
                disabled={saving}
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="mb-2">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                name="estado"
                value={form.estado}
                onChange={onChange}
                disabled={saving}
                required
              >
                <option value="ACTIVO">ACTIVO</option>
                <option value="INACTIVO">INACTIVO</option>
                <option value="SUSPENDIDO">SUSPENDIDO</option>
                <option value="REGISTRADO">REGISTRADO</option>
              </select>
            </div>
          </div>
        </div>

        {/* Botonera inferior (duplicada por accesibilidad) */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/usuarios/${id}`)}
            disabled={saving}
          >
            Volver
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
