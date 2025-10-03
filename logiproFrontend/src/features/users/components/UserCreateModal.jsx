// src/features/users/components/UserCreateModal.jsx
import Modal from "@shared/components/modal/Modal";
import UserCreateForm from "@/features/users/components/UserCreateForm";

const MODAL_ID = "userCreateModal";

export default function UserCreateModal({ onCreated }) {
  function handleSuccess() {
    // cerrar modal
    const el = document.getElementById(MODAL_ID);
    if (el && window.bootstrap) {
      const inst = window.bootstrap.Modal.getInstance(el);
      inst?.hide();
    }
    onCreated?.();
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#${MODAL_ID}`}
      >
        + Nuevo usuario
      </button>

      <Modal
        id={MODAL_ID}
        title="Registrar usuario"
        footer={
          <>
            <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="submit" form="user-create-form" className="btn btn-primary">
              Crear usuario
            </button>
          </>
        }
      >
        <UserCreateForm variant="plain" onSuccess={handleSuccess} formId="user-create-form" />
      </Modal>
    </>
  );
}
