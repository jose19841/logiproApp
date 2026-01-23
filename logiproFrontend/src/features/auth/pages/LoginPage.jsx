// src/features/auth/pages/LoginPage.jsx
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import { useAuth } from "@/features/auth/context/AuthContext";
import "@shared/styles/theme-controlroom.css";
import "@/features/auth/styles/login.css";

const USER_RE = /^[A-Za-z0-9]{4,20}$/;
const PASS_RE = /^.{8,}$/;

const clearSession = () => {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
};

export default function LoginPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [form, setForm] = useState({ usuario: "", clave: "" });
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState({ usuario: false, clave: false });
  const [formError, setFormError] = useState("");

  const open = useCallback(() => setExpanded(true), []);
  const close = useCallback(() => setExpanded(false), []);

  const usuarioError = !form.usuario ? "El usuario es requerido." : !USER_RE.test(form.usuario) ? "4–20 caracteres alfanuméricos (sin espacios ni símbolos)." : "";
  const claveError = !form.clave ? "La contraseña es requerida." : !PASS_RE.test(form.clave) ? "Mínimo 8 caracteres." : "";
  const isFormValid = !usuarioError && !claveError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Evitar propagación del evento

    // Prevenir doble submit
    if (loading) return;

    setTouched({ usuario: true, clave: true });
    setFormError("");
    if (!isFormValid) {
      toast.showError("Datos inválidos", "Corregí los campos marcados en rojo.");
      return;
    }
    setLoading(true);
    try {
      const data = await login({ username: form.usuario, password: form.clave });
      const estado = data?.user?.estado || data?.user?.status;
      if (estado && estado !== "ACTIVO") {
        toast.showWarning("Usuario inactivo", `El usuario "${form.usuario}" se encuentra ${estado}.`);
        clearSession();
        return;
      }
      toast.showSuccess("Bienvenido", `hola, ${data?.user?.usuario ?? form.usuario}`);
      navigate("/");
    } catch (err) {
      if (err?.code === "USER_INACTIVE") {
        // Extraer el estado específico del mensaje del backend
        const mensaje = err?.message || "";
        const match = mensaje.match(/(INACTIVO|SUSPENDIDO|REGISTRADO)/i);
        const estado = match ? match[1].toLowerCase() : "inactivo";
        toast.showWarning(
          `Usuario ${estado}`,
          `El usuario "${err.usuario || form.usuario}" se encuentra ${estado} y no puede iniciar sesión.`
        );
        clearSession();
        return;
      }
      if (err?.code === "BAD_CREDENTIALS") {
        toast.showError("Credenciales inválidas", "Usuario o contraseña incorrectos.");
        return;
      }
      const status = err?.status || err?.response?.status;
      if (status >= 400 && status < 500) {
        toast.showWarning("Error de validación", "Hubo un error en la solicitud.");
        return;
      }
      const msg = (err?.response?.data?.mensaje || err?.response?.data?.message || "Error de conexión").toString();
      setFormError(msg);
      toast.showError("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="theme-controlroom login-root">
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
                      className={`form-control ${touched.usuario && usuarioError ? "is-invalid" : ""}`}
                      placeholder="Ingrese Nombre De Usuario"
                      value={form.usuario}
                      onChange={(e) => {
                        setForm({ ...form, usuario: e.target.value });
                        if (!touched.usuario) setTouched({ ...touched, usuario: true });
                      }}
                      onBlur={() => setTouched({ ...touched, usuario: true })}
                      autoComplete="username"
                      required
                    />
                    {touched.usuario && usuarioError && (
                      <div className="invalid-feedback">{usuarioError}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="clave" className="form-label">Contraseña</label>
                    <div className="position-relative">
                      <input
                        id="clave"
                        type={showPass ? "text" : "password"}
                        className={`form-control pe-5 ${touched.clave && claveError ? "is-invalid" : ""}`}
                        placeholder="••••••••"
                        value={form.clave}
                        onChange={(e) => {
                          setForm({ ...form, clave: e.target.value });
                          if (!touched.clave) setTouched({ ...touched, clave: true });
                        }}
                        onBlur={() => setTouched({ ...touched, clave: true })}
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
                    </div>
                    {touched.clave && claveError && (
                      <div className="invalid-feedback d-block mt-1">{claveError}</div>
                    )}
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
