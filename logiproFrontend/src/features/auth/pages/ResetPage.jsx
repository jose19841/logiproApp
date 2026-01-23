// src/features/auth/pages/ResetPage.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useToast from "@shared/hooks/useToast";
import { resetPassword } from "@shared/services/auth.api";
import "@/features/auth/styles/login.css";

const PASS_RE = /^.{8,}$/;

const PasswordField = ({ id, label, placeholder, value, onChange, onBlur, show, onToggle, error, touched }) => (
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
        autoComplete="new-password"
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

export default function ResetPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const tokenFromUrl = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [token, setToken] = useState(tokenFromUrl);

  useEffect(() => {
    if (tokenFromUrl) {
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      window.history.replaceState({}, document.title, url.pathname + url.search);
    }
    setToken(tokenFromUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenFromUrl]);

  const [form, setForm] = useState({ nueva: "", repetir: "" });
  const [touched, setTouched] = useState({ nueva: false, repetir: false });
  const [show, setShow] = useState({ nueva: false, repetir: false });
  const [submitting, setSubmitting] = useState(false);

  const errToken = !token ? "El enlace es inválido o está incompleto." : "";
  const errNueva = !form.nueva ? "Ingresá tu nueva contraseña." : !PASS_RE.test(form.nueva) ? "La nueva contraseña debe tener al menos 8 caracteres." : "";
  const errRepetir = !form.repetir ? "Repetí la nueva contraseña." : (form.nueva && form.repetir && form.nueva !== form.repetir) ? "Las contraseñas no coinciden." : "";
  const isValid = !errToken && !errNueva && !errRepetir;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ nueva: true, repetir: true });
    if (!isValid) {
      toast.showWarning("Datos inválidos", "Revisá los campos marcados en rojo.");
      return;
    }
    try {
      setSubmitting(true);
      await resetPassword(token.trim(), form.nueva);
      toast.showSuccess("Contraseña actualizada", "Ya podés iniciar sesión con tu nueva clave.");
      navigate("/login");
    } catch (err) {
      const status = err?.response?.status;
      const msg = (err?.response?.data?.mensaje || err?.response?.data?.message || "No se pudo restablecer la contraseña").toString();
      if (status === 400) {
        toast.showWarning("No se pudo restablecer", msg || "Token inválido o expirado.");
        return;
      }
      toast.showError("Error", msg);
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
            <div className="card shadow-sm login-card open" role="region" aria-label="Restablecer contraseña">
              <div className="p-3 p-md-4">
                <h1 className="h4 mb-3">Restablecer contraseña</h1>
                <p className="text-muted mb-3">
                  Ingresá tu <strong>nueva</strong> contraseña y confirmala.
                </p>
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
                  <PasswordField
                    id="nueva"
                    label="Nueva contraseña"
                    placeholder="mínimo 8 caracteres"
                    value={form.nueva}
                    onChange={(e) => setForm({ ...form, nueva: e.target.value })}
                    onBlur={() => setTouched({ ...touched, nueva: true })}
                    show={show.nueva}
                    onToggle={() => setShow({ ...show, nueva: !show.nueva })}
                    error={errNueva}
                    touched={touched.nueva}
                  />
                  <PasswordField
                    id="repetir"
                    label="Repetir nueva contraseña"
                    placeholder="repetí la nueva contraseña"
                    value={form.repetir}
                    onChange={(e) => setForm({ ...form, repetir: e.target.value })}
                    onBlur={() => setTouched({ ...touched, repetir: true })}
                    show={show.repetir}
                    onToggle={() => setShow({ ...show, repetir: !show.repetir })}
                    error={errRepetir}
                    touched={touched.repetir}
                  />
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
