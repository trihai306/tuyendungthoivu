import { useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { usePermissions } from "@/hooks/use-permissions"
import {
  useStaffingOrders,
  useUpdateOrderStatus,
  useDeleteStaffingOrder,
} from "@/hooks/use-staffing-orders"
import type { StaffingOrder, OrderStatus, OrderUrgency } from "@/types/staffing"
import type { StaffingOrderFilter } from "@/services/staffing-orders.service"
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
import { SortableHeader } from "@/components/ui/sortable-header"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Users,
  XCircle,
  Sparkles,
  FileSearch,
  Download,
  Copy,
  Printer,
  History,
  Send,
  RefreshCw,
  X,
  AlertTriangle,
  Loader2,
} from "lucide-react"

// ─── Config ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  draft: {
    label: "Nháp",
    className: "bg-gray-50 text-gray-600 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
  pending: {
    label: "Chờ duyệt",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200/80 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
  },
  approved: {
    label: "Đã duyệt",
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  rejected: {
    label: "Từ chối",
    className: "bg-red-50 text-red-700 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  recruiting: {
    label: "Đang tuyển",
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  filled: {
    label: "Đã đủ người",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  in_progress: {
    label: "Đang thực hiện",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
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

const URGENCY_CONFIG: Record<OrderUrgency, { label: string; className: string }> = {
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

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "draft", label: "Nháp" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "approved", label: "Đã duyệt" },
  { value: "recruiting", label: "Đang tuyển" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
]

const PER_PAGE_OPTIONS = [10, 25, 50] as const

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

// ─── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
}

function getAvatarColor(id: string): string {
  // Deterministic color from the id string
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr))
}

function getProgressColor(percent: number): string {
  if (percent >= 100) return "bg-emerald-500"
  if (percent >= 60) return "bg-blue-500"
  if (percent >= 30) return "bg-amber-500"
  return "bg-red-500"
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function ProgressBar({ filled, needed }: { filled: number; needed: number }) {
  const percent = needed === 0 ? 0 : Math.min(Math.round((filled / needed) * 100), 100)
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

function TableSkeleton() {
  return (
    <Card className="border-border/50 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[44px] pl-4"><Skeleton className="h-4 w-4" /></TableHead>
              <TableHead className="w-[120px]"><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="min-w-[160px]"><Skeleton className="h-4 w-24" /></TableHead>
              <TableHead><Skeleton className="h-4 w-20" /></TableHead>
              <TableHead className="w-[120px]"><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="w-[100px]"><Skeleton className="h-4 w-16" /></TableHead>
              <TableHead className="w-[90px]"><Skeleton className="h-4 w-14" /></TableHead>
              <TableHead className="w-[44px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="pl-4"><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-5 w-14 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-7 w-7 rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function OrderList() {
  const navigate = useNavigate()
  const can = usePermissions()

  // ─── Filter / pagination state ────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null)
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("")
  const [serviceFilter, setServiceFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState<number>(10)
  const [sortValue, setSortValue] = useState("-created_at")

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Sort change handler - also resets page to 1
  const handleSort = useCallback((sort: string) => {
    setSortValue(sort)
    setCurrentPage(1)
  }, [])

  // Cancel confirmation dialog
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<{ ids: string[]; label: string } | null>(null)

  // ─── Build API filter params ──────────────────────────────────────────
  const filters = useMemo<StaffingOrderFilter>(() => {
    const f: StaffingOrderFilter = {
      page: currentPage,
      per_page: perPage,
      sort: sortValue,
    }
    if (debouncedSearch) f.search = debouncedSearch
    if (statusFilter !== "all") f.status = statusFilter
    if (urgencyFilter && urgencyFilter !== "all") f.urgency = urgencyFilter
    // service_type is passed as generic query param
    if (serviceFilter && serviceFilter !== "all") f.service_type = serviceFilter
    return f
  }, [currentPage, perPage, sortValue, debouncedSearch, statusFilter, urgencyFilter, serviceFilter])

  // ─── Data fetching ────────────────────────────────────────────────────
  const { data, isLoading } = useStaffingOrders(filters)
  const updateStatusMutation = useUpdateOrderStatus()
  const deleteMutation = useDeleteStaffingOrder()

  const orders = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta?.last_page ?? 1
  const totalItems = meta?.total ?? 0
  const startItem = totalItems === 0 ? 0 : (meta?.from ?? 0)
  const endItem = meta?.to ?? 0

  // ─── Search debounce handler ──────────────────────────────────────────
  function handleSearchChange(value: string) {
    setSearchQuery(value)
    if (searchTimer) clearTimeout(searchTimer)
    const timer = setTimeout(() => {
      setDebouncedSearch(value)
      setCurrentPage(1)
    }, 400)
    setSearchTimer(timer)
  }

  // Check if any filter is active
  const hasActiveFilters =
    searchQuery !== "" ||
    (urgencyFilter !== "" && urgencyFilter !== "all") ||
    (serviceFilter !== "" && serviceFilter !== "all") ||
    statusFilter !== "all"

  // ─── Selection helpers ──────────────────────────────────────────────────

  const allPageSelected = orders.length > 0 && orders.every((o) => selectedIds.has(o.id))
  const somePageSelected = orders.some((o) => selectedIds.has(o.id))

  function toggleSelectAll() {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (allPageSelected) {
        orders.forEach((o) => next.delete(o.id))
      } else {
        orders.forEach((o) => next.add(o.id))
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
    const ids = Array.from(selectedIds)
    let completed = 0
    const total = ids.length
    ids.forEach((id) => {
      updateStatusMutation.mutate(
        { id, status },
        {
          onSuccess: () => {
            completed++
            if (completed === total) {
              toast.success(`Đã đổi trạng thái ${total} yêu cầu sang "${STATUS_CONFIG[status]?.label ?? status}"`)
              clearSelection()
            }
          },
        },
      )
    })
  }

  function handleBulkExport() {
    const selectedOrders = orders.filter((o) => selectedIds.has(o.id))
    const lines = selectedOrders.map(
      (o) =>
        `${o.order_code}\t${o.client?.company_name ?? "—"}\t${o.position_name}\t${o.quantity_filled}/${o.quantity_needed}\t${o.status_label}`,
    )
    const text =
      "Mã đơn\tKhách hàng\tVị trí\tTiến độ\tTrạng thái\n" + lines.join("\n")
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(
          `Đã copy ${selectedIds.size} yêu cầu vào clipboard (có thể paste vào Excel)`,
        )
      })
      .catch(() => {
        toast.success(`Đã xuất ${selectedIds.size} yêu cầu`)
      })
    clearSelection()
  }

  function handleBulkSendRecruiter() {
    const ids = Array.from(selectedIds)
    let completed = 0
    const total = ids.length
    ids.forEach((id) => {
      updateStatusMutation.mutate(
        { id, status: "recruiting" },
        {
          onSuccess: () => {
            completed++
            if (completed === total) {
              toast.success(`Đã gửi ${total} yêu cầu cho Recruiter (chuyển sang Đang tuyển)`)
              clearSelection()
            }
          },
        },
      )
    })
  }

  function handleExportAll() {
    const lines = orders.map(
      (o) =>
        `${o.order_code}\t${o.client?.company_name ?? "—"}\t${o.position_name}\t${o.quantity_filled}/${o.quantity_needed}\t${o.status_label}`,
    )
    const text =
      "Mã đơn\tKhách hàng\tVị trí\tTiến độ\tTrạng thái\n" + lines.join("\n")
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`Đã copy ${orders.length} yêu cầu vào clipboard`)
      })
      .catch(() => {
        toast.success(`Đã xuất ${orders.length} yêu cầu ra file Excel`)
      })
  }

  function handlePrint(order: StaffingOrder) {
    toast.info(`Đang in phiếu yêu cầu ${order.order_code}...`)
    const w = window.open("", "_blank", "width=800,height=600")
    if (w) {
      w.document.write(`
        <html><head><title>Phiếu YCTD ${order.order_code}</title>
        <style>body{font-family:sans-serif;padding:40px}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}</style>
        </head><body>
        <h1>PHIẾU YÊU CẦU TUYỂN DỤNG - ${order.order_code}</h1>
        <table>
          <tr><th>Khách hàng</th><td>${order.client?.company_name ?? "—"}</td></tr>
          <tr><th>Vị trí</th><td>${order.position_name}</td></tr>
          <tr><th>Số lượng</th><td>${order.quantity_needed} người</td></tr>
          <tr><th>Đã có</th><td>${order.quantity_filled} người</td></tr>
          <tr><th>Trạng thái</th><td>${order.status_label}</td></tr>
          <tr><th>Độ khẩn</th><td>${order.urgency_label ?? "Bình thường"}</td></tr>
          <tr><th>Ngày bắt đầu</th><td>${formatDate(order.start_date)}</td></tr>
        </table>
        <script>setTimeout(()=>window.print(),300)</script>
        </body></html>
      `)
    }
  }

  function handleSingleStatusChange(order: StaffingOrder, status: OrderStatus) {
    updateStatusMutation.mutate(
      { id: order.id, status },
      {
        onSuccess: () => {
          toast.success(`Đã đổi trạng thái ${order.order_code} sang "${STATUS_CONFIG[status]?.label ?? status}"`)
        },
      },
    )
  }

  function openCancelDialog(ids: string[], label: string) {
    setCancelTarget({ ids, label })
    setCancelDialogOpen(true)
  }

  function confirmCancel() {
    if (!cancelTarget) return
    const ids = cancelTarget.ids
    let completed = 0
    ids.forEach((id) => {
      updateStatusMutation.mutate(
        { id, status: "cancelled" },
        {
          onSuccess: () => {
            completed++
            if (completed === ids.length) {
              toast.success(`Đã hủy ${ids.length} yêu cầu tuyển dụng`)
              clearSelection()
              setCancelDialogOpen(false)
              setCancelTarget(null)
            }
          },
        },
      )
    })
  }

  function resetAllFilters() {
    setSearchQuery("")
    setDebouncedSearch("")
    setStatusFilter("all")
    setUrgencyFilter("")
    setServiceFilter("")
    setSortValue("-created_at")
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
            {can("orders.create") && (
              <Button
                size="sm"
                className="bg-white text-primary hover:bg-white/90 shadow-sm"
                onClick={() => navigate("/orders/create")}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Tạo yêu cầu
              </Button>
            )}
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
            onChange={(e) => handleSearchChange(e.target.value)}
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
        {isLoading ? (
          <Skeleton className="h-4 w-40" />
        ) : (
          <p className="text-[13px] text-muted-foreground">
            Hiển thị{" "}
            <span className="font-semibold text-foreground">
              {startItem}-{endItem}
            </span>{" "}
            trên{" "}
            <span className="font-semibold text-foreground">{totalItems}</span>{" "}
            yêu cầu
          </p>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-md">
          <span className="text-sm font-medium text-foreground">
            Đã chọn <span className="font-bold text-primary">{selectedIds.size}</span> yêu cầu
          </span>

          <div className="flex items-center gap-1.5">
            {/* Bulk status change */}
            {can("orders.update") && (
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
            )}

            {/* Bulk urgency change - removed since backend doesn't support batch urgency update */}

            {/* Bulk export */}
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleBulkExport}>
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Xuất danh sách
            </Button>

            {/* Send to recruiter */}
            {can("orders.assign") && (
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleBulkSendRecruiter}>
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Gửi cho Recruiter
              </Button>
            )}

            {/* Bulk cancel */}
            {can("orders.update") && (
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
            )}
          </div>

          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="h-8 text-xs text-muted-foreground" onClick={clearSelection}>
              Bỏ chọn
            </Button>
          </div>
        </div>
      )}

      {/* Data Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : orders.length === 0 ? (
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
                  <SortableHeader label="Mã đơn" field="order_code" currentSort={sortValue} onSort={handleSort} className="w-[120px]" />
                  <TableHead className="min-w-[160px]">Khách hàng</TableHead>
                  <TableHead>Vị trí tuyển</TableHead>
                  <SortableHeader label="Tiến độ" field="quantity_needed" currentSort={sortValue} onSort={handleSort} className="w-[120px]" />
                  <SortableHeader label="Trạng thái" field="status" currentSort={sortValue} onSort={handleSort} className="w-[100px]" />
                  <SortableHeader label="Độ khẩn" field="urgency" currentSort={sortValue} onSort={handleSort} className="w-[90px]" />
                  <TableHead className="w-[44px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status] ?? {
                    label: order.status_label,
                    className: "bg-gray-100 text-gray-600 border-gray-200/80",
                  }
                  const urgencyConf = order.urgency
                    ? URGENCY_CONFIG[order.urgency] ?? {
                        label: order.urgency_label ?? order.urgency,
                        className: "bg-gray-100 text-gray-600 border-gray-200/80",
                      }
                    : { label: "Bình thường", className: "bg-gray-100 text-gray-600 border-gray-200/80" }
                  const isSelected = selectedIds.has(order.id)
                  const clientName = order.client?.company_name ?? "—"
                  const avatarColor = getAvatarColor(order.client_id ?? order.id)

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
                          aria-label={`Chọn ${order.order_code}`}
                        />
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs font-semibold text-primary">
                          {order.order_code}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback
                              className={`bg-gradient-to-br ${avatarColor} rounded-lg text-[10px] font-semibold text-white`}
                            >
                              {getInitials(clientName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium truncate max-w-[180px]">
                            {clientName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{order.position_name}</span>
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
                              {can("orders.update") && (
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate(`/orders/${order.id}/edit`)
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/orders/${order.id}`)
                                }}
                              >
                                <Users className="mr-2 h-4 w-4" />
                                Điều phối
                              </DropdownMenuItem>

                              {/* Status change submenu */}
                              {can("orders.update") && (
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Đổi trạng thái
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="min-w-[140px]">
                                    {(["pending", "approved", "recruiting", "filled", "in_progress", "completed"] as OrderStatus[]).map((status) => (
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
                              )}

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
                              {can("orders.update") && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openCancelDialog([order.id], `yêu cầu ${order.order_code}`)
                                    }}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Hủy đơn
                                  </DropdownMenuItem>
                                </>
                              )}
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
                // Show limited page numbers for large datasets
                if (
                  totalPages > 7 &&
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) > 2
                ) {
                  // Show ellipsis at boundaries
                  if (page === 2 && currentPage > 4) {
                    return (
                      <PaginationItem key={page}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    )
                  }
                  if (page === totalPages - 1 && currentPage < totalPages - 3) {
                    return (
                      <PaginationItem key={page}>
                        <span className="px-2 text-muted-foreground">...</span>
                      </PaginationItem>
                    )
                  }
                  return null
                }
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
              disabled={updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
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
