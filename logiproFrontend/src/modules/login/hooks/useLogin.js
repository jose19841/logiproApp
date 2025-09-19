// src/modules/login/hooks/useLogin.js
import { useCallback, useState } from "react";
import { setUser } from "../../../auth/session";
import { login as loginApi } from "../../../services/auth.api";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (creds) => {
    // soporta {usuario, clave} o {username, password}
    const usuario = creds?.usuario ?? creds?.username ?? "";
    const clave   = creds?.clave   ?? creds?.password ?? "";

    setLoading(true);
    try {
      const res = await loginApi(usuario, clave);
      if (res?.user) setUser(res.user);
      return res;
    } catch (err) {
      // 🔴 Normalizamos INACTIVO: 401/403 o mensajes típicos del backend
      const status = err?.response?.status;
      const raw = err?.response?.data;
      const msg = (raw?.mensaje || raw?.message || "").toString();

      const esNoActivoPorStatus = status === 401 || status === 403;
      const esNoActivoPorMensaje = /inactiv|suspendid|registrad/i.test(msg);

      if (esNoActivoPorStatus || esNoActivoPorMensaje) {
        const e = new Error("Usuario inactivo");
        e.code = "USER_INACTIVE";
        e.usuario = usuario;
        throw e;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading };
}
