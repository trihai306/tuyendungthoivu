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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Mail,
  Phone,
  PhoneForwarded,
  CalendarDays,
  Briefcase,
  CheckCircle2,
  Clock,
  Users,
  FileCheck,
  BarChart3,
  Activity,
  ClipboardList,
} from "lucide-react"
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

// --- Mock data ---

const mockStaffDetails: Record<string, Staff & { tasks: TaskItem[]; activities: ActivityItem[] }> = {
  "1": {
    id: "1",
    name: "Nguyễn Văn Hùng",
    email: "hung.nv@company.vn",
    phone: "0901234567",
    phone_ext: "101",
    employee_code: "NV-001",
    role: "super_admin",
    department: { id: "d1", name: "Phòng Vận hành", description: "Quản lý vận hành hệ thống", member_count: 8, status: "active" },
    team: { id: "t1", department_id: "d1", name: "Ban Giám đốc", description: "", members: [], member_count: 3, status: "active" },
    position: "Giám đốc điều hành",
    is_active: true,
    hire_date: "2020-03-15",
    stats: { tasks_completed: 45, tasks_pending: 2, interviews_done: 12, applications_reviewed: 89 },
    tasks: [
      { id: "tk1", title: "Duyệt kế hoạch tuyển dụng Q2/2026", status: "completed", due_date: "2026-04-05", priority: "high" },
      { id: "tk2", title: "Review báo cáo hiệu suất phòng Tuyển dụng", status: "in_progress", due_date: "2026-04-10", priority: "medium" },
      { id: "tk3", title: "Họp với đối tác ABC về hợp tác tuyển dụng", status: "pending", due_date: "2026-04-12", priority: "high" },
      { id: "tk4", title: "Cập nhật chính sách nhân sự mới", status: "pending", due_date: "2026-04-15", priority: "low" },
    ],
    activities: [
      { id: "a1", action: "Duyệt hồ sơ ứng viên Trần Văn B", timestamp: "2 giờ trước", type: "review" },
      { id: "a2", action: "Cập nhật thông tin phòng ban", timestamp: "5 giờ trước", type: "update" },
      { id: "a3", action: "Phỏng vấn ứng viên Nguyễn Thị C", timestamp: "1 ngày trước", type: "interview" },
      { id: "a4", action: "Giao công việc cho Trần Thị Mai", timestamp: "1 ngày trước", type: "assign" },
      { id: "a5", action: "Tạo tin tuyển dụng mới: Senior Dev", timestamp: "2 ngày trước", type: "create" },
      { id: "a6", action: "Đăng nhập hệ thống", timestamp: "2 ngày trước", type: "login" },
    ],
  },
  "3": {
    id: "3",
    name: "Lê Văn Đức",
    email: "duc.lv@company.vn",
    phone: "0923456789",
    phone_ext: "201",
    employee_code: "NV-003",
    role: "manager",
    department: { id: "d2", name: "Phòng Tuyển dụng", description: "Phụ trách tuyển dụng nhân sự", member_count: 12, status: "active" },
    team: { id: "t3", department_id: "d2", name: "Nhóm Tuyển dụng CNTT", description: "", members: [], member_count: 5, status: "active" },
    position: "Trưởng phòng tuyển dụng",
    is_active: true,
    hire_date: "2020-09-10",
    stats: { tasks_completed: 52, tasks_pending: 8, interviews_done: 35, applications_reviewed: 156 },
    tasks: [
      { id: "tk1", title: "Review CV ứng viên vị trí Frontend Dev", status: "in_progress", due_date: "2026-04-08", priority: "high" },
      { id: "tk2", title: "Lên lịch phỏng vấn tuần tới", status: "pending", due_date: "2026-04-09", priority: "medium" },
      { id: "tk3", title: "Báo cáo tuyển dụng tháng 3", status: "completed", due_date: "2026-04-01", priority: "high" },
    ],
    activities: [
      { id: "a1", action: "Duyệt 5 hồ sơ ứng viên CNTT", timestamp: "1 giờ trước", type: "review" },
      { id: "a2", action: "Phỏng vấn ứng viên Phạm Văn D", timestamp: "3 giờ trước", type: "interview" },
      { id: "a3", action: "Cập nhật JD vị trí Backend Dev", timestamp: "1 ngày trước", type: "update" },
    ],
  },
  "4": {
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
    tasks: [
      { id: "tk1", title: "Liên hệ 10 ứng viên tiềm năng", status: "in_progress", due_date: "2026-04-08", priority: "high" },
      { id: "tk2", title: "Cập nhật trạng thái hồ sơ trên hệ thống", status: "pending", due_date: "2026-04-09", priority: "medium" },
    ],
    activities: [
      { id: "a1", action: "Gửi email mời phỏng vấn 3 ứng viên", timestamp: "30 phút trước", type: "create" },
      { id: "a2", action: "Review hồ sơ Lê Thị E", timestamp: "2 giờ trước", type: "review" },
    ],
  },
}

