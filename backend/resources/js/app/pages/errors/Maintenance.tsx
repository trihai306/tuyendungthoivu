import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wrench, ExternalLink } from "lucide-react"

export function Maintenance() {
  // Mock target time: 23:30 today (or tomorrow if already past)
  const targetTime = useMemo(() => {
    const now = new Date()
    const target = new Date()
    target.setHours(23, 30, 0, 0)
    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }
    return target
  }, [])

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetTime))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetTime))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetTime])

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

      {/* Decorative gradient blobs - violet tones */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Animated gears illustration */}
        <div className="relative mx-auto mb-8 h-48 w-48">
          {/* Outer rotating gear */}
          <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx="50" cy="50" r="35" className="fill-none stroke-violet-300/30 dark:stroke-violet-400/20" strokeWidth="2" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <rect
                  key={angle}
                  x="46"
                  y="12"
                  width="8"
                  height="8"
                  rx="2"
                  className="fill-violet-300/40 dark:fill-violet-400/30"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="12" className="fill-none stroke-violet-400/40 dark:stroke-violet-400/30" strokeWidth="2" />
            </svg>
          </div>

          {/* Inner rotating gear (opposite direction) */}
          <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/4 -translate-y-1/4 animate-[spin_5s_linear_infinite_reverse]">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              <circle cx="50" cy="50" r="28" className="fill-none stroke-violet-400/30 dark:stroke-violet-500/20" strokeWidth="2" />
              {[0, 60, 120, 180, 240, 300].map((angle) => (
                <rect
                  key={angle}
                  x="46"
                  y="18"
                  width="8"
                  height="7"
                  rx="2"
                  className="fill-violet-400/40 dark:fill-violet-500/30"
                  transform={`rotate(${angle} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="8" className="fill-none stroke-violet-500/40 dark:stroke-violet-500/30" strokeWidth="2" />
            </svg>
          </div>

          {/* Center wrench icon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100/80 dark:bg-violet-500/10">
              <Wrench className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </div>

        {/* Text content */}
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
          Bảo trì hệ thống
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Đang nâng cấp hệ thống
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Hệ thống đang được nâng cấp để phục vụ bạn tốt hơn. Chúng tôi sẽ trở lại trong thời gian ngắn nhất.
        </p>

        {/* Countdown timer */}
        <div className="mt-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">
            Dự kiến hoàn thành lúc {targetTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </p>
          <div className="mx-auto flex max-w-xs justify-center gap-3">
            {[
              { value: timeLeft.hours, label: "Giờ" },
              { value: timeLeft.minutes, label: "Phút" },
              { value: timeLeft.seconds, label: "Giây" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-[72px] flex-col items-center rounded-xl border border-border/70 bg-card/80 px-4 py-3 backdrop-blur-sm"
              >
                <span className="text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                  {String(item.value).padStart(2, "0")}
                </span>
                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mx-auto mt-8 max-w-sm">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Tiến trình nâng cấp</span>
            <span className="tabular-nums">72%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-violet-100 dark:bg-violet-500/10">
            <div
              className="relative h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
              style={{ width: "72%" }}
            >
              {/* Animated shimmer */}
              <div className="absolute inset-0 animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Status badge */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet-500" />
          </span>
          <span className="text-muted-foreground">Đang cập nhật cơ sở dữ liệu...</span>
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className="rounded-xl gap-2"
            onClick={() => window.open("https://status.nvtv.vn", "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Theo dõi trạng thái
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground/50">
          NVTV Staffing &mdash; Cảm ơn bạn đã kiên nhẫn chờ đợi.
        </p>
      </div>

      {/* CSS for shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

function calculateTimeLeft(target: Date) {
  const now = new Date()
  const diff = Math.max(0, target.getTime() - now.getTime())
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}
