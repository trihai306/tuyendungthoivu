import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  ClipboardList,
  ArrowDown,
  Minus,
  ArrowUp,
  AlertTriangle,
} from "lucide-react"
import type { TaskPriority } from "@/types/task"
import { mockUsers } from "@/data/mock-tasks"
import type { LucideIcon } from "lucide-react"

interface TaskCreateProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface PriorityOption {
  value: TaskPriority
  label: string
  description: string
  icon: LucideIcon
  color: string
  bgColor: string
  borderColor: string
}

const priorityOptions: PriorityOption[] = [
  {
    value: "low",
    label: "Thấp",
    description: "Không gấp",
    icon: ArrowDown,
    color: "text-gray-600 dark:text-gray-400",
    bgColor: "bg-gray-50 dark:bg-gray-500/10",
    borderColor: "border-gray-200 dark:border-gray-500/20",
  },
  {
    value: "medium",
    label: "Trung bình",
    description: "Bình thường",
    icon: Minus,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-500/10",
    borderColor: "border-amber-200 dark:border-amber-500/20",
  },
  {
    value: "high",
    label: "Cao",
    description: "Cần sớm",
    icon: ArrowUp,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-500/10",
    borderColor: "border-orange-200 dark:border-orange-500/20",
  },
  {
    value: "urgent",
    label: "Khẩn cấp",
    description: "Làm ngay",
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-500/10",
    borderColor: "border-red-200 dark:border-red-500/20",
  },
]

function getInitials(name: string): string {
  const parts = name.split(" ")
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function TaskCreate({ open, onOpenChange }: TaskCreateProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [taskType, setTaskType] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [deadline, setDeadline] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = () => {
    // Mock submit - in real app, this would call the API
    console.log({
      title,
      description,
      type: taskType,
      assigned_to: assignedTo,
      priority,
      deadline,
      notes,
    })
    handleReset()
    onOpenChange(false)
  }

  const handleReset = () => {
    setTitle("")
    setDescription("")
    setTaskType("")
    setAssignedTo("")
    setPriority("medium")
    setDeadline("")
    setNotes("")
  }

  const isValid = title.trim() !== "" && taskType !== "" && assignedTo !== "" && deadline !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Giao việc mới
          </DialogTitle>
          <DialogDescription>
            Tạo và phân công công việc cho nhân viên trong đội ngũ
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="task-title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-title"
              placeholder="Nhập tiêu đề công việc..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="task-description">Mô tả</Label>
            <Textarea
              id="task-description"
              placeholder="Mô tả chi tiết công việc cần thực hiện..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Type + Assigned to */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>
                Loại công việc <span className="text-red-500">*</span>
              </Label>
              <Select value={taskType} onValueChange={setTaskType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="review_application">Duyệt hồ sơ</SelectItem>
                  <SelectItem value="interview_candidate">Phỏng vấn ứng viên</SelectItem>
                  <SelectItem value="verify_employer">Xác minh doanh nghiệp</SelectItem>
                  <SelectItem value="verify_accommodation">Xác minh nhà trọ</SelectItem>
                  <SelectItem value="approve_job">Duyệt tin tuyển dụng</SelectItem>
                  <SelectItem value="custom">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>
                Giao cho <span className="text-red-500">*</span>
              </Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn nhân viên" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[6px] font-semibold text-primary-foreground">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority radio cards */}
          <div className="space-y-1.5">
            <Label>Mức ưu tiên</Label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = priority === opt.value
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-center transition-all ${
                      isSelected
                        ? `${opt.bgColor} ${opt.borderColor} ring-1 ring-offset-0 ${opt.borderColor.replace("border-", "ring-")}`
                        : "border-border/70 hover:bg-muted/50"
                    }`}
                  >
                    <opt.icon
                      className={`h-4 w-4 ${isSelected ? opt.color : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-[11px] font-medium ${isSelected ? opt.color : "text-muted-foreground"}`}
                    >
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Deadline */}
          <div className="space-y-1.5">
            <Label htmlFor="task-deadline">
              Hạn chót <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label htmlFor="task-notes">Ghi chú</Label>
            <Textarea
              id="task-notes"
              placeholder="Ghi chú thêm (không bắt buộc)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
            Giao việc
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