interface TaskItem {
  id: string
  title: string
  status: "completed" | "in_progress" | "pending"
  due_date: string
  priority: "high" | "medium" | "low"
}

interface ActivityItem {
  id: string
  action: string
  timestamp: string
  type: "review" | "update" | "interview" | "assign" | "create" | "login"
}

const taskStatusConfig: Record<TaskItem["status"], { label: string; className: string }> = {
  completed: {
    label: "Hoàn thành",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  in_progress: {
    label: "Đang thực hiện",
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  pending: {
    label: "Chờ xử lý",
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
}

const priorityConfig: Record<TaskItem["priority"], { label: string; dotColor: string }> = {
  high: { label: "Cao", dotColor: "bg-red-500" },
  medium: { label: "Trung bình", dotColor: "bg-amber-500" },
  low: { label: "Thấp", dotColor: "bg-blue-500" },
}

const activityTypeConfig: Record<ActivityItem["type"], { dotColor: string }> = {
  review: { dotColor: "bg-blue-500" },
  update: { dotColor: "bg-amber-500" },
  interview: { dotColor: "bg-violet-500" },
  assign: { dotColor: "bg-emerald-500" },
  create: { dotColor: "bg-pink-500" },
  login: { dotColor: "bg-gray-400" },
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const avatarColors: Record<string, string> = {
  "1": "from-blue-400 to-blue-600",
  "3": "from-emerald-400 to-emerald-600",
  "4": "from-amber-400 to-amber-600",
}

export function StaffDetail() {
  const { id } = useParams<{ id: string }>()
  const staffData = mockStaffDetails[id ?? "1"] ?? mockStaffDetails["1"]
  const role = roleConfig[staffData.role]
  const avatarBg = avatarColors[staffData.id] ?? "from-blue-400 to-blue-600"

  const totalTasks = (staffData.stats?.tasks_completed ?? 0) + (staffData.stats?.tasks_pending ?? 0)
  const completedTasks = staffData.stats?.tasks_completed ?? 0

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        render={<Link to="/staff" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Danh sách nhân sự
      </Button>

      {/* Hero Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative h-28 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40">
          <div className="absolute -bottom-2 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <Avatar className="h-20 w-20 shadow-lg ring-4 ring-card">
              <AvatarFallback className={`bg-gradient-to-br ${avatarBg} text-xl font-semibold text-white`}>
                {getInitials(staffData.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight">{staffData.name}</h1>
                <Badge variant="outline" className={`rounded-md text-[11px] font-medium ${role.className}`}>
                  {role.label}
                </Badge>
                <span className={`inline-flex items-center gap-1 text-[12px] font-medium ${staffData.is_active ? "text-emerald-600" : "text-gray-500"}`}>
                  <span className={`h-2 w-2 rounded-full ${staffData.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                  {staffData.is_active ? "Hoạt động" : "Ngưng"}
                </span>
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {staffData.department && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {staffData.department.name}
                  </span>
                )}
                {staffData.team && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {staffData.team.name}
                  </span>
                )}
                <span className="text-[12px] text-muted-foreground/70">{staffData.employee_code}</span>
              </div>
            </div>
            <div className="flex gap-2 sm:pb-1">
              <Button variant="outline" size="sm">Sửa thông tin</Button>
              <Button size="sm">Giao việc</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động</TabsTrigger>
        </TabsList>

        {/* Tab: Tong quan */}
        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left: Info */}
            <div className="space-y-4 lg:col-span-2">
              {/* Info grid */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Thông tin cá nhân
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem icon={<Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />} label="Email" value={staffData.email} />
                    <InfoItem icon={<Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />} label="Số điện thoại" value={staffData.phone} />
                    {staffData.phone_ext && (
                      <InfoItem icon={<PhoneForwarded className="h-4 w-4 text-violet-600 dark:text-violet-400" />} label="Số nội bộ (Ext)" value={staffData.phone_ext} />
                    )}
                    <InfoItem icon={<CalendarDays className="h-4 w-4 text-amber-600 dark:text-amber-400" />} label="Ngày vào làm" value={formatDate(staffData.hire_date)} />
                    <InfoItem icon={<Briefcase className="h-4 w-4 text-pink-600 dark:text-pink-400" />} label="Chức vụ" value={staffData.position} />
                    {staffData.department && (
                      <InfoItem icon={<Users className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />} label="Phòng ban" value={staffData.department.name} />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Performance chart placeholder */}
              <Card className="border-border/50 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Biểu đồ hiệu suất
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30">
                    <div className="text-center">
                      <BarChart3 className="mx-auto h-8 w-8 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">Biểu đồ hiệu suất sẽ hiển thị tại đây</p>
                      <p className="text-xs text-muted-foreground/70">Tích hợp sau khi có dữ liệu thực tế</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: KPI cards */}
            <div className="space-y-4">
              <KPICard
                icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
                iconBg="bg-emerald-50 dark:bg-emerald-500/10"
                title="Công việc hoàn thành"
                value={String(completedTasks)}
                subtitle={`trên tổng ${totalTasks} công việc`}
              />
              <KPICard
                icon={<Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />}
                iconBg="bg-violet-50 dark:bg-violet-500/10"
                title="Phỏng vấn đã thực hiện"
                value={String(staffData.stats?.interviews_done ?? 0)}
                subtitle="lượt phỏng vấn"
              />
              <KPICard
                icon={<FileCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                iconBg="bg-blue-50 dark:bg-blue-500/10"
                title="Hồ sơ đã duyệt"
                value={String(staffData.stats?.applications_reviewed ?? 0)}
                subtitle="hồ sơ ứng viên"
              />
              <KPICard
                icon={<BarChart3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />}
                iconBg="bg-amber-50 dark:bg-amber-500/10"
                title="Đánh giá hiệu suất"
                value={totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : "N/A"}
                subtitle="tỷ lệ hoàn thành"
              />
            </div>
          </div>
        </TabsContent>

        {/* Tab: Cong viec */}
        <TabsContent value="tasks">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Danh sách công việc
                </CardTitle>
                <Button size="sm">Giao việc mới</Button>
              </div>
            </CardHeader>
            <CardContent>
              {staffData.tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Chưa có công việc nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {staffData.tasks.map((task) => {
                    const status = taskStatusConfig[task.status]
                    const priority = priorityConfig[task.priority]
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 rounded-lg border border-border/50 p-3 transition-colors hover:bg-muted/30"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 shrink-0 rounded-full ${priority.dotColor}`} />
                            <p className="text-[13px] font-medium truncate">{task.title}</p>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(task.due_date)}
                            </span>
                            <span>Ưu tiên: {priority.label}</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={`shrink-0 rounded-md text-[11px] font-medium ${status.className}`}>
                          {status.label}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Hoat dong */}
        <TabsContent value="activity">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Activity className="h-4 w-4 text-primary" />
                Lịch sử hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              {staffData.activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Chưa có hoạt động nào</p>
                </div>
              ) : (
                <div className="relative space-y-0">
                  <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />

                  {staffData.activities.map((activity) => {
                    const typeConfig = activityTypeConfig[activity.type]
                    return (
                      <div
                        key={activity.id}
                        className="group relative flex items-start gap-4 rounded-lg px-0 py-3 transition-colors hover:bg-muted/30"
                      >
                        <div className="relative z-10 mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                          <span className={`h-2.5 w-2.5 rounded-full ${typeConfig.dotColor} ring-2 ring-card`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium leading-snug">{activity.action}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {activity.timestamp}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// --- Helper components ---

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function KPICard({
  icon,
  iconBg,
  title,
  value,
  subtitle,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  value: string
  subtitle: string
}) {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            {icon}
          </div>
          <div>
            <p className="text-[11px] font-medium text-muted-foreground">{title}</p>
            <p className="text-lg font-semibold tracking-tight">{value}</p>
            <p className="text-[11px] text-muted-foreground/70">{subtitle}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}
