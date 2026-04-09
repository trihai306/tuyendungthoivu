import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Banknote,
  Search,
  Calculator,
  CheckCircle2,
  CreditCard,
  Users,
  DollarSign,
  Clock,
  FileCheck,
} from "lucide-react"
import {
  useStaffPayrolls,
  useBulkCalculateStaffPayroll,
  useReviewStaffPayroll,
  useApproveStaffPayroll,
  usePayStaffPayroll,
  useBulkApproveStaffPayroll,
  useBulkPayStaffPayroll,
} from "@/hooks/use-staff-payroll"
import type { StaffPayrollRecord } from "@/types"
import { usePermissions } from "@/hooks/use-permissions"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    draft: { label: "Bản nháp", className: "bg-gray-100 text-gray-800" },
    reviewed: { label: "Đã kiểm tra", className: "bg-blue-100 text-blue-800" },
    approved: { label: "Đã duyệt", className: "bg-indigo-100 text-indigo-800" },
    paid: { label: "Đã trả", className: "bg-green-100 text-green-800" },
  }
  const s = map[status] ?? { label: status, className: "bg-gray-100 text-gray-800" }
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>
}

// ── Main Component ───────────────────────────────────────────────────────────

export function StaffPayrollList() {
  const can = usePermissions()
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [showBulkCalc, setShowBulkCalc] = useState(false)
  const [showDetail, setShowDetail] = useState<StaffPayrollRecord | null>(null)

  const { data, isLoading } = useStaffPayrolls({
    period_month: month,
    period_year: year,
    status: statusFilter === "all" ? undefined : statusFilter,
    search: searchTerm || undefined,
  })

  const bulkCalc = useBulkCalculateStaffPayroll()
  const reviewPayroll = useReviewStaffPayroll()
  const approvePayroll = useApproveStaffPayroll()
  const payPayroll = usePayStaffPayroll()
  const bulkApprove = useBulkApproveStaffPayroll()
  const bulkPay = useBulkPayStaffPayroll()

  const payrolls: StaffPayrollRecord[] = data?.data ?? []

  // Stats
  const totalNet = payrolls.reduce((sum, p) => sum + p.net_amount, 0)
  const draftCount = payrolls.filter((p) => p.status === "draft").length
  const approvedCount = payrolls.filter((p) => p.status === "approved").length
  const paidCount = payrolls.filter((p) => p.status === "paid").length

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const toggleAll = () => {
    if (selectedIds.length === payrolls.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(payrolls.map((p) => p.id))
    }
  }

  const handleBulkCalc = () => {
    bulkCalc.mutate({ period_month: month, period_year: year }, {
      onSuccess: () => setShowBulkCalc(false),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bảng lương nhân viên</h1>
          <p className="text-sm text-muted-foreground">Quản lý lương nhân viên nội bộ theo tháng</p>
        </div>
        {can("staff_payroll.manage") && (
          <Button onClick={() => setShowBulkCalc(true)}>
            <Calculator className="mr-2 h-4 w-4" />
            Tính lương tháng
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Tổng nhân viên</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{payrolls.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span className="text-xs font-medium">Tổng thực lĩnh</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-primary">{formatVND(totalNet)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-medium">Chờ duyệt</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-orange-600">{draftCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">Đã trả</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-green-600">{paidCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm nhân viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-9"
          />
        </div>
        <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Array.from({ length: 12 }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>Tháng {i + 1}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[2025, 2026, 2027].map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="reviewed">Đã kiểm tra</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="paid">Đã trả</SelectItem>
          </SelectContent>
        </Select>

        {selectedIds.length > 0 && can("staff_payroll.manage") && (
          <div className="ml-auto flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => bulkApprove.mutate(selectedIds, { onSuccess: () => setSelectedIds([]) })}
              disabled={bulkApprove.isPending}
            >
              <FileCheck className="mr-1 h-3.5 w-3.5" />
              Duyệt ({selectedIds.length})
            </Button>
            <Button
              size="sm"
              onClick={() => bulkPay.mutate({ payrollIds: selectedIds }, { onSuccess: () => setSelectedIds([]) })}
              disabled={bulkPay.isPending}
            >
              <CreditCard className="mr-1 h-3.5 w-3.5" />
              Thanh toán ({selectedIds.length})
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Đang tải...</p>
          ) : payrolls.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Chưa có dữ liệu lương tháng {month}/{year}. Nhấn "Tính lương tháng" để bắt đầu.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={selectedIds.length === payrolls.length && payrolls.length > 0}
                      onCheckedChange={toggleAll}
                    />
                  </TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead className="text-right">Lương CB</TableHead>
                  <TableHead className="text-right">Phụ cấp</TableHead>
                  <TableHead className="text-right">KPI Bonus</TableHead>
                  <TableHead className="text-right">Khấu trừ</TableHead>
                  <TableHead className="text-right">BHXH</TableHead>
                  <TableHead className="text-right">Thuế TNCN</TableHead>
                  <TableHead className="text-right font-semibold">Thực lĩnh</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(p.id)}
                        onCheckedChange={() => toggleSelect(p.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{p.user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.user?.employee_code} · {p.user?.position}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatVND(p.base_salary)}</TableCell>
                    <TableCell className="text-right text-sm">{formatVND(p.allowance)}</TableCell>
                    <TableCell className="text-right text-sm">
                      {p.kpi_bonus > 0 ? (
                        <span className="text-green-600">+{formatVND(p.kpi_bonus)}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {p.deduction_amount > 0 ? (
                        <span className="text-red-600">-{formatVND(p.deduction_amount)}</span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatVND(p.insurance_amount)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {formatVND(p.tax_amount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatVND(p.net_amount)}
                    </TableCell>
                    <TableCell className="text-center">{statusBadge(p.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {p.status === "draft" && can("staff_payroll.manage") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reviewPayroll.mutate(p.id)}
                            disabled={reviewPayroll.isPending}
                          >
                            Kiểm tra
                          </Button>
                        )}
                        {(p.status === "draft" || p.status === "reviewed") && can("staff_payroll.manage") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => approvePayroll.mutate(p.id)}
                            disabled={approvePayroll.isPending}
                          >
                            Duyệt
                          </Button>
                        )}
                        {p.status === "approved" && can("staff_payroll.manage") && (
                          <Button
                            size="sm"
                            onClick={() => payPayroll.mutate({ id: p.id })}
                            disabled={payPayroll.isPending}
                          >
                            <CreditCard className="mr-1 h-3.5 w-3.5" />
                            Trả lương
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Bulk Calculate Dialog */}
      <Dialog open={showBulkCalc} onOpenChange={setShowBulkCalc}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tính lương hàng loạt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Hệ thống sẽ tự động tính lương cho tất cả nhân viên đã có cấu hình lương
              trong tháng {month}/{year}. Bao gồm lương cơ bản, phụ cấp, thưởng KPI, bảo hiểm và thuế TNCN.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tháng</Label>
                <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>Tháng {i + 1}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Năm</Label>
                <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[2025, 2026, 2027].map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBulkCalc(false)}>Hủy</Button>
            <Button onClick={handleBulkCalc} disabled={bulkCalc.isPending}>
              <Calculator className="mr-2 h-4 w-4" />
              {bulkCalc.isPending ? "Đang tính..." : "Tính lương"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
