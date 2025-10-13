
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import "./sidebar.css";

export default function Sidebar() {
  const { user } = useAuth();
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openSuppliers, setOpenSuppliers] = useState(false);
  const [openClaims, setOpenClaims] = useState(false);

  // Verificar si el usuario es ADMIN
  const isAdmin = user?.rol === "ADMIN" || user?.rol?.nombre === "ADMIN";

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

        {/* Usuarios - Toggle (Solo para ADMIN) */}
        {isAdmin && (
          <>
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
          </>
        )}

        {/* Suppliers - Toggle */}
        <button
          type="button"
          onClick={() => setOpenSuppliers(!openSuppliers)}
          className={
            "list-group-item list-group-item-action d-flex justify-content-between align-items-center" +
            (openSuppliers ? " active" : "")
          }
        >
          <span>
            <span className="me-2">🚚</span> Proveedores
          </span>
          <span>{openSuppliers ? "▾" : "▸"}</span>
        </button>

        {/* Submenú Suppliers */}
        {openSuppliers && (
          <div className="submenu">
            <NavLink
              to="/suppliers"
              className={({ isActive }) =>
                "list-group-item list-group-item-action" +
                (isActive ? " active" : "")
              }
            >
              📋 Listado De Proveedores
            </NavLink>
            <NavLink
              to="/suppliers/new"
              className={({ isActive }) =>
                "list-group-item list-group-item-action" +
                (isActive ? " active" : "")
              }
            >
              ➕ Nuevo Proveedor
            </NavLink>
          </div>
        )}

        {/* Claims - Toggle */}
        <button
          type="button"
          onClick={() => setOpenClaims(!openClaims)}
          className={
            "list-group-item list-group-item-action d-flex justify-content-between align-items-center" +
            (openClaims ? " active" : "")
          }
        >
          <span>
            <span className="me-2">📝</span> Reclamos
          </span>
          <span>{openClaims ? "▾" : "▸"}</span>
        </button>

        {/* Submenú Claims */}
        {openClaims && (
          <div className="submenu">
            <NavLink
              to="/claims"
              className={({ isActive }) =>
                "list-group-item list-group-item-action" +
                (isActive ? " active" : "")
              }
            >
              📋 Listado de Reclamos
            </NavLink>
            <NavLink
              to="/claims/new"
              className={({ isActive }) =>
                "list-group-item list-group-item-action" +
                (isActive ? " active" : "")
              }
            >
              ➕ Nuevo Reclamo
            </NavLink>
          </div>
        )}
      </nav>
    </aside>
  );
}
