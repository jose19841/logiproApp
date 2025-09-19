// src/auth/session.js
// Maneja tokens y usuario en memoria + sessionStorage (con fallback a localStorage)

let accessToken = null;
const listeners = new Set();

/** Establece el access token en memoria y sessionStorage, y notifica suscriptores */
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

/** Devuelve el access token actual (memoria -> sessionStorage -> localStorage) */
export function getAccessToken() {
  return (
    accessToken ||
    sessionStorage.getItem("accessToken") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

/** Limpia tokens y usuario (logout / refresh fallido) */
export function clearAccessToken() {
  accessToken = null;
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
  for (const fn of listeners) {
    try { fn(null); } catch { /* noop */ }
  }
}

/** Suscribirse a cambios del token. Retorna una función para desuscribir. */
export function subscribe(fn) {
  if (typeof fn === "function") {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  return () => {};
}

/** Guardar / leer refresh token en sessionStorage */
export function setRefreshToken(token) {
  if (token) sessionStorage.setItem("refreshToken", token);
  else sessionStorage.removeItem("refreshToken");
}
export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken") || null;
}

/** Guardar usuario en sessionStorage */
export function setUser(user) {
  if (user) sessionStorage.setItem("user", JSON.stringify(user));
  else sessionStorage.removeItem("user");
}

/** Leer usuario desde sessionStorage (con fallback a localStorage) */
export function getUser() {
  const raw =
    sessionStorage.getItem("user") || localStorage.getItem("user") || null;
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
