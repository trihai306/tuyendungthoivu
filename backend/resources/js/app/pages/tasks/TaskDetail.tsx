import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  UserCheck,
  MessageSquare,
  Send,
  Play,
  CheckCircle2,
  XCircle,
  ExternalLink,
  CircleDot,
  ArrowRight,
  FileText,
  Loader2,
} from "lucide-react"
import type { TaskType, TaskPriority, TaskStatus } from "@/types/task"
import { useTask, useChangeTaskStatus, useAddTaskComment } from "@/hooks/use-tasks"
import { useAuthStore } from "@/stores/auth-store"

// -- Config maps --

const taskTypeLabels: Record<TaskType, string> = {
  review_application: "Duyệt hồ sơ",
  interview_candidate: "Phỏng vấn ứng viên",
  verify_employer: "Xác minh doanh nghiệp",
  verify_accommodation: "Xác minh nhà trọ",
  approve_job: "Duyệt tin tuyển dụng",
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

const priorityConfig: Record<TaskPriority, { label: string; className: string; dot: string }> = {
  low: {
    label: "Thấp",
    className:
      "bg-gray-50 text-gray-600 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
    dot: "bg-gray-400",
  },
  medium: {
    label: "Trung bình",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    dot: "bg-amber-400",
  },
  high: {
    label: "Cao",
    className:
      "bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    dot: "bg-orange-500",
  },
  urgent: {
    label: "Khẩn cấp",
    className:
      "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
    dot: "bg-red-500 animate-pulse",
  },
}

const relatedTypeLabels: Record<string, string> = {
  application: "Đơn ứng tuyển",
  employer: "Doanh nghiệp",
  job: "Tin tuyển dụng",
  accommodation: "Nhà trọ",
}

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [newComment, setNewComment] = useState("")

  const { data: task, isLoading, isError } = useTask(id)
  const changeStatus = useChangeTaskStatus()
  const addComment = useAddTaskComment()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-8 w-[300px]" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !task) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-muted-foreground">
          Không tìm thấy công việc
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate("/tasks")}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Quay lại
        </Button>
      </div>
    )
  }

  const status = statusConfig[task.status]
  const priority = priorityConfig[task.priority]

  const handleAddComment = () => {
    if (newComment.trim() && id) {
      addComment.mutate(
        { taskId: id, content: newComment.trim() },
        { onSuccess: () => setNewComment("") },
      )
    }
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (id) {
      changeStatus.mutate({ id, status: newStatus })
    }
  }

  // Build timeline
  const timeline: { label: string; date: string; icon: typeof CircleDot; color: string }[] = [
    {
      label: "Tạo công việc",
      date: task.created_at,
      icon: CircleDot,
      color: "text-gray-500",
    },
  ]

  if (task.started_at) {
    timeline.push({
      label: "Bắt đầu xử lý",
      date: task.started_at,
      icon: Play,
      color: "text-blue-500",
    })
  }

  if (task.completed_at) {
    timeline.push({
      label: "Hoàn thành",
      date: task.completed_at,
      icon: CheckCircle2,
      color: "text-emerald-500",
    })
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/tasks"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách công việc
      </Link>

      {/* Hero */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge
            variant="outline"
            className={`rounded-md text-[11px] font-medium ${status.className}`}
          >
            {status.label}
          </Badge>
          <Badge
            variant="outline"
            className={`rounded-md text-[11px] font-medium ${priority.className}`}
          >
            <span className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${priority.dot}`} />
            {priority.label}
          </Badge>
          <Badge
            variant="outline"
            className={`rounded-md text-[11px] font-medium ${taskTypeBadge[task.type]}`}
          >
            {taskTypeLabels[task.type]}
          </Badge>
        </div>
        <h1 className="text-xl font-semibold">{task.title}</h1>
      </div>

      {/* Grid 2 cols */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Mô tả</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {task.description}
              </p>
              {task.notes && (
                <div className="mt-4 rounded-lg bg-muted/50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1">
                    Ghi chú
                  </p>
                  <p className="text-[13px] text-muted-foreground">
                    {task.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">
                Tiến trình
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-0">
                {timeline.length > 1 && (
                  <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
                )}
                {timeline.map((item, i) => (
                  <div
                    key={i}
                    className="relative flex items-start gap-4 py-3"
                  >
                    <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <p className="text-[13px] font-medium">{item.label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDateTime(item.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CardTitle className="text-[15px] font-semibold">
                  Bình luận
                </CardTitle>
                <span className="rounded-md bg-muted px-1.5 py-px text-[10px] font-semibold tabular-nums text-muted-foreground">
                  {task.comments?.length ?? 0}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {(task.comments?.length ?? 0) === 0 ? (
                <p className="py-6 text-center text-[13px] text-muted-foreground">
                  Chưa có bình luận nào
                </p>
              ) : (
                <div className="space-y-4">
                  {(task.comments ?? []).map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[9px] font-semibold text-primary-foreground">
                          {getInitials(comment.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-medium">
                            {comment.user.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {formatDateTime(comment.created_at)}
                          </span>
                        </div>
                        <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Separator className="my-4" />

              {/* Add comment */}
              <div className="flex gap-3">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[9px] font-semibold text-primary-foreground">
                    {user?.name ? getInitials(user.name) : "NV"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="Viết bình luận..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px]"
                  />
                  <div className="mt-2 flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || addComment.isPending}
                    >
                      {addComment.isPending ? (
                        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                      ) : (
                        <Send className="mr-1.5 h-3 w-3" />
                      )}
                      Gửi
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Meta card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">
                Thông tin
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
                  <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Người giao</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-gradient-to-br from-violet-400 to-violet-600 text-[7px] font-semibold text-white">
                        {getInitials(task.assigned_by.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium">
                      {task.assigned_by.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                  <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Người thực hiện</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[7px] font-semibold text-primary-foreground">
                        {getInitials(task.assigned_to.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium">
                      {task.assigned_to.name}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-500/10">
                  <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Hạn chót</p>
                  <span className="text-[13px] font-medium">
                    {formatDate(task.deadline)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-500/10">
                  <Calendar className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Ngày tạo</p>
                  <span className="text-[13px] font-medium">
                    {formatDate(task.created_at)}
                  </span>
                </div>
              </div>

              {task.completed_at && (
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">
                      Ngày hoàn thành
                    </p>
                    <span className="text-[13px] font-medium">
                      {formatDate(task.completed_at)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Related item */}
          {task.related_type && task.related_id && (
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[15px] font-semibold">
                  Liên quan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between rounded-lg border border-border/70 p-3 transition-colors hover:bg-muted/40">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-[11px] text-muted-foreground">
                        {relatedTypeLabels[task.related_type] || task.related_type}
                      </p>
                      <p className="text-[13px] font-medium">
                        #{task.related_id}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action buttons */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">
                Hành động
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {task.status === "pending" && (
                <Button
                  className="w-full"
                  size="sm"
                  disabled={changeStatus.isPending}
                  onClick={() => handleStatusChange("in_progress")}
                >
                  {changeStatus.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Bắt đầu xử lý
                </Button>
              )}
              {(task.status === "pending" || task.status === "in_progress" || task.status === "overdue") && (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                  disabled={changeStatus.isPending}
                  onClick={() => handleStatusChange("completed")}
                >
                  {changeStatus.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Hoàn thành
                </Button>
              )}
              {task.status !== "completed" && task.status !== "cancelled" && (
                <Button
                  variant="destructive"
                  className="w-full"
                  size="sm"
                  disabled={changeStatus.isPending}
                  onClick={() => handleStatusChange("cancelled")}
                >
                  {changeStatus.isPending ? (
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                  )}
                  Hủy công việc
                </Button>
              )}
              {task.status === "completed" && (
                <div className="rounded-lg bg-emerald-50 p-3 text-center dark:bg-emerald-500/10">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  <p className="mt-1 text-[13px] font-medium text-emerald-700 dark:text-emerald-400">
                    Công việc đã hoàn thành
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
