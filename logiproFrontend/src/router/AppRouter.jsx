// src/router/AppRouter.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "../auth/RequireAuth";
import MainLayout from "../layout/MainLayout";

// Página de login
import LoginPage from "../modules/login/pages/LoginPage";

// Dashboard
import Dashboard from "../modules/dashboard/pages/DashboardPage.jsx";

// Users
import UserCreateForm from "../modules/users/components/UserCreateForm"; // alta
import UserDetail from "../modules/users/pages/UserDetail.jsx"; // detalle
import UserEdit from "../modules/users/pages/UserEdit.jsx"; // edición
import UserPage from "../modules/users/pages/UserPage.jsx"; // ⬅️ página con check de ADMIN + SweetAlert2 + UserList

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

        {/* Usuarios */}
        <Route path="usuarios" element={<UserPage />} />
        <Route path="usuarios/nuevo" element={<UserCreateForm variant="card" />} />
        <Route path="usuarios/:id" element={<UserDetail />} />
        <Route path="usuarios/:id/editar" element={<UserEdit />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
