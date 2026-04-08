import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Search,
  UserCog,
  Users,
  UserCheck,
  ShieldCheck,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  ClipboardList,
  Ban,
  Sparkles,
  ArrowUpRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { Staff, StaffRole } from "@/types/staff"

// --- Role config ---

interface RoleConfig {
  label: string
  className: string
}

const roleConfig: Record<StaffRole, RoleConfig> = {
  super_admin: {
    label: "Super Admin",
    className: "bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  },
  admin: {
    label: "Admin",
    className: "bg-red-50 text-red-700 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  manager: {
    label: "Quản lý",
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  recruiter: {
    label: "Tuyển dụng viên",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  coordinator: {
    label: "Điều phối viên",
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  viewer: {
    label: "Xem",
    className: "bg-gray-50 text-gray-600 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
}

// --- Stats ---

interface StatItem {
  title: string
  value: string
  change: string
  icon: LucideIcon
  description: string
  iconBg: string
}

// --- Mock data ---

const mockStaff: Staff[] = [
  {
    id: "1",
    name: "Nguyễn Văn Hùng",
    email: "hung.nv@company.vn",
    phone: "0901234567",
    employee_code: "NV-001",
    role: "super_admin",
    department: { id: "d1", name: "Phòng Vận hành", description: "", member_count: 8, status: "active" },
    team: { id: "t1", department_id: "d1", name: "Ban Giám đốc", description: "", members: [], member_count: 3, status: "active" },
    position: "Giám đốc điều hành",
    is_active: true,
    hire_date: "2020-03-15",
    stats: { tasks_completed: 45, tasks_pending: 2, interviews_done: 12, applications_reviewed: 89 },
  },
  {
    id: "2",
    name: "Trần Thị Mai",
    email: "mai.tt@company.vn",
    phone: "0912345678",
    employee_code: "NV-002",
    role: "admin",
    department: { id: "d1", name: "Phòng Vận hành", description: "", member_count: 8, status: "active" },
    team: { id: "t2", department_id: "d1", name: "Nhóm Quản trị", description: "", members: [], member_count: 4, status: "active" },
    position: "Quản trị hệ thống",
    is_active: true,
    hire_date: "2021-06-01",
    stats: { tasks_completed: 38, tasks_pending: 5, interviews_done: 0, applications_reviewed: 45 },
  },
  {
    id: "3",
    name: "Lê Văn Đức",
    email: "duc.lv@company.vn",
    phone: "0923456789",
    employee_code: "NV-003",
    role: "manager",
    department: { id: "d2", name: "Phòng Tuyển dụng", description: "", member_count: 12, status: "active" },
    team: { id: "t3", department_id: "d2", name: "Nhóm Tuyển dụng CNTT", description: "", members: [], member_count: 5, status: "active" },
    position: "Trưởng phòng tuyển dụng",
    is_active: true,
    hire_date: "2020-09-10",
    stats: { tasks_completed: 52, tasks_pending: 8, interviews_done: 35, applications_reviewed: 156 },
  },
  {
    id: "4",
    name: "Phạm Thị Hoa",
    email: "hoa.pt@company.vn",
    phone: "0934567890",
    employee_code: "NV-004",
    role: "recruiter",
    department: { id: "d2", name: "Phòng Tuyển dụng", description: "", member_count: 12, status: "active" },
    team: { id: "t3", department_id: "d2", name: "Nhóm Tuyển dụng CNTT", description: "", members: [], member_count: 5, status: "active" },
    position: "Chuyên viên tuyển dụng",
    is_active: true,
    hire_date: "2022-01-15",
    stats: { tasks_completed: 67, tasks_pending: 12, interviews_done: 48, applications_reviewed: 234 },
  },
  {
    id: "5",
    name: "Hoàng Minh Tuấn",
    email: "tuan.hm@company.vn",
    phone: "0945678901",
    employee_code: "NV-005",
    role: "recruiter",
    department: { id: "d2", name: "Phòng Tuyển dụng", description: "", member_count: 12, status: "active" },
    team: { id: "t4", department_id: "d2", name: "Nhóm Tuyển dụng Sản xuất", description: "", members: [], member_count: 4, status: "active" },
    position: "Chuyên viên tuyển dụng",
    is_active: true,
    hire_date: "2022-05-20",
    stats: { tasks_completed: 43, tasks_pending: 7, interviews_done: 29, applications_reviewed: 178 },
  },
  {
    id: "6",
    name: "Vũ Thị Lan",
    email: "lan.vt@company.vn",
    phone: "0956789012",
    employee_code: "NV-006",
    role: "coordinator",
    department: { id: "d3", name: "Phòng Quản lý trọ", description: "", member_count: 6, status: "active" },
    team: { id: "t5", department_id: "d3", name: "Nhóm Quản lý trọ Bắc", description: "", members: [], member_count: 3, status: "active" },
    position: "Điều phối viên nhà trọ",
    is_active: true,
    hire_date: "2023-02-01",
    stats: { tasks_completed: 31, tasks_pending: 4, interviews_done: 0, applications_reviewed: 0 },
  },
  {
    id: "7",
    name: "Đặng Quốc Bảo",
    email: "bao.dq@company.vn",
    phone: "0967890123",
    employee_code: "NV-007",
    role: "manager",
    department: { id: "d3", name: "Phòng Quản lý trọ", description: "", member_count: 6, status: "active" },
    team: { id: "t5", department_id: "d3", name: "Nhóm Quản lý trọ Bắc", description: "", members: [], member_count: 3, status: "active" },
    position: "Trưởng phòng quản lý trọ",
    is_active: true,
    hire_date: "2021-08-15",
    stats: { tasks_completed: 28, tasks_pending: 3, interviews_done: 5, applications_reviewed: 12 },
  },
  {
    id: "8",
    name: "Bùi Thị Ngọc",
    email: "ngoc.bt@company.vn",
    phone: "0978901234",
    employee_code: "NV-008",
    role: "recruiter",
    department: { id: "d2", name: "Phòng Tuyển dụng", description: "", member_count: 12, status: "active" },
    team: { id: "t4", department_id: "d2", name: "Nhóm Tuyển dụng Sản xuất", description: "", members: [], member_count: 4, status: "active" },
    position: "Chuyên viên tuyển dụng",
    is_active: false,
    hire_date: "2022-11-01",
    stats: { tasks_completed: 22, tasks_pending: 0, interviews_done: 15, applications_reviewed: 98 },
  },
  {
    id: "9",
    name: "Ngô Thanh Phong",
    email: "phong.nt@company.vn",
    phone: "0989012345",
    employee_code: "NV-009",
    role: "coordinator",
    department: { id: "d1", name: "Phòng Vận hành", description: "", member_count: 8, status: "active" },
    team: { id: "t2", department_id: "d1", name: "Nhóm Quản trị", description: "", members: [], member_count: 4, status: "active" },
    position: "Điều phối viên vận hành",
    is_active: true,
    hire_date: "2023-04-10",
    stats: { tasks_completed: 19, tasks_pending: 6, interviews_done: 0, applications_reviewed: 0 },
  },
  {
    id: "10",
    name: "Lý Thị Kim Anh",
    email: "anh.ltk@company.vn",
    phone: "0990123456",
    employee_code: "NV-010",
    role: "viewer",
    department: { id: "d1", name: "Phòng Vận hành", description: "", member_count: 8, status: "active" },
    position: "Thực tập sinh",
    is_active: true,
    hire_date: "2024-01-08",
    stats: { tasks_completed: 8, tasks_pending: 3, interviews_done: 0, applications_reviewed: 15 },
  },
]

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const avatarColors = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
  "from-pink-400 to-pink-600",
  "from-orange-400 to-orange-600",
  "from-teal-400 to-teal-600",
  "from-indigo-400 to-indigo-600",
]

function getAvatarColor(index: number): string {
  return avatarColors[index % avatarColors.length]
}

const departmentOptions = ["Tất cả", "Phòng Tuyển dụng", "Phòng Quản lý trọ", "Phòng Vận hành"]
const roleOptions: { label: string; value: string }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
  { label: "Quản lý", value: "manager" },
  { label: "Tuyển dụng viên", value: "recruiter" },
  { label: "Điều phối viên", value: "coordinator" },
  { label: "Xem", value: "viewer" },
]
const statusOptions = ["Tất cả", "Hoạt động", "Ngưng"]

export function StaffList() {
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("Tất cả")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 8

  const filtered = useMemo(() => {
    return mockStaff.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.employee_code.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase())

      const matchDept =
        departmentFilter === "Tất cả" || s.department?.name === departmentFilter

      const matchRole = roleFilter === "all" || s.role === roleFilter

      const matchStatus =
        statusFilter === "Tất cả" ||
        (statusFilter === "Hoạt động" && s.is_active) ||
        (statusFilter === "Ngưng" && !s.is_active)

      return matchSearch && matchDept && matchRole && matchStatus
    })
  }, [search, departmentFilter, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  // Compute stats
  const totalStaff = mockStaff.length
  const activeStaff = mockStaff.filter((s) => s.is_active).length
  const recruiterCount = mockStaff.filter((s) => s.role === "recruiter" && s.is_active).length
  const managerCount = mockStaff.filter((s) => (s.role === "manager" || s.role === "super_admin" || s.role === "admin") && s.is_active).length

  const statsItems: StatItem[] = [
    {
      title: "Tổng nhân viên",
      value: String(totalStaff),
      change: "+2",
      icon: Users,
      description: "tháng này",
      iconBg: "from-blue-500 to-blue-600",
    },
    {
      title: "Đang hoạt động",
      value: String(activeStaff),
      change: `${Math.round((activeStaff / totalStaff) * 100)}%`,
      icon: UserCheck,
      description: "tỷ lệ",
      iconBg: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Tuyển dụng viên",
      value: String(recruiterCount),
      change: "+1",
      icon: UserCog,
      description: "tháng này",
      iconBg: "from-violet-500 to-violet-600",
    },
    {
      title: "Quản lý",
      value: String(managerCount),
      change: "0",
      icon: ShieldCheck,
      description: "không đổi",
      iconBg: "from-amber-500 to-amber-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Nhân sự</span>
            </div>
            <h1 className="text-xl font-semibold">Quản lý nhân sự</h1>
            <p className="mt-1 text-sm text-white/70">
              Quản lý <span className="font-medium text-white">{totalStaff} nhân viên</span> trong hệ thống, phân quyền và theo dõi hiệu suất.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 shadow-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Thêm nhân viên
            </Button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsItems.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-[13px] font-medium text-muted-foreground">{stat.title}</p>
                  <div>
                    <span className="text-[28px] font-semibold tracking-tight leading-none">{stat.value}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.change}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{stat.description}</span>
                  </div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-sm`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, mã NV, email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departmentOptions.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <span className="font-medium text-foreground">{paginated.length}</span> / <span className="font-medium text-foreground">{filtered.length}</span> nhân viên
        </p>
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-medium">Không tìm thấy nhân viên</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Nhân viên</TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Vai trò</TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Phòng ban / Nhóm</TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Chức vụ</TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">KPI tháng này</TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Trạng thái</TableHead>
                  <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((staff, index) => {
                  const role = roleConfig[staff.role]
                  const totalTasks = (staff.stats?.tasks_completed ?? 0) + (staff.stats?.tasks_pending ?? 0)
                  const completedTasks = staff.stats?.tasks_completed ?? 0
                  const kpiPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

                  return (
                    <TableRow key={staff.id} className="group cursor-pointer border-0 transition-colors hover:bg-muted/40">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shadow-sm">
                            <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(index)} text-[11px] font-semibold text-white`}>
                              {getInitials(staff.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link
                              to={`/nhan-su/${staff.id}`}
                              className="text-[13px] font-medium hover:text-primary transition-colors"
                            >
                              {staff.name}
                            </Link>
                            <p className="text-[11px] text-muted-foreground">{staff.employee_code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={`rounded-md text-[11px] font-medium ${role.className}`}>
                          {role.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3">
                        <div>
                          <p className="text-[13px] font-medium">{staff.department?.name ?? "---"}</p>
                          {staff.team && (
                            <p className="text-[11px] text-muted-foreground">{staff.team.name}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-muted-foreground">
                        {staff.position}
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                kpiPercent >= 80
                                  ? "bg-emerald-500"
                                  : kpiPercent >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${kpiPercent}%` }}
                            />
                          </div>
                          <span className="text-[12px] font-medium tabular-nums text-muted-foreground">
                            {completedTasks}/{totalTasks}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`h-2 w-2 rounded-full ${staff.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                          <span className={`text-[12px] font-medium ${staff.is_active ? "text-emerald-700 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}>
                            {staff.is_active ? "Hoạt động" : "Ngưng"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" sideOffset={4}>
                            <DropdownMenuItem render={<Link to={`/nhan-su/${staff.id}`} />}>
                              <Eye className="h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="h-4 w-4" />
                              Sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ClipboardList className="h-4 w-4" />
                              Giao việc
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem variant="destructive">
                              <Ban className="h-4 w-4" />
                              {staff.is_active ? "Vô hiệu hóa" : "Kích hoạt lại"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Trước"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                text="Sau"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
