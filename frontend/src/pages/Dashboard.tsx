import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Users,
  ClipboardCheck,
  UserPlus,
  ArrowRight,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ListTodo,
  Sparkles,
  Star,
  CalendarDays,
  Activity,
  Shield,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StatItem {
  title: string
  value: string
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: LucideIcon
  description: string
  iconBg: string
}

interface RecentTask {
  id: string
  title: string
  assignee: { name: string; initials: string; avatarBg: string }
  type: string
  priority: "Cao" | "Trung bình" | "Thấp"
  deadline: string
  status: "Hoàn thành" | "Đang xử lý" | "Quá hạn" | "Chờ duyệt" | "Mới giao"
}

interface ActivityItem {
  id: string
  actor: { name: string; initials: string; avatarBg: string }
  action: string
  target: string
  timeAgo: string
}

interface EmployeePerformance {
  name: string
  initials: string
  avatarBg: string
  role: string
  roleBadge: string
  tasksCompleted: number
  tasksTotal: number
  rating: number
}

interface ScheduleEvent {
  time: string
  title: string
  subtitle: string
  assignee: { name: string; initials: string; avatarBg: string }
  dotColor: string
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const stats: StatItem[] = [
  {
    title: "Tổng nhân viên",
    value: "32",
    change: "+3",
    changeType: "positive",
    icon: Users,
    description: "tháng này",
    iconBg: "from-blue-500 to-blue-600",
  },
  {
    title: "Công việc đang xử lý",
    value: "18",
    change: "5 quá hạn",
    changeType: "negative",
    icon: ClipboardCheck,
    description: "",
    iconBg: "from-amber-500 to-amber-600",
  },
  {
    title: "Tin tuyển dụng",
    value: "124",
    change: "+12%",
    changeType: "positive",
    icon: FileText,
    description: "so với tháng trước",
    iconBg: "from-violet-500 to-violet-600",
  },
  {
    title: "Ứng viên mới",
    value: "573",
    change: "+8%",
    changeType: "positive",
    icon: UserPlus,
    description: "so với tháng trước",
    iconBg: "from-emerald-500 to-emerald-600",
  },
]

const recentTasks: RecentTask[] = [
  {
    id: "1",
    title: "Duyệt hồ sơ ứng viên vị trí Kỹ sư phần mềm",
    assignee: { name: "Trần Thị Mai", initials: "TM", avatarBg: "from-pink-400 to-pink-600" },
    type: "Tuyển dụng",
    priority: "Cao",
    deadline: "07/04/2026",
    status: "Đang xử lý",
  },
  {
    id: "2",
    title: "Sắp xếp phỏng vấn vòng 2 - Nguyễn Văn Hùng",
    assignee: { name: "Lê Hoàng Nam", initials: "LN", avatarBg: "from-blue-400 to-blue-600" },
    type: "Phỏng vấn",
    priority: "Cao",
    deadline: "06/04/2026",
    status: "Quá hạn",
  },
  {
    id: "3",
    title: "Cập nhật JD vị trí Trưởng phòng Marketing",
    assignee: { name: "Phạm Thùy Dung", initials: "PD", avatarBg: "from-violet-400 to-violet-600" },
    type: "Nội bộ",
    priority: "Trung bình",
    deadline: "10/04/2026",
    status: "Mới giao",
  },
  {
    id: "4",
    title: "Kiểm tra hợp đồng lao động - 5 nhân viên mới",
    assignee: { name: "Nguyễn Minh Tuấn", initials: "NT", avatarBg: "from-emerald-400 to-emerald-600" },
    type: "Hợp đồng",
    priority: "Trung bình",
    deadline: "09/04/2026",
    status: "Chờ duyệt",
  },
  {
    id: "5",
    title: "Báo cáo tuyển dụng quý I/2026",
    assignee: { name: "Trần Văn Bình", initials: "TB", avatarBg: "from-amber-400 to-amber-600" },
    type: "Báo cáo",
    priority: "Thấp",
    deadline: "15/04/2026",
    status: "Hoàn thành",
  },
]

const activityFeed: ActivityItem[] = [
  {
    id: "1",
    actor: { name: "Trần Thị Mai", initials: "TM", avatarBg: "from-pink-400 to-pink-600" },
    action: "đã duyệt hồ sơ",
    target: "Nguyễn Thị Hồng Nhung",
    timeAgo: "5 phút trước",
  },
  {
    id: "2",
    actor: { name: "Lê Hoàng Nam", initials: "LN", avatarBg: "from-blue-400 to-blue-600" },
    action: "đã hoàn thành phỏng vấn",
    target: "Phạm Quốc Đạt",
    timeAgo: "23 phút trước",
  },
  {
    id: "3",
    actor: { name: "Nguyễn Minh Tuấn", initials: "NT", avatarBg: "from-emerald-400 to-emerald-600" },
    action: "đã giao việc cho",
    target: "Phạm Thùy Dung",
    timeAgo: "1 giờ trước",
  },
  {
    id: "4",
    actor: { name: "Phạm Thùy Dung", initials: "PD", avatarBg: "from-violet-400 to-violet-600" },
    action: "đã cập nhật trạng thái",
    target: "Tin tuyển dụng #1042",
    timeAgo: "2 giờ trước",
  },
  {
    id: "5",
    actor: { name: "Trần Văn Bình", initials: "TB", avatarBg: "from-amber-400 to-amber-600" },
    action: "đã từ chối hồ sơ",
    target: "Lê Văn Khánh",
    timeAgo: "3 giờ trước",
  },
  {
    id: "6",
    actor: { name: "Đỗ Thị Lan", initials: "ĐL", avatarBg: "from-rose-400 to-rose-600" },
    action: "đã tạo lịch phỏng vấn với",
    target: "Hoàng Minh Châu",
    timeAgo: "4 giờ trước",
  },
  {
    id: "7",
    actor: { name: "Lê Hoàng Nam", initials: "LN", avatarBg: "from-blue-400 to-blue-600" },
    action: "đã gửi thư mời nhận việc cho",
    target: "Vũ Thị Thanh",
    timeAgo: "5 giờ trước",
  },
  {
    id: "8",
    actor: { name: "Trần Thị Mai", initials: "TM", avatarBg: "from-pink-400 to-pink-600" },
    action: "đã hoàn thành báo cáo",
    target: "Tuyển dụng tháng 3",
    timeAgo: "hôm qua",
  },
]

const employeePerformance: EmployeePerformance[] = [
  {
    name: "Trần Thị Mai",
    initials: "TM",
    avatarBg: "from-pink-400 to-pink-600",
    role: "Chuyên viên tuyển dụng",
    roleBadge: "bg-pink-50 text-pink-700 border-pink-200/80 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20",
    tasksCompleted: 28,
    tasksTotal: 30,
    rating: 4.9,
  },
  {
    name: "Lê Hoàng Nam",
    initials: "LN",
    avatarBg: "from-blue-400 to-blue-600",
    role: "Trưởng nhóm HR",
    roleBadge: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    tasksCompleted: 25,
    tasksTotal: 30,
    rating: 4.7,
  },
  {
    name: "Phạm Thùy Dung",
    initials: "PD",
    avatarBg: "from-violet-400 to-violet-600",
    role: "Chuyên viên tuyển dụng",
    roleBadge: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    tasksCompleted: 22,
    tasksTotal: 30,
    rating: 4.5,
  },
  {
    name: "Nguyễn Minh Tuấn",
    initials: "NT",
    avatarBg: "from-emerald-400 to-emerald-600",
    role: "Chuyên viên hợp đồng",
    roleBadge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    tasksCompleted: 20,
    tasksTotal: 30,
    rating: 4.3,
  },
  {
    name: "Trần Văn Bình",
    initials: "TB",
    avatarBg: "from-amber-400 to-amber-600",
    role: "Nhân viên hành chính",
    roleBadge: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    tasksCompleted: 18,
    tasksTotal: 30,
    rating: 4.1,
  },
]

const todaySchedule: ScheduleEvent[] = [
  {
    time: "09:00",
    title: "Phỏng vấn vòng 1 - Trần Quốc Bảo",
    subtitle: "Kỹ sư phần mềm",
    assignee: { name: "Lê Hoàng Nam", initials: "LN", avatarBg: "from-blue-400 to-blue-600" },
    dotColor: "bg-blue-500",
  },
  {
    time: "10:30",
    title: "Họp đánh giá ứng viên tuần",
    subtitle: "Phòng họp A3 - 8 người",
    assignee: { name: "Trần Thị Mai", initials: "TM", avatarBg: "from-pink-400 to-pink-600" },
    dotColor: "bg-violet-500",
  },
  {
    time: "14:00",
    title: "Review hồ sơ vị trí Kế toán",
    subtitle: "12 hồ sơ mới",
    assignee: { name: "Phạm Thùy Dung", initials: "PD", avatarBg: "from-violet-400 to-violet-600" },
    dotColor: "bg-emerald-500",
  },
  {
    time: "15:30",
    title: "Phỏng vấn vòng 2 - Nguyễn Thị Hồng",
    subtitle: "Quản lý dự án",
    assignee: { name: "Nguyễn Minh Tuấn", initials: "NT", avatarBg: "from-emerald-400 to-emerald-600" },
    dotColor: "bg-amber-500",
  },
]

// ---------------------------------------------------------------------------
// Status / Priority config
// ---------------------------------------------------------------------------

const taskStatusConfig: Record<RecentTask["status"], string> = {
  "Hoàn thành": "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Đang xử lý": "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "Quá hạn": "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  "Chờ duyệt": "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "Mới giao": "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
}

const priorityConfig: Record<RecentTask["priority"], string> = {
  "Cao": "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  "Trung bình": "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "Thấp": "bg-gray-50 text-gray-600 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* ================================================================= */}
      {/* Hero Banner                                                       */}
      {/* ================================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Hệ thống quản lý nội bộ
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold">Xin chào, Nguyễn Văn A</h1>
              <Badge className="bg-white/20 text-white border-white/30 text-[11px]">
                <Shield className="mr-1 h-3 w-3" />
                Quản trị viên
              </Badge>
            </div>
            <p className="mt-1.5 text-sm text-white/70">
              Hôm nay có{" "}
              <span className="font-medium text-white">12 công việc</span> cần
              xử lý,{" "}
              <span className="font-medium text-white">3 phỏng vấn</span> và{" "}
              <span className="font-medium text-white">8 hồ sơ</span> chờ
              duyệt.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm"
            >
              <ListTodo className="mr-1.5 h-3.5 w-3.5" />
              Giao việc mới
            </Button>
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
            >
              <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" />
              Duyệt hồ sơ
            </Button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* Row 1: Overview Stats                                             */}
      {/* ================================================================= */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-[13px] font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <div>
                    <span className="text-[28px] font-semibold tracking-tight leading-none">
                      {stat.value}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {stat.changeType === "negative" ? (
                      <span className="flex items-center gap-0.5 rounded-md bg-red-50 px-1.5 py-0.5 text-[11px] font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
                        <ArrowDownRight className="h-3 w-3" />
                        {stat.change}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.change}
                      </span>
                    )}
                    {stat.description && (
                      <span className="text-[11px] text-muted-foreground">
                        {stat.description}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-sm`}
                >
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================================================================= */}
      {/* Row 2: Recent Tasks + Activity Feed                               */}
      {/* ================================================================= */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Recent Tasks - col-span-3 */}
        <Card className="border-border/50 shadow-sm lg:col-span-3">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold">
                  Công việc gần đây
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Các công việc được giao và cập nhật mới nhất
                </p>
              </div>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary"
                >
                  Xem tất cả
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Tiêu đề
                  </TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Người thực hiện
                  </TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Loại
                  </TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Ưu tiên
                  </TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Hạn chót
                  </TableHead>
                  <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    Trạng thái
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className="group cursor-pointer border-0 transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="py-3 pl-6 max-w-[220px]">
                      <span className="text-[13px] font-medium truncate block">
                        {task.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar size="sm">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${task.assignee.avatarBg} text-[9px] font-semibold text-white`}
                          >
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[12px] text-muted-foreground">
                          {task.assignee.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-[12px] text-muted-foreground">
                        {task.type}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={`rounded-md text-[11px] font-medium ${priorityConfig[task.priority]}`}
                      >
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-[12px] text-muted-foreground tabular-nums">
                        {task.deadline}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-right">
                      <Badge
                        variant="outline"
                        className={`rounded-md text-[11px] font-medium ${taskStatusConfig[task.status]}`}
                      >
                        {task.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Feed - col-span-2 */}
        <Card className="border-border/50 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  Hoạt động nhóm
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Cập nhật mới nhất từ các thành viên
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-[340px] px-4">
              <div className="relative space-y-0">
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-border" />

                {activityFeed.map((item) => (
                  <div
                    key={item.id}
                    className="group relative flex items-start gap-3 rounded-lg py-2.5 transition-colors"
                  >
                    <Avatar size="sm" className="relative z-10 ring-2 ring-card shrink-0">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${item.actor.avatarBg} text-[9px] font-semibold text-white`}
                      >
                        {item.actor.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 -mt-0.5">
                      <p className="text-[13px] leading-snug">
                        <span className="font-medium">{item.actor.name}</span>{" "}
                        <span className="text-muted-foreground">
                          {item.action}
                        </span>{" "}
                        <span className="font-medium">{item.target}</span>
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {item.timeAgo}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ================================================================= */}
      {/* Row 3: Performance + Schedule                                     */}
      {/* ================================================================= */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Employee Performance - col-span-3 */}
        <Card className="border-border/50 shadow-sm lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold">
                  Hiệu suất nhân viên
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Nhân viên xuất sắc tháng này
                </p>
              </div>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary"
                >
                  Xem chi tiết
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeePerformance.map((emp, index) => (
                <div
                  key={emp.name}
                  className="flex items-center gap-4"
                >
                  {/* Rank */}
                  <span className="w-5 text-center text-[13px] font-semibold text-muted-foreground tabular-nums">
                    {index + 1}
                  </span>

                  {/* Avatar */}
                  <Avatar>
                    <AvatarFallback
                      className={`bg-gradient-to-br ${emp.avatarBg} text-[10px] font-semibold text-white`}
                    >
                      {emp.initials}
                    </AvatarFallback>
                  </Avatar>

                  {/* Name + Role */}
                  <div className="min-w-0 flex-shrink-0 w-[180px]">
                    <p className="text-[13px] font-medium truncate">
                      {emp.name}
                    </p>
                    <Badge
                      variant="outline"
                      className={`mt-0.5 rounded-md text-[10px] font-medium ${emp.roleBadge}`}
                    >
                      {emp.role}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-muted-foreground">
                        {emp.tasksCompleted}/{emp.tasksTotal} công việc
                      </span>
                      <span className="text-[11px] font-medium">
                        {Math.round(
                          (emp.tasksCompleted / emp.tasksTotal) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                        style={{
                          width: `${(emp.tasksCompleted / emp.tasksTotal) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-[13px] font-semibold tabular-nums">
                      {emp.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today Schedule - col-span-2 */}
        <Card className="border-border/50 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  Lịch hôm nay
                </CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {todaySchedule.length} hoạt động sắp tới
                </p>
              </div>
              <CardAction>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary"
                >
                  Xem lịch
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              <div className="absolute left-[52px] top-4 bottom-4 w-px bg-border" />

              {todaySchedule.map((event, i) => (
                <div
                  key={i}
                  className="group relative flex items-start gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="w-9 shrink-0 pt-0.5 text-right text-xs font-semibold tabular-nums text-foreground">
                    {event.time}
                  </span>
                  <div className="relative z-10 mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${event.dotColor} ring-2 ring-card`}
                    />
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <p className="text-[13px] font-medium leading-snug">
                      {event.title}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.subtitle}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <Avatar size="sm">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${event.assignee.avatarBg} text-[8px] font-semibold text-white`}
                        >
                          {event.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[11px] text-muted-foreground">
                        {event.assignee.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
