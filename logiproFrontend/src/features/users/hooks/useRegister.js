import { useCallback, useState } from "react";
import useToast from "@shared/hooks/useToast";
import { registerUser } from "@/features/users/services/userApi";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = useCallback(async (form) => {
    setLoading(true);
    try {
      // Validaciones mínimas en el front
      if (!form.nombre) throw new Error("El nombre es obligatorio.");
      if (!form.apellido) throw new Error("El apellido es obligatorio.");
      if (!form.dni) throw new Error("El DNI es obligatorio.");

      if (!form.usuario || form.usuario.length < 4) {
        throw new Error("El usuario debe tener entre 4 y 20 caracteres.");
      }
      if (!form.clave || form.clave.length < 8) {
        throw new Error("La clave debe tener entre 8 y 20 caracteres.");
      }
      if (!form.rol) {
        throw new Error("Seleccioná un rol.");
      }

      // Enviar al backend con todos los campos
      const created = await registerUser(form);

      toast.showSuccess(
        "Usuario creado",
        `Se creó ${created.usuario} con rol ${created.rol} (estado: ${created.estado}).`
      );

      return { ok: true, data: created };
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo registrar el usuario.";
      toast.showError("Error", msg);
      return { ok: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { submit, loading };
}
