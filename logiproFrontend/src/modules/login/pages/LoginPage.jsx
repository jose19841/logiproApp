// src/modules/login/pages/LoginPage.jsx
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { alertError, alertSuccess } from "../../../components/alerts/swal";
import { useLogin } from "../hooks/useLogin";
import "../styles/login.css";

const USER_RE = /^[A-Za-z0-9]{4,20}$/;      // alfanumérico 4–20 (según HU)
const PASS_RE = /^.{6,}$/;                  // requisito mínimo: 6 caracteres

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useLogin();

  const [expanded, setExpanded] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [touchedUser, setTouchedUser] = useState(false);
  const [touchedPass, setTouchedPass] = useState(false);
  const [formError, setFormError] = useState("");

  const open = useCallback(() => setExpanded(true), []);
  const close = useCallback(() => setExpanded(false), []);

  // Validaciones en vivo (según HU: user alfanumérico 4–20; pass requisito mínimo)
  const usernameError = useMemo(() => {
    if (!username) return "El usuario es requerido.";
    if (!USER_RE.test(username)) return "4–20 caracteres alfanuméricos (sin espacios ni símbolos).";
    return "";
  }, [username]);

  const passwordError = useMemo(() => {
    if (!password) return "La contraseña es requerida.";
    if (!PASS_RE.test(password)) return "Mínimo 6 caracteres.";
    return "";
  }, [password]);

  const isFormValid = usernameError === "" && passwordError === "";

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
      const data = await login({ username, password });
      await alertSuccess("Bienvenido", `hola, ${data?.user?.username ?? username}`);
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Usuario o contraseña incorrecta";
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
              {/* Header clickable */}
              <button
                type="button"
                className="login-header-btn"
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                <h1 className="h4 mb-0">Iniciar sesión</h1>
                <span className={`chevron ${expanded ? "up" : "down"}`} aria-hidden="true" />
              </button>

              {/* Contenido que se revela */}
              <div className="login-fields">
                {formError && (
                  <div className="alert alert-danger py-2 px-3 mb-3" role="alert">
                    {formError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* Usuario */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">Usuario</label>
                    <input
                      id="username"
                      type="text"
                      className={`form-control ${touchedUser && usernameError ? "is-invalid" : ""}`}
                      placeholder="tu_usuario"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (!touchedUser) setTouchedUser(true);
                      }}
                      onBlur={() => setTouchedUser(true)}
                      autoComplete="username"
                      required
                    />
                    {touchedUser && usernameError && (
                      <div className="invalid-feedback">{usernameError}</div>
                    )}
                  </div>

                  {/* Contraseña + ojito */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <div className="position-relative">
                      <input
                        id="password"
                        type={showPass ? "text" : "password"}
                        className={`form-control pe-5 ${touchedPass && passwordError ? "is-invalid" : ""}`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
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
                      {touchedPass && passwordError && (
                        <div className="invalid-feedback d-block">{passwordError}</div>
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
                  <a className="forgot-link" href="/recuperar">
                    ¿Olvidaste tu contraseña?
                  </a>
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
