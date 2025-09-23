// src/modules/login/pages/LoginPage.jsx
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { alertError, alertSuccess, alertWarning } from "../../../components/alerts/swal";
import { useLogin } from "../hooks/useLogin";
import "../styles/login.css";

const USER_RE = /^[A-Za-z0-9]{4,20}$/; // alfanumérico 4–20
const PASS_RE = /^.{8,}$/;             // mínimo 8 caracteres

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useLogin();

  const [expanded, setExpanded] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [touchedUser, setTouchedUser] = useState(false);
  const [touchedPass, setTouchedPass] = useState(false);
  const [formError, setFormError] = useState("");

  const open = useCallback(() => setExpanded(true), []);
  const close = useCallback(() => setExpanded(false), []);

  // Validaciones
  const usuarioError =
    !usuario
      ? "El usuario es requerido."
      : !USER_RE.test(usuario)
      ? "4–20 caracteres alfanuméricos (sin espacios ni símbolos)."
      : "";

  const claveError =
    !clave
      ? "La contraseña es requerida."
      : !PASS_RE.test(clave)
      ? "Mínimo 8 caracteres."
      : "";

  const isFormValid = usuarioError === "" && claveError === "";

  async function handleSubmit(e) {
    e.preventDefault();
    setTouchedUser(true);
    setTouchedPass(true);
    setFormError("");

    if (!isFormValid) {
      alertError("Datos inválidos", "Corregí los campos marcados en rojo.");
      return;
    }

    try {
      const data = await login({ username: usuario, password: clave });

      // Chequeo adicional: si el backend devolviera user con estado no ACTIVO
      const estado = data?.user?.estado || data?.user?.status;
      if (estado && estado !== "ACTIVO") {
        await alertWarning("Usuario inactivo", `El usuario "${usuario}" se encuentra ${estado}.`);
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("user");
        return;
      }

      await alertSuccess("Bienvenido", `hola, ${data?.user?.usuario ?? usuario}`);
      navigate("/");
    } catch (err) {
      // ⚠️ Usuario inactivo (403 o mensaje explícito)
      if (err?.code === "USER_INACTIVE") {
        await alertWarning(
          "Usuario inactivo",
          `El usuario "${err.usuario || usuario}" se encuentra inactivo.`
        );
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("user");
        return;
      }

      // 🔐 Credenciales inválidas (401)
      if (err?.code === "BAD_CREDENTIALS") {
        await alertError("Credenciales inválidas", "Usuario o contraseña incorrectos.");
        return;
      }

      // Otros errores de cliente (4xx genérico)
      const status = err?.status || err?.response?.status;
      if (status >= 400 && status < 500) {
        await alertWarning("Error de validación", "Hubo un error en la solicitud.");
        return;
      }

      // Otros errores (5xx, red, etc.)
      const raw = err?.response?.data;
      const msg = (raw?.mensaje || raw?.message || "Error de conexión").toString();
      setFormError(msg);
      alertError("Error", msg);
    }
  }

  return (
    <div className="login-root">
      <div className="login-overlay" />
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div
              className={`card shadow-sm login-card collapsible ${expanded ? "open" : "compact"}`}
              onMouseEnter={open}
              onMouseLeave={close}
              onFocus={open}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) close();
              }}
              onTouchStart={open}
              tabIndex={0}
              role="region"
              aria-label="Formulario de inicio de sesión"
            >
              <button
                type="button"
                className="login-header-btn"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                <h1 className="h4 mb-0">Iniciar sesión</h1>
                <span className={`chevron ${expanded ? "up" : "down"}`} aria-hidden="true" />
              </button>

              <div className="login-fields">
                {formError && (
                  <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">Usuario</label>
                    <input
                      id="usuario"
                      type="text"
                      className={`form-control ${touchedUser && usuarioError ? "is-invalid" : ""}`}
                      placeholder="tu_usuario"
                      value={usuario}
                      onChange={(e) => {
                        setUsuario(e.target.value);
                        if (!touchedUser) setTouchedUser(true);
                      }}
                      onBlur={() => setTouchedUser(true)}
                      autoComplete="username"
                      required
                    />
                    {touchedUser && usuarioError && (
                      <div className="invalid-feedback">{usuarioError}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="clave" className="form-label">Contraseña</label>
                    <div className="position-relative">
                      <input
                        id="clave"
                        type={showPass ? "text" : "password"}
                        className={`form-control pe-5 ${touchedPass && claveError ? "is-invalid" : ""}`}
                        placeholder="••••••••"
                        value={clave}
                        onChange={(e) => {
                          setClave(e.target.value);
                          if (!touchedPass) setTouchedPass(true);
                        }}
                        onBlur={() => setTouchedPass(true)}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary toggle-pass-btn"
                        aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                        onClick={() => setShowPass((v) => !v)}
                        tabIndex={-1}
                      >
                        {showPass ? "🙈" : "👁️"}
                      </button>
                      {touchedPass && claveError && (
                        <div className="invalid-feedback d-block">{claveError}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={!isFormValid || loading}
                    style={{ borderRadius: "var(--radius)" }}
                    aria-busy={loading}
                    aria-disabled={!isFormValid || loading}
                  >
                    {loading ? "Ingresando..." : "Ingresar"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <Link className="forgot-link" to="/recuperar">
                    ¿Olvidaste tu contraseña?
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
