import { useEffect } from "react";
import { Navigate, Outlet, createBrowserRouter, useLocation } from "react-router-dom";
import AdminShell from "@/components/layout/AdminShell";
import LoginPage from "@/features/auth/LoginPage";
import AnalyticsPage from "@/features/analytics/AnalyticsPage";
import AuditLogsPage from "@/features/audit/AuditLogsPage";
import AppConfigPage from "@/features/config/AppConfigPage";
import DashboardPage from "@/features/dashboard/DashboardPage";
import ExpenseDetailPage from "@/features/expenses/ExpenseDetailPage";
import ExpensesPage from "@/features/expenses/ExpensesPage";
import GroupDetailPage from "@/features/groups/GroupDetailPage";
import GroupsPage from "@/features/groups/GroupsPage";
import ReceiptCenterPage from "@/features/receipts/ReceiptCenterPage";
import RemindersPage from "@/features/reminders/RemindersPage";
import SecurityPage from "@/features/security/SecurityPage";
import SettlementsPage from "@/features/settlements/SettlementsPage";
import SupportInboxPage from "@/features/support/SupportInboxPage";
import UserDetailPage from "@/features/users/UserDetailPage";
import UsersPage from "@/features/users/UsersPage";
import LoadingState from "@/components/common/LoadingState";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";

function AppFrame() {
  const theme = useUiStore((state) => state.theme);
  const direction = useUiStore((state) => state.direction);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dir = direction;
  }, [theme, direction]);

  return <Outlet />;
}

function ProtectedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const isHydrating = useAuthStore((state) => state.isHydrating);
  const hasValidatedSession = useAuthStore((state) => state.hasValidatedSession);
  const hydrate = useAuthStore((state) => state.hydrate);
  const location = useLocation();

  useEffect(() => {
    if (token && !hasValidatedSession && !isHydrating) {
      void hydrate();
    }
  }, [hasValidatedSession, hydrate, isHydrating, token]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (isHydrating || !hasValidatedSession) {
    return <LoadingState label="Validating admin session..." />;
  }

  return <AdminShell />;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppFrame />,
    children: [
      { index: true, element: <Navigate to="/admin" replace /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "admin",
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "users/:id", element: <UserDetailPage /> },
          { path: "groups", element: <GroupsPage /> },
          { path: "groups/:id", element: <GroupDetailPage /> },
          { path: "expenses", element: <ExpensesPage /> },
          { path: "expenses/:id", element: <ExpenseDetailPage /> },
          { path: "receipts", element: <ReceiptCenterPage /> },
          { path: "settlements", element: <SettlementsPage /> },
          { path: "reminders", element: <RemindersPage /> },
          { path: "support", element: <SupportInboxPage /> },
          { path: "security", element: <SecurityPage /> },
          { path: "analytics", element: <AnalyticsPage /> },
          { path: "config", element: <AppConfigPage /> },
          { path: "audit", element: <AuditLogsPage /> },
        ],
      },
    ],
  },
]);
