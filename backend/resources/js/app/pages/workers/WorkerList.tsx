import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { usePermissions } from "@/hooks/use-permissions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileUpload } from "@/components/ui/file-upload"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Star,
  Users,
  UserCheck,
  Clock,
  Plus,
  Upload,
  Download,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Send,
  UserPlus,
  Bell,
  X,
  RefreshCw,
  KeyRound,
  UserCog,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import { SortableHeader } from "@/components/ui/sortable-header"
import { toast } from "sonner"
import {
  useWorkersNew,
  useCreateWorkerNew,
  useUpdateWorkerNew,
  useDeleteWorkerNew,
  useBulkDeleteWorkersNew,
  useUpdateWorkerStatus,
  useAssignStaff,
} from "@/hooks/use-workers-new"
import type { WorkerNew, CreateWorkerNewDto, UpdateWorkerNewDto, GenderRequirement } from "@/types"
import type { WorkerNewFilter } from "@/services/workers-new.service"

// --- Staff types (mock -- separate concern) ---

interface StaffMember {
  id: string
  name: string
  avatar: string
  role: "Recruiter" | "Manager" | "Sales"
  phone: string
  email: string
}

const STAFF_MEMBERS: StaffMember[] = [
  { id: "s1", name: "Trần Minh Đức", avatar: "TĐ", role: "Recruiter", phone: "0901111222", email: "duc.tm@company.vn" },
  { id: "s2", name: "Nguyễn Thị Hằng", avatar: "NH", role: "Recruiter", phone: "0902222333", email: "hang.nt@company.vn" },
  { id: "s3", name: "Lê Văn Tuấn", avatar: "LT", role: "Manager", phone: "0903333444", email: "tuan.lv@company.vn" },
  { id: "s4", name: "Phạm Thị Mai", avatar: "PM", role: "Sales", phone: "0904444555", email: "mai.pt@company.vn" },
  { id: "s5", name: "Võ Hoàng Nam", avatar: "VN", role: "Recruiter", phone: "0905555666", email: "nam.vh@company.vn" },
]

const staffRoleConfig = {
  Recruiter: { label: "Recruiter", className: "bg-blue-50 text-blue-700 border-blue-200" },
  Manager: { label: "Manager", className: "bg-violet-50 text-violet-700 border-violet-200" },
  Sales: { label: "Sales", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
} as const

const staffAvatarColors = [
  "from-teal-500 to-teal-600",
  "from-orange-500 to-orange-600",
  "from-fuchsia-500 to-fuchsia-600",
  "from-sky-500 to-sky-600",
  "from-lime-500 to-lime-600",
]

function getStaffAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return staffAvatarColors[Math.abs(hash) % staffAvatarColors.length]
}

function getStaffById(id: string | null): StaffMember | undefined {
  if (!id) return undefined
  return STAFF_MEMBERS.find((s) => s.id === id)
}

// --- Config ---

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  available: {
    label: "S\u1eb5n s\u00e0ng",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  assigned: {
    label: "\u0110ang l\u00e0m vi\u1ec7c",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  inactive: {
    label: "T\u1ea1m ngh\u1ec9",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  blacklisted: {
    label: "Blacklist",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
}

const skillOptions = [
  "Phục vụ",
  "Bốc xếp",
  "Đóng gói",
  "Bảo vệ",
  "Lái xe",
  "Khác",
]

const areaOptions = [
  "Quận 1",
  "Quận 7",
  "Thủ Đức",
  "Bình Thạnh",
  "Tân Bình",
  "Gò Vấp",
  "Bình Tân",
  "Quận 12",
  "Nhà Bè",
  "Hóc Môn",
]

// --- Helpers ---

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase()
}

const avatarColors = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
  "from-pink-500 to-pink-600",
  "from-indigo-500 to-indigo-600",
]

function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function renderStars(rating: number | string | null | undefined) {
  const num = rating != null ? Number(rating) : null
  if (num === null || isNaN(num)) {
    return <span className="text-xs text-muted-foreground">--</span>
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.round(num)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{num.toFixed(1)}</span>
    </div>
  )
}

function formatGender(gender: GenderRequirement | null | undefined): string {
  if (gender === "male") return "Nam"
  if (gender === "female") return "N\u1eef"
  return "--"
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "--"
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString("vi-VN")
  } catch {
    return dateStr
  }
}

