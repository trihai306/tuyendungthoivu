import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Star,
  Phone,
  User,
  Pencil,
  Send,
  Lock,
  MoreHorizontal,
  MapPin,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Briefcase,
  DollarSign,
  ClipboardList,
  BadgeCheck,
  UserPlus,
  FileText,
  Bell,
  KeyRound,
  RefreshCw,
  UserCog,
  Mail,
} from "lucide-react"
import { toast } from "sonner"

// --- Staff types ---

interface StaffMember {
  id: string
  name: string
  avatar: string
  role: "Recruiter" | "Manager" | "Sales"
  phone: string
  email: string
}

const STAFF_MEMBERS: StaffMember[] = [
  { id: "s1", name: "Trần Minh Đức", avatar: "TĐ", role: "Recruiter", phone: "0901111222", email: "duc.tm@company.vn" },
  { id: "s2", name: "Nguyễn Thị Hằng", avatar: "NH", role: "Recruiter", phone: "0902222333", email: "hang.nt@company.vn" },
  { id: "s3", name: "Lê Văn Tuấn", avatar: "LT", role: "Manager", phone: "0903333444", email: "tuan.lv@company.vn" },
  { id: "s4", name: "Phạm Thị Mai", avatar: "PM", role: "Sales", phone: "0904444555", email: "mai.pt@company.vn" },
  { id: "s5", name: "Võ Hoàng Nam", avatar: "VN", role: "Recruiter", phone: "0905555666", email: "nam.vh@company.vn" },
]

const staffRoleConfig = {
  Recruiter: { label: "Recruiter", className: "bg-blue-50 text-blue-700 border-blue-200" },
  Manager: { label: "Manager", className: "bg-violet-50 text-violet-700 border-violet-200" },
  Sales: { label: "Sales", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
} as const

const staffAvatarColors = [
  "from-teal-500 to-teal-600",
  "from-orange-500 to-orange-600",
  "from-fuchsia-500 to-fuchsia-600",
  "from-sky-500 to-sky-600",
  "from-lime-500 to-lime-600",
]

function getStaffAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return staffAvatarColors[Math.abs(hash) % staffAvatarColors.length]
}

// --- Mock data types ---

interface WorkerDetailData {
  id: string
  name: string
  phone: string
  zalo: string
  dateOfBirth: string
  gender: string
  cccd: string
  address: string
  area: string
  skills: string[]
  notes: string
  status: "available" | "working" | "inactive" | "blacklist"
  rating: number
  totalShifts: number
  totalOrders: number
  completionRate: number
  joinDate: string
  currentAssignment: {
    client: string
    position: string
    startDate: string
    endDate: string
  } | null
  finance: {
    monthSalary: number
    paid: number
    remaining: number
  }
}

interface WorkHistory {
  id: string
  orderCode: string
  client: string
  position: string
  period: string
  workDays: number
  rating: number
  note: string
}

interface AttendanceRecord {
  date: string
  checkIn: string
  checkOut: string
  hours: number
  status: "on_time" | "late" | "absent"
}

// --- Config ---

const statusConfig = {
  available: {
    label: "Sẵn sàng",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    largeBg: "bg-emerald-100 text-emerald-800",
  },
  working: {
    label: "Đang làm việc",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    largeBg: "bg-blue-100 text-blue-800",
  },
  inactive: {
    label: "Tạm nghỉ",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    largeBg: "bg-gray-200 text-gray-700",
  },
  blacklist: {
    label: "Blacklist",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    largeBg: "bg-red-100 text-red-800",
  },
}

