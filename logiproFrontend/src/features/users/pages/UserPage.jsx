// src/features/users/pages/UserPage.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { alertWarning } from "@shared/components/alerts/swal";
import UserList from "@/features/users/pages/UserList";

export default function UserPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.rol === "ADMIN";

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
