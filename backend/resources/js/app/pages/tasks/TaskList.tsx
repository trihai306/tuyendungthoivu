import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Skeleton } from "@/components/ui/skeleton"
import {
  ClipboardList,
  Search,
  Plus,
  LayoutGrid,
  List,
  Sparkles,
  Loader2,
} from "lucide-react"
import type { Task, TaskType, TaskPriority, TaskStatus, TaskFilter } from "@/types/task"
import { useTasks } from "@/hooks/use-tasks"
import { useAuthStore } from "@/stores/auth-store"
import { TaskCreate } from "./TaskCreate"

// -- Config maps --

const taskTypeLabels: Record<TaskType, string> = {
  review_application: "Duyệt hồ sơ",
  interview_candidate: "Phỏng vấn",
  verify_employer: "Xác minh DN",
  verify_accommodation: "Xác minh trọ",
  approve_job: "Duyệt tin TD",
  custom: "Khác",
}

const taskTypeBadge: Record<TaskType, string> = {
  review_application:
    "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  interview_candidate:
    "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  verify_employer:
    "bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
  verify_accommodation:
    "bg-teal-50 text-teal-700 border-teal-200/80 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20",
  approve_job:
    "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  custom:
    "bg-gray-50 text-gray-700 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  pending: {
    label: "Đang chờ",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  in_progress: {
    label: "Đang xử lý",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  completed: {
    label: "Hoàn thành",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  cancelled: {
    label: "Đã hủy",
    className:
      "bg-gray-50 text-gray-600 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
  overdue: {
    label: "Quá hạn",
    className:
      "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  low: {
    label: "Thấp",
    className: "text-gray-500",
  },
  medium: {
    label: "Trung bình",
    className: "text-amber-600 dark:text-amber-400",
  },
  high: {
    label: "Cao",
    className: "text-orange-600 dark:text-orange-400",
  },
  urgent: {
    label: "Khẩn cấp",
    className: "text-red-600 dark:text-red-400",
  },
}

const priorityDot: Record<TaskPriority, string> = {
  low: "bg-gray-400",
  medium: "bg-amber-400",
  high: "bg-orange-500",
  urgent: "bg-red-500 animate-pulse",
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function formatDeadline(deadline: string): string {
  const date = new Date(deadline)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

type TabKey = "all" | "mine" | "assigned" | "team"

export function TaskList() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  // Build filters based on active tab
  const filters = useMemo<TaskFilter>(() => {
    const f: TaskFilter = { page, per_page: 20 }
    if (debouncedSearch) f.search = debouncedSearch
    switch (activeTab) {
      case "mine":
        if (user?.id) f.assigned_to = user.id
        break
      case "assigned":
        if (user?.id) f.assigned_by = user.id
        break
      // "team" and "all" use no extra filter
    }
    return f
  }, [activeTab, debouncedSearch, page, user?.id])

  const { data, isLoading, isFetching } = useTasks(filters)
  const tasks = data?.data ?? []
  const meta = data?.meta

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setPage(1)
    // Simple debounce using setTimeout
    const timeout = setTimeout(() => setDebouncedSearch(value), 300)
    return () => clearTimeout(timeout)
  }

  const handleRowClick = (taskId: string) => {
    navigate(`/cong-viec/${taskId}`)
  }

  const handleViewToggle = (mode: "board" | "list") => {
    if (mode === "board") {
      navigate("/tasks")
    }
  }

  const renderTable = (tasks: Task[]) => (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Tiêu đề
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Loại
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Người thực hiện
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Người giao
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
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-muted-foreground"
                >
                  Không tìm thấy công việc nào
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => {
                const status = statusConfig[task.status]
                const priority = priorityConfig[task.priority]
                return (
                  <TableRow
                    key={task.id}
                    className="group cursor-pointer border-0 transition-colors hover:bg-muted/40"
                    onClick={() => handleRowClick(task.id)}
                  >
                    <TableCell className="py-3 pl-6">
                      <span className="text-[13px] font-medium line-clamp-1">
                        {task.title}
                      </span>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge
                        variant="outline"
                        className={`rounded-md text-[10px] font-medium ${taskTypeBadge[task.type]}`}
                      >
                        {taskTypeLabels[task.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[8px] font-semibold text-primary-foreground">
                            {getInitials(task.assigned_to.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] text-muted-foreground truncate max-w-[120px]">
                          {task.assigned_to.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-gradient-to-br from-violet-400 to-violet-600 text-[8px] font-semibold text-white">
                            {getInitials(task.assigned_by.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] text-muted-foreground truncate max-w-[120px]">
                          {task.assigned_by.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 rounded-full ${priorityDot[task.priority]}`}
                        />
                        <span
                          className={`text-[12px] font-medium ${priority.className}`}
                        >
                          {priority.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-muted-foreground">
                      {formatDeadline(task.deadline)}
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-right">
                      <Badge
                        variant="outline"
                        className={`rounded-md text-[11px] font-medium ${status.className}`}
                      >
                        {status.label}
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

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Quản lý
              </span>
            </div>
            <h1 className="text-xl font-semibold">Quản lý công việc</h1>
            <p className="mt-1 text-sm text-white/70">
              Theo dõi và phân công công việc cho đội ngũ
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
              onClick={() => setCreateOpen(true)}
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Giao việc mới
            </Button>
          </div>
        </div>
      </div>

      {/* View Toggle + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/70 bg-muted p-[3px]">
            <button
              onClick={() => handleViewToggle("board")}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Bảng Kanban
            </button>
            <button
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium bg-background text-foreground shadow-sm transition-all"
            >
              <List className="h-3.5 w-3.5" />
              Danh sách
            </button>
          </div>
        </div>

        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm công việc, người thực hiện..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs + Table */}
      <Tabs defaultValue="all" onValueChange={(v) => { setActiveTab(v as TabKey); setPage(1) }}>
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="all">
            Tất cả
            {meta && (
              <span className="ml-1.5 rounded-md bg-muted px-1.5 py-px text-[10px] font-semibold tabular-nums text-muted-foreground">
                {meta.total}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="mine">Của tôi</TabsTrigger>
          <TabsTrigger value="assigned">Tôi giao</TabsTrigger>
          <TabsTrigger value="team">Nhóm</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[70px] ml-auto" />
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <>
            <TabsContent value="all">{renderTable(tasks)}</TabsContent>
            <TabsContent value="mine">{renderTable(tasks)}</TabsContent>
            <TabsContent value="assigned">{renderTable(tasks)}</TabsContent>
            <TabsContent value="team">{renderTable(tasks)}</TabsContent>
          </>
        )}
      </Tabs>

      {/* Pagination */}
      {meta && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {isFetching && <Loader2 className="mr-1.5 inline h-3 w-3 animate-spin" />}
            Hiển thị{" "}
            <span className="font-medium text-foreground">
              {meta.from ?? 0}–{meta.to ?? 0}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-medium text-foreground">
              {meta.total}
            </span>{" "}
            công việc
          </p>
          {meta.last_page > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    text="Trước"
                    onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                    className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: meta.last_page }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
                  .map((p, idx, arr) => {
                    const items = []
                    if (idx > 0 && arr[idx - 1] !== p - 1) {
                      items.push(
                        <PaginationItem key={`ellipsis-${p}`}>
                          <span className="px-2 text-muted-foreground">...</span>
                        </PaginationItem>
                      )
                    }
                    items.push(
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === page}
                          onClick={(e) => { e.preventDefault(); setPage(p) }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    )
                    return items
                  })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    text="Sau"
                    onClick={(e) => { e.preventDefault(); if (page < meta.last_page) setPage(page + 1) }}
                    className={page >= meta.last_page ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

      {/* Mobile FAB */}
      <div className="fixed bottom-6 right-6 sm:hidden">
        <Button
          size="lg"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Create Dialog */}
      <TaskCreate open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
