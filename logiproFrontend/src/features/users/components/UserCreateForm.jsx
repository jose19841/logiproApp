// src/features/users/components/UserCreateForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertConfirm } from "@shared/components/alerts/swal";
import useRegister from "@/features/users/hooks/useRegister";

const INITIAL_FORM = {
  nombre: "",
  apellido: "",
  dni: "",
  telefono: "",
  email: "",
  domicilio: "",
  usuario: "",
  clave: "",
  rol: "USER"
};

const PERSONAL_FIELDS = [
  { name: "nombre", label: "Nombre", type: "text", maxLength: 100, required: true },
  { name: "apellido", label: "Apellido", type: "text", maxLength: 100, required: true },
  { name: "dni", label: "DNI", type: "text", maxLength: 25, required: true },
  { name: "telefono", label: "Teléfono", type: "text", maxLength: 25 },
  { name: "email", label: "Email", type: "email", maxLength: 100 },
  { name: "domicilio", label: "Domicilio", type: "text", maxLength: 100 }
];

const CREDENTIAL_FIELDS = [
  { name: "usuario", label: "Usuario", placeholder: "ej: admin", minLength: 4, maxLength: 20, required: true, helpText: "Entre 4 y 20 caracteres." },
  { name: "clave", label: "Clave", type: "password", placeholder: "********", minLength: 8, maxLength: 20, required: true, helpText: "Entre 8 y 20 caracteres." }
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
        placeholder={field.placeholder}
        minLength={field.minLength}
        maxLength={field.maxLength}
        required={field.required}
        disabled={disabled}
      />
      {field.helpText && <div className="form-text">{field.helpText}</div>}
    </div>
  </div>
);

/**
 * Props:
 *  - variant: "card" | "plain"
 *  - onSuccess?: (user) => void
 *  - formId?: string
 *  - initialValues?: object
 */
export default function UserCreateForm({
  variant = "card",
  onSuccess,
  formId,
  initialValues
}) {
  const { submit, loading } = useRegister();
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...INITIAL_FORM, ...(initialValues || {}) });

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const resConfirm = await alertConfirm(
      "¿Crear usuario?",
      `Se creará el usuario "${form.usuario}" con rol ${form.rol}.`
    );
    if (!resConfirm.isConfirmed) return;

    const res = await submit(form);
    if (res.ok) {
      setForm(INITIAL_FORM);
      onSuccess?.(res.data);
    }
  };

  const Inner = (
    <>
      {variant === "card" && <h5 className="mb-3">Registrar usuario</h5>}

      <div className="row">
        {PERSONAL_FIELDS.map(field => (
          <Field key={field.name} field={field} value={form[field.name]} onChange={onChange} disabled={loading} />
        ))}
      </div>

      <hr className="my-3" />

      <div className="row">
        {CREDENTIAL_FIELDS.map(field => (
          <Field key={field.name} field={field} value={form[field.name]} onChange={onChange} disabled={loading} />
        ))}
        <div className="col-md-6 col-lg-4">
          <div className="mb-2">
            <label className="form-label">Rol</label>
            <select
              className="form-select"
              name="rol"
              value={form.rol}
              onChange={onChange}
              required
              disabled={loading}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {variant === "card" && (
        <div className="d-flex justify-content-end gap-2 mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/usuarios")}
            disabled={loading}
          >
            Volver
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creando..." : "Registrar"}
          </button>
        </div>
      )}
    </>
  );

  const props = { onSubmit, id: formId };
  return variant === "card" ? (
    <form className="card p-3 shadow-sm" {...props}>{Inner}</form>
  ) : (
    <form {...props}>{Inner}</form>
  );
}
