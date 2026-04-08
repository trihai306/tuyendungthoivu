import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  BriefcaseBusiness,
  Search,
  Filter,
  Sparkles,
} from "lucide-react"
import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-applications"
import type { Application, ApplicationStatus } from "@/types"

// --- Status config ---

// Map API status to Vietnamese display label
const statusLabelMap: Record<ApplicationStatus, string> = {
  pending: "Mới",
  reviewing: "Đang xem",
  shortlisted: "Danh sách ngắn",
  interview: "Phỏng vấn",
  accepted: "Đã duyệt",
  rejected: "Từ chối",
  withdrawn: "Đã rút",
}

const statusConfig: Record<string, { className: string }> = {
  pending: {
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  reviewing: {
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  shortlisted: {
    className: "bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
  },
  interview: {
    className: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  },
  accepted: {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  rejected: {
    className: "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  withdrawn: {
    className: "bg-gray-50 text-gray-500 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
}

// --- Helpers ---

const avatarColors = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
  "from-cyan-400 to-cyan-600",
  "from-pink-400 to-pink-600",
  "from-indigo-400 to-indigo-600",
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "N/A"
  try {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

// --- Tab types ---

type TabKey = "all" | "pending" | "interview" | "approved" | "rejected"

const tabStatusMap: Record<TabKey, ApplicationStatus[] | null> = {
  all: null,
  pending: ["pending", "reviewing"],
  interview: ["interview", "shortlisted"],
  approved: ["accepted"],
  rejected: ["rejected", "withdrawn"],
}

export function ApplicationList() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 10

  // Build API query params
  const filters: Record<string, unknown> = {
    page: currentPage,
    per_page: perPage,
  }
  if (searchQuery) filters.search = searchQuery

  // Apply status filter from tab
  const activeStatuses = tabStatusMap[activeTab]
  if (activeStatuses && activeStatuses.length === 1) {
    filters.status = activeStatuses[0]
  }

  const { data, isLoading, isError } = useApplications(filters)

  const applications = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta?.last_page ?? 1
  const total = meta?.total ?? 0

  // Client-side filter for multi-status tabs (pending includes both pending & reviewing)
  const filteredApplications = activeStatuses && activeStatuses.length > 1
    ? applications.filter((app: Application) => activeStatuses.includes(app.status))
    : applications

  const renderTable = (apps: Application[]) => (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Ứng viên
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Vị trí
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Doanh nghiệp
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Ngày nộp
              </TableHead>
              <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  Không tìm thấy đơn ứng tuyển nào
                </TableCell>
              </TableRow>
            ) : (
              apps.map((app: Application) => {
                const candidateName = app.worker?.name ?? "N/A"
                const avatarBg = getAvatarColor(app.worker_id)
                const initials = getInitials(candidateName)
                const position = app.job_post?.title ?? "N/A"
                const company = app.job_post?.employer?.employer_profile?.company_name ?? "N/A"
                const config = statusConfig[app.status] ?? statusConfig.pending
                const label = statusLabelMap[app.status] ?? app.status

                return (
                  <TableRow
                    key={app.id}
                    className="group cursor-pointer border-0 transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shadow-sm">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${avatarBg} text-[10px] font-semibold text-white`}
                          >
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] font-medium">{candidateName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-muted-foreground">
                      {position}
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-muted-foreground">
                      {company}
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-muted-foreground">
                      {formatDate(app.applied_at)}
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-right">
                      <Badge
                        variant="outline"
                        className={`rounded-md text-[11px] font-medium ${config.className}`}
                      >
                        {label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  const renderLoadingSkeleton = () => (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Ứng viên</TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Vị trí</TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Doanh nghiệp</TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Ngày nộp</TableHead>
              <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-0">
                <TableCell className="py-3 pl-6">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </TableCell>
                <TableCell className="py-3"><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell className="py-3"><Skeleton className="h-4 w-20" /></TableCell>
                <TableCell className="py-3 pr-6 text-right"><Skeleton className="h-5 w-16 ml-auto rounded-md" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Việc làm
              </span>
            </div>
            <h1 className="text-xl font-semibold">Quản lý ứng tuyển</h1>
            <p className="mt-1 text-sm text-white/70">
              Theo dõi và quản lý tất cả các đơn ứng tuyển từ ứng viên
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ứng viên, vị trí, doanh nghiệp..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-1.5 h-3.5 w-3.5" />
          Bộ lọc
        </Button>
      </div>

      {/* Tabs + Table */}
      <Tabs defaultValue="all" onValueChange={(v) => { setActiveTab(v as TabKey); setCurrentPage(1) }}>
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="all">
            Tất cả
            <span className="ml-1.5 rounded-md bg-muted px-1.5 py-px text-[10px] font-semibold tabular-nums text-muted-foreground">
              {total}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending">Đang chờ</TabsTrigger>
          <TabsTrigger value="interview">Phỏng vấn</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Từ chối</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? renderLoadingSkeleton() : isError ? (
            <Card className="border-border/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <BriefcaseBusiness className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="mt-4 text-sm font-medium">Không thể tải dữ liệu</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Đã có lỗi xảy ra. Vui lòng thử lại.
                </p>
              </CardContent>
            </Card>
          ) : renderTable(filteredApplications)}
        </TabsContent>
        <TabsContent value="pending">
          {isLoading ? renderLoadingSkeleton() : renderTable(filteredApplications)}
        </TabsContent>
        <TabsContent value="interview">
          {isLoading ? renderLoadingSkeleton() : renderTable(filteredApplications)}
        </TabsContent>
        <TabsContent value="approved">
          {isLoading ? renderLoadingSkeleton() : renderTable(filteredApplications)}
        </TabsContent>
        <TabsContent value="rejected">
          {isLoading ? renderLoadingSkeleton() : renderTable(filteredApplications)}
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Hiển thị <span className="font-medium text-foreground">{filteredApplications.length}</span> trong tổng số{" "}
          <span className="font-medium text-foreground">{total}</span> đơn ứng tuyển
        </p>
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
    </div>
  )
}
