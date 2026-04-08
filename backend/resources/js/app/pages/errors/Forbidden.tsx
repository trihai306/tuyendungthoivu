import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="relative mx-auto mb-10 w-64">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <circle cx="200" cy="150" r="120" className="fill-amber-500/5" />
            <circle cx="200" cy="150" r="80" className="fill-amber-500/10" />

            {/* Shield */}
            <path d="M200 70 L260 100 L260 170 C260 210 200 240 200 240 C200 240 140 210 140 170 L140 100 Z" className="fill-card stroke-border" strokeWidth="2" />
            <path d="M200 90 L245 112 L245 168 C245 200 200 222 200 222 C200 222 155 200 155 168 L155 112 Z" className="fill-amber-50 dark:fill-amber-500/10" />

            {/* Lock icon inside shield */}
            <rect x="183" y="148" width="34" height="28" rx="4" className="fill-amber-500/80" />
            <path d="M190 148 L190 138 C190 131 194 126 200 126 C206 126 210 131 210 138 L210 148" className="stroke-amber-600" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="200" cy="162" r="3" className="fill-white" />

            {/* Decorative crosses */}
            <g className="stroke-amber-400/40" strokeWidth="2" strokeLinecap="round">
              <line x1="100" y1="100" x2="108" y2="108" /><line x1="108" y1="100" x2="100" y2="108" />
              <line x1="300" y1="180" x2="308" y2="188" /><line x1="308" y1="180" x2="300" y2="188" />
            </g>
          </svg>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">Lỗi 403</p>
        <h1 className="text-3xl font-bold tracking-tight">Truy cập bị từ chối</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là nhầm lẫn.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      </div>
    </div>
  )
}
