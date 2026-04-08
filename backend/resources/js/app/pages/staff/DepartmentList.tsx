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
import {
  Building,
  Users,
  UserCog,
  Sparkles,
  ArrowRight,
  Plus,
  BriefcaseBusiness,
  Home,
  Wrench,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// --- Types ---

interface DepartmentData {
  id: string
  name: string
  description: string
  headName: string
  headInitials: string
  headAvatarBg: string
  headPosition: string
  memberCount: number
  activeCount: number
  icon: LucideIcon
  iconBg: string
  teams: TeamSummary[]
  stats: {
    tasksCompleted: number
    interviewsDone: number
    applicationsReviewed: number
  }
}

interface TeamSummary {
  id: string
  departmentId: string
  name: string
  leadName: string
  memberCount: number
  status: "active" | "inactive"
}

// --- Mock data ---

const departments: DepartmentData[] = [
  {
    id: "d2",
    name: "Phòng Tuyển dụng",
    description: "Phụ trách toàn bộ quy trình tuyển dụng nhân viên, từ đăng tin đến ký hợp đồng. Quản lý nguồn ứng viên và đối tác tuyển dụng.",
    headName: "Lê Văn Đức",
    headInitials: "LĐ",
    headAvatarBg: "from-emerald-400 to-emerald-600",
    headPosition: "Trưởng phòng",
    memberCount: 12,
    activeCount: 11,
    icon: BriefcaseBusiness,
    iconBg: "from-emerald-500 to-emerald-600",
    teams: [
      { id: "t3", departmentId: "d2", name: "Nhóm Tuyển dụng CNTT", leadName: "Lê Văn Đức", memberCount: 5, status: "active" },
      { id: "t4", departmentId: "d2", name: "Nhóm Tuyển dụng Sản xuất", leadName: "Hoàng Minh Tuấn", memberCount: 4, status: "active" },
      { id: "t7", departmentId: "d2", name: "Nhóm Tuyển dụng Dịch vụ", leadName: "Nguyễn Thị Hương", memberCount: 3, status: "active" },
    ],
    stats: {
      tasksCompleted: 132,
      interviewsDone: 92,
      applicationsReviewed: 468,
    },
  },
  {
    id: "d3",
    name: "Phòng Quản lý trọ",
    description: "Quản lý hệ thống nhà trọ liên kết, điều phối chỗ ở cho nhân viên và theo dõi hợp đồng thuê trọ.",
    headName: "Đặng Quốc Bảo",
    headInitials: "ĐB",
    headAvatarBg: "from-violet-400 to-violet-600",
    headPosition: "Trưởng phòng",
    memberCount: 6,
    activeCount: 6,
    icon: Home,
    iconBg: "from-violet-500 to-violet-600",
    teams: [
      { id: "t5", departmentId: "d3", name: "Nhóm Quản lý trọ Bắc", leadName: "Đặng Quốc Bảo", memberCount: 3, status: "active" },
      { id: "t6", departmentId: "d3", name: "Nhóm Quản lý trọ Nam", leadName: "Vũ Thị Lan", memberCount: 3, status: "active" },
    ],
    stats: {
      tasksCompleted: 59,
      interviewsDone: 5,
      applicationsReviewed: 12,
    },
  },
  {
    id: "d1",
    name: "Phòng Vận hành",
    description: "Quản trị hệ thống, vận hành hạ tầng CNTT, hỗ trợ kỹ thuật và quản lý quy trình nội bộ.",
    headName: "Nguyễn Văn Hùng",
    headInitials: "NH",
    headAvatarBg: "from-blue-400 to-blue-600",
    headPosition: "Giám đốc điều hành",
    memberCount: 8,
    activeCount: 7,
    icon: Wrench,
    iconBg: "from-blue-500 to-blue-600",
    teams: [
      { id: "t1", departmentId: "d1", name: "Ban Giám đốc", leadName: "Nguyễn Văn Hùng", memberCount: 3, status: "active" },
      { id: "t2", departmentId: "d1", name: "Nhóm Quản trị", leadName: "Trần Thị Mai", memberCount: 4, status: "active" },
    ],
    stats: {
      tasksCompleted: 72,
      interviewsDone: 12,
      applicationsReviewed: 89,
    },
  },
]

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export function DepartmentList() {
  const totalMembers = departments.reduce((sum, d) => sum + d.memberCount, 0)
  const totalTeams = departments.reduce((sum, d) => sum + d.teams.length, 0)

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
      <div className="space-y-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="border-border/50 shadow-sm overflow-hidden">
            {/* Department header */}
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dept.iconBg} shadow-sm`}>
                    <dept.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold">{dept.name}</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground max-w-lg">{dept.description}</p>
                    {/* Head info */}
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar className="h-7 w-7 shadow-sm">
                        <AvatarFallback className={`bg-gradient-to-br ${dept.headAvatarBg} text-[9px] font-semibold text-white`}>
                          {dept.headInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[12px] font-medium leading-tight">{dept.headName}</p>
                        <p className="text-[10px] text-muted-foreground">{dept.headPosition}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:pt-1">
                  <div className="text-center">
                    <p className="text-lg font-semibold">{dept.memberCount}</p>
                    <p className="text-[10px] text-muted-foreground">Nhân viên</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-semibold">{dept.activeCount}</p>
                    <p className="text-[10px] text-muted-foreground">Hoạt động</p>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div className="text-center">
                    <p className="text-lg font-semibold">{dept.teams.length}</p>
                    <p className="text-[10px] text-muted-foreground">Nhóm</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Quick stats */}
            <div className="mx-6 mb-4 grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-500/5 p-3 text-center">
                <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-400">{dept.stats.tasksCompleted}</p>
                <p className="text-[10px] text-muted-foreground">Công việc hoàn thành</p>
              </div>
              <div className="rounded-lg bg-violet-50/50 dark:bg-violet-500/5 p-3 text-center">
                <p className="text-lg font-semibold text-violet-700 dark:text-violet-400">{dept.stats.interviewsDone}</p>
                <p className="text-[10px] text-muted-foreground">Phỏng vấn</p>
              </div>
              <div className="rounded-lg bg-blue-50/50 dark:bg-blue-500/5 p-3 text-center">
                <p className="text-lg font-semibold text-blue-700 dark:text-blue-400">{dept.stats.applicationsReviewed}</p>
                <p className="text-[10px] text-muted-foreground">Hồ sơ duyệt</p>
              </div>
            </div>

            {/* Teams list */}
            <CardContent className="pt-0">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Danh sách nhóm
              </p>
              <div className="space-y-2">
                {dept.teams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/phong-ban/${team.departmentId}/nhom/${team.id}`}
                    className="group flex items-center justify-between rounded-lg border border-border/50 p-3 transition-all hover:bg-muted/40 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/50">
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium group-hover:text-primary transition-colors">{team.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          Trưởng nhóm: {team.leadName} &middot; {team.memberCount} thành viên
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
                        {team.status === "active" ? "Hoạt động" : "Ngưng"}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
