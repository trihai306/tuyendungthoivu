import { useState, useEffect } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { usePermissions } from "@/hooks/use-permissions"
import { useWorkerNew, useUpdateWorkerNew, useWorkerEvaluation } from "@/hooks/use-workers-new"
import type { WorkerWorkHistoryItem, WorkerAttendanceItem } from "@/services/workers-new.service"
import type { WorkerNew, UpdateWorkerNewDto } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FileUpload } from "@/components/ui/file-upload"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Star,
  Phone,
  User,
  Pencil,
  Send,
  Lock,
  MoreHorizontal,
  MapPin,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Briefcase,
  DollarSign,
  ClipboardList,
  BadgeCheck,
  UserPlus,
  FileText,
  Bell,
  KeyRound,
  RefreshCw,
  UserCog,
  Mail,
  ExternalLink,
  ImageIcon,
  Building2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

// --- Staff types ---

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

// --- Config ---

const statusConfig = {
  available: {
    label: "Sẵn sàng",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    largeBg: "bg-emerald-100 text-emerald-800",
  },
  working: {
    label: "Đang làm việc",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    largeBg: "bg-blue-100 text-blue-800",
  },
  inactive: {
    label: "Tạm nghỉ",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
    largeBg: "bg-gray-200 text-gray-700",
  },
  blacklist: {
    label: "Blacklist",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
    largeBg: "bg-red-100 text-red-800",
  },
}

const attendanceStatusConfig = {
  on_time: { label: "Đúng giờ", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  late: { label: "Trễ", className: "bg-amber-50 text-amber-700 border-amber-200" },
  absent: { label: "Vắng", className: "bg-red-50 text-red-700 border-red-200" },
}

// --- Helpers ---

const avatarColors = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-emerald-500 to-emerald-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
  "from-cyan-500 to-cyan-600",
]

function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase()
}

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

function renderMiniStars(rating: number) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  )
}

// --- Info Row ---

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string | React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/60">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium">{value || "—"}</p>
      </div>
    </div>
  )
}

// --- Main ---

