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
      // Normalizamos errores para la UI
      const status = err?.response?.status;
      const raw = err?.response?.data;
      const msg = (raw?.mensaje || raw?.message || "").toString();

      // 🚫 Usuario inactivo/suspendido: SOLO 403 o mensaje explícito
      const esNoActivoPorStatus = status === 403; // <- clave: solo 403 = inactivo
      const esNoActivoPorMensaje = /inactiv|suspendid/i.test(msg);

      if (esNoActivoPorStatus || esNoActivoPorMensaje) {
        const e = new Error("Usuario inactivo");
        e.code = "USER_INACTIVE";
        e.usuario = usuario;
        throw e;
      }

      // 🔐 Credenciales inválidas (clave o usuario)
      if (status === 401) {
        const e = new Error("Usuario o contraseña incorrectos");
        e.code = "BAD_CREDENTIALS";
        e.usuario = usuario;
        throw e;
      }

      // Otros 4xx: mantener error original para que la página decida
      if (status >= 400 && status < 500) {
        const e = new Error(msg || "Error en la solicitud");
        e.code = "CLIENT_ERROR";
        e.status = status;
        throw e;
      }

      // Resto (5xx, red, etc.)
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, loading };
}
