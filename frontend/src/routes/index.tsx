import { createBrowserRouter } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Login } from "@/pages/Login"
import { NotFound } from "@/pages/errors/NotFound"
import { ServerError } from "@/pages/errors/ServerError"
import { Forbidden } from "@/pages/errors/Forbidden"
import { Maintenance } from "@/pages/errors/Maintenance"

export const router = createBrowserRouter([
  {
    path: "/dang-nhap",
    element: <Login />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
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
