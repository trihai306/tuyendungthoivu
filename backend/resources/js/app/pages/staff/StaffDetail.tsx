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
  AlertCircle,
} from "lucide-react"
import type { StaffRole } from "@/types/staff"
import { useStaffDetail } from "@/hooks/use-staff"

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

const avatarColors = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
]

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

function getAvatarBg(id: string): string {
  const num = parseInt(id, 10) || 0
  return avatarColors[num % avatarColors.length]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function StaffDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: staffData, isLoading, isError } = useStaffDetail(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-64 w-full lg:col-span-2 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !staffData) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
          render={<Link to="/staff" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Danh sách nhân sự
        </Button>
        <Card className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <AlertCircle className="h-10 w-10 text-red-500" />
            <h3 className="mt-4 text-sm font-medium">Không tìm thấy nhân viên</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Nhân viên với ID "{id}" không tồn tại hoặc bạn không có quyền truy cập.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const role = roleConfig[staffData.role] ?? roleConfig.viewer
  const avatarBg = getAvatarBg(staffData.id)
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

        {/* Tab: Tổng quan */}
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

        {/* Tab: Công việc */}
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
              <div className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">Chưa có dữ liệu công việc từ API</p>
                <p className="text-xs text-muted-foreground/70">Tích hợp API task assignments sau</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Hoạt động */}
        <TabsContent value="activity">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Activity className="h-4 w-4 text-primary" />
                Lịch sử hoạt động
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Activity className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">Chưa có dữ liệu hoạt động từ API</p>
                <p className="text-xs text-muted-foreground/70">Tich hop API activity logs sau</p>
              </div>
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
