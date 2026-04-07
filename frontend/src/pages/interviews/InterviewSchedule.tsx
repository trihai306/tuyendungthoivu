import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  CalendarDays,
  Plus,
  List,
  CalendarRange,
  Clock,
  Video,
  Phone,
  MapPin,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type InterviewType = "Trực tiếp" | "Online" | "Điện thoại"
type InterviewStatus = "Sắp tới" | "Đang diễn ra" | "Hoàn thành" | "Đã hủy"

interface Interview {
  id: string
  candidateName: string
  candidateInitials: string
  avatarBg: string
  position: string
  company: string
  date: string
  dateLabel: string
  time: string
  type: InterviewType
  status: InterviewStatus
}

const interviewTypeConfig: Record<InterviewType, { icon: LucideIcon; className: string }> = {
  "Trực tiếp": {
    icon: MapPin,
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  "Online": {
    icon: Video,
    className: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  },
  "Điện thoại": {
    icon: Phone,
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
}

const interviewStatusConfig: Record<InterviewStatus, { className: string }> = {
  "Sắp tới": {
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  "Đang diễn ra": {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  "Hoàn thành": {
    className: "bg-gray-50 text-gray-600 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
  "Đã hủy": {
    className: "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
}

const mockInterviews: Interview[] = [
  {
    id: "1",
    candidateName: "Trần Văn Bình",
    candidateInitials: "TB",
    avatarBg: "from-blue-400 to-blue-600",
    position: "Kỹ sư phần mềm",
    company: "Công ty TNHH ABC",
    date: "2026-04-07",
    dateLabel: "Hôm nay - Thứ Ba, 07/04/2026",
    time: "09:00 - 10:00",
    type: "Trực tiếp",
    status: "Sắp tới",
  },
  {
    id: "2",
    candidateName: "Nguyễn Thị Cẩm",
    candidateInitials: "NC",
    avatarBg: "from-violet-400 to-violet-600",
    position: "Nhân viên kế toán",
    company: "Tập đoàn XYZ",
    date: "2026-04-07",
    dateLabel: "Hôm nay - Thứ Ba, 07/04/2026",
    time: "14:00 - 15:00",
    type: "Online",
    status: "Sắp tới",
  },
  {
    id: "3",
    candidateName: "Lê Hoàng Dũng",
    candidateInitials: "LD",
    avatarBg: "from-emerald-400 to-emerald-600",
    position: "Quản lý kho",
    company: "Công ty CP Logistics VN",
    date: "2026-04-08",
    dateLabel: "Ngày mai - Thứ Tư, 08/04/2026",
    time: "10:00 - 11:00",
    type: "Trực tiếp",
    status: "Sắp tới",
  },
  {
    id: "4",
    candidateName: "Phạm Thị Hoa",
    candidateInitials: "PH",
    avatarBg: "from-amber-400 to-amber-600",
    position: "Nhân viên bán hàng",
    company: "Siêu thị BigMart",
    date: "2026-04-08",
    dateLabel: "Ngày mai - Thứ Tư, 08/04/2026",
    time: "15:30 - 16:30",
    type: "Điện thoại",
    status: "Sắp tới",
  },
  {
    id: "5",
    candidateName: "Đặng Minh Tuấn",
    candidateInitials: "DT",
    avatarBg: "from-cyan-400 to-cyan-600",
    position: "Thợ điện công nghiệp",
    company: "Nhà máy Thành Công",
    date: "2026-04-09",
    dateLabel: "Thứ Năm, 09/04/2026",
    time: "09:30 - 10:30",
    type: "Trực tiếp",
    status: "Sắp tới",
  },
  {
    id: "6",
    candidateName: "Vũ Thị Lan",
    candidateInitials: "VL",
    avatarBg: "from-pink-400 to-pink-600",
    position: "Nhân viên may",
    company: "Công ty May Việt Tiến",
    date: "2026-04-09",
    dateLabel: "Thứ Năm, 09/04/2026",
    time: "13:00 - 14:00",
    type: "Online",
    status: "Sắp tới",
  },
]

// Group interviews by dateLabel
function groupByDate(interviews: Interview[]): Map<string, Interview[]> {
  const groups = new Map<string, Interview[]>()
  for (const interview of interviews) {
    const existing = groups.get(interview.dateLabel)
    if (existing) {
      existing.push(interview)
    } else {
      groups.set(interview.dateLabel, [interview])
    }
  }
  return groups
}

export function InterviewSchedule() {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list")
  const grouped = groupByDate(mockInterviews)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Lịch trình
              </span>
            </div>
            <h1 className="text-xl font-semibold">Lịch phỏng vấn</h1>
            <p className="mt-1 text-sm text-white/70">
              Bạn có <span className="font-medium text-white">{mockInterviews.length} buổi phỏng vấn</span> được lên lịch trong tuần này
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Tạo lịch mới
            </Button>
          </div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("list")}
        >
          <List className="mr-1.5 h-3.5 w-3.5" />
          Danh sách
        </Button>
        <Button
          variant={viewMode === "calendar" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("calendar")}
        >
          <CalendarRange className="mr-1.5 h-3.5 w-3.5" />
          Lịch
        </Button>
      </div>

      {/* List view */}
      {viewMode === "list" ? (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([dateLabel, interviews]) => (
            <div key={dateLabel}>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                  <CalendarDays className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{dateLabel}</h3>
                  <p className="text-[11px] text-muted-foreground">
                    {interviews.length} buổi phỏng vấn
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {interviews.map((interview) => {
                  const typeConfig = interviewTypeConfig[interview.type]
                  const statusCfg = interviewStatusConfig[interview.status]
                  const TypeIcon = typeConfig.icon
                  return (
                    <Card
                      key={interview.id}
                      className="group border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Time block */}
                          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/60 px-3 py-2 text-center">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs font-semibold tabular-nums text-foreground">
                              {interview.time.split(" - ")[0]}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {interview.time.split(" - ")[1]}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7 shadow-sm">
                                <AvatarFallback
                                  className={`bg-gradient-to-br ${interview.avatarBg} text-[9px] font-semibold text-white`}
                                >
                                  {interview.candidateInitials}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate text-[13px] font-medium leading-snug">
                                  {interview.candidateName}
                                </p>
                                <p className="truncate text-[11px] text-muted-foreground">
                                  {interview.position}
                                </p>
                              </div>
                            </div>

                            <p className="mt-2 text-[11px] text-muted-foreground">
                              {interview.company}
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                              <Badge
                                variant="outline"
                                className={`rounded-md text-[10px] font-medium ${typeConfig.className}`}
                              >
                                <TypeIcon className="mr-0.5 h-2.5 w-2.5" />
                                {interview.type}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`rounded-md text-[10px] font-medium ${statusCfg.className}`}
                              >
                                {interview.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar view - placeholder */
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              Chế độ xem lịch
            </h3>
            <p className="mt-1 max-w-sm text-center text-xs text-muted-foreground">
              Tính năng xem lịch dạng calendar đang được phát triển. Vui lòng sử dụng chế độ xem danh sách.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
