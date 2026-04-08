import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Users,
  XCircle,
  ClipboardList,
  Sparkles,
  FileSearch,
  CalendarDays,
  Download,
  Copy,
  Printer,
  History,
  Send,
  RefreshCw,
  X,
  AlertTriangle,
} from "lucide-react"

// ─── Types ──────────────────────────────────────────────────────────────────

type OrderStatus = "new" | "processing" | "dispatched" | "completed" | "cancelled"
type UrgencyLevel = "normal" | "urgent" | "critical"
type ServiceType = "short_term" | "long_term" | "shift_based" | "project_based"

interface Order {
  id: string
  code: string
  client_name: string
  client_avatar_color: string
  position: string
  quantity_needed: number
  quantity_filled: number
  status: OrderStatus
  urgency: UrgencyLevel
  service_type: ServiceType
  start_date: string
  created_at: string
}

// ─── Config ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  new: {
    label: "Mới",
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  processing: {
    label: "Đang xử lý",
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  dispatched: {
    label: "Đã điều phối",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  completed: {
    label: "Hoàn thành",
    className: "bg-gray-100 text-gray-600 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
}

const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; className: string }> = {
  normal: {
    label: "Bình thường",
    className: "bg-gray-100 text-gray-600 border-gray-200/80",
  },
  urgent: {
    label: "Gấp",
    className: "bg-orange-50 text-orange-700 border-orange-200/80",
  },
  critical: {
    label: "Rất gấp",
    className: "bg-red-50 text-red-700 border-red-200/80 animate-pulse",
  },
}

const STATUS_TABS: { value: string; label: string; count: number }[] = [
  { value: "all", label: "Tất cả", count: 10 },
  { value: "new", label: "Mới", count: 3 },
  { value: "processing", label: "Đang xử lý", count: 3 },
  { value: "dispatched", label: "Đã điều phối", count: 2 },
  { value: "completed", label: "Hoàn thành", count: 1 },
  { value: "cancelled", label: "Đã hủy", count: 1 },
]

const PER_PAGE_OPTIONS = [10, 25, 50] as const

// ─── Mock Data ──────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
  "from-indigo-400 to-indigo-600",
  "from-pink-400 to-pink-600",
  "from-teal-400 to-teal-600",
  "from-orange-400 to-orange-600",
]

