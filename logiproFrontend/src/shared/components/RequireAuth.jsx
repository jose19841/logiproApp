// src/shared/components/RequireAuth.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { alertError, alertLoading } from "@shared/components/alerts/swal";
import { refresh } from "@shared/services/auth.api";
import { clearAccessToken, getAccessToken, subscribe } from "@shared/utils/session";

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
    
    return null;
  }

  return children;
}
