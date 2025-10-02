
import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
  const [openUsuarios, setOpenUsuarios] = useState(false);

  return (
    <aside className="sidebar">
      <div className="p-3 border-bottom">
        <div className="fw-bold">LogiPro</div>
        <small className="text-muted">Panel</small>
      </div>

      <nav className="list-group list-group-flush">
        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            "list-group-item list-group-item-action d-flex align-items-center" +
            (isActive ? " active" : "")
          }
        >
          <span className="me-2">🏠</span> Dashboard
        </NavLink>

        {/* Usuarios - Toggle */}
        <button
          type="button"
          onClick={() => setOpenUsuarios(!openUsuarios)}
          className={
            "list-group-item list-group-item-action d-flex justify-content-between align-items-center" +
            (openUsuarios ? " active" : "")
          }
        >
          <span>
            <span className="me-2">👤</span> Usuarios
          </span>
          <span>{openUsuarios ? "▾" : "▸"}</span>
        </button>

        {/* Submenú Usuarios */}
        {openUsuarios && (
          <div className="submenu">
            <NavLink
              to="/usuarios"
              className={({ isActive }) =>
                "list-group-item list-group-item-action" +
                (isActive ? " active" : "")
              }
            >
              📋 Listado
            </NavLink>
            <NavLink
              to="/usuarios/nuevo"
              className={({ isActive }) =>
                "list-group-item list-group-item-action" +
                (isActive ? " active" : "")
              }
            >
              ➕ Nuevo usuario
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}