const attendanceStatusConfig = {
  on_time: { label: "Đúng giờ", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  late: { label: "Trễ", className: "bg-amber-50 text-amber-700 border-amber-200" },
  absent: { label: "Vắng", className: "bg-red-50 text-red-700 border-red-200" },
}

// --- Mock data ---

const mockWorkerDetail: WorkerDetailData = {
  id: "w2",
  name: "Trần Thị Mai",
  phone: "0912345678",
  zalo: "0912345678",
  dateOfBirth: "15/03/1998",
  gender: "Nữ",
  cccd: "079301002345",
  address: "123 Nguyễn Văn Cừ, P.4, Q.5, TP.HCM",
  area: "Thủ Đức",
  skills: ["Phục vụ", "Đóng gói", "Bốc xếp"],
  notes: "Làm việc chăm chỉ, hay đến sớm. Ưu tiên ca sáng.",
  status: "working",
  rating: 4.2,
  totalShifts: 89,
  totalOrders: 15,
  completionRate: 92,
  joinDate: "12/01/2024",
  currentAssignment: {
    client: "Công ty TNHH ABC Food",
    position: "Phục vụ tiệc",
    startDate: "01/04/2026",
    endDate: "15/04/2026",
  },
  finance: {
    monthSalary: 5400000,
    paid: 3600000,
    remaining: 1800000,
  },
}

const mockWorkHistory: WorkHistory[] = [
  {
    id: "wh1",
    orderCode: "DH-2026-042",
    client: "Công ty TNHH ABC Food",
    position: "Phục vụ tiệc",
    period: "01/04 - 15/04/2026",
    workDays: 12,
    rating: 4.5,
    note: "Làm việc tốt",
  },
  {
    id: "wh2",
    orderCode: "DH-2026-035",
    client: "Nhà hàng Hải Sản Biển Đông",
    position: "Phục vụ",
    period: "15/03 - 28/03/2026",
    workDays: 10,
    rating: 4.0,
    note: "Hoàn thành nhiệm vụ",
  },
  {
    id: "wh3",
    orderCode: "DH-2026-028",
    client: "Siêu thị BigC Tân Phú",
    position: "Đóng gói hàng hóa",
    period: "01/03 - 10/03/2026",
    workDays: 8,
    rating: 4.8,
    note: "Xuất sắc, KH khen",
  },
  {
    id: "wh4",
    orderCode: "DH-2026-019",
    client: "Kho Vận Chuyển Express",
    position: "Bốc xếp",
    period: "10/02 - 20/02/2026",
    workDays: 9,
    rating: 3.5,
    note: "Đến trễ 2 lần",
  },
  {
    id: "wh5",
    orderCode: "DH-2026-012",
    client: "Công ty Tổ Chức Sự Kiện StarLight",
    position: "Phục vụ sự kiện",
    period: "25/01 - 30/01/2026",
    workDays: 5,
    rating: 4.2,
    note: "",
  },
  {
    id: "wh6",
    orderCode: "DH-2025-098",
    client: "Nhà máy Samsung HCMC",
    position: "Đóng gói",
    period: "01/12 - 25/12/2025",
    workDays: 20,
    rating: 4.6,
    note: "Worker tốt, dễ làm việc",
  },
]

const mockAttendance: AttendanceRecord[] = [
  { date: "07/04/2026", checkIn: "07:55", checkOut: "17:05", hours: 8, status: "on_time" },
  { date: "06/04/2026", checkIn: "07:50", checkOut: "17:10", hours: 8, status: "on_time" },
  { date: "05/04/2026", checkIn: "08:15", checkOut: "17:00", hours: 8, status: "late" },
  { date: "04/04/2026", checkIn: "07:58", checkOut: "17:02", hours: 8, status: "on_time" },
  { date: "03/04/2026", checkIn: "—", checkOut: "—", hours: 0, status: "absent" },
  { date: "02/04/2026", checkIn: "07:45", checkOut: "17:00", hours: 8, status: "on_time" },
  { date: "01/04/2026", checkIn: "07:52", checkOut: "17:08", hours: 8, status: "on_time" },
]

// --- Helpers ---

const avatarColors = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
]

function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase()
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

function renderMiniStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

// --- Info Row ---

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  )
}

// --- Main ---

