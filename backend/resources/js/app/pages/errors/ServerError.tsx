import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw } from "lucide-react"

export function ServerError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="relative mx-auto mb-10 w-64">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <circle cx="200" cy="150" r="120" className="fill-destructive/5" />
            <circle cx="200" cy="150" r="80" className="fill-destructive/10" />

            {/* Server rack */}
            <rect x="140" y="70" width="120" height="160" rx="12" className="fill-card stroke-border" strokeWidth="2" />
            <rect x="155" y="90" width="90" height="24" rx="4" className="fill-muted" />
            <circle cx="230" cy="102" r="5" className="fill-destructive" />
            <circle cx="215" cy="102" r="3" className="fill-muted-foreground/30" />
            <rect x="155" y="124" width="90" height="24" rx="4" className="fill-muted" />
            <circle cx="230" cy="136" r="5" className="fill-destructive" />
            <circle cx="215" cy="136" r="3" className="fill-muted-foreground/30" />
            <rect x="155" y="158" width="90" height="24" rx="4" className="fill-muted" />
            <circle cx="230" cy="170" r="5" className="fill-amber-500" />
            <circle cx="215" cy="170" r="3" className="fill-muted-foreground/30" />

            {/* Lightning bolt */}
            <path d="M290 80 L270 130 L285 130 L265 180" className="stroke-destructive" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Warning triangle */}
            <path d="M110 190 L125 165 L140 190 Z" className="fill-amber-100 stroke-amber-500 dark:fill-amber-500/20" strokeWidth="2" />
            <text x="125" y="186" className="fill-amber-600 text-[12px] font-bold" textAnchor="middle">!</text>
          </svg>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-destructive">Lỗi 500</p>
        <h1 className="text-3xl font-bold tracking-tight">Lỗi hệ thống</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Đã xảy ra lỗi không mong muốn. Đội ngũ kỹ thuật đã được thông báo và đang khắc phục.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tải lại trang
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
