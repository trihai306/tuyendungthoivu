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
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { NotFound } from "@/pages/errors/NotFound"
import { ServerError } from "@/pages/errors/ServerError"
import { Forbidden } from "@/pages/errors/Forbidden"
import { Maintenance } from "@/pages/errors/Maintenance"
import { NotificationPage } from "@/pages/notifications/NotificationPage"

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

      // Orders (staffing requests from clients)
      { path: "orders", element: <OrderList /> },
      { path: "orders/create", element: <OrderCreate /> },
      { path: "orders/:id", element: <OrderDetail /> },

      // Clients
      { path: "clients", element: <ClientList /> },
      { path: "clients/:id", element: <ClientDetail /> },

      // Workers
      { path: "workers", element: <WorkerList /> },
      { path: "workers/:id", element: <WorkerDetail /> },

      // Dispatch
      { path: "dispatch", element: <DispatchBoard /> },

      // Attendance
      { path: "attendance", element: <AttendanceList /> },

      // Finance
      { path: "payroll", element: <PayrollList /> },
      { path: "invoices", element: <InvoiceList /> },
      { path: "reports", element: <Reports /> },

      // Notifications
      { path: "notifications", element: <NotificationPage /> },

      // System
      { path: "settings", element: <Settings /> },
      { path: "staff", element: <StaffList /> },
      { path: "staff/:id", element: <StaffDetail /> },
      { path: "roles", element: <RoleList /> },
      { path: "roles/:id", element: <RoleDetail /> },
    ],
  },

  // Error routes
  { path: "/403", element: <Forbidden /> },
  { path: "/500", element: <ServerError /> },
  { path: "/maintenance", element: <Maintenance /> },
  { path: "*", element: <NotFound /> },
])
