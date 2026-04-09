import { useParams, Link, useNavigate } from "react-router-dom"
import { usePermissions } from "@/hooks/use-permissions"
import { useStaffingOrder, useApproveOrder, useUpdateOrderStatus } from "@/hooks/use-staffing-orders"
import { useAssignments } from "@/hooks/use-assignments"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  Building,
  Users,
  CalendarDays,
  DollarSign,
  Briefcase,
  UserPlus,
  Pencil,
  XCircle,
  Send,
  AlertTriangle,
  FileText,
  CircleDot,
  CircleCheck,
  CircleX,
  Timer,
  Shirt,
  Contact,
  CreditCard,
  TrendingUp,
  ExternalLink,
  Loader2,
} from "lucide-react"
import type { AssignmentStatus, OrderStatus } from "@/types"

// ─── Config ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  draft: {
    label: "Nháp",
    className: "bg-gray-50 text-gray-600 border-gray-200/80",
  },
  pending: {
    label: "Chờ duyệt",
    className: "bg-blue-50 text-blue-700 border-blue-200/80",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-200/80",
  },
  recruiting: {
    label: "Đang tuyển",
    className: "bg-amber-50 text-amber-700 border-amber-200/80",
  },
  filled: {
    label: "Đủ người",
    className: "bg-teal-50 text-teal-700 border-teal-200/80",
  },
  in_progress: {
    label: "Đang thực hiện",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-gray-100 text-gray-600 border-gray-200/80",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700 border-red-200/80",
  },
}

const ASSIGNMENT_STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof CircleCheck }> = {
  created: {
    label: "Mới tạo",
    className: "bg-blue-50 text-blue-700 border-blue-200/80",
    icon: CircleDot,
  },
  contacted: {
    label: "Đã liên hệ",
    className: "bg-sky-50 text-sky-700 border-sky-200/80",
    icon: Phone,
  },
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    icon: CircleCheck,
  },
  working: {
    label: "Đang làm việc",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    icon: CircleCheck,
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-gray-100 text-gray-600 border-gray-200/80",
    icon: CircleCheck,
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-200/80",
    icon: CircleX,
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700 border-red-200/80",
    icon: CircleX,
  },
  no_contact: {
    label: "Không liên lạc được",
    className: "bg-amber-50 text-amber-700 border-amber-200/80",
    icon: CircleDot,
  },
  replaced: {
    label: "Đã thay thế",
    className: "bg-gray-100 text-gray-600 border-gray-200/80",
    icon: CircleDot,
  },
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase()
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—"
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr))
}

function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

function getProgressPercent(filled: number, needed: number): number {
  if (needed === 0) return 0
  return Math.min(Math.round((filled / needed) * 100), 100)
}

function getGenderLabel(gender: string | null | undefined): string {
  switch (gender) {
    case "male": return "Nam"
    case "female": return "Nữ"
    case "any": return "Không yêu cầu"
    default: return "Không yêu cầu"
  }
}

