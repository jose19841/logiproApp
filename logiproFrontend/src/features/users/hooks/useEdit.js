// src/features/users/hooks/useEdit.js
import { useCallback, useEffect, useState } from "react";
import {
  alertConfirm,
  alertError,
  alertSuccess,
  alertWarning,
} from "@shared/components/alerts/swal";
import { fetchUserById, updateUser, changeUserState } from "@/features/users/services/userList";

/**
 * Hook de edición de usuario.
 * Uso:
 * const { form, onChange, setField, load, submit, loading, saving, notFound } = useEdit(id);
 */
export default function useEdit(userId) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    email: "",
    domicilio: "",
    usuario: "",
    rol: "USER",
    estado: "ACTIVO",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [initialState, setInitialState] = useState("ACTIVO"); // Estado inicial para detectar cambios

  const mapFromApi = useCallback((u) => {
    // 🔍 DEBUG: Ver qué datos trae el backend
    console.log("🔍 Usuario del backend:", u);
    
    return {
      nombre: u?.nombre ?? "",
      apellido: u?.apellido ?? "",
      dni: u?.dni ?? "",
      telefono: u?.telefono ?? "",
      email: u?.email ?? "",
      domicilio: u?.domicilio ?? "",
      usuario: u?.usuario ?? "",
      rol: u?.rol?.nombre ?? u?.rol ?? "USER",
      estado: u?.estado ?? "ACTIVO",
    };
  }, []);

  const load = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setNotFound(false);
      const data = await fetchUserById(userId);
      if (!data) {
        setNotFound(true);
        alertWarning("Usuario no encontrado");
        return;
      }
      const mappedData = mapFromApi(data);
      setForm(mappedData);
      setInitialState(mappedData.estado); // Guardar estado inicial
    } catch (e) {
      console.error("❌ Error al cargar usuario:", e);
      alertError("No se pudo cargar el usuario");
    } finally {
      setLoading(false);
    }
  }, [userId, mapFromApi]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = useCallback((name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
  }, []);

  const onChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setField(name, value);
    },
    [setField]
  );

  const submit = useCallback(async () => {
    const ok = await alertConfirm(
      "¿Guardar cambios?",
      `Se actualizarán los datos de "${form.usuario}".`
    );
    if (!ok.isConfirmed) return false;

    try {
      setSaving(true);

      // ✅ Solo envía campos que acepta ActualizarUsuarioRequestDTO (sin clave)
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        dni: form.dni,
        telefono: form.telefono || "",
        email: form.email || "",
        domicilio: form.domicilio || "",
        usuario: form.usuario,
        // ❌ NO enviar clave - se cambia por endpoint separado /mi-clave
        rol: form.rol
      };

      console.log("🔍 Payload enviado:", payload);
      console.log("🔍 ID del usuario:", userId);

      // 1. Actualizar datos del usuario (PUT)
      await updateUser(userId, payload);

      // 2. Si el estado cambió, actualizar con PATCH
      if (form.estado !== initialState) {
        console.log(`🔄 Cambiando estado de ${initialState} a ${form.estado}`);
        await changeUserState(userId, form.estado);
      }

      await alertSuccess("Actualizado", "Los datos del usuario fueron guardados.");
      return true;
    } catch (e) {
      console.error("❌ Error completo:", e);
      console.error("❌ Response data:", e.response?.data);
      console.error("❌ Response status:", e.response?.status);
      alertError("No se pudo actualizar el usuario");
      return false;
    } finally {
      setSaving(false);
    }
  }, [userId, form, initialState]);

  return {
    form,
    onChange,
    setField,
    load,
    submit,
    loading,
    saving,
    notFound,
  };
}