import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus, Pencil, Trash2, Settings2 } from "lucide-react"
import {
  useKpiConfigs,
  useCreateKpiConfig,
  useUpdateKpiConfig,
  useDeleteKpiConfig,
} from "@/hooks/use-kpi"
import type { KpiConfig, CreateKpiConfigDto } from "@/types"

const ROLES = [
  { value: "manager", label: "Quản lý" },
  { value: "recruiter", label: "Tuyển dụng" },
  { value: "coordinator", label: "Điều phối" },
  { value: "sales", label: "Kinh doanh" },
  { value: "accountant", label: "Kế toán" },
  { value: "staff", label: "Nhân viên" },
]

const UNITS = [
  { value: "count", label: "Số lượng" },
  { value: "percent", label: "Phần trăm (%)" },
  { value: "amount", label: "Số tiền (VNĐ)" },
  { value: "hours", label: "Giờ" },
  { value: "score", label: "Điểm" },
]

const AUTO_SOURCES = [
  { value: "orders_created", label: "Số đơn hàng tạo" },
  { value: "orders_completed", label: "Số đơn hoàn thành" },
  { value: "fill_rate", label: "Tỷ lệ đáp ứng (%)" },
  { value: "workers_assigned", label: "Số workers phân công" },
  { value: "revenue", label: "Doanh thu đơn hàng" },
  { value: "new_clients", label: "Số khách hàng mới" },
  { value: "contract_value", label: "Giá trị hợp đồng ký mới" },
  { value: "invoice_collected", label: "Doanh thu thu hồi" },
]

const defaultForm: CreateKpiConfigDto = {
  name: "",
  code: "",
  unit: "count",
  applicable_roles: [],
  calculation_method: "manual",
  default_target: 0,
  weight: 1,
}

export function KpiConfigPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CreateKpiConfigDto>(defaultForm)
  const [deleteTarget, setDeleteTarget] = useState<KpiConfig | null>(null)

  const { data } = useKpiConfigs()
  const createConfig = useCreateKpiConfig()
  const updateConfig = useUpdateKpiConfig()
  const deleteConfig = useDeleteKpiConfig()

  const configs: KpiConfig[] = data?.data ?? []

  const openCreate = () => {
    setEditingId(null)
    setForm(defaultForm)
    setShowForm(true)
  }

  const openEdit = (c: KpiConfig) => {
    setEditingId(c.id)
    setForm({
      name: c.name,
      code: c.code,
      description: c.description ?? "",
      unit: c.unit,
      applicable_roles: c.applicable_roles,
      calculation_method: c.calculation_method,
      auto_source: c.auto_source ?? undefined,
      default_target: c.default_target,
      weight: c.weight,
      is_active: c.is_active,
      sort_order: c.sort_order,
    })
    setShowForm(true)
  }

  const handleSubmit = () => {
    if (!form.name || !form.code || form.applicable_roles.length === 0) return
    if (editingId) {
      updateConfig.mutate({ id: editingId, data: form }, { onSuccess: () => setShowForm(false) })
    } else {
      createConfig.mutate(form, { onSuccess: () => setShowForm(false) })
    }
  }

  const toggleRole = (role: string) => {
    setForm((prev) => ({
      ...prev,
      applicable_roles: prev.applicable_roles.includes(role)
        ? prev.applicable_roles.filter((r) => r !== role)
        : [...prev.applicable_roles, role],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cấu hình chỉ số KPI</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh sách các chỉ số đánh giá hiệu suất</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm chỉ số
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên chỉ số</TableHead>
                <TableHead>Mã</TableHead>
                <TableHead>Đơn vị</TableHead>
                <TableHead>Vai trò áp dụng</TableHead>
                <TableHead>Phương pháp</TableHead>
                <TableHead className="text-center">Mục tiêu</TableHead>
                <TableHead className="text-center">Trọng số</TableHead>
                <TableHead className="text-center">Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {configs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center text-sm text-muted-foreground">
                    Chưa có chỉ số KPI nào. Nhấn "Thêm chỉ số" để bắt đầu.
                  </TableCell>
                </TableRow>
              ) : (
                configs.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <p className="font-medium">{c.name}</p>
                      {c.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{c.description}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{c.code}</code>
                    </TableCell>
                    <TableCell className="text-sm">
                      {UNITS.find((u) => u.value === c.unit)?.label ?? c.unit}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {c.applicable_roles.map((r) => (
                          <Badge key={r} variant="secondary" className="text-[10px]">
                            {ROLES.find((rl) => rl.value === r)?.label ?? r}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.calculation_method === "auto" ? "default" : "secondary"}>
                        {c.calculation_method === "auto" ? "Tự động" : "Nhập tay"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{parseFloat(String(c.default_target))}</TableCell>
                    <TableCell className="text-center">{parseFloat(String(c.weight))}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={c.is_active ? "default" : "secondary"}>
                        {c.is_active ? "Hoạt động" : "Tắt"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => setDeleteTarget(c)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Sửa chỉ số KPI" : "Thêm chỉ số KPI mới"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tên chỉ số *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Mã *</Label>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  disabled={!!editingId}
                />
              </div>
            </div>
            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Đơn vị</Label>
                <Select value={form.unit} onValueChange={(v) => setForm({ ...form, unit: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {UNITS.map((u) => (
                      <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Phương pháp</Label>
                <Select
                  value={form.calculation_method}
                  onValueChange={(v) => setForm({ ...form, calculation_method: v as "manual" | "auto" })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Nhập tay</SelectItem>
                    <SelectItem value="auto">Tự động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {form.calculation_method === "auto" && (
              <div>
                <Label>Nguồn tự động</Label>
                <Select
                  value={form.auto_source ?? ""}
                  onValueChange={(v) => setForm({ ...form, auto_source: v })}
                >
                  <SelectTrigger><SelectValue placeholder="Chọn nguồn..." /></SelectTrigger>
                  <SelectContent>
                    {AUTO_SOURCES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Vai trò áp dụng *</Label>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <Badge
                    key={r.value}
                    variant={form.applicable_roles.includes(r.value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleRole(r.value)}
                  >
                    {r.label}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Mục tiêu mặc định</Label>
                <Input
                  type="number"
                  value={form.default_target}
                  onChange={(e) => setForm({ ...form, default_target: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Trọng số</Label>
                <Input
                  type="number"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 1 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Hủy</Button>
            <Button
              onClick={handleSubmit}
              disabled={createConfig.isPending || updateConfig.isPending}
            >
              {editingId ? "Cập nhật" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa chỉ số <strong>{deleteTarget?.name}</strong>? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteTarget) {
                  deleteConfig.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) })
                }
              }}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
