import { useState } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Search,
  MapPin,
  Building2,
  Users,
  BadgeCheck,
} from "lucide-react"
import { useEmployers } from "@/hooks/use-employers"
import type { EmployerProfile } from "@/types"

// --- Helpers ---

const industries = [
  "Tất cả",
  "Công nghệ thông tin",
  "Bất động sản",
  "Thương mại điện tử",
  "FMCG",
  "Vận tải & Logistics",
  "Sản xuất",
  "Nhà hàng & Khách sạn",
]

const cities = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Cần Thơ"]

const industryColors: Record<string, string> = {
  "Công nghệ thông tin": "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "Bất động sản": "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  "Thương mại điện tử": "bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
  "FMCG": "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  "Vận tải & Logistics": "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  "Sản xuất": "bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  "Nhà hàng & Khách sạn": "bg-pink-50 text-pink-700 border-pink-200/80 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20",
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

export function EmployerList() {
  const [search, setSearch] = useState("")
  const [industryFilter, setIndustryFilter] = useState("Tất cả")
  const [cityFilter, setCityFilter] = useState("Tất cả")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 6

  // Build API query params
  const filters: Record<string, unknown> = {
    page: currentPage,
    per_page: perPage,
  }
  if (search) filters.search = search
  if (industryFilter && industryFilter !== "Tất cả") filters.industry = industryFilter
  if (cityFilter && cityFilter !== "Tất cả") filters.city = cityFilter

  const { data, isLoading, isError } = useEmployers(filters)

  const employers = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta?.last_page ?? 1
  const total = meta?.total ?? 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Doanh nghiệp</h1>
        </div>
        <p className="text-sm text-muted-foreground">Danh sách doanh nghiệp đối tác trong hệ thống</p>
      </div>

      {/* Search + Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên doanh nghiệp..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={industryFilter} onValueChange={(v) => { setIndustryFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[200px]">
                  <Building2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[150px]">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <span className="font-medium text-foreground">{employers.length}</span> / <span className="font-medium text-foreground">{total}</span> doanh nghiệp
        </p>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: perPage }).map((_, i) => (
            <Card key={i} className="border-border/50 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start gap-3.5">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-28 rounded-md" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <div className="mt-4 pt-3.5 border-t border-border/50">
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Building2 className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mt-4 text-sm font-medium">Không thể tải dữ liệu</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Đã có lỗi xảy ra khi tải danh sách doanh nghiệp. Vui lòng thử lại.
            </p>
          </CardContent>
        </Card>
      ) : employers.length === 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-medium">Không tìm thấy doanh nghiệp</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {employers.map((employer: EmployerProfile) => {
            const companyName = employer.company_name ?? "N/A"
            const logoBg = getAvatarColor(employer.user_id)
            const initials = getInitials(companyName)
            const industryColor = industryColors[employer.industry ?? ""] ?? "bg-gray-50 text-gray-700 border-gray-200/80"
            const isVerified = !!employer.verified_at

            return (
              <Card
                key={employer.user_id}
                className="group border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3.5">
                    {/* Logo */}
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${logoBg} shadow-sm`}
                    >
                      <span className="text-sm font-bold text-white">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-[14px] font-semibold leading-snug truncate">
                          {companyName}
                        </h3>
                        {isVerified && (
                          <BadgeCheck className="h-4 w-4 shrink-0 text-blue-500" />
                        )}
                      </div>
                      {employer.industry && (
                        <Badge
                          variant="outline"
                          className={`mt-1.5 rounded-md text-[10px] font-medium ${industryColor}`}
                        >
                          {employer.industry}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{employer.city ?? "Chưa cập nhật"}</span>
                    </div>
                    {employer.company_size && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        <span>{employer.company_size}</span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <div className="mt-4 border-t border-border/50 pt-3.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full gap-1.5 text-xs"
                      render={<Link to={`/doanh-nghiep/${employer.user_id}`} />}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Trước"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                text="Sau"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
