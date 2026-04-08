import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
  Ban,
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
  FileText,
  UserCog,
  AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"

// --- Types ---

interface MockWorker {
  id: string
  name: string
  phone: string
  cccd: string
  dateOfBirth: string
  gender: "male" | "female"
  email: string | null
  hasAccount: boolean
  skills: string[]
  area: string
  rating: number
  status: "available" | "working" | "inactive" | "blacklist"
  totalShifts: number
  avatar: string
  zalo: string
  address: string
  experience: string
  notes: string
  assignedTo: string | null
}

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

function getStaffById(id: string | null): StaffMember | undefined {
  if (!id) return undefined
  return STAFF_MEMBERS.find((s) => s.id === id)
}

// --- Config ---

const statusConfig = {
  available: {
    label: "San sang",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  working: {
    label: "Dang lam viec",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  inactive: {
    label: "Tam nghi",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    dot: "bg-gray-400",
  },
  blacklist: {
    label: "Blacklist",
    className: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
} as const

// Override with proper Vietnamese labels (with diacritics)
statusConfig.available.label = "S\u1eb5n s\u00e0ng"
statusConfig.working.label = "\u0110ang l\u00e0m vi\u1ec7c"
statusConfig.inactive.label = "T\u1ea1m ngh\u1ec9"

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

// --- Mock data ---

const mockWorkers: MockWorker[] = [
  {
    id: "w1",
    name: "Nguyễn Văn Hùng",
    phone: "0901234567",
    cccd: "079201001234",
    dateOfBirth: "15/06/1998",
    gender: "male",
    email: "hung.nv@email.com",
    hasAccount: true,
    skills: ["Bốc xếp", "Đóng gói"],
    area: "Quận 7",
    rating: 4.5,
    status: "available",
    totalShifts: 48,
    avatar: "NH",
    zalo: "0901234567",
    address: "123 Nguyễn Huệ, Q.7, TP.HCM",
    experience: "2 năm bốc xếp kho",
    notes: "",
    assignedTo: "s1",
  },
  {
    id: "w2",
    name: "Trần Thị Mai",
    phone: "0912345678",
    cccd: "079301002345",
    dateOfBirth: "03/12/1999",
    gender: "female",
    email: "mai.tt@email.com",
    hasAccount: true,
    skills: ["Phục vụ", "Đóng gói"],
    area: "Thủ Đức",
    rating: 4.8,
    status: "working",
    totalShifts: 92,
    avatar: "TM",
    zalo: "0912345678",
    address: "456 Lê Văn Việt, Thủ Đức, TP.HCM",
    experience: "3 năm phục vụ nhà hàng",
    notes: "Ưu tiên ca sáng",
    assignedTo: "s2",
  },
  {
    id: "w3",
    name: "Lê Văn Thành",
    phone: "0923456789",
    cccd: "079201003456",
    dateOfBirth: "22/08/1995",
    gender: "male",
    email: null,
    hasAccount: false,
    skills: ["Bảo vệ", "Lái xe"],
    area: "Bình Thạnh",
    rating: 3.9,
    status: "available",
    totalShifts: 31,
    avatar: "LT",
    zalo: "0923456789",
    address: "789 Xô Viết Nghệ Tĩnh, Bình Thạnh",
    experience: "5 năm bảo vệ",
    notes: "",
    assignedTo: null,
  },
  {
    id: "w4",
    name: "Phạm Thị Lan",
    phone: "0934567890",
    cccd: "079301004567",
    dateOfBirth: "10/04/2000",
    gender: "female",
    email: "lan.pt@email.com",
    hasAccount: true,
    skills: ["Phục vụ"],
    area: "Quận 1",
    rating: 4.2,
    status: "working",
    totalShifts: 67,
    avatar: "PL",
    zalo: "0934567890",
    address: "12 Trần Hưng Đạo, Q.1, TP.HCM",
    experience: "1 năm phục vụ",
    notes: "",
    assignedTo: "s3",
  },
  {
    id: "w5",
    name: "Võ Minh Đức",
    phone: "0945678901",
    cccd: "079201005678",
    dateOfBirth: "28/01/1997",
    gender: "male",
    email: null,
    hasAccount: false,
    skills: ["Bốc xếp", "Bảo vệ"],
    area: "Bình Tân",
    rating: 4.0,
    status: "inactive",
    totalShifts: 23,
    avatar: "VD",
    zalo: "0945678901",
    address: "34 Kinh Dương Vương, Bình Tân",
    experience: "2 năm bốc xếp",
    notes: "Tạm nghỉ do bận học",
    assignedTo: "s1",
  },
  {
    id: "w6",
    name: "Hoàng Thị Nga",
    phone: "0956789012",
    cccd: "079301006789",
    dateOfBirth: "17/09/2001",
    gender: "female",
    email: "nga.ht@email.com",
    hasAccount: true,
    skills: ["Đóng gói", "Phục vụ"],
    area: "Gò Vấp",
    rating: 4.6,
    status: "available",
    totalShifts: 55,
    avatar: "HN",
    zalo: "0956789012",
    address: "56 Quang Trung, Gò Vấp",
    experience: "1.5 năm đóng gói",
    notes: "",
    assignedTo: "s5",
  },
  {
    id: "w7",
    name: "Bùi Văn Khánh",
    phone: "0967890123",
    cccd: "079201007890",
    dateOfBirth: "05/11/1993",
    gender: "male",
    email: null,
    hasAccount: false,
    skills: ["Lái xe"],
    area: "Quận 12",
    rating: 3.5,
    status: "blacklist",
    totalShifts: 12,
    avatar: "BK",
    zalo: "",
    address: "78 Trường Chinh, Q.12",
    experience: "Lái xe tải",
    notes: "Vi phạm nội quy nhiều lần",
    assignedTo: null,
  },
  {
    id: "w8",
    name: "Đỗ Thị Hương",
    phone: "0978901234",
    cccd: "079301008901",
    dateOfBirth: "25/02/1996",
    gender: "female",
    email: "huong.dt@email.com",
    hasAccount: true,
    skills: ["Phục vụ", "Đóng gói", "Bốc xếp"],
    area: "Tân Bình",
    rating: 4.7,
    status: "working",
    totalShifts: 104,
    avatar: "DH",
    zalo: "0978901234",
    address: "90 Cộng Hòa, Tân Bình",
    experience: "4 năm phục vụ + đóng gói",
    notes: "Worker xuất sắc",
    assignedTo: "s4",
  },
  {
    id: "w9",
    name: "Ngô Văn Tuấn",
    phone: "0989012345",
    cccd: "079201009012",
    dateOfBirth: "14/07/2000",
    gender: "male",
    email: null,
    hasAccount: false,
    skills: ["Bốc xếp"],
    area: "Nhà Bè",
    rating: 4.1,
    status: "available",
    totalShifts: 37,
    avatar: "NT",
    zalo: "0989012345",
    address: "12 Lê Văn Lương, Nhà Bè",
    experience: "1 năm bốc xếp",
    notes: "",
    assignedTo: null,
  },
  {
    id: "w10",
    name: "Lý Thị Bích",
    phone: "0990123456",
    cccd: "079301000123",
    dateOfBirth: "30/03/2002",
    gender: "female",
    email: null,
    hasAccount: false,
    skills: ["Phục vụ", "Khác"],
    area: "Hóc Môn",
    rating: 3.8,
    status: "inactive",
    totalShifts: 19,
    avatar: "LB",
    zalo: "",
    address: "45 Bà Điểm, Hóc Môn",
    experience: "6 tháng phục vụ",
    notes: "",
    assignedTo: "s2",
  },
  {
    id: "w11",
    name: "Đặng Văn Phong",
    phone: "0901122334",
    cccd: "079201011234",
    dateOfBirth: "19/05/1994",
    gender: "male",
    email: "phong.dv@email.com",
    hasAccount: true,
    skills: ["Bảo vệ", "Bốc xếp"],
    area: "Quận 7",
    rating: 4.3,
    status: "available",
    totalShifts: 61,
    avatar: "DP",
    zalo: "0901122334",
    address: "67 Nguyễn Thị Thập, Q.7",
    experience: "3 năm bảo vệ",
    notes: "",
    assignedTo: "s5",
  },
  {
    id: "w12",
    name: "Mai Thị Thu",
    phone: "0912233445",
    cccd: "079301012345",
    dateOfBirth: "08/10/1998",
    gender: "female",
    email: "thu.mt@email.com",
    hasAccount: true,
    skills: ["Đóng gói"],
    area: "Thủ Đức",
    rating: 4.4,
    status: "working",
    totalShifts: 78,
    avatar: "MT",
    zalo: "0912233445",
    address: "23 Võ Văn Ngân, Thủ Đức",
    experience: "2 năm đóng gói",
    notes: "",
    assignedTo: null,
  },
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

function renderStars(rating: number) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3.5 w-3.5 ${
              star <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

function formatGender(gender: "male" | "female"): string {
  return gender === "male" ? "Nam" : "Nữ"
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
  onSave,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editWorker?: MockWorker | null
  onSave?: (worker: MockWorker) => void
}) {
  const isEdit = !!editWorker
  const [formData, setFormData] = useState({
    name: editWorker?.name ?? "",
    dateOfBirth: editWorker?.dateOfBirth ?? "",
    gender: editWorker?.gender ?? "male",
    cccd: editWorker?.cccd ?? "",
    phone: editWorker?.phone ?? "",
    zalo: editWorker?.zalo ?? "",
    address: editWorker?.address ?? "",
    area: editWorker?.area ?? "",
    skills: editWorker?.skills ?? ([] as string[]),
    experience: editWorker?.experience ?? "",
    notes: editWorker?.notes ?? "",
    assignedTo: editWorker?.assignedTo ?? "",
    createAccount: false,
    email: editWorker?.email ?? "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate(): boolean {
    const errs: Record<string, string> = {}
    if (!formData.name.trim()) errs.name = "Vui lòng nhập họ tên"
    if (!formData.dateOfBirth.trim()) errs.dateOfBirth = "Vui lòng nhập ngày sinh"
    if (!formData.cccd.trim()) errs.cccd = "Vui lòng nhập CCCD"
    if (!formData.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại"
    if (!formData.area) errs.area = "Vui lòng chọn khu vực"
    if (formData.createAccount && !formData.email.trim()) errs.email = "Vui lòng nhập email"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSave(andNew: boolean) {
    if (!validate()) return

    // Build new worker from form data
    const newWorker: MockWorker = {
      id: isEdit && editWorker ? editWorker.id : `w${Date.now()}`,
      name: formData.name,
      phone: formData.phone,
      cccd: formData.cccd,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as "male" | "female",
      email: formData.email || null,
      hasAccount: formData.createAccount && !!formData.email,
      skills: formData.skills,
      area: formData.area,
      rating: isEdit && editWorker ? editWorker.rating : 0,
      status: isEdit && editWorker ? editWorker.status : "available",
      totalShifts: isEdit && editWorker ? editWorker.totalShifts : 0,
      avatar: formData.name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(-2)
        .join("")
        .toUpperCase(),
      zalo: formData.zalo,
      address: formData.address,
      experience: formData.experience,
      notes: formData.notes,
      assignedTo: formData.assignedTo || null,
    }

    onSave?.(newWorker)
    toast.success(isEdit ? "Cập nhật ứng viên thành công!" : `Đã thêm ứng viên ${formData.name}`)

    if (andNew) {
      setFormData({
        name: "", dateOfBirth: "", gender: "male", cccd: "", phone: "", zalo: "",
        address: "", area: "", skills: [], experience: "", notes: "", assignedTo: "",
        createAccount: false, email: "", password: "",
      })
      setErrors({})
    } else {
      onOpenChange(false)
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
                  <Label htmlFor="worker-dob">Ngày sinh <span className="text-destructive">*</span></Label>
                  <Input
                    id="worker-dob"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData((p) => ({ ...p, dateOfBirth: e.target.value }))}
                    placeholder="dd/mm/yyyy"
                  />
                  {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Giới tính <span className="text-destructive">*</span></Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(val) => setFormData((p) => ({ ...p, gender: val as "male" | "female" }))}
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
                  <Label htmlFor="worker-cccd">CCCD <span className="text-destructive">*</span></Label>
                  <Input
                    id="worker-cccd"
                    value={formData.cccd}
                    onChange={(e) => setFormData((p) => ({ ...p, cccd: e.target.value }))}
                    placeholder="079xxxxxxxxx"
                  />
                  {errors.cccd && <p className="text-xs text-destructive">{errors.cccd}</p>}
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
                  <Label>Khu vực <span className="text-destructive">*</span></Label>
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
            <Button variant="outline" onClick={() => handleSave(true)}>
              Lưu & Thêm mới
            </Button>
          )}
          <Button onClick={() => handleSave(false)}>
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
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workerName: string
  onConfirm: () => void
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
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
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
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  currentStaffId?: string | null
  onAssign: (staffId: string) => void
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

// --- Main ---

export function WorkerList() {
  const navigate = useNavigate()

  // Workers state (mutable for assignment changes)
  const [workers, setWorkers] = useState<MockWorker[]>(mockWorkers)

  // Filter state
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [areaFilter, setAreaFilter] = useState("")
  const [ratingFilter, setRatingFilter] = useState("")
  const [staffFilter, setStaffFilter] = useState("")

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(12)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editWorker, setEditWorker] = useState<MockWorker | null>(null)
  const [createAccountWorker, setCreateAccountWorker] = useState<MockWorker | null>(null)
  const [deleteWorker, setDeleteWorker] = useState<MockWorker | null>(null)
  const [assignWorker, setAssignWorker] = useState<MockWorker | null>(null)
  const [bulkAssignOpen, setBulkAssignOpen] = useState(false)

  // Filter logic
  const filtered = workers.filter((w) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !w.name.toLowerCase().includes(q) &&
        !w.phone.includes(q) &&
        !w.cccd.includes(q)
      )
        return false
    }
    if (statusFilter && w.status !== statusFilter) return false
    if (skillFilter && !w.skills.includes(skillFilter)) return false
    if (areaFilter && w.area !== areaFilter) return false
    if (ratingFilter) {
      const minRating = parseInt(ratingFilter)
      if (w.rating < minRating) return false
    }
    if (staffFilter === "unassigned" && w.assignedTo !== null) return false
    if (staffFilter && staffFilter !== "unassigned" && w.assignedTo !== staffFilter) return false
    return true
  })

  // Pagination
  const totalFiltered = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalFiltered / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)
  const showFrom = totalFiltered === 0 ? 0 : (currentPage - 1) * perPage + 1
  const showTo = Math.min(currentPage * perPage, totalFiltered)

  // Stats (from full dataset)
  const totalWorkers = 342
  const availableCount = 156
  const workingCount = 148
  const unassignedCount = workers.filter((w) => w.assignedTo === null).length

  // Selection helpers
  const allOnPageSelected = paginated.length > 0 && paginated.every((w) => selectedIds.has(w.id))
  const someOnPageSelected = paginated.some((w) => selectedIds.has(w.id))

  function toggleSelectAll() {
    if (allOnPageSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginated.forEach((w) => next.delete(w.id))
        return next
      })
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev)
        paginated.forEach((w) => next.add(w.id))
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

  function resetFilters() {
    setSearch("")
    setStatusFilter("")
    setSkillFilter("")
    setAreaFilter("")
    setRatingFilter("")
    setStaffFilter("")
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
    const statusLabel =
      status === "available" ? "Sẵn sàng" :
      status === "inactive" ? "Tạm nghỉ" :
      status === "blacklist" ? "Blacklist" : status
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
    toast.success(`Đã xóa ${selectedIds.size} ứng viên`)
    clearSelection()
  }

  function handleDeleteWorker(worker: MockWorker) {
    toast.success(`Đã xóa ứng viên ${worker.name}`)
  }

  function handleAssignStaff(workerId: string, staffId: string) {
    setWorkers((prev) =>
      prev.map((w) => (w.id === workerId ? { ...w, assignedTo: staffId } : w))
    )
    const staff = getStaffById(staffId)
    toast.success(`Đã phân công ${staff?.name ?? ""} phụ trách ứng viên`)
  }

  function handleBulkAssignStaff(staffId: string) {
    setWorkers((prev) =>
      prev.map((w) => (selectedIds.has(w.id) ? { ...w, assignedTo: staffId } : w))
    )
    const staff = getStaffById(staffId)
    toast.success(`Đã phân công ${staff?.name ?? ""} phụ trách ${selectedIds.size} ứng viên`)
    clearSelection()
  }

  function handleChangeStatus(worker: MockWorker, status: string) {
    const statusLabel =
      status === "available" ? "Sẵn sàng" :
      status === "working" ? "Đang làm việc" :
      status === "inactive" ? "Tạm nghỉ" :
      status === "blacklist" ? "Blacklist" : status
    toast.success(`Đã đổi trạng thái ${worker.name} sang "${statusLabel}"`)
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
          <Button variant="outline" className="gap-1.5">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button className="gap-1.5" onClick={() => { setEditWorker(null); setAddDialogOpen(true) }}>
            <Plus className="h-4 w-4" />
            Thêm ứng viên
          </Button>
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
                  <SelectItem value="working">Đang làm việc</SelectItem>
                  <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                  <SelectItem value="blacklist">Blacklist</SelectItem>
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
                  <DropdownMenuItem onClick={() => handleBulkStatusChange("blacklist")}>
                    Blacklist
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setBulkAssignOpen(true)}>
              <UserCog className="h-3.5 w-3.5" />
              Phân công người PT
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleBulkExport}>
              <Download className="h-3.5 w-3.5" />
              Xuất danh sách
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={handleBulkNotify}>
              <Bell className="h-3.5 w-3.5" />
              Gửi thông báo
            </Button>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={handleBulkDelete}>
              <Trash2 className="h-3.5 w-3.5" />
              Xóa
            </Button>

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
              <TableHead className="w-[220px]">Ứng viên</TableHead>
              <TableHead>SĐT</TableHead>
              <TableHead className="hidden xl:table-cell">Ngày sinh</TableHead>
              <TableHead className="hidden xl:table-cell">Giới tính</TableHead>
              <TableHead>Kỹ năng</TableHead>
              <TableHead>Khu vực</TableHead>
              <TableHead className="hidden xl:table-cell">Người phụ trách</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-center hidden xl:table-cell">Số lần đi làm</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
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
              paginated.map((worker) => {
                const config = statusConfig[worker.status]
                const isSelected = selectedIds.has(worker.id)
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
                            {getInitials(worker.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-tight">
                            {worker.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {worker.cccd}
                          </p>
                        </div>
                      </Link>
                    </TableCell>

                    {/* Phone */}
                    <TableCell className="text-sm">{worker.phone}</TableCell>

                    {/* Date of Birth */}
                    <TableCell className="text-sm text-muted-foreground hidden xl:table-cell">{worker.dateOfBirth}</TableCell>

                    {/* Gender */}
                    <TableCell className="text-sm hidden xl:table-cell">{formatGender(worker.gender)}</TableCell>

                    {/* Skills */}
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {worker.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="rounded-full px-2 py-0 text-[11px] font-normal"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>

                    {/* Area */}
                    <TableCell className="text-sm">{worker.area}</TableCell>

                    {/* Assigned Staff */}
                    <TableCell className="hidden xl:table-cell">
                      {(() => {
                        const staff = getStaffById(worker.assignedTo)
                        if (!staff) {
                          return (
                            <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground border-dashed">
                              Chưa phân công
                            </Badge>
                          )
                        }
                        return (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className={`bg-gradient-to-br ${getStaffAvatarColor(staff.id)} text-[10px] font-semibold text-white`}>
                                {staff.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{staff.name}</span>
                          </div>
                        )
                      })()}
                    </TableCell>

                    {/* Rating */}
                    <TableCell>{renderStars(worker.rating)}</TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-medium ${config.className}`}
                      >
                        <span
                          className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${config.dot}`}
                        />
                        {config.label}
                      </Badge>
                    </TableCell>

                    {/* Shift count */}
                    <TableCell className="text-center text-sm font-medium hidden xl:table-cell">
                      {worker.totalShifts}
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
                            <DropdownMenuItem onClick={() => { setEditWorker(worker); setAddDialogOpen(true) }}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            {!worker.hasAccount && (
                              <DropdownMenuItem onClick={() => setCreateAccountWorker(worker)}>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Tạo tài khoản
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => toast.info(`Điều phối ${worker.name}`)}>
                              <Send className="mr-2 h-4 w-4" />
                              Điều phối
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setAssignWorker(worker)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Phân công người PT
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
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
                                <DropdownMenuItem onClick={() => handleChangeStatus(worker, "working")}>
                                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-blue-500" />
                                  Đang làm việc
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeStatus(worker, "inactive")}>
                                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-gray-400" />
                                  Tạm nghỉ
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleChangeStatus(worker, "blacklist")}>
                                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" />
                                  Blacklist
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
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
        onSave={(worker) => {
          if (editWorker) {
            // Update existing worker in state
            setWorkers((prev) =>
              prev.map((w) => (w.id === worker.id ? worker : w))
            )
          } else {
            // Add new worker to state
            setWorkers((prev) => [worker, ...prev])
          }
        }}
      />

      {createAccountWorker && (
        <CreateAccountDialog
          open={!!createAccountWorker}
          onOpenChange={(open) => { if (!open) setCreateAccountWorker(null) }}
          workerName={createAccountWorker.name}
          onAccountCreated={() => {
            setWorkers((prev) =>
              prev.map((w) =>
                w.id === createAccountWorker.id ? { ...w, hasAccount: true } : w
              )
            )
          }}
        />
      )}

      {deleteWorker && (
        <DeleteWorkerDialog
          open={!!deleteWorker}
          onOpenChange={(open) => { if (!open) setDeleteWorker(null) }}
          workerName={deleteWorker.name}
          onConfirm={() => handleDeleteWorker(deleteWorker)}
        />
      )}

      {assignWorker && (
        <AssignStaffDialog
          open={!!assignWorker}
          onOpenChange={(open) => { if (!open) setAssignWorker(null) }}
          title="Phân công người phụ trách"
          description={`Chọn nhân viên phụ trách ứng viên ${assignWorker.name}.`}
          currentStaffId={assignWorker.assignedTo}
          onAssign={(staffId) => handleAssignStaff(assignWorker.id, staffId)}
        />
      )}

      <AssignStaffDialog
        open={bulkAssignOpen}
        onOpenChange={setBulkAssignOpen}
        title="Phân công hàng loạt"
        description={`Phân công người phụ trách cho ${selectedIds.size} ứng viên đã chọn.`}
        onAssign={handleBulkAssignStaff}
      />
    </div>
  )
}
