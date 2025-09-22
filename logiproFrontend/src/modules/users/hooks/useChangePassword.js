import { useCallback, useState } from "react";
import { changeMyPassword } from "../services/passwordApi";

/**
 * Cambiar la clave del usuario autenticado.
 * Backend: PUT /api/usuarios/mi-clave
 * Los campos del payload deben ir en español: { claveActual, nuevaClave, confirmarClave }
 */
export function useChangePassword() {
  const [loading, setLoading] = useState(false);

  const changePassword = useCallback(async ({ claveActual, nuevaClave, confirmarClave }) => {
    setLoading(true);
    try {
      // Validaciones de front las hace el modal con SweetAlert.
      await changeMyPassword({ claveActual, nuevaClave, confirmarClave });
    } finally {
      setLoading(false);
    }
  }, []);

  return { changePassword, loading };
}
