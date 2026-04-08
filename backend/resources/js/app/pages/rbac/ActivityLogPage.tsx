import { useState } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  type LucideIcon,
} from "lucide-react"
import type { ActivityAction } from "@/types/rbac"

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

// Mock activity log data
interface ActivityEntry {
  id: string
  user: {
    name: string
    initials: string
    role: string
    avatarBg: string
  }
  action: ActivityAction
  description: string
  ip_address: string
  created_at: string
}

const mockActivities: ActivityEntry[] = [
  {
    id: "1",
    user: { name: "Nguyễn Văn A", initials: "NA", role: "Super Admin", avatarBg: "from-purple-400 to-purple-600" },
    action: "login",
    description: "Đăng nhập vào hệ thống",
    ip_address: "192.168.1.10",
    created_at: "Hôm nay, 08:30",
  },
  {
    id: "2",
    user: { name: "Trần Thị B", initials: "TB", role: "Admin", avatarBg: "from-red-400 to-red-600" },
    action: "create",
    description: "Tạo tin tuyển dụng \"Kỹ sư phần mềm Senior\"",
    ip_address: "192.168.1.15",
    created_at: "Hôm nay, 09:15",
  },
  {
    id: "3",
    user: { name: "Lê Hoàng C", initials: "LC", role: "Quản lý", avatarBg: "from-blue-400 to-blue-600" },
    action: "approve",
    description: "Duyệt hồ sơ ứng viên Phạm Minh Tuấn",
    ip_address: "192.168.1.22",
    created_at: "Hôm nay, 09:45",
  },
  {
    id: "4",
    user: { name: "Phạm Thị D", initials: "PD", role: "Tuyển dụng viên", avatarBg: "from-emerald-400 to-emerald-600" },
    action: "update",
    description: "Cập nhật thông tin nhà trọ \"Phòng trọ Quận 7 - Khu A\"",
    ip_address: "192.168.1.33",
    created_at: "Hôm nay, 10:00",
  },
  {
    id: "5",
    user: { name: "Hoàng Văn E", initials: "HE", role: "Điều phối viên", avatarBg: "from-amber-400 to-amber-600" },
    action: "assign",
    description: "Giao phỏng vấn ứng viên Nguyễn Thị Mai cho Trần Thị B",
    ip_address: "192.168.1.41",
    created_at: "Hôm nay, 10:30",
  },
  {
    id: "6",
    user: { name: "Nguyễn Văn A", initials: "NA", role: "Super Admin", avatarBg: "from-purple-400 to-purple-600" },
    action: "delete",
    description: "Xóa tin tuyển dụng hết hạn \"Nhân viên kho bãi\"",
    ip_address: "192.168.1.10",
    created_at: "Hôm nay, 11:00",
  },
  {
    id: "7",
    user: { name: "Vũ Thị F", initials: "VF", role: "Tuyển dụng viên", avatarBg: "from-pink-400 to-pink-600" },
    action: "create",
    description: "Tạo lịch phỏng vấn cho vị trí \"Kế toán trưởng\"",
    ip_address: "192.168.1.50",
    created_at: "Hôm nay, 11:30",
  },
  {
    id: "8",
    user: { name: "Trần Thị B", initials: "TB", role: "Admin", avatarBg: "from-red-400 to-red-600" },
    action: "update",
    description: "Cập nhật vai trò của Hoàng Văn E thành Điều phối viên",
    ip_address: "192.168.1.15",
    created_at: "Hôm nay, 13:00",
  },
  {
    id: "9",
    user: { name: "Đỗ Minh G", initials: "DG", role: "Quản lý", avatarBg: "from-cyan-400 to-cyan-600" },
    action: "approve",
    description: "Duyệt tin tuyển dụng \"Trưởng phòng kinh doanh\"",
    ip_address: "192.168.1.60",
    created_at: "Hôm nay, 13:30",
  },
  {
    id: "10",
    user: { name: "Lê Hoàng C", initials: "LC", role: "Quản lý", avatarBg: "from-blue-400 to-blue-600" },
    action: "assign",
    description: "Giao nhiệm vụ xác minh doanh nghiệp ABC cho Vũ Thị F",
    ip_address: "192.168.1.22",
    created_at: "Hôm nay, 14:00",
  },
  {
    id: "11",
    user: { name: "Phạm Thị D", initials: "PD", role: "Tuyển dụng viên", avatarBg: "from-emerald-400 to-emerald-600" },
    action: "create",
    description: "Thêm ứng viên mới Lê Văn Hùng vào hệ thống",
    ip_address: "192.168.1.33",
    created_at: "Hôm nay, 14:30",
  },
  {
    id: "12",
    user: { name: "Hoàng Văn E", initials: "HE", role: "Điều phối viên", avatarBg: "from-amber-400 to-amber-600" },
    action: "login",
    description: "Đăng nhập vào hệ thống từ thiết bị di động",
    ip_address: "10.0.0.5",
    created_at: "Hôm nay, 15:00",
  },
  {
    id: "13",
    user: { name: "Nguyễn Văn A", initials: "NA", role: "Super Admin", avatarBg: "from-purple-400 to-purple-600" },
    action: "update",
    description: "Cập nhật cấu hình thông báo email hệ thống",
    ip_address: "192.168.1.10",
    created_at: "Hôm nay, 15:30",
  },
  {
    id: "14",
    user: { name: "Vũ Thị F", initials: "VF", role: "Tuyển dụng viên", avatarBg: "from-pink-400 to-pink-600" },
    action: "delete",
    description: "Xóa hồ sơ ứng viên trùng lặp Trần Văn K",
    ip_address: "192.168.1.50",
    created_at: "Hôm nay, 16:00",
  },
  {
    id: "15",
    user: { name: "Đỗ Minh G", initials: "DG", role: "Quản lý", avatarBg: "from-cyan-400 to-cyan-600" },
    action: "approve",
    description: "Duyệt yêu cầu cấp quyền truy cập cho nhân viên mới",
    ip_address: "192.168.1.60",
    created_at: "Hôm nay, 16:30",
  },
]

