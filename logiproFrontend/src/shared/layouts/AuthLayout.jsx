// src/shared/layouts/AuthLayout.jsx
import "@shared/styles/theme-controlroom.css";
import "@shared/styles/auth.css";

/**
 * Layout para páginas de autenticación (Login, Recover, Reset)
 * Aplica el tema 3D metálico sin sidebar ni header
 */
export default function AuthLayout({ children }) {
  return (
    <div className="theme-controlroom auth-layout">
      {children}
    </div>
  );
}
