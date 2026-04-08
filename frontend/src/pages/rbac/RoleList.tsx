import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  ShieldCheck,
  UserCog,
  Search,
  GitBranch,
  Eye,
  ArrowRight,
  ShieldAlert,
  Users,
  type LucideIcon,
} from "lucide-react"

interface RoleCardData {
  id: string
  name: string
  display_name: string
  description: string
  user_count: number
  icon: LucideIcon
  iconBg: string
  iconColor: string
  borderAccent: string
}

const roles: RoleCardData[] = [
  {
    id: "super-admin",
    name: "super_admin",
    display_name: "Super Admin",
    description: "Toàn quyền hệ thống, quản lý mọi chức năng và dữ liệu",
    user_count: 2,
    icon: Shield,
    iconBg: "from-purple-500 to-purple-600",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderAccent: "group-hover:border-purple-200 dark:group-hover:border-purple-500/30",
  },
  {
    id: "admin",
    name: "admin",
    display_name: "Admin",
    description: "Quản trị viên hệ thống, quản lý người dùng và cấu hình",
    user_count: 3,
    icon: ShieldCheck,
    iconBg: "from-red-500 to-red-600",
    iconColor: "text-red-600 dark:text-red-400",
    borderAccent: "group-hover:border-red-200 dark:group-hover:border-red-500/30",
  },
  {
    id: "manager",
    name: "manager",
    display_name: "Quản lý",
    description: "Quản lý nhân sự, duyệt tin tuyển dụng và phân công công việc",
    user_count: 5,
    icon: UserCog,
    iconBg: "from-blue-500 to-blue-600",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderAccent: "group-hover:border-blue-200 dark:group-hover:border-blue-500/30",
  },
  {
    id: "recruiter",
    name: "recruiter",
    display_name: "Tuyển dụng viên",
    description: "Đăng tin tuyển dụng, tìm kiếm và sàng lọc ứng viên",
    user_count: 12,
    icon: Search,
    iconBg: "from-emerald-500 to-emerald-600",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30",
  },
  {
    id: "coordinator",
    name: "coordinator",
    display_name: "Điều phối viên",
    description: "Điều phối lịch phỏng vấn, liên hệ ứng viên và doanh nghiệp",
    user_count: 8,
    icon: GitBranch,
    iconBg: "from-amber-500 to-amber-600",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderAccent: "group-hover:border-amber-200 dark:group-hover:border-amber-500/30",
  },
  {
    id: "viewer",
    name: "viewer",
    display_name: "Xem",
    description: "Chỉ xem dữ liệu, không có quyền chỉnh sửa hoặc tạo mới",
    user_count: 5,
    icon: Eye,
    iconBg: "from-gray-400 to-gray-500",
    iconColor: "text-gray-600 dark:text-gray-400",
    borderAccent: "group-hover:border-gray-200 dark:group-hover:border-gray-500/30",
  },
]

export function RoleList() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-white/80" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Bảo mật
            </span>
          </div>
          <h1 className="text-xl font-semibold">Phân quyền hệ thống</h1>
          <p className="mt-1 text-sm text-white/70">
            Quản lý vai trò và quyền truy cập cho người dùng trong hệ thống
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/80 to-primary shadow-sm">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-medium">6 vai trò</p>
            <p className="text-[11px] text-muted-foreground">Đang hoạt động</p>
          </div>
        </div>
        <div className="h-8 w-px bg-border/70" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-medium">35 người dùng</p>
            <p className="text-[11px] text-muted-foreground">Đã được phân quyền</p>
          </div>
        </div>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <Card
            key={role.id}
            className={`group relative overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${role.borderAccent}`}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${role.iconBg} shadow-sm`}
                >
                  <role.icon className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[15px] font-semibold text-foreground">
                    {role.display_name}
                  </h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground line-clamp-2">
                    {role.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[12px] font-medium text-muted-foreground">
                    {role.user_count} người dùng
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-[12px] font-medium text-primary hover:text-primary"
                  render={<Link to={`/phan-quyen/${role.id}`} />}
                >
                  Xem quyền
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
