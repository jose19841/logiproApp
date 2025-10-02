
import { useNavigate } from "react-router-dom";
import useProfile from "@shared/hooks/useProfile";
import ChangePasswordModal from "@/modules/users/components/ChangePasswordModal";
import { logout } from "@/services/auth.api"; 

export default function UserProfileMenu() {
  const { user } = useProfile(); 
  const navigate = useNavigate();
  if (!user) return null;

  
  const initial =
    (user?.usuario?.toString().trim().charAt(0).toUpperCase()) || "?";

  const WIDTH = 260;

  const handleAfterPasswordChange = async () => {
    try {
      await logout(); // revoca refresh en backend y limpia cliente
    } finally {
      navigate("/login", { replace: true }); // directo al login
    }
  };

  return (
    <div className="dropdown" style={{ width: WIDTH }}>
      {/* Botón principal */}
      <button
        className="btn d-flex align-items-center gap-2 w-100 px-3 py-2"
        type="button"
        id="userMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        style={{ backgroundColor: "var(--bs-primary)", color: "#fff" }}
      >
        <div
          className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, fontSize: 18, fontWeight: 800 }}
        >
          {initial}
        </div>
        <span className="fw-semibold text-truncate">{user.usuario}</span>
      </button>

      {/* Dropdown */}
      <ul
        className="dropdown-menu p-0 overflow-hidden show-on-click"
        aria-labelledby="userMenuButton"
        style={{ width: WIDTH }}
      >
        <li
          className="text-center py-3"
          style={{ backgroundColor: "var(--bs-primary)", color: "#fff" }}
        >
          <div className="fw-semibold">{user.usuario}</div>
          <div className="small" style={{ opacity: 0.9 }}>
            {user.rol || "Usuario"}
          </div>
        </li>

        <li style={{ borderTop: "1px solid rgba(255,255,255,.25)" }} />

        {/* Botón cambiar contraseña */}
        <li>
          <button
            type="button"
            className="btn w-100 rounded-0 fw-bold border-0 py-3"
            style={{ backgroundColor: "var(--bs-primary)", color: "#fff" }}
            data-bs-toggle="modal"
            data-bs-target="#changePasswordModal"
          >
            Cambiar contraseña
          </button>
        </li>

        {/* Cerrar sesión manual */}
        <li>
          <button
            type="button"
            className="btn w-100 rounded-0 fw-bold border-0 py-3"
            style={{ backgroundColor: "var(--bs-primary)", color: "var(--bs-danger)" }}
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>

      {/* Modal de cambio de clave */}
      <ChangePasswordModal id="changePasswordModal" onDone={handleAfterPasswordChange} />
    </div>
  );
}
