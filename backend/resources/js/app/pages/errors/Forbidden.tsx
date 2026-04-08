import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Home,
  ArrowLeft,
  ShieldAlert,
  LayoutDashboard,
  FileText,
  Users,
  CalendarCheck,
  LogOut,
} from "lucide-react"
import { useAuthStore } from "@/stores/auth-store"

const quickLinks = [
  { label: "Tổng quan", href: "/", icon: LayoutDashboard },
  { label: "Đơn hàng", href: "/jobs", icon: FileText },
  { label: "Ứng viên", href: "/workers", icon: Users },
  { label: "Điều phối", href: "/tasks", icon: CalendarCheck },
]

export function Forbidden() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative gradient blobs - amber tones */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Animated 403 number with shield */}
        <div className="relative mb-6">
          <h1 className="select-none text-[160px] font-black leading-none tracking-tighter sm:text-[200px]">
            <span className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
              4
            </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-orange-500 via-amber-500 to-amber-400 bg-clip-text text-transparent">
                0
              </span>
              {/* Animated shield icon */}
              <ShieldAlert className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse text-amber-400/30 sm:h-12 sm:w-12" />
            </span>
            <span className="bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-500 bg-clip-text text-transparent">
              3
            </span>
          </h1>
          {/* Subtle shadow under the number */}
          <div className="mx-auto -mt-4 h-4 w-48 rounded-full bg-amber-500/5 blur-xl" />
        </div>

        {/* Text content */}
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Truy cập bị từ chối
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Bạn không có quyền truy cập
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Trang này yêu cầu quyền truy cập mà tài khoản của bạn hiện không có. Vui lòng liên hệ quản trị viên để được cấp quyền.
        </p>

        {/* Current user info */}
        {user && (
          <div className="mx-auto mt-6 inline-flex max-w-sm items-center gap-3 rounded-xl border border-border/70 bg-card/80 px-5 py-3 backdrop-blur-sm">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
              <span className="text-sm font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Bạn có thể truy cập
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Button
                  key={link.href}
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full border-border/70 bg-card/50 backdrop-blur-sm transition-all hover:border-amber-400/30 hover:bg-amber-500/5"
                  onClick={() => navigate(link.href)}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {link.label}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" className="rounded-xl" onClick={() => navigate("/")}>
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-xl"
            onClick={() => navigate("/login")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Đổi tài khoản
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground/50">
          NVTV Staffing &mdash; Liên hệ quản trị viên nếu bạn cần được cấp quyền truy cập.
        </p>
      </div>
    </div>
  )
}
