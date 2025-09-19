// src/modules/users/components/UserCreateForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertConfirm } from "../../../components/alerts/swal";
import useRegister from "../hooks/useRegister";

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

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    domicilio: "",
    usuario: "",
    clave: "",
    rol: "USER",
    ...(initialValues || {})
  });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const resConfirm = await alertConfirm(
      "¿Crear usuario?",
      `Se creará el usuario "${form.usuario}" con rol ${form.rol}.`
    );
    if (!resConfirm.isConfirmed) return;

    const res = await submit(form);
    if (res.ok) {
      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        telefono: "",
        email: "",
        domicilio: "",
        usuario: "",
        clave: "",
        rol: "USER"
      });
      onSuccess?.(res.data);
    }
  }

  const Inner = (
    <>
      {variant === "card" && <h5 className="mb-3">Registrar usuario</h5>}

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
              required
              disabled={loading}
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
              required
              disabled={loading}
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
              required
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <hr className="my-3" />

      {/* Credenciales */}
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
              placeholder="ej: admin"
              minLength={4}
              maxLength={20}
              required
              disabled={loading}
            />
            <div className="form-text">Entre 4 y 20 caracteres.</div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="mb-2">
            <label className="form-label">Clave</label>
            <input
              type="password"
              className="form-control"
              name="clave"
              value={form.clave}
              onChange={onChange}
              placeholder="********"
              minLength={8}
              maxLength={20}
              required
              disabled={loading}
            />
            <div className="form-text">Entre 8 y 20 caracteres.</div>
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
              required
              disabled={loading}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Botones */}
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
