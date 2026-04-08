import { useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { toast } from "sonner"
import {
  Search,
  Clock,
  UserCheck,
  Users,
  Download,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  MapPin,
  Building2,
  ChevronLeft,
  CalendarDays,
  ClipboardList,
  AlertTriangle,
  Timer,
  ChevronsUpDown,
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Minus,
} from "lucide-react"

// ---- Types ----

type AttendanceStatus = "on_time" | "late" | "absent" | "not_checked_in" | "working"
type WeekDayStatus = "present" | "late" | "absent" | "off" | "pending"

interface Worker {
  id: string
  name: string
  phone: string
  avatar?: string
}

interface WorkerAttendance {
  worker: Worker
  checkIn: string | null
  checkOut: string | null
  hoursWorked: string | null
  status: AttendanceStatus
  lateMinutes?: number
}

interface JobOrder {
  id: string
  code: string
  client: string
  position: string
  address: string
  shift: string
  shiftTime: string
  dateRange: string
  totalWorkers: number
  workers: WorkerAttendance[]
}

interface WeeklyWorkerRow {
  worker: Worker
  days: WeekDayStatus[]
  totalDays: number
}

interface MonthlyRow {
  worker: Worker
  orderCode: string
  totalDays: number
  onTimeDays: number
  lateDays: number
  absentDays: number
  totalHours: string
  rating: "good" | "average" | "poor"
}

// ---- Config ----

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ReactNode; className: string }> = {
  on_time: {
    label: "Đúng giờ",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  late: {
    label: "Trễ",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  absent: {
    label: "Vắng",
    icon: <XCircle className="h-3.5 w-3.5" />,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  not_checked_in: {
    label: "Chưa check-in",
    icon: <Minus className="h-3.5 w-3.5" />,
    className: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
  working: {
    label: "Đang làm",
    icon: <Timer className="h-3.5 w-3.5" />,
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
}

const ratingConfig = {
  good: { label: "Tốt", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  average: { label: "Trung bình", className: "bg-amber-50 text-amber-700 border-amber-200" },
  poor: { label: "Kém", className: "bg-red-50 text-red-700 border-red-200" },
}

// ---- Mock Data ----

const mockOrders: JobOrder[] = [
  {
    id: "1",
    code: "ORD-024",
    client: "Cty TNHH Thực phẩm Việt",
    position: "Phục vụ nhà hàng",
    address: "123 Nguyễn Huệ, Q1",
    shift: "Ca sáng",
    shiftTime: "06:00 - 14:00",
    dateRange: "01/04 - 15/04/2026",
    totalWorkers: 5,
    workers: [
      { worker: { id: "w1", name: "Nguyễn Văn An", phone: "0901001001" }, checkIn: "05:55", checkOut: "14:05", hoursWorked: "8h10", status: "on_time" },
      { worker: { id: "w2", name: "Trần Thị Bình", phone: "0901001002" }, checkIn: "06:02", checkOut: "14:00", hoursWorked: "7h58", status: "on_time" },
      { worker: { id: "w3", name: "Lê Văn Cường", phone: "0901001003" }, checkIn: "06:20", checkOut: null, hoursWorked: null, status: "late", lateMinutes: 20 },
      { worker: { id: "w4", name: "Phạm Thị Dung", phone: "0901001004" }, checkIn: "05:50", checkOut: "14:10", hoursWorked: "8h20", status: "on_time" },
      { worker: { id: "w5", name: "Hoàng Văn Em", phone: "0901001005" }, checkIn: "06:01", checkOut: null, hoursWorked: null, status: "working" },
    ],
  },
  {
    id: "2",
    code: "ORD-025",
    client: "Nhà máy Samsung HCMC",
    position: "Công nhân đóng gói",
    address: "KCN Bình Dương III",
    shift: "Ca sáng",
    shiftTime: "07:00 - 16:00",
    dateRange: "01/04 - 30/04/2026",
    totalWorkers: 10,
    workers: [
      { worker: { id: "w6", name: "Võ Thị Hồng", phone: "0901002001" }, checkIn: "06:50", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w7", name: "Đỗ Quang Vinh", phone: "0901002002" }, checkIn: "06:55", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w8", name: "Bùi Thị Lan", phone: "0901002003" }, checkIn: "06:58", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w9", name: "Hoàng Đức Thắng", phone: "0901002004" }, checkIn: "07:00", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w10", name: "Nguyễn Thị Thanh", phone: "0901002005" }, checkIn: "06:52", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w11", name: "Lý Văn Đạt", phone: "0901002006" }, checkIn: "07:05", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w12", name: "Trương Quốc Bảo", phone: "0901002007" }, checkIn: "06:48", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w13", name: "Phan Thị Ngọc", phone: "0901002008" }, checkIn: "07:15", checkOut: null, hoursWorked: null, status: "late", lateMinutes: 15 },
      { worker: { id: "w14", name: "Cao Minh Quân", phone: "0901002009" }, checkIn: null, checkOut: null, hoursWorked: null, status: "absent" },
      { worker: { id: "w15", name: "Đinh Thị Hoa", phone: "0901002010" }, checkIn: "06:55", checkOut: null, hoursWorked: null, status: "working" },
    ],
  },
  {
    id: "3",
    code: "ORD-026",
    client: "Cty CP Sự kiện Galaxy",
    position: "Phục vụ sự kiện",
    address: "GEM Center, Q1",
    shift: "Ca chiều",
    shiftTime: "16:00 - 23:00",
    dateRange: "08/04/2026",
    totalWorkers: 12,
    workers: [
      { worker: { id: "w16", name: "Huỳnh Thanh Sơn", phone: "0901003001" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w17", name: "Ngô Văn Phúc", phone: "0901003002" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w18", name: "Đặng Thị Yến", phone: "0901003003" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w19", name: "Vũ Đình Khoa", phone: "0901003004" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w20", name: "Mai Thị Loan", phone: "0901003005" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w21", name: "Trịnh Văn Hào", phone: "0901003006" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w22", name: "Lương Thị Nga", phone: "0901003007" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w23", name: "Tạ Văn Lâm", phone: "0901003008" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w24", name: "Dương Thị Tâm", phone: "0901003009" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w25", name: "Châu Văn Minh", phone: "0901003010" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w26", name: "Lạc Thị Hương", phone: "0901003011" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w27", name: "Tôn Văn Tài", phone: "0901003012" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
    ],
  },
  {
    id: "4",
    code: "ORD-027",
    client: "Kho vận Lazada Express",
    position: "Bốc xếp hàng",
    address: "Q. Bình Tân",
    shift: "Ca sáng",
    shiftTime: "06:00 - 14:00",
    dateRange: "05/04 - 12/04/2026",
    totalWorkers: 5,
    workers: [
      { worker: { id: "w28", name: "Nguyễn Minh Trí", phone: "0901004001" }, checkIn: "05:50", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w29", name: "Lê Thị Phương", phone: "0901004002" }, checkIn: "05:58", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w30", name: "Trần Văn Đức", phone: "0901004003" }, checkIn: "06:00", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w31", name: "Phạm Quốc Hùng", phone: "0901004004" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
      { worker: { id: "w32", name: "Võ Văn Tài", phone: "0901004005" }, checkIn: null, checkOut: null, hoursWorked: null, status: "not_checked_in" },
    ],
  },
  {
    id: "5",
    code: "ORD-028",
    client: "Siêu thị BigC Tân Phú",
    position: "Nhân viên kho",
    address: "Q. Tân Phú",
    shift: "Ca hành chính",
    shiftTime: "08:00 - 17:00",
    dateRange: "01/04 - 20/04/2026",
    totalWorkers: 6,
    workers: [
      { worker: { id: "w33", name: "Đỗ Văn Thành", phone: "0901005001" }, checkIn: "07:50", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w34", name: "Bùi Thị Mai", phone: "0901005002" }, checkIn: "07:55", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w35", name: "Hoàng Minh Tú", phone: "0901005003" }, checkIn: "07:58", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w36", name: "Nguyễn Thị Hiền", phone: "0901005004" }, checkIn: "07:45", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w37", name: "Lê Quốc Anh", phone: "0901005005" }, checkIn: "07:52", checkOut: null, hoursWorked: null, status: "working" },
      { worker: { id: "w38", name: "Trần Văn Long", phone: "0901005006" }, checkIn: "07:59", checkOut: null, hoursWorked: null, status: "working" },
    ],
  },
]

// Weekly mock data for ORD-024
const mockWeeklyData: Record<string, WeeklyWorkerRow[]> = {
  "ORD-024": [
    { worker: { id: "w1", name: "Nguyễn Văn An", phone: "0901001001" }, days: ["present", "present", "present", "late", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w2", name: "Trần Thị Bình", phone: "0901001002" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w3", name: "Lê Văn Cường", phone: "0901001003" }, days: ["late", "present", "absent", "present", "late", "present", "off"], totalDays: 4 },
    { worker: { id: "w4", name: "Phạm Thị Dung", phone: "0901001004" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w5", name: "Hoàng Văn Em", phone: "0901001005" }, days: ["present", "present", "present", "present", "present", "off", "off"], totalDays: 5 },
  ],
  "ORD-025": [
    { worker: { id: "w6", name: "Võ Thị Hồng", phone: "0901002001" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w7", name: "Đỗ Quang Vinh", phone: "0901002002" }, days: ["present", "present", "late", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w8", name: "Bùi Thị Lan", phone: "0901002003" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w9", name: "Hoàng Đức Thắng", phone: "0901002004" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w10", name: "Nguyễn Thị Thanh", phone: "0901002005" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w11", name: "Lý Văn Đạt", phone: "0901002006" }, days: ["present", "late", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w12", name: "Trương Quốc Bảo", phone: "0901002007" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
    { worker: { id: "w13", name: "Phan Thị Ngọc", phone: "0901002008" }, days: ["late", "present", "late", "present", "late", "present", "off"], totalDays: 6 },
    { worker: { id: "w14", name: "Cao Minh Quân", phone: "0901002009" }, days: ["absent", "present", "absent", "present", "absent", "present", "off"], totalDays: 3 },
    { worker: { id: "w15", name: "Đinh Thị Hoa", phone: "0901002010" }, days: ["present", "present", "present", "present", "present", "present", "off"], totalDays: 6 },
  ],
  "ORD-027": [
    { worker: { id: "w28", name: "Nguyễn Minh Trí", phone: "0901004001" }, days: ["present", "present", "present", "present", "pending", "pending", "off"], totalDays: 4 },
    { worker: { id: "w29", name: "Lê Thị Phương", phone: "0901004002" }, days: ["present", "present", "present", "present", "pending", "pending", "off"], totalDays: 4 },
    { worker: { id: "w30", name: "Trần Văn Đức", phone: "0901004003" }, days: ["present", "present", "late", "present", "pending", "pending", "off"], totalDays: 4 },
    { worker: { id: "w31", name: "Phạm Quốc Hùng", phone: "0901004004" }, days: ["present", "absent", "present", "present", "pending", "pending", "off"], totalDays: 3 },
    { worker: { id: "w32", name: "Võ Văn Tài", phone: "0901004005" }, days: ["present", "present", "present", "late", "pending", "pending", "off"], totalDays: 4 },
  ],
  "ORD-028": [
    { worker: { id: "w33", name: "Đỗ Văn Thành", phone: "0901005001" }, days: ["present", "present", "present", "present", "present", "off", "off"], totalDays: 5 },
    { worker: { id: "w34", name: "Bùi Thị Mai", phone: "0901005002" }, days: ["present", "present", "present", "present", "present", "off", "off"], totalDays: 5 },
    { worker: { id: "w35", name: "Hoàng Minh Tú", phone: "0901005003" }, days: ["present", "present", "present", "present", "present", "off", "off"], totalDays: 5 },
    { worker: { id: "w36", name: "Nguyễn Thị Hiền", phone: "0901005004" }, days: ["present", "present", "present", "present", "present", "off", "off"], totalDays: 5 },
    { worker: { id: "w37", name: "Lê Quốc Anh", phone: "0901005005" }, days: ["present", "present", "late", "present", "present", "off", "off"], totalDays: 5 },
    { worker: { id: "w38", name: "Trần Văn Long", phone: "0901005006" }, days: ["present", "present", "present", "present", "present", "off", "off"], totalDays: 5 },
  ],
}

// Monthly mock data
const mockMonthlyData: MonthlyRow[] = [
  { worker: { id: "w1", name: "Nguyễn Văn An", phone: "0901001001" }, orderCode: "ORD-024", totalDays: 7, onTimeDays: 6, lateDays: 1, absentDays: 0, totalHours: "56h20", rating: "good" },
  { worker: { id: "w2", name: "Trần Thị Bình", phone: "0901001002" }, orderCode: "ORD-024", totalDays: 7, onTimeDays: 7, lateDays: 0, absentDays: 0, totalHours: "56h00", rating: "good" },
  { worker: { id: "w3", name: "Lê Văn Cường", phone: "0901001003" }, orderCode: "ORD-024", totalDays: 5, onTimeDays: 2, lateDays: 2, absentDays: 1, totalHours: "39h40", rating: "average" },
  { worker: { id: "w4", name: "Phạm Thị Dung", phone: "0901001004" }, orderCode: "ORD-024", totalDays: 7, onTimeDays: 7, lateDays: 0, absentDays: 0, totalHours: "57h10", rating: "good" },
  { worker: { id: "w5", name: "Hoàng Văn Em", phone: "0901001005" }, orderCode: "ORD-024", totalDays: 6, onTimeDays: 6, lateDays: 0, absentDays: 0, totalHours: "48h30", rating: "good" },
  { worker: { id: "w6", name: "Võ Thị Hồng", phone: "0901002001" }, orderCode: "ORD-025", totalDays: 7, onTimeDays: 7, lateDays: 0, absentDays: 0, totalHours: "63h00", rating: "good" },
  { worker: { id: "w13", name: "Phan Thị Ngọc", phone: "0901002008" }, orderCode: "ORD-025", totalDays: 6, onTimeDays: 3, lateDays: 3, absentDays: 0, totalHours: "53h20", rating: "average" },
  { worker: { id: "w14", name: "Cao Minh Quân", phone: "0901002009" }, orderCode: "ORD-025", totalDays: 4, onTimeDays: 4, lateDays: 0, absentDays: 3, totalHours: "36h00", rating: "poor" },
  { worker: { id: "w33", name: "Đỗ Văn Thành", phone: "0901005001" }, orderCode: "ORD-028", totalDays: 6, onTimeDays: 6, lateDays: 0, absentDays: 0, totalHours: "54h00", rating: "good" },
  { worker: { id: "w37", name: "Lê Quốc Anh", phone: "0901005005" }, orderCode: "ORD-028", totalDays: 6, onTimeDays: 5, lateDays: 1, absentDays: 0, totalHours: "53h40", rating: "good" },
]

// ---- Helpers ----

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function getOrderStats(order: JobOrder) {
  const checkedIn = order.workers.filter((w) => w.checkIn !== null).length
  const onTime = order.workers.filter((w) => w.status === "on_time" || w.status === "working").length
  const late = order.workers.filter((w) => w.status === "late").length
  const absent = order.workers.filter((w) => w.status === "absent").length
  const notCheckedIn = order.workers.filter((w) => w.status === "not_checked_in").length

  // Calculate total hours for workers who have completed
  const completedWorkers = order.workers.filter((w) => w.hoursWorked !== null)
  const totalHoursStr = completedWorkers.length > 0
    ? completedWorkers.reduce((acc, w) => {
        if (!w.hoursWorked) return acc
        const match = w.hoursWorked.match(/(\d+)h(\d+)/)
        if (match) return acc + parseInt(match[1]) * 60 + parseInt(match[2])
        return acc
      }, 0)
    : 0
  const totalHours = totalHoursStr > 0
    ? `${Math.floor(totalHoursStr / 60)}h${String(totalHoursStr % 60).padStart(2, "0")}`
    : null

  const onTimeRate = checkedIn > 0 ? Math.round((onTime / checkedIn) * 100) : 0

  return { checkedIn, onTime, late, absent, notCheckedIn, totalHours, onTimeRate }
}

// ---- Subcomponents ----

function StatusBadge({ status, lateMinutes }: { status: AttendanceStatus; lateMinutes?: number }) {
  const config = statusConfig[status]
  const label = status === "on_time"
    ? "Đúng giờ"
    : status === "late"
      ? `Trễ ${lateMinutes ?? 0}p`
      : status === "absent"
        ? "Vắng"
        : status === "working"
          ? "Đang làm"
          : "Chưa check-in"

  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      {config.icon}
      {label}
    </Badge>
  )
}

function WeekDayCellIcon({ status }: { status: WeekDayStatus }) {
  switch (status) {
    case "present":
      return <CheckCircle2 className="h-4 w-4 text-emerald-600" />
    case "late":
      return <AlertCircle className="h-4 w-4 text-amber-500" />
    case "absent":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "off":
      return <Minus className="h-4 w-4 text-gray-300" />
    case "pending":
      return <Clock className="h-4 w-4 text-blue-400" />
    default:
      return <Minus className="h-4 w-4 text-gray-300" />
  }
}

// ---- Order Attendance Card ----

function OrderCard({
  order,
  isExpanded,
  onToggle,
  searchQuery,
  onCheckAll,
  onNavigateToOrder,
}: {
  order: JobOrder
  isExpanded: boolean
  onToggle: () => void
  searchQuery: string
  onCheckAll: (orderId: string) => void
  onNavigateToOrder: (orderId: string) => void
}) {
  const stats = getOrderStats(order)

  // Filter workers by search
  const filteredWorkers = searchQuery
    ? order.workers.filter((w) =>
        w.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.worker.phone.includes(searchQuery)
      )
    : order.workers

  // If searching and no workers match, hide the card
  if (searchQuery && filteredWorkers.length === 0) return null

  const handleCheckAll = () => {
    onCheckAll(order.id)
  }

  const handleExport = () => {
    // Build text data for clipboard
    const header = `Bảng công ${order.code} - ${order.client} - ${order.position}`
    const rows = order.workers.map((wa) => {
      const statusLabel =
        wa.status === "on_time" ? "Đúng giờ" :
        wa.status === "late" ? `Trễ ${wa.lateMinutes ?? 0}p` :
        wa.status === "absent" ? "Vắng" :
        wa.status === "working" ? "Đang làm" : "Chưa check-in"
      return `${wa.worker.name}\t${wa.worker.phone}\t${wa.checkIn ?? "--:--"}\t${wa.checkOut ?? "--:--"}\t${wa.hoursWorked ?? "--"}\t${statusLabel}`
    })
    const text = [header, "Tên\tSĐT\tCheck-in\tCheck-out\tGiờ làm\tTrạng thái", ...rows].join("\n")
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã copy bảng công ${order.code} vào clipboard`)
    }).catch(() => {
      toast.error("Không thể copy vào clipboard")
    })
  }

  return (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full text-left">
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="mt-0.5 shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="font-mono text-xs shrink-0">
                      {order.code}
                    </Badge>
                    <span className="font-semibold text-sm truncate">{order.client}</span>
                    <Separator orientation="vertical" className="h-4 hidden sm:block" />
                    <span className="text-sm text-muted-foreground truncate">{order.position}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {order.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {order.shift}: {order.shiftTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {order.dateRange}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium">{stats.checkedIn}/{order.totalWorkers}</span>
                </div>
                {stats.late > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="font-medium text-amber-600">{stats.late}</span>
                  </div>
                )}
                {stats.absent > 0 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-600">{stats.absent}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <Separator className="mb-4" />

            {/* Workers table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[250px]">Ứng viên</TableHead>
                    <TableHead className="w-[100px] text-center">Check-in</TableHead>
                    <TableHead className="w-[100px] text-center">Check-out</TableHead>
                    <TableHead className="w-[100px] text-center">Giờ làm</TableHead>
                    <TableHead className="w-[140px] text-center">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkers.map((wa) => (
                    <TableRow key={wa.worker.id}>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {getInitials(wa.worker.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-tight">{wa.worker.name}</p>
                            <p className="text-xs text-muted-foreground">{wa.worker.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-sm font-mono ${wa.checkIn ? "text-foreground" : "text-muted-foreground"}`}>
                          {wa.checkIn ?? "--:--"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-sm font-mono ${wa.checkOut ? "text-foreground" : "text-muted-foreground"}`}>
                          {wa.checkOut ?? "--:--"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`text-sm font-mono ${wa.hoursWorked ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {wa.hoursWorked ?? "--"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <StatusBadge status={wa.status} lateMinutes={wa.lateMinutes} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Footer summary & actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  <strong className="text-foreground">{order.totalWorkers}</strong> ứng viên
                </span>
                {stats.totalHours && (
                  <span>
                    <strong className="text-foreground">{stats.totalHours}</strong> giờ công
                  </span>
                )}
                <span>
                  Tỷ lệ đúng giờ: <strong className={stats.onTimeRate >= 80 ? "text-emerald-600" : "text-amber-600"}>{stats.onTimeRate}%</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleCheckAll}>
                  <Check className="h-3.5 w-3.5" />
                  Chấm công tất cả
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs" onClick={handleExport}>
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  Xuất bảng công
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 h-8 text-xs" onClick={() => onNavigateToOrder(order.id)}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  Xem YCTD
                </Button>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

// ---- Main Component ----

export function AttendanceList() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<JobOrder[]>(mockOrders)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 8)) // April 8, 2026
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set(["1", "2"]))
  const [weeklySelectedOrder, setWeeklySelectedOrder] = useState("ORD-024")

  // Navigate date
  const goToPrevDay = () => {
    setCurrentDate((d) => {
      const next = new Date(d)
      next.setDate(next.getDate() - 1)
      return next
    })
  }
  const goToNextDay = () => {
    setCurrentDate((d) => {
      const next = new Date(d)
      next.setDate(next.getDate() + 1)
      return next
    })
  }
  const goToToday = () => setCurrentDate(new Date(2026, 3, 8))

  // Toggle expand
  const toggleOrder = (id: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => setExpandedOrders(new Set(orders.map((o) => o.id)))
  const collapseAll = () => setExpandedOrders(new Set())

  // Filter orders by status
  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders
    return orders.filter((order) => {
      const stats = getOrderStats(order)
      switch (statusFilter) {
        case "has_late":
          return stats.late > 0
        case "has_absent":
          return stats.absent > 0
        case "all_on_time":
          return stats.late === 0 && stats.absent === 0 && stats.checkedIn === order.totalWorkers
        case "pending":
          return stats.notCheckedIn > 0
        default:
          return true
      }
    })
  }, [statusFilter, orders])

  // Handle check all workers in an order
  const handleCheckAll = useCallback((orderId: string) => {
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order
        return {
          ...order,
          workers: order.workers.map((wa) => {
            if (wa.status === "on_time" || wa.status === "working") return wa // Already checked in
            if (wa.status === "absent") return wa // Keep absent as-is
            return {
              ...wa,
              checkIn: wa.checkIn ?? timeStr,
              status: "on_time" as AttendanceStatus,
            }
          }),
        }
      })
    )
    const order = orders.find((o) => o.id === orderId)
    toast.success(`Đã chấm công tất cả ứng viên cho ${order?.code ?? orderId}`)
  }, [orders])

  // Handle navigate to order detail
  const handleNavigateToOrder = useCallback((orderId: string) => {
    navigate(`/orders/${orderId}`)
  }, [navigate])

  // Global stats
  const globalStats = useMemo(() => {
    const allWorkers = orders.flatMap((o) => o.workers)
    const checkedIn = allWorkers.filter((w) => w.checkIn !== null).length
    const onTime = allWorkers.filter((w) => w.status === "on_time" || w.status === "working").length
    const late = allWorkers.filter((w) => w.status === "late").length
    const absent = allWorkers.filter((w) => w.status === "absent").length
    return {
      activeOrders: orders.length,
      totalWorkers: allWorkers.length,
      checkedIn,
      onTime,
      lateAndAbsent: late + absent,
    }
  }, [orders])

  // Weekly tab data
  const weeklyData = mockWeeklyData[weeklySelectedOrder] ?? []
  const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chấm công</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Theo dõi chấm công ứng viên theo yêu cầu tuyển dụng
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* ---- Date navigation ---- */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium capitalize">{formatDate(currentDate)}</span>
        </div>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-xs h-7" onClick={goToToday}>
          Hôm nay
        </Button>
      </div>

      {/* ---- Stats cards ---- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">YCTD hoạt động</p>
                <p className="text-2xl font-bold">{globalStats.activeOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2.5">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">UV đi làm hôm nay</p>
                <p className="text-2xl font-bold">{globalStats.checkedIn}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-500/10 p-2.5">
                <UserCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check-in đúng giờ</p>
                <p className="text-2xl font-bold text-emerald-600">{globalStats.onTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-500/10 p-2.5">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Trễ / Vắng</p>
                <p className="text-2xl font-bold text-red-600">{globalStats.lateAndAbsent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---- Main Tabs ---- */}
      <Tabs defaultValue="daily">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <TabsList>
            <TabsTrigger value="daily" className="gap-1.5">
              <CalendarDays className="h-4 w-4" />
              Chấm công ngày
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-1.5">
              <Clock className="h-4 w-4" />
              Tổng hợp tuần
            </TabsTrigger>
            <TabsTrigger value="monthly" className="gap-1.5">
              <FileSpreadsheet className="h-4 w-4" />
              Tổng hợp tháng
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ==== Tab 1: Daily ==== */}
        <TabsContent value="daily">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm ứng viên theo tên, SĐT..."
                className="pl-9 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "__all__" ? "" : v)}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả YCTD</SelectItem>
                <SelectItem value="has_late">Có trễ</SelectItem>
                <SelectItem value="has_absent">Có vắng</SelectItem>
                <SelectItem value="all_on_time">Tất cả đúng giờ</SelectItem>
                <SelectItem value="pending">Chưa check-in</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 ml-auto">
              <Button variant="ghost" size="sm" className="text-xs h-8 gap-1" onClick={expandAll}>
                <ChevronsUpDown className="h-3.5 w-3.5" />
                Mở tất cả
              </Button>
              <Button variant="ghost" size="sm" className="text-xs h-8" onClick={collapseAll}>
                Thu gọn
              </Button>
            </div>
          </div>

          {/* Order cards */}
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={expandedOrders.has(order.id)}
                onToggle={() => toggleOrder(order.id)}
                searchQuery={searchQuery}
                onCheckAll={handleCheckAll}
                onNavigateToOrder={handleNavigateToOrder}
              />
            ))}
          </div>

          {/* Bottom summary */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tổng giờ công hôm nay: </span>
                    <strong className="text-foreground">1.432 giờ</strong>
                  </div>
                  <Separator orientation="vertical" className="h-4 hidden sm:block" />
                  <div>
                    <span className="text-muted-foreground">Tổng ứng viên: </span>
                    <strong className="text-foreground">{globalStats.totalWorkers} người</strong>
                  </div>
                  <Separator orientation="vertical" className="h-4 hidden sm:block" />
                  <div>
                    <span className="text-muted-foreground">Tỷ lệ đúng giờ: </span>
                    <strong className="text-emerald-600">89%</strong>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==== Tab 2: Weekly ==== */}
        <TabsContent value="weekly">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <Select value={weeklySelectedOrder} onValueChange={setWeeklySelectedOrder}>
              <SelectTrigger className="w-[320px] h-9">
                <SelectValue placeholder="Chọn YCTD" />
              </SelectTrigger>
              <SelectContent>
                {mockOrders.map((o) => (
                  <SelectItem key={o.code} value={o.code}>
                    {o.code} - {o.client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Tuần 06/04 - 12/04/2026
            </div>
          </div>

          {weeklyData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[220px]">Ứng viên</TableHead>
                    {weekDays.map((day) => (
                      <TableHead key={day} className="text-center w-[70px]">{day}</TableHead>
                    ))}
                    <TableHead className="text-center w-[100px]">Tổng công</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyData.map((row) => (
                    <TableRow key={row.worker.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {getInitials(row.worker.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-tight">{row.worker.name}</p>
                            <p className="text-xs text-muted-foreground">{row.worker.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      {row.days.map((dayStatus, idx) => (
                        <TableCell key={idx} className="text-center">
                          <div className="flex items-center justify-center">
                            <WeekDayCellIcon status={dayStatus} />
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="text-center">
                        <span className="text-sm font-semibold">{row.totalDays} ngày</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CalendarDays className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Không có dữ liệu tuần cho YCTD này</p>
              </CardContent>
            </Card>
          )}

          {/* Weekly legend */}
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đúng giờ</span>
            <span className="flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Trễ</span>
            <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-red-500" /> Vắng</span>
            <span className="flex items-center gap-1"><Minus className="h-3.5 w-3.5 text-gray-300" /> Nghỉ</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-400" /> Chưa đến</span>
          </div>
        </TabsContent>

        {/* ==== Tab 3: Monthly ==== */}
        <TabsContent value="monthly">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="text-sm font-medium">Tháng 04/2026</div>
            <div className="ml-auto">
              <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs">
                <Download className="h-3.5 w-3.5" />
                Xuất Excel
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[200px]">Ứng viên</TableHead>
                  <TableHead className="w-[100px] text-center">YCTD</TableHead>
                  <TableHead className="w-[90px] text-center">Tổng ngày</TableHead>
                  <TableHead className="w-[90px] text-center">Đúng giờ</TableHead>
                  <TableHead className="w-[80px] text-center">Trễ</TableHead>
                  <TableHead className="w-[80px] text-center">Vắng</TableHead>
                  <TableHead className="w-[90px] text-center">Tổng giờ</TableHead>
                  <TableHead className="w-[100px] text-center">Đánh giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMonthlyData.map((row) => {
                  const rc = ratingConfig[row.rating]
                  return (
                    <TableRow key={row.worker.id + row.orderCode}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                              {getInitials(row.worker.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium leading-tight">{row.worker.name}</p>
                            <p className="text-xs text-muted-foreground">{row.worker.phone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono text-xs">{row.orderCode}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold">{row.totalDays}</TableCell>
                      <TableCell className="text-center text-emerald-600 font-medium">{row.onTimeDays}</TableCell>
                      <TableCell className="text-center text-amber-600 font-medium">{row.lateDays > 0 ? row.lateDays : "-"}</TableCell>
                      <TableCell className="text-center text-red-600 font-medium">{row.absentDays > 0 ? row.absentDays : "-"}</TableCell>
                      <TableCell className="text-center font-mono text-sm">{row.totalHours}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={rc.className}>{rc.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Monthly footer */}
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tổng ngày công: </span>
                    <strong className="text-foreground">
                      {mockMonthlyData.reduce((s, r) => s + r.totalDays, 0)} ngày
                    </strong>
                  </div>
                  <Separator orientation="vertical" className="h-4 hidden sm:block" />
                  <div>
                    <span className="text-muted-foreground">Ứng viên: </span>
                    <strong className="text-foreground">{mockMonthlyData.length} người</strong>
                  </div>
                  <Separator orientation="vertical" className="h-4 hidden sm:block" />
                  <div>
                    <span className="text-muted-foreground">Chi phí ước tính: </span>
                    <strong className="text-primary">52.680.000đ</strong>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
