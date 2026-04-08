import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building,
  Users,
  UserCog,
  Sparkles,
  ArrowRight,
  Plus,
  AlertCircle,
} from "lucide-react"
import { useDepartments } from "@/hooks/use-departments"
import { useTeams } from "@/hooks/use-teams"

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const deptIconBgs = [
  "from-emerald-500 to-emerald-600",
  "from-violet-500 to-violet-600",
  "from-blue-500 to-blue-600",
  "from-amber-500 to-amber-600",
  "from-rose-500 to-rose-600",
]

const deptAvatarBgs = [
  "from-emerald-400 to-emerald-600",
  "from-violet-400 to-violet-600",
  "from-blue-400 to-blue-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
]

export function DepartmentList() {
  const { data: deptData, isLoading: deptLoading, isError: deptError } = useDepartments({ per_page: 100 })
  const { data: teamData, isLoading: teamLoading } = useTeams({ per_page: 100 })

  const departments = deptData?.data ?? []
  const teams = teamData?.data ?? []
  const isLoading = deptLoading || teamLoading

  const totalMembers = departments.reduce((sum, d) => sum + (d.member_count ?? 0), 0)
  const totalTeams = teams.length

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (deptError) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-400">Không thể tải dữ liệu phòng ban. Vui lòng thử lại.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Tổ chức</span>
            </div>
            <h1 className="text-xl font-semibold">Phòng ban & Nhóm</h1>
            <p className="mt-1 text-sm text-white/70">
              <span className="font-medium text-white">{departments.length} phòng ban</span> với <span className="font-medium text-white">{totalTeams} nhóm</span> và <span className="font-medium text-white">{totalMembers} nhân viên</span>.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 shadow-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Thêm phòng ban
            </Button>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">Phòng ban</p>
              <p className="text-xl font-semibold">{departments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 shadow-sm">
              <UserCog className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">Tổng nhóm</p>
              <p className="text-xl font-semibold">{totalTeams}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-muted-foreground">Tổng nhân viên</p>
              <p className="text-xl font-semibold">{totalMembers}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department cards */}
      {departments.length === 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Building className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-4 text-sm font-medium">Chưa có phòng ban nào</h3>
            <p className="mt-1 text-xs text-muted-foreground">Tạo phòng ban đầu tiên cho hệ thống</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {departments.map((dept, deptIndex) => {
            const iconBg = deptIconBgs[deptIndex % deptIconBgs.length]
            const avatarBg = deptAvatarBgs[deptIndex % deptAvatarBgs.length]
            const deptTeams = teams.filter((t) => t.department_id === dept.id)
            const headName = dept.head?.name ?? "Chưa có"
            const headInitials = dept.head ? getInitials(dept.head.name) : "?"

            return (
              <Card key={dept.id} className="border-border/50 shadow-sm overflow-hidden">
                {/* Department header */}
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${iconBg} shadow-sm`}>
                        <Building className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold">{dept.name}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground max-w-lg">{dept.description}</p>
                        {/* Head info */}
                        <div className="mt-3 flex items-center gap-2">
                          <Avatar className="h-7 w-7 shadow-sm">
                            <AvatarFallback className={`bg-gradient-to-br ${avatarBg} text-[9px] font-semibold text-white`}>
                              {headInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-[12px] font-medium leading-tight">{headName}</p>
                            <p className="text-[10px] text-muted-foreground">Trưởng phòng</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:pt-1">
                      <div className="text-center">
                        <p className="text-lg font-semibold">{dept.member_count}</p>
                        <p className="text-[10px] text-muted-foreground">Nhân viên</p>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div className="text-center">
                        <p className="text-lg font-semibold">{deptTeams.length}</p>
                        <p className="text-[10px] text-muted-foreground">Nhóm</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Teams list */}
                <CardContent className="pt-0">
                  {deptTeams.length > 0 && (
                    <>
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                        Danh sách nhóm
                      </p>
                      <div className="space-y-2">
                        {deptTeams.map((team) => (
                          <Link
                            key={team.id}
                            to={`/departments/${dept.id}/teams/${team.id}`}
                            className="group flex items-center justify-between rounded-lg border border-border/50 p-3 transition-all hover:bg-muted/40 hover:shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
                                <Users className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-[13px] font-medium group-hover:text-primary transition-colors">{team.name}</p>
                                <p className="text-[11px] text-muted-foreground">
                                  {team.lead ? `Trưởng nhóm: ${team.lead.name}` : ""} &middot; {team.member_count} thành viên
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`rounded-md text-[10px] font-medium ${
                                  team.status === "active"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                    : "bg-gray-50 text-gray-500 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20"
                                }`}
                              >
                                {team.status === "active" ? "Hoạt động" : "Ngừng"}
                              </Badge>
                              <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