function getRateTypeLabel(rateType: string | null | undefined): string {
  switch (rateType) {
    case "hourly": return "/giờ"
    case "daily": return "/ngày"
    case "shift": return "/ca"
    default: return ""
  }
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof MapPin
  label: string
  value: string
  className?: string
}) {
  return (
    <div className={`flex items-start gap-3 ${className ?? ""}`}>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

function ProgressCircle({ percent }: { percent: number }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const color =
    percent >= 100
      ? "text-emerald-500"
      : percent >= 60
        ? "text-blue-500"
        : percent >= 30
          ? "text-amber-500"
          : "text-red-500"

  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      <svg className="h-24 w-24 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-muted"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="currentColor"
          className={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <span className="absolute text-lg font-bold tabular-nums">{percent}%</span>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const can = usePermissions()

  // Fetch order details
  const { data: order, isLoading: orderLoading, error: orderError } = useStaffingOrder(id)

  // Fetch assignments for this order
  const { data: assignmentsData, isLoading: assignmentsLoading } = useAssignments(
    { order_id: id, per_page: 100 },
    { enabled: !!id },
  )

  // Mutations
  const approveMutation = useApproveOrder()
  const updateStatusMutation = useUpdateOrderStatus()

  // Loading state
  if (orderLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Error state
  if (orderError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-6 w-6 text-red-500" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Không tìm thấy đơn hàng
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Đơn hàng không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/orders")}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const statusConf = STATUS_CONFIG[order.status] ?? { label: order.status_label, className: "bg-gray-100 text-gray-600 border-gray-200/80" }
  const percent = getProgressPercent(order.quantity_filled, order.quantity_needed)
  const assignments = assignmentsData?.data ?? []

  // Build salary display
  const salaryDisplay = order.worker_rate
    ? `${formatCurrency(order.worker_rate)}${getRateTypeLabel(order.rate_type)}`
    : "Chưa cập nhật"

  // Build time range display
  const timeRange = order.start_date
    ? `${formatDate(order.start_date)}${order.end_date ? ` - ${formatDate(order.end_date)}` : ""}`
    : "Chưa cập nhật"

  // Build shift display
  const shiftDisplay = order.start_time && order.end_time
    ? `${order.start_time} - ${order.end_time}${order.shift_type ? ` (${order.shift_type})` : ""}`
    : order.shift_type ?? "Chưa cập nhật"

  // Build age range display
  const ageDisplay = order.age_min || order.age_max
    ? `${order.age_min ?? "—"} - ${order.age_max ?? "—"} tuổi`
    : "Không yêu cầu"

  // Build work address
  const workAddress = [order.work_address, order.work_district, order.work_city]
    .filter(Boolean)
    .join(", ") || "Chưa cập nhật"

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/orders" />}>Yêu cầu TD</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{order.order_code}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/orders")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">{order.order_code}</h1>
              <Badge
                variant="outline"
                className={`rounded-md text-xs font-medium ${statusConf.className}`}
              >
                {order.status_label || statusConf.label}
              </Badge>
              {order.urgency === "urgent" && (
                <Badge
                  variant="outline"
                  className="rounded-md text-xs font-medium bg-orange-50 text-orange-700 border-orange-200/80"
                >
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Gấp
                </Badge>
              )}
              {order.urgency === "critical" && (
                <Badge
                  variant="outline"
                  className="rounded-md text-xs font-medium bg-red-50 text-red-700 border-red-200/80 animate-pulse"
                >
                  <AlertTriangle className="mr-1 h-3 w-3" />
                  Rất gấp
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {order.position_name}{order.client ? ` - ${order.client.company_name}` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {can("orders.update") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Tính năng đang phát triển")}
            >
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Sửa
            </Button>
          )}
          {can("orders.approve") && (order.status === "pending" || order.status === "draft") && (
            <Button
              variant="outline"
              size="sm"
              disabled={approveMutation.isPending}
              onClick={() => approveMutation.mutate(order.id)}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {approveMutation.isPending ? "Đang duyệt..." : "Duyệt"}
            </Button>
          )}
          {can("orders.assign") && (
            <Button size="sm" onClick={() => navigate("/dispatch")}>
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Phân công
            </Button>
          )}
        </div>
      </div>

      {/* Content: 2-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Order Information */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Thông tin yêu cầu
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow icon={Building} label="Khách hàng" value={order.client?.company_name ?? "—"} />
                <InfoRow icon={Contact} label="Người liên hệ" value={order.client?.contact_name ?? "—"} />
                <InfoRow icon={Phone} label="Số điện thoại" value={order.client?.contact_phone ?? "—"} />
                <InfoRow icon={Briefcase} label="Vị trí tuyển" value={order.position_name} />
                <InfoRow icon={Users} label="Số lượng" value={`${order.quantity_needed} người`} />
                <InfoRow icon={DollarSign} label="Mức lương" value={salaryDisplay} />
                <InfoRow icon={MapPin} label="Địa điểm làm việc" value={workAddress} />
                <InfoRow icon={CalendarDays} label="Thời gian" value={timeRange} />
                <InfoRow icon={Timer} label="Ca làm việc" value={shiftDisplay} />
                <InfoRow icon={Shirt} label="Trang phục" value={order.uniform_requirement ?? "Không yêu cầu"} />
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Mô tả công việc</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {order.job_description ?? "Chưa có mô tả."}
                </p>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Yêu cầu ứng viên</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Giới tính</p>
                    <p className="text-sm font-medium">{getGenderLabel(order.gender_requirement)}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Độ tuổi</p>
                    <p className="text-sm font-medium">{ageDisplay}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Kỹ năng</p>
                    <p className="text-sm font-medium">
                      {order.required_skills?.length
                        ? order.required_skills.join(", ")
                        : order.other_requirements ?? "Không yêu cầu"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Workers */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  Danh sách ứng viên đã điều phối
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {assignments.length}
                  </Badge>
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => navigate("/dispatch")}>
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Thêm ứng viên
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {assignmentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    Chưa có ứng viên nào được phân công
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Nhấn "Thêm ứng viên" để bắt đầu điều phối
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead>Tên ứng viên</TableHead>
                      <TableHead>SĐT</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày phân công</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map((assignment, index) => {
                      const wsConf = ASSIGNMENT_STATUS_CONFIG[assignment.status] ?? {
                        label: assignment.status_label,
                        className: "bg-gray-100 text-gray-600 border-gray-200/80",
                        icon: CircleDot,
                      }
                      const workerName = assignment.worker?.full_name ?? "—"
                      const workerPhone = assignment.worker?.phone ?? "—"

                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="text-center text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-[10px] font-medium bg-muted">
                                  {getInitials(workerName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{workerName}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{workerPhone}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`rounded-md text-[11px] font-medium ${wsConf.className}`}
                            >
                              {assignment.status_label || wsConf.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(assignment.created_at)}
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Activity Log - replaced with assignment history since no activity log API yet */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Lịch sử hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chưa có hoạt động nào được ghi nhận.
                  </p>
                </div>
              ) : (
                <div className="relative space-y-0">
                  {/* Show order creation as first activity */}
                  <div className="relative flex gap-3 pb-6">
                    {assignments.length > 0 && (
                      <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
                    )}
                    <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{order.created_by?.name ?? "Hệ thống"}</span>{" "}
                        <span className="text-muted-foreground">Tạo đơn hàng {order.order_code}</span>
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Show assignment activities */}
                  {assignments.map((assignment, index) => {
                    const isLast = index === assignments.length - 1
                    const statusIcon = assignment.status === "confirmed" || assignment.status === "working" || assignment.status === "completed"
                      ? { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" }
                      : assignment.status === "rejected" || assignment.status === "cancelled"
                        ? { icon: XCircle, color: "text-red-500", bg: "bg-red-50" }
                        : { icon: Users, color: "text-violet-500", bg: "bg-violet-50" }
                    const Icon = statusIcon.icon

                    return (
                      <div key={assignment.id} className="relative flex gap-3 pb-6 last:pb-0">
                        {!isLast && (
                          <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
                        )}
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${statusIcon.bg}`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${statusIcon.color}`} />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{assignment.assigned_by?.name ?? "Hệ thống"}</span>{" "}
                            <span className="text-muted-foreground">
                              Phân công {assignment.worker?.full_name ?? "ứng viên"} - {assignment.status_label}
                            </span>
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatDate(assignment.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Overview */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Tổng quan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <ProgressCircle percent={percent} />
                <p className="mt-2 text-sm font-medium">
                  {order.quantity_filled}/{order.quantity_needed} ứng viên
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.quantity_needed - order.quantity_filled > 0
                    ? `Còn thiếu ${order.quantity_needed - order.quantity_filled} người`
                    : "Đã đủ số lượng"}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">SL cần</span>
                  <span className="text-sm font-semibold">{order.quantity_needed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">SL đã có</span>
                  <span className="text-sm font-semibold text-emerald-600">{order.quantity_filled}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Ngày tạo</span>
                  <span className="text-sm">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Ngày bắt đầu</span>
                  <span className="text-sm font-medium text-red-600">{formatDate(order.start_date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Phụ trách</span>
                  <span className="text-sm font-medium">{order.assigned_to?.name ?? "Chưa phân công"}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building className="h-4 w-4 text-muted-foreground" />
                Khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.client ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 rounded-xl">
                      <AvatarFallback
                        className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl text-xs font-semibold text-white"
                      >
                        {getInitials(order.client.company_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{order.client.company_name}</p>
                      <p className="text-xs text-muted-foreground">{order.client.industry ?? "—"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2.5">
                    {order.client.contact_phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{order.client.contact_phone}</span>
                      </div>
                    )}
                    {order.client.contact_email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{order.client.contact_email}</span>
                      </div>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/clients/${order.client!.id}`)}>
                    <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                    Xem chi tiết khách hàng
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Chưa có thông tin khách hàng.</p>
              )}
            </CardContent>
          </Card>

          {/* Finance */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Tài chính
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Lương worker</span>
                <span className="text-sm font-medium">{salaryDisplay}</span>
              </div>
              {order.service_fee != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Phí dịch vụ</span>
                  <span className="text-sm font-medium">{formatCurrency(order.service_fee)}{order.service_fee_type ? ` (${order.service_fee_type})` : ""}</span>
                </div>
              )}
              {order.overtime_rate != null && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tăng ca</span>
                  <span className="text-sm font-medium">{formatCurrency(order.overtime_rate)}/giờ</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Loại dịch vụ</span>
                <Badge
                  variant="outline"
                  className="rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border-amber-200/80"
                >
                  {order.service_type_label ?? order.service_type ?? "—"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
