import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser, subscribe } from "../auth/session";
import { alertConfirm, alertError, alertSuccess } from "../components/alerts/swal";
import { logout } from "../services/auth.api";

export default function useProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const unsub = subscribe(() => setUser(getUser()));
    return () => unsub();
  }, []);

  // Calcula la inicial a partir del username
  const initial = useMemo(() => {
    return user?.usuario?.charAt(0)?.toUpperCase() || "?";
  }, [user]);

  const logoutAll = async () => {
    const res = await alertConfirm(
      "¿Cerrar sesión?",
      "Se cerrará tu sesión en todos los dispositivos."
    );
    if (!res.isConfirmed) return { ok: false, cancelled: true };

    try {
      await logout(); // POST /auth/logout-all + limpiar sesión cliente
      await alertSuccess("Sesión cerrada", "Volvé a iniciar sesión cuando quieras.");
      navigate("/login", { replace: true });
      return { ok: true };
    } catch (e) {
      await alertError("No se pudo cerrar sesión", "Intentá nuevamente.");
      return { ok: false, error: e };
    }
  };

  return { user, initial, logoutAll };
}
