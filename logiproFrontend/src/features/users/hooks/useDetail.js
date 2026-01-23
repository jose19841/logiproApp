// src/features/users/hooks/useDetail.js
import { useEffect, useState } from "react";
import useToast from "@shared/hooks/useToast";
import { fetchUserById } from "@/features/users/services/userList";

export default function useDetail(id) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await fetchUserById(id);
        if (!data) {
          toast.showWarning("Usuario no encontrado", "No se pudo encontrar el usuario solicitado.");
        }
        setUser(data);
      } catch (e) {
        console.error(e);
        toast.showError("Error", "No se pudo cargar el usuario");
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  return { user, loading };
}
