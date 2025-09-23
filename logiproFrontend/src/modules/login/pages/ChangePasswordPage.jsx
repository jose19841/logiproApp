// src/modules/login/pages/ChangePasswordPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { alertError, alertSuccess, alertWarning } from "../../../components/alerts/swal";
import { changePassword } from "../../../services/auth.api";
import "../styles/login.css";

const PASS_RE = /^.{8,}$/; // mínimo 8

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

  // Validaciones (usuario)
  const errA = !actual ? "Ingresá tu contraseña actual." : "";
  const errN = !nueva
    ? "Ingresá tu nueva contraseña."
    : !PASS_RE.test(nueva)
    ? "La nueva contraseña debe tener al menos 8 caracteres."
    : actual && nueva === actual
    ? "La nueva contraseña no puede ser igual a la actual."
    : "";
  const errR = !repetir
    ? "Repetí la nueva contraseña."
    : nueva && repetir && nueva !== repetir
    ? "Las contraseñas no coinciden."
    : "";

  const isValid = !errA && !errN && !errR;

  async function handleSubmit(e) {
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
      const ok = await changePassword({
        actualClave: actual,
        nuevaClave: nueva,
        repetirClave: repetir,
      });

      if (ok) {
        await alertSuccess("Contraseña actualizada", "Volvé a iniciar sesión con tu nueva clave.");
        navigate("/login");
        return;
      }

      // Si el back devuelve 2xx distinto o algo inesperado, tratamos como éxito conservador
      await alertSuccess("Contraseña actualizada", "Volvé a iniciar sesión con tu nueva clave.");
      navigate("/login");
    } catch (err) {
      const status = err?.response?.status;
      const raw = err?.response?.data;
      const msg =
        (raw?.mensaje || raw?.message || "No se pudo cambiar la contraseña").toString();

      if (status === 401) {
        await alertError("Sesión expirada", "Tenés que iniciar sesión nuevamente.");
        navigate("/login");
        return;
      }
      if (status === 400 || status === 403) {
        // Errores de negocio/validación del backend
        await alertWarning("No se pudo cambiar la contraseña", msg);
        return;
      }
      await alertError("Error", msg);
    } finally {
      setSubmitting(false);
    }
  }

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
                  {/* Clave actual */}
                  <div className="mb-3">
                    <label htmlFor="actual" className="form-label">
                      Contraseña actual
                    </label>
                    <div className="position-relative">
                      <input
                        id="actual"
                        type={showA ? "text" : "password"}
                        className={`form-control pe-5 ${
                          touchedA && errA ? "is-invalid" : ""
                        }`}
                        placeholder="••••••••"
                        value={actual}
                        onChange={(e) => setActual(e.target.value)}
                        onBlur={() => setTouchedA(true)}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary toggle-pass-btn"
                        aria-label={showA ? "Ocultar contraseña" : "Mostrar contraseña"}
                        onClick={() => setShowA((v) => !v)}
                        tabIndex={-1}
                      >
                        {showA ? "🙈" : "👁️"}
                      </button>
                      {touchedA && errA && (
                        <div className="invalid-feedback d-block">{errA}</div>
                      )}
                    </div>
                  </div>

                  {/* Nueva clave */}
                  <div className="mb-3">
                    <label htmlFor="nueva" className="form-label">
                      Nueva contraseña
                    </label>
                    <div className="position-relative">
                      <input
                        id="nueva"
                        type={showN ? "text" : "password"}
                        className={`form-control pe-5 ${
                          touchedN && errN ? "is-invalid" : ""
                        }`}
                        placeholder="mínimo 8 caracteres"
                        value={nueva}
                        onChange={(e) => setNueva(e.target.value)}
                        onBlur={() => setTouchedN(true)}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary toggle-pass-btn"
                        aria-label={showN ? "Ocultar contraseña" : "Mostrar contraseña"}
                        onClick={() => setShowN((v) => !v)}
                        tabIndex={-1}
                      >
                        {showN ? "🙈" : "👁️"}
                      </button>
                      {touchedN && errN && (
                        <div className="invalid-feedback d-block">{errN}</div>
                      )}
                    </div>
                  </div>

                  {/* Repetir nueva */}
                  <div className="mb-3">
                    <label htmlFor="repetir" className="form-label">
                      Repetir nueva contraseña
                    </label>
                    <div className="position-relative">
                      <input
                        id="repetir"
                        type={showR ? "text" : "password"}
                        className={`form-control pe-5 ${
                          touchedR && errR ? "is-invalid" : ""
                        }`}
                        placeholder="repetí la nueva contraseña"
                        value={repetir}
                        onChange={(e) => setRepetir(e.target.value)}
                        onBlur={() => setTouchedR(true)}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary toggle-pass-btn"
                        aria-label={showR ? "Ocultar contraseña" : "Mostrar contraseña"}
                        onClick={() => setShowR((v) => !v)}
                        tabIndex={-1}
                      >
                        {showR ? "🙈" : "👁️"}
                      </button>
                      {touchedR && errR && (
                        <div className="invalid-feedback d-block">{errR}</div>
                      )}
                    </div>
                  </div>

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
