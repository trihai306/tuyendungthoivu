import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  History,
  LogIn,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  GitBranch,
  ChevronRight,
  AlertCircle,
  type LucideIcon,
} from "lucide-react"
import type { ActivityAction } from "@/types/rbac"
import { useActivityLogs } from "@/hooks/use-activity-logs"

// Action display configuration
interface ActionConfig {
  label: string
  icon: LucideIcon
  badgeClass: string
  dotColor: string
}

const actionConfigMap: Record<ActivityAction, ActionConfig> = {
  login: {
    label: "Đăng nhập",
    icon: LogIn,
    badgeClass: "bg-gray-50 text-gray-700 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
    dotColor: "bg-gray-400",
  },
  create: {
    label: "Tạo mới",
    icon: Plus,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    dotColor: "bg-emerald-500",
  },
  update: {
    label: "Chỉnh sửa",
    icon: Pencil,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    dotColor: "bg-blue-500",
  },
  delete: {
    label: "Xóa",
    icon: Trash2,
    badgeClass: "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    dotColor: "bg-red-500",
  },
  approve: {
    label: "Duyệt",
    icon: CheckCircle,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    dotColor: "bg-amber-500",
  },
  assign: {
    label: "Giao việc",
    icon: GitBranch,
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    dotColor: "bg-violet-500",
  },
}

const defaultActionConfig: ActionConfig = {
  label: "Khác",
  icon: History,
  badgeClass: "bg-gray-50 text-gray-700 border-gray-200/80",
  dotColor: "bg-gray-400",
}

const actionOptions = [
  { value: "all", label: "Tất cả hành động" },
  { value: "login", label: "Đăng nhập" },
  { value: "create", label: "Tạo mới" },
  { value: "update", label: "Chỉnh sửa" },
  { value: "delete", label: "Xóa" },
  { value: "approve", label: "Duyệt" },
  { value: "assign", label: "Giao việc" },
]

const ITEMS_PER_PAGE = 15

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length < 2) return name.charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const avatarBgs = [
  "from-purple-400 to-purple-600",
  "from-red-400 to-red-600",
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-pink-400 to-pink-600",
  "from-cyan-400 to-cyan-600",
]

function getAvatarBg(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarBgs[Math.abs(hash) % avatarBgs.length]
}

export function ActivityLogPage() {
  const [selectedAction, setSelectedAction] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  const apiFilters = {
    action: selectedAction !== "all" ? selectedAction : undefined,
    page: currentPage,
    per_page: ITEMS_PER_PAGE,
  }

  const { data, isLoading, isError } = useActivityLogs(apiFilters)

  const activities = data?.data ?? []
  const meta = data?.meta
  const totalPages = meta?.last_page ?? 1
  const totalItems = meta?.total ?? 0

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <History className="h-4 w-4 text-white/80" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Giám sát
            </span>
          </div>
          <h1 className="text-xl font-semibold">Nhật ký hoạt động</h1>
          <p className="mt-1 text-sm text-white/70">
            Theo dõi và kiểm tra mọi hoạt động trong hệ thống
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Select value={selectedAction} onValueChange={(val) => { setSelectedAction(val); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-52 text-[13px]">
                  <SelectValue placeholder="Chọn hành động" />
                </SelectTrigger>
                <SelectContent>
                  {actionOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-[13px]"
              onClick={() => {
                setSelectedAction("all")
                setCurrentPage(1)
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error state */}
      {isError && (
        <Card className="border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/5 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700 dark:text-red-400">Không thể tải nhật ký hoạt động. Vui lòng thử lại.</p>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {isLoading && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Activity Timeline */}
      {!isLoading && !isError && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-0">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <History className="h-10 w-10 text-muted-foreground/30" />
                <p className="mt-3 text-[13px] font-medium text-muted-foreground">
                  Không tìm thấy hoạt động nào
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  Thử thay đổi bộ lọc để xem kết quả khác
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {activities.map((activity) => {
                  const config = actionConfigMap[activity.action] ?? defaultActionConfig
                  const ActionIcon = config.icon
                  const userName = activity.user?.name ?? "Unknown"
                  const userRole = activity.user?.role ?? ""
                  const avatarBg = getAvatarBg(userName)

                  return (
                    <div
                      key={activity.id}
                      className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/30"
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <Avatar className="h-9 w-9 shadow-sm">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${avatarBg} text-[10px] font-semibold text-white`}
                          >
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full ${config.dotColor} ring-2 ring-card`}
                        >
                          <ActionIcon className="h-2.5 w-2.5 text-white" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-medium text-foreground">
                            {userName}
                          </span>
                          {userRole && (
                            <Badge
                              variant="outline"
                              className="rounded-md text-[10px] font-medium"
                            >
                              {userRole}
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`rounded-md text-[10px] font-medium ${config.badgeClass}`}
                          >
                            {config.label}
                          </Badge>
                          <span className="text-[12px] text-muted-foreground">
                            {activity.description}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center gap-3">
                          <span className="text-[11px] text-muted-foreground/60">
                            {activity.created_at}
                          </span>
                          {activity.ip_address && (
                            <span className="text-[10px] text-muted-foreground/40">
                              IP: {activity.ip_address}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60" />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-muted-foreground">
            Trang {currentPage}/{totalPages} ({totalItems} hoạt động)
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Trước"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                // Show pages around current page
                let page: number
                if (totalPages <= 5) {
                  page = i + 1
                } else if (currentPage <= 3) {
                  page = i + 1
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i
                } else {
                  page = currentPage - 2 + i
                }
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
              })}
              <PaginationItem>
                <PaginationNext
                  text="Sau"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