const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    code: "ORD-2024-001",
    client_name: "Công ty TNHH Thực phẩm Vạn Phúc",
    client_avatar_color: AVATAR_COLORS[0],
    position: "Công nhân đóng gói",
    quantity_needed: 20,
    quantity_filled: 15,
    status: "processing",
    urgency: "urgent",
    service_type: "short_term",
    start_date: "2024-04-15",
    created_at: "2024-04-01",
  },
  {
    id: "2",
    code: "ORD-2024-002",
    client_name: "Nhà hàng Hoàng Long",
    client_avatar_color: AVATAR_COLORS[1],
    position: "Phục vụ nhà hàng",
    quantity_needed: 10,
    quantity_filled: 10,
    status: "dispatched",
    urgency: "normal",
    service_type: "shift_based",
    start_date: "2024-04-10",
    created_at: "2024-03-28",
  },
  {
    id: "3",
    code: "ORD-2024-003",
    client_name: "Kho vận Tân Cảng",
    client_avatar_color: AVATAR_COLORS[2],
    position: "Bốc xếp kho",
    quantity_needed: 30,
    quantity_filled: 8,
    status: "new",
    urgency: "critical",
    service_type: "short_term",
    start_date: "2024-04-12",
    created_at: "2024-04-05",
  },
  {
    id: "4",
    code: "ORD-2024-004",
    client_name: "Công ty CP May Sài Gòn 3",
    client_avatar_color: AVATAR_COLORS[3],
    position: "Công nhân may",
    quantity_needed: 50,
    quantity_filled: 42,
    status: "processing",
    urgency: "normal",
    service_type: "long_term",
    start_date: "2024-04-20",
    created_at: "2024-03-25",
  },
  {
    id: "5",
    code: "ORD-2024-005",
    client_name: "Siêu thị BigC Thăng Long",
    client_avatar_color: AVATAR_COLORS[4],
    position: "Nhân viên bán hàng",
    quantity_needed: 15,
    quantity_filled: 0,
    status: "new",
    urgency: "urgent",
    service_type: "shift_based",
    start_date: "2024-04-18",
    created_at: "2024-04-06",
  },
  {
    id: "6",
    code: "ORD-2024-006",
    client_name: "Khách sạn Mường Thanh Luxury",
    client_avatar_color: AVATAR_COLORS[5],
    position: "Nhân viên buồng phòng",
    quantity_needed: 8,
    quantity_filled: 8,
    status: "completed",
    urgency: "normal",
    service_type: "project_based",
    start_date: "2024-03-01",
    created_at: "2024-02-20",
  },
  {
    id: "7",
    code: "ORD-2024-007",
    client_name: "Nhà máy Samsung SEVT",
    client_avatar_color: AVATAR_COLORS[6],
    position: "Công nhân lắp ráp",
    quantity_needed: 100,
    quantity_filled: 65,
    status: "processing",
    urgency: "urgent",
    service_type: "long_term",
    start_date: "2024-05-01",
    created_at: "2024-04-02",
  },
  {
    id: "8",
    code: "ORD-2024-008",
    client_name: "Công ty TNHH Logistics Gemadept",
    client_avatar_color: AVATAR_COLORS[7],
    position: "Lái xe nâng",
    quantity_needed: 5,
    quantity_filled: 0,
    status: "cancelled",
    urgency: "normal",
    service_type: "short_term",
    start_date: "2024-04-08",
    created_at: "2024-03-30",
  },
  {
    id: "9",
    code: "ORD-2024-009",
    client_name: "Trung tâm Hội nghị GEM Center",
    client_avatar_color: AVATAR_COLORS[8],
    position: "Nhân viên sự kiện",
    quantity_needed: 25,
    quantity_filled: 0,
    status: "new",
    urgency: "critical",
    service_type: "project_based",
    start_date: "2024-04-20",
    created_at: "2024-04-07",
  },
  {
    id: "10",
    code: "ORD-2024-010",
    client_name: "Công ty CP Xây dựng Hòa Bình",
    client_avatar_color: AVATAR_COLORS[9],
    position: "Thợ hồ & phụ hồ",
    quantity_needed: 40,
    quantity_filled: 32,
    status: "dispatched",
    urgency: "normal",
    service_type: "project_based",
    start_date: "2024-04-10",
    created_at: "2024-03-20",
  },
]

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
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

