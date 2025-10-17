// src/shared/layouts/MainLayout.jsx
import Header from "@shared/components/header/Header";
import Sidebar from "@shared/components/sidebar/Sidebar";
import "@shared/styles/theme-controlroom.css"; // tema 3D global
import "@shared/styles/forms-fix.css"; // fixes de responsive
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="theme-controlroom min-vh-100 d-flex flex-column">
      {/* Header superior */}
      <Header />

      {/* Área central: Sidebar + Contenido */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar izquierdo (scroll independiente si crece) */}
        <aside className="sidebar d-flex flex-column">
          <Sidebar />
        </aside>

        {/* Contenido principal con scroll interno */}
        <main className="content flex-grow-1">
          <div className="container-fluid py-3">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Footer oscuro integrado al tema */}
      <footer className="border-top theme-footer">
        <div className="container-fluid py-2">
          <small>© {new Date().getFullYear()} LogiPro</small>
        </div>
      </footer>
    </div>
  );
}
