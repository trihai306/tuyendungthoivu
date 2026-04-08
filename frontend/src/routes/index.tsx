import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Dashboard } from "@/pages/Dashboard"
import { ApplicationList } from "@/pages/applications/ApplicationList"
import { InterviewSchedule } from "@/pages/interviews/InterviewSchedule"
import { Reports } from "@/pages/reports/Reports"
import { Settings } from "@/pages/settings/Settings"
import { HelpPage } from "@/pages/help/HelpPage"
import { WorkerList } from "@/pages/workers/WorkerList"
import { WorkerDetail } from "@/pages/workers/WorkerDetail"
import { EmployerList } from "@/pages/employers/EmployerList"
import { EmployerDetail } from "@/pages/employers/EmployerDetail"
import { JobList } from "@/pages/jobs/JobList"
import { JobDetail } from "@/pages/jobs/JobDetail"
import { JobCreate } from "@/pages/jobs/JobCreate"
import { TaskBoard } from "@/pages/tasks/TaskBoard"
import { TaskList } from "@/pages/tasks/TaskList"
import { TaskDetail } from "@/pages/tasks/TaskDetail"
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { RoleList } from "@/pages/rbac/RoleList"
import { RoleDetail } from "@/pages/rbac/RoleDetail"
import { ActivityLogPage } from "@/pages/rbac/ActivityLogPage"
import { StaffList } from "@/pages/staff/StaffList"
import { StaffDetail } from "@/pages/staff/StaffDetail"
import { DepartmentList } from "@/pages/staff/DepartmentList"
import { TeamDetail } from "@/pages/staff/TeamDetail"
import { NotFound } from "@/pages/errors/NotFound"
import { ServerError } from "@/pages/errors/ServerError"
import { Forbidden } from "@/pages/errors/Forbidden"
import { Maintenance } from "@/pages/errors/Maintenance"

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

      // Recruitment
      { path: "jobs", element: <JobList /> },
      { path: "jobs/create", element: <JobCreate /> },
      { path: "jobs/:id", element: <JobDetail /> },
      { path: "candidates", element: <WorkerList /> },
      { path: "candidates/:id", element: <WorkerDetail /> },
      { path: "employers", element: <EmployerList /> },
      { path: "employers/:id", element: <EmployerDetail /> },
      { path: "applications", element: <ApplicationList /> },
      { path: "interviews", element: <InterviewSchedule /> },

      // Task management
      { path: "tasks", element: <TaskBoard /> },
      { path: "tasks/list", element: <TaskList /> },
      { path: "tasks/:id", element: <TaskDetail /> },

      // System
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> },
      { path: "help", element: <HelpPage /> },

      // Admin
      { path: "staff", element: <StaffList /> },
      { path: "staff/:id", element: <StaffDetail /> },
      { path: "departments", element: <DepartmentList /> },
      { path: "departments/:deptId/teams/:teamId", element: <TeamDetail /> },
      { path: "roles", element: <RoleList /> },
      { path: "roles/:id", element: <RoleDetail /> },
      { path: "activity-logs", element: <ActivityLogPage /> },
    ],
  },

  // Error routes
  { path: "/403", element: <Forbidden /> },
  { path: "/500", element: <ServerError /> },
  { path: "/maintenance", element: <Maintenance /> },
  { path: "*", element: <NotFound /> },
])