const userOptions = [
  { value: "all", label: "Tất cả người dùng" },
  { value: "nguyen-van-a", label: "Nguyễn Văn A" },
  { value: "tran-thi-b", label: "Trần Thị B" },
  { value: "le-hoang-c", label: "Lê Hoàng C" },
  { value: "pham-thi-d", label: "Phạm Thị D" },
  { value: "hoang-van-e", label: "Hoàng Văn E" },
  { value: "vu-thi-f", label: "Vũ Thị F" },
  { value: "do-minh-g", label: "Đỗ Minh G" },
]

const actionOptions = [
  { value: "all", label: "Tất cả hành động" },
  { value: "login", label: "Đăng nhập" },
  { value: "create", label: "Tạo mới" },
  { value: "update", label: "Chỉnh sửa" },
  { value: "delete", label: "Xóa" },
  { value: "approve", label: "Duyệt" },
  { value: "assign", label: "Giao việc" },
]

const ITEMS_PER_PAGE = 8

export function ActivityLogPage() {
  const [selectedUser, setSelectedUser] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)

  // Filter activities
  const filteredActivities = mockActivities.filter((activity) => {
    if (selectedAction !== "all" && activity.action !== selectedAction) return false
    if (selectedUser !== "all") {
      const userSlug = activity.user.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, "-")
      if (userSlug !== selectedUser) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filteredActivities.length / ITEMS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedActivities = filteredActivities.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  )

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
              <Select value={selectedUser} onValueChange={(val) => { setSelectedUser(val); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-52 text-[13px]">
                  <SelectValue placeholder="Chọn người dùng" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
                setSelectedUser("all")
                setSelectedAction("all")
                setCurrentPage(1)
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          {paginatedActivities.length === 0 ? (
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
              {paginatedActivities.map((activity) => {
                const config = actionConfigMap[activity.action]
                const ActionIcon = config.icon
                return (
                  <div
                    key={activity.id}
                    className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/30"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <Avatar className="h-9 w-9 shadow-sm">
                        <AvatarFallback
                          className={`bg-gradient-to-br ${activity.user.avatarBg} text-[10px] font-semibold text-white`}
                        >
                          {activity.user.initials}
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
                          {activity.user.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="rounded-md text-[10px] font-medium"
                        >
                          {activity.user.role}
                        </Badge>
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
                        <span className="text-[10px] text-muted-foreground/40">
                          IP: {activity.ip_address}
                        </span>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-[12px] text-muted-foreground">
            Hiển thị {(safePage - 1) * ITEMS_PER_PAGE + 1}-
            {Math.min(safePage * ITEMS_PER_PAGE, filteredActivities.length)} trong{" "}
            {filteredActivities.length} hoạt động
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  text="Trước"
                  onClick={() => setCurrentPage(Math.max(1, safePage - 1))}
                  className={safePage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === safePage}
                    onClick={() => setCurrentPage(page)}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  text="Sau"
                  onClick={() => setCurrentPage(Math.min(totalPages, safePage + 1))}
                  className={safePage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
