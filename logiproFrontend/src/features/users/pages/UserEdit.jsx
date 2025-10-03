// src/features/users/pages/UserEdit.jsx
import { useNavigate, useParams } from "react-router-dom";
import useEdit from "@/features/users/hooks/useEdit";

const PERSONAL_FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", maxLength: 100, required: true },
  { name: "apellido", label: "Apellido", type: "text", maxLength: 100, required: true },
  { name: "dni", label: "DNI", type: "text", maxLength: 25, required: true },
  { name: "telefono", label: "Teléfono", type: "text", maxLength: 25 },
  { name: "email", label: "Email", type: "email", maxLength: 100 },
  { name: "domicilio", label: "Domicilio", type: "text", maxLength: 100 }
];

const Field = ({ field, value, onChange, disabled }) => (
  <div className="col-md-6 col-lg-4">
    <div className="mb-2">
      <label className="form-label">{field.label}</label>
      <input
        type={field.type || "text"}
        className="form-control"
        name={field.name}
        value={value}
        onChange={onChange}
        maxLength={field.maxLength}
        minLength={field.minLength}
        required={field.required}
        disabled={disabled}
      />
      {field.helpText && <div className="form-text">{field.helpText}</div>}
    </div>
  </div>
);

const ButtonGroup = ({ id, saving, navigate }) => (
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
);

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

  const onSubmit = async (e) => {
    e.preventDefault();
    const ok = await submit();
    if (ok) navigate(`/usuarios/${id}`);
  };

  return (
    <div className="container-fluid">
      <form className="card p-3 shadow-sm" onSubmit={onSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Editar usuario</h5>
          <ButtonGroup id={id} saving={saving} navigate={navigate} />
        </div>

        <div className="row">
          {PERSONAL_FIELDS.map(field => (
            <Field key={field.name} field={field} value={form[field.name]} onChange={onChange} disabled={saving} />
          ))}
        </div>

        <hr className="my-3" />

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

        <div className="d-flex justify-content-end gap-2 mt-3">
          <ButtonGroup id={id} saving={saving} navigate={navigate} />
        </div>
      </form>
    </div>
  );
}
