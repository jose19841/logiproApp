// src/features/auth/hooks/useLogin.js
// ⚠️ DEPRECATED: Use useAuth from AuthContext instead
// This is a compatibility shim for legacy code

import { useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

export function useLogin() {
  const { login: contextLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const login = async (creds) => {
    setLoading(true);
    try {
      const res = await contextLogin(creds);
      return res;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}
