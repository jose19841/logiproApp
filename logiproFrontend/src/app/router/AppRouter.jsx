// src/app/router/AppRouter.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
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
import UserCreateForm from "@/features/users/components/UserCreateForm"; // alta
import UserDetail from "@/features/users/pages/UserDetail"; // detalle
import UserEdit from "@/features/users/pages/UserEdit"; // edición
import UserPage from "@/features/users/pages/UserPage"; // ⬅️ página con check de ADMIN + SweetAlert2 + UserList

// Suppliers
import SupplierCreatePage from "@/features/suppliers/pages/SupplierCreatePage";
import SupplierEditPage from "@/features/suppliers/pages/SupplierEditPage";
import SuppliersListPage from "@/features/suppliers/pages/SuppliersListPage";

// Claims
import ClaimCreatePage from "@/features/claims/pages/ClaimCreatePage";
import ClaimsListPage from "@/features/claims/pages/ClaimsListPage";

// Materials
import MaterialCreatePage from "@/features/materials/pages/MaterialCreatePage";
import MaterialDetailPage from "@/features/materials/pages/MaterialDetailPage";
import MaterialEditPage from "@/features/materials/pages/MaterialEditPage";
import MaterialsListPage from "@/features/materials/pages/MaterialsListPage";

// Inventory
import InventoryCreatePage from "@/features/inventory/pages/InventoryCreatePage";
import InventoryEditPage from "@/features/inventory/pages/InventoryEditPage";
import InventoryListPage from "@/features/inventory/pages/InventoryListPage";

// Inline Protected Route Guard
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Admin-only Route Guard
function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.rol === "ADMIN" || user?.rol?.nombre === "ADMIN";

  if (!isAdmin) {
    return <Navigate to="/" replace />; // Redirige al dashboard
  }

  return children;
}

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
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Usuarios (Solo ADMIN) */}
        <Route path="usuarios" element={<AdminRoute><UserPage /></AdminRoute>} />
        <Route path="usuarios/nuevo" element={<AdminRoute><UserCreateForm variant="card" /></AdminRoute>} />
        <Route path="usuarios/:id" element={<AdminRoute><UserDetail /></AdminRoute>} />
        <Route path="usuarios/:id/editar" element={<AdminRoute><UserEdit /></AdminRoute>} />

        {/* Suppliers */}
        <Route path="suppliers" element={<SuppliersListPage />} />
        <Route path="suppliers/new" element={<SupplierCreatePage />} />
        <Route path="suppliers/:id/edit" element={<SupplierEditPage />} />

        {/* Claims */}
        <Route path="claims" element={<ClaimsListPage />} />
        <Route path="claims/new" element={<ClaimCreatePage />} />

        {/* Materials */}
        <Route path="materials" element={<MaterialsListPage />} />
        <Route path="materials/new" element={<MaterialCreatePage />} />
        <Route path="materials/:id" element={<MaterialDetailPage />} />
        <Route path="materials/:id/edit" element={<MaterialEditPage />} />

        {/* Inventory */}
        <Route path="inventory" element={<InventoryListPage />} />
        <Route path="inventory/new" element={<InventoryCreatePage />} />
        <Route path="inventory/:id/edit" element={<InventoryEditPage />} />

        {/* Cuenta / Seguridad */}
        <Route path="cambiar-clave" element={<ChangePasswordPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
