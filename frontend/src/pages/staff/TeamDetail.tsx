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
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  FileCheck,
} from "lucide-react"
import type { StaffRole } from "@/types/staff"

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

// --- Types ---

interface TeamMember {
  id: string
  name: string
  role: StaffRole
  position: string
  avatarBg: string
  is_active: boolean
  stats: {
    tasks_completed: number
    tasks_pending: number
  }
}

interface TeamData {
  id: string
  departmentId: string
  departmentName: string
  name: string
  description: string
  leadName: string
  leadAvatarBg: string
  leadPosition: string
  status: "active" | "inactive"
  members: TeamMember[]
  performance: {
    tasksCompleted: number
    tasksPending: number
    interviewsDone: number
    applicationsReviewed: number
  }
}

// --- Mock data ---

const mockTeams: Record<string, TeamData> = {
  "t3": {
    id: "t3",
    departmentId: "d2",
    departmentName: "Phòng Tuyển dụng",
    name: "Nhóm Tuyển dụng CNTT",
    description: "Phụ trách tuyển dụng các vị trí công nghệ thông tin: lập trình viên, kỹ sư phần mềm, DevOps, QA/QC.",
    leadName: "Lê Văn Đức",
    leadAvatarBg: "from-emerald-400 to-emerald-600",
    leadPosition: "Trưởng nhóm",
    status: "active",
    members: [
      { id: "3", name: "Lê Văn Đức", role: "manager", position: "Trưởng nhóm", avatarBg: "from-emerald-400 to-emerald-600", is_active: true, stats: { tasks_completed: 52, tasks_pending: 8 } },
      { id: "4", name: "Phạm Thị Hoa", role: "recruiter", position: "Chuyên viên tuyển dụng", avatarBg: "from-amber-400 to-amber-600", is_active: true, stats: { tasks_completed: 67, tasks_pending: 12 } },
      { id: "11", name: "Trần Minh Khôi", role: "recruiter", position: "Chuyên viên tuyển dụng", avatarBg: "from-cyan-400 to-cyan-600", is_active: true, stats: { tasks_completed: 34, tasks_pending: 6 } },
      { id: "12", name: "Nguyễn Thị Phương", role: "coordinator", position: "Điều phối viên", avatarBg: "from-pink-400 to-pink-600", is_active: true, stats: { tasks_completed: 28, tasks_pending: 4 } },
      { id: "13", name: "Đỗ Văn Thành", role: "viewer", position: "Thực tập sinh", avatarBg: "from-indigo-400 to-indigo-600", is_active: true, stats: { tasks_completed: 12, tasks_pending: 3 } },
    ],
    performance: {
      tasksCompleted: 193,
      tasksPending: 33,
      interviewsDone: 83,
      applicationsReviewed: 312,
    },
  },
  "t4": {
    id: "t4",
    departmentId: "d2",
    departmentName: "Phòng Tuyển dụng",
    name: "Nhóm Tuyển dụng Sản xuất",
    description: "Phụ trách tuyển dụng nhân sự cho các nhà máy, khu công nghiệp: công nhân, kỹ thuật viên, quản lý sản xuất.",
    leadName: "Hoàng Minh Tuấn",
    leadAvatarBg: "from-orange-400 to-orange-600",
    leadPosition: "Trưởng nhóm",
    status: "active",
    members: [
      { id: "5", name: "Hoàng Minh Tuấn", role: "recruiter", position: "Trưởng nhóm", avatarBg: "from-orange-400 to-orange-600", is_active: true, stats: { tasks_completed: 43, tasks_pending: 7 } },
      { id: "8", name: "Bùi Thị Ngọc", role: "recruiter", position: "Chuyên viên tuyển dụng", avatarBg: "from-rose-400 to-rose-600", is_active: false, stats: { tasks_completed: 22, tasks_pending: 0 } },
      { id: "14", name: "Lý Minh Hoàng", role: "recruiter", position: "Chuyên viên tuyển dụng", avatarBg: "from-teal-400 to-teal-600", is_active: true, stats: { tasks_completed: 38, tasks_pending: 5 } },
      { id: "15", name: "Phan Thị Hạnh", role: "coordinator", position: "Điều phối viên", avatarBg: "from-violet-400 to-violet-600", is_active: true, stats: { tasks_completed: 25, tasks_pending: 3 } },
    ],
    performance: {
      tasksCompleted: 128,
      tasksPending: 15,
      interviewsDone: 44,
      applicationsReviewed: 156,
    },
  },
  "t5": {
    id: "t5",
    departmentId: "d3",
    departmentName: "Phòng Quản lý trọ",
    name: "Nhóm Quản lý trọ Bắc",
    description: "Quản lý hệ thống nhà trọ khu vực miền Bắc, bao gồm Hà Nội, Hải Phòng, Bắc Ninh.",
    leadName: "Đặng Quốc Bảo",
    leadAvatarBg: "from-violet-400 to-violet-600",
    leadPosition: "Trưởng nhóm",
    status: "active",
    members: [
      { id: "7", name: "Đặng Quốc Bảo", role: "manager", position: "Trưởng nhóm", avatarBg: "from-violet-400 to-violet-600", is_active: true, stats: { tasks_completed: 28, tasks_pending: 3 } },
      { id: "6", name: "Vũ Thị Lan", role: "coordinator", position: "Điều phối viên", avatarBg: "from-pink-400 to-pink-600", is_active: true, stats: { tasks_completed: 31, tasks_pending: 4 } },
      { id: "16", name: "Trịnh Văn Nam", role: "coordinator", position: "Điều phối viên", avatarBg: "from-blue-400 to-blue-600", is_active: true, stats: { tasks_completed: 24, tasks_pending: 2 } },
    ],
    performance: {
      tasksCompleted: 83,
      tasksPending: 9,
      interviewsDone: 5,
      applicationsReviewed: 12,
    },
  },
}

