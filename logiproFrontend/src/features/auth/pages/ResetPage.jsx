// src/features/auth/pages/ResetPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { alertError, alertSuccess, alertWarning } from "@shared/components/alerts/swal";
import { resetPassword } from "@shared/services/auth.api";
import "@/modules/login/styles/login.css";

const PASS_RE = /^.{8,}$/; // mínimo 8 caracteres

export default function ResetPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1) Leemos el token del querystring una sola vez
  const tokenFromUrl = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [token, setToken] = useState(tokenFromUrl);

  // 2) Limpiamos la URL para que el token no quede visible en la barra
  useEffect(() => {
    if (tokenFromUrl) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
    // Guardamos el token leído en memoria
    setToken(tokenFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromUrl]);

  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");

  const [touchedN, setTouchedN] = useState(false);
  const [touchedR, setTouchedR] = useState(false);

  const [showN, setShowN] = useState(false);
  const [showR, setShowR] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  // Validaciones
  const errToken = !token ? "El enlace es inválido o está incompleto." : "";
  const errNueva =
    !nueva ? "Ingresá tu nueva contraseña."
    : !PASS_RE.test(nueva) ? "La nueva contraseña debe tener al menos 8 caracteres."
    : "";
  const errRepetir =
    !repetir ? "Repetí la nueva contraseña."
    : (nueva && repetir && nueva !== repetir) ? "Las contraseñas no coinciden."
    : "";

  const isValid = !errToken && !errNueva && !errRepetir;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouchedN(true);
    setTouchedR(true);

    if (!isValid) {
      await alertWarning("Datos inválidos", "Revisá los campos marcados en rojo.");
      return;
    }

    try {
      setSubmitting(true);
      const ok = await resetPassword(token.trim(), nueva);
      if (ok) {
        await alertSuccess("Contraseña actualizada", "Ya podés iniciar sesión con tu nueva clave.");
        navigate("/login");
        return;
      }
      // fallback conservador
      await alertSuccess("Contraseña actualizada", "Ya podés iniciar sesión con tu nueva clave.");
      navigate("/login");
    } catch (err) {
      const status = err?.response?.status;
      const raw = err?.response?.data;
      const msg = (raw?.mensaje || raw?.message || "No se pudo restablecer la contraseña").toString();

      if (status === 400) {
        await alertWarning("No se pudo restablecer", msg || "Token inválido o expirado.");
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
            <div className="card shadow-sm login-card open" role="region" aria-label="Restablecer contraseña">
              <div className="p-3 p-md-4">
                <h1 className="h4 mb-3">Restablecer contraseña</h1>
                <p className="text-muted mb-3">
                  Ingresá tu <strong>nueva</strong> contraseña y confirmala.
                </p>

                {/* Estado del enlace/token sin exponerlo */}
                {token ? (
                  <div className="alert alert-success py-2" role="status" aria-live="polite">
                    Enlace verificado. Podés continuar.
                  </div>
                ) : (
                  <div className="alert alert-danger" role="alert">
                    {errToken}{" "}
                    <Link to="/forgot" className="alert-link">
                      Pedir un nuevo enlace
                    </Link>
                    .
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Nueva contraseña */}
                  <div className="mb-3">
                    <label htmlFor="nueva" className="form-label">Nueva contraseña</label>
                    <div className="position-relative">
                      <input
                        id="nueva"
                        type={showN ? "text" : "password"}
                        className={`form-control pe-5 ${touchedN && errNueva ? "is-invalid" : ""}`}
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
                      {touchedN && errNueva && <div className="invalid-feedback d-block">{errNueva}</div>}
                    </div>
                  </div>

                  {/* Repetir nueva */}
                  <div className="mb-3">
                    <label htmlFor="repetir" className="form-label">Repetir nueva contraseña</label>
                    <div className="position-relative">
                      <input
                        id="repetir"
                        type={showR ? "text" : "password"}
                        className={`form-control pe-5 ${touchedR && errRepetir ? "is-invalid" : ""}`}
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
                      {touchedR && errRepetir && <div className="invalid-feedback d-block">{errRepetir}</div>}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={!isValid || submitting}
                    aria-busy={submitting}
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {submitting ? "Guardando..." : "Restablecer contraseña"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link to="/login" className="forgot-link">Volver a Iniciar sesión</Link>
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
