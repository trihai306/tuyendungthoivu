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
import { Login } from "@/pages/Login"
import { Register } from "@/pages/Register"
import { ForgotPassword } from "@/pages/ForgotPassword"
import { NotFound } from "@/pages/errors/NotFound"
import { ServerError } from "@/pages/errors/ServerError"
import { Forbidden } from "@/pages/errors/Forbidden"
import { Maintenance } from "@/pages/errors/Maintenance"

export const router = createBrowserRouter([
  // Public routes (auth)
  {
    path: "/dang-nhap",
    element: <Login />,
  },
  {
    path: "/dang-ky",
    element: <Register />,
  },
  {
    path: "/quen-mat-khau",
    element: <ForgotPassword />,
  },

  // Protected routes (require authentication)
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "viec-lam",
        element: <ApplicationList />,
      },
      {
        path: "lich-phong-van",
        element: <InterviewSchedule />,
      },
      {
        path: "bao-cao",
        element: <Reports />,
      },
      {
        path: "cai-dat",
        element: <Settings />,
      },
      {
        path: "ung-vien",
        element: <WorkerList />,
      },
      {
        path: "ung-vien/:id",
        element: <WorkerDetail />,
      },
      {
        path: "doanh-nghiep",
        element: <EmployerList />,
      },
      {
        path: "doanh-nghiep/:id",
        element: <EmployerDetail />,
      },
      {
        path: "tin-tuyen-dung",
        element: <JobList />,
      },
      {
        path: "tin-tuyen-dung/tao-moi",
        element: <JobCreate />,
      },
      {
        path: "tin-tuyen-dung/:id",
        element: <JobDetail />,
      },
      {
        path: "tro-giup",
        element: <HelpPage />,
      },
    ],
  },

  // Error routes
  {
    path: "/403",
    element: <Forbidden />,
  },
  {
    path: "/500",
    element: <ServerError />,
  },
  {
    path: "/bao-tri",
    element: <Maintenance />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
])
