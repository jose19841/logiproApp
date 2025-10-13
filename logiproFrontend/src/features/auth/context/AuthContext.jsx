// src/features/auth/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { login as loginApi, logout as logoutApi, refresh as refreshApi } from "@shared/services/auth.api";
import {
  getAccessToken,
  getRefreshToken,
  getUser,
  subscribe,
} from "@shared/services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  // Derived state
  const isAuthenticated = !!user && !!getAccessToken();

  // Cleanup refresh timer
  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Schedule proactive token refresh (15 min before expiry, or 5min default)
  const scheduleRefresh = useCallback(() => {
    clearRefreshTimer();

    const token = getAccessToken();
    if (!token) return;

    try {
      // Decode JWT to get exp (simple base64 decode, no validation needed client-side)
      const payload = JSON.parse(atob(token.split(".")[1]));
      const exp = payload.exp * 1000; // convert to ms
      const now = Date.now();
      const timeUntilExpiry = exp - now;

      // Refresh 15 min (900000ms) before expiry, but at least 1min from now
      const refreshIn = Math.max(timeUntilExpiry - 900000, 60000);

      if (refreshIn > 0) {
        refreshTimerRef.current = setTimeout(async () => {
          try {
            await refreshApi();
            scheduleRefresh(); // reschedule after successful refresh
          } catch (error) {
            console.error("Auto-refresh failed:", error);
          }
        }, refreshIn);
      }
    } catch (error) {
      // If can't decode, just refresh in 5 min
      refreshTimerRef.current = setTimeout(async () => {
        try {
          await refreshApi();
          scheduleRefresh();
        } catch (err) {
          console.error("Auto-refresh failed:", err);
        }
      }, 300000); // 5 min
    }
  }, [clearRefreshTimer]);

  // Login function
  const login = useCallback(async (credentials) => {
    const usuario = credentials?.usuario ?? credentials?.username ?? "";
    const clave = credentials?.clave ?? credentials?.password ?? "";

    try {
      const data = await loginApi(usuario, clave);

      if (data?.user) {
        setUser(data.user);
        scheduleRefresh();
      }

      return data;
    } catch (err) {
      // Normalize errors for UI
      const status = err?.response?.status;
      const raw = err?.response?.data;
      const msg = (raw?.mensaje || raw?.message || "").toString();

      // 🚫 Inactive/suspended user: 403 or explicit message
      const esNoActivoPorStatus = status === 403;
      const esNoActivoPorMensaje = /inactiv|suspendid/i.test(msg);

      if (esNoActivoPorStatus || esNoActivoPorMensaje) {
        const e = new Error(msg || "Usuario inactivo");
        e.code = "USER_INACTIVE";
        e.usuario = usuario;
        throw e;
      }

      // 🔐 Invalid credentials
      if (status === 401) {
        const e = new Error("Usuario o contraseña incorrectos");
        e.code = "BAD_CREDENTIALS";
        e.usuario = usuario;
        throw e;
      }

      // Other 4xx: keep original error
      if (status >= 400 && status < 500) {
        const e = new Error(msg || "Error en la solicitud");
        e.code = "CLIENT_ERROR";
        e.status = status;
        throw e;
      }

      // Rest (5xx, network, etc.)
      throw err;
    }
  }, [scheduleRefresh]);

  // Logout function
  const logout = useCallback(async () => {
    clearRefreshTimer();
    await logoutApi();
    setUser(null);
  }, [clearRefreshTimer]);

  // Check auth on mount
  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const access = getAccessToken();
      const refresh = getRefreshToken();
      const storedUser = getUser();

      if (access && storedUser) {
        // Valid session in memory/storage
        if (mounted) {
          setUser(storedUser);
          scheduleRefresh();
          setIsLoading(false);
        }
        return;
      }

      if (refresh) {
        // Try to refresh
        try {
          await refreshApi();
          const newUser = getUser();
          if (mounted) {
            setUser(newUser);
            scheduleRefresh();
            setIsLoading(false);
          }
          return;
        } catch (error) {
          // Refresh failed, clear session
          clearAccessToken();
        }
      }

      // No valid session
      if (mounted) {
        setUser(null);
        setIsLoading(false);
      }
    }

    checkAuth();

    // Subscribe to token changes (logout, refresh, etc)
    const unsubscribe = subscribe((token) => {
      if (!token) {
        // Token cleared (logout or expired)
        clearRefreshTimer();
        if (mounted) setUser(null);
      } else {
        // Token updated
        const newUser = getUser();
        if (mounted && newUser) {
          setUser(newUser);
          scheduleRefresh();
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
      clearRefreshTimer();
    };
  }, [scheduleRefresh, clearRefreshTimer]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