function getProgressColor(percent: number): string {
  if (percent >= 100) return "bg-emerald-500"
  if (percent >= 60) return "bg-blue-500"
  if (percent >= 30) return "bg-amber-500"
  return "bg-red-500"
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ProgressBar({ filled, needed }: { filled: number; needed: number }) {
  const percent = getProgressPercent(filled, needed)
  const color = getProgressColor(percent)
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex-1 h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">
        {filled}/{needed}
      </span>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileSearch className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-foreground">
        Không tìm thấy yêu cầu
      </h3>
      <p className="mt-1 text-[13px] text-muted-foreground text-center max-w-sm">
        Không có yêu cầu nào phù hợp với tiêu chí tìm kiếm. Hãy thử điều chỉnh bộ lọc hoặc tạo yêu cầu mới.
      </p>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function OrderList() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("")
  const [serviceFilter, setServiceFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState<number>(10)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Cancel confirmation dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<{ ids: string[]; label: string } | null>(null)

  // Filter data
  const filtered = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false
    if (urgencyFilter && urgencyFilter !== "all" && order.urgency !== urgencyFilter) return false
    if (serviceFilter && serviceFilter !== "all" && order.service_type !== serviceFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (
        !order.code.toLowerCase().includes(q) &&
        !order.client_name.toLowerCase().includes(q) &&
        !order.position.toLowerCase().includes(q)
      )
        return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery !== "" ||
    (urgencyFilter !== "" && urgencyFilter !== "all") ||
    (serviceFilter !== "" && serviceFilter !== "all") ||
    statusFilter !== "all"

  // Pagination display range
  const startItem = filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, filtered.length)

  // ─── Selection helpers ──────────────────────────────────────────────────

  const allPageSelected = paginated.length > 0 && paginated.every((o) => selectedIds.has(o.id))
  const somePageSelected = paginated.some((o) => selectedIds.has(o.id))

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        // Deselect all on current page
        paginated.forEach((o) => next.delete(o.id))
      } else {
        // Select all on current page
        paginated.forEach((o) => next.add(o.id))
      }
      return next
    })
  }

  function toggleSelectRow(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  // ─── Action helpers ─────────────────────────────────────────────────────

  function handleBulkStatusChange(status: OrderStatus) {
    const count = selectedIds.size
    setOrders((prev) =>
      prev.map((o) => (selectedIds.has(o.id) ? { ...o, status } : o))
    )
    toast.success(`Đã đổi trạng thái ${count} yêu cầu sang "${STATUS_CONFIG[status].label}"`)
    clearSelection()
  }

  function handleBulkUrgencyChange(urgency: UrgencyLevel) {
    const count = selectedIds.size
    setOrders((prev) =>
      prev.map((o) => (selectedIds.has(o.id) ? { ...o, urgency } : o))
    )
    toast.success(`Đã đổi độ khẩn ${count} yêu cầu sang "${URGENCY_CONFIG[urgency].label}"`)
    clearSelection()
  }

  function handleBulkExport() {
    const selectedOrders = orders.filter((o) => selectedIds.has(o.id))
    const lines = selectedOrders.map((o) => `${o.code}\t${o.client_name}\t${o.position}\t${o.quantity_filled}/${o.quantity_needed}\t${STATUS_CONFIG[o.status].label}`)
    const text = "Mã đơn\tKhách hàng\tVị trí\tTiến độ\tTrạng thái\n" + lines.join("\n")
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã copy ${selectedIds.size} yêu cầu vào clipboard (có thể paste vào Excel)`)
    }).catch(() => {
      toast.success(`Đã xuất ${selectedIds.size} yêu cầu`)
    })
    clearSelection()
  }

  function handleBulkSendRecruiter() {
    const count = selectedIds.size
    setOrders((prev) =>
      prev.map((o) => (selectedIds.has(o.id) && o.status === "new" ? { ...o, status: "processing" as OrderStatus } : o))
    )
    toast.success(`Đã gửi ${count} yêu cầu cho Recruiter (chuyển sang Đang xử lý)`)
    clearSelection()
  }

  function handleExportAll() {
    const lines = filtered.map((o) => `${o.code}\t${o.client_name}\t${o.position}\t${o.quantity_filled}/${o.quantity_needed}\t${STATUS_CONFIG[o.status].label}`)
    const text = "Mã đơn\tKhách hàng\tVị trí\tTiến độ\tTrạng thái\n" + lines.join("\n")
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`Đã copy ${filtered.length} yêu cầu vào clipboard`)
    }).catch(() => {
      toast.success(`Đã xuất ${filtered.length} yêu cầu ra file Excel`)
    })
  }

  function handleDuplicate(order: Order) {
    const newId = String(Date.now())
    const newCode = order.code.replace(/(\d+)$/, (m) => String(Number(m) + 10))
    const newOrder: Order = {
      ...order,
      id: newId,
      code: newCode,
      status: "new",
      quantity_filled: 0,
      created_at: new Date().toISOString().split("T")[0],
    }
    setOrders((prev) => [newOrder, ...prev])
    toast.success(`Đã nhân đôi → ${newCode}`)
  }

  function handlePrint(order: Order) {
    toast.info(`Đang in phiếu yêu cầu ${order.code}...`)
    // Open print preview with order info
    const w = window.open("", "_blank", "width=800,height=600")
    if (w) {
      w.document.write(`
        <html><head><title>Phiếu YCTD ${order.code}</title>
        <style>body{font-family:sans-serif;padding:40px}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style>
        </head><body>
        <h1>PHIẾU YÊU CẦU TUYỂN DỤNG - ${order.code}</h1>
        <table>
          <tr><th>Khách hàng</th><td>${order.client_name}</td></tr>
          <tr><th>Vị trí</th><td>${order.position}</td></tr>
          <tr><th>Số lượng</th><td>${order.quantity_needed} người</td></tr>
          <tr><th>Đã có</th><td>${order.quantity_filled} người</td></tr>
          <tr><th>Trạng thái</th><td>${STATUS_CONFIG[order.status].label}</td></tr>
          <tr><th>Độ khẩn</th><td>${URGENCY_CONFIG[order.urgency].label}</td></tr>
          <tr><th>Ngày bắt đầu</th><td>${formatDate(order.start_date)}</td></tr>
        </table>
        <script>setTimeout(()=>window.print(),300)</script>
        </body></html>
      `)
    }
  }

  function handleSingleStatusChange(order: Order, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status } : o))
    )
    toast.success(`Đã đổi trạng thái ${order.code} sang "${STATUS_CONFIG[status].label}"`)
  }

  function openCancelDialog(ids: string[], label: string) {
    setCancelTarget({ ids, label })
    setCancelDialogOpen(true)
  }

  function confirmCancel() {
    if (!cancelTarget) return
    setOrders((prev) =>
      prev.map((o) => (cancelTarget.ids.includes(o.id) ? { ...o, status: "cancelled" as OrderStatus } : o))
    )
    toast.success(`Đã hủy ${cancelTarget.ids.length} yêu cầu tuyển dụng`)
    clearSelection()
    setCancelDialogOpen(false)
    setCancelTarget(null)
  }

  function resetAllFilters() {
    setSearchQuery("")
    setStatusFilter("all")
    setUrgencyFilter("")
    setServiceFilter("")
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Cung ứng nhân sự
              </span>
            </div>
            <h1 className="text-xl font-semibold">Yêu cầu tuyển dụng</h1>
            <p className="mt-1 text-sm text-white/70">
              Quản lý yêu cầu tuyển dụng từ khách hàng
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Button
              size="sm"
              className="bg-white/20 text-white border border-white/30 hover:bg-white/30"
              onClick={handleExportAll}
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất Excel
            </Button>
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
              onClick={() => navigate("/orders/create")}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Tạo yêu cầu
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={statusFilter}
        onValueChange={(val) => {
          setStatusFilter(val as string)
          setCurrentPage(1)
        }}
      >
        <TabsList variant="line" className="w-full justify-start overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
              {tab.label}
              <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
                {tab.value === "all"
                  ? orders.length
                  : orders.filter((o) => o.status === tab.value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm mã đơn, khách hàng, vị trí..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            className="h-9 pl-9"
          />
        </div>

        <Select
          value={urgencyFilter}
          onValueChange={(val) => {
            setUrgencyFilter(val as string)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Độ khẩn cấp" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức độ</SelectItem>
            <SelectItem value="normal">Bình thường</SelectItem>
            <SelectItem value="urgent">Gấp</SelectItem>
            <SelectItem value="critical">Rất gấp</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={serviceFilter}
          onValueChange={(val) => {
            setServiceFilter(val as string)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Loại dịch vụ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="short_term">Thời vụ ngắn hạn</SelectItem>
            <SelectItem value="long_term">Dài hạn</SelectItem>
            <SelectItem value="shift_based">Theo ca</SelectItem>
            <SelectItem value="project_based">Theo dự án</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 text-muted-foreground hover:text-foreground"
            onClick={resetAllFilters}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          Hiển thị{" "}
          <span className="font-semibold text-foreground">
            {startItem}-{endItem}
          </span>{" "}
          trên{" "}
          <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
          yêu cầu
        </p>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-md">
          <span className="text-sm font-medium text-foreground">
            Đã chọn <span className="font-bold text-primary">{selectedIds.size}</span> yêu cầu
          </span>

          <div className="flex items-center gap-1.5">
            {/* Bulk status change */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium hover:bg-muted transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
                Đổi trạng thái
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[160px]">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Chọn trạng thái</DropdownMenuLabel>
                  {(Object.keys(STATUS_CONFIG) as OrderStatus[]).map((status) => (
                    <DropdownMenuItem key={status} onClick={() => handleBulkStatusChange(status)}>
                      {STATUS_CONFIG[status].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk urgency change */}
            <DropdownMenu>
              <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-md border bg-background px-3 text-xs font-medium hover:bg-muted transition-colors">
                <AlertTriangle className="h-3.5 w-3.5" />
                Đổi độ khẩn
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Chọn độ khẩn</DropdownMenuLabel>
                  {(Object.keys(URGENCY_CONFIG) as UrgencyLevel[]).map((urgency) => (
                    <DropdownMenuItem key={urgency} onClick={() => handleBulkUrgencyChange(urgency)}>
                      {URGENCY_CONFIG[urgency].label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk export */}
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleBulkExport}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất danh sách
            </Button>

            {/* Send to recruiter */}
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleBulkSendRecruiter}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Gửi cho Recruiter
            </Button>

            {/* Bulk cancel */}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
              onClick={() => {
                const ids = Array.from(selectedIds)
                openCancelDialog(ids, `${ids.length} yêu cầu tuyển dụng`)
              }}
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Hủy đơn
            </Button>
          </div>

          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={clearSelection}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {paginated.length === 0 ? (
        <Card>
          <CardContent className="p-0">
            <EmptyState />
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px] pl-4">
                    <Checkbox
                      checked={allPageSelected}
                      indeterminate={somePageSelected && !allPageSelected}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Chọn tất cả"
                    />
                  </TableHead>
                  <TableHead className="w-[120px]">Mã đơn</TableHead>
                  <TableHead className="min-w-[160px]">Khách hàng</TableHead>
                  <TableHead>Vị trí tuyển</TableHead>
                  <TableHead className="w-[120px]">Tiến độ</TableHead>
                  <TableHead className="w-[100px]">Trạng thái</TableHead>
                  <TableHead className="w-[90px]">Độ khẩn</TableHead>
                  <TableHead className="w-[44px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status]
                  const urgencyConf = URGENCY_CONFIG[order.urgency]
                  const isSelected = selectedIds.has(order.id)

                  return (
                    <TableRow
                      key={order.id}
                      className={`cursor-pointer ${isSelected ? "bg-primary/5" : ""}`}
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectRow(order.id)}
                          aria-label={`Chọn ${order.code}`}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs font-semibold text-primary">
                          {order.code}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback
                              className={`bg-gradient-to-br ${order.client_avatar_color} rounded-lg text-[10px] font-semibold text-white`}
                            >
                              {getInitials(order.client_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate max-w-[180px]">
                            {order.client_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.position}</span>
                      </TableCell>
                      <TableCell>
                        <ProgressBar
                          filled={order.quantity_filled}
                          needed={order.quantity_needed}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`rounded-md text-[11px] font-medium ${statusConf.className}`}
                        >
                          {statusConf.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`rounded-md text-[11px] font-medium ${urgencyConf.className}`}
                        >
                          {urgencyConf.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/orders/${order.id}`)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <Users className="mr-2 h-4 w-4" />
                                Điều phối
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDuplicate(order)
                                }}
                              >
                                <Copy className="mr-2 h-4 w-4" />
                                Nhân đôi
                              </DropdownMenuItem>

                              {/* Status change submenu */}
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Đổi trạng thái
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="min-w-[140px]">
                                  {(["new", "processing", "dispatched", "completed"] as OrderStatus[]).map((status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleSingleStatusChange(order, status)
                                      }}
                                    >
                                      {STATUS_CONFIG[status].label}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>

                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handlePrint(order)
                                }}
                              >
                                <Printer className="mr-2 h-4 w-4" />
                                In phiếu
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/orders/${order.id}`)
                                }}
                              >
                                <History className="mr-2 h-4 w-4" />
                                Xem lịch sử
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openCancelDialog([order.id], `yêu cầu ${order.code}`)
                                }}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Hủy đơn
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Pagination + Per Page */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Hiển thị</span>
          <Select
            value={String(perPage)}
            onValueChange={(val) => {
              setPerPage(Number(val))
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PER_PAGE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={String(opt)}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>/ trang</span>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Trước"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  text="Sau"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Bạn có chắc muốn hủy {cancelTarget?.label}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ chuyển trạng thái sang Đã hủy. Bạn có thể khôi phục lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmCancel}
            >
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="icon-lg"
          className="rounded-full shadow-lg shadow-primary/25"
          onClick={() => navigate("/orders/create")}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}
