import { getAccessToken } from "@shared/utils/session";
import apiClient from "@shared/services/apiClient";
import { refresh } from "@/services/auth.api";

/** 
 * Wrapper simple sobre apiClient.
 * - Adjunta Authorization si hay token
 * - Ante 401 hace refresh y reintenta 1 vez
 */
export async function httpRequest(config) {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    return await apiClient(config);
  } catch (err) {
    if (err?.response?.status !== 401 || config._retry) {
      throw err; // no es 401 o ya se reintentó
    }

    config._retry = true;

    // Intentar refresh
    const newToken = await refresh();
    if (!newToken) {
      throw err; // refresh falló → sesión inválida
    }

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${newToken}`;
    return apiClient(config);
  }
}
