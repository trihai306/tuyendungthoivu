import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import {
  FileText,
  Users,
  Building2,
  TrendingUp,
  ArrowRight,
  Clock,
  ArrowUpRight,
  Plus,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface StatItem {
  title: string
  value: string
  change: string
  icon: LucideIcon
  description: string
  accent: string
  iconBg: string
}

const stats: StatItem[] = [
  {
    title: "Tin tuyển dụng",
    value: "124",
    change: "+12%",
    icon: FileText,
    description: "so với tháng trước",
    accent: "text-blue-600 dark:text-blue-400",
    iconBg: "from-blue-500 to-blue-600",
  },
  {
    title: "Ứng viên mới",
    value: "573",
    change: "+8%",
    icon: Users,
    description: "so với tháng trước",
    accent: "text-emerald-600 dark:text-emerald-400",
    iconBg: "from-emerald-500 to-emerald-600",
  },
  {
    title: "Doanh nghiệp",
    value: "48",
    change: "+3",
    icon: Building2,
    description: "đối tác mới",
    accent: "text-violet-600 dark:text-violet-400",
    iconBg: "from-violet-500 to-violet-600",
  },
  {
    title: "Tỷ lệ tuyển",
    value: "68%",
    change: "+5%",
    icon: TrendingUp,
    description: "so với tháng trước",
    accent: "text-amber-600 dark:text-amber-400",
    iconBg: "from-amber-500 to-amber-600",
  },
]

const recentApplicants = [
  { name: "Trần Văn B", initials: "TB", position: "Kỹ sư phần mềm", status: "Mới" as const, date: "2 giờ trước", avatarBg: "from-blue-400 to-blue-600" },
  { name: "Nguyễn Thị C", initials: "NC", position: "Nhân viên kế toán", status: "Phỏng vấn" as const, date: "5 giờ trước", avatarBg: "from-violet-400 to-violet-600" },
  { name: "Lê Văn D", initials: "LD", position: "Quản lý kho", status: "Mới" as const, date: "1 ngày trước", avatarBg: "from-emerald-400 to-emerald-600" },
  { name: "Phạm Thị E", initials: "PE", position: "Nhân viên bán hàng", status: "Đã duyệt" as const, date: "1 ngày trước", avatarBg: "from-amber-400 to-amber-600" },
  { name: "Hoàng Văn F", initials: "HF", position: "Lái xe", status: "Từ chối" as const, date: "2 ngày trước", avatarBg: "from-rose-400 to-rose-600" },
]

const upcomingEvents = [
  { time: "09:00", title: "Phỏng vấn - Trần Văn B", subtitle: "Kỹ sư phần mềm", dotColor: "bg-blue-500" },
  { time: "10:30", title: "Họp đối tác - Cty ABC", subtitle: "Hợp tác tuyển dụng", dotColor: "bg-violet-500" },
  { time: "14:00", title: "Review hồ sơ", subtitle: "15 hồ sơ mới", dotColor: "bg-emerald-500" },
  { time: "16:00", title: "Phỏng vấn - Nguyễn Thị C", subtitle: "Kế toán", dotColor: "bg-amber-500" },
]

const statusConfig = {
  "Mới": { className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" },
  "Phỏng vấn": { className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" },
  "Đã duyệt": { className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" },
  "Từ chối": { className: "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" },
} as const

export function Dashboard() {
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
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Tổng quan</span>
            </div>
            <h1 className="text-xl font-semibold">Xin chào, Nguyễn Văn A</h1>
            <p className="mt-1 text-sm text-white/70">
              Bạn có <span className="font-medium text-white">3 phỏng vấn</span> và <span className="font-medium text-white">15 hồ sơ</span> cần xử lý hôm nay.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button size="sm" variant="secondary" className="bg-white/15 text-white border-white/20 hover:bg-white/25 backdrop-blur-sm">
              Xem lịch
            </Button>
            <Button size="sm" className="bg-white text-primary hover:bg-white/90 shadow-sm">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Đăng tin mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-[13px] font-medium text-muted-foreground">{stat.title}</p>
                  <div>
                    <span className="text-[28px] font-semibold tracking-tight leading-none">{stat.value}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />
                      {stat.change}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{stat.description}</span>
                  </div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.iconBg} shadow-sm`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Recent applicants */}
        <Card className="border-border/50 shadow-sm lg:col-span-3">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold">Ứng viên gần đây</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">5 hồ sơ ứng tuyển mới nhất</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary">
                Xem tất cả
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Ứng viên</TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Vị trí</TableHead>
                  <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Trạng thái</TableHead>
                  <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplicants.map((a) => {
                  const config = statusConfig[a.status]
                  return (
                    <TableRow key={a.name} className="group cursor-pointer border-0 transition-colors hover:bg-muted/40">
                      <TableCell className="py-3 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 shadow-sm">
                            <AvatarFallback className={`bg-gradient-to-br ${a.avatarBg} text-[10px] font-semibold text-white`}>
                              {a.initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[13px] font-medium">{a.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3 text-[13px] text-muted-foreground">{a.position}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={`rounded-md text-[11px] font-medium ${config.className}`}>
                          {a.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 pr-6 text-right text-xs text-muted-foreground">
                        {a.date}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="border-border/50 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold">Lịch hôm nay</CardTitle>
                <p className="mt-0.5 text-xs text-muted-foreground">4 hoạt động sắp tới</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-xs font-medium text-primary hover:text-primary">
                Xem lịch
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative space-y-0">
              <div className="absolute left-[52px] top-4 bottom-4 w-px bg-border" />

              {upcomingEvents.map((event, i) => (
                <div
                  key={i}
                  className="group relative flex items-start gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted/40"
                >
                  <span className="w-9 shrink-0 pt-0.5 text-right text-xs font-semibold tabular-nums text-foreground">
                    {event.time}
                  </span>
                  <div className="relative z-10 mt-1.5 flex h-2.5 w-2.5 shrink-0 items-center justify-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${event.dotColor} ring-2 ring-card`} />
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <p className="text-[13px] font-medium leading-snug">{event.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {event.subtitle}
                    </p>
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
