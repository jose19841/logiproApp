// src/auth/session.js
// Maneja tokens y usuario en memoria + sessionStorage

let accessToken = null;
const listeners = new Set();

/** Establece el access token en memoria y notifica suscriptores */
export function setAccessToken(token) {
  accessToken = token || null;
  for (const fn of listeners) {
    try {
      fn(accessToken);
    } catch (e) {
      // ignoramos errores del listener
    }
  }
}

/** Devuelve el access token actual (o null) */
export function getAccessToken() {
  return accessToken;
}

/** Limpia el access token (logout / refresh fallido) */
export function clearAccessToken() {
  setAccessToken(null);
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
}

/** Suscribirse a cambios del token. Retorna una función para desuscribir. */
export function subscribe(fn) {
  if (typeof fn === "function") {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
  return () => {};
}

/** Guardar usuario en sessionStorage */
export function setUser(user) {
  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  } else {
    sessionStorage.removeItem("user");
  }
}

/** Leer usuario desde sessionStorage */
export function getUser() {
  const raw = sessionStorage.getItem("user");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
