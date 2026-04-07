import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  MapPin,
  Search,
  Plus,
  Briefcase,
  Clock,
  Users,
  Sparkles,
  FileSearch,
  DollarSign,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type JobType = "full-time" | "part-time" | "seasonal"

interface Job {
  id: string
  title: string
  company: string
  companyInitials: string
  companyGradient: string
  location: string
  salaryMin: number
  salaryMax: number
  jobType: JobType
  postedAt: string
  positions: number
  description: string
}

// ─── Constants ───────────────────────────────────────────────────────────────

const JOB_TYPE_CONFIG: Record<
  JobType,
  { label: string; className: string }
> = {
  "full-time": {
    label: "Toan thoi gian",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  "part-time": {
    label: "Ban thoi gian",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  seasonal: {
    label: "Thoi vu",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
}

// Vietnamese labels with diacritics
const JOB_TYPE_LABELS: Record<JobType, string> = {
  "full-time": "Toàn thời gian",
  "part-time": "Bán thời gian",
  seasonal: "Thời vụ",
}

function getJobTypeLabel(type: JobType): string {
  return JOB_TYPE_LABELS[type]
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Nhân viên phục vụ nhà hàng",
    company: "Công ty TNHH Thực phẩm Việt",
    companyInitials: "TV",
    companyGradient: "from-blue-400 to-blue-600",
    location: "Hà Nội",
    salaryMin: 5000000,
    salaryMax: 8000000,
    jobType: "full-time",
    postedAt: "2 giờ trước",
    positions: 5,
    description:
      "Tuyển nhân viên phục vụ tại nhà hàng cao cấp, yêu cầu ngoại hình khá.",
  },
  {
    id: "2",
    title: "Lễ tân khách sạn",
    company: "Khách sạn Sunrise",
    companyInitials: "SR",
    companyGradient: "from-violet-400 to-violet-600",
    location: "Đà Nẵng",
    salaryMin: 6000000,
    salaryMax: 10000000,
    jobType: "full-time",
    postedAt: "5 giờ trước",
    positions: 3,
    description:
      "Tuyển lễ tân biết tiếng Anh, giao tiếp tốt, kinh nghiệm từ 1 năm.",
  },
  {
    id: "3",
    title: "Nhân viên bán hàng",
    company: "Siêu thị MegaMart",
    companyInitials: "MM",
    companyGradient: "from-emerald-400 to-emerald-600",
    location: "Hồ Chí Minh",
    salaryMin: 4500000,
    salaryMax: 7000000,
    jobType: "part-time",
    postedAt: "1 ngày trước",
    positions: 10,
    description:
      "Tuyển nhân viên bán hàng làm ca linh hoạt, nhận sinh viên.",
  },
  {
    id: "4",
    title: "Phụ bếp nhà hàng",
    company: "Nhà hàng Phố Xanh",
    companyInitials: "PX",
    companyGradient: "from-amber-400 to-amber-600",
    location: "Hà Nội",
    salaryMin: 4000000,
    salaryMax: 6000000,
    jobType: "full-time",
    postedAt: "1 ngày trước",
    positions: 2,
    description:
      "Tuyển phụ bếp có kinh nghiệm, chịu khó, sạch sẽ.",
  },
  {
    id: "5",
    title: "Nhân viên dọn phòng",
    company: "Resort Biển Xanh",
    companyInitials: "BX",
    companyGradient: "from-rose-400 to-rose-600",
    location: "Nha Trang",
    salaryMin: 5000000,
    salaryMax: 7500000,
    jobType: "seasonal",
    postedAt: "2 ngày trước",
    positions: 8,
    description:
      "Tuyển nhân viên dọn phòng mùa cao điểm hè 2026.",
  },
  {
    id: "6",
    title: "Bảo vệ tòa nhà",
    company: "Công ty An Ninh Sài Gòn",
    companyInitials: "SG",
    companyGradient: "from-cyan-400 to-cyan-600",
    location: "Hồ Chí Minh",
    salaryMin: 5500000,
    salaryMax: 8000000,
    jobType: "full-time",
    postedAt: "3 ngày trước",
    positions: 4,
    description:
      "Tuyển bảo vệ làm việc tại tòa nhà văn phòng, ca 12 tiếng.",
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSalary(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu`
  }
  return new Intl.NumberFormat("vi-VN").format(amount)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function JobCardSkeleton() {
  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

interface JobCardProps {
  job: Job
}

function JobCard({ job }: JobCardProps) {
  const typeConfig = JOB_TYPE_CONFIG[job.jobType]

  return (
    <Link to={`/tin-tuyen-dung/${job.id}`} className="block">
      <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
        <CardContent className="p-5">
          {/* Header: Company avatar + info */}
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 rounded-xl">
              <AvatarFallback
                className={`bg-gradient-to-br ${job.companyGradient} rounded-xl text-[10px] font-semibold text-white`}
              >
                {job.companyInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors truncate">
                {job.title}
              </h3>
              <p className="mt-0.5 text-[13px] text-muted-foreground truncate">
                {job.company}
              </p>
            </div>
          </div>

          {/* Location + Salary */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
              <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span>
                {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)}{" "}
                VNĐ/tháng
              </span>
            </div>
          </div>

          {/* Footer: Badge + Meta */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`rounded-md text-[11px] font-medium ${typeConfig.className}`}
              >
                {getJobTypeLabel(job.jobType)}
              </Badge>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Users className="h-3 w-3" />
                {job.positions} vị trí
              </span>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {job.postedAt}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <FileSearch className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-foreground">
        Không tìm thấy tin tuyển dụng
      </h3>
      <p className="mt-1 text-[13px] text-muted-foreground text-center max-w-sm">
        Không có tin tuyển dụng nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc.
      </p>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function JobList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [salaryFilter, setSalaryFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Simulated loading state
  const isLoading = false

  // Filtering logic
  const filteredJobs = MOCK_JOBS.filter((job) => {
    const matchesSearch =
      searchQuery === "" ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCity =
      cityFilter === "all" || job.location === cityFilter

    const matchesType =
      typeFilter === "all" || job.jobType === typeFilter

    const matchesSalary = (() => {
      if (salaryFilter === "all") return true
      if (salaryFilter === "under-5m") return job.salaryMax < 5000000
      if (salaryFilter === "5m-10m")
        return job.salaryMin >= 5000000 && job.salaryMax <= 10000000
      if (salaryFilter === "over-10m") return job.salaryMin > 10000000
      return true
    })()

    return matchesSearch && matchesCity && matchesType && matchesSalary
  })

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / 6))
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * 6,
    currentPage * 6
  )

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Tuyển dụng
              </span>
            </div>
            <h1 className="text-xl font-semibold">Tin tuyển dụng</h1>
            <p className="mt-1 text-sm text-white/70">
              Tìm kiếm và ứng tuyển các vị trí việc làm phù hợp với bạn
            </p>
          </div>
          <div className="hidden sm:flex">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
              render={<Link to="/tin-tuyen-dung/tao-moi" />}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Đăng tin mới
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên công việc, công ty..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setCurrentPage(1)
          }}
          className="h-10 pl-9 w-full"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="text-[13px] font-medium text-muted-foreground">
            Bộ lọc:
          </span>
        </div>

        <Select
          value={cityFilter}
          onValueChange={(val) => {
            setCityFilter(val as string)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Thành phố" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả thành phố</SelectItem>
            <SelectItem value="Hà Nội">Hà Nội</SelectItem>
            <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
            <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
            <SelectItem value="Nha Trang">Nha Trang</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={typeFilter}
          onValueChange={(val) => {
            setTypeFilter(val as string)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại công việc" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="full-time">Toàn thời gian</SelectItem>
            <SelectItem value="part-time">Bán thời gian</SelectItem>
            <SelectItem value="seasonal">Thời vụ</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={salaryFilter}
          onValueChange={(val) => {
            setSalaryFilter(val as string)
            setCurrentPage(1)
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Mức lương" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả mức lương</SelectItem>
            <SelectItem value="under-5m">Dưới 5 triệu</SelectItem>
            <SelectItem value="5m-10m">5 - 10 triệu</SelectItem>
            <SelectItem value="over-10m">Trên 10 triệu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-muted-foreground">
          Tìm thấy{" "}
          <span className="font-semibold text-foreground">
            {filteredJobs.length}
          </span>{" "}
          tin tuyển dụng
        </p>
      </div>

      {/* Job Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedJobs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginatedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Trước"
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1
              if (
                totalPages <= 5 ||
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              if (
                page === 2 && currentPage > 3 ||
                page === totalPages - 1 && currentPage < totalPages - 2
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            })}

            <PaginationItem>
              <PaginationNext
                text="Sau"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
