import { Outlet } from "react-router-dom";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Header superior */}
      <Header />

      {/* Área central: Sidebar + Contenido */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar izquierdo */}
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-grow-1">
          <div className="container-fluid py-3">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-top bg-white">
        <div className="container-fluid py-2">
          <small className="text-muted">
            © {new Date().getFullYear()} LogiPro
          </small>
        </div>
      </footer>
    </div>
  );
}
