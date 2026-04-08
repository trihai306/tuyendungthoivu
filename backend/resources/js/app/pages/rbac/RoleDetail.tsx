import { useMemo, useState, useCallback, useEffect } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
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
  AlertCircle,
  type LucideIcon,
} from "lucide-react"
import { useRole, usePermissions, useSyncPermissions } from "@/hooks/use-roles"
import type { Permission } from "@/types/rbac"
import { toast } from "sonner"

// Role icon metadata
interface RoleIconMeta {
  icon: LucideIcon
  iconBg: string
}

const roleIconMap: Record<string, RoleIconMeta> = {
  super_admin: { icon: Shield, iconBg: "from-purple-500 to-purple-600" },
  admin: { icon: ShieldCheck, iconBg: "from-red-500 to-red-600" },
  manager: { icon: UserCog, iconBg: "from-blue-500 to-blue-600" },
  recruiter: { icon: Search, iconBg: "from-emerald-500 to-emerald-600" },
  coordinator: { icon: GitBranch, iconBg: "from-amber-500 to-amber-600" },
  viewer: { icon: Eye, iconBg: "from-gray-400 to-gray-500" },
}

const defaultIconMeta: RoleIconMeta = { icon: Shield, iconBg: "from-gray-400 to-gray-500" }

interface PermissionModule {
  module: string
  display_name: string
  permissions: Permission[]
}

function groupPermissionsByModule(permissions: Permission[]): PermissionModule[] {
  const moduleMap = new Map<string, Permission[]>()
  for (const perm of permissions) {
    const mod = perm.module || "other"
    if (!moduleMap.has(mod)) {
      moduleMap.set(mod, [])
    }
    moduleMap.get(mod)!.push(perm)
  }
  return Array.from(moduleMap.entries()).map(([module, perms]) => ({
    module,
    display_name: perms[0]?.module || module,
    permissions: perms,
  }))
}

export function RoleDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: role, isLoading: roleLoading, isError: roleError } = useRole(id)
  const { data: allPermissions, isLoading: permsLoading } = usePermissions()

  const syncPermissions = useSyncPermissions()
  const isLoading = roleLoading || permsLoading

  // Local state for granted permission ids (allows toggling)
  const [localGrantedIds, setLocalGrantedIds] = useState<Set<string>>(new Set())

  // Sync local state when role data loads/changes
  useEffect(() => {
    if (role?.permissions) {
      setLocalGrantedIds(new Set(role.permissions.map((p) => p.id)))
    }
  }, [role?.permissions])

  // Use local state for display
  const grantedPermissionIds = localGrantedIds

  // Group all permissions by module
  const permissionModules = useMemo(() => {
    const perms = allPermissions ?? role?.permissions ?? []
    return groupPermissionsByModule(perms)
  }, [allPermissions, role?.permissions])

  const handleTogglePermission = useCallback((permId: string, checked: boolean) => {
    setLocalGrantedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(permId)
      } else {
        next.delete(permId)
      }
      if (id) {
        syncPermissions.mutate({ roleId: id, permissionIds: Array.from(next) })
      }
      return next
    })
  }, [id, syncPermissions])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-28 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (roleError || !role) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-lg font-semibold">Vai trò không tồn tại</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Không tìm thấy vai trò với ID "{id}"
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

  const iconMeta = roleIconMap[role.name] ?? defaultIconMeta
  const RoleIcon = iconMeta.icon
  const totalPermissions = permissionModules.reduce((acc, m) => acc + m.permissions.length, 0)
  const grantedCount = grantedPermissionIds.size

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
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconMeta.iconBg} shadow-sm`}
            >
              <RoleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-semibold text-foreground">
                  {role.display_name}
                </h1>
                {role.level && (
                  <Badge
                    variant="outline"
                    className="rounded-md text-[11px] font-medium bg-primary/5 text-primary border-primary/20"
                  >
                    Cấp {role.level}
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-[13px] text-muted-foreground">
                {role.description}
              </p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-[12px] font-medium text-muted-foreground">
                    {role.user_count ?? 0} người dùng
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
      {permissionModules.length === 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Shield className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-4 text-sm font-medium">Chưa có quyền nào</h3>
            <p className="mt-1 text-xs text-muted-foreground">Hệ thống chưa có quyền nào được thiết lập</p>
          </CardContent>
        </Card>
      ) : (
        permissionModules.map((mod) => (
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
                      Quyen
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
                    const isGranted = grantedPermissionIds.has(perm.id)
                    return (
                      <TableRow key={perm.id} className="border-0 hover:bg-muted/30">
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
                              onCheckedChange={(checked: boolean) => handleTogglePermission(perm.id, checked)}
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
        ))
      )}
    </div>
  )
}
