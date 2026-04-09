import { useState, useMemo } from "react"
import { usePermissions } from "@/hooks/use-permissions"
import {
  useAttendancesNew,
  useAttendanceWeeklyReport,
  useAttendanceMonthlyReport,
  useBulkCheckIn,
} from "@/hooks/use-attendance-new"
import type { AttendanceRecord, AttendanceNewStatus } from "@/types"
import type { AttendanceNewFilter } from "@/services/attendance-new.service"
import {
  Card,
  CardContent,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Search,
  Clock,
  UserCheck,
  Users,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ClipboardList,
  AlertTriangle,
  Timer,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Minus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Loader2,
} from "lucide-react"

// ---- Types ----

type SortField = "name" | "order" | "checkIn" | "checkOut" | "hours" | "status"
type SortDir = "asc" | "desc"

// Status mapping from API status to display config
const statusConfig: Record<string, { label: string; icon: React.ReactNode; className: string; sortOrder: number }> = {
  absent: {
    label: "Vắng",
    icon: <XCircle className="h-3.5 w-3.5" />,
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    sortOrder: 0,
  },
  late: {
    label: "Trễ",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    sortOrder: 1,
  },
  half_day: {
    label: "Nửa ngày",
    icon: <Clock className="h-3.5 w-3.5" />,
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    sortOrder: 2,
  },
  excused: {
    label: "Có phép",
    icon: <Minus className="h-3.5 w-3.5" />,
    className: "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
    sortOrder: 3,
  },
  present: {
    label: "Đúng giờ",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    sortOrder: 4,
  },
}

