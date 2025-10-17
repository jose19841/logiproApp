import { useAuth } from "@/features/auth/context/AuthContext";
import ChangePasswordModal from "@/features/users/components/ChangePasswordModal";
import { useNavigate } from "react-router-dom";

export default function UserProfileMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  const initial =
    (user?.usuario?.toString().trim().charAt(0).toUpperCase()) || "?";

  const WIDTH = 260;

  const handleAfterPasswordChange = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="dropdown user-menu" style={{ width: WIDTH }}>
      {/* Botón principal */}
      <button
        className="btn user-toggle d-flex align-items-center gap-2 w-100 px-3 py-2"
        type="button"
        id="userMenuButton"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <div className="user-avatar rounded-circle d-flex align-items-center justify-content-center">
          {initial}
        </div>
        <span className="fw-semibold text-truncate user-name">{user.usuario}</span>
      </button>

      {/* Dropdown */}
      <ul
        className="dropdown-menu p-0 overflow-hidden user-dropdown"
        aria-labelledby="userMenuButton"
        style={{ width: WIDTH }}
      >
        <li className="text-center py-3 user-dropdown-header">
          <div className="fw-semibold">{user.usuario}</div>
          <div className="small role-line">
            {user.rol || "Usuario"}
          </div>
        </li>

        <li className="divider-line" />

        {/* Cambiar contraseña */}
        <li>
          <button
            type="button"
            className="btn w-100 rounded-0 fw-bold border-0 py-3 user-dropdown-action"
            data-bs-toggle="modal"
            data-bs-target="#changePasswordModal"
          >
            Cambiar contraseña
          </button>
        </li>

        {/* Cerrar sesión */}
        <li>
          <button
            type="button"
            className="btn w-100 rounded-0 fw-bold border-0 py-3 user-dropdown-action logout"
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>

      {/* Modal */}
      <ChangePasswordModal id="changePasswordModal" onDone={handleAfterPasswordChange} />
    </div>
  );
}
