import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Dashboard } from "@/pages/Dashboard"
import { OrderList } from "@/pages/orders/OrderList"
import { OrderCreate } from "@/pages/orders/OrderCreate"
import { OrderDetail } from "@/pages/orders/OrderDetail"
import { ClientList } from "@/pages/clients/ClientList"
import { ClientDetail } from "@/pages/clients/ClientDetail"
import { WorkerList } from "@/pages/workers/WorkerList"
import { WorkerDetail } from "@/pages/workers/WorkerDetail"
import { DispatchBoard } from "@/pages/dispatch/DispatchBoard"
import { AttendanceList } from "@/pages/attendance/AttendanceList"
import { PayrollList } from "@/pages/payroll/PayrollList"
import { InvoiceList } from "@/pages/invoices/InvoiceList"
import { Reports } from "@/pages/reports/Reports"
import { Settings } from "@/pages/settings/Settings"
import { StaffList } from "@/pages/staff/StaffList"
import { StaffDetail } from "@/pages/staff/StaffDetail"
import { RoleList } from "@/pages/rbac/RoleList"
import { RoleDetail } from "@/pages/rbac/RoleDetail"
import { KpiDashboard } from "@/pages/kpi/KpiDashboard"
import { KpiConfigPage } from "@/pages/kpi/KpiConfigPage"
import { StaffPayrollList } from "@/pages/staff-payroll/StaffPayrollList"
import { RevenueDashboard } from "@/pages/revenue/RevenueDashboard"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { NotFound } from "@/pages/errors/NotFound"
import { ServerError } from "@/pages/errors/ServerError"
import { Forbidden } from "@/pages/errors/Forbidden"
import { Maintenance } from "@/pages/errors/Maintenance"
import { NotificationPage } from "@/pages/notifications/NotificationPage"

// Permission-gated wrapper
function RequirePermission({ permission, children }: { permission: string; children: React.ReactNode }) {
  return <ProtectedRoute permission={permission}>{children}</ProtectedRoute>
}

export const router = createBrowserRouter([
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/forgot-password", element: <ForgotPassword /> },

  // Protected routes
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },

      // Orders
      { path: "orders", element: <RequirePermission permission="orders.view"><OrderList /></RequirePermission> },
      { path: "orders/create", element: <RequirePermission permission="orders.create"><OrderCreate /></RequirePermission> },
      { path: "orders/:id", element: <RequirePermission permission="orders.view"><OrderDetail /></RequirePermission> },

      // Clients
      { path: "clients", element: <RequirePermission permission="clients.view"><ClientList /></RequirePermission> },
      { path: "clients/:id", element: <RequirePermission permission="clients.view"><ClientDetail /></RequirePermission> },

      // Workers
      { path: "workers", element: <RequirePermission permission="workers.view"><WorkerList /></RequirePermission> },
      { path: "workers/:id", element: <RequirePermission permission="workers.view"><WorkerDetail /></RequirePermission> },

      // Dispatch
      { path: "dispatch", element: <RequirePermission permission="assignments.view"><DispatchBoard /></RequirePermission> },

      // Attendance
      { path: "attendance", element: <RequirePermission permission="attendance.view"><AttendanceList /></RequirePermission> },

      // Finance
      { path: "payroll", element: <RequirePermission permission="payroll.view"><PayrollList /></RequirePermission> },
      { path: "invoices", element: <RequirePermission permission="invoices.view"><InvoiceList /></RequirePermission> },
      { path: "revenue", element: <RequirePermission permission="revenue.view"><RevenueDashboard /></RequirePermission> },
      { path: "reports", element: <RequirePermission permission="reports.view"><Reports /></RequirePermission> },

      // Staff Payroll
      { path: "staff-payroll", element: <RequirePermission permission="staff_payroll.view"><StaffPayrollList /></RequirePermission> },

      // KPI
      { path: "kpi", element: <RequirePermission permission="kpi.view"><KpiDashboard /></RequirePermission> },
      { path: "kpi/config", element: <RequirePermission permission="kpi.config"><KpiConfigPage /></RequirePermission> },

      // Notifications - All authenticated
      { path: "notifications", element: <NotificationPage /> },

      // System
      { path: "settings", element: <RequirePermission permission="settings.manage"><Settings /></RequirePermission> },
      { path: "staff", element: <RequirePermission permission="users.manage"><StaffList /></RequirePermission> },
      { path: "staff/:id", element: <RequirePermission permission="users.manage"><StaffDetail /></RequirePermission> },
      { path: "roles", element: <RequirePermission permission="roles.manage"><RoleList /></RequirePermission> },
      { path: "roles/:id", element: <RequirePermission permission="roles.manage"><RoleDetail /></RequirePermission> },
    ],
  },

  // Error routes
  { path: "/403", element: <Forbidden /> },
  { path: "/500", element: <ServerError /> },
  { path: "/maintenance", element: <Maintenance /> },
  { path: "*", element: <NotFound /> },
])
