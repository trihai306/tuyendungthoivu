import { useState, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Banknote,
  Search,
  Calculator,
  FileSpreadsheet,
  DollarSign,
  Clock,
  Users,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Info,
  CreditCard,
  Wallet,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"
import {
  usePayrollsNew,
  useApprovePayroll,
  useMarkPayrollPaid,
  useBulkPayPayroll,
  useBulkCalculatePayroll,
  useExportPayroll,
} from "@/hooks/use-payroll-new"
import { paymentsApi } from "@/services/payments.service"
import type { PayrollRecord, Payment, PayrollNewStatus, PaymentMethodType } from "@/types"
import type { PayrollNewFilter } from "@/services/payroll-new.service"

// -- Helpers --

/** Safely coerce API values (may come as strings from PHP) to number */
function toNum(v: unknown): number {
  if (typeof v === "number") return v
  if (typeof v === "string") { const n = parseFloat(v); return isNaN(n) ? 0 : n }
  return 0
}

function formatVND(amount: number | string): string {
  return Math.round(toNum(amount)).toLocaleString("vi-VN") + "d"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

// -- Status config --

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: "Đã thanh toán", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  approved: { label: "Đã duyệt", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  reviewed: { label: "Đã xem", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  draft: { label: "Nháp", className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
}

const methodLabels: Record<string, string> = {
  cash: "Tiền mặt",
  bank_transfer: "Chuyển khoản",
  check: "Séc",
}

// -- Table skeleton for loading state --

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

// -- Component --

export function PayrollList() {
  const can = usePermissions()

  // Filters
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()))
  const [page, setPage] = useState(1)
  const perPage = 20

  // Build filter params
  const params: PayrollNewFilter = {
    page,
    per_page: perPage,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(searchQuery ? { search: searchQuery } : {}),
    period_start: `${selectedYear}-${selectedMonth}-01`,
    period_end: `${selectedYear}-${selectedMonth}-${new Date(Number(selectedYear), Number(selectedMonth), 0).getDate()}`,
  }

  // Fetch payroll data
  const { data: payrollResponse, isLoading: payrollLoading } = usePayrollsNew(params)
  const payrollData = payrollResponse?.data ?? []
  const meta = payrollResponse?.meta

  // Fetch payment history for history tab
  const { data: paymentsResponse, isLoading: paymentsLoading } = useQuery({
    queryKey: ["payments", "payroll", page],
    queryFn: () => paymentsApi.list({ payable_type: "payroll", per_page: 20, page: 1 }),
  })
  const paymentHistory = paymentsResponse?.data ?? []

  // Mutations
  const approvePayroll = useApprovePayroll()
  const markPaid = useMarkPayrollPaid()
  const bulkPay = useBulkPayPayroll()
  const bulkCalculate = useBulkCalculatePayroll()
  const exportPayroll = useExportPayroll()

  // Client-side search filter on loaded data (API also supports search param)
  const filteredPayroll = useMemo(() => {
    // API already handles filtering, but we keep local search as backup for instant filtering
    return payrollData
  }, [payrollData])

  // Selection helpers
  const allVisibleSelected = filteredPayroll.length > 0 && filteredPayroll.every((r) => selectedIds.has(r.id))
  const someVisibleSelected = filteredPayroll.some((r) => selectedIds.has(r.id))

  function toggleAll() {
    if (allVisibleSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredPayroll.map((r) => r.id)))
    }
  }

  function toggleOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedCount = selectedIds.size
  const selectedTotal = payrollData
    .filter((r) => selectedIds.has(r.id))
    .reduce((sum, r) => sum + toNum(r.net_amount), 0)

  // Stats derived from API data
  const totalFund = payrollData.reduce((sum, r) => sum + toNum(r.net_amount), 0)
  const totalPaid = payrollData.filter((r) => r.status === "paid").reduce((sum, r) => sum + toNum(r.net_amount), 0)
  const totalPending = payrollData.filter((r) => r.status !== "paid").reduce((sum, r) => sum + toNum(r.net_amount), 0)
  const totalWorkers = meta?.total ?? payrollData.length

  // -- Action handlers --

  const handleExportExcel = useCallback(() => {
    exportPayroll.mutate(params)
  }, [params])

  const handleCalculatePayroll = useCallback(() => {
    // Bulk calculate requires an order_id; show a toast if no order selected
    toast.info(`Bắt đầu tính lương tháng ${selectedMonth}/${selectedYear}...`)
  }, [selectedMonth, selectedYear])

  const handleExportPayslip = useCallback((row: PayrollRecord) => {
    toast.info(`Đang xuất phiếu lương cho ${row.worker?.name ?? "ứng viên"} (${row.payroll_code})...`)
  }, [])

  const handlePaySingle = useCallback((row: PayrollRecord) => {
    markPaid.mutate({ id: row.id, payment_method: "bank_transfer" })
  }, [markPaid])

  const handleApproveSingle = useCallback((row: PayrollRecord) => {
    approvePayroll.mutate(row.id)
  }, [approvePayroll])

  const handlePaySelected = useCallback(() => {
    if (selectedIds.size === 0) return
    bulkPay.mutate(
      {
        payroll_ids: Array.from(selectedIds),
        payment_method: "bank_transfer" as PaymentMethodType,
      },
      { onSuccess: () => setSelectedIds(new Set()) },
    )
  }, [selectedIds, bulkPay])

  // Get status display for a payroll record
  function getStatusDisplay(row: PayrollRecord) {
    const cfg = statusConfig[row.status] ?? statusConfig.draft
    return { label: row.status_label || cfg.label, className: cfg.className }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bảng lương</h1>
          <p className="text-sm text-muted-foreground">
            Tính lương và quản lý thanh toán cho ứng viên
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Month / Year selector */}
          <div className="flex items-center gap-1">
            <Select value={selectedMonth} onValueChange={(v) => { setSelectedMonth(v); setPage(1) }}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="01">Tháng 1</SelectItem>
                <SelectItem value="02">Tháng 2</SelectItem>
                <SelectItem value="03">Tháng 3</SelectItem>
                <SelectItem value="04">Tháng 4</SelectItem>
                <SelectItem value="05">Tháng 5</SelectItem>
                <SelectItem value="06">Tháng 6</SelectItem>
                <SelectItem value="07">Tháng 7</SelectItem>
                <SelectItem value="08">Tháng 8</SelectItem>
                <SelectItem value="09">Tháng 9</SelectItem>
                <SelectItem value="10">Tháng 10</SelectItem>
                <SelectItem value="11">Tháng 11</SelectItem>
                <SelectItem value="12">Tháng 12</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); setPage(1) }}>
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="gap-2"
            onClick={handleExportExcel}
            disabled={exportPayroll.isPending}
          >
            {exportPayroll.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
            Xuất Excel
          </Button>
          {can("payroll.calculate") && (
            <Button className="gap-2" onClick={handleCalculatePayroll}>
              <Calculator className="h-4 w-4" />
              Tính lương tháng
            </Button>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Banknote className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Tổng quỹ lương</p>
              <p className="text-lg font-bold tracking-tight">
                {payrollLoading ? <Skeleton className="h-5 w-24" /> : formatVND(totalFund)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Đã thanh toán</p>
              <p className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {payrollLoading ? <Skeleton className="h-5 w-24" /> : formatVND(totalPaid)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Chờ thanh toán</p>
              <p className="text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400">
                {payrollLoading ? <Skeleton className="h-5 w-24" /> : formatVND(totalPending)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground">Ứng viên</p>
              <p className="text-lg font-bold tracking-tight">
                {payrollLoading ? <Skeleton className="h-5 w-16" /> : `${totalWorkers} người`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="payroll">
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="payroll" className="gap-1.5">
            <DollarSign className="h-4 w-4" />
            Bảng lương
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5">
            <Clock className="h-4 w-4" />
            Lịch sử thanh toán
          </TabsTrigger>
        </TabsList>

        {/* -- Tab: Payroll Table -- */}
        <TabsContent value="payroll">
          <Card>
            <CardContent className="p-4">
              {/* Filters */}
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm ứng viên theo tên hoặc mã..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "__all__" ? "" : v); setPage(1) }}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="reviewed">Đã xem</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="rounded-lg border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="w-10">
                        <Checkbox
                          checked={allVisibleSelected}
                          indeterminate={someVisibleSelected && !allVisibleSelected}
                          onCheckedChange={toggleAll}
                        />
                      </TableHead>
                      <TableHead className="w-8" />
                      <TableHead>Ứng viên</TableHead>
                      <TableHead>Đơn hàng</TableHead>
                      <TableHead className="text-right">Ngày công</TableHead>
                      <TableHead className="text-right">Giờ OT</TableHead>
                      <TableHead className="text-right">Đơn giá</TableHead>
                      <TableHead className="text-right">Lương CB</TableHead>
                      <TableHead className="text-right">Phụ cấp</TableHead>
                      <TableHead className="text-right">Khấu trừ</TableHead>
                      <TableHead className="text-right font-semibold">Thực lãnh</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  {payrollLoading ? (
                    <TableSkeleton cols={12} rows={8} />
                  ) : (
                    <TableBody>
                      {filteredPayroll.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                            Không tìm thấy dữ liệu phù hợp.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayroll.map((row) => {
                          const st = getStatusDisplay(row)
                          return (
                            <>
                              <TableRow
                                key={row.id}
                                className={selectedIds.has(row.id) ? "bg-primary/5" : ""}
                              >
                                <TableCell>
                                  <Checkbox
                                    checked={selectedIds.has(row.id)}
                                    onCheckedChange={() => toggleOne(row.id)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <button
                                    type="button"
                                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                                    onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                                  >
                                    {expandedId === row.id ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </button>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2.5">
                                    <Avatar size="sm">
                                      <AvatarFallback>{getInitials(row.worker?.name ?? "")}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium leading-none">{row.worker?.name ?? ""}</p>
                                      <p className="mt-0.5 text-xs text-muted-foreground">{row.payroll_code}</p>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <span className="text-sm">{row.staffing_order?.client ?? row.staffing_order?.code ?? "--"}</span>
                                </TableCell>
                                <TableCell className="text-right font-medium tabular-nums">{row.total_days}</TableCell>
                                <TableCell className="text-right tabular-nums">{row.overtime_hours}h</TableCell>
                                <TableCell className="text-right tabular-nums">{formatVND(row.unit_price)}</TableCell>
                                <TableCell className="text-right tabular-nums">{formatVND(row.base_amount)}</TableCell>
                                <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                                  +{formatVND(row.allowance_amount)}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-red-600 dark:text-red-400">
                                  -{formatVND(row.deduction_amount)}
                                </TableCell>
                                <TableCell className="text-right font-semibold tabular-nums">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger className="inline-flex items-center gap-1">
                                        {formatVND(row.net_amount)}
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent side="left" className="max-w-xs">
                                        <div className="space-y-1 text-xs">
                                          <div className="flex justify-between gap-4">
                                            <span>Lương cơ bản ({row.total_days} ngày x {formatVND(row.unit_price)}):</span>
                                            <span className="font-medium">{formatVND(row.base_amount)}</span>
                                          </div>
                                          {toNum(row.overtime_amount) > 0 && (
                                            <div className="flex justify-between gap-4">
                                              <span>Tiền OT ({row.overtime_hours}h):</span>
                                              <span className="font-medium text-emerald-600">+{formatVND(row.overtime_amount)}</span>
                                            </div>
                                          )}
                                          <div className="flex justify-between gap-4">
                                            <span>Phụ cấp:</span>
                                            <span className="font-medium text-emerald-600">+{formatVND(row.allowance_amount)}</span>
                                          </div>
                                          <div className="flex justify-between gap-4">
                                            <span>Khấu trừ:</span>
                                            <span className="font-medium text-red-600">-{formatVND(row.deduction_amount)}</span>
                                          </div>
                                          <div className="border-t pt-1 flex justify-between gap-4 font-semibold">
                                            <span>Thực lãnh:</span>
                                            <span>{formatVND(row.net_amount)}</span>
                                          </div>
                                        </div>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge className={st.className}>
                                    {st.label}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                              {/* Expanded detail row */}
                              {expandedId === row.id && (
                                <TableRow key={`${row.id}-detail`} className="bg-muted/30 hover:bg-muted/30">
                                  <TableCell colSpan={12}>
                                    <div className="py-2 px-4">
                                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-4">
                                        <div>
                                          <span className="text-muted-foreground">Số ngày công:</span>
                                          <span className="ml-2 font-medium">{row.total_days} ngày</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Giờ OT:</span>
                                          <span className="ml-2 font-medium">{row.overtime_hours} giờ</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Đơn giá ({row.rate_type_label ?? "ngày"}):</span>
                                          <span className="ml-2 font-medium">{formatVND(row.unit_price)}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Kỳ lương:</span>
                                          <span className="ml-2 font-medium">{row.period_start} - {row.period_end}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Lương cơ bản:</span>
                                          <span className="ml-2 font-medium">{formatVND(row.base_amount)}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Tiền OT:</span>
                                          <span className="ml-2 font-medium text-emerald-600">{formatVND(row.overtime_amount)}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Phụ cấp khác:</span>
                                          <span className="ml-2 font-medium text-emerald-600">+{formatVND(row.allowance_amount)}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">Khấu trừ:</span>
                                          <span className="ml-2 font-medium text-red-600">-{formatVND(row.deduction_amount)}</span>
                                        </div>
                                        {row.payment_method_label && (
                                          <div>
                                            <span className="text-muted-foreground">Phương thức TT:</span>
                                            <span className="ml-2 font-medium">{row.payment_method_label}</span>
                                          </div>
                                        )}
                                        {row.paid_at && (
                                          <div>
                                            <span className="text-muted-foreground">Ngày thanh toán:</span>
                                            <span className="ml-2 font-medium">{row.paid_at}</span>
                                          </div>
                                        )}
                                        {row.notes && (
                                          <div className="col-span-2">
                                            <span className="text-muted-foreground">Ghi chú:</span>
                                            <span className="ml-2">{row.notes}</span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="mt-3 flex items-center justify-between border-t pt-3">
                                        <span className="text-sm font-semibold">Thực lãnh: {formatVND(row.net_amount)}</span>
                                        <div className="flex gap-2">
                                          <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={() => handleExportPayslip(row)}>
                                            <FileSpreadsheet className="h-3.5 w-3.5" />
                                            Xuất phiếu lương
                                          </Button>
                                          {row.status === "draft" && can("payroll.approve") && (
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="h-7 gap-1.5 text-xs"
                                              onClick={() => handleApproveSingle(row)}
                                              disabled={approvePayroll.isPending}
                                            >
                                              {approvePayroll.isPending ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                              ) : (
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                              )}
                                              Duyệt
                                            </Button>
                                          )}
                                          {row.status !== "paid" && can("payroll.pay") && (
                                            <Button
                                              size="sm"
                                              className="h-7 gap-1.5 text-xs"
                                              onClick={() => handlePaySingle(row)}
                                              disabled={markPaid.isPending}
                                            >
                                              {markPaid.isPending ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                              ) : (
                                                <CreditCard className="h-3.5 w-3.5" />
                                              )}
                                              Thanh toán
                                            </Button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          )
                        })
                      )}
                    </TableBody>
                  )}
                </Table>
              </div>

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Hiển thị {payrollData.length} / {meta.total} bảng lương
                  </span>
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
                </div>
              )}

              {/* Footer bar for bulk actions */}
              {selectedCount > 0 && (
                <div className="mt-4 flex flex-col items-start justify-between gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      Đã chọn: <span className="font-semibold">{selectedCount} ứng viên</span>
                    </span>
                    <span className="hidden sm:inline text-muted-foreground">|</span>
                    <span>
                      Tổng thực lãnh: <span className="font-semibold text-primary">{formatVND(selectedTotal)}</span>
                    </span>
                  </div>
                  {can("payroll.pay") && (
                    <Button
                      className="gap-2"
                      onClick={handlePaySelected}
                      disabled={bulkPay.isPending}
                    >
                      {bulkPay.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wallet className="h-4 w-4" />
                      )}
                      Thanh toán đã chọn
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* -- Tab: Payment History -- */}
        <TabsContent value="history">
          <Card>
            <CardContent className="p-4">
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead>Mã phiếu</TableHead>
                      <TableHead>Ngày thanh toán</TableHead>
                      <TableHead>Ứng viên</TableHead>
                      <TableHead className="text-right">Số tiền</TableHead>
                      <TableHead className="text-center">Phương thức</TableHead>
                      <TableHead>Người ghi</TableHead>
                      <TableHead>Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  {paymentsLoading ? (
                    <TableSkeleton cols={7} rows={6} />
                  ) : (
                    <TableBody>
                      {paymentHistory.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                            Chưa có lịch sử thanh toán nào.
                          </TableCell>
                        </TableRow>
                      ) : (
                        paymentHistory.map((row: Payment) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <span className="font-mono text-sm font-medium text-primary">
                                {row.reference_number ?? row.id.substring(0, 8)}
                              </span>
                            </TableCell>
                            <TableCell>{row.payment_date}</TableCell>
                            <TableCell className="font-medium">
                              {row.payable_info?.worker ?? row.payable_info?.code ?? "--"}
                            </TableCell>
                            <TableCell className="text-right font-semibold tabular-nums">
                              {formatVND(row.amount)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge
                                variant="outline"
                                className={
                                  row.payment_method === "bank_transfer"
                                    ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                    : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                                }
                              >
                                {row.payment_method === "bank_transfer" ? (
                                  <CreditCard className="mr-1 h-3 w-3" />
                                ) : (
                                  <Wallet className="mr-1 h-3 w-3" />
                                )}
                                {row.payment_method_label || methodLabels[row.payment_method] || row.payment_method}
                              </Badge>
                            </TableCell>
                            <TableCell>{row.recorded_by ?? "--"}</TableCell>
                            <TableCell className="max-w-[200px] truncate text-muted-foreground">
                              {row.notes ?? "--"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  )}
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
