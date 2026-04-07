import { Button } from "@/components/ui/button"
import { RefreshCw, Wrench, Clock } from "lucide-react"

export function Maintenance() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto mb-8 h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-violet-500/5" />
          <div className="absolute inset-4 rounded-full bg-violet-500/10" />
          <div className="flex h-full w-full items-center justify-center">
            <Wrench className="h-16 w-16 text-violet-500/80" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Đang bảo trì hệ thống</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Hệ thống đang được nâng cấp để phục vụ bạn tốt hơn. Vui lòng quay lại sau ít phút.
        </p>

        <div className="mt-8">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Thử lại
          </Button>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            Thời gian dự kiến hoàn thành: khoảng 30 phút
          </p>
        </div>
      </div>
    </div>
  )
}
