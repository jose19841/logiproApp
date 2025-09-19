// src/modules/users/pages/UserPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../../auth/session";
import { alertWarning } from "../../../components/alerts/swal";
import UserList from "./UserList";

export default function UserPage() {
  const navigate = useNavigate();
  const me = getUser();
  const isAdmin = me?.rol === "ADMIN";

  useEffect(() => {
    if (!isAdmin) {
      alertWarning(
        "Acceso denegado",
        "Necesitás permisos de ADMIN para ver usuarios."
      );
      navigate("/"); // redirige al dashboard
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null; // no muestra nada, ya redirige
  }

  return (
    <div className="container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h4 className="mb-0">Usuarios</h4>
      </div>

      {/* Tabla de usuarios */}
      <UserList />
    </div>
  );
}
