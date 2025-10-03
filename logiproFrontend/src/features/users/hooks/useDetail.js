// src/features/users/hooks/useDetail.js
import { useEffect, useState } from "react";
import { alertError, alertWarning } from "@shared/components/alerts/swal";
import { fetchUserById } from "@/features/users/services/userList";

export default function useDetail(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchUserById(id);
        if (!data) {
          alertWarning("Usuario no encontrado");
        }
        setUser(data);
      } catch (e) {
        console.error(e);
        alertError("No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  return { user, loading };
}
