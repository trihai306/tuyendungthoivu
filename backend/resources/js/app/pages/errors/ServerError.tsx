import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, MessageSquareWarning, AlertTriangle } from "lucide-react"

export function ServerError() {
  const navigate = useNavigate()

  // Generate a mock error code for reference
  const errorCode = useMemo(() => {
    const ts = Date.now().toString(36).toUpperCase().slice(-5)
    return `ERR-${ts}`
  }, [])

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

      {/* Decorative gradient blobs - red tones */}
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Animated 500 number */}
        <div className="relative mb-6">
          <h1 className="select-none text-[160px] font-black leading-none tracking-tighter sm:text-[200px]">
            <span className="bg-gradient-to-br from-red-500 via-rose-500 to-orange-400 bg-clip-text text-transparent">
              5
            </span>
            <span className="relative inline-block">
              <span className="bg-gradient-to-br from-rose-500 via-red-500 to-red-400 bg-clip-text text-transparent">
                0
              </span>
              {/* Animated warning icon */}
              <AlertTriangle className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse text-red-400/30 sm:h-12 sm:w-12" />
            </span>
            <span className="bg-gradient-to-br from-orange-400 via-rose-500 to-red-500 bg-clip-text text-transparent">
              0
            </span>
          </h1>
          {/* Subtle shadow under the number */}
          <div className="mx-auto -mt-4 h-4 w-48 rounded-full bg-red-500/5 blur-xl" />
        </div>

        {/* Text content */}
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-red-500 dark:text-red-400">
          Lỗi hệ thống
        </p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Đã xảy ra sự cố
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Máy chủ gặp lỗi không mong muốn. Đội ngũ kỹ thuật đã được thông báo
          <span className="inline-flex items-center gap-0.5 align-middle">
            <span className="mx-0.5 inline-block h-1 w-1 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full bg-muted-foreground/60" />
            <span className="mx-0.5 inline-block h-1 w-1 animate-[pulse_1.5s_ease-in-out_0.3s_infinite] rounded-full bg-muted-foreground/60" />
            <span className="mx-0.5 inline-block h-1 w-1 animate-[pulse_1.5s_ease-in-out_0.6s_infinite] rounded-full bg-muted-foreground/60" />
          </span>
        </p>

        {/* Error code badge */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
          </span>
          <span className="text-muted-foreground">Mã lỗi:</span>
          <code className="font-mono font-semibold text-foreground">{errorCode}</code>
        </div>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            size="lg"
            className="rounded-xl"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Tải lại trang
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl gap-2"
            onClick={() => {
              const subject = encodeURIComponent(`Báo lỗi hệ thống - ${errorCode}`)
              const body = encodeURIComponent(
                `Mã lỗi: ${errorCode}\nTrang: ${window.location.href}\nThời gian: ${new Date().toLocaleString("vi-VN")}\n\nMô tả lỗi:\n`
              )
              window.location.href = `mailto:support@nvtv.vn?subject=${subject}&body=${body}`
            }}
          >
            <MessageSquareWarning className="h-4 w-4" />
            Báo lỗi
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="rounded-xl"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Về trang chủ
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-12 text-xs text-muted-foreground/50">
          Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ hỗ trợ kỹ thuật với mã lỗi ở trên.
        </p>
      </div>
    </div>
  )
}
