// src/components/header/UserProfileMenu.jsx
import useProfile from "../../hooks/useProfile";

export default function UserProfileMenu() {
  const { user, initial, logoutAll } = useProfile();
  if (!user) return null;

  // Ajustá este ancho si querés más/menos (dropdown y botón usan el mismo)
  const WIDTH = 260;

  return (
    <div className="dropdown" style={{ width: WIDTH }}>
      {/* Botón: azul, ancho fijo, A grande a la izquierda */}
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

      {/* Menú: mismo ancho que el botón */}
      <ul
        className="dropdown-menu p-0 overflow-hidden show-on-click"
        aria-labelledby="userMenuButton"
        style={{ width: WIDTH }}
      >
        {/* Encabezado azul con usuario/rol en blanco */}
        <li
          className="text-center py-3"
          style={{ backgroundColor: "var(--bs-primary)", color: "#fff" }}
        >
          <div className="fw-semibold">{user.usuario}</div>
          <div className="small" style={{ opacity: 0.9 }}>
            {user.rol || "Usuario"}
          </div>
        </li>

        {/* Separador fino (blanco translúcido sobre azul) */}
        <li style={{ borderTop: "1px solid rgba(255,255,255,.25)" }} />

        {/* Botón Cerrar sesión: fondo azul, texto rojo, ancho completo */}
        <li>
          <button
            type="button"
            className="btn w-100 rounded-0 fw-bold border-0 py-3"
            style={{ backgroundColor: "var(--bs-primary)", color: "var(--bs-danger)" }}
            onClick={logoutAll}
          >
            Cerrar sesión
          </button>
        </li>
      </ul>
    </div>
  );
}
