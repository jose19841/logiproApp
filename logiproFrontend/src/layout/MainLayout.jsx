// src/layout/MainLayout.jsx
import { Link, Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header */}
      <header className="border-bottom bg-white">
        <div className="container-fluid d-flex align-items-center justify-content-between py-2">
          <div className="fw-bold">LogiPro</div>
          <nav className="d-flex align-items-center gap-3">
            <Link to="/" className="text-decoration-none">Dashboard</Link>
            {/* futuros links:
            <Link to="/inventario" className="text-decoration-none">Inventario</Link>
            <Link to="/ordenes" className="text-decoration-none">Órdenes</Link>
            */}
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-grow-1">
        <div className="container-fluid py-3">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-top bg-white">
        <div className="container-fluid py-2">
          <small className="text-muted">© {new Date().getFullYear()} LogiPro</small>
        </div>
      </footer>
    </div>
  );
}