// --- Create Account Dialog for Detail page ---
function CreateAccountDetailDialog({
  open,
  onOpenChange,
  workerName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workerName: string
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleCreate() {
    const errs: Record<string, string> = {}
    if (!email.trim()) errs.email = "Vui lòng nhập email"
    if (!password.trim()) errs.password = "Vui lòng nhập mật khẩu"
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    toast.success("Đã tạo tài khoản và gửi thông tin đăng nhập qua email")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>
            Tạo tài khoản đăng nhập cho ứng viên <strong>{workerName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="detail-acc-email">Email <span className="text-destructive">*</span></Label>
            <Input
              id="detail-acc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="detail-acc-password">Mật khẩu <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Input
                id="detail-acc-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  const chars = "abcdefghijkmnpqrstuvwxyz23456789"
                  let pwd = ""
                  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
                  setPassword(pwd)
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Vai trò</Label>
            <Input value="Worker (Ứng viên)" disabled />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button onClick={handleCreate} className="gap-1.5">
            <KeyRound className="h-4 w-4" />
            Tạo & gửi email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Change Staff Dialog ---

function ChangeStaffDialog({
  open,
  onOpenChange,
  currentStaffId,
  onAssign,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStaffId: string | null
  onAssign: (staffId: string) => void
}) {
  const [selectedStaff, setSelectedStaff] = useState("")

  // Show current assignment info
  const currentStaff = currentStaffId ? STAFF_MEMBERS.find((s) => s.id === currentStaffId) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phân công người phụ trách</DialogTitle>
          <DialogDescription>
            Chọn nhân viên nội bộ chịu trách nhiệm quản lý ứng viên này.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {currentStaff && (
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground mb-2">Hiện tại đang phân công cho:</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(currentStaff.id)} text-[10px] font-semibold text-white`}>
                    {currentStaff.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{currentStaff.name}</p>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${staffRoleConfig[currentStaff.role].className}`}>
                    {staffRoleConfig[currentStaff.role].label}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>{currentStaff ? "Đổi sang người phụ trách mới" : "Người phụ trách"}</Label>
            <Select value={selectedStaff} onValueChange={(val) => setSelectedStaff(val ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn người phụ trách" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_MEMBERS.map((staff) => {
                  const roleConf = staffRoleConfig[staff.role]
                  return (
                    <SelectItem key={staff.id} value={staff.id}>
                      <span className="flex items-center gap-2">
                        {staff.name}
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${roleConf.className}`}>
                          {roleConf.label}
                        </Badge>
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedStaff && (() => {
            const staff = STAFF_MEMBERS.find((s) => s.id === selectedStaff)
            if (!staff) return null
            const roleConf = staffRoleConfig[staff.role]
            return (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(staff.id)} text-xs font-semibold text-white`}>
                    {staff.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{staff.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${roleConf.className}`}>
                      {roleConf.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{staff.phone}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button
            disabled={!selectedStaff}
            onClick={() => {
              if (selectedStaff) {
                onAssign(selectedStaff)
                onOpenChange(false)
              }
            }}
            className="gap-1.5"
          >
            <UserCog className="h-4 w-4" />
            Phân công
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function WorkerDetail() {
  const { id } = useParams<{ id: string }>()
  const [createAccountOpen, setCreateAccountOpen] = useState(false)
  const [changeStaffOpen, setChangeStaffOpen] = useState(false)
  const [assignedStaffId, setAssignedStaffId] = useState<string | null>("s2")

  // In production, fetch by id. For now, use mock data.
  const worker = mockWorkerDetail
  const config = statusConfig[worker.status]
  const navigate = useNavigate()
  const hasAccount = worker.id === "w1" || worker.id === "w2" // Workers with email accounts

  // Totals from work history
  const totalWorkDays = mockWorkHistory.reduce((sum, wh) => sum + wh.workDays, 0)
  const totalOrders = mockWorkHistory.length

  void id // suppress unused warning

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
            <BreadcrumbLink render={<Link to="/workers" />}>
              Ứng viên
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{worker.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 shadow-lg">
            <AvatarFallback
              className={`bg-gradient-to-br ${getAvatarColor(worker.id)} text-lg font-bold text-white`}
            >
              {getInitials(worker.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {worker.name}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${config.className}`}
              >
                <span
                  className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${config.dot}`}
                />
                {config.label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Mã ứng viên: {worker.id} &middot; Tham gia từ {worker.joinDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5" onClick={() => toast.info("Tính năng đang phát triển")}>
            <Pencil className="h-4 w-4" />
            Sửa
          </Button>
          {!hasAccount && (
            <Button variant="outline" className="gap-1.5" onClick={() => setCreateAccountOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Tạo tài khoản
            </Button>
          )}
          <Button className="gap-1.5" onClick={() => navigate("/dispatch")}>
            <Send className="h-4 w-4" />
            Điều phối
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {!hasAccount && (
                  <DropdownMenuItem onClick={() => setCreateAccountOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tạo tài khoản
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {
                  toast.loading("Đang xuất hồ sơ...", { id: "export-profile" })
                  setTimeout(() => toast.success(`Đã xuất hồ sơ ${worker.name} thành công`, { id: "export-profile" }), 1000)
                }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Xuất hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Đã gửi thông báo đến ứng viên")}>
                  <Bell className="mr-2 h-4 w-4" />
                  Gửi thông báo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Đã tạm khóa ứng viên")}>
                  <Lock className="mr-2 h-4 w-4" />
                  Tạm khóa
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content 2 columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <User className="h-4 w-4 text-primary" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-x-6 sm:grid-cols-2">
                <InfoRow icon={User} label="Họ tên" value={worker.name} />
                <InfoRow
                  icon={CalendarDays}
                  label="Ngày sinh"
                  value={worker.dateOfBirth}
                />
                <InfoRow icon={User} label="Giới tính" value={worker.gender} />
                <InfoRow
                  icon={CreditCard}
                  label="CCCD/CMND"
                  value={worker.cccd}
                />
                <InfoRow icon={Phone} label="SĐT" value={worker.phone} />
                <InfoRow icon={Phone} label="Zalo" value={worker.zalo} />
                <InfoRow
                  icon={MapPin}
                  label="Địa chỉ"
                  value={worker.address}
                />
                <InfoRow icon={MapPin} label="Khu vực" value={worker.area} />
              </div>

              <Separator className="my-4" />

              {/* Skills */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Kỹ năng
                </p>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {worker.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ghi chú đặc biệt
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {worker.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Work History */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Briefcase className="h-4 w-4 text-primary" />
                Lịch sử làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Yêu cầu TD</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-center">Ngày công</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockWorkHistory.map((wh) => (
                    <TableRow key={wh.id}>
                      <TableCell className="text-xs font-mono text-primary">
                        {wh.orderCode}
                      </TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">
                        {wh.client}
                      </TableCell>
                      <TableCell className="text-sm">{wh.position}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {wh.period}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {wh.workDays}
                      </TableCell>
                      <TableCell>{renderMiniStars(wh.rating)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[140px] truncate">
                        {wh.note || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="border-t bg-muted/30 px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Tổng:{" "}
                  <span className="font-semibold text-foreground">
                    {totalWorkDays} ngày công
                  </span>{" "}
                  &middot;{" "}
                  <span className="font-semibold text-foreground">
                    {totalOrders} yêu cầu
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attendance */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <ClipboardList className="h-4 w-4 text-primary" />
                Chấm công gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead className="text-center">Giờ làm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendance.map((record) => {
                    const attConfig = attendanceStatusConfig[record.status]
                    return (
                      <TableRow key={record.date}>
                        <TableCell className="text-sm font-medium">
                          {record.date}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.checkIn}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.checkOut}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {record.hours > 0 ? `${record.hours}h` : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] font-medium ${attConfig.className}`}
                          >
                            {record.status === "on_time" && (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            )}
                            {record.status === "late" && (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {record.status === "absent" && (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {attConfig.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Overview */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" />
                Tổng quan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Trạng thái hiện tại
                </span>
                <Badge className={`text-sm font-semibold px-3 py-1 ${config.largeBg}`}>
                  {config.label}
                </Badge>
              </div>
              <Separator />

              {/* Rating */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Đánh giá trung bình
                </span>
                <div className="flex items-center gap-2">
                  {renderStars(worker.rating)}
                  <span className="text-sm font-bold">
                    {worker.rating.toFixed(1)}/5
                  </span>
                </div>
              </div>
              <Separator />

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {worker.totalShifts}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Tổng ngày công
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {worker.totalOrders}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Tổng YCTD
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xl font-bold text-emerald-600">
                    {worker.completionRate}%
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Tỷ lệ hoàn thành
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-sm font-bold text-foreground">
                    {worker.joinDate}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Ngày tham gia pool
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Staff */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <UserCog className="h-4 w-4 text-orange-600" />
                Người phụ trách
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const staff = assignedStaffId ? STAFF_MEMBERS.find((s) => s.id === assignedStaffId) : null
                if (!staff) {
                  return (
                    <div className="flex flex-col items-center py-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 mb-3">
                        <UserCog className="h-6 w-6 text-orange-400" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chưa phân công người phụ trách
                      </p>
                      <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setChangeStaffOpen(true)}>
                        <UserCog className="h-3.5 w-3.5" />
                        Phân công
                      </Button>
                    </div>
                  )
                }
                const roleConf = staffRoleConfig[staff.role]
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 shadow-md">
                        <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(staff.id)} text-sm font-bold text-white`}>
                          {staff.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{staff.name}</p>
                        <Badge variant="outline" className={`mt-0.5 text-[10px] px-1.5 py-0 ${roleConf.className}`}>
                          {roleConf.label}
                        </Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{staff.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-1.5"
                      onClick={() => setChangeStaffOpen(true)}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Đổi người phụ trách
                    </Button>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Current Assignment */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <BadgeCheck className="h-4 w-4 text-blue-600" />
                Đang làm việc tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worker.currentAssignment ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Khách hàng</p>
                    <p className="text-sm font-semibold">
                      {worker.currentAssignment.client}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vị trí</p>
                    <p className="text-sm font-medium">
                      {worker.currentAssignment.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Thời gian</p>
                    <p className="text-sm">
                      {worker.currentAssignment.startDate} &mdash;{" "}
                      {worker.currentAssignment.endDate}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hiện không có assignment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Finance */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Tài chính
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Lương tháng này
                </span>
                <span className="text-sm font-bold">
                  {formatCurrency(worker.finance.monthSalary)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Đã thanh toán
                </span>
                <span className="text-sm font-semibold text-emerald-600">
                  {formatCurrency(worker.finance.paid)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Còn lại</span>
                <span className="text-sm font-semibold text-amber-600">
                  {formatCurrency(worker.finance.remaining)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="pt-1">
                <div className="h-2 w-full rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{
                      width: `${(worker.finance.paid / worker.finance.monthSalary) * 100}%`,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground text-right">
                  {Math.round(
                    (worker.finance.paid / worker.finance.monthSalary) * 100
                  )}
                  % đã thanh toán
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Account Dialog */}
      <CreateAccountDetailDialog
        open={createAccountOpen}
        onOpenChange={setCreateAccountOpen}
        workerName={worker.name}
      />

      {/* Change Staff Dialog */}
      <ChangeStaffDialog
        open={changeStaffOpen}
        onOpenChange={setChangeStaffOpen}
        currentStaffId={assignedStaffId}
        onAssign={(staffId) => {
          setAssignedStaffId(staffId)
          const staff = STAFF_MEMBERS.find((s) => s.id === staffId)
          toast.success(`Đã phân công ${staff?.name ?? ""} phụ trách ứng viên ${worker.name}`)
        }}
      />
    </div>
  )
}
