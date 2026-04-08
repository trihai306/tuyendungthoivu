import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function Maintenance() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="relative mx-auto mb-10 w-64">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <circle cx="200" cy="150" r="120" className="fill-violet-500/5" />
            <circle cx="200" cy="150" r="80" className="fill-violet-500/10" />

            {/* Gear 1 */}
            <g transform="translate(170, 120)">
              <circle cx="0" cy="0" r="28" className="fill-card stroke-violet-400" strokeWidth="2" />
              <circle cx="0" cy="0" r="10" className="fill-violet-100 dark:fill-violet-500/20" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <rect key={angle} x="-5" y="-32" width="10" height="10" rx="2" className="fill-violet-400" transform={`rotate(${angle})`} />
              ))}
            </g>

            {/* Gear 2 */}
            <g transform="translate(240, 170)">
              <circle cx="0" cy="0" r="20" className="fill-card stroke-violet-300" strokeWidth="2" />
              <circle cx="0" cy="0" r="7" className="fill-violet-100 dark:fill-violet-500/20" />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect key={angle} x="-4" y="-24" width="8" height="8" rx="2" className="fill-violet-300" transform={`rotate(${angle})`} />
              ))}
            </g>

            {/* Wrench */}
            <g transform="translate(130, 180) rotate(-30)">
              <rect x="-4" y="-40" width="8" height="50" rx="4" className="fill-muted-foreground/30" />
              <circle cx="0" cy="-45" r="12" className="fill-card stroke-muted-foreground/30" strokeWidth="3" />
              <path d="M-6 -51 L0 -39 L6 -51" className="fill-card" />
            </g>

            {/* Progress dots */}
            <circle cx="170" cy="230" r="4" className="fill-violet-500">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="195" cy="230" r="4" className="fill-violet-400">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="220" cy="230" r="4" className="fill-violet-300">
              <animate attributeName="opacity" values="0.3;0.3;1" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">Bảo trì</p>
        <h1 className="text-3xl font-bold tracking-tight">Đang nâng cấp hệ thống</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
          Hệ thống đang được nâng cấp để phục vụ bạn tốt hơn. Vui lòng quay lại sau ít phút.
        </p>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
          Thời gian dự kiến: khoảng 30 phút
        </div>

        <div className="mt-8">
          <Button size="lg" variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  )
}
