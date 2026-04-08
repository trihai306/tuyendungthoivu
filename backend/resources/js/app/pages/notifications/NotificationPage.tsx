import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Briefcase,
  Users,
  Clock,
  AlertTriangle,
  CreditCard,
  Settings,
  CheckCircle2,
  ShieldAlert,
  Search,
  CheckCheck,
  Bell,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type NotificationType =
  | "request"
  | "dispatch"
  | "attendance"
  | "urgent"
  | "finance"
  | "system"
  | "confirm"
  | "warning"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  date: string
  isRead: boolean
  link: string
}

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; text: string; label: string }
> = {
  request: { icon: Briefcase, bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-600 dark:text-blue-400", label: "Yêu cầu TD" },
  dispatch: { icon: Users, bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400", label: "Điều phối" },
  attendance: { icon: Clock, bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-600 dark:text-orange-400", label: "Chấm công" },
  urgent: { icon: AlertTriangle, bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-600 dark:text-red-400", label: "Khẩn cấp" },
  finance: { icon: CreditCard, bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-600 dark:text-purple-400", label: "Tài chính" },
  system: { icon: Settings, bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400", label: "Hệ thống" },
  confirm: { icon: CheckCircle2, bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400", label: "Xác nhận" },
  warning: { icon: ShieldAlert, bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-600 dark:text-orange-400", label: "Cảnh báo" },
}

const allNotifications: Notification[] = [
  { id: "1", type: "request", title: "Yêu cầu tuyển dụng mới", message: "YCTD mới từ Cty Thực phẩm Việt - Cần 8 phục vụ nhà hàng, bắt đầu 10/04", time: "5 phút trước", date: "08/04/2026", isRead: false, link: "/orders/1" },
  { id: "2", type: "dispatch", title: "Điều phối hoàn tất", message: "Đã điều phối đủ 10/10 ứng viên cho YCTD #ORD-025 (Samsung)", time: "15 phút trước", date: "08/04/2026", isRead: false, link: "/dispatch" },
  { id: "3", type: "attendance", title: "Chấm công bất thường", message: "3 ứng viên chưa check-in tại KCN Bình Dương (ca sáng)", time: "1 giờ trước", date: "08/04/2026", isRead: false, link: "/attendance" },
  { id: "4", type: "urgent", title: "Cần xử lý gấp", message: "YCTD #ORD-027 thiếu 2 ứng viên cho ngày mai - cần xử lý gấp", time: "2 giờ trước", date: "08/04/2026", isRead: false, link: "/orders/4" },
  { id: "5", type: "finance", title: "Thanh toán đã nhận", message: "Hóa đơn INV-2026-018 đã được khách hàng thanh toán", time: "3 giờ trước", date: "08/04/2026", isRead: false, link: "/invoices" },
  { id: "6", type: "system", title: "Cập nhật hồ sơ", message: "Ứng viên Nguyễn Văn A đã cập nhật hồ sơ và bổ sung chứng chỉ mới", time: "5 giờ trước", date: "08/04/2026", isRead: true, link: "/workers/w1" },
  { id: "7", type: "confirm", title: "Xác nhận đi làm", message: "Ứng viên Trần Thị B xác nhận đi làm ngày 09/04", time: "Hôm qua", date: "07/04/2026", isRead: true, link: "/dispatch" },
  { id: "8", type: "warning", title: "Hợp đồng sắp hết hạn", message: "Hợp đồng với Cty Galaxy Event sắp hết hạn (còn 5 ngày)", time: "Hôm qua", date: "07/04/2026", isRead: true, link: "/clients/3" },
  { id: "9", type: "request", title: "YCTD cần duyệt", message: "YCTD #ORD-030 từ Nhà máy Vinamilk - 20 công nhân đóng gói, cần duyệt", time: "Hôm qua", date: "07/04/2026", isRead: true, link: "/orders/5" },
  { id: "10", type: "dispatch", title: "Ứng viên từ chối", message: "Ứng viên Lê Văn C từ chối đi làm YCTD #ORD-024 - cần thay thế", time: "2 ngày trước", date: "06/04/2026", isRead: true, link: "/dispatch" },
  { id: "11", type: "finance", title: "Bảng lương đã duyệt", message: "Bảng lương tháng 03/2026 đã được duyệt - 186 ứng viên", time: "2 ngày trước", date: "06/04/2026", isRead: true, link: "/payroll" },
  { id: "12", type: "attendance", title: "Báo cáo chấm công tuần", message: "Tỷ lệ đúng giờ tuần 14: 91% - tăng 3% so với tuần trước", time: "3 ngày trước", date: "05/04/2026", isRead: true, link: "/attendance" },
  { id: "13", type: "confirm", title: "Xác nhận nhận lương", message: "15/186 ứng viên đã xác nhận nhận lương tháng 03", time: "3 ngày trước", date: "05/04/2026", isRead: true, link: "/payroll" },
  { id: "14", type: "system", title: "Bảo trì hệ thống", message: "Hệ thống sẽ bảo trì vào 23:00 ngày 10/04 trong 2 giờ", time: "4 ngày trước", date: "04/04/2026", isRead: true, link: "#" },
]

export function NotificationPage() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(allNotifications)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [readFilter, setReadFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filtered = notifications.filter((n) => {
    if (search) {
      const q = search.toLowerCase()
      if (!n.title.toLowerCase().includes(q) && !n.message.toLowerCase().includes(q)) return false
    }
    if (typeFilter !== "all" && n.type !== typeFilter) return false
    if (readFilter === "unread" && n.isRead) return false
    if (readFilter === "read" && !n.isRead) return false
    return true
  })

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success("Đã đánh dấu đã đọc tất cả")
  }

  function handleClick(notification: Notification) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    )
    if (notification.link !== "#") {
      navigate(notification.link)
    }
  }

  function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast.success("Đã xóa thông báo")
  }

  // Group by date
  const grouped = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    const key = n.date
    if (!acc[key]) acc[key] = []
    acc[key].push(n)
    return acc
  }, {})

  const dateLabels: Record<string, string> = {
    "08/04/2026": "Hôm nay",
    "07/04/2026": "Hôm qua",
    "06/04/2026": "06/04/2026",
    "05/04/2026": "05/04/2026",
    "04/04/2026": "04/04/2026",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Thông báo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : "Tất cả thông báo đã đọc"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-1.5" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4" />
            Đánh dấu đã đọc tất cả
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thông báo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Loại thông báo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="request">Yêu cầu TD</SelectItem>
                <SelectItem value="dispatch">Điều phối</SelectItem>
                <SelectItem value="attendance">Chấm công</SelectItem>
                <SelectItem value="urgent">Khẩn cấp</SelectItem>
                <SelectItem value="finance">Tài chính</SelectItem>
                <SelectItem value="confirm">Xác nhận</SelectItem>
                <SelectItem value="warning">Cảnh báo</SelectItem>
                <SelectItem value="system">Hệ thống</SelectItem>
              </SelectContent>
            </Select>
            <Select value={readFilter} onValueChange={setReadFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="unread">Chưa đọc</SelectItem>
                <SelectItem value="read">Đã đọc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notification list grouped by date */}
      {Object.keys(grouped).length === 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-4 text-sm font-medium text-muted-foreground">Không có thông báo nào</p>
          </CardContent>
        </Card>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {dateLabels[date] ?? date}
            </p>
            <Card className="border-border/50 shadow-sm overflow-hidden">
              {items.map((notification, idx) => {
                const config = typeConfig[notification.type]
                const Icon = config.icon
                return (
                  <div key={notification.id}>
                    {idx > 0 && <Separator />}
                    <div
                      className={cn(
                        "flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/40 cursor-pointer group",
                        !notification.isRead && "bg-primary/[0.02]"
                      )}
                      onClick={() => handleClick(notification)}
                    >
                      {/* Icon */}
                      <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", config.bg)}>
                        <Icon className={cn("h-5 w-5", config.text)} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-sm", !notification.isRead ? "font-semibold" : "font-medium text-foreground")}>
                            {notification.title}
                          </p>
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                            {config.label}
                          </Badge>
                          {!notification.isRead && (
                            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="mt-1.5 text-xs text-muted-foreground/60">
                          {notification.time}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(notification.id)
                        }}
                        className="mt-1 shrink-0 rounded-md p-1.5 text-muted-foreground/40 opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </Card>
          </div>
        ))
      )}
    </div>
  )
}
