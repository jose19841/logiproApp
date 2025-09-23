// src/modules/login/pages/RecoverPage.jsx
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { alertError, alertSuccess, alertWarning } from "../../../components/alerts/swal";
import { recoverPassword } from "../../../services/auth.api";
import "../styles/login.css";

const ID_RE = /^.{3,100}$/; // mínimo 3 caracteres (usuario o email)

export default function RecoverPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preset = searchParams.get("identifier") || "";

  const [identifier, setIdentifier] = useState(preset);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const idError =
    !identifier
      ? "Ingresá tu usuario o email."
      : !ID_RE.test(identifier.trim())
      ? "Debe tener al menos 3 caracteres."
      : "";

  const isValid = idError === "";

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched(true);

    if (!isValid) {
      await alertWarning("Dato inválido", "Revisá el campo en rojo.");
      return;
    }

    try {
      setSubmitting(true);

      // Normalización del identificador:
      // - Si parece email, lo mandamos en minúsculas y sin espacios.
      // - Si es usuario, solo trim (respetamos mayúsc/minúsculas del username).
      const trimmed = identifier.trim();
      const normalized = trimmed.includes("@") ? trimmed.toLowerCase() : trimmed;

      await recoverPassword(normalized);
      await alertSuccess(
        "Solicitud enviada",
        "Si existe una cuenta asociada, se envió un correo con instrucciones."
      );
      navigate("/login");
    } catch (err) {
      const status = err?.response?.status;
      const raw = err?.response?.data;
      const msg = (raw?.mensaje || raw?.message || "No se pudo enviar la solicitud").toString();

      if (status >= 400) {
        await alertError("Error", msg);
      } else {
        await alertSuccess(
          "Solicitud enviada",
          "Si existe una cuenta asociada, se envió un correo con instrucciones."
        );
        navigate("/login");
      }
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
            <div className="card shadow-sm login-card open" role="region" aria-label="Recuperar contraseña">
              <div className="p-3 p-md-4">
                <h1 className="h4 mb-3">Recuperar contraseña</h1>
                <p className="text-muted mb-4">
                  Ingresá tu <strong>usuario</strong> o <strong>email</strong> y te enviaremos un enlace para restablecer tu clave.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="identifier" className="form-label">Usuario o email</label>
                    <input
                      id="identifier"
                      type="text"
                      className={`form-control ${touched && idError ? "is-invalid" : ""}`}
                      placeholder="tu_usuario o tu@email.com"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      onBlur={() => setTouched(true)}
                      autoComplete="username email"
                      required
                    />
                    {touched && idError && (
                      <div className="invalid-feedback">{idError}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={!isValid || submitting}
                    aria-busy={submitting}
                    style={{ borderRadius: "var(--radius)" }}
                  >
                    {submitting ? "Enviando..." : "Enviar instrucciones"}
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
