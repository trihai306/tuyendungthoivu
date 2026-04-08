import { useParams, Link } from "react-router-dom"
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
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  FileCheck,
  AlertCircle,
} from "lucide-react"
import type { StaffRole } from "@/types/staff"
import { useTeam } from "@/hooks/use-teams"

// --- Role config ---

const roleConfig: Record<StaffRole, { label: string; className: string }> = {
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

const memberAvatarColors = [
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-cyan-400 to-cyan-600",
  "from-pink-400 to-pink-600",
  "from-indigo-400 to-indigo-600",
  "from-orange-400 to-orange-600",
  "from-teal-400 to-teal-600",
  "from-violet-400 to-violet-600",
  "from-blue-400 to-blue-600",
  "from-rose-400 to-rose-600",
]

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function TeamDetail() {
  const { teamId } = useParams<{ deptId: string; teamId: string }>()
  const { data: team, isLoading, isError } = useTeam(teamId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (isError || !team) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
          render={<Link to="/departments" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Phòng ban & Nhóm
        </Button>
        <Card className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h3 className="mt-4 text-sm font-medium">Không tìm thấy nhóm</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Nhóm với ID "{teamId}" không tồn tại hoặc bạn không có quyền truy cập.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const members = team.members ?? []
  const memberCount = team.member_count ?? members.length

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        render={<Link to="/departments" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Phòng ban & Nhóm
      </Button>

      {/* Team hero */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40">
          <div className="absolute -bottom-2 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
        </div>
        <CardContent className="relative px-6 pb-6 -mt-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-card shadow-lg ring-4 ring-card">
              <Users className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight">{team.name}</h1>
                <Badge
                  variant="outline"
                  className={`rounded-md text-[11px] font-medium ${
                    team.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                      : "bg-gray-50 text-gray-500 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20"
                  }`}
                >
                  {team.status === "active" ? "Hoạt động" : "Ngừng"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {team.department && (
                  <span>Phòng ban: <span className="font-medium text-foreground">{team.department.name}</span></span>
                )}
                {team.lead && (
                  <>
                    <span className="text-border">|</span>
                    <span className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-[8px] font-semibold text-white">
                          {getInitials(team.lead.name)}
                        </AvatarFallback>
                      </Avatar>
                      Trưởng nhóm: <span className="font-medium text-foreground">{team.lead.name}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team performance overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Thành viên</p>
              <p className="text-lg font-semibold">{memberCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Trạng thái</p>
              <p className="text-lg font-semibold">{team.status === "active" ? "Hoạt động" : "Ngừng"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <FileCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Phòng ban</p>
              <p className="text-lg font-semibold">{team.department?.name ?? "---"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Trưởng nhóm</p>
              <p className="text-lg font-semibold">{team.lead?.name ?? "Chưa có"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Members grid */}
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
              <Users className="h-4 w-4 text-primary" />
              Thành viên ({members.length})
            </CardTitle>
            <Button size="sm" variant="outline">Thêm thành viên</Button>
          </div>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-8 w-8 text-muted-foreground/50" />
              <p className="mt-2 text-sm text-muted-foreground">Chưa có thành viên nào trong nhóm</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, memberIndex) => {
                const role = roleConfig[member.role as StaffRole] ?? roleConfig.viewer
                const memberTotal = (member.stats?.tasks_completed ?? 0) + (member.stats?.tasks_pending ?? 0)
                const memberPercent = memberTotal > 0 ? Math.round(((member.stats?.tasks_completed ?? 0) / memberTotal) * 100) : 0
                const avatarBg = memberAvatarColors[memberIndex % memberAvatarColors.length]

                return (
                  <Card key={member.id} className="border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 shadow-sm">
                          <AvatarFallback className={`bg-gradient-to-br ${avatarBg} text-[11px] font-semibold text-white`}>
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/staff/${member.id}`}
                            className="text-[13px] font-medium hover:text-primary transition-colors truncate block"
                          >
                            {member.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground truncate">{member.position}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${member.is_active ? "text-emerald-600" : "text-gray-500"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${member.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                          {member.is_active ? "HD" : "Ngừng"}
                        </span>
                      </div>

                      <div className="mt-3">
                        <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${role.className}`}>
                          {role.label}
                        </Badge>
                      </div>

                      {/* Task stats */}
                      {memberTotal > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                            <span>Công việc</span>
                            <span className="font-medium tabular-nums">{member.stats?.tasks_completed ?? 0}/{memberTotal}</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                memberPercent >= 80
                                  ? "bg-emerald-500"
                                  : memberPercent >= 50
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                              }`}
                              style={{ width: `${memberPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
