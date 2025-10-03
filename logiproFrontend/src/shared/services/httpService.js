import { getAccessToken } from "@shared/utils/session";
import apiClient from "@shared/services/apiClient";
import { refresh } from "@shared/services/auth.api";

/**
 * Wrapper simple sobre apiClient.
 * - Adjunta Authorization si hay token
 * - Ante 401 hace refresh y reintenta 1 vez
 */
export async function httpRequest(config) {
  const attachAuth = (cfg, token) => {
    if (token) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  };

  const token = getAccessToken();
  attachAuth(config, token);

  try {
    return await apiClient(config);
  } catch (err) {
    if (err?.response?.status !== 401 || config._retry) throw err;
    config._retry = true;
    const newToken = await refresh();
    if (!newToken) throw err;
    attachAuth(config, newToken);
    return await apiClient(config);
  }
}
