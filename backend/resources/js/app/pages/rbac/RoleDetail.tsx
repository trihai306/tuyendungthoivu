import { Link, useParams } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Shield,
  ShieldCheck,
  UserCog,
  Search,
  GitBranch,
  Eye,
  ArrowLeft,
  Users,
  Check,
  X,
  type LucideIcon,
} from "lucide-react"

// Role metadata for display
interface RoleMeta {
  display_name: string
  description: string
  icon: LucideIcon
  iconBg: string
  user_count: number
  level: number
}

const roleMetaMap: Record<string, RoleMeta> = {
  "super-admin": {
    display_name: "Super Admin",
    description: "Toàn quyền hệ thống, quản lý mọi chức năng và dữ liệu",
    icon: Shield,
    iconBg: "from-purple-500 to-purple-600",
    user_count: 2,
    level: 1,
  },
  admin: {
    display_name: "Admin",
    description: "Quản trị viên hệ thống, quản lý người dùng và cấu hình",
    icon: ShieldCheck,
    iconBg: "from-red-500 to-red-600",
    user_count: 3,
    level: 2,
  },
  manager: {
    display_name: "Quản lý",
    description: "Quản lý nhân sự, duyệt tin tuyển dụng và phân công công việc",
    icon: UserCog,
    iconBg: "from-blue-500 to-blue-600",
    user_count: 5,
    level: 3,
  },
  recruiter: {
    display_name: "Tuyển dụng viên",
    description: "Đăng tin tuyển dụng, tìm kiếm và sàng lọc ứng viên",
    icon: Search,
    iconBg: "from-emerald-500 to-emerald-600",
    user_count: 12,
    level: 4,
  },
  coordinator: {
    display_name: "Điều phối viên",
    description: "Điều phối lịch phỏng vấn, liên hệ ứng viên và doanh nghiệp",
    icon: GitBranch,
    iconBg: "from-amber-500 to-amber-600",
    user_count: 8,
    level: 5,
  },
  viewer: {
    display_name: "Xem",
    description: "Chỉ xem dữ liệu, không có quyền chỉnh sửa hoặc tạo mới",
    icon: Eye,
    iconBg: "from-gray-400 to-gray-500",
    user_count: 5,
    level: 6,
  },
}

// Permission definitions grouped by module
interface PermissionRow {
  name: string
  display_name: string
  description: string
}

interface PermissionModule {
  module: string
  display_name: string
  permissions: PermissionRow[]
}

const permissionModules: PermissionModule[] = [
  {
    module: "tuyen-dung",
    display_name: "Tuyển dụng",
    permissions: [
      { name: "jobs.view", display_name: "Xem tin tuyển dụng", description: "Xem danh sách và chi tiết tin tuyển dụng" },
      { name: "jobs.create", display_name: "Tạo tin tuyển dụng", description: "Đăng tin tuyển dụng mới" },
      { name: "jobs.edit", display_name: "Sửa tin tuyển dụng", description: "Chỉnh sửa thông tin tin tuyển dụng" },
      { name: "jobs.delete", display_name: "Xóa tin tuyển dụng", description: "Xóa tin tuyển dụng khỏi hệ thống" },
      { name: "jobs.approve", display_name: "Duyệt tin tuyển dụng", description: "Phê duyệt hoặc từ chối tin tuyển dụng" },
    ],
  },
  {
    module: "ung-vien",
    display_name: "Ứng viên",
    permissions: [
      { name: "applications.view", display_name: "Xem hồ sơ ứng viên", description: "Xem danh sách và chi tiết hồ sơ ứng tuyển" },
      { name: "applications.review", display_name: "Đánh giá ứng viên", description: "Đánh giá và xếp hạng hồ sơ ứng viên" },
      { name: "applications.assign", display_name: "Phân công ứng viên", description: "Phân công ứng viên cho tuyển dụng viên" },
    ],
  },
  {
    module: "nha-tro",
    display_name: "Nhà trọ",
    permissions: [
      { name: "accommodation.view", display_name: "Xem nhà trọ", description: "Xem danh sách và chi tiết nhà trọ liên kết" },
      { name: "accommodation.manage", display_name: "Quản lý nhà trọ", description: "Thêm, sửa, xóa thông tin nhà trọ" },
    ],
  },
  {
    module: "nhan-su",
    display_name: "Nhân sự",
    permissions: [
      { name: "staff.view", display_name: "Xem nhân sự", description: "Xem danh sách và thông tin nhân viên" },
      { name: "staff.manage", display_name: "Quản lý nhân sự", description: "Thêm, sửa, xóa thông tin nhân viên" },
      { name: "staff.assign_tasks", display_name: "Giao việc", description: "Phân công và giao nhiệm vụ cho nhân viên" },
    ],
  },
  {
    module: "he-thong",
    display_name: "Hệ thống",
    permissions: [
      { name: "system.settings", display_name: "Cài đặt hệ thống", description: "Thay đổi cài đặt và cấu hình hệ thống" },
      { name: "system.roles", display_name: "Quản lý vai trò", description: "Tạo, sửa, xóa vai trò và phân quyền" },
      { name: "system.logs", display_name: "Nhật ký hoạt động", description: "Xem nhật ký hoạt động của hệ thống" },
    ],
  },
]