// --- Create Account Dialog for Detail page ---
function CreateAccountDetailDialog({
  open,
  onOpenChange,
  workerName,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workerName: string
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
            <Label htmlFor="detail-acc-email">Email <span className="text-destructive">*</span></Label>
            <Input
              id="detail-acc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="detail-acc-password">Mật khẩu <span className="text-destructive">*</span></Label>
            <div className="flex gap-2">
              <Input
                id="detail-acc-password"
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

// --- Change Staff Dialog ---

function ChangeStaffDialog({
  open,
  onOpenChange,
  currentStaffId,
  onAssign,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentStaffId: string | null
  onAssign: (staffId: string) => void
}) {
  const [selectedStaff, setSelectedStaff] = useState("")

  // Show current assignment info
  const currentStaff = currentStaffId ? STAFF_MEMBERS.find((s) => s.id === currentStaffId) : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phân công người phụ trách</DialogTitle>
          <DialogDescription>
            Chọn nhân viên nội bộ chịu trách nhiệm quản lý ứng viên này.
          </DialogDescription>
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
            const staff = STAFF_MEMBERS.find((s) => s.id === selectedStaff)
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
            disabled={!selectedStaff}
            onClick={() => {
              if (selectedStaff) {
                onAssign(selectedStaff)
                onOpenChange(false)
              }
            }}
            className="gap-1.5"
          >
            <UserCog className="h-4 w-4" />
            Phân công
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- Edit Worker Dialog ---

function EditWorkerDialog({
  open,
  onOpenChange,
  worker,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker: WorkerNew
}) {
  const updateMutation = useUpdateWorkerNew()

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "male" as "male" | "female",
    id_number: "",
    id_issued_date: "",
    id_issued_place: "",
    id_card_front_url: "",
    id_card_back_url: "",
    avatar_url: "",
    phone: "",
    email: "",
    zalo: "",
    facebook_url: "",
    address: "",
    district: "",
    city: "",
    experience_notes: "",
    bank_name: "",
    bank_account: "",
    bank_account_name: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form data when worker changes or dialog opens
  useEffect(() => {
    if (open && worker) {
      setFormData({
        full_name: worker.full_name ?? "",
        date_of_birth: worker.date_of_birth ?? "",
        gender: (worker.gender as "male" | "female") ?? "male",
        id_number: worker.id_number ?? "",
        id_issued_date: worker.id_issued_date ?? "",
        id_issued_place: worker.id_issued_place ?? "",
        id_card_front_url: worker.id_card_front_url ?? "",
        id_card_back_url: worker.id_card_back_url ?? "",
        avatar_url: worker.avatar_url ?? "",
        phone: worker.phone ?? "",
        email: worker.email ?? "",
        zalo: worker.zalo ?? "",
        facebook_url: worker.facebook_url ?? "",
        address: worker.address ?? "",
        district: worker.district ?? "",
        city: worker.city ?? "",
        experience_notes: worker.experience_notes ?? "",
        bank_name: worker.bank_name ?? "",
        bank_account: worker.bank_account ?? "",
        bank_account_name: worker.bank_account_name ?? "",
        emergency_contact_name: worker.emergency_contact_name ?? "",
        emergency_contact_phone: worker.emergency_contact_phone ?? "",
        notes: worker.notes ?? "",
      })
      setErrors({})
    }
  }, [open, worker])

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!formData.full_name.trim()) errs.full_name = "Vui lòng nhập họ tên"
    if (!formData.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSave() {
    if (!validate()) return

    const data: UpdateWorkerNewDto = {
      full_name: formData.full_name,
      date_of_birth: formData.date_of_birth || undefined,
      gender: formData.gender || undefined,
      id_number: formData.id_number || undefined,
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
      district: formData.district || undefined,
      city: formData.city || undefined,
      experience_notes: formData.experience_notes || undefined,
      bank_name: formData.bank_name || undefined,
      bank_account: formData.bank_account || undefined,
      bank_account_name: formData.bank_account_name || undefined,
      emergency_contact_name: formData.emergency_contact_name || undefined,
      emergency_contact_phone: formData.emergency_contact_phone || undefined,
      notes: formData.notes || undefined,
    }

    updateMutation.mutate(
      { id: worker.id, data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa ứng viên</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin ứng viên <strong>{worker.full_name}</strong>.
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
                  <Label htmlFor="edit-full-name">Họ tên <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-full-name"
                    value={formData.full_name}
                    onChange={(e) => setFormData((p) => ({ ...p, full_name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                  />
                  {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-dob">Ngày sinh</Label>
                  <Input
                    id="edit-dob"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData((p) => ({ ...p, date_of_birth: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Giới tính</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(val) => setFormData((p) => ({ ...p, gender: val as "male" | "female" }))}
                    className="flex gap-4 pt-1"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="male" />
                      <Label className="font-normal cursor-pointer">Nam</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="female" />
                      <Label className="font-normal cursor-pointer">Nữ</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-id-number">CCCD</Label>
                  <Input
                    id="edit-id-number"
                    value={formData.id_number}
                    onChange={(e) => setFormData((p) => ({ ...p, id_number: e.target.value }))}
                    placeholder="079xxxxxxxxx"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-id-issued-date">Ngày cấp</Label>
                  <Input
                    id="edit-id-issued-date"
                    value={formData.id_issued_date}
                    onChange={(e) => setFormData((p) => ({ ...p, id_issued_date: e.target.value }))}
                    placeholder="dd/mm/yyyy"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="edit-id-issued-place">Nơi cấp</Label>
                  <Input
                    id="edit-id-issued-place"
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
                  <Label htmlFor="edit-phone">SĐT <span className="text-destructive">*</span></Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="09xxxxxxxx"
                  />
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-zalo">Zalo</Label>
                  <Input
                    id="edit-zalo"
                    value={formData.zalo}
                    onChange={(e) => setFormData((p) => ({ ...p, zalo: e.target.value }))}
                    placeholder="Số Zalo"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-facebook">Facebook</Label>
                  <Input
                    id="edit-facebook"
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
                  <Label htmlFor="edit-address">Địa chỉ</Label>
                  <Input
                    id="edit-address"
                    value={formData.address}
                    onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                    placeholder="Số nhà, đường, phường..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-district">Quận/Huyện</Label>
                  <Input
                    id="edit-district"
                    value={formData.district}
                    onChange={(e) => setFormData((p) => ({ ...p, district: e.target.value }))}
                    placeholder="Quận/Huyện"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-city">Tỉnh/Thành phố</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                    placeholder="TP.HCM"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section: Kinh nghiem */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Kinh nghiệm & Ghi chú</h4>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-experience">Kinh nghiệm</Label>
                  <Textarea
                    id="edit-experience"
                    value={formData.experience_notes}
                    onChange={(e) => setFormData((p) => ({ ...p, experience_notes: e.target.value }))}
                    placeholder="Mô tả kinh nghiệm làm việc..."
                    className="min-h-20"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-notes">Ghi chú</Label>
                  <Textarea
                    id="edit-notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Ghi chú thêm..."
                    className="min-h-16"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section: Ngan hang */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Thông tin ngân hàng</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-bank-name">Tên ngân hàng</Label>
                  <Input
                    id="edit-bank-name"
                    value={formData.bank_name}
                    onChange={(e) => setFormData((p) => ({ ...p, bank_name: e.target.value }))}
                    placeholder="Vietcombank"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-bank-account">Số tài khoản</Label>
                  <Input
                    id="edit-bank-account"
                    value={formData.bank_account}
                    onChange={(e) => setFormData((p) => ({ ...p, bank_account: e.target.value }))}
                    placeholder="0123456789"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="edit-bank-account-name">Chủ tài khoản</Label>
                  <Input
                    id="edit-bank-account-name"
                    value={formData.bank_account_name}
                    onChange={(e) => setFormData((p) => ({ ...p, bank_account_name: e.target.value }))}
                    placeholder="NGUYEN VAN A"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Section: Lien he khan cap */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Liên hệ khẩn cấp</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-emergency-name">Họ tên</Label>
                  <Input
                    id="edit-emergency-name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData((p) => ({ ...p, emergency_contact_name: e.target.value }))}
                    placeholder="Người liên hệ"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="edit-emergency-phone">SĐT</Label>
                  <Input
                    id="edit-emergency-phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData((p) => ({ ...p, emergency_contact_phone: e.target.value }))}
                    placeholder="09xxxxxxxx"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-1.5">
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Cập nhật
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function WorkerDetail() {
  const { id } = useParams<{ id: string }>()
  const can = usePermissions()
  const navigate = useNavigate()
  const [createAccountOpen, setCreateAccountOpen] = useState(false)
  const [changeStaffOpen, setChangeStaffOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [assignedStaffId, setAssignedStaffId] = useState<string | null>("s2")

  // API calls
  const { data: apiWorker, isLoading, isError } = useWorkerNew(id)
  const { data: evaluation } = useWorkerEvaluation(id)

  // Derived values from API data
  const workerStatus = apiWorker
    ? (apiWorker.status === "assigned" ? "working" : apiWorker.status === "blacklisted" ? "blacklist" : apiWorker.status) as "available" | "working" | "inactive" | "blacklist"
    : "available"
  const config = apiWorker ? statusConfig[workerStatus] : statusConfig.available
  const hasAccount = apiWorker ? !!apiWorker.user_id : false
  const workerName = apiWorker?.full_name ?? ""
  const workerSkills = apiWorker?.skills?.map((s) => s.skill_name) ?? []
  const workerArea = apiWorker ? [apiWorker.district, apiWorker.city].filter(Boolean).join(", ") : ""
  const workerRating = Number(apiWorker?.average_rating) || 0
  const totalWorkDays = apiWorker?.total_days_worked ?? 0
  const totalOrders = apiWorker?.total_orders ?? 0
  const completionRate = totalOrders > 0 ? Math.round(((totalOrders - (apiWorker?.no_show_count ?? 0)) / totalOrders) * 100) : 0
  const joinDate = apiWorker?.created_at ? new Date(apiWorker.created_at).toLocaleDateString("vi-VN") : ""

  // Work history & attendance from evaluation API
  const workHistory: WorkerWorkHistoryItem[] = evaluation?.work_history ?? []
  const recentAttendance: WorkerAttendanceItem[] = evaluation?.recent_attendance ?? []

  // Find current active assignment
  const currentAssignment = apiWorker?.assignments?.find((a) => a.status === "working" || a.status === "confirmed")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !apiWorker) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <XCircle className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h2 className="text-lg font-semibold mb-1">Không tìm thấy ứng viên</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Ứng viên không tồn tại hoặc đã bị xóa.
        </p>
        <Button variant="outline" onClick={() => navigate("/workers")}>
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/workers" />}>
              Ứng viên
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{workerName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 shadow-lg">
            {apiWorker.avatar_url && (
              <AvatarImage src={apiWorker.avatar_url} alt={workerName} />
            )}
            <AvatarFallback
              className={`bg-gradient-to-br ${getAvatarColor(apiWorker.id)} text-lg font-bold text-white`}
            >
              {getInitials(workerName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {workerName}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${config.className}`}
              >
                <span
                  className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${config.dot}`}
                />
                {config.label}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Mã: {apiWorker.worker_code} &middot; Tham gia từ {joinDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {can("workers.update") && (
            <Button variant="outline" className="gap-1.5" onClick={() => setEditDialogOpen(true)}>
              <Pencil className="h-4 w-4" />
              Sửa
            </Button>
          )}
          {can("workers.update") && !hasAccount && (
            <Button variant="outline" className="gap-1.5" onClick={() => setCreateAccountOpen(true)}>
              <UserPlus className="h-4 w-4" />
              Tạo tài khoản
            </Button>
          )}
          {can("assignments.create") && (
            <Button className="gap-1.5" onClick={() => navigate("/dispatch")}>
              <Send className="h-4 w-4" />
              Điều phối
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border hover:bg-muted">
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {can("workers.update") && !hasAccount && (
                  <DropdownMenuItem onClick={() => setCreateAccountOpen(true)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tạo tài khoản
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => {
                  toast.loading("Đang xuất hồ sơ...", { id: "export-profile" })
                  setTimeout(() => toast.success(`Đã xuất hồ sơ ${workerName} thành công`, { id: "export-profile" }), 1000)
                }}>
                  <FileText className="mr-2 h-4 w-4" />
                  Xuất hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.success("Đã gửi thông báo đến ứng viên")}>
                  <Bell className="mr-2 h-4 w-4" />
                  Gửi thông báo
                </DropdownMenuItem>
                {can("workers.change_status") && (
                  <DropdownMenuItem onClick={() => toast.success("Đã tạm khóa ứng viên")}>
                    <Lock className="mr-2 h-4 w-4" />
                    Tạm khóa
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content 2 columns */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <User className="h-4 w-4 text-primary" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-x-6 sm:grid-cols-2">
                <InfoRow icon={User} label="Họ tên" value={workerName} />
                <InfoRow
                  icon={CalendarDays}
                  label="Ngày sinh"
                  value={apiWorker.date_of_birth ?? ""}
                />
                <InfoRow icon={User} label="Giới tính" value={apiWorker.gender_label ?? ""} />
                <InfoRow
                  icon={CreditCard}
                  label="CCCD/CMND"
                  value={apiWorker.id_number ?? ""}
                />
                <InfoRow
                  icon={CalendarDays}
                  label="Ngày cấp"
                  value={apiWorker.id_issued_date ?? ""}
                />
                <InfoRow
                  icon={Building2}
                  label="Nơi cấp"
                  value={apiWorker.id_issued_place ?? ""}
                />
                <InfoRow icon={Phone} label="SĐT" value={apiWorker.phone ?? ""} />
                <InfoRow icon={Phone} label="Zalo" value={apiWorker.zalo ?? ""} />
                <InfoRow
                  icon={ExternalLink}
                  label="Facebook"
                  value={
                    apiWorker.facebook_url ? (
                      <a
                        href={apiWorker.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {apiWorker.facebook_url.replace(/^https?:\/\/(www\.)?/, "")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      ""
                    )
                  }
                />
                <InfoRow
                  icon={MapPin}
                  label="Địa chỉ"
                  value={apiWorker.address ?? ""}
                />
                <InfoRow icon={MapPin} label="Khu vực" value={workerArea} />
              </div>

              {/* CCCD Photos */}
              <Separator className="my-4" />
              <div>
                <p className="mb-3 text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Ảnh CCCD
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-1.5 text-[11px] text-muted-foreground">
                      Mặt trước
                    </p>
                    {apiWorker.id_card_front_url ? (
                      <img
                        src={apiWorker.id_card_front_url}
                        alt="CCCD mặt trước"
                        className="w-full rounded-lg border object-cover"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-muted/30">
                        <p className="text-xs text-muted-foreground">
                          Chưa có ảnh
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="mb-1.5 text-[11px] text-muted-foreground">
                      Mặt sau
                    </p>
                    {apiWorker.id_card_back_url ? (
                      <img
                        src={apiWorker.id_card_back_url}
                        alt="CCCD mặt sau"
                        className="w-full rounded-lg border object-cover"
                      />
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed bg-muted/30">
                        <p className="text-xs text-muted-foreground">
                          Chưa có ảnh
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Skills */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Kỹ năng
                </p>
                <div className="flex flex-wrap gap-2">
                  {workerSkills.length > 0 ? workerSkills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs"
                    >
                      {skill}
                    </Badge>
                  )) : (
                    <p className="text-sm text-muted-foreground">Chưa có kỹ năng</p>
                  )}
                </div>
              </div>

              {apiWorker.notes && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Ghi chú đặc biệt
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {apiWorker.notes}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Work History */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Briefcase className="h-4 w-4 text-primary" />
                Lịch sử làm việc
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn hàng</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead className="text-center">Ngày công</TableHead>
                    <TableHead>Đánh giá</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workHistory.length > 0 ? workHistory.map((wh) => (
                    <TableRow key={wh.id}>
                      <TableCell className="text-xs font-mono text-primary">
                        {wh.order_code ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm max-w-[180px] truncate">
                        {wh.client ?? "—"}
                      </TableCell>
                      <TableCell className="text-sm">{wh.position ?? "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {wh.started_at ? new Date(wh.started_at).toLocaleDateString("vi-VN") : "—"}
                        {wh.completed_at ? ` - ${new Date(wh.completed_at).toLocaleDateString("vi-VN")}` : ""}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {wh.present_days}/{wh.total_days}
                      </TableCell>
                      <TableCell>{renderMiniStars(wh.evaluation?.overall ?? 0)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[11px]">
                          {wh.status_label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-8">
                        Chưa có lịch sử làm việc
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="border-t bg-muted/30 px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  Tổng:{" "}
                  <span className="font-semibold text-foreground">
                    {totalWorkDays} ngày công
                  </span>{" "}
                  &middot;{" "}
                  <span className="font-semibold text-foreground">
                    {totalOrders} yêu cầu
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Attendance */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <ClipboardList className="h-4 w-4 text-primary" />
                Chấm công gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Check-in</TableHead>
                    <TableHead>Check-out</TableHead>
                    <TableHead className="text-center">Giờ làm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttendance.length > 0 ? recentAttendance.map((record) => {
                    const attConfig = attendanceStatusConfig[record.status as keyof typeof attendanceStatusConfig] ?? {
                      label: record.status_label,
                      className: "bg-gray-50 text-gray-600 border-gray-200",
                    }
                    return (
                      <TableRow key={record.id}>
                        <TableCell className="text-sm font-medium">
                          {new Date(record.date).toLocaleDateString("vi-VN")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.check_in ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {record.check_out ?? "—"}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {record.hours != null && record.hours > 0 ? `${record.hours}h` : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[11px] font-medium ${attConfig.className}`}
                          >
                            {record.status === "on_time" && (
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                            )}
                            {record.status === "late" && (
                              <AlertCircle className="mr-1 h-3 w-3" />
                            )}
                            {record.status === "absent" && (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {attConfig.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  }) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                        Chưa có dữ liệu chấm công
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Overview */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <TrendingUp className="h-4 w-4 text-primary" />
                Tổng quan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current status */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Trạng thái hiện tại
                </span>
                <Badge className={`text-sm font-semibold px-3 py-1 ${config.largeBg}`}>
                  {config.label}
                </Badge>
              </div>
              <Separator />

              {/* Rating */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Đánh giá trung bình
                </span>
                <div className="flex items-center gap-2">
                  {renderStars(workerRating)}
                  <span className="text-sm font-bold">
                    {workerRating.toFixed(1)}/5
                  </span>
                </div>
              </div>
              <Separator />

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {totalWorkDays}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Tổng ngày công
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">
                    {totalOrders}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Tổng YCTD
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-xl font-bold text-emerald-600">
                    {completionRate}%
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Tỷ lệ hoàn thành
                  </p>
                </div>
                <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
                  <p className="text-sm font-bold text-foreground">
                    {joinDate}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    Ngày tham gia pool
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Staff */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <UserCog className="h-4 w-4 text-orange-600" />
                Người phụ trách
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const staff = assignedStaffId ? STAFF_MEMBERS.find((s) => s.id === assignedStaffId) : null
                if (!staff) {
                  return (
                    <div className="flex flex-col items-center py-4 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 mb-3">
                        <UserCog className="h-6 w-6 text-orange-400" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Chưa phân công người phụ trách
                      </p>
                      {can("workers.assign_staff") && (
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setChangeStaffOpen(true)}>
                          <UserCog className="h-3.5 w-3.5" />
                          Phân công
                        </Button>
                      )}
                    </div>
                  )
                }
                const roleConf = staffRoleConfig[staff.role]
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 shadow-md">
                        <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(staff.id)} text-sm font-bold text-white`}>
                          {staff.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{staff.name}</p>
                        <Badge variant="outline" className={`mt-0.5 text-[10px] px-1.5 py-0 ${roleConf.className}`}>
                          {roleConf.label}
                        </Badge>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{staff.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="truncate">{staff.email}</span>
                      </div>
                    </div>
                    {can("workers.assign_staff") && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full gap-1.5"
                        onClick={() => setChangeStaffOpen(true)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Đổi người phụ trách
                      </Button>
                    )}
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Current Assignment */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <BadgeCheck className="h-4 w-4 text-blue-600" />
                Đang làm việc tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentAssignment ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Đơn hàng</p>
                    <p className="text-sm font-semibold">
                      {currentAssignment.order?.order_code ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Vị trí</p>
                    <p className="text-sm font-medium">
                      {currentAssignment.order?.position_name ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Thời gian</p>
                    <p className="text-sm">
                      {currentAssignment.started_at ? new Date(currentAssignment.started_at).toLocaleDateString("vi-VN") : "—"}
                      {currentAssignment.completed_at ? ` — ${new Date(currentAssignment.completed_at).toLocaleDateString("vi-VN")}` : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4 text-center">
                  <Clock className="h-8 w-8 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Hiện không có assignment
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Finance */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                Tài chính
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Lương tháng này
                </span>
                <span className="text-sm font-bold">—</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Đã thanh toán
                </span>
                <span className="text-sm font-semibold text-emerald-600">—</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Còn lại</span>
                <span className="text-sm font-semibold text-amber-600">—</span>
              </div>

              <p className="text-xs text-muted-foreground text-center pt-1">
                Dữ liệu tài chính sẽ được cập nhật từ module thanh toán
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Account Dialog */}
      <CreateAccountDetailDialog
        open={createAccountOpen}
        onOpenChange={setCreateAccountOpen}
        workerName={workerName}
      />

      {/* Change Staff Dialog */}
      <ChangeStaffDialog
        open={changeStaffOpen}
        onOpenChange={setChangeStaffOpen}
        currentStaffId={assignedStaffId}
        onAssign={(staffId) => {
          setAssignedStaffId(staffId)
          const staff = STAFF_MEMBERS.find((s) => s.id === staffId)
          toast.success(`Đã phân công ${staff?.name ?? ""} phụ trách ứng viên ${workerName}`)
        }}
      />

      {/* Edit Worker Dialog */}
      {apiWorker && (
        <EditWorkerDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          worker={apiWorker}
        />
      )}
    </div>
  )
}
