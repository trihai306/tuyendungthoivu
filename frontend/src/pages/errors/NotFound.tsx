import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, Search } from "lucide-react"

export function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        {/* Illustration */}
        <div className="relative mx-auto mb-8 h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-primary/5" />
          <div className="absolute inset-4 rounded-full bg-primary/10" />
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-6xl font-bold text-primary/80">404</span>
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Không tìm thấy trang</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang địa chỉ khác.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Về trang chủ
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>

        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            <Search className="mr-1 inline h-3 w-3" />
            Bạn có thể thử tìm kiếm hoặc quay về trang chủ để tiếp tục sử dụng hệ thống.
          </p>
        </div>
      </div>
    </div>
  )
}