// Which roles have which permissions (true = granted)
const rolePermissions: Record<string, Set<string>> = {
  "super-admin": new Set([
    "jobs.view", "jobs.create", "jobs.edit", "jobs.delete", "jobs.approve",
    "applications.view", "applications.review", "applications.assign",
    "accommodation.view", "accommodation.manage",
    "staff.view", "staff.manage", "staff.assign_tasks",
    "system.settings", "system.roles", "system.logs",
  ]),
  admin: new Set([
    "jobs.view", "jobs.create", "jobs.edit", "jobs.delete", "jobs.approve",
    "applications.view", "applications.review", "applications.assign",
    "accommodation.view", "accommodation.manage",
    "staff.view", "staff.manage", "staff.assign_tasks",
    "system.settings", "system.logs",
  ]),
  manager: new Set([
    "jobs.view", "jobs.create", "jobs.edit", "jobs.approve",
    "applications.view", "applications.review", "applications.assign",
    "accommodation.view",
    "staff.view", "staff.assign_tasks",
    "system.logs",
  ]),
  recruiter: new Set([
    "jobs.view", "jobs.create", "jobs.edit",
    "applications.view", "applications.review",
    "accommodation.view",
    "staff.view",
  ]),
  coordinator: new Set([
    "jobs.view",
    "applications.view", "applications.review",
    "accommodation.view",
    "staff.view",
  ]),
  viewer: new Set([
    "jobs.view",
    "applications.view",
    "accommodation.view",
    "staff.view",
  ]),
}

export function RoleDetail() {
  const { id } = useParams<{ id: string }>()
  const roleId = id ?? "viewer"

  const meta = roleMetaMap[roleId]
  const grantedPermissions = rolePermissions[roleId] ?? new Set<string>()

  if (!meta) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Shield className="h-12 w-12 text-muted-foreground/40" />
        <h2 className="mt-4 text-lg font-semibold">Vai trò không tồn tại</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Không tìm thấy vai trò với mã "{roleId}"
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 gap-1.5"
          render={<Link to="/roles" />}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Quay lại danh sách
        </Button>
      </div>
    )
  }

  const RoleIcon = meta.icon
  const totalPermissions = permissionModules.reduce((acc, m) => acc + m.permissions.length, 0)
  const grantedCount = grantedPermissions.size

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        render={<Link to="/roles" />}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Phân quyền
      </Button>

      {/* Role info header */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${meta.iconBg} shadow-sm`}
            >
              <RoleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">
                  {meta.display_name}
                </h1>
                <Badge
                  variant="outline"
                  className="rounded-md text-[11px] font-medium bg-primary/5 text-primary border-primary/20"
                >
                  Cấp {meta.level}
                </Badge>
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {meta.description}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[12px] font-medium text-muted-foreground">
                    {meta.user_count} người dùng
                  </span>
                </div>
                <div className="h-3.5 w-px bg-border" />
                <div className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-[12px] font-medium text-muted-foreground">
                    {grantedCount}/{totalPermissions} quyền
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permission matrix */}
      {permissionModules.map((mod) => (
        <Card key={mod.module} className="border-border/50 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-[15px] font-semibold">
              {mod.display_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Quyền
                  </TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 hidden sm:table-cell">
                    Mô tả
                  </TableHead>
                  <TableHead className="h-10 w-24 pr-6 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mod.permissions.map((perm) => {
                  const isGranted = grantedPermissions.has(perm.name)
                  return (
                    <TableRow key={perm.name} className="border-0 hover:bg-muted/30">
                      <TableCell className="py-3 pl-6">
                        <div>
                          <p className="text-[13px] font-medium text-foreground">
                            {perm.display_name}
                          </p>
                          <p className="text-[11px] text-muted-foreground sm:hidden">
                            {perm.description}
                          </p>
                          <code className="mt-0.5 text-[10px] text-muted-foreground/60">
                            {perm.name}
                          </code>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[12px] text-muted-foreground hidden sm:table-cell">
                        {perm.description}
                      </TableCell>
                      <TableCell className="py-3 pr-6">
                        <div className="flex items-center justify-center gap-2">
                          {isGranted ? (
                            <div className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hidden sm:inline">
                                Cho phép
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <X className="h-3.5 w-3.5 text-red-400" />
                              <span className="text-[11px] font-medium text-red-500 dark:text-red-400 hidden sm:inline">
                                Từ chối
                              </span>
                            </div>
                          )}
                          <Switch
                            checked={isGranted}
                            size="sm"
                            disabled
                            className="ml-1"
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
