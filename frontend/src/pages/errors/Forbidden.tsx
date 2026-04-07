import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft, ShieldOff } from "lucide-react"

export function Forbidden() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="relative mx-auto mb-8 h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-amber-500/5" />
          <div className="absolute inset-4 rounded-full bg-amber-500/10" />
          <div className="flex h-full w-full items-center justify-center">
            <ShieldOff className="h-16 w-16 text-amber-500/80" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Truy cập bị từ chối</h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
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
      </div>
    </div>
  )
}