const ratingConfig = {
  good: { label: "Tốt", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  average: { label: "TB", className: "bg-amber-50 text-amber-700 border-amber-200" },
  poor: { label: "Kém", className: "bg-red-50 text-red-700 border-red-200" },
}

// ---- Helpers ----

function getInitials(name: string): string {
  return name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatHours(hours: number | string | null | undefined): string {
  if (hours == null) return "--"
  const num = typeof hours === "string" ? parseFloat(hours) : hours
  if (isNaN(num)) return "--"
  const h = Math.floor(num)
  const m = Math.round((num - h) * 60)
  return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "--:--"
  // Handle both "HH:mm" and "HH:mm:ss" formats
  return timeStr.substring(0, 5)
}

// ---- Subcomponents ----

function StatusBadge({ record }: { record: AttendanceRecord }) {
  // Use status_label from API if available, otherwise fallback to local config
  const config = statusConfig[record.status] ?? statusConfig.present
  const label = record.status_label || config.label
  return (
    <Badge variant="outline" className={`gap-1 text-xs ${config.className}`}>
      {config.icon}
      {label}
    </Badge>
  )
}

function WeekDayCellIcon({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; tip: string }> = {
    present: { icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, tip: "Đúng giờ" },
    late: { icon: <AlertCircle className="h-4 w-4 text-amber-500" />, tip: "Trễ" },
    absent: { icon: <XCircle className="h-4 w-4 text-red-500" />, tip: "Vắng" },
    off: { icon: <Minus className="h-4 w-4 text-gray-300" />, tip: "Nghỉ" },
    pending: { icon: <Clock className="h-4 w-4 text-blue-400" />, tip: "Chưa đến" },
    half_day: { icon: <Timer className="h-4 w-4 text-blue-500" />, tip: "Nửa ngày" },
    excused: { icon: <Minus className="h-4 w-4 text-gray-400" />, tip: "Có phép" },
  }
  const { icon, tip } = map[status] ?? map.pending
  return (
    <Tooltip>
      <TooltipTrigger asChild><span className="inline-flex">{icon}</span></TooltipTrigger>
      <TooltipContent side="top" className="text-xs">{tip}</TooltipContent>
    </Tooltip>
  )
}

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
  return sortDir === "asc"
    ? <ArrowUp className="h-3.5 w-3.5 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 text-primary" />
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-lg border p-3 ${color}`}>
      <div className="shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
      </div>
    </div>
  )
}

function TableSkeleton({ cols, rows = 8 }: { cols: number; rows?: number }) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  )
}

// ---- Main Component ----

export function AttendanceList() {
  const can = usePermissions()

  // Date navigation state
  const [currentDate, setCurrentDate] = useState(new Date())

  // Daily tab filters
  const [searchQuery, setSearchQuery] = useState("")
  const [orderFilter, setOrderFilter] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [sortField, setSortField] = useState<SortField>("status")
  const [sortDir, setSortDir] = useState<SortDir>("asc")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const perPage = 50

  // Weekly/Monthly tab filters
  const [weeklySearch, setWeeklySearch] = useState("")
  const [monthlySearch, setMonthlySearch] = useState("")

  // Build API filter params for daily tab
  const dailyParams: AttendanceNewFilter = {
    page,
    per_page: perPage,
    date: formatDateISO(currentDate),
    ...(orderFilter ? { order_id: orderFilter } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(searchQuery ? { search: searchQuery } : {}),
  }

  // Fetch daily attendance data from API
  const {
    data: dailyResponse,
    isLoading: dailyLoading,
  } = useAttendancesNew(dailyParams)

  const records = dailyResponse?.data ?? []
  const meta = dailyResponse?.meta

  // Fetch weekly report
  const weekStartDate = new Date(currentDate)
  weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay() + 1) // Monday
  const {
    data: weeklyData,
    isLoading: weeklyLoading,
  } = useAttendanceWeeklyReport({ week_start: formatDateISO(weekStartDate) })

  // Fetch monthly report (all workers)
  const {
    data: monthlyData,
    isLoading: monthlyLoading,
  } = useAttendanceMonthlyReport("all", {
    month: String(currentDate.getMonth() + 1),
    year: String(currentDate.getFullYear()),
  })

  // Bulk check-in mutation
  const bulkCheckInMutation = useBulkCheckIn()

  // Date nav
  const goToPrevDay = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() - 1); return n })
  const goToNextDay = () => setCurrentDate((d) => { const n = new Date(d); n.setDate(n.getDate() + 1); return n })
  const goToToday = () => setCurrentDate(new Date())

  // Sort toggle
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortDir("asc")
    }
  }

  // Client-side sorting (API handles filtering/pagination, we sort locally within page)
  const sortedData = useMemo(() => {
    const rows = [...records]
    rows.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case "name":
          cmp = (a.worker?.name ?? "").localeCompare(b.worker?.name ?? "", "vi")
          break
        case "order":
          cmp = (a.staffing_order?.code ?? "").localeCompare(b.staffing_order?.code ?? "")
          break
        case "checkIn":
          cmp = (a.check_in_time ?? "99:99").localeCompare(b.check_in_time ?? "99:99")
          break
        case "checkOut":
          cmp = (a.check_out_time ?? "99:99").localeCompare(b.check_out_time ?? "99:99")
          break
        case "hours":
          cmp = (Number(a.hours_worked) || 0) - (Number(b.hours_worked) || 0)
          break
        case "status": {
          const sa = statusConfig[a.status]?.sortOrder ?? 99
          const sb = statusConfig[b.status]?.sortOrder ?? 99
          cmp = sa - sb
          break
        }
      }
      return sortDir === "asc" ? cmp : -cmp
    })
    return rows
  }, [records, sortField, sortDir])

  // Stats from current page data
  const stats = useMemo(() => {
    const total = meta?.total ?? records.length
    const checkedIn = records.filter((r) => r.check_in_time !== null).length
    const present = records.filter((r) => r.status === "present").length
    const late = records.filter((r) => r.status === "late").length
    const absent = records.filter((r) => r.status === "absent").length
    const noCheckIn = records.filter((r) => r.check_in_time === null && r.status !== "absent" && r.status !== "excused").length
    const uniqueOrders = new Set(records.map((r) => r.staffing_order?.code).filter(Boolean)).size
    return { total, checkedIn, present, late, absent, noCheckIn, uniqueOrders }
  }, [records, meta])

  // Selection helpers
  const isAllSelected = sortedData.length > 0 && selectedRows.size === sortedData.length
  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(sortedData.map((r) => r.id)))
    }
  }
  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleBulkCheckIn = () => {
    if (selectedRows.size === 0) return
    // Collect assignment_ids from selected rows
    const assignmentIds = records
      .filter((r) => selectedRows.has(r.id) && r.assignment_id)
      .map((r) => r.assignment_id)
    if (assignmentIds.length === 0) return
    bulkCheckInMutation.mutate(
      { assignment_ids: assignmentIds, work_date: formatDateISO(currentDate) },
      { onSuccess: () => setSelectedRows(new Set()) },
    )
  }

  const handleExport = () => {
    const header = "Tên\tSĐT\tĐơn hàng\tKhách hàng\tCheck-in\tCheck-out\tGiờ làm\tTrạng thái"
    const rows = sortedData.map((r) => {
      return `${r.worker?.name ?? ""}\t${r.worker?.phone ?? ""}\t${r.staffing_order?.code ?? ""}\t${r.staffing_order?.client ?? ""}\t${formatTime(r.check_in_time)}\t${formatTime(r.check_out_time)}\t${formatHours(r.hours_worked)}\t${r.status_label}`
    })
    navigator.clipboard.writeText([header, ...rows].join("\n")).then(() => {
      // toast handled by clipboard success
    }).catch(() => {
      // ignore
    })
  }

  const clearFilters = () => {
    setSearchQuery("")
    setOrderFilter("")
    setStatusFilter("")
    setPage(1)
  }

  const hasFilters = searchQuery || orderFilter || statusFilter

  // Generate week day labels from current week
  const weekDayLabels = useMemo(() => {
    const labels: string[] = []
    const start = new Date(weekStartDate)
    for (let i = 0; i < 7; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      const dayName = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()]
      labels.push(`${dayName} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`)
    }
    return labels
  }, [weekStartDate])

  // Parse weekly data (structure depends on API response)
  const weeklyRows = useMemo(() => {
    if (!weeklyData) return []
    // The API returns an array of worker weekly summaries
    if (Array.isArray(weeklyData)) {
      let rows = weeklyData as Array<{
        worker: { id: string; name: string; phone: string | null; worker_code: string };
        order_code?: string;
        client?: string;
        days: string[];
        total_present: number;
        total_late: number;
        total_absent: number;
      }>
      if (weeklySearch) {
        const q = weeklySearch.toLowerCase()
        rows = rows.filter((r) =>
          r.worker.name.toLowerCase().includes(q) ||
          (r.worker.phone ?? "").includes(q)
        )
      }
      return rows
    }
    return []
  }, [weeklyData, weeklySearch])

  // Parse monthly data
  const monthlyRows = useMemo(() => {
    if (!monthlyData) return []
    if (Array.isArray(monthlyData)) {
      let rows = monthlyData as Array<{
        worker: { id: string; name: string; phone: string | null; worker_code: string };
        order_code?: string;
        client?: string;
        total_days: number;
        on_time_days: number;
        late_days: number;
        absent_days: number;
        total_hours: number;
        rating?: string;
      }>
      if (monthlySearch) {
        const q = monthlySearch.toLowerCase()
        rows = rows.filter((r) =>
          r.worker.name.toLowerCase().includes(q) ||
          (r.worker.phone ?? "").includes(q)
        )
      }
      return rows
    }
    return []
  }, [monthlyData, monthlySearch])

  // Unique orders for filter dropdown (from current results)
  const orderOptions = useMemo(() => {
    const seen = new Map<string, string>()
    for (const r of records) {
      const code = r.staffing_order?.code
      const client = r.staffing_order?.client
      if (code && !seen.has(code)) {
        seen.set(code, `${code} - ${client ?? ""}`)
      }
    }
    return Array.from(seen, ([code, label]) => ({ code, label }))
  }, [records])

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chấm công</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Quản lý chấm công ứng viên theo ngày
            </p>
          </div>
          {can("attendance.view") && (
            <Button variant="outline" className="gap-1.5" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Xuất báo cáo
            </Button>
          )}
        </div>

        {/* Date navigation */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToPrevDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium capitalize">{formatDate(currentDate)}</span>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={goToNextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-xs h-7 ml-1" onClick={goToToday}>
            Hôm nay
          </Button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            icon={<ClipboardList className="h-5 w-5 text-primary" />}
            label="Đơn hàng"
            value={dailyLoading ? "..." : stats.uniqueOrders}
            color="bg-background"
          />
          <StatCard
            icon={<Users className="h-5 w-5 text-blue-600" />}
            label="Tổng UV"
            value={dailyLoading ? "..." : stats.total}
            color="bg-background"
          />
          <StatCard
            icon={<UserCheck className="h-5 w-5 text-emerald-600" />}
            label="Đúng giờ"
            value={dailyLoading ? "..." : stats.present}
            color="bg-background"
          />
          <StatCard
            icon={<AlertCircle className="h-5 w-5 text-amber-600" />}
            label="Đi trễ"
            value={dailyLoading ? "..." : stats.late}
            color={stats.late > 0 ? "bg-amber-50/50 border-amber-200" : "bg-background"}
          />
          <StatCard
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            label="Vắng mặt"
            value={dailyLoading ? "..." : stats.absent}
            color={stats.absent > 0 ? "bg-red-50/50 border-red-200" : "bg-background"}
          />
          <StatCard
            icon={<AlertTriangle className="h-5 w-5 text-gray-500" />}
            label="Chưa check-in"
            value={dailyLoading ? "..." : stats.noCheckIn}
            color={stats.noCheckIn > 0 ? "bg-gray-50/50 border-gray-200" : "bg-background"}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="daily">
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

          {/* ===== Daily Tab ===== */}
          <TabsContent value="daily" className="mt-4">
            {/* Toolbar */}
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm tên, SĐT, mã đơn, khách hàng..."
                    className="pl-9 h-9"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  />
                </div>
                <Select value={orderFilter} onValueChange={(v) => { setOrderFilter(v === "__all__" ? "" : v); setPage(1) }}>
                  <SelectTrigger className="w-[240px] h-9">
                    <SelectValue placeholder="Tất cả đơn hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tất cả đơn hàng</SelectItem>
                    {orderOptions.map((o) => (
                      <SelectItem key={o.code} value={o.code}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "__all__" ? "" : v); setPage(1) }}>
                  <SelectTrigger className="w-[170px] h-9">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
                    <SelectItem value="present">Đúng giờ</SelectItem>
                    <SelectItem value="late">Đi trễ</SelectItem>
                    <SelectItem value="absent">Vắng mặt</SelectItem>
                    <SelectItem value="half_day">Nửa ngày</SelectItem>
                    <SelectItem value="excused">Có phép</SelectItem>
                  </SelectContent>
                </Select>
                {hasFilters && (
                  <Button variant="ghost" size="sm" className="h-9 gap-1 text-xs text-muted-foreground" onClick={clearFilters}>
                    <RotateCcw className="h-3.5 w-3.5" />
                    Xóa bộ lọc
                  </Button>
                )}
              </div>

              {/* Bulk actions bar */}
              {selectedRows.size > 0 && (
                <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2">
                  <span className="text-sm font-medium">
                    Đã chọn <strong>{selectedRows.size}</strong> ứng viên
                  </span>
                  {can("attendance.checkin") && (
                    <Button
                      size="sm"
                      className="gap-1.5 h-7 text-xs"
                      onClick={handleBulkCheckIn}
                      disabled={bulkCheckInMutation.isPending}
                    >
                      {bulkCheckInMutation.isPending ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Chấm công hàng loạt
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setSelectedRows(new Set())}>
                    Bỏ chọn
                  </Button>
                </div>
              )}
            </div>

            {/* Main table */}
            <Card>
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[40px]">
                        <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} />
                      </TableHead>
                      <TableHead className="w-[50px] text-center text-xs">#</TableHead>
                      <TableHead className="min-w-[180px]">
                        <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("name")}>
                          Ứng viên
                          <SortIcon field="name" sortField={sortField} sortDir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="min-w-[200px]">
                        <button className="flex items-center gap-1 hover:text-foreground transition-colors" onClick={() => toggleSort("order")}>
                          Đơn hàng / Khách hàng
                          <SortIcon field="order" sortField={sortField} sortDir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="w-[90px] text-center">
                        <button className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full" onClick={() => toggleSort("checkIn")}>
                          Check-in
                          <SortIcon field="checkIn" sortField={sortField} sortDir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="w-[90px] text-center">
                        <button className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full" onClick={() => toggleSort("checkOut")}>
                          Check-out
                          <SortIcon field="checkOut" sortField={sortField} sortDir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="w-[80px] text-center">
                        <button className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full" onClick={() => toggleSort("hours")}>
                          Giờ làm
                          <SortIcon field="hours" sortField={sortField} sortDir={sortDir} />
                        </button>
                      </TableHead>
                      <TableHead className="w-[130px] text-center">
                        <button className="flex items-center justify-center gap-1 hover:text-foreground transition-colors w-full" onClick={() => toggleSort("status")}>
                          Trạng thái
                          <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                        </button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  {dailyLoading ? (
                    <TableSkeleton cols={8} />
                  ) : (
                    <TableBody>
                      {sortedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Không tìm thấy ứng viên nào</p>
                            {hasFilters && (
                              <Button variant="link" size="sm" className="mt-1 text-xs" onClick={clearFilters}>
                                Xóa bộ lọc
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedData.map((row, idx) => (
                          <TableRow
                            key={row.id}
                            className={`${selectedRows.has(row.id) ? "bg-primary/5" : ""} ${row.status === "absent" ? "bg-red-50/30 dark:bg-red-500/5" : row.status === "late" ? "bg-amber-50/30 dark:bg-amber-500/5" : ""}`}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedRows.has(row.id)}
                                onCheckedChange={() => toggleRow(row.id)}
                              />
                            </TableCell>
                            <TableCell className="text-center text-xs text-muted-foreground font-mono">
                              {(page - 1) * perPage + idx + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-medium">
                                    {getInitials(row.worker?.name ?? "")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium leading-tight truncate">{row.worker?.name ?? ""}</p>
                                  <p className="text-xs text-muted-foreground">{row.worker?.phone ?? ""}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <Badge variant="outline" className="font-mono text-[10px] shrink-0 px-1.5 py-0">
                                    {row.staffing_order?.code ?? "--"}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground truncate">{row.staffing_order?.position ?? ""}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{row.staffing_order?.client ?? ""}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`text-sm font-mono ${row.check_in_time ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                {formatTime(row.check_in_time)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`text-sm font-mono ${row.check_out_time ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                                {formatTime(row.check_out_time)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`text-sm font-mono ${row.hours_worked ? "text-foreground font-semibold" : "text-muted-foreground"}`}>
                                {formatHours(row.hours_worked)}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <StatusBadge record={row} />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  )}
                </Table>
              </div>
            </Card>

            {/* Pagination + Footer */}
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>
                Hiển thị <strong className="text-foreground">{sortedData.length}</strong> / {meta?.total ?? 0} ứng viên
              </span>
              {meta && meta.last_page > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <span className="px-2 text-xs">
                    Trang {meta.current_page}/{meta.last_page}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    disabled={page >= meta.last_page}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
              <span>
                Tỷ lệ đúng giờ:{" "}
                <strong className={stats.checkedIn > 0 && Math.round((stats.present / stats.checkedIn) * 100) >= 80 ? "text-emerald-600" : "text-amber-600"}>
                  {stats.checkedIn > 0 ? Math.round((stats.present / stats.checkedIn) * 100) : 0}%
                </strong>
              </span>
            </div>
          </TabsContent>

          {/* ===== Weekly Tab ===== */}
          <TabsContent value="weekly" className="mt-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm tên, SĐT..."
                  className="pl-9 h-9"
                  value={weeklySearch}
                  onChange={(e) => setWeeklySearch(e.target.value)}
                />
              </div>
              <div className="ml-auto text-xs text-muted-foreground">
                Tuần {formatDateISO(weekStartDate).substring(5).replace("-", "/")} - {(() => {
                  const end = new Date(weekStartDate)
                  end.setDate(end.getDate() + 6)
                  return formatDateISO(end).substring(5).replace("-", "/")
                })()}/{currentDate.getFullYear()}
              </div>
            </div>

            <Card>
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[50px] text-center text-xs">#</TableHead>
                      <TableHead className="min-w-[170px]">Ứng viên</TableHead>
                      <TableHead className="min-w-[120px]">Đơn hàng</TableHead>
                      {weekDayLabels.map((day) => (
                        <TableHead key={day} className="text-center w-[65px] text-xs">{day}</TableHead>
                      ))}
                      <TableHead className="text-center w-[60px] text-xs">
                        <span className="text-emerald-600">DG</span>
                      </TableHead>
                      <TableHead className="text-center w-[50px] text-xs">
                        <span className="text-amber-600">Trễ</span>
                      </TableHead>
                      <TableHead className="text-center w-[55px] text-xs">
                        <span className="text-red-600">Vắng</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  {weeklyLoading ? (
                    <TableSkeleton cols={13} rows={6} />
                  ) : (
                    <TableBody>
                      {weeklyRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center py-12 text-muted-foreground">
                            <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Không có dữ liệu</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        weeklyRows.map((row, idx) => (
                          <TableRow key={row.worker.id}>
                            <TableCell className="text-center text-xs text-muted-foreground font-mono">
                              {idx + 1}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-7 w-7 shrink-0">
                                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                    {getInitials(row.worker.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium leading-tight truncate">{row.worker.name}</p>
                                  <p className="text-xs text-muted-foreground">{row.worker.phone ?? ""}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                                {row.order_code ?? "--"}
                              </Badge>
                              <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{row.client ?? ""}</p>
                            </TableCell>
                            {(row.days ?? []).map((dayStatus, i) => (
                              <TableCell key={i} className="text-center p-1">
                                <div className="flex items-center justify-center">
                                  <WeekDayCellIcon status={dayStatus} />
                                </div>
                              </TableCell>
                            ))}
                            <TableCell className="text-center">
                              <span className="text-sm font-semibold text-emerald-700">{row.total_present}</span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`text-sm font-semibold ${row.total_late > 0 ? "text-amber-600" : "text-muted-foreground/40"}`}>
                                {row.total_late > 0 ? row.total_late : "-"}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`text-sm font-semibold ${row.total_absent > 0 ? "text-red-600" : "text-muted-foreground/40"}`}>
                                {row.total_absent > 0 ? row.total_absent : "-"}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  )}
                </Table>
              </div>
            </Card>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Đúng giờ</span>
              <span className="flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Trễ</span>
              <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5 text-red-500" /> Vắng</span>
              <span className="flex items-center gap-1"><Minus className="h-3.5 w-3.5 text-gray-300" /> Nghỉ</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-blue-400" /> Chưa đến</span>
              <span className="ml-auto">
                Hiển thị <strong className="text-foreground">{weeklyRows.length}</strong> ứng viên
              </span>
            </div>
          </TabsContent>

          {/* ===== Monthly Tab ===== */}
          <TabsContent value="monthly" className="mt-4">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm tên, SĐT..."
                  className="pl-9 h-9"
                  value={monthlySearch}
                  onChange={(e) => setMonthlySearch(e.target.value)}
                />
              </div>
              <div className="text-sm font-medium ml-2">
                Tháng {String(currentDate.getMonth() + 1).padStart(2, "0")}/{currentDate.getFullYear()}
              </div>
              {can("attendance.view") && (
                <Button variant="outline" size="sm" className="gap-1.5 h-8 text-xs ml-auto" onClick={handleExport}>
                  <Download className="h-3.5 w-3.5" />
                  Xuất Excel
                </Button>
              )}
            </div>

            <Card>
              <div className="rounded-md border-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[50px] text-center text-xs">#</TableHead>
                      <TableHead className="min-w-[170px]">Ứng viên</TableHead>
                      <TableHead className="min-w-[130px]">Đơn hàng</TableHead>
                      <TableHead className="w-[75px] text-center">Tổng ngày</TableHead>
                      <TableHead className="w-[75px] text-center">Đúng giờ</TableHead>
                      <TableHead className="w-[60px] text-center">Trễ</TableHead>
                      <TableHead className="w-[60px] text-center">Vắng</TableHead>
                      <TableHead className="w-[80px] text-center">Tổng giờ</TableHead>
                      <TableHead className="w-[80px] text-center">Đánh giá</TableHead>
                    </TableRow>
                  </TableHeader>
                  {monthlyLoading ? (
                    <TableSkeleton cols={9} rows={6} />
                  ) : (
                    <TableBody>
                      {monthlyRows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                            <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-40" />
                            <p className="text-sm">Không có dữ liệu</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        monthlyRows.map((row, idx) => {
                          const rating = (row.rating ?? "average") as keyof typeof ratingConfig
                          const rc = ratingConfig[rating] ?? ratingConfig.average
                          return (
                            <TableRow key={row.worker.id + (row.order_code ?? idx)}>
                              <TableCell className="text-center text-xs text-muted-foreground font-mono">
                                {idx + 1}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7 shrink-0">
                                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                                      {getInitials(row.worker.name)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="min-w-0">
                                    <p className="text-sm font-medium leading-tight truncate">{row.worker.name}</p>
                                    <p className="text-xs text-muted-foreground">{row.worker.phone ?? ""}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0">
                                  {row.order_code ?? "--"}
                                </Badge>
                                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{row.client ?? ""}</p>
                              </TableCell>
                              <TableCell className="text-center font-semibold">{row.total_days}</TableCell>
                              <TableCell className="text-center text-emerald-600 font-semibold">{row.on_time_days}</TableCell>
                              <TableCell className="text-center">
                                <span className={`font-semibold ${row.late_days > 0 ? "text-amber-600" : "text-muted-foreground/40"}`}>
                                  {row.late_days > 0 ? row.late_days : "-"}
                                </span>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={`font-semibold ${row.absent_days > 0 ? "text-red-600" : "text-muted-foreground/40"}`}>
                                  {row.absent_days > 0 ? row.absent_days : "-"}
                                </span>
                              </TableCell>
                              <TableCell className="text-center font-mono text-sm font-medium">{formatHours(row.total_hours)}</TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className={`text-xs ${rc.className}`}>{rc.label}</Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  )}
                </Table>
              </div>
            </Card>

            {/* Monthly footer */}
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>
                  Tổng ngày công: <strong className="text-foreground">{monthlyRows.reduce((s, r) => s + r.total_days, 0)}</strong>
                </span>
                <span>
                  Ứng viên: <strong className="text-foreground">{monthlyRows.length}</strong>
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
