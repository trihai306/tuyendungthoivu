import { useParams, Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  MapPin,
  Building2,
  Users,
  Globe,
  BadgeCheck,
  Star,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
} from "lucide-react"
import { useEmployer } from "@/hooks/use-employers"

// --- Helpers ---

const industryColors: Record<string, string> = {
  "Công nghệ thông tin": "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "Bất động sản": "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  "Thương mại điện tử": "bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
}

const avatarColors = [
  "from-orange-400 to-orange-600",
  "from-red-400 to-red-600",
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-cyan-400 to-cyan-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-pink-400 to-pink-600",
]

function getAvatarColor(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="h-28 bg-muted" />
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="flex-1 space-y-2 sm:pb-1">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function EmployerDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: employer, isLoading, isError } = useEmployer(id)

  if (isLoading) return <DetailSkeleton />

  if (isError || !employer) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
          render={<Link to="/employers" />}
        >
          <ArrowLeft className="h-4 w-4" />
          Danh sách doanh nghiệp
        </Button>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Building2 className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mt-4 text-sm font-medium">Không tìm thấy doanh nghiệp</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Doanh nghiệp này không tồn tại hoặc đã bị xóa.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const companyName = employer.company_name ?? "N/A"
  const logoBg = getAvatarColor(employer.user_id)
  const initials = getInitials(companyName)
  const isVerified = !!employer.verified_at
  const industryColor = industryColors[employer.industry ?? ""] ?? "bg-gray-50 text-gray-700 border-gray-200/80"
  const email = employer.user?.email ?? "N/A"
  const phone = employer.user?.phone ?? "N/A"
  const rating = employer.rating ?? 0

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        render={<Link to="/employers" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Danh sách doanh nghiệp
      </Button>

      {/* Hero Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative h-28 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40">
          <div className="absolute -bottom-4 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="absolute top-4 right-10 h-16 w-16 rounded-full bg-white/5 blur-lg" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${logoBg} shadow-lg ring-4 ring-card`}
            >
              <span className="text-2xl font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{companyName}</h1>
                {isVerified && (
                  <BadgeCheck className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                {employer.industry && (
                  <Badge
                    variant="outline"
                    className={`rounded-md text-[11px] font-medium ${industryColor}`}
                  >
                    {employer.industry}
                  </Badge>
                )}
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {employer.city ?? "Chưa cập nhật"}
                </span>
                {employer.website && (
                  <a
                    href={employer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          {/* About */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Building2 className="h-4 w-4 text-primary" />
                Giới thiệu công ty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {employer.description ? (
                  employer.description.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <p>Doanh nghiệp chưa cập nhật giới thiệu.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* General info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Ngành nghề</p>
                    <p className="text-sm font-medium">{employer.industry ?? "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Quy mô</p>
                    <p className="text-sm font-medium">{employer.company_size ?? "N/A"}</p>
                  </div>
                </div>
                {employer.tax_code && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
                      <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground">Mã số thuế</p>
                      <p className="text-sm font-medium">{employer.tax_code}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
                    <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Địa chỉ</p>
                    <p className="text-sm font-medium">{employer.address ?? "N/A"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick stats */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Thống kê</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    Đánh giá
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BadgeCheck className="h-4 w-4" />
                    Xác minh
                  </div>
                  <Badge variant={isVerified ? "secondary" : "outline"} className="rounded-md text-[11px]">
                    {isVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Điện thoại</p>
                    <p className="text-sm font-medium">{phone}</p>
                  </div>
                </div>
                {employer.website && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
                      <Globe className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground">Website</p>
                      <a
                        href={employer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline truncate block"
                      >
                        {employer.website.replace("https://", "").replace("http://", "")}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4">
              <Button className="w-full gap-2" size="lg">
                <Mail className="h-4 w-4" />
                Liên hệ tuyển dụng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
