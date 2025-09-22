// src/modules/users/components/ChangePasswordModal.jsx
import { useState } from "react";
import { alertError, alertSuccess } from "../../../components/alerts/swal";
import Modal from "../../../components/modal/Modal";
import { useChangePassword } from "../hooks/useChangePassword";

const PASS_RE = /^.{8,}$/; // mínimo 8

export default function ChangePasswordModal({ id = "changePasswordModal", title = "Cambiar contraseña", onDone }) {
  const { changePassword, loading } = useChangePassword();
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirm, setConfirm] = useState("");

  const reset = () => { setActual(""); setNueva(""); setConfirm(""); };

  // Cierra el modal sin usar window.*, con fallback por si quedara el backdrop
  const closeModal = () => {
    const modalEl = document.getElementById(id);
    if (modalEl) {
      // 1) click en cualquier botón con data-bs-dismiss
      const dismiss = modalEl.querySelector('[data-bs-dismiss="modal"]');
      if (dismiss) { dismiss.click(); return; }
      // 2) fallback duro: limpiar backdrop/clase del body
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
      modalEl.classList.remove("show");
      modalEl.setAttribute("aria-hidden", "true");
      modalEl.style.display = "none";
    }
  };

  const submit = async () => {
    if (!actual || !nueva || !confirm) return alertError("Datos incompletos", "Completá todos los campos.");
    if (!PASS_RE.test(nueva))         return alertError("Contraseña inválida", "Mínimo 8 caracteres.");
    if (nueva !== confirm)            return alertError("No coinciden", "La confirmación no coincide.");

    try {
      await changePassword({ claveActual: actual, nuevaClave: nueva, confirmarClave: confirm });
      await alertSuccess("Listo", "Tu contraseña fue cambiada correctamente.");

      closeModal();   // ⬅️ cerramos el modal (y backdrop) antes de redirigir
      reset();
      onDone?.();     // el padre hace navigate("/login", { replace: true })
    } catch (e) {
      alertError("Error", e?.message || "No se pudo cambiar la clave.");
    }
  };

  const footer = (
    <>
      <button className="btn btn-outline-secondary" data-bs-dismiss="modal" disabled={loading}>Cancelar</button>
      <button className="btn btn-primary" onClick={submit} disabled={loading} aria-busy={loading}>
        {loading ? "Guardando..." : "Cambiar contraseña"}
      </button>
    </>
  );

  return (
    <Modal id={id} title={title} onClose={() => !loading && reset()} footer={footer}>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${id}-a`}>Clave actual</label>
        <input id={`${id}-a`} type="password" className="form-control" value={actual} onChange={e => setActual(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="form-label" htmlFor={`${id}-n`}>Nueva clave</label>
        <input id={`${id}-n`} type="password" className="form-control" value={nueva} onChange={e => setNueva(e.target.value)} />
        <div className="form-text">Mínimo 8 caracteres.</div>
      </div>
      <div className="mb-0">
        <label className="form-label" htmlFor={`${id}-c`}>Confirmar nueva clave</label>
        <input id={`${id}-c`} type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} />
      </div>
    </Modal>
  );
}
