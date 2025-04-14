import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/LoginPage";
import DashboardGoop from "@/pages/DashboardGoop";
import PedidosPage from "@/pages/PedidosPage";
import PedidoNovoPage from "@/pages/PedidoNovoPage";
import PedidoEditarPage from "@/pages/PedidoEditarPage";
import PedidoVisualizarPage from "@/pages/PedidoVisualizarPage";
import AdminPage from "@/pages/AdminPage";
import RelatoriosPage from "@/pages/RelatoriosPage";
import FontTestPage from "@/pages/FontTestPage";
import { PrivateRoute } from "@/features/auth/PrivateRoute";
import { Toaster } from "@/components/ui/toaster";
import NovoAdminPage from "@/pages/NovoAdminPage";
import AdminListPage from "@/pages/AdminListPage";
import AdminEditPage from "@/pages/AdminEditPage";

export default function App() {
  return (
    <>
      <Routes>
        {/* Página pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Painel principal */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardGoop />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/novo"
          element={
            <PrivateRoute>
              <NovoAdminPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/lista"
          element={
            <PrivateRoute>
              <AdminListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/editar/:id"
          element={
            <PrivateRoute>
              <AdminEditPage />
            </PrivateRoute>
          }
        />
        {/* Pedidos */}
        <Route
          path="/dashboard/pedidos"
          element={
            <PrivateRoute>
              <PedidosPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/pedidos/novo"
          element={
            <PrivateRoute>
              <PedidoNovoPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/pedidos/:id"
          element={
            <PrivateRoute>
              <PedidoEditarPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/pedidos/visualizar/:id"
          element={
            <PrivateRoute>
              <PedidoVisualizarPage />
            </PrivateRoute>
          }
        />

        {/* Administração */}
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute>
              <AdminPage />
            </PrivateRoute>
          }
        />

        {/* Relatórios */}
        <Route
          path="/dashboard/relatorios"
          element={
            <PrivateRoute>
              <RelatoriosPage />
            </PrivateRoute>
          }
        />

        {/* Teste de fontes (opcional) */}
        <Route
          path="/teste-fontes"
          element={
            <PrivateRoute>
              <FontTestPage />
            </PrivateRoute>
          }
        />

        {/* Redirecionamento padrão */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      {/* Toaster Global para exibir os toasts */}
      <Toaster />
    </>
  );
}
