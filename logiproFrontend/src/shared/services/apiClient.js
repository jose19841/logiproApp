// src/shared/services/apiClient.js
// Unified HTTP client with token management, auth interceptors, and auto-refresh
import axios from "axios";

const BASE_URL = import.meta.env?.VITE_API_BASE_URL ?? "http://localhost:8080";
const DEFAULT_HEADERS = { "Content-Type": "application/json" };

// ============================================================================
// TOKEN & USER STORAGE (unified from session.js)
// ============================================================================

let accessToken = null;
const listeners = new Set();

/** Set access token in memory and sessionStorage, notify subscribers */
export function setAccessToken(token) {
  accessToken = token || null;

  if (token) {
    sessionStorage.setItem("accessToken", token);
  } else {
    sessionStorage.removeItem("accessToken");
  }

  for (const fn of listeners) {
    try { fn(accessToken); } catch { /* noop */ }
  }
}

/** Get access token (memory -> sessionStorage -> localStorage) */
export function getAccessToken() {
  return (
    accessToken ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

/** Clear all tokens and user data (logout / refresh failed) */
export function clearAccessToken() {
  accessToken = null;
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
  for (const fn of listeners) {
    try { fn(null); } catch { /* noop */ }
  }
}

/** Subscribe to token changes. Returns unsubscribe function. */
export function subscribe(fn) {
  if (typeof fn === "function") {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  return () => {};
}

/** Save/read refresh token in sessionStorage */
export function setRefreshToken(token) {
  if (token) sessionStorage.setItem("refreshToken", token);
  else sessionStorage.removeItem("refreshToken");
}

export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken") || null;
}

/** Save user in sessionStorage */
export function setUser(user) {
  if (user) sessionStorage.setItem("user", JSON.stringify(user));
  else sessionStorage.removeItem("user");
}

/** Read user from sessionStorage (with fallback to localStorage) */
export function getUser() {
  const raw =
    sessionStorage.getItem("user") || localStorage.getItem("user") || null;
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ============================================================================
// HTTP CLIENT (singleton with interceptors)
// ============================================================================

const g = globalThis;

// Singleton for HMR stability
if (!g.__LOGIPRO_API_CLIENT__) {
  g.__LOGIPRO_API_CLIENT__ = axios.create({
    baseURL: BASE_URL,
    headers: DEFAULT_HEADERS,
  });
}
const apiClient = g.__LOGIPRO_API_CLIENT__;

// Register interceptors once per instance
if (!apiClient.__INTERCEPTORS_REGISTERED__) {
  // Request interceptor: auto-attach Authorization header
  apiClient.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: handle 401 with auto-refresh
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // ✅ DON'T auto-refresh for auth endpoints (login, refresh, forgot, reset)
      // These endpoints return 401 for bad credentials, not expired tokens
      const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

      if (error?.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Global unique refresh promise (prevents concurrent refresh calls)
      if (!g.__LOGIPRO_REFRESH_PROMISE__) {
        g.__LOGIPRO_REFRESH_PROMISE__ = (async () => {
          try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              throw new Error("No refresh token available");
            }

            // Bare axios client (no interceptors)
            const bareClient = axios.create({
              baseURL: BASE_URL,
              headers: DEFAULT_HEADERS,
            });

            const { data } = await bareClient.post("/auth/refresh", { refreshToken });

            if (data?.accessToken) {
              setAccessToken(data.accessToken);
              if (data?.refreshToken) {
                setRefreshToken(data.refreshToken);
              }
              return data.accessToken;
            }
            throw new Error("No access token in refresh response");
          } catch (err) {
            clearAccessToken();
            window.location.assign("/login");
            throw err;
          } finally {
            g.__LOGIPRO_REFRESH_PROMISE__ = null;
          }
        })();
      }

      try {
        const newToken = await g.__LOGIPRO_REFRESH_PROMISE__;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
  );

  apiClient.__INTERCEPTORS_REGISTERED__ = true;
}

export default apiClient;
