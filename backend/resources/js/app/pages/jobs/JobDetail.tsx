import { useParams, Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  CalendarDays,
  Building2,
  Briefcase,
  Send,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { useJob } from "@/hooks/use-jobs"
import type { JobType } from "@/types"

// ─── Constants ───────────────────────────────────────────────────────────────

const JOB_TYPE_CONFIG: Record<
  JobType,
  { label: string; className: string }
> = {
  full_time: {
    label: "Toàn thời gian",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  part_time: {
    label: "Bán thời gian",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  contract: {
    label: "Hợp đồng",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  temporary: {
    label: "Thời vụ",
    className:
      "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  },
}

const GRADIENTS = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
]

function getGradientFromId(id: string): string {
  // Derive a deterministic index from the id
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0
  }
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSalary(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu`
  }
  return new Intl.NumberFormat("vi-VN").format(amount)
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Chưa xác định"
  return new Intl.DateTimeFormat("vi-VN").format(new Date(dateStr))
}

/** Split text into bullet points by newlines */
function textToItems(text: string | null): string[] {
  if (!text) return []
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContentSection({
  title,
  items,
  icon: Icon,
}: {
  title: string
  items: string[]
  icon: React.ComponentType<{ className?: string }>
}) {
  if (items.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      </div>
      <ul className="space-y-2 pl-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-relaxed">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  )
}

// ─── Loading skeleton ───────────────────────────────────────────────────────

function JobDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-64" />
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-14 w-14 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-4 w-40 mt-4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Not Found ───────────────────────────────────────────────────────────────

function JobNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Briefcase className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-[15px] font-semibold">Không tìm thấy tin tuyển dụng</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Tin tuyển dụng này không tồn tại hoặc đã bị xóa.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        render={<Link to="/jobs" />}
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Quay lại danh sách
      </Button>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="mt-4 text-[15px] font-semibold">Có lỗi xảy ra</h2>
      <p className="mt-1 text-[13px] text-muted-foreground text-center max-w-sm">
        {message}
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        render={<Link to="/jobs" />}
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Quay lại danh sách
      </Button>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: job, isLoading, isError, error } = useJob(id)

  if (isLoading) {
    return <JobDetailSkeleton />
  }

  if (isError) {
    const status = error?.status
    if (status === 404) return <JobNotFound />
    return <ErrorState message={error?.message ?? "Không thể tải tin tuyển dụng."} />
  }

  if (!job) {
    return <JobNotFound />
  }

  const typeConfig = JOB_TYPE_CONFIG[job.job_type] ?? JOB_TYPE_CONFIG.full_time
  const companyName = job.employer?.employer_profile?.company_name ?? job.employer?.name ?? "Doanh nghiệp"
  const companyIndustry = job.employer?.employer_profile?.industry ?? ""
  const companySize = job.employer?.employer_profile?.company_size ?? ""
  const companyAddress = job.employer?.employer_profile?.address ?? job.location ?? ""
  const gradient = getGradientFromId(job.id)
  const initials = getInitials(companyName)

  const descriptionItems = textToItems(job.description)
  const requirementItems = textToItems(job.requirements)
  const benefitItems = textToItems(job.benefits)

  const salaryLabel = job.salary_type === "hourly" ? "giờ" : job.salary_type === "daily" ? "ngày" : "tháng"

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/jobs" />}>
              Tin tuyển dụng
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{job.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 h-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <CardContent className="relative p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 rounded-xl shadow-sm">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${gradient} rounded-xl text-sm font-semibold text-white`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {job.title}
                  </h1>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {companyName}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-md text-[11px] font-medium ${typeConfig.className}`}
                    >
                      {typeConfig.label}
                    </Badge>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {job.city ?? job.location ?? "Chưa xác định"}
                    </span>
                    {(job.salary_min != null || job.salary_max != null) && (
                      <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        {job.salary_min != null && job.salary_max != null
                          ? `${formatSalary(job.salary_min)} - ${formatSalary(job.salary_max)} VNĐ/${salaryLabel}`
                          : job.salary_min != null
                            ? `Từ ${formatSalary(job.salary_min)} VNĐ/${salaryLabel}`
                            : `Đến ${formatSalary(job.salary_max!)} VNĐ/${salaryLabel}`}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      Đăng ngày {formatDate(job.created_at)}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="shrink-0 sm:self-start"
                render={<Link to={`/jobs/${job.id}/apply`} />}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Ứng tuyển ngay
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-6">
              {descriptionItems.length > 0 && (
                <ContentSection
                  title="Mô tả công việc"
                  items={descriptionItems}
                  icon={Briefcase}
                />
              )}
              {descriptionItems.length > 0 && requirementItems.length > 0 && <Separator />}
              {requirementItems.length > 0 && (
                <ContentSection
                  title="Yêu cầu ứng viên"
                  items={requirementItems}
                  icon={Users}
                />
              )}
              {(descriptionItems.length > 0 || requirementItems.length > 0) && benefitItems.length > 0 && <Separator />}
              {benefitItems.length > 0 && (
                <ContentSection
                  title="Quyền lợi"
                  items={benefitItems}
                  icon={CheckCircle2}
                />
              )}
              {descriptionItems.length === 0 && requirementItems.length === 0 && benefitItems.length === 0 && (
                <p className="text-[13px] text-muted-foreground">Chưa có thông tin chi tiết.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Company Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">
                Thông tin công ty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${gradient} rounded-xl text-[10px] font-semibold text-white`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">
                    {companyName}
                  </p>
                  {companyIndustry && (
                    <p className="text-[11px] text-muted-foreground">
                      {companyIndustry}
                    </p>
                  )}
                </div>
              </div>
              <Separator />
              <div className="space-y-0">
                {companySize && (
                  <MetaItem
                    icon={Building2}
                    label="Quy mô"
                    value={companySize}
                  />
                )}
                {companyAddress && (
                  <MetaItem
                    icon={MapPin}
                    label="Địa chỉ"
                    value={companyAddress}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Apply Button */}
          <Button
            className="w-full"
            size="lg"
            render={<Link to={`/jobs/${job.id}/apply`} />}
          >
            <Send className="mr-1.5 h-4 w-4" />
            Ứng tuyển ngay
          </Button>

          {/* Job Meta */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">
                Thông tin tuyển dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y divide-border">
                <MetaItem
                  icon={Users}
                  label="Số lượng tuyển"
                  value={`${job.positions_count} người`}
                />
                {job.end_date && (
                  <MetaItem
                    icon={CalendarDays}
                    label="Hạn nộp hồ sơ"
                    value={formatDate(job.end_date)}
                  />
                )}
                <MetaItem
                  icon={Eye}
                  label="Lượt xem"
                  value={`${job.views_count ?? 0} lượt`}
                />
                <MetaItem
                  icon={Clock}
                  label="Ngày đăng"
                  value={formatDate(job.created_at)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Back link */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link to="/jobs" />}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Quay lại danh sách tin tuyển dụng
        </Button>
      </div>
    </div>
  )
}
