import { useParams, Link, useNavigate } from "react-router-dom"
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
  ShieldCheck,
  Shirt,
  Contact,
  CreditCard,
  Receipt,
  TrendingUp,
  ExternalLink,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

type OrderStatus = "new" | "processing" | "dispatched" | "completed" | "cancelled"
type WorkerAssignStatus = "confirmed" | "pending" | "rejected"

interface AssignedWorker {
  id: string
  name: string
  phone: string
  status: WorkerAssignStatus
  assigned_date: string
}

interface ActivityLog {
  id: string
  user: string
  action: string
  timestamp: string
  icon: "create" | "approve" | "assign" | "update" | "complete" | "cancel"
}

// ─── Config ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  new: {
    label: "Mới",
    className: "bg-blue-50 text-blue-700 border-blue-200/80",
  },
  processing: {
    label: "Đang xử lý",
    className: "bg-amber-50 text-amber-700 border-amber-200/80",
  },
  dispatched: {
    label: "Đã điều phối",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
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

const WORKER_STATUS_CONFIG: Record<WorkerAssignStatus, { label: string; className: string; icon: typeof CircleCheck }> = {
  confirmed: {
    label: "Đã xác nhận",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    icon: CircleCheck,
  },
  pending: {
    label: "Chờ xác nhận",
    className: "bg-amber-50 text-amber-700 border-amber-200/80",
    icon: CircleDot,
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-200/80",
    icon: CircleX,
  },
}

const ACTIVITY_ICONS = {
  create: { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  approve: { icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  assign: { icon: Users, color: "text-violet-500", bg: "bg-violet-50" },
  update: { icon: Pencil, color: "text-amber-500", bg: "bg-amber-50" },
  complete: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
  cancel: { icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_ORDER = {
  id: "1",
  code: "ORD-2024-001",
  status: "processing" as OrderStatus,
  urgency: "urgent" as const,
  client: {
    id: "1",
    name: "Công ty TNHH Thực phẩm Vạn Phúc",
    industry: "Chế biến thực phẩm",
    contact_person: "Nguyễn Văn Thành",
    phone: "0912 345 678",
    email: "thanh.nv@vanphuc.vn",
    avatar_color: "from-blue-400 to-blue-600",
  },
  position: "Công nhân đóng gói",
  description:
    "Đóng gói sản phẩm thực phẩm (mì gói, snack) theo dây chuyền. Công việc nhẹ nhàng, trong nhà xưởng có điều hòa. Yêu cầu nhanh nhẹn, cẩn thận.",
  requirements: {
    gender: "Nam/Nữ",
    age_range: "18 - 40 tuổi",
    skills: "Không yêu cầu kinh nghiệm, sức khỏe tốt",
  },
  quantity_needed: 20,
  quantity_filled: 15,
  salary: "280,000 VNĐ/ngày",
  location: "KCN Tân Phú Trung, Củ Chi, TP.HCM",
  start_date: "2024-04-15",
  end_date: "2024-05-15",
  shift: "Ca sáng: 7:00 - 15:00 | Ca chiều: 15:00 - 23:00",
  dress_code: "Đồng phục công ty cung cấp, giày bảo hộ",
  unit_price: "350,000 VNĐ/worker/ngày",
  total_estimate: "210,000,000 VNĐ",
  payment_status: "Đã đặt cọc 30%",
  assigned_to: "Trần Minh Quân",
  created_at: "2024-04-01",
  deadline: "2024-04-13",
}

const MOCK_WORKERS: AssignedWorker[] = [
  { id: "w1", name: "Lê Văn Hùng", phone: "0901 234 567", status: "confirmed", assigned_date: "2024-04-05" },
  { id: "w2", name: "Phạm Thị Lan", phone: "0912 456 789", status: "confirmed", assigned_date: "2024-04-05" },
  { id: "w3", name: "Nguyễn Hoàng Nam", phone: "0923 567 890", status: "confirmed", assigned_date: "2024-04-06" },
  { id: "w4", name: "Trần Thị Mai", phone: "0934 678 901", status: "pending", assigned_date: "2024-04-07" },
  { id: "w5", name: "Đỗ Văn Phúc", phone: "0945 789 012", status: "confirmed", assigned_date: "2024-04-06" },
  { id: "w6", name: "Bùi Thị Hoa", phone: "0956 890 123", status: "rejected", assigned_date: "2024-04-06" },
  { id: "w7", name: "Võ Minh Tuấn", phone: "0967 901 234", status: "confirmed", assigned_date: "2024-04-07" },
]

const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: "a1", user: "Nguyễn Thị Hằng", action: "Tạo yêu cầu ORD-2024-001", timestamp: "2024-04-01 09:15", icon: "create" },
  { id: "a2", user: "Trần Văn Đức (Manager)", action: "Duyệt yêu cầu, chuyển trạng thái sang \"Đang xử lý\"", timestamp: "2024-04-01 14:30", icon: "approve" },
  { id: "a3", user: "Trần Văn Đức (Manager)", action: "Phân công cho Trần Minh Quân (Recruiter)", timestamp: "2024-04-02 08:00", icon: "assign" },
  { id: "a4", user: "Trần Minh Quân", action: "Điều phối 5 ứng viên đợt 1", timestamp: "2024-04-05 10:00", icon: "assign" },
  { id: "a5", user: "Trần Minh Quân", action: "Điều phối thêm 7 ứng viên đợt 2", timestamp: "2024-04-06 15:45", icon: "assign" },
  { id: "a6", user: "Trần Minh Quân", action: "Cập nhật: Bùi Thị Hoa từ chối, cần tìm thay thế", timestamp: "2024-04-07 09:00", icon: "update" },
  { id: "a7", user: "Trần Minh Quân", action: "Điều phối thêm 3 ứng viên đợt 3", timestamp: "2024-04-07 16:30", icon: "assign" },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase()
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr))
}

function getProgressPercent(filled: number, needed: number): number {
  if (needed === 0) return 0
  return Math.min(Math.round((filled / needed) * 100), 100)
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
  const order = MOCK_ORDER
  const statusConf = STATUS_CONFIG[order.status]
  const percent = getProgressPercent(order.quantity_filled, order.quantity_needed)

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
            <BreadcrumbPage>{order.code}</BreadcrumbPage>
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
              <h1 className="text-xl font-bold tracking-tight">{order.code}</h1>
              <Badge
                variant="outline"
                className={`rounded-md text-xs font-medium ${statusConf.className}`}
              >
                {statusConf.label}
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
              {order.position} - {order.client.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Tinh nang dang phat trien")}
          >
            <Pencil className="mr-1.5 h-3.5 w-3.5" />
            Sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success(`Da duyet yeu cau ${order.code}`)}
          >
            <Send className="mr-1.5 h-3.5 w-3.5" />
            Duyệt
          </Button>
          <Button size="sm" onClick={() => navigate("/dispatch")}>
            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
            Phân công
          </Button>
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
                <InfoRow icon={Building} label="Khách hàng" value={order.client.name} />
                <InfoRow icon={Contact} label="Người liên hệ" value={order.client.contact_person} />
                <InfoRow icon={Phone} label="Số điện thoại" value={order.client.phone} />
                <InfoRow icon={Briefcase} label="Vị trí tuyển" value={order.position} />
                <InfoRow icon={Users} label="Số lượng" value={`${order.quantity_needed} người`} />
                <InfoRow icon={DollarSign} label="Mức lương" value={order.salary} />
                <InfoRow icon={MapPin} label="Địa điểm làm việc" value={order.location} />
                <InfoRow icon={CalendarDays} label="Thời gian" value={`${formatDate(order.start_date)} - ${formatDate(order.end_date)}`} />
                <InfoRow icon={Timer} label="Ca làm việc" value={order.shift} />
                <InfoRow icon={Shirt} label="Trang phục" value={order.dress_code} />
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-sm font-semibold">Mô tả công việc</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {order.description}
                </p>
              </div>

              <div>
                <h4 className="mb-2 text-sm font-semibold">Yêu cầu ứng viên</h4>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Giới tính</p>
                    <p className="text-sm font-medium">{order.requirements.gender}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Độ tuổi</p>
                    <p className="text-sm font-medium">{order.requirements.age_range}</p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-3">
                    <p className="text-xs text-muted-foreground">Kỹ năng</p>
                    <p className="text-sm font-medium">{order.requirements.skills}</p>
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
                    {MOCK_WORKERS.length}
                  </Badge>
                </CardTitle>
                <Button size="sm" variant="outline" onClick={() => navigate("/dispatch")}>
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Thêm ứng viên
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {MOCK_WORKERS.length === 0 ? (
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
                    {MOCK_WORKERS.map((worker, index) => {
                      const wsConf = WORKER_STATUS_CONFIG[worker.status]
                      return (
                        <TableRow key={worker.id}>
                          <TableCell className="text-center text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-[10px] font-medium bg-muted">
                                  {getInitials(worker.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{worker.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{worker.phone}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`rounded-md text-[11px] font-medium ${wsConf.className}`}
                            >
                              {wsConf.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(worker.assigned_date)}
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

          {/* Activity Log */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Lịch sử hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {MOCK_ACTIVITIES.map((activity, index) => {
                  const iconConf = ACTIVITY_ICONS[activity.icon]
                  const Icon = iconConf.icon
                  const isLast = index === MOCK_ACTIVITIES.length - 1

                  return (
                    <div key={activity.id} className="relative flex gap-3 pb-6 last:pb-0">
                      {/* Timeline line */}
                      {!isLast && (
                        <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
                      )}
                      {/* Icon */}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconConf.bg}`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${iconConf.color}`} />
                      </div>
                      {/* Content */}
                      <div className="min-w-0 pt-0.5">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-muted-foreground">{activity.action}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {activity.timestamp}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
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
                  Còn thiếu {order.quantity_needed - order.quantity_filled} người
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
                  <span className="text-xs text-muted-foreground">Deadline</span>
                  <span className="text-sm font-medium text-red-600">{formatDate(order.deadline)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Phụ trách</span>
                  <span className="text-sm font-medium">{order.assigned_to}</span>
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
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${order.client.avatar_color} rounded-xl text-xs font-semibold text-white`}
                  >
                    {getInitials(order.client.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{order.client.name}</p>
                  <p className="text-xs text-muted-foreground">{order.client.industry}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{order.client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{order.client.email}</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full" onClick={() => navigate(`/clients/${order.client.id}`)}>
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                Xem chi tiết khách hàng
              </Button>
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
                <span className="text-xs text-muted-foreground">Đơn giá</span>
                <span className="text-sm font-medium">{order.unit_price}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Tổng ước tính</span>
                <span className="text-sm font-bold text-primary">{order.total_estimate}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Thanh toán</span>
                <Badge
                  variant="outline"
                  className="rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border-amber-200/80"
                >
                  {order.payment_status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
