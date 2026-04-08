import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { AppSidebar } from "./Sidebar"
import { Toaster } from "@/components/ui/sonner"

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
