// src/modules/login/hooks/useLogin.js
import { useCallback, useState } from "react";
import { setAccessToken } from "../../../auth/session";
import apiClient from "../../../services/apiClient"; // ajustá si tu path es distinto

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post("/auth/login", { username, password });

      // Guardar tokens
      if (data?.accessToken) setAccessToken(data.accessToken); // memoria
      if (data?.refreshToken) sessionStorage.setItem("refreshToken", data.refreshToken); // pestaña

      // Guardar usuario (para header/perfil)
      if (data?.user) {
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      return data; // { accessToken, refreshToken, user }
    } catch (err) {
      const msg = err?.response?.data?.message || "Credenciales inválidas o error de conexión";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading, error };
}
