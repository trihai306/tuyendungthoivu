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
  Activity,
  Shield,
  MapPin,
  CalendarClock,
  CircleCheck,
  CirclePause,
  CircleOff,
  CircleDot,
  Loader2,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/stores/auth-store"
import { usePermissions } from "@/hooks/use-permissions"
import { useDashboardStats } from "@/hooks/use-dashboard-new"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRevenue(amount: number): string {
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(2)} tỷ`
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(0)} tr`
  return amount.toLocaleString("vi-VN")
}

const workerStatusMeta: Record<string, { label: string; icon: LucideIcon; color: string; bgColor: string; barColor: string }> = {
  available: { label: "Sẵn sàng", icon: CircleCheck, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-50 dark:bg-emerald-500/10", barColor: "bg-emerald-500" },
  assigned: { label: "Đang làm việc", icon: CircleDot, color: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-500/10", barColor: "bg-blue-500" },
  inactive: { label: "Tạm nghỉ", icon: CirclePause, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-500/10", barColor: "bg-amber-500" },
  blacklisted: { label: "Danh sách đen", icon: CircleOff, color: "text-gray-500 dark:text-gray-400", bgColor: "bg-gray-50 dark:bg-gray-500/10", barColor: "bg-gray-400" },
}

const avatarColors = [
  "from-blue-400 to-blue-600",
  "from-pink-400 to-pink-600",
  "from-emerald-400 to-emerald-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
]

export function Dashboard() {
  const navigate = useNavigate()
  const can = usePermissions()
  const user = useAuthStore((s) => s.user)
  const userName = user?.name ?? "Người dùng"
  const userRole = user?.roles?.[0]?.display_name ?? user?.position ?? "Người dùng"

  const { data: stats, isLoading } = useDashboardStats()

  // Build KPI cards from API data
  const kpiCards = [
    { title: "YCTD đang xử lý", value: String(stats?.active_orders ?? 0), icon: ClipboardList, accentColor: "border-l-blue-500", iconBg: "from-blue-500 to-blue-600" },
    { title: "Ứng viên đang làm việc", value: String(stats?.workers_working ?? 0), icon: Users, accentColor: "border-l-emerald-500", iconBg: "from-emerald-500 to-emerald-600" },
    { title: "Cần điều phối hôm nay", value: String(stats?.dispatch_today ?? 0), icon: Route, accentColor: "border-l-orange-500", iconBg: "from-orange-500 to-orange-600" },
    ...(can("revenue.view") ? [{ title: "Doanh thu tháng", value: formatRevenue(stats?.monthly_revenue ?? 0), icon: Banknote, accentColor: "border-l-violet-500", iconBg: "from-violet-500 to-violet-600" }] : []),
  ]

  // Build worker status groups from API
  const workersByStatus = stats?.workers_by_status ?? {}
  const workerStatusGroups = Object.entries(workersByStatus).map(([status, count]) => ({
    ...workerStatusMeta[status] ?? { label: status, icon: CircleDot, color: "text-gray-500", bgColor: "bg-gray-50", barColor: "bg-gray-400" },
    count: count as number,
  }))
  const totalWorkers = workerStatusGroups.reduce((sum, g) => sum + g.count, 0)

  const recentOrders = stats?.recent_orders ?? []
  const recentActivities = stats?.recent_activities ?? []
  const dispatchTodayItems = stats?.dispatch_today_items ?? []

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
              <span className="font-medium text-white">{stats?.dispatch_today ?? 0} ứng viên</span> cần điều phối,{" "}
              <span className="font-medium text-white">{stats?.active_orders ?? 0} yêu cầu</span> cần xử lý và{" "}
              <span className="font-medium text-white">{stats?.workers_working ?? 0} ứng viên</span> đang làm việc.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            {can("assignments.view") && (
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm"
                onClick={() => navigate("/dispatch")}
              >
                <Route className="mr-1.5 h-3.5 w-3.5" />
                Điều phối
              </Button>
            )}
            {can("orders.create") && (
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90 shadow-sm"
                onClick={() => navigate("/orders/create")}
              >
                <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
                Yêu cầu mới
              </Button>
            )}
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
                  {recentOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                        Chưa có đơn hàng nào
                      </TableCell>
                    </TableRow>
                  ) : recentOrders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="group cursor-pointer border-0 transition-colors hover:bg-muted/40"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <TableCell className="py-3 pl-6">
                        <span className="text-[13px] font-semibold text-primary">
                          {order.code}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[13px] font-medium">
                          {order.client ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[12px] text-muted-foreground">
                          {order.position}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-center">
                        <span className="text-[13px] font-semibold tabular-nums">
                          {order.quantity_filled}/{order.quantity_needed}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="text-[12px] text-muted-foreground tabular-nums">
                          {order.created_at}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <Badge variant="outline" className="rounded-md text-[11px] font-medium">
                          {order.status_label}
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
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />

                {recentActivities.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Chưa có hoạt động nào</p>
                ) : recentActivities.map((item, i) => (
                  <div
                    key={item.id}
                    className="group relative flex items-start gap-3 rounded-lg py-2.5 transition-colors"
                  >
                    <Avatar size="sm" className="relative z-10 ring-2 ring-card shrink-0">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${avatarColors[i % avatarColors.length]} text-[9px] font-semibold text-white`}
                      >
                        {item.action === "check_in" ? "CI" : "CO"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 -mt-0.5">
                      <p className="text-[13px] leading-snug">
                        <span className="font-medium">{item.worker_name ?? "—"}</span>{" "}
                        <span className="text-muted-foreground">
                          {item.action === "check_in" ? "check-in" : "check-out"} đơn {item.order_code ?? ""}
                        </span>
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.time ?? item.date}
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
                  {dispatchTodayItems.length} ca làm việc cần điều phối
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
              {dispatchTodayItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">Không có điều phối hôm nay</p>
              ) : dispatchTodayItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/50 p-3.5 transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-muted/60">
                      <span className="text-[15px] font-bold tabular-nums leading-tight">
                        {item.start_time ?? "—"}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium truncate">
                        {item.client ?? item.order_code}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                        <span>{item.position ?? "—"}</span>
                        {item.work_address && (
                          <span className="flex items-center gap-0.5">
                            <MapPin className="h-3 w-3" />
                            {item.work_address}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-3">
                      <Badge variant="outline" className="shrink-0 rounded-md text-[11px] font-medium">
                        {item.status_label}
                      </Badge>
                    </div>
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
                const pct = totalWorkers > 0 ? Math.round((group.count / totalWorkers) * 100) : 0
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
                    {(workerStatusGroups[0]?.count ?? 0) + (workerStatusGroups[1]?.count ?? 0)}
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
