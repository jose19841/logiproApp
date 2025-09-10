// src/auth/RequireAuth.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { alertError, alertLoading } from "../components/alerts/swal";
import { refresh } from "../services/auth.api";
import { clearAccessToken, getAccessToken, subscribe } from "./session";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verifySession() {
      const access = getAccessToken();
      const refreshToken = sessionStorage.getItem("refreshToken");

      if (access) {
        setChecking(false);
        return;
      }

      if (refreshToken) {
        alertLoading("Verificando sesión…");
        try {
          const newToken = await refresh();
          Swal.close(); // cerrar loading
          if (newToken) {
            if (mounted) setChecking(false);
            return;
          }
        } catch {
          // cae al redirect
        }
        Swal.close();
        alertError("Sesión expirada", "Por favor inicia sesión de nuevo");
      }

      // limpiar y redirigir
      clearAccessToken();
      sessionStorage.removeItem("refreshToken");
      navigate("/login", { replace: true, state: { from: location } });
    }

    verifySession();

    // suscripción a cambios de token
    const unsubscribe = subscribe((token) => {
      if (!token) {
        alertError("Sesión expirada", "Debes iniciar sesión de nuevo");
        navigate("/login", { replace: true, state: { from: location } });
      }
    });

    return () => {
      mounted = false;
      unsubscribe?.();
    };
  }, [navigate, location]);

  if (checking) {
    // mientras espera, no renderiza nada (el Swal ya está en pantalla)
    return null;
  }

  return children;
}
