import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Target,
  Plus,
  Calculator,
  Lock,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Search,
  BarChart3,
} from "lucide-react"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"
import {
  useKpiPeriods,
  useKpiPeriod,
  useCreateKpiPeriod,
  useCloseKpiPeriod,
  useAutoCalculateKpi,
  useKpiRecords,
  useEvaluateKpi,
} from "@/hooks/use-kpi"
import type { KpiPeriodSummaryItem, KpiRecord } from "@/types"

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatNumber(n: number | null | undefined): string {
  if (n == null) return "-"
  return n.toLocaleString("vi-VN", { maximumFractionDigits: 2 })
}

const UNIT_LABELS: Record<string, string> = {
  count: "Số lượng",
  percent: "Phần trăm (%)",
  amount: "Số tiền (VNĐ)",
  hours: "Giờ",
  score: "Điểm",
}

function formatDateVN(dateStr: string | null | undefined): string {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

function periodLabel(p: { name: string; type?: string; start_date?: string; end_date?: string; status?: string }): string {
  const name = p.name || `${formatDateVN(p.start_date)} - ${formatDateVN(p.end_date)}`
  return name
}

function gradeColor(grade: string): string {
  switch (grade) {
    case "A+": return "bg-emerald-100 text-emerald-800"
    case "A": return "bg-green-100 text-green-800"
    case "B+": return "bg-blue-100 text-blue-800"
    case "B": return "bg-sky-100 text-sky-800"
    case "C": return "bg-yellow-100 text-yellow-800"
    case "D": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; className: string }> = {
    open: { label: "Đang mở", className: "bg-green-100 text-green-800" },
    closed: { label: "Đã đóng", className: "bg-yellow-100 text-yellow-800" },
    locked: { label: "Đã khóa", className: "bg-gray-100 text-gray-800" },
  }
  const s = map[status] ?? { label: status, className: "bg-gray-100 text-gray-800" }
  return <Badge variant="outline" className={s.className}>{s.label}</Badge>
}

// ── Main Component ───────────────────────────────────────────────────────────

export function KpiDashboard() {
  const can = usePermissions()
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("")
  const [showCreatePeriod, setShowCreatePeriod] = useState(false)
  const [showEvaluate, setShowEvaluate] = useState<KpiRecord | null>(null)
  const [evaluateValue, setEvaluateValue] = useState("")
  const [evaluateNotes, setEvaluateNotes] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // New period form
  const [periodName, setPeriodName] = useState("")
  const [periodType, setPeriodType] = useState<string>("monthly")
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")

  const { data: periodsData } = useKpiPeriods()
  const { data: periodDetail, isLoading: loadingDetail } = useKpiPeriod(selectedPeriodId)
  const { data: recordsData } = useKpiRecords({ period_id: selectedPeriodId, per_page: 100 })

  const createPeriod = useCreateKpiPeriod()
  const closePeriod = useCloseKpiPeriod()
  const autoCalc = useAutoCalculateKpi()
  const evaluateKpi = useEvaluateKpi()

  const periods = periodsData?.data?.data ?? []
  const summary: KpiPeriodSummaryItem[] = periodDetail?.summary ?? []
  const records: KpiRecord[] = recordsData?.data?.data ?? []

  // Auto-select first period
  if (periods.length > 0 && !selectedPeriodId) {
    setSelectedPeriodId(periods[0].id)
  }

  const selectedPeriod = periodDetail?.data

  const filteredSummary = summary.filter(
    (s) =>
      !searchTerm ||
      s.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.employee_code?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Stats
  const avgScore = summary.length > 0
    ? summary.reduce((sum, s) => sum + (s.overall_score ?? 0), 0) / summary.filter(s => s.overall_score != null).length
    : 0
  const totalEvaluated = summary.filter(s => s.overall_score != null).length
  const gradeACount = summary.filter(s => s.grade === "A+" || s.grade === "A").length

  const handleCreatePeriod = () => {
    if (!periodName || !periodStart || !periodEnd) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }
    createPeriod.mutate(
      {
        name: periodName,
        type: periodType as "monthly" | "quarterly" | "yearly",
        start_date: periodStart,
        end_date: periodEnd,
      },
      {
        onSuccess: () => {
          setShowCreatePeriod(false)
          setPeriodName("")
          setPeriodStart("")
          setPeriodEnd("")
        },
      }
    )
  }

  const handleEvaluate = () => {
    if (!showEvaluate || !evaluateValue) return
    evaluateKpi.mutate(
      {
        id: showEvaluate.id,
        data: { actual_value: parseFloat(evaluateValue), notes: evaluateNotes || undefined },
      },
      {
        onSuccess: () => {
          setShowEvaluate(null)
          setEvaluateValue("")
          setEvaluateNotes("")
        },
      }
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý KPI</h1>
          <p className="text-sm text-muted-foreground">Đánh giá hiệu suất nhân viên theo kỳ</p>
        </div>
        {can("kpi.config") && (
          <Button onClick={() => setShowCreatePeriod(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo kỳ đánh giá
          </Button>
        )}
      </div>

      {/* Period selector + stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Label className="text-xs font-medium text-muted-foreground">Chọn kỳ đánh giá</Label>
            <Select value={selectedPeriodId} onValueChange={setSelectedPeriodId}>
              <SelectTrigger className="mt-1.5">
                {selectedPeriodId && periods.length > 0 ? (
                  <span className="truncate">
                    {(() => {
                      const p = periods.find((p) => p.id === selectedPeriodId)
                      if (!p) return "Chọn kỳ..."
                      const statusSuffix = p.status !== "open" ? ` (${p.status === "closed" ? "Đã đóng" : "Đã khóa"})` : ""
                      return periodLabel(p) + statusSuffix
                    })()}
                  </span>
                ) : (
                  <SelectValue placeholder="Chọn kỳ..." />
                )}
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {periodLabel(p)} {p.status !== "open" ? `(${p.status === "closed" ? "Đã đóng" : "Đã khóa"})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPeriod && (
              <div className="mt-3 flex items-center gap-2">
                {statusBadge(selectedPeriod.status)}
                <span className="text-xs text-muted-foreground">
                  {formatDateVN(selectedPeriod.start_date)} → {formatDateVN(selectedPeriod.end_date)}
                </span>
              </div>
            )}
            {selectedPeriod?.status === "open" && can("kpi.config") && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => autoCalc.mutate(selectedPeriodId)}
                  disabled={autoCalc.isPending}
                >
                  <Calculator className="mr-1 h-3.5 w-3.5" />
                  Tự động tính
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => closePeriod.mutate(selectedPeriodId)}
                  disabled={closePeriod.isPending}
                >
                  <Lock className="mr-1 h-3.5 w-3.5" />
                  Đóng kỳ
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium">Nhân viên</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{summary.length}</p>
            <p className="text-xs text-muted-foreground">Đã đánh giá: {totalEvaluated}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Điểm TB</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{avgScore ? formatNumber(avgScore) : "-"}</p>
            <p className="text-xs text-muted-foreground">/ 100 điểm</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Award className="h-4 w-4" />
              <span className="text-xs font-medium">Xuất sắc (A/A+)</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{gradeACount}</p>
            <p className="text-xs text-muted-foreground">nhân viên</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Summary table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Bảng tổng hợp KPI
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingDetail ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Đang tải...</p>
          ) : filteredSummary.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {selectedPeriodId ? "Chưa có dữ liệu đánh giá" : "Vui lòng chọn kỳ đánh giá"}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead className="text-center">Chỉ số</TableHead>
                  <TableHead className="text-center">Đã đánh giá</TableHead>
                  <TableHead className="text-center">Điểm tổng</TableHead>
                  <TableHead className="text-center">Xếp loại</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSummary.map((s, idx) => (
                  <TableRow key={s.user_id}>
                    <TableCell className="text-muted-foreground">{idx + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{s.user_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.employee_code} · {s.user_position}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.department ?? "-"}</TableCell>
                    <TableCell className="text-center">{s.total_kpis}</TableCell>
                    <TableCell className="text-center">
                      <span className={s.evaluated_kpis === s.total_kpis ? "text-green-600" : "text-orange-600"}>
                        {s.evaluated_kpis}/{s.total_kpis}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {s.overall_score != null ? formatNumber(s.overall_score) : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={gradeColor(s.grade)}>
                        {s.grade}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail records for evaluation */}
      {selectedPeriodId && records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              Chi tiết chỉ số KPI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Chỉ số</TableHead>
                  <TableHead className="text-center">Mục tiêu</TableHead>
                  <TableHead className="text-center">Thực tế</TableHead>
                  <TableHead className="text-center">Tiến độ</TableHead>
                  <TableHead className="text-center">Điểm</TableHead>
                  <TableHead className="text-center">Trọng số</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{r.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{r.user?.employee_code}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{r.kpi_config?.name}</p>
                      <p className="text-xs text-muted-foreground">{UNIT_LABELS[r.kpi_config?.unit ?? ""] ?? r.kpi_config?.unit}</p>
                    </TableCell>
                    <TableCell className="text-center">{formatNumber(r.target_value)}</TableCell>
                    <TableCell className="text-center">
                      {r.actual_value != null ? (
                        <span className="font-medium">{formatNumber(r.actual_value)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="w-[140px]">
                      {r.actual_value != null && r.target_value > 0 ? (() => {
                        const pct = Math.min(Math.round((Number(r.actual_value) / Number(r.target_value)) * 100), 150)
                        const barColor = pct >= 100 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-red-500"
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-gray-100">
                              <div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                            </div>
                            <span className={`text-xs font-semibold min-w-[36px] text-right ${pct >= 100 ? "text-emerald-600" : pct >= 70 ? "text-amber-600" : "text-red-600"}`}>
                              {pct}%
                            </span>
                          </div>
                        )
                      })() : (
                        <span className="text-muted-foreground text-center block">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.score != null ? (
                        <span className={`font-semibold ${Number(r.score) >= 80 ? "text-green-600" : Number(r.score) >= 50 ? "text-yellow-600" : "text-red-600"}`}>
                          {formatNumber(r.score)}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-center text-sm">{parseFloat(String(r.weight))}</TableCell>
                    <TableCell className="text-right">
                      {selectedPeriod?.status === "open" && can("kpi.evaluate") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowEvaluate(r)
                            setEvaluateValue(r.actual_value?.toString() ?? "")
                            setEvaluateNotes(r.notes ?? "")
                          }}
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Đánh giá
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Create Period Dialog */}
      <Dialog open={showCreatePeriod} onOpenChange={setShowCreatePeriod}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo kỳ đánh giá KPI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên kỳ</Label>
              <Input
                placeholder="VD: Tháng 04/2026"
                value={periodName}
                onChange={(e) => setPeriodName(e.target.value)}
              />
            </div>
            <div>
              <Label>Loại</Label>
              <Select value={periodType} onValueChange={setPeriodType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Hàng tháng</SelectItem>
                  <SelectItem value="quarterly">Hàng quý</SelectItem>
                  <SelectItem value="yearly">Hàng năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Từ ngày</Label>
                <Input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
              </div>
              <div>
                <Label>Đến ngày</Label>
                <Input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePeriod(false)}>Hủy</Button>
            <Button onClick={handleCreatePeriod} disabled={createPeriod.isPending}>
              {createPeriod.isPending ? "Đang tạo..." : "Tạo kỳ đánh giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluate Dialog */}
      <Dialog open={!!showEvaluate} onOpenChange={() => setShowEvaluate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đánh giá KPI</DialogTitle>
          </DialogHeader>
          {showEvaluate && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="font-medium">{showEvaluate.user?.name}</p>
                <p className="text-sm text-muted-foreground">{showEvaluate.kpi_config?.name}</p>
                <p className="text-xs text-muted-foreground">
                  Mục tiêu: {formatNumber(showEvaluate.target_value)} {UNIT_LABELS[showEvaluate.kpi_config?.unit ?? ""] ?? showEvaluate.kpi_config?.unit}
                </p>
              </div>
              <div>
                <Label>Giá trị thực tế</Label>
                <Input
                  type="number"
                  value={evaluateValue}
                  onChange={(e) => setEvaluateValue(e.target.value)}
                  placeholder="Nhập giá trị..."
                />
              </div>
              <div>
                <Label>Ghi chú</Label>
                <Textarea
                  value={evaluateNotes}
                  onChange={(e) => setEvaluateNotes(e.target.value)}
                  placeholder="Nhận xét (tùy chọn)..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEvaluate(null)}>Hủy</Button>
            <Button onClick={handleEvaluate} disabled={evaluateKpi.isPending}>
              {evaluateKpi.isPending ? "Đang lưu..." : "Lưu đánh giá"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
