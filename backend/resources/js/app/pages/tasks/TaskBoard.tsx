import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ClipboardList,
  Plus,
  Search,
  Clock,
  MessageSquare,
  LayoutGrid,
  List,
  Sparkles,
  Loader2,
} from "lucide-react"
import type { Task, TaskType, TaskPriority, TaskStatus, TaskFilter } from "@/types/task"
import { useTasks, useChangeTaskStatus } from "@/hooks/use-tasks"
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

const priorityDot: Record<TaskPriority, string> = {
  low: "bg-gray-400",
  medium: "bg-amber-400",
  high: "bg-orange-500",
  urgent: "bg-red-500 animate-pulse",
}

const priorityLabels: Record<TaskPriority, string> = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp",
}

interface KanbanColumn {
  key: TaskStatus
  label: string
  headerBg: string
  headerText: string
  dotColor: string
}

const columns: KanbanColumn[] = [
  {
    key: "pending",
    label: "Đang chờ",
    headerBg: "bg-amber-50 dark:bg-amber-500/10",
    headerText: "text-amber-700 dark:text-amber-400",
    dotColor: "bg-amber-500",
  },
  {
    key: "in_progress",
    label: "Đang xử lý",
    headerBg: "bg-blue-50 dark:bg-blue-500/10",
    headerText: "text-blue-700 dark:text-blue-400",
    dotColor: "bg-blue-500",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    headerBg: "bg-emerald-50 dark:bg-emerald-500/10",
    headerText: "text-emerald-700 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
  },
  {
    key: "overdue",
    label: "Quá hạn",
    headerBg: "bg-red-50 dark:bg-red-500/10",
    headerText: "text-red-700 dark:text-red-400",
    dotColor: "bg-red-500",
  },
]

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

// -- Task Card --

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h4 className="text-[13px] font-medium leading-snug line-clamp-2">
          {task.title}
        </h4>

        <div className="mt-2.5 flex items-center gap-2">
          <Badge
            variant="outline"
            className={`rounded-md text-[10px] font-medium ${taskTypeBadge[task.type]}`}
          >
            {taskTypeLabels[task.type]}
          </Badge>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${priorityDot[task.priority]}`}
            />
            <span className="text-[10px] text-muted-foreground">
              {priorityLabels[task.priority]}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[8px] font-semibold text-primary-foreground">
                {getInitials(task.assigned_to.name)}
              </AvatarFallback>
            </Avatar>
            <span className="text-[11px] text-muted-foreground truncate max-w-[100px]">
              {task.assigned_to.name}
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatDeadline(task.deadline)}</span>
          </div>
          {(task.comments?.length ?? 0) > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// -- Main Component --

export function TaskBoard() {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState<"board" | "list">("board")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)

  const changeStatus = useChangeTaskStatus()

  // Build filters for API
  const filters = useMemo<TaskFilter>(() => {
    const f: TaskFilter = { per_page: 100 } // Load more for board view
    if (debouncedSearch) f.search = debouncedSearch
    if (typeFilter !== "all") f.type = typeFilter as TaskType
    if (priorityFilter !== "all") f.priority = priorityFilter as TaskPriority
    return f
  }, [debouncedSearch, typeFilter, priorityFilter])

  const { data, isLoading, isFetching } = useTasks(filters)
  const allTasks = data?.data ?? []

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    const timeout = setTimeout(() => setDebouncedSearch(value), 300)
    return () => clearTimeout(timeout)
  }

  const tasksByStatus = useMemo(() => {
    const map: Record<string, Task[]> = {}
    for (const col of columns) {
      map[col.key] = allTasks.filter((t) => t.status === col.key)
    }
    return map
  }, [allTasks])

  const stats = useMemo(() => {
    const total = allTasks.length
    const pending = allTasks.filter((t) => t.status === "pending").length
    const inProgress = allTasks.filter((t) => t.status === "in_progress").length
    const completed = allTasks.filter((t) => t.status === "completed").length
    return { total, pending, inProgress, completed }
  }, [allTasks])

  const handleTaskClick = (taskId: string) => {
    navigate(`/cong-viec/${taskId}`)
  }

  const handleViewToggle = (mode: "board" | "list") => {
    if (mode === "list") {
      navigate("/tasks/list")
    } else {
      setViewMode(mode)
    }
  }

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
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Giao việc mới
            </Button>
          </div>
        </div>

        {/* Stats row */}
        <div className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Tổng", value: stats.total, icon: Sparkles },
            { label: "Đang chờ", value: stats.pending, icon: Clock },
            { label: "Đang xử lý", value: stats.inProgress, icon: LayoutGrid },
            { label: "Hoàn thành", value: stats.completed, icon: ClipboardList },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm"
            >
              <div className="flex items-center gap-1.5">
                <stat.icon className="h-3 w-3 text-white/60" />
                <span className="text-[11px] text-white/60">{stat.label}</span>
              </div>
              <p className="mt-0.5 text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* View Toggle + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border/70 bg-muted p-[3px]">
            <button
              onClick={() => handleViewToggle("board")}
              className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === "board"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Bảng Kanban
            </button>
            <button
              onClick={() => handleViewToggle("list")}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-all"
            >
              <List className="h-3.5 w-3.5" />
              Danh sách
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Loại công việc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="review_application">Duyệt hồ sơ</SelectItem>
              <SelectItem value="interview_candidate">Phỏng vấn</SelectItem>
              <SelectItem value="verify_employer">Xác minh DN</SelectItem>
              <SelectItem value="verify_accommodation">Xác minh trọ</SelectItem>
              <SelectItem value="approve_job">Duyệt tin TD</SelectItem>
              <SelectItem value="custom">Khác</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Mức ưu tiên" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="low">Thấp</SelectItem>
              <SelectItem value="medium">Trung bình</SelectItem>
              <SelectItem value="high">Cao</SelectItem>
              <SelectItem value="urgent">Khẩn cấp</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm công việc..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => (
            <div key={col.key} className="flex flex-col">
              <div className={`flex items-center justify-between rounded-t-lg px-3 py-2.5 ${col.headerBg}`}>
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`} />
                  <span className={`text-[13px] font-semibold ${col.headerText}`}>{col.label}</span>
                </div>
              </div>
              <div className="flex-1 rounded-b-lg border border-t-0 border-border/50 bg-muted/30 p-3 space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((col) => {
            const tasks = tasksByStatus[col.key] || []
            return (
              <div key={col.key} className="flex flex-col">
                {/* Column header */}
                <div
                  className={`flex items-center justify-between rounded-t-lg px-3 py-2.5 ${col.headerBg}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${col.dotColor}`}
                    />
                    <span
                      className={`text-[13px] font-semibold ${col.headerText}`}
                    >
                      {col.label}
                    </span>
                  </div>
                  <span
                    className={`rounded-md px-1.5 py-px text-[11px] font-semibold tabular-nums ${col.headerText}`}
                  >
                    {tasks.length}
                  </span>
                </div>

                {/* Column body */}
                <div className="flex-1 rounded-b-lg border border-t-0 border-border/50 bg-muted/30">
                  <ScrollArea className="h-[calc(100vh-420px)] min-h-[300px]">
                    <div className="space-y-3 p-3">
                      {tasks.length === 0 ? (
                        <p className="py-8 text-center text-xs text-muted-foreground">
                          Không có công việc
                        </p>
                      ) : (
                        tasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onClick={() => handleTaskClick(task.id)}
                          />
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            )
          })}
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
