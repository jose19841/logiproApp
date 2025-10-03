// src/app/router/AppRouter.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import RequireAuth from "@shared/components/RequireAuth";
import MainLayout from "@shared/layouts/MainLayout";

// Página de login
import LoginPage from "@/features/auth/pages/LoginPage";

// Password flow (recuperación / cambio)
import ChangePasswordPage from "@/features/auth/pages/ChangePasswordPage";
import RecoverPage from "@/features/auth/pages/RecoverPage";
import ResetPage from "@/features/auth/pages/ResetPage";

// Dashboard
import Dashboard from "@/features/dashboard/pages/DashboardPage";

// Users
import UserCreateForm from "@/modules/users/components/UserCreateForm"; // alta
import UserDetail from "@/modules/users/pages/UserDetail.jsx"; // detalle
import UserEdit from "@/modules/users/pages/UserEdit.jsx"; // edición
import UserPage from "@/modules/users/pages/UserPage.jsx"; // ⬅️ página con check de ADMIN + SweetAlert2 + UserList

export default function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/recuperar" element={<RecoverPage />} />
      <Route path="/reset" element={<ResetPage />} />

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

        {/* Cuenta / Seguridad */}
        <Route path="cambiar-clave" element={<ChangePasswordPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