// Fallback for teams not in mock data
const defaultTeam: TeamData = {
  id: "t1",
  departmentId: "d1",
  departmentName: "Phòng Vận hành",
  name: "Ban Giám đốc",
  description: "Ban lãnh đạo và quản lý chiến lược toàn hệ thống.",
  leadName: "Nguyễn Văn Hùng",
  leadAvatarBg: "from-blue-400 to-blue-600",
  leadPosition: "Giám đốc điều hành",
  status: "active",
  members: [
    { id: "1", name: "Nguyễn Văn Hùng", role: "super_admin", position: "Giám đốc điều hành", avatarBg: "from-blue-400 to-blue-600", is_active: true, stats: { tasks_completed: 45, tasks_pending: 2 } },
    { id: "2", name: "Trần Thị Mai", role: "admin", position: "Quản trị hệ thống", avatarBg: "from-violet-400 to-violet-600", is_active: true, stats: { tasks_completed: 38, tasks_pending: 5 } },
    { id: "9", name: "Ngô Thanh Phong", role: "coordinator", position: "Điều phối viên", avatarBg: "from-cyan-400 to-cyan-600", is_active: true, stats: { tasks_completed: 19, tasks_pending: 6 } },
  ],
  performance: {
    tasksCompleted: 102,
    tasksPending: 13,
    interviewsDone: 12,
    applicationsReviewed: 89,
  },
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function TeamDetail() {
  const { teamId } = useParams<{ deptId: string; teamId: string }>()
  const team = mockTeams[teamId ?? ""] ?? defaultTeam

  const totalTasks = team.performance.tasksCompleted + team.performance.tasksPending
  const completionRate = totalTasks > 0 ? Math.round((team.performance.tasksCompleted / totalTasks) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        render={<Link to="/phong-ban" />}
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
                  {team.status === "active" ? "Hoạt động" : "Ngưng"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{team.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>Phòng ban: <span className="font-medium text-foreground">{team.departmentName}</span></span>
                <span className="text-border">|</span>
                <span className="flex items-center gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className={`bg-gradient-to-br ${team.leadAvatarBg} text-[8px] font-semibold text-white`}>
                      {getInitials(team.leadName)}
                    </AvatarFallback>
                  </Avatar>
                  Trưởng nhóm: <span className="font-medium text-foreground">{team.leadName}</span>
                </span>
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
              <p className="text-[11px] font-medium text-muted-foreground">Hoàn thành</p>
              <p className="text-lg font-semibold">{team.performance.tasksCompleted}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Đang chờ</p>
              <p className="text-lg font-semibold">{team.performance.tasksPending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-500/10">
              <FileCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Hồ sơ duyệt</p>
              <p className="text-lg font-semibold">{team.performance.applicationsReviewed}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
              <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">Tỷ lệ hoàn thành</p>
              <p className="text-lg font-semibold">{completionRate}%</p>
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
              Thành viên ({team.members.length})
            </CardTitle>
            <Button size="sm" variant="outline">Thêm thành viên</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.members.map((member) => {
              const role = roleConfig[member.role]
              const memberTotal = member.stats.tasks_completed + member.stats.tasks_pending
              const memberPercent = memberTotal > 0 ? Math.round((member.stats.tasks_completed / memberTotal) * 100) : 0

              return (
                <Card key={member.id} className="border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 shadow-sm">
                        <AvatarFallback className={`bg-gradient-to-br ${member.avatarBg} text-[11px] font-semibold text-white`}>
                          {getInitials(member.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/nhan-su/${member.id}`}
                          className="text-[13px] font-medium hover:text-primary transition-colors truncate block"
                        >
                          {member.name}
                        </Link>
                        <p className="text-[11px] text-muted-foreground truncate">{member.position}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${member.is_active ? "text-emerald-600" : "text-gray-500"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${member.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {member.is_active ? "HĐ" : "Ngưng"}
                      </span>
                    </div>

                    <div className="mt-3">
                      <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${role.className}`}>
                        {role.label}
                      </Badge>
                    </div>

                    {/* Task stats */}
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                        <span>Công việc</span>
                        <span className="font-medium tabular-nums">{member.stats.tasks_completed}/{memberTotal}</span>
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
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
