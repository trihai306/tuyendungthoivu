import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  DollarSign,
  TrendingUp,
  TrendingDown,
  Building2,
  Banknote,
  Receipt,
  PiggyBank,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  BarChart3,
} from "lucide-react"
import {
  useRevenueOverview,
  useRevenueByClient,
  useRevenueTrend,
  useStaffPayrollSummary,
} from "@/hooks/use-revenue"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return (amount / 1_000_000_000).toFixed(1) + " tỷ"
  }
  if (amount >= 1_000_000) {
    return (amount / 1_000_000).toFixed(1) + " tr"
  }
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

function formatFullVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

// ── Main Component ───────────────────────────────────────────────────────────

export function RevenueDashboard() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const { data: overview, isLoading: loadingOverview } = useRevenueOverview(month, year)
  const { data: clientRevenue } = useRevenueByClient(month, year)
  const { data: trend } = useRevenueTrend(6)
  const { data: payrollSummary } = useStaffPayrollSummary(month, year)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tổng quan Doanh thu & Tài chính</h1>
          <p className="text-sm text-muted-foreground">Báo cáo tài chính cho kế toán và quản lý</p>
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>

      {loadingOverview ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Đang tải dữ liệu...</p>
      ) : (
        <>
          {/* Revenue cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs font-medium">Doanh thu</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatVND(overview?.revenue.total_invoiced ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Đã thu: {formatVND(overview?.revenue.total_collected ?? 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Banknote className="h-4 w-4" />
                    <span className="text-xs font-medium">Chi phí</span>
                  </div>
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                </div>
                <p className="mt-2 text-2xl font-bold text-red-600">
                  {formatVND(overview?.costs.total_costs ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Workers: {formatVND(overview?.costs.worker_payroll ?? 0)} · NV: {formatVND(overview?.costs.staff_payroll ?? 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <PiggyBank className="h-4 w-4" />
                    <span className="text-xs font-medium">Lợi nhuận</span>
                  </div>
                  {(overview?.profit.net_profit ?? 0) >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <p className={`mt-2 text-2xl font-bold ${(overview?.profit.net_profit ?? 0) >= 0 ? "text-blue-600" : "text-red-600"}`}>
                  {formatVND(overview?.profit.net_profit ?? 0)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Biên lợi nhuận: {overview?.profit.margin_percent ?? 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs font-medium">Công nợ</span>
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-orange-600">
                  {formatVND(overview?.revenue.total_receivables ?? 0)}
                </p>
                <p className="text-xs text-red-500">
                  Quá hạn: {formatVND(overview?.revenue.overdue_amount ?? 0)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend + Staff Payroll Summary */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-4 w-4" />
                  Xu hướng doanh thu (6 tháng)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {trend && trend.length > 0 ? (
                  <div className="space-y-3">
                    {trend.map((t) => {
                      const maxRevenue = Math.max(...trend.map((x) => x.revenue), 1)
                      const pct = (t.revenue / maxRevenue) * 100
                      return (
                        <div key={`${t.year}-${t.month}`}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{t.label}</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-green-600">DT: {formatVND(t.revenue)}</span>
                              <span className="text-red-600">CP: {formatVND(t.cost)}</span>
                              <span className={t.profit >= 0 ? "text-blue-600 font-semibold" : "text-red-600 font-semibold"}>
                                LN: {formatVND(t.profit)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-1 h-2 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">Chưa có dữ liệu</p>
                )}
              </CardContent>
            </Card>

            {/* Staff Payroll Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-4 w-4" />
                  Tổng hợp lương nhân viên T{month}/{year}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {payrollSummary ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Tổng nhân viên</p>
                        <p className="text-xl font-bold">{payrollSummary.total_staff}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Tổng lương gross</p>
                        <p className="text-xl font-bold">{formatVND(payrollSummary.total_gross)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Bảo hiểm</p>
                        <p className="text-xl font-bold text-orange-600">{formatVND(payrollSummary.total_insurance)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">Thuế TNCN</p>
                        <p className="text-xl font-bold text-orange-600">{formatVND(payrollSummary.total_tax)}</p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                      <p className="text-xs font-medium text-primary">Tổng thực lĩnh</p>
                      <p className="text-2xl font-bold text-primary">{formatVND(payrollSummary.total_net)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-gray-100">
                        Nháp: {payrollSummary.by_status.draft}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-100">
                        Kiểm tra: {payrollSummary.by_status.reviewed}
                      </Badge>
                      <Badge variant="outline" className="bg-indigo-100">
                        Duyệt: {payrollSummary.by_status.approved}
                      </Badge>
                      <Badge variant="outline" className="bg-green-100">
                        Đã trả: {payrollSummary.by_status.paid}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="py-8 text-center text-sm text-muted-foreground">Chưa có dữ liệu</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Revenue by Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="h-4 w-4" />
                Doanh thu theo khách hàng T{month}/{year}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {clientRevenue && clientRevenue.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead className="text-center">Số HĐ</TableHead>
                      <TableHead className="text-right">Doanh thu</TableHead>
                      <TableHead className="text-right">Đã thu</TableHead>
                      <TableHead className="text-right">Còn nợ</TableHead>
                      <TableHead className="text-center">Tỷ trọng</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientRevenue.map((c, idx) => {
                      const totalRevAll = clientRevenue.reduce((s, x) => s + x.total_revenue, 0)
                      const pct = totalRevAll > 0 ? ((c.total_revenue / totalRevAll) * 100).toFixed(1) : "0"
                      return (
                        <TableRow key={c.client_id}>
                          <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                          <TableCell className="font-medium">{c.client_name}</TableCell>
                          <TableCell className="text-center">{c.invoice_count}</TableCell>
                          <TableCell className="text-right font-medium">{formatFullVND(c.total_revenue)}</TableCell>
                          <TableCell className="text-right text-green-600">{formatFullVND(c.total_paid)}</TableCell>
                          <TableCell className="text-right">
                            {c.outstanding > 0 ? (
                              <span className="text-red-600">{formatFullVND(c.outstanding)}</span>
                            ) : (
                              <span className="text-green-600">0đ</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 flex-1 rounded-full bg-muted">
                                <div
                                  className="h-1.5 rounded-full bg-primary"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{pct}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Chưa có dữ liệu doanh thu tháng này
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
