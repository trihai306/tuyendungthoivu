import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Home,
  ArrowLeft,
  Search,
  LayoutDashboard,
  FileText,
  Users,
  CalendarCheck,
} from "lucide-react"

const quickLinks = [
  { label: "Tổng quan", href: "/", icon: LayoutDashboard },
  { label: "Đơn hàng", href: "/jobs", icon: FileText },
  { label: "Ứng viên", href: "/workers", icon: Users },
  { label: "Điều phối", href: "/tasks", icon: CalendarCheck },
]

export function NotFound() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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

      {/* Decorative gradient blobs */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Animated 404 number */}
        <div className="relative mb-6">
          <h1 className="select-none text-[160px] font-black leading-none tracking-tighter sm:text-[200px]">
            <span className="bg-gradient-to-br from-primary via-violet-500 to-indigo-400 bg-clip-text text-transparent">
              4
            </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-violet-500 via-primary to-indigo-500 bg-clip-text text-transparent">
                0
              </span>
              {/* Animated search icon floating on the zero */}
              <Search className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse text-primary/30 sm:h-12 sm:w-12" />
            </span>
            <span className="bg-gradient-to-br from-indigo-400 via-violet-500 to-primary bg-clip-text text-transparent">
              4
            </span>
          </h1>
          {/* Subtle shadow under the number */}
          <div className="mx-auto -mt-4 h-4 w-48 rounded-full bg-primary/5 blur-xl" />
        </div>

        {/* Text content */}
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Trang không tồn tại
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Không tìm thấy nội dung
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn không chính xác. Hãy thử tìm kiếm hoặc quay về trang chủ.
        </p>

        {/* Search box */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-8 flex max-w-md items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
            <Input
              type="text"
              placeholder="Tìm kiếm trang, đơn hàng, ứng viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl border-border/70 bg-muted/30 pl-10 transition-all focus:bg-background"
            />
          </div>
          <Button type="submit" className="h-11 rounded-xl px-6">
            Tìm
          </Button>
        </form>

        {/* Quick links */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Truy cập nhanh
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {quickLinks.map((link) => {
              const Icon = link.icon
              return (
                <Button
                  key={link.href}
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full border-border/70 bg-card/50 backdrop-blur-sm transition-all hover:bg-primary/5 hover:border-primary/30"
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
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground/50">
          NVTV Staffing &mdash; Hệ thống quản lý cung ứng nhân sự thời vụ
        </p>
      </div>
    </div>
  )
}
