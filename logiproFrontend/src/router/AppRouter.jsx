// src/router/AppRouter.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import MainLayout from "../layout/MainLayout";

// Página de login
import LoginPage from "../modules/login/pages/LoginPage";

// 👉 Importamos tu Dashboard real
import Dashboard from "../modules/dashboard/pages/DashboardPage.jsx";


export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar" element={<div />} />

      {/* Privadas */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
