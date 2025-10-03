// src/features/auth/pages/ChangePasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { alertError, alertSuccess, alertWarning } from "@shared/components/alerts/swal";
import { changePassword } from "@shared/services/auth.api";
import "@/features/auth/styles/login.css";

const PASS_RE = /^.{8,}$/;

const PasswordField = ({ id, label, placeholder, value, onChange, onBlur, show, onToggle, error, touched, autoComplete }) => (
  <div className="mb-3">
    <label htmlFor={id} className="form-label">{label}</label>
    <div className="position-relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        className={`form-control pe-5 ${touched && error ? "is-invalid" : ""}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary toggle-pass-btn"
        aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
        onClick={onToggle}
        tabIndex={-1}
      >
        {show ? "🙈" : "👁️"}
      </button>
      {touched && error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  </div>
);

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [touchedA, setTouchedA] = useState(false);
  const [touchedN, setTouchedN] = useState(false);
  const [touchedR, setTouchedR] = useState(false);
  const [showA, setShowA] = useState(false);
  const [showN, setShowN] = useState(false);
  const [showR, setShowR] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const errA = !actual ? "Ingresá tu contraseña actual." : "";
  const errN = !nueva ? "Ingresá tu nueva contraseña." : !PASS_RE.test(nueva) ? "La nueva contraseña debe tener al menos 8 caracteres." : actual && nueva === actual ? "La nueva contraseña no puede ser igual a la actual." : "";
  const errR = !repetir ? "Repetí la nueva contraseña." : nueva && repetir && nueva !== repetir ? "Las contraseñas no coinciden." : "";
  const isValid = !errA && !errN && !errR;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouchedA(true);
    setTouchedN(true);
    setTouchedR(true);
    if (!isValid) {
      await alertWarning("Datos inválidos", "Revisá los campos marcados en rojo.");
      return;
    }
    try {
      setSubmitting(true);
      await changePassword({ actualClave: actual, nuevaClave: nueva, repetirClave: repetir });
      await alertSuccess("Contraseña actualizada", "Volvé a iniciar sesión con tu nueva clave.");
      navigate("/login");
    } catch (err) {
      const status = err?.response?.status;
      const msg = (err?.response?.data?.mensaje || err?.response?.data?.message || "No se pudo cambiar la contraseña").toString();
      if (status === 401) {
        await alertError("Sesión expirada", "Tenés que iniciar sesión nuevamente.");
        navigate("/login");
        return;
      }
      if (status === 400 || status === 403) {
        await alertWarning("No se pudo cambiar la contraseña", msg);
        return;
      }
      await alertError("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-overlay" />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div
              className="card shadow-sm login-card open"
              role="region"
              aria-label="Cambiar contraseña"
            >
              <div className="p-3 p-md-4">
                <h1 className="h4 mb-3">Cambiar contraseña</h1>
                <p className="text-muted mb-4">
                  Ingresá tu <strong>clave actual</strong> y elegí una <strong>nueva</strong>.
                </p>
                <form onSubmit={handleSubmit} noValidate>
                  <PasswordField
                    id="actual"
                    label="Contraseña actual"
                    placeholder="••••••••"
                    value={actual}
                    onChange={(e) => setActual(e.target.value)}
                    onBlur={() => setTouchedA(true)}
                    show={showA}
                    onToggle={() => setShowA((v) => !v)}
                    error={errA}
                    touched={touchedA}
                    autoComplete="current-password"
                  />
                  <PasswordField
                    id="nueva"
                    label="Nueva contraseña"
                    placeholder="mínimo 8 caracteres"
                    value={nueva}
                    onChange={(e) => setNueva(e.target.value)}
                    onBlur={() => setTouchedN(true)}
                    show={showN}
                    onToggle={() => setShowN((v) => !v)}
                    error={errN}
                    touched={touchedN}
                    autoComplete="new-password"
                  />
                  <PasswordField
                    id="repetir"
                    label="Repetir nueva contraseña"
                    placeholder="repetí la nueva contraseña"
                    value={repetir}
                    onChange={(e) => setRepetir(e.target.value)}
                    onBlur={() => setTouchedR(true)}
                    show={showR}
                    onToggle={() => setShowR((v) => !v)}
                    error={errR}
                    touched={touchedR}
                    autoComplete="new-password"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={!isValid || submitting}
                    aria-busy={submitting}
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {submitting ? "Guardando..." : "Guardar nueva contraseña"}
                  </button>
                </form>
                <div className="text-center mt-3">
                  <Link to="/login" className="forgot-link">
                    Volver a Iniciar sesión
                  </Link>
                </div>
              </div>
            </div>
            <div className="text-center mt-3 text-white-50">
              <small>© {new Date().getFullYear()} LogiPro</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