// --- Stat Card ---

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// --- Add Worker Dialog ---

function AddWorkerDialog({
  open,
  onOpenChange,
  editWorker,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editWorker?: WorkerNew | null
}) {
  const isEdit = !!editWorker
  const createMutation = useCreateWorkerNew()
  const updateMutation = useUpdateWorkerNew()

  const [formData, setFormData] = useState({
    name: editWorker?.full_name ?? "",
    dateOfBirth: editWorker?.date_of_birth ?? "",
    gender: (editWorker?.gender ?? "male") as string,
    cccd: editWorker?.id_number ?? "",
    id_issued_date: editWorker?.id_issued_date ?? "",
    id_issued_place: editWorker?.id_issued_place ?? "",
    id_card_front_url: editWorker?.id_card_front_url ?? "",
    id_card_back_url: editWorker?.id_card_back_url ?? "",
    avatar_url: editWorker?.avatar_url ?? "",
    phone: editWorker?.phone ?? "",
    zalo: editWorker?.zalo ?? "",
    facebook_url: editWorker?.facebook_url ?? "",
    address: editWorker?.address ?? "",
    area: editWorker?.district ?? editWorker?.city ?? "",
    skills: editWorker?.skills?.map((s) => s.skill_name) ?? ([] as string[]),
    experience: editWorker?.experience_notes ?? "",
    notes: editWorker?.notes ?? "",
    assignedTo: "",
    createAccount: false,
    email: editWorker?.email ?? "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isSaving = createMutation.isPending || updateMutation.isPending

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = "Vui lòng nhập họ tên"
    if (!formData.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại"
    if (formData.createAccount && !formData.email.trim()) errs.email = "Vui lòng nhập email"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function buildDto(): CreateWorkerNewDto | UpdateWorkerNewDto {
    return {
      full_name: formData.name,
      date_of_birth: formData.dateOfBirth || undefined,
      gender: (formData.gender as GenderRequirement) || undefined,
      id_number: formData.cccd || undefined,
      id_issued_date: formData.id_issued_date || undefined,
      id_issued_place: formData.id_issued_place || undefined,
      id_card_front_url: formData.id_card_front_url || undefined,
      id_card_back_url: formData.id_card_back_url || undefined,
      avatar_url: formData.avatar_url || undefined,
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      zalo: formData.zalo || undefined,
      facebook_url: formData.facebook_url || undefined,
      address: formData.address || undefined,
      district: formData.area || undefined,
      experience_notes: formData.experience || undefined,
      notes: formData.notes || undefined,
    }
  }

  function handleSave(andNew: boolean) {
    if (!validate()) return

    const dto = buildDto()

    if (isEdit && editWorker) {
      updateMutation.mutate(
        { id: editWorker.id, data: dto as UpdateWorkerNewDto },
        {
          onSuccess: () => {
            if (!andNew) onOpenChange(false)
          },
        },
      )
    } else {
      createMutation.mutate(dto as CreateWorkerNewDto, {
        onSuccess: () => {
          if (andNew) {
            setFormData({
              name: "", dateOfBirth: "", gender: "male", cccd: "",
              id_issued_date: "", id_issued_place: "", id_card_front_url: "", id_card_back_url: "",
              avatar_url: "", phone: "", zalo: "", facebook_url: "",
              address: "", area: "", skills: [], experience: "", notes: "", assignedTo: "",
              createAccount: false, email: "", password: "",
            })
            setErrors({})
          } else {
            onOpenChange(false)
          }
        },
      })
    }
  }

  function toggleSkill(skill: string) {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Chỉnh sửa ứng viên" : "Thêm ứng viên mới"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Cập nhật thông tin ứng viên trong hệ thống."
              : "Nhập thông tin ứng viên mới vào hệ thống."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto -mx-4 px-4">
          <div className="space-y-6 py-2">
            {/* Section: Thong tin ca nhan */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Thông tin cá nhân</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Ảnh đại diện</Label>
                  <FileUpload
                    value={formData.avatar_url}
                    onChange={(url) => setFormData((p) => ({ ...p, avatar_url: url ?? "" }))}
                    folder="avatars"
                    placeholder="Chọn ảnh đại diện"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-name">Họ tên <span className="text-destructive">*</span></Label>
                  <Input
                    id="worker-name"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-dob">Ngày sinh</Label>
                  <Input
                    id="worker-dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(val) => setFormData((p) => ({ ...p, gender: val }))}
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="male" />
                      <Label htmlFor="gender-male" className="font-normal cursor-pointer">Nam</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="female" />
                      <Label htmlFor="gender-female" className="font-normal cursor-pointer">Nữ</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-cccd">CCCD</Label>
                  <Input
                    id="worker-cccd"
                    value={formData.cccd}
                    onChange={(e) => setFormData((p) => ({ ...p, cccd: e.target.value }))}
                    placeholder="079xxxxxxxxx"
                  />
                  {errors.cccd && <p className="text-xs text-destructive">{errors.cccd}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-id-issued-date">Ngày cấp</Label>
                  <Input
                    id="worker-id-issued-date"
                    type="date"
                    value={formData.id_issued_date}
                    onChange={(e) => setFormData((p) => ({ ...p, id_issued_date: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="worker-id-issued-place">Nơi cấp</Label>
                  <Input
                    id="worker-id-issued-place"
                    value={formData.id_issued_place}
                    onChange={(e) => setFormData((p) => ({ ...p, id_issued_place: e.target.value }))}
                    placeholder="Cục CS QLHC về TTXH"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Ảnh mặt trước CCCD</Label>
                  <FileUpload
                    value={formData.id_card_front_url}
                    onChange={(url) => setFormData((p) => ({ ...p, id_card_front_url: url ?? "" }))}
                    folder="id-cards"
                    placeholder="Chọn ảnh mặt trước"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Ảnh mặt sau CCCD</Label>
                  <FileUpload
                    value={formData.id_card_back_url}
                    onChange={(url) => setFormData((p) => ({ ...p, id_card_back_url: url ?? "" }))}
                    folder="id-cards"
                    placeholder="Chọn ảnh mặt sau"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-phone">SĐT <span className="text-destructive">*</span></Label>
                  <Input
                    id="worker-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="09xxxxxxxx"
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-zalo">Zalo</Label>
                  <Input
                    id="worker-zalo"
                    value={formData.zalo}
                    onChange={(e) => setFormData((p) => ({ ...p, zalo: e.target.value }))}
                    placeholder="Số Zalo"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-facebook">Facebook</Label>
                  <Input
                    id="worker-facebook"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData((p) => ({ ...p, facebook_url: e.target.value }))}
                    placeholder="https://facebook.com/..."
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section: Dia chi */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Địa chỉ</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="worker-address">Địa chỉ</Label>
                  <Input
                    id="worker-address"
                    value={formData.address}
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Số nhà, đường, phường..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Khu vực</Label>
                  <Select
                    value={formData.area}
                    onValueChange={(val) => setFormData((p) => ({ ...p, area: val }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      {areaOptions.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.area && <p className="text-xs text-destructive">{errors.area}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Section: Nghe nghiep */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Nghề nghiệp</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Kỹ năng</Label>
                  <div className="flex flex-wrap gap-3">
                    {skillOptions.map((skill) => (
                      <label key={skill} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={() => toggleSkill(skill)}
                        />
                        <span className="text-sm">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-exp">Kinh nghiệm</Label>
                  <Textarea
                    id="worker-exp"
                    value={formData.experience}
                    onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                    placeholder="Mô tả kinh nghiệm làm việc..."
                    className="min-h-20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="worker-notes">Ghi chú</Label>
                  <Textarea
                    id="worker-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Ghi chú thêm..."
                    className="min-h-16"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section: Phan cong */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Phân công</h4>
              <div className="space-y-1.5">
                <Label>Người phụ trách</Label>
                <Select
                  value={formData.assignedTo}
                  onValueChange={(val) => setFormData((p) => ({ ...p, assignedTo: val }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn người phụ trách" />
                  </SelectTrigger>
                  <SelectContent>
                    {STAFF_MEMBERS.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        <span className="flex items-center gap-2">
                          {staff.name}
                          <span className="text-xs text-muted-foreground">({staff.role})</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Để trống nếu chưa phân công</p>
              </div>
            </div>

            {!isEdit && (
              <>
                <Separator />
                {/* Section: Tai khoan */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={formData.createAccount}
                        onCheckedChange={(checked) =>
                          setFormData((p) => ({ ...p, createAccount: !!checked }))
                        }
                      />
                      <span className="text-sm font-semibold">Tạo tài khoản đăng nhập</span>
                    </label>
                  </div>
                  {formData.createAccount && (
                    <div className="grid gap-4 sm:grid-cols-2 pl-6">
                      <div className="space-y-1.5">
                        <Label htmlFor="worker-email">Email <span className="text-destructive">*</span></Label>
                        <Input
                          id="worker-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                          placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="worker-password">Mật khẩu</Label>
                        <div className="flex gap-2">
                          <Input
                            id="worker-password"
                            value={formData.password}
                            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
                            placeholder="Để trống = tự sinh"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="shrink-0"
                            onClick={() => {
                              const chars = "abcdefghijkmnpqrstuvwxyz23456789"
                              let pwd = ""
                              for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
                              setFormData((p) => ({ ...p, password: pwd }))
                            }}
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          {!isEdit && (
            <Button variant="outline" onClick={() => handleSave(true)} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Lưu & Thêm mới
            </Button>
          )}
          <Button onClick={() => handleSave(false)} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            {isEdit ? "Cập nhật" : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Create Account Dialog ---

function CreateAccountDialog({
  open,
  onOpenChange,
  workerName,
  onAccountCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workerName: string
  onAccountCreated?: () => void
}) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleCreate() {
    const errs: Record<string, string> = {}
    if (!email.trim()) errs.email = "Vui lòng nhập email"
    if (!password.trim()) errs.password = "Vui lòng nhập mật khẩu"
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onAccountCreated?.()
    toast.success("Đã tạo tài khoản và gửi thông tin đăng nhập qua email")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo tài khoản</DialogTitle>
          <DialogDescription>
            Tạo tài khoản đăng nhập cho ứng viên <strong>{workerName}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="acc-email">Email <span className="text-destructive">*</span></Label>
            <Input
              id="acc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acc-password">Mật khẩu <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Input
                id="acc-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0"
                onClick={() => {
                  const chars = "abcdefghijkmnpqrstuvwxyz23456789"
                  let pwd = ""
                  for (let i = 0; i < 8; i++) pwd += chars[Math.floor(Math.random() * chars.length)]
                  setPassword(pwd)
                }}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Vai trò</Label>
            <Input value="Worker (Ứng viên)" disabled />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button onClick={handleCreate} className="gap-1.5">
            <KeyRound className="h-4 w-4" />
            Tạo & gửi email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Delete Confirm Dialog ---

function DeleteWorkerDialog({
  open,
  onOpenChange,
  workerName,
  onConfirm,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workerName: string
  onConfirm: () => void
  isPending?: boolean
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa ứng viên <strong>{workerName}</strong>?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              onConfirm()
            }}
          >
            {isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// --- Assign Staff Dialog ---

function AssignStaffDialog({
  open,
  onOpenChange,
  title,
  description,
  currentStaffId,
  onAssign,
  isPending,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  currentStaffId?: string | null
  onAssign: (staffId: string) => void
  isPending?: boolean
}) {
  const [selectedStaff, setSelectedStaff] = useState("")

  // Show current assignment info
  const currentStaff = currentStaffId ? getStaffById(currentStaffId) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {currentStaff && (
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground mb-2">Hiện tại đang phân công cho:</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(currentStaff.id)} text-[10px] font-semibold text-white`}>
                    {currentStaff.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{currentStaff.name}</p>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${staffRoleConfig[currentStaff.role].className}`}>
                    {staffRoleConfig[currentStaff.role].label}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>{currentStaff ? "Đổi sang người phụ trách mới" : "Người phụ trách"}</Label>
            <Select value={selectedStaff} onValueChange={(val) => setSelectedStaff(val ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn người phụ trách" />
              </SelectTrigger>
              <SelectContent>
                {STAFF_MEMBERS.map((staff) => {
                  const roleConf = staffRoleConfig[staff.role]
                  return (
                    <SelectItem key={staff.id} value={staff.id}>
                      <span className="flex items-center gap-2">
                        {staff.name}
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${roleConf.className}`}>
                          {roleConf.label}
                        </Badge>
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedStaff && (() => {
            const staff = getStaffById(selectedStaff)
            if (!staff) return null
            const roleConf = staffRoleConfig[staff.role]
            return (
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(staff.id)} text-xs font-semibold text-white`}>
                    {staff.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{staff.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${roleConf.className}`}>
                      {roleConf.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{staff.phone}</span>
                  </div>
                </div>
              </div>
            )
          })()}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button
            disabled={!selectedStaff || isPending}
            onClick={() => {
              if (selectedStaff) {
                onAssign(selectedStaff)
                onOpenChange(false)
              }
            }}
            className="gap-1.5"
          >
            {isPending && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            <UserCog className="h-4 w-4" />
            Phân công
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Main ---

export function WorkerList() {
  const navigate = useNavigate()
  const can = usePermissions()

  // Filter state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [areaFilter, setAreaFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [staffFilter, setStaffFilter] = useState("")
  const [sortValue, setSortValue] = useState("-created_at")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(12)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editWorker, setEditWorker] = useState<WorkerNew | null>(null)
  const [createAccountWorker, setCreateAccountWorker] = useState<WorkerNew | null>(null)
  const [deleteWorker, setDeleteWorker] = useState<WorkerNew | null>(null)
  const [assignWorker, setAssignWorker] = useState<WorkerNew | null>(null)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)

  // Build API filter params
  const filters: WorkerNewFilter = {
    page: currentPage,
    per_page: perPage,
    sort: sortValue,
    ...(search ? { search } : {}),
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(skillFilter ? { skill: skillFilter } : {}),
    ...(areaFilter ? { city: areaFilter } : {}),
  }

  // API hooks
  const { data, isLoading, isError } = useWorkersNew(filters)
  const deleteMutation = useDeleteWorkerNew()
  const bulkDeleteMutation = useBulkDeleteWorkersNew()
  const statusMutation = useUpdateWorkerStatus()
  const assignStaffMutation = useAssignStaff()

  // Derive data from API response
  const workers = data?.data ?? []
  const meta = data?.meta
  const totalFiltered = meta?.total ?? 0
  const totalPages = meta?.last_page ?? 1
  const showFrom = meta?.from ?? 0
  const showTo = meta?.to ?? 0

  // Stats from workers on current page (or use total from meta)
  const totalWorkers = totalFiltered
  const availableCount = workers.filter((w) => w.status === "available").length
  const workingCount = workers.filter((w) => w.status === "assigned").length
  const unassignedCount = workers.filter((w) => !w.registered_by).length

  // Selection helpers
  const allOnPageSelected = workers.length > 0 && workers.every((w) => selectedIds.has(w.id))
  const someOnPageSelected = workers.some((w) => selectedIds.has(w.id))

  function toggleSelectAll() {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        workers.forEach((w) => next.delete(w.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        workers.forEach((w) => next.add(w.id))
        return next
      })
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearSelection() {
    setSelectedIds(new Set())
  }

  function handleSort(newSort: string) {
    setSortValue(newSort)
    setCurrentPage(1)
  }

  function resetFilters() {
    setSearch("")
    setStatusFilter("")
    setSkillFilter("")
    setAreaFilter("")
    setRatingFilter("")
    setStaffFilter("")
    setSortValue("-created_at")
    setCurrentPage(1)
  }

  const hasActiveFilters =
    search !== "" ||
    statusFilter !== "" ||
    skillFilter !== "" ||
    areaFilter !== "" ||
    ratingFilter !== "" ||
    staffFilter !== ""

  function handleExport() {
    toast.loading("Đang xuất file...", { id: "export" })
    setTimeout(() => {
      toast.success(`Đã xuất ${totalWorkers} ứng viên ra file Excel`, { id: "export" })
    }, 1500)
  }

  function handleBulkStatusChange(status: string) {
    const ids = Array.from(selectedIds)
    // Fire status mutations for each selected worker
    ids.forEach((id) => {
      statusMutation.mutate({ id, status })
    })
    const statusLabel =
      status === "available" ? "Sẵn sàng" :
      status === "inactive" ? "Tạm nghỉ" :
      status === "blacklisted" ? "Blacklist" : status
    toast.success(`Đã đổi trạng thái ${selectedIds.size} ứng viên sang "${statusLabel}"`)
    clearSelection()
  }

  function handleBulkExport() {
    toast.loading("Đang xuất danh sách...", { id: "bulk-export" })
    setTimeout(() => {
      toast.success(`Đã xuất ${selectedIds.size} ứng viên ra file Excel`, { id: "bulk-export" })
    }, 1000)
  }

  function handleBulkNotify() {
    toast.success(`Đã gửi thông báo đến ${selectedIds.size} ứng viên`)
    clearSelection()
  }

  function handleBulkDelete() {
    const ids = Array.from(selectedIds)
    bulkDeleteMutation.mutate(ids, {
      onSuccess: () => {
        clearSelection()
      },
    })
  }

  function handleDeleteWorker(worker: WorkerNew) {
    deleteMutation.mutate(worker.id, {
      onSuccess: () => {
        setDeleteWorker(null)
      },
    })
  }

  function handleAssignStaff(workerId: string, staffId: string) {
    assignStaffMutation.mutate({ id: workerId, staff_id: staffId })
  }

  function handleBulkAssignStaff(staffId: string) {
    const ids = Array.from(selectedIds)
    ids.forEach((id) => {
      assignStaffMutation.mutate({ id, staff_id: staffId })
    })
    const staff = getStaffById(staffId)
    toast.success(`Đã phân công ${staff?.name ?? ""} phụ trách ${selectedIds.size} ứng viên`)
    clearSelection()
  }

  function handleChangeStatus(worker: WorkerNew, status: string) {
    statusMutation.mutate({ id: worker.id, status })
  }

  // Page buttons generation
  function getPageNumbers(): (number | "ellipsis")[] {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "ellipsis")[] = [1]
    if (currentPage > 3) pages.push("ellipsis")
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push("ellipsis")
    pages.push(totalPages)
    return pages
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ứng viên</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý danh sách ứng viên trong pool nhân sự thời vụ
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-1.5" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
          {can("workers.create") && (
            <Button variant="outline" className="gap-1.5">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          )}
          {can("workers.create") && (
            <Button className="gap-1.5" onClick={() => { setEditWorker(null); setAddDialogOpen(true) }}>
              <Plus className="h-4 w-4" />
              Thêm ứng viên
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Tổng ứng viên" value={totalWorkers} color="bg-violet-500" />
        <StatCard icon={UserCheck} label="Sẵn sàng" value={availableCount} color="bg-emerald-500" />
        <StatCard icon={Clock} label="Đang làm việc" value={workingCount} color="bg-blue-500" />
        <StatCard icon={AlertTriangle} label="Chưa phân công" value={unassignedCount} color="bg-orange-500" />
      </div>

      {/* Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, SĐT, CCCD..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
                  <SelectItem value="available">Sẵn sàng</SelectItem>
                  <SelectItem value="assigned">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                  <SelectItem value="blacklisted">Blacklist</SelectItem>
                </SelectContent>
              </Select>

              <Select value={skillFilter} onValueChange={(v) => { setSkillFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kỹ năng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả kỹ năng</SelectItem>
                  {skillOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={areaFilter} onValueChange={(v) => { setAreaFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Khu vực" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả khu vực</SelectItem>
                  {areaOptions.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={(v) => { setRatingFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Đánh giá" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả đánh giá</SelectItem>
                  <SelectItem value="5">5 sao</SelectItem>
                  <SelectItem value="4">Từ 4 sao</SelectItem>
                  <SelectItem value="3">Từ 3 sao</SelectItem>
                  <SelectItem value="2">Từ 2 sao</SelectItem>
                  <SelectItem value="1">Từ 1 sao</SelectItem>
                </SelectContent>
              </Select>

              <Select value={staffFilter} onValueChange={(v) => { setStaffFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Người phụ trách" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả người PT</SelectItem>
                  <SelectItem value="unassigned">Chưa phân công</SelectItem>
                  {STAFF_MEMBERS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={resetFilters}>
                  <X className="h-3.5 w-3.5" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <Card className="border-primary/30 bg-primary/5 shadow-sm">
          <CardContent className="flex flex-wrap items-center gap-3 p-3">
            <span className="text-sm font-medium">
              Đã chọn <strong>{selectedIds.size}</strong> ứng viên
            </span>
            <Separator orientation="vertical" className="h-5" />

            {/* Bulk status change */}
            {can("workers.change_status") && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-accent"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Đổi trạng thái
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("available")}>
                      Sẵn sàng
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("inactive")}>
                      Tạm nghỉ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkStatusChange("blacklisted")}>
                      Blacklist
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {can("workers.assign_staff") && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setBulkAssignOpen(true)}>
                <UserCog className="h-3.5 w-3.5" />
                Phân công người PT
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleBulkExport}>
              <Download className="h-3.5 w-3.5" />
              Xuất danh sách
            </Button>
            {can("workers.update") && (
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleBulkNotify}>
                <Bell className="h-3.5 w-3.5" />
                Gửi thông báo
              </Button>
            )}
            {can("workers.delete") && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-1.5"
                onClick={handleBulkDelete}
                disabled={bulkDeleteMutation.isPending}
              >
                {bulkDeleteMutation.isPending && <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />}
                <Trash2 className="h-3.5 w-3.5" />
                Xóa
              </Button>
            )}

            <div className="ml-auto">
              <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearSelection}>
                Bỏ chọn tất cả
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị{" "}
          <span className="font-semibold text-foreground">
            {showFrom}-{showTo}
          </span>{" "}
          trên <span className="font-semibold text-foreground">{totalWorkers}</span>
        </p>
      </div>

      {/* Data Table */}
      <Card className="border-border/50 shadow-sm">
        <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={allOnPageSelected}
                  indeterminate={someOnPageSelected && !allOnPageSelected}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <SortableHeader label="Ứng viên" field="full_name" currentSort={sortValue} onSort={handleSort} className="w-[220px]" />
              <TableHead>SĐT</TableHead>
              <TableHead className="hidden xl:table-cell">Ngày sinh</TableHead>
              <TableHead className="hidden xl:table-cell">Giới tính</TableHead>
              <TableHead>Kỹ năng</TableHead>
              <TableHead>Khu vực</TableHead>
              <TableHead className="hidden xl:table-cell">Người phụ trách</TableHead>
              <SortableHeader label="Đánh giá" field="average_rating" currentSort={sortValue} onSort={handleSort} />
              <SortableHeader label="Trạng thái" field="status" currentSort={sortValue} onSort={handleSort} />
              <TableHead className="text-center hidden xl:table-cell">Số lần đi làm</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={12} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-destructive/40" />
                    <p className="text-sm text-destructive">
                      Không thể tải dữ liệu. Vui lòng thử lại.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : workers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">
                      Không tìm thấy ứng viên nào
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              workers.map((worker) => {
                const config = statusConfig[worker.status] ?? statusConfig.available
                const isSelected = selectedIds.has(worker.id)
                const skillNames = worker.skills?.map((s) => s.skill_name) ?? []
                return (
                  <TableRow
                    key={worker.id}
                    className={`cursor-pointer ${isSelected ? "bg-primary/5" : ""}`}
                  >
                    {/* Checkbox */}
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelect(worker.id)}
                      />
                    </TableCell>

                    {/* Avatar + Name */}
                    <TableCell>
                      <Link
                        to={`/workers/${worker.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${getAvatarColor(worker.id)} text-xs font-semibold text-white`}
                          >
                            {getInitials(worker.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-tight">
                            {worker.full_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {worker.id_number ?? worker.worker_code}
                          </p>
                        </div>
                      </Link>
                    </TableCell>

                    {/* Phone */}
                    <TableCell className="text-sm">{worker.phone ?? "--"}</TableCell>

                    {/* Date of Birth */}
                    <TableCell className="text-sm text-muted-foreground hidden xl:table-cell">{formatDate(worker.date_of_birth)}</TableCell>

                    {/* Gender */}
                    <TableCell className="text-sm hidden xl:table-cell">{formatGender(worker.gender)}</TableCell>

                    {/* Skills */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {skillNames.length > 0 ? (
                          skillNames.map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="rounded-full px-2 py-0 text-[11px] font-normal"
                            >
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">--</span>
                        )}
                      </div>
                    </TableCell>

                    {/* Area */}
                    <TableCell className="text-sm">{worker.district ?? worker.city ?? "--"}</TableCell>

                    {/* Assigned Staff */}
                    <TableCell className="hidden xl:table-cell">
                      {worker.registered_by ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(worker.registered_by.id)} text-[10px] font-semibold text-white`}>
                              {getInitials(worker.registered_by.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{worker.registered_by.name}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground border-dashed">
                          Chưa phân công
                        </Badge>
                      )}
                    </TableCell>

                    {/* Rating */}
                    <TableCell>{renderStars(worker.average_rating)}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-medium ${config.className}`}
                      >
                        <span
                          className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${config.dot}`}
                        />
                        {worker.status_label || config.label}
                      </Badge>
                    </TableCell>

                    {/* Shift count */}
                    <TableCell className="text-center text-sm font-medium hidden xl:table-cell">
                      {worker.total_days_worked}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate(`/workers/${worker.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {can("workers.update") && (
                              <DropdownMenuItem onClick={() => { setEditWorker(worker); setAddDialogOpen(true) }}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                            )}
                            {can("workers.update") && !worker.user_id && (
                              <DropdownMenuItem onClick={() => setCreateAccountWorker(worker)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Tạo tài khoản
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => toast.info(`Điều phối ${worker.full_name}`)}>
                              <Send className="mr-2 h-4 w-4" />
                              Điều phối
                            </DropdownMenuItem>
                            {can("workers.assign_staff") && (
                              <DropdownMenuItem onClick={() => setAssignWorker(worker)}>
                                <UserCog className="mr-2 h-4 w-4" />
                                Phân công người PT
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                          {can("workers.change_status") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Đổi trạng thái
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                  <DropdownMenuGroup>
                                    <DropdownMenuItem onClick={() => handleChangeStatus(worker, "available")}>
                                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />
                                      Sẵn sàng
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeStatus(worker, "assigned")}>
                                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                                      Đang làm việc
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeStatus(worker, "inactive")}>
                                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gray-400" />
                                      Tạm nghỉ
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleChangeStatus(worker, "blacklisted")}>
                                      <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" />
                                      Blacklist
                                    </DropdownMenuItem>
                                  </DropdownMenuGroup>
                                </DropdownMenuSubContent>
                              </DropdownMenuSub>
                            </>
                          )}
                          {can("workers.delete") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => setDeleteWorker(worker)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Hiển thị {showFrom}-{showTo} trên {totalWorkers}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">Hiển thị</span>
            <Select
              value={String(perPage)}
              onValueChange={(v) => { setPerPage(Number(v)); setCurrentPage(1) }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">/ trang</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((page, idx) =>
            page === "ellipsis" ? (
              <span key={`ellipsis-${idx}`} className="px-2 text-sm text-muted-foreground">...</span>
            ) : (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={
                  currentPage === page
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            )
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <AddWorkerDialog
        open={addDialogOpen}
        onOpenChange={(open) => {
          setAddDialogOpen(open)
          if (!open) setEditWorker(null)
        }}
        editWorker={editWorker}
      />

      {createAccountWorker && (
        <CreateAccountDialog
          open={!!createAccountWorker}
          onOpenChange={(open) => { if (!open) setCreateAccountWorker(null) }}
          workerName={createAccountWorker.full_name}
          onAccountCreated={() => {
            // Account creation is a separate concern; close dialog
            setCreateAccountWorker(null)
          }}
        />
      )}

      {deleteWorker && (
        <DeleteWorkerDialog
          open={!!deleteWorker}
          onOpenChange={(open) => { if (!open) setDeleteWorker(null) }}
          workerName={deleteWorker.full_name}
          onConfirm={() => handleDeleteWorker(deleteWorker)}
          isPending={deleteMutation.isPending}
        />
      )}

      {assignWorker && (
        <AssignStaffDialog
          open={!!assignWorker}
          onOpenChange={(open) => { if (!open) setAssignWorker(null) }}
          title="Phân công người phụ trách"
          description={`Chọn nhân viên phụ trách ứng viên ${assignWorker.full_name}.`}
          currentStaffId={null}
          onAssign={(staffId) => handleAssignStaff(assignWorker.id, staffId)}
          isPending={assignStaffMutation.isPending}
        />
      )}

      <AssignStaffDialog
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
        title="Phân công hàng loạt"
        description={`Phân công người phụ trách cho ${selectedIds.size} ứng viên đã chọn.`}
        onAssign={handleBulkAssignStaff}
        isPending={assignStaffMutation.isPending}
      />
    </div>
  )
}
