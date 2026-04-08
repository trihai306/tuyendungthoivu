import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-lg text-center">
        {/* Animated illustration */}
        <div className="relative mx-auto mb-10 w-64">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            {/* Background shapes */}
            <circle cx="200" cy="150" r="120" className="fill-primary/5" />
            <circle cx="200" cy="150" r="80" className="fill-primary/10" />

            {/* Document icon */}
            <rect x="140" y="80" width="120" height="140" rx="12" className="fill-card stroke-border" strokeWidth="2" />
            <rect x="160" y="110" width="60" height="6" rx="3" className="fill-primary/20" />
            <rect x="160" y="126" width="80" height="6" rx="3" className="fill-muted" />
            <rect x="160" y="142" width="50" height="6" rx="3" className="fill-muted" />
            <rect x="160" y="158" width="70" height="6" rx="3" className="fill-muted" />

            {/* Magnifying glass */}
            <circle cx="280" cy="100" r="30" className="fill-card stroke-primary" strokeWidth="3" />
            <line x1="302" y1="122" x2="320" y2="140" className="stroke-primary" strokeWidth="4" strokeLinecap="round" />
            <text x="268" y="108" className="fill-primary text-[18px] font-bold" textAnchor="middle">?</text>

            {/* X marks */}
            <g className="stroke-destructive/40" strokeWidth="2" strokeLinecap="round">
              <line x1="120" y1="200" x2="130" y2="210" />
              <line x1="130" y1="200" x2="120" y2="210" />
              <line x1="290" y1="180" x2="300" y2="190" />
              <line x1="300" y1="180" x2="290" y2="190" />
            </g>
          </svg>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Lỗi 404</p>
        <h1 className="text-3xl font-bold tracking-tight">Không tìm thấy trang</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
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
