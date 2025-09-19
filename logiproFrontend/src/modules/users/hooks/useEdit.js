// src/modules/users/hooks/useEdit.js
import { useCallback, useEffect, useState } from "react";
import {
    alertConfirm,
    alertError,
    alertSuccess,
    alertWarning,
} from "../../../components/alerts/swal";
import { fetchUserById, updateUser } from "../services/userList";

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

  const mapFromApi = useCallback((u) => ({
    nombre: u?.nombre ?? "",
    apellido: u?.apellido ?? "",
    dni: u?.dni ?? "",
    telefono: u?.telefono ?? "",
    email: u?.email ?? "",
    domicilio: u?.domicilio ?? "",
    usuario: u?.usuario ?? "",
    rol: u?.rol?.nombre ?? u?.rol ?? "USER",
    estado: u?.estado ?? "ACTIVO",
  }), []);

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
      setForm(mapFromApi(data));
    } catch (e) {
      console.error(e);
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
      // Ajustá si tu backend espera el rol anidado:
      // const payload = { ...form, rol: { nombre: form.rol } };
      const payload = { ...form };
      await updateUser(userId, payload);
      await alertSuccess("Actualizado", "Los datos del usuario fueron guardados.");
      return true;
    } catch (e) {
      console.error(e);
      alertError("No se pudo actualizar el usuario");
      return false;
    } finally {
      setSaving(false);
    }
  }, [userId, form]);

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
