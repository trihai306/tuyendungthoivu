import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Header } from "./Header"
import { AppSidebar } from "./Sidebar"
import { Toaster } from "@/components/ui/sonner"

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
