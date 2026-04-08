import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ClipboardList,
  Users,
  Route,
  Banknote,
  ArrowRight,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  MapPin,
  CalendarClock,
  CircleCheck,
  CirclePause,
  CircleOff,
  CircleDot,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import type { UserRole } from "@/types"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KpiCard {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative"
  icon: LucideIcon
  accentColor: string
  iconBg: string
}

type OrderStatus = "Mới" | "Đang xử lý" | "Đã điều phối" | "Hoàn thành" | "Huỷ"

interface RecentOrder {
  code: string
  customer: string
  position: string
  quantity: number
  status: OrderStatus
  createdAt: string
}

interface ActivityItem {
  id: string
  actor: { name: string; initials: string; avatarBg: string }
  description: string
  timeAgo: string
}

type DispatchStatus = "Đã xác nhận" | "Chờ xác nhận" | "Đang di chuyển"

interface DispatchItem {
  customer: string
  position: string
  workers: number
  checkInTime: string
  location: string
  status: DispatchStatus
}

interface WorkerStatusGroup {
  label: string
  count: number
  icon: LucideIcon
  color: string
  bgColor: string
  barColor: string
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const kpiCards: KpiCard[] = [
  {
    title: "YCTD đang xử lý",
    value: "24",
    change: "+12%",
    changeType: "positive",
    icon: ClipboardList,
    accentColor: "border-l-blue-500",
    iconBg: "from-blue-500 to-blue-600",
  },
  {
    title: "Ứng viên đang làm việc",
    value: "186",
    change: "+8%",
    changeType: "positive",
    icon: Users,
    accentColor: "border-l-emerald-500",
    iconBg: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Cần điều phối hôm nay",
    value: "37",
    change: "+5",
    changeType: "negative",
    icon: Route,
    accentColor: "border-l-orange-500",
    iconBg: "from-orange-500 to-orange-600",
  },
  {
    title: "Doanh thu tháng",
    value: "1,28 tỷ",
    change: "+18%",
    changeType: "positive",
    icon: Banknote,
    accentColor: "border-l-violet-500",
    iconBg: "from-violet-500 to-violet-600",
  },
]

const recentOrders: RecentOrder[] = [
  { code: "ORD-031", customer: "Cty TNHH Logistic VN", position: "Bốc xếp hàng", quantity: 12, status: "Mới", createdAt: "08/04/2026" },
  { code: "ORD-030", customer: "KCN Bình Dương III", position: "Công nhân sản xuất", quantity: 25, status: "Đang xử lý", createdAt: "07/04/2026" },
  { code: "ORD-029", customer: "Siêu thị BigC Tân Phú", position: "Nhân viên kho", quantity: 8, status: "Đã điều phối", createdAt: "07/04/2026" },
  { code: "ORD-028", customer: "Cty CP Thực phẩm Saigon", position: "Đóng gói", quantity: 15, status: "Đang xử lý", createdAt: "06/04/2026" },
  { code: "ORD-027", customer: "KCN Amata Đồng Nai", position: "Lắp ráp linh kiện", quantity: 30, status: "Hoàn thành", createdAt: "05/04/2026" },
  { code: "ORD-026", customer: "Cty TNHH May mặc ABC", position: "May công nghiệp", quantity: 20, status: "Đã điều phối", createdAt: "05/04/2026" },
]

const activityFeed: ActivityItem[] = [
  {
    id: "1",
    actor: { name: "Nguyễn Văn A", initials: "NA", avatarBg: "from-blue-400 to-blue-600" },
    description: "đã xác nhận điều phối 5 ứng viên cho Đơn #ORD-029",
    timeAgo: "5 phút trước",
  },
  {
    id: "2",
    actor: { name: "Trần Thị Mai", initials: "TM", avatarBg: "from-pink-400 to-pink-600" },
    description: "đã tiếp nhận yêu cầu mới #ORD-031 từ Logistic VN",
    timeAgo: "23 phút trước",
  },
  {
    id: "3",
    actor: { name: "Lê Hoàng Nam", initials: "LN", avatarBg: "from-emerald-400 to-emerald-600" },
    description: "đã cập nhật trạng thái 12 ứng viên tại KCN Bình Dương",
    timeAgo: "1 giờ trước",
  },
  {
    id: "4",
    actor: { name: "Phạm Thuỳ Dung", initials: "PD", avatarBg: "from-violet-400 to-violet-600" },
    description: "đã hoàn thành đối soát chấm công tháng 3/2026",
    timeAgo: "2 giờ trước",
  },
  {
    id: "5",
    actor: { name: "Nguyễn Minh Tuấn", initials: "NT", avatarBg: "from-amber-400 to-amber-600" },
    description: "đã gửi báo giá cho Cty CP Thực phẩm Saigon",
    timeAgo: "3 giờ trước",
  },
  {
    id: "6",
    actor: { name: "Đỗ Thị Lan", initials: "ĐL", avatarBg: "from-rose-400 to-rose-600" },
    description: "đã thêm 3 ứng viên mới vào hệ thống",
    timeAgo: "4 giờ trước",
  },
]

const dispatchItems: DispatchItem[] = [
  { customer: "Cty TNHH Logistic VN", position: "Bốc xếp hàng", workers: 8, checkInTime: "06:00", location: "Q. Bình Tân", status: "Đã xác nhận" },
  { customer: "KCN Bình Dương III", position: "Công nhân SX", workers: 15, checkInTime: "07:00", location: "Bình Dương", status: "Đang di chuyển" },
  { customer: "Siêu thị BigC Tân Phú", position: "Nhân viên kho", workers: 6, checkInTime: "07:30", location: "Q. Tân Phú", status: "Chờ xác nhận" },
  { customer: "Cty CP Thực phẩm SG", position: "Đóng gói", workers: 10, checkInTime: "08:00", location: "Q.12", status: "Chờ xác nhận" },
]

const workerStatusGroups: WorkerStatusGroup[] = [
  { label: "Sẵn sàng", count: 94, icon: CircleCheck, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-500/10", barColor: "bg-emerald-500" },
  { label: "Đang làm việc", count: 186, icon: CircleDot, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-500/10", barColor: "bg-blue-500" },
  { label: "Tạm nghỉ", count: 23, icon: CirclePause, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-500/10", barColor: "bg-amber-500" },
  { label: "Hết hợp đồng", count: 12, icon: CircleOff, color: "text-gray-500 dark:text-gray-400", bgColor: "bg-gray-50 dark:bg-gray-500/10", barColor: "bg-gray-400" },
]

// ---------------------------------------------------------------------------
// Status configs
// ---------------------------------------------------------------------------

const orderStatusConfig: Record<OrderStatus, string> = {
  "Mới": "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  "Đang xử lý": "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "Đã điều phối": "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "Hoàn thành": "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Huỷ": "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
}

const dispatchStatusConfig: Record<DispatchStatus, string> = {
  "Đã xác nhận": "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Chờ xác nhận": "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "Đang di chuyển": "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const roleLabels: Record<UserRole, string> = {
  admin: "Quản trị viên",
  employer: "Nhà tuyển dụng",
  worker: "Nhân viên",
}

export function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const userName = user?.name ?? "Người dùng"
  const userRole = user?.role ? roleLabels[user.role] : "Người dùng"

  const totalWorkers = workerStatusGroups.reduce((sum, g) => sum + g.count, 0)

  return (
    <div className="space-y-6">
      {/* ================================================================= */}
      {/* Hero Banner                                                       */}
      {/* ================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Hệ thống cung ứng nhân sự thời vụ
            </span>
            <div className="mt-1 flex items-center gap-3">
              <h1 className="text-xl font-semibold">Xin chào, {userName}</h1>
              <Badge className="bg-white/20 text-white border-white/30 text-[11px]">
                <Shield className="mr-1 h-3 w-3" />
                {userRole}
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-white/70">
              Hôm nay có{" "}
              <span className="font-medium text-white">37 ứng viên</span> cần điều phối,{" "}
              <span className="font-medium text-white">4 yêu cầu</span> cần xử lý và{" "}
              <span className="font-medium text-white">186 ứng viên</span> đang làm việc.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm"
              onClick={() => navigate("/dispatch")}
            >
              <Route className="mr-1.5 h-3.5 w-3.5" />
              Điều phối
            </Button>
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
              onClick={() => navigate("/orders/create")}
            >
              <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
              Yêu cầu mới
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 1: KPI Cards                                                  */}
      {/* ================================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card) => (
          <Card
            key={card.title}
            className={`group relative overflow-hidden border-l-4 ${card.accentColor} border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-[13px] font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <span className="block text-[28px] font-semibold tracking-tight leading-none">
                    {card.value}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {card.changeType === "positive" ? (
                      <span className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <ArrowUpRight className="h-3 w-3" />
                        {card.change}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        <ArrowDownRight className="h-3 w-3" />
                        {card.change}
                      </span>
                    )}
                    <span className="text-[11px] text-muted-foreground">
                      so với tháng trước
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.iconBg} shadow-sm`}
                >
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================================================================= */}
      {/* Row 2: Recent Orders + Activity Feed                              */}
      {/* ================================================================= */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Recent Orders - col-span-3 (60%) */}
        <Card className="border-border/50 shadow-sm lg:col-span-3 overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold">
                  Yêu cầu gần đây
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Các yêu cầu tuyển dụng nhân sự mới nhất
                </p>
              </div>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary"
                  onClick={() => navigate("/orders")}
                >
                  Xem tất cả
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Mã đơn
                    </TableHead>
                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Khách hàng
                    </TableHead>
                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Vị trí
                    </TableHead>
                    <TableHead className="h-10 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      SL
                    </TableHead>
                    <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Ngày tạo
                    </TableHead>
                    <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Trạng thái
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow
                      key={order.code}
                      className="group cursor-pointer border-0 transition-colors hover:bg-muted/40"
                      onClick={() => navigate(`/orders/${order.code}`)}
                    >
                      <TableCell className="py-3 pl-6">
                        <span className="text-[13px] font-semibold text-primary">
                          {order.code}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[13px] font-medium">
                          {order.customer}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[12px] text-muted-foreground">
                          {order.position}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <span className="text-[13px] font-semibold tabular-nums">
                          {order.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[12px] text-muted-foreground tabular-nums">
                          {order.createdAt}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <Badge
                          variant="outline"
                          className={`rounded-md text-[11px] font-medium ${orderStatusConfig[order.status]}`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed - col-span-2 (40%) */}
        <Card className="border-border/50 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Hoạt động gần đây
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Cập nhật mới nhất từ hệ thống
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-[340px] px-4">
              <div className="relative space-y-0">
                {/* Vertical timeline line */}
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />

                {activityFeed.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-start gap-3 rounded-lg py-2.5 transition-colors"
                  >
                    <Avatar size="sm" className="relative z-10 ring-2 ring-card shrink-0">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${item.actor.avatarBg} text-[9px] font-semibold text-white`}
                      >
                        {item.actor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 -mt-0.5">
                      <p className="text-[13px] leading-snug">
                        <span className="font-medium">{item.actor.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {item.description}
                        </span>
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Row 3: Dispatch Today + Worker Status                             */}
      {/* ================================================================= */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Dispatch Today - col-span-3 */}
        <Card className="border-border/50 shadow-sm lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  Điều phối hôm nay
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {dispatchItems.length} ca làm việc cần điều phối
                </p>
              </div>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary"
                  onClick={() => navigate("/dispatch")}
                >
                  Xem tất cả
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dispatchItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/50 p-3.5 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Check-in time */}
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted/60">
                      <span className="text-[15px] font-bold tabular-nums leading-tight">
                        {item.checkInTime}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">
                        {item.customer}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span>{item.position}</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                      </div>
                    </div>

                    {/* Worker count + Status - hidden on mobile, shown on sm+ */}
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[13px] font-semibold tabular-nums">
                          {item.workers}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 rounded-md text-[11px] font-medium ${dispatchStatusConfig[item.status]}`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Mobile: worker count + status on second row */}
                  <div className="flex sm:hidden items-center justify-between mt-2 ml-15">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[12px] font-semibold tabular-nums">
                        {item.workers} ứng viên
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={`rounded-md text-[11px] font-medium ${dispatchStatusConfig[item.status]}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Worker Status - col-span-2 */}
        <Card className="border-border/50 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div>
              <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                Ứng viên theo trạng thái
              </CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Tổng cộng {totalWorkers} ứng viên trong hệ thống
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workerStatusGroups.map((group) => {
                const pct = Math.round((group.count / totalWorkers) * 100)
                return (
                  <div key={group.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${group.bgColor}`}>
                          <group.icon className={`h-4 w-4 ${group.color}`} />
                        </div>
                        <span className="text-[13px] font-medium">{group.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[20px] font-bold tabular-nums leading-none">
                          {group.count}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          ({pct}%)
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${group.barColor} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary footer */}
            <div className="mt-6 rounded-lg border border-border/50 bg-muted/30 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-[22px] font-bold text-primary tabular-nums">{totalWorkers}</p>
                  <p className="text-[11px] text-muted-foreground">Tổng ứng viên</p>
                </div>
                <div className="text-center">
                  <p className="text-[22px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {workerStatusGroups[0].count + workerStatusGroups[1].count}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Có thể điều phối</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
