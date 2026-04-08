import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Briefcase,
  Users,
  Clock,
  AlertTriangle,
  CreditCard,
  Settings,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Notification type definitions
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
  isRead: boolean
  link: string
}

// Icon and color config per type
const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; text: string }
> = {
  request: { icon: Briefcase, bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-600 dark:text-blue-400" },
  dispatch: { icon: Users, bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400" },
  attendance: { icon: Clock, bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-600 dark:text-orange-400" },
  urgent: { icon: AlertTriangle, bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-600 dark:text-red-400" },
  finance: { icon: CreditCard, bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-600 dark:text-purple-400" },
  system: { icon: Settings, bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-600 dark:text-gray-400" },
  confirm: { icon: CheckCircle2, bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-600 dark:text-emerald-400" },
  warning: { icon: ShieldAlert, bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-600 dark:text-orange-400" },
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "request",
    title: "Yêu cầu tuyển dụng mới",
    message: "YCTD mới từ Cty Thực phẩm Việt - Cần 8 phục vụ nhà hàng, bắt đầu 10/04",
    time: "5 phút trước",
    isRead: false,
    link: "/orders/1",
  },
  {
    id: "2",
    type: "dispatch",
    title: "Điều phối hoàn tất",
    message: "Đã điều phối đủ 10/10 ứng viên cho YCTD #ORD-025 (Samsung)",
    time: "15 phút trước",
    isRead: false,
    link: "/dispatch",
  },
  {
    id: "3",
    type: "attendance",
    title: "Chấm công bất thường",
    message: "3 ứng viên chưa check-in tại KCN Bình Dương (ca sáng)",
    time: "1 giờ trước",
    isRead: false,
    link: "/attendance",
  },
  {
    id: "4",
    type: "urgent",
    title: "Cần xử lý gấp",
    message: "YCTD #ORD-027 thiếu 2 ứng viên cho ngày mai - cần xử lý gấp",
    time: "2 giờ trước",
    isRead: false,
    link: "/orders/4",
  },
  {
    id: "5",
    type: "finance",
    title: "Thanh toán đã nhận",
    message: "Hóa đơn INV-2026-018 đã được khách hàng thanh toán",
    time: "3 giờ trước",
    isRead: false,
    link: "/invoices",
  },
  {
    id: "6",
    type: "system",
    title: "Cập nhật hồ sơ",
    message: "Ứng viên Nguyễn Văn A đã cập nhật hồ sơ và bổ sung chứng chỉ mới",
    time: "5 giờ trước",
    isRead: true,
    link: "/workers/w1",
  },
  {
    id: "7",
    type: "confirm",
    title: "Xác nhận đi làm",
    message: "Ứng viên Trần Thị B xác nhận đi làm ngày 09/04",
    time: "Hôm qua",
    isRead: true,
    link: "/dispatch",
  },
  {
    id: "8",
    type: "warning",
    title: "Hợp đồng sắp hết hạn",
    message: "Hợp đồng với Cty Galaxy Event sắp hết hạn (còn 5 ngày)",
    time: "Hôm qua",
    isRead: true,
    link: "/clients/3",
  },
]

export function NotificationDropdown() {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    toast.success("Đã đánh dấu đã đọc tất cả")
  }

  function handleNotificationClick(notification: Notification) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
    )
    setOpen(false)
    navigate(notification.link)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label="Thông báo"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" sideOffset={8} className="w-96 p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Thông báo</span>
            {unreadCount > 0 && (
              <Badge variant="default" className="h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px]">
                {unreadCount}
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Đánh dấu đã đọc tất cả
            </button>
          )}
        </div>

        <Separator />

        {/* Notification list */}
        <div className="max-h-[400px] overflow-y-auto">
          <div className="flex flex-col">
            {notifications.map((notification) => {
              const config = typeConfig[notification.type]
              const Icon = config.icon

              return (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 w-full",
                    !notification.isRead && "bg-primary/[0.03]"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      config.bg
                    )}
                  >
                    <Icon className={cn("h-4 w-4", config.text)} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "text-sm leading-tight",
                        !notification.isRead ? "font-semibold" : "font-medium text-muted-foreground"
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">
                      {notification.time}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notification.isRead && (
                    <div className="mt-2 flex shrink-0">
                      <span className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <Separator />

        {/* Footer */}
        <div className="p-2">
          <Button
            variant="ghost"
            className="w-full justify-center text-xs font-medium text-primary hover:text-primary/80"
            onClick={() => {
              setOpen(false)
              navigate("/notifications")
            }}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
