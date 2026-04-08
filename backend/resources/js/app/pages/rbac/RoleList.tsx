import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
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
  AlertCircle,
  type LucideIcon,
} from "lucide-react"
import { useRoles } from "@/hooks/use-roles"
import type { Role } from "@/types/rbac"

// Map role names to icons/colors for display
interface RoleDisplay {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  borderAccent: string
}

const roleDisplayMap: Record<string, RoleDisplay> = {
  super_admin: {
    icon: Shield,
    iconBg: "from-purple-500 to-purple-600",
    iconColor: "text-purple-600 dark:text-purple-400",
    borderAccent: "group-hover:border-purple-200 dark:group-hover:border-purple-500/30",
  },
  admin: {
    icon: ShieldCheck,
    iconBg: "from-red-500 to-red-600",
    iconColor: "text-red-600 dark:text-red-400",
    borderAccent: "group-hover:border-red-200 dark:group-hover:border-red-500/30",
  },
  manager: {
    icon: UserCog,
    iconBg: "from-blue-500 to-blue-600",
    iconColor: "text-blue-600 dark:text-blue-400",
    borderAccent: "group-hover:border-blue-200 dark:group-hover:border-blue-500/30",
  },
  recruiter: {
    icon: Search,
    iconBg: "from-emerald-500 to-emerald-600",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "group-hover:border-emerald-200 dark:group-hover:border-emerald-500/30",
  },
  coordinator: {
    icon: GitBranch,
    iconBg: "from-amber-500 to-amber-600",
    iconColor: "text-amber-600 dark:text-amber-400",
    borderAccent: "group-hover:border-amber-200 dark:group-hover:border-amber-500/30",
  },
  viewer: {
    icon: Eye,
    iconBg: "from-gray-400 to-gray-500",
    iconColor: "text-gray-600 dark:text-gray-400",
    borderAccent: "group-hover:border-gray-200 dark:group-hover:border-gray-500/30",
  },
}

const defaultDisplay: RoleDisplay = {
  icon: Shield,
  iconBg: "from-gray-400 to-gray-500",
  iconColor: "text-gray-600 dark:text-gray-400",
  borderAccent: "group-hover:border-gray-200 dark:group-hover:border-gray-500/30",
}

function getRoleDisplay(roleName: string): RoleDisplay {
  return roleDisplayMap[roleName] ?? defaultDisplay
}

export function RoleList() {
  const { data, isLoading, isError } = useRoles({ per_page: 50 })
  const roles: Role[] = data?.data ?? []
  const totalUsers = roles.reduce((sum, r) => sum + (r.user_count ?? 0), 0)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-lg" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-400">Không thể tải dữ liệu vai trò. Vui lòng thử lại.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
            <p className="text-[13px] font-medium">{roles.length} vai trò</p>
            <p className="text-[11px] text-muted-foreground">Đang hoạt động</p>
          </div>
        </div>
        <div className="h-8 w-px bg-border/70" />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
            <Users className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-medium">{totalUsers} người dùng</p>
            <p className="text-[11px] text-muted-foreground">Đã được phân quyền</p>
          </div>
        </div>
      </div>

      {/* Role Grid */}
      {roles.length === 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Shield className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-4 text-sm font-medium">Chưa có vai trò nào</h3>
            <p className="mt-1 text-xs text-muted-foreground">Hệ thống chưa có vai trò nào được thiết lập</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => {
            const display = getRoleDisplay(role.name)
            const RoleIcon = display.icon

            return (
              <Card
                key={role.id}
                className={`group relative overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${display.borderAccent}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${display.iconBg} shadow-sm`}
                    >
                      <RoleIcon className="h-5 w-5 text-white" />
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
                        {role.user_count ?? 0} người dùng
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 text-[12px] font-medium text-primary hover:text-primary"
                      render={<Link to={`/roles/${role.id}`} />}
                    >
                      Xem quyền
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
