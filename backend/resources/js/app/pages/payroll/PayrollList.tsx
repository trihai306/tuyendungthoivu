import { useState, useMemo, useCallback } from "react"
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
  Info,
  CreditCard,
  Wallet,
} from "lucide-react"
import { toast } from "sonner"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ"
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
}

// ── Types ────────────────────────────────────────────────────────────────────

type PayrollStatus = "paid" | "pending" | "processing"
type PaymentMethod = "cash" | "bank_transfer"

interface PayrollRow {
  id: string
  worker: { name: string; avatar?: string; code: string }
  customer: string
  workDays: number
  otHours: number
  dailyRate: number
  baseSalary: number
  allowance: number
  deduction: number
  netPay: number
  status: PayrollStatus
}

interface PaymentHistory {
  id: string
  receiptCode: string
  date: string
  workerName: string
  amount: number
  method: PaymentMethod
  approver: string
  note: string
}

// ── Status config ────────────────────────────────────────────────────────────

const statusConfig: Record<PayrollStatus, { label: string; className: string }> = {
  paid: { label: "Đã thanh toán", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  pending: { label: "Chờ thanh toán", className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
}

const methodLabels: Record<PaymentMethod, string> = {
  cash: "Tiền mặt",
  bank_transfer: "Chuyển khoản",
}

// ── Mock data ────────────────────────────────────────────────────────────────

const initialPayroll: PayrollRow[] = [
  { id: "1", worker: { name: "Nguyễn Văn An", code: "NV-001" }, customer: "Công ty TNHH Samsung HCMC", workDays: 26, otHours: 12, dailyRate: 350000, baseSalary: 9100000, allowance: 800000, deduction: 350000, netPay: 9550000, status: "paid" },
  { id: "2", worker: { name: "Trần Thị Bích", code: "NV-002" }, customer: "Công ty CP Nidec Việt Nam", workDays: 24, otHours: 8, dailyRate: 320000, baseSalary: 7680000, allowance: 600000, deduction: 200000, netPay: 8080000, status: "paid" },
  { id: "3", worker: { name: "Lê Hoàng Cường", code: "NV-003" }, customer: "Công ty TNHH Samsung HCMC", workDays: 25, otHours: 16, dailyRate: 380000, baseSalary: 9500000, allowance: 1200000, deduction: 400000, netPay: 10300000, status: "pending" },
  { id: "4", worker: { name: "Phạm Minh Dũng", code: "NV-004" }, customer: "Công ty TNHH Jabil Việt Nam", workDays: 22, otHours: 6, dailyRate: 300000, baseSalary: 6600000, allowance: 500000, deduction: 150000, netPay: 6950000, status: "processing" },
  { id: "5", worker: { name: "Võ Thị E", code: "NV-005" }, customer: "Công ty CP Nidec Việt Nam", workDays: 26, otHours: 20, dailyRate: 340000, baseSalary: 8840000, allowance: 1000000, deduction: 300000, netPay: 9540000, status: "paid" },
  { id: "6", worker: { name: "Hoàng Văn Phúc", code: "NV-006" }, customer: "Công ty TNHH Foxconn Bắc Giang", workDays: 23, otHours: 10, dailyRate: 360000, baseSalary: 8280000, allowance: 750000, deduction: 280000, netPay: 8750000, status: "pending" },
  { id: "7", worker: { name: "Đặng Thị G", code: "NV-007" }, customer: "Công ty TNHH Foxconn Bắc Giang", workDays: 20, otHours: 4, dailyRate: 310000, baseSalary: 6200000, allowance: 400000, deduction: 180000, netPay: 6420000, status: "paid" },
  { id: "8", worker: { name: "Bùi Quang Hưng", code: "NV-008" }, customer: "Công ty CP Canon Việt Nam", workDays: 26, otHours: 18, dailyRate: 370000, baseSalary: 9620000, allowance: 1100000, deduction: 350000, netPay: 10370000, status: "pending" },
  { id: "9", worker: { name: "Nguyễn Thị I", code: "NV-009" }, customer: "Công ty CP Canon Việt Nam", workDays: 25, otHours: 14, dailyRate: 330000, baseSalary: 8250000, allowance: 850000, deduction: 250000, netPay: 8850000, status: "paid" },
  { id: "10", worker: { name: "Trần Văn Kỳ", code: "NV-010" }, customer: "Công ty TNHH Samsung HCMC", workDays: 21, otHours: 8, dailyRate: 350000, baseSalary: 7350000, allowance: 600000, deduction: 200000, netPay: 7750000, status: "processing" },
  { id: "11", worker: { name: "Lý Thị Lâm", code: "NV-011" }, customer: "Công ty TNHH Jabil Việt Nam", workDays: 26, otHours: 22, dailyRate: 340000, baseSalary: 8840000, allowance: 1300000, deduction: 400000, netPay: 9740000, status: "paid" },
  { id: "12", worker: { name: "Vương Văn Minh", code: "NV-012" }, customer: "Công ty CP Nidec Việt Nam", workDays: 24, otHours: 10, dailyRate: 360000, baseSalary: 8640000, allowance: 750000, deduction: 300000, netPay: 9090000, status: "pending" },
  { id: "13", worker: { name: "Đoàn Thị Ngân", code: "NV-013" }, customer: "Công ty TNHH Foxconn Bắc Giang", workDays: 25, otHours: 6, dailyRate: 320000, baseSalary: 8000000, allowance: 500000, deduction: 220000, netPay: 8280000, status: "paid" },
  { id: "14", worker: { name: "Cao Văn Phát", code: "NV-014" }, customer: "Công ty CP Canon Việt Nam", workDays: 22, otHours: 12, dailyRate: 380000, baseSalary: 8360000, allowance: 900000, deduction: 350000, netPay: 8910000, status: "processing" },
  { id: "15", worker: { name: "Huỳnh Thị Quế", code: "NV-015" }, customer: "Công ty TNHH Samsung HCMC", workDays: 26, otHours: 15, dailyRate: 350000, baseSalary: 9100000, allowance: 950000, deduction: 300000, netPay: 9750000, status: "pending" },
]

const mockPaymentHistory: PaymentHistory[] = [
  { id: "1", receiptCode: "PL-2026-04-001", date: "05/04/2026", workerName: "Nguyễn Văn An", amount: 9550000, method: "bank_transfer", approver: "Trần Văn Sơn", note: "Lương tháng 3/2026" },
  { id: "2", receiptCode: "PL-2026-04-002", date: "05/04/2026", workerName: "Trần Thị Bích", amount: 8080000, method: "bank_transfer", approver: "Trần Văn Sơn", note: "Lương tháng 3/2026" },
  { id: "3", receiptCode: "PL-2026-04-003", date: "05/04/2026", workerName: "Võ Thị E", amount: 9540000, method: "bank_transfer", approver: "Trần Văn Sơn", note: "Lương tháng 3/2026" },
  { id: "4", receiptCode: "PL-2026-04-004", date: "06/04/2026", workerName: "Đặng Thị G", amount: 6420000, method: "cash", approver: "Lê Thị Hạnh", note: "Lương tháng 3/2026 - nhận tiền mặt" },
  { id: "5", receiptCode: "PL-2026-04-005", date: "06/04/2026", workerName: "Nguyễn Thị I", amount: 8850000, method: "bank_transfer", approver: "Trần Văn Sơn", note: "Lương tháng 3/2026" },
  { id: "6", receiptCode: "PL-2026-04-006", date: "06/04/2026", workerName: "Lý Thị Lâm", amount: 9740000, method: "bank_transfer", approver: "Trần Văn Sơn", note: "Lương tháng 3/2026" },
  { id: "7", receiptCode: "PL-2026-04-007", date: "07/04/2026", workerName: "Đoàn Thị Ngân", amount: 8280000, method: "bank_transfer", approver: "Lê Thị Hạnh", note: "Lương tháng 3/2026" },
  { id: "8", receiptCode: "PL-2026-04-008", date: "07/04/2026", workerName: "Nguyễn Văn An", amount: 2000000, method: "cash", approver: "Lê Thị Hạnh", note: "Tạm ứng giữa tháng 4" },
  { id: "9", receiptCode: "PL-2026-04-009", date: "07/04/2026", workerName: "Lê Hoàng Cường", amount: 3000000, method: "cash", approver: "Trần Văn Sơn", note: "Tạm ứng giữa tháng 4" },
  { id: "10", receiptCode: "PL-2026-04-010", date: "08/04/2026", workerName: "Bùi Quang Hưng", amount: 5000000, method: "bank_transfer", approver: "Trần Văn Sơn", note: "Tạm ứng nhu cầu cá nhân" },
]

const customers = [
  "Công ty TNHH Samsung HCMC",
  "Công ty CP Nidec Việt Nam",
  "Công ty TNHH Jabil Việt Nam",
  "Công ty TNHH Foxconn Bắc Giang",
  "Công ty CP Canon Việt Nam",
]

// ── Component ────────────────────────────────────────────────────────────────

export function PayrollList() {
  const [payrollData, setPayrollData] = useState<PayrollRow[]>(initialPayroll)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [customerFilter, setCustomerFilter] = useState<string>("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedMonth] = useState("04")
  const [selectedYear] = useState("2026")

  // Filtered payroll data
  const filteredPayroll = useMemo(() => {
    return payrollData.filter((row) => {
      const matchesSearch =
        !searchQuery ||
        row.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.worker.code.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = !statusFilter || row.status === statusFilter
      const matchesCustomer = !customerFilter || row.customer === customerFilter
      return matchesSearch && matchesStatus && matchesCustomer
    })
  }, [payrollData, searchQuery, statusFilter, customerFilter])

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
    .reduce((sum, r) => sum + r.netPay, 0)

  // Stats derived from state
  const totalFund = payrollData.reduce((sum, r) => sum + r.netPay, 0)
  const totalPaid = payrollData.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.netPay, 0)
  const totalPending = payrollData.filter((r) => r.status !== "paid").reduce((sum, r) => sum + r.netPay, 0)
  const totalWorkers = payrollData.length

  // ── Action handlers ──────────────────────────────────────────────────────

  const handleExportExcel = useCallback(() => {
    const header = "Mã NV\tỨng viên\tKhách hàng\tNgày công\tGiờ OT\tĐơn giá/ngày\tLương CB\tPhụ cấp\tKhấu trừ\tThực lãnh\tTrạng thái"
    const rows = payrollData.map((r) =>
      `${r.worker.code}\t${r.worker.name}\t${r.customer}\t${r.workDays}\t${r.otHours}\t${r.dailyRate}\t${r.baseSalary}\t${r.allowance}\t${r.deduction}\t${r.netPay}\t${statusConfig[r.status].label}`
    )
    const text = [header, ...rows].join("\n")
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Đã sao chép dữ liệu bảng lương vào clipboard")
    }).catch(() => {
      toast.error("Không thể sao chép dữ liệu")
    })
  }, [payrollData])

  const handleCalculatePayroll = useCallback(() => {
    toast.success(`Đã tính lương tháng ${selectedMonth}/${selectedYear} cho ${totalWorkers} ứng viên`)
  }, [selectedMonth, selectedYear, totalWorkers])

  const handleExportPayslip = useCallback((row: PayrollRow) => {
    toast.info(`Đang xuất phiếu lương cho ${row.worker.name} (${row.worker.code})...`)
  }, [])

  const handlePaySingle = useCallback((id: string) => {
    setPayrollData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "paid" as PayrollStatus } : r))
    )
    const worker = payrollData.find((r) => r.id === id)
    toast.success(`Đã thanh toán cho ${worker?.worker.name ?? "ứng viên"}`)
  }, [payrollData])

  const handlePaySelected = useCallback(() => {
    if (selectedIds.size === 0) return
    setPayrollData((prev) =>
      prev.map((r) => (selectedIds.has(r.id) ? { ...r, status: "paid" as PayrollStatus } : r))
    )
    toast.success(`Đã thanh toán cho ${selectedIds.size} ứng viên`)
    setSelectedIds(new Set())
  }, [selectedIds])

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
            <Select defaultValue={selectedMonth}>
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
            <Select defaultValue={selectedYear}>
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Xuất Excel
          </Button>
          <Button className="gap-2" onClick={handleCalculatePayroll}>
            <Calculator className="h-4 w-4" />
            Tính lương tháng
          </Button>
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
              <p className="text-lg font-bold tracking-tight">{formatVND(totalFund)}</p>
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
              <p className="text-lg font-bold tracking-tight text-emerald-600 dark:text-emerald-400">{formatVND(totalPaid)}</p>
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
              <p className="text-lg font-bold tracking-tight text-amber-600 dark:text-amber-400">{formatVND(totalPending)}</p>
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
              <p className="text-lg font-bold tracking-tight">{totalWorkers} người</p>
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

        {/* ── Tab: Payroll Table ── */}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "__all__" ? "" : v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
                    <SelectItem value="paid">Đã thanh toán</SelectItem>
                    <SelectItem value="pending">Chờ thanh toán</SelectItem>
                    <SelectItem value="processing">Đang xử lý</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={customerFilter} onValueChange={(v) => setCustomerFilter(v === "__all__" ? "" : v)}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Tất cả khách hàng</SelectItem>
                    {customers.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
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
                      <TableHead>Khách hàng</TableHead>
                      <TableHead className="text-right">Ngày công</TableHead>
                      <TableHead className="text-right">Giờ OT</TableHead>
                      <TableHead className="text-right">Đơn giá/ngày</TableHead>
                      <TableHead className="text-right">Lương CB</TableHead>
                      <TableHead className="text-right">Phụ cấp</TableHead>
                      <TableHead className="text-right">Khấu trừ</TableHead>
                      <TableHead className="text-right font-semibold">Thực lãnh</TableHead>
                      <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="h-24 text-center text-muted-foreground">
                          Không tìm thấy dữ liệu phù hợp.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayroll.map((row) => (
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
                                  {row.worker.avatar ? (
                                    <AvatarImage src={row.worker.avatar} />
                                  ) : null}
                                  <AvatarFallback>{getInitials(row.worker.name)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium leading-none">{row.worker.name}</p>
                                  <p className="mt-0.5 text-xs text-muted-foreground">{row.worker.code}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">{row.customer}</span>
                            </TableCell>
                            <TableCell className="text-right font-medium tabular-nums">{row.workDays}</TableCell>
                            <TableCell className="text-right tabular-nums">{row.otHours}h</TableCell>
                            <TableCell className="text-right tabular-nums">{formatVND(row.dailyRate)}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatVND(row.baseSalary)}</TableCell>
                            <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                              +{formatVND(row.allowance)}
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-red-600 dark:text-red-400">
                              -{formatVND(row.deduction)}
                            </TableCell>
                            <TableCell className="text-right font-semibold tabular-nums">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="inline-flex items-center gap-1">
                                    {formatVND(row.netPay)}
                                    <Info className="h-3 w-3 text-muted-foreground" />
                                  </TooltipTrigger>
                                  <TooltipContent side="left" className="max-w-xs">
                                    <div className="space-y-1 text-xs">
                                      <div className="flex justify-between gap-4">
                                        <span>Lương cơ bản ({row.workDays} ngày x {formatVND(row.dailyRate)}):</span>
                                        <span className="font-medium">{formatVND(row.baseSalary)}</span>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <span>Phụ cấp:</span>
                                        <span className="font-medium text-emerald-600">+{formatVND(row.allowance)}</span>
                                      </div>
                                      <div className="flex justify-between gap-4">
                                        <span>Khấu trừ:</span>
                                        <span className="font-medium text-red-600">-{formatVND(row.deduction)}</span>
                                      </div>
                                      <div className="border-t pt-1 flex justify-between gap-4 font-semibold">
                                        <span>Thực lãnh:</span>
                                        <span>{formatVND(row.netPay)}</span>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={statusConfig[row.status].className}>
                                {statusConfig[row.status].label}
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
                                      <span className="ml-2 font-medium">{row.workDays} ngày</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Giờ OT:</span>
                                      <span className="ml-2 font-medium">{row.otHours} giờ (x1.5)</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Đơn giá/ngày:</span>
                                      <span className="ml-2 font-medium">{formatVND(row.dailyRate)}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Đơn giá OT/giờ:</span>
                                      <span className="ml-2 font-medium">{formatVND(Math.round(row.dailyRate / 8 * 1.5))}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Lương cơ bản:</span>
                                      <span className="ml-2 font-medium">{formatVND(row.baseSalary)}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Tiền OT:</span>
                                      <span className="ml-2 font-medium text-emerald-600">{formatVND(Math.round(row.dailyRate / 8 * 1.5 * row.otHours))}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Phụ cấp khác:</span>
                                      <span className="ml-2 font-medium text-emerald-600">+{formatVND(row.allowance)}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Khấu trừ:</span>
                                      <span className="ml-2 font-medium text-red-600">-{formatVND(row.deduction)}</span>
                                    </div>
                                  </div>
                                  <div className="mt-3 flex items-center justify-between border-t pt-3">
                                    <span className="text-sm font-semibold">Thực lãnh: {formatVND(row.netPay)}</span>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs" onClick={() => handleExportPayslip(row)}>
                                        <FileSpreadsheet className="h-3.5 w-3.5" />
                                        Xuất phiếu lương
                                      </Button>
                                      {row.status !== "paid" && (
                                        <Button size="sm" className="h-7 gap-1.5 text-xs" onClick={() => handlePaySingle(row.id)}>
                                          <CreditCard className="h-3.5 w-3.5" />
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
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Footer bar */}
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
                  <Button className="gap-2" onClick={handlePaySelected}>
                    <Wallet className="h-4 w-4" />
                    Thanh toán đã chọn
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Payment History ── */}
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
                      <TableHead>Người duyệt</TableHead>
                      <TableHead>Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPaymentHistory.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <span className="font-mono text-sm font-medium text-primary">{row.receiptCode}</span>
                        </TableCell>
                        <TableCell>{row.date}</TableCell>
                        <TableCell className="font-medium">{row.workerName}</TableCell>
                        <TableCell className="text-right font-semibold tabular-nums">{formatVND(row.amount)}</TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={
                              row.method === "bank_transfer"
                                ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                                : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                            }
                          >
                            {row.method === "bank_transfer" ? (
                              <CreditCard className="mr-1 h-3 w-3" />
                            ) : (
                              <Wallet className="mr-1 h-3 w-3" />
                            )}
                            {methodLabels[row.method]}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.approver}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">{row.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
