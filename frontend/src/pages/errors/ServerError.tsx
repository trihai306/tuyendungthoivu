import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, RefreshCw, AlertTriangle } from "lucide-react"

export function ServerError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto mb-8 h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-destructive/5" />
          <div className="absolute inset-4 rounded-full bg-destructive/10" />
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl font-bold text-destructive/80">500</span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Lỗi hệ thống</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Đã xảy ra lỗi không mong muốn. Đội ngũ kỹ thuật đã được thông báo và đang khắc phục sự cố.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tải lại trang
          </Button>
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        <div className="mt-8 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <p className="flex items-center justify-center gap-1.5 text-xs text-destructive">
            <AlertTriangle className="h-3 w-3" />
            Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ bộ phận hỗ trợ.
          </p>
        </div>
      </div>
    </div>
  )
}
