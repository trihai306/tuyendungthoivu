import { useState } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
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
  AlertCircle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { StaffRole } from "@/types/staff"
import { useStaffList, useToggleStaffActive } from "@/hooks/use-staff"
import { useDepartments } from "@/hooks/use-departments"
import { toast } from "sonner"

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

const roleOptions: { label: string; value: string }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Super Admin", value: "super_admin" },
  { label: "Admin", value: "admin" },
  { label: "Quản lý", value: "manager" },
  { label: "Tuyển dụng viên", value: "recruiter" },
  { label: "Điều phối viên", value: "coordinator" },
  { label: "Xem", value: "viewer" },
]
const statusOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Hoạt động", value: "active" },
  { label: "Ngưng", value: "inactive" },
]

export function StaffList() {
  const [search, setSearch] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 8

  // Fetch departments for filter dropdown
  const { data: deptData } = useDepartments({ per_page: 100 })

  // Build API filters
  const apiFilters = {
    search: search || undefined,
    role: roleFilter ? (roleFilter as StaffRole) : undefined,
    department_id: departmentFilter || undefined,
    is_active: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
    page: currentPage,
    per_page: perPage,
  }

  const { data, isLoading, isError } = useStaffList(apiFilters)
  const toggleActive = useToggleStaffActive()

  const staffList = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta?.last_page ?? 1
  const totalStaff = meta?.total ?? 0

  // Compute stats from current page data (approximate)
  const activeStaff = staffList.filter((s) => s.is_active).length
  const recruiterCount = staffList.filter((s) => s.role === "recruiter" && s.is_active).length
  const managerCount = staffList.filter((s) => (s.role === "manager" || s.role === "super_admin" || s.role === "admin") && s.is_active).length

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
      value: totalStaff > 0 ? String(activeStaff) : "0",
      change: totalStaff > 0 ? `${Math.round((activeStaff / Math.max(staffList.length, 1)) * 100)}%` : "0%",
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
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 shadow-sm" onClick={() => toast.info("Tính năng đang phát triển")}>
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
                    {isLoading ? (
                      <Skeleton className="h-8 w-12" />
                    ) : (
                      <span className="text-[28px] font-semibold tracking-tight leading-none">{stat.value}</span>
                    )}
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
              <Select value={departmentFilter} onValueChange={(v) => { setDepartmentFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Tất cả</SelectItem>
                  {deptData?.data?.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((r) => (
                    <SelectItem key={r.value} value={r.value === "all" ? "__all__" : r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === "__all__" ? "" : v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s.value} value={s.value === "all" ? "__all__" : s.value}>{s.label}</SelectItem>
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
          Hiển thị <span className="font-medium text-foreground">{staffList.length}</span> / <span className="font-medium text-foreground">{totalStaff}</span> nhân viên
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <Card className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-400">Không thể tải dữ liệu nhân viên. Vui lòng thử lại.</p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 pl-6">Nhân viên</TableHead>
                  <TableHead className="h-10">Vai trò</TableHead>
                  <TableHead className="h-10">Phòng ban</TableHead>
                  <TableHead className="h-10">Chức vụ</TableHead>
                  <TableHead className="h-10">KPI</TableHead>
                  <TableHead className="h-10">Trạng thái</TableHead>
                  <TableHead className="h-10 pr-6 text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-3 pl-6"><Skeleton className="h-9 w-40" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-9 w-32" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-5 w-28" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="py-3"><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell className="py-3 pr-6 text-right"><Skeleton className="h-7 w-7 ml-auto" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      {!isLoading && !isError && staffList.length === 0 ? (
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
      ) : !isLoading && !isError && (
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
                {staffList.map((staff, index) => {
                  const role = roleConfig[staff.role] ?? roleConfig.viewer
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
                              to={`/staff/${staff.id}`}
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
                            <DropdownMenuItem render={<Link to={`/staff/${staff.id}`} />}>
                              <Eye className="h-4 w-4" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Tính năng đang phát triển")}>
                              <Pencil className="h-4 w-4" />
                              Sửa thông tin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Tính năng đang phát triển")}>
                              <ClipboardList className="h-4 w-4" />
                              Giao việc
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => toggleActive.mutate(staff.id)}
                            >
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
