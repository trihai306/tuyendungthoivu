import { useState, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { usePermissions } from "@/hooks/use-permissions"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Plus,
  Bell,
  ExternalLink,
  MapPin,
  Clock,
  Star,
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  CircleDot,
  XCircle,
  RefreshCw,
  Package,
  Sparkles,
  X,
  Zap,
  ChevronDown,
  Loader2,
} from "lucide-react"

// API hooks
import { useStaffingOrders } from "@/hooks/use-staffing-orders"
import {
  useWorkersNew,
} from "@/hooks/use-workers-new"
import {
  useCreateAssignment,
  useBulkAssign,
  useRemoveAssignment,
  useUpdateAssignmentStatus,
} from "@/hooks/use-assignments"
import type {
  StaffingOrder,
  Assignment,
  WorkerNew,
  AssignmentStatus,
} from "@/types"

// ---------------------------------------------------------------------------
// Types (UI-only shapes, mapped from API data)
// ---------------------------------------------------------------------------

type WorkerAssignmentStatus = "confirmed" | "pending" | "rejected" | "replaced"
type OrderDispatchStatus = "dispatching" | "fulfilled" | "new" | "shortage"
type StatusFilter = OrderDispatchStatus | "all"

interface AssignedWorker {
  id: string          // assignment id
  workerId: string    // worker profile id
  name: string
  phone: string
  status: WorkerAssignmentStatus
  avatar: string
  assignmentStatus: AssignmentStatus // raw API status for mutations
}

interface DispatchOrder {
  id: string
  code: string
  customer: string
  position: string
  shift: string
  address: string
  workersNeeded: number
  workersAssigned: number
  status: OrderDispatchStatus
  assignedWorkers: AssignedWorker[]
}

interface AvailableWorker {
  id: string
  name: string
  avatar: string
  skills: string[]
  area: string
  rating: number
  phone: string
}

// ---------------------------------------------------------------------------
// Skill-matching keywords map: position keywords -> worker skill keywords
// ---------------------------------------------------------------------------

const SKILL_MATCH_MAP: Record<string, string[]> = {
  "phục vụ": ["phục vụ", "bartender", "pha chế", "bếp"],
  "sự kiện": ["sự kiện", "phục vụ", "pha chế"],
  "đóng gói": ["đóng gói", "qc"],
  "bốc xếp": ["bốc xếp", "kho vận", "lái xe"],
  "công nhân": ["đóng gói", "qc", "bốc xếp"],
}

function getMatchingSkills(position: string): string[] {
  const posLower = position.toLowerCase()
  for (const [keyword, skills] of Object.entries(SKILL_MATCH_MAP)) {
    if (posLower.includes(keyword)) return skills
  }
  return []
}

function workerMatchesPosition(worker: AvailableWorker, position: string): boolean {
  const matchSkills = getMatchingSkills(position)
  if (matchSkills.length === 0) return false
  return worker.skills.some((s) => s && matchSkills.includes(s.toLowerCase()))
}

// ---------------------------------------------------------------------------
// Data mapping helpers (API -> UI shapes)
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/** Map Assignment API status to simplified UI status */
function mapAssignmentStatus(status: AssignmentStatus): WorkerAssignmentStatus {
  switch (status) {
    case "confirmed":
    case "working":
    case "completed":
      return "confirmed"
    case "rejected":
    case "cancelled":
    case "no_contact":
      return "rejected"
    case "replaced":
      return "replaced"
    default: // created, contacted
      return "pending"
  }
}

/** Map StaffingOrder to UI OrderDispatchStatus */
function computeOrderDispatchStatus(order: StaffingOrder): OrderDispatchStatus {
  if (order.status === "filled" || order.status === "completed") return "fulfilled"
  if (order.quantity_filled === 0 && (!order.assignments || order.assignments.length === 0)) return "new"
  if (order.quantity_filled >= order.quantity_needed) return "fulfilled"
  const ratio = order.quantity_filled / order.quantity_needed
  if (ratio < 0.5) return "shortage"
  return "dispatching"
}

/** Map a StaffingOrder + its assignments to a DispatchOrder */
function mapOrderToDispatch(order: StaffingOrder): DispatchOrder {
  const assignments = order.assignments ?? []
  // Only count active (non-cancelled/rejected) assignments
  const activeAssignments = assignments.filter(
    (a) => !["rejected", "cancelled", "no_contact", "replaced"].includes(a.status)
  )

  const assignedWorkers: AssignedWorker[] = assignments.map((a) => ({
    id: a.id,
    workerId: a.worker_id,
    name: a.worker?.full_name ?? `Worker #${a.worker_id}`,
    phone: a.worker?.phone ?? "",
    status: mapAssignmentStatus(a.status),
    avatar: a.worker ? getInitials(a.worker.full_name) : "?",
    assignmentStatus: a.status,
  }))

  const shift = order.start_time && order.end_time
    ? `${order.start_time.slice(0, 5)} - ${order.end_time.slice(0, 5)}`
    : "Chưa xác định"

  return {
    id: order.id,
    code: order.order_code,
    customer: order.client?.company_name ?? "Khách hàng",
    position: order.position_name,
    shift,
    address: order.work_address ?? "Chưa xác định",
    workersNeeded: order.quantity_needed,
    workersAssigned: activeAssignments.length,
    status: computeOrderDispatchStatus(order),
    assignedWorkers,
  }
}

/** Map WorkerNew to AvailableWorker */
function mapWorkerToAvailable(worker: WorkerNew): AvailableWorker {
  return {
    id: worker.id,
    name: worker.full_name,
    avatar: getInitials(worker.full_name),
    skills: worker.skills?.map((s) => s.skill_name).filter(Boolean) ?? [],
    area: worker.district ?? worker.city ?? "",
    rating: Number(worker.average_rating) || 0,
    phone: worker.phone ?? "",
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<OrderDispatchStatus, { label: string; className: string; dotColor: string }> = {
  new: { label: "Mới", className: "bg-blue-100 text-blue-700 border-blue-200", dotColor: "bg-blue-500" },
  dispatching: { label: "Đang điều phối", className: "bg-amber-100 text-amber-700 border-amber-200", dotColor: "bg-amber-500" },
  shortage: { label: "Thiếu người", className: "bg-red-100 text-red-700 border-red-200", dotColor: "bg-red-500" },
  fulfilled: { label: "Đã đủ", className: "bg-emerald-100 text-emerald-700 border-emerald-200", dotColor: "bg-emerald-500" },
}

const WORKER_STATUS_CONFIG: Record<WorkerAssignmentStatus, { icon: typeof CheckCircle2; label: string; className: string; bgClass: string }> = {
  confirmed: { icon: CheckCircle2, label: "Đã xác nhận", className: "text-emerald-600", bgClass: "border-l-emerald-500" },
  pending: { icon: CircleDot, label: "Chờ xác nhận", className: "text-amber-500", bgClass: "border-l-amber-400" },
  rejected: { icon: XCircle, label: "Từ chối", className: "text-red-500", bgClass: "border-l-red-400" },
  replaced: { icon: RefreshCw, label: "Thay thế", className: "text-blue-500", bgClass: "border-l-blue-400" },
}

/** Map UI status cycle to API assignment statuses */
const STATUS_CYCLE_API: AssignmentStatus[] = ["created", "confirmed", "rejected"]

const FILTER_TABS: { value: StatusFilter; label: string; icon?: typeof Package }[] = [
  { value: "all", label: "Tất cả" },
  { value: "new", label: "Mới" },
  { value: "dispatching", label: "Đang điều phối" },
  { value: "shortage", label: "Thiếu người" },
  { value: "fulfilled", label: "Đã đủ" },
]

function getProgressColor(assigned: number, needed: number): string {
  const ratio = assigned / needed
  if (ratio >= 1) return "bg-emerald-500"
  if (ratio >= 0.5) return "bg-amber-500"
  return "bg-red-500"
}

function formatDate(date: Date): string {
  const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
  const day = days[date.getDay()]
  return `${day}, ${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
}: {
  title: string
  value: string | number
  icon: typeof Users
  color: string
  bgColor: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProgressBar({ assigned, needed }: { assigned: number; needed: number }) {
  const percentage = needed > 0 ? Math.min((assigned / needed) * 100, 100) : 0
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(assigned, needed)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {assigned}/{needed}
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// OrderCard - improved with quick-assign dropdown & better worker status
// ---------------------------------------------------------------------------

function OrderCard({
  order,
  isActive,
  onSelect,
  onSendNotification,
  onViewOrder,
  onRemoveWorker,
  onToggleWorkerStatus,
  availableWorkers,
  onQuickAssign,
  can,
  isAssigning,
}: {
  order: DispatchOrder
  isActive: boolean
  onSelect: (orderId: string) => void
  onSendNotification: (order: DispatchOrder) => void
  onViewOrder: (orderId: string) => void
  onRemoveWorker: (orderId: string, worker: AssignedWorker) => void
  onToggleWorkerStatus: (orderId: string, worker: AssignedWorker) => void
  availableWorkers: AvailableWorker[]
  onQuickAssign: (workerId: string, orderId: string) => void
  can: (permission: string) => boolean
  isAssigning: boolean
}) {
  const statusCfg = STATUS_CONFIG[order.status]
  const isFulfilled = order.status === "fulfilled"
  const suggestedWorkers = availableWorkers.filter((w) => workerMatchesPosition(w, order.position))
  const canAssignMore = order.workersAssigned < order.workersNeeded

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isActive
          ? "ring-2 ring-primary shadow-md"
          : "hover:shadow-md"
      } ${isFulfilled ? "opacity-70" : ""}`}
      onClick={() => onSelect(order.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-semibold text-primary">{order.code}</span>
              <Badge className={statusCfg.className}>{statusCfg.label}</Badge>
            </div>
            <CardTitle className="text-base leading-snug">{order.customer}</CardTitle>
            <p className="text-sm text-muted-foreground">{order.position}</p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {order.shift}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {order.address}
          </span>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Cần <span className="font-semibold text-foreground">{order.workersNeeded}</span> ứng viên
            </span>
            <span className="font-medium">
              {order.workersAssigned < order.workersNeeded ? (
                <span className="text-amber-600">
                  Thiếu {order.workersNeeded - order.workersAssigned}
                </span>
              ) : (
                <span className="text-emerald-600">Đủ người</span>
              )}
            </span>
          </div>
          <ProgressBar assigned={order.workersAssigned} needed={order.workersNeeded} />
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-3">
        {order.assignedWorkers.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Ứng viên đã phân công ({order.assignedWorkers.length})
            </p>
            <div className="space-y-1">
              {order.assignedWorkers.map((worker) => {
                const wCfg = WORKER_STATUS_CONFIG[worker.status]
                const WIcon = wCfg.icon
                return (
                  <div
                    key={worker.id}
                    className={`group/worker flex items-center gap-2 rounded-md border-l-[3px] px-2 py-1.5 transition-colors hover:bg-muted/50 ${wCfg.bgClass}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="text-[10px]">{worker.avatar}</AvatarFallback>
                    </Avatar>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">
                      {worker.name}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => can("assignments.update") && onToggleWorkerStatus(order.id, worker)}
                            className={`rounded p-0.5 transition-colors ${can("assignments.update") ? "hover:bg-muted cursor-pointer" : "cursor-default opacity-60"}`}
                            disabled={!can("assignments.update")}
                          >
                            <WIcon className={`h-4 w-4 ${wCfg.className}`} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>{wCfg.label}{can("assignments.update") ? " (click để đổi)" : ""}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      {worker.phone}
                    </span>
                    {can("assignments.delete") && (
                      <button
                        type="button"
                        onClick={() => onRemoveWorker(order.id, worker)}
                        className="rounded p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover/worker:opacity-100"
                        title="Bỏ phân công"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <Users className="mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Chưa có ứng viên nào</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Quick-assign dropdown: shows top 5 matching workers */}
          {canAssignMore && can("assignments.create") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="gap-1.5" disabled={isAssigning}>
                  {isAssigning ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  Thêm nhanh
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {suggestedWorkers.length > 0 ? (
                  <>
                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                      Gợi ý phù hợp ({suggestedWorkers.length})
                    </div>
                    {suggestedWorkers.slice(0, 5).map((w) => (
                      <DropdownMenuItem
                        key={w.id}
                        onClick={() => onQuickAssign(w.id, order.id)}
                        className="flex items-center gap-2"
                      >
                        <Avatar size="sm">
                          <AvatarFallback className="text-[10px]">{w.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm">{w.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {w.skills.join(", ")} · {w.area}
                          </p>
                        </div>
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs">{w.rating}</span>
                      </DropdownMenuItem>
                    ))}
                    {availableWorkers.filter((w) => !suggestedWorkers.includes(w)).length > 0 && (
                      <>
                        <Separator className="my-1" />
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Khác
                        </div>
                        {availableWorkers
                          .filter((w) => !suggestedWorkers.includes(w))
                          .slice(0, 3)
                          .map((w) => (
                            <DropdownMenuItem
                              key={w.id}
                              onClick={() => onQuickAssign(w.id, order.id)}
                              className="flex items-center gap-2"
                            >
                              <Avatar size="sm">
                                <AvatarFallback className="text-[10px]">{w.avatar}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm">{w.name}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {w.skills.join(", ")} · {w.area}
                                </p>
                              </div>
                            </DropdownMenuItem>
                          ))}
                      </>
                    )}
                  </>
                ) : (
                  availableWorkers.slice(0, 5).map((w) => (
                    <DropdownMenuItem
                      key={w.id}
                      onClick={() => onQuickAssign(w.id, order.id)}
                      className="flex items-center gap-2"
                    >
                      <Avatar size="sm">
                        <AvatarFallback className="text-[10px]">{w.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{w.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {w.skills.join(", ")} · {w.area}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {can("assignments.update") && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onSendNotification(order)}>
              <Bell className="h-3.5 w-3.5" />
              Gửi thông báo
            </Button>
          )}
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => onViewOrder(order.id)}>
            <ExternalLink className="h-3.5 w-3.5" />
            Chi tiết
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// ---------------------------------------------------------------------------
// AvailableWorkerRow - improved with skill match badge, checkbox for multi-select
// ---------------------------------------------------------------------------

function AvailableWorkerRow({
  worker,
  isSelected,
  isMatch,
  onToggleSelect,
  onAssign,
  activeOrderId,
  can,
}: {
  worker: AvailableWorker
  isSelected: boolean
  isMatch: boolean
  onToggleSelect: (id: string) => void
  onAssign: (workerId: string) => void
  activeOrderId: string | null
  can: (permission: string) => boolean
}) {
  return (
    <div
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition-colors ${
        isMatch
          ? "border-primary/40 bg-primary/5"
          : "hover:bg-muted/50"
      } ${isSelected ? "ring-1 ring-primary bg-primary/5" : ""}`}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(worker.id)}
        className="shrink-0"
      />

      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">{worker.avatar}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-medium">{worker.name}</p>
          {isMatch && (
            <Badge variant="default" className="h-4 gap-0.5 px-1 text-[9px]">
              <Zap className="h-2.5 w-2.5" />
              Phù hợp
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="h-3 w-3" />
            {worker.area}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {Number(worker.rating).toFixed(1)}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap gap-1">
          {worker.skills.map((skill, idx) => (
            <Badge key={`${skill}-${idx}`} variant="secondary" className="text-[10px]">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {activeOrderId && can("assignments.create") && (
        <Button
          size="sm"
          variant={isMatch ? "default" : "outline"}
          className="shrink-0 gap-1 px-2"
          onClick={(e) => {
            e.stopPropagation()
            onAssign(worker.id)
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Loading skeleton
// ---------------------------------------------------------------------------

function DispatchBoardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DispatchBoard() {
  const navigate = useNavigate()
  const can = usePermissions()

  // -----------------------------------------------------------------------
  // API hooks - fetch orders (recruiting / in_progress) and available workers
  // -----------------------------------------------------------------------
  const {
    data: ordersData,
    isLoading: ordersLoading,
  } = useStaffingOrders(
    {
      status: "recruiting,in_progress,approved,filled",
      per_page: 50,
      include: "assignments.worker",
    },
    { refetchInterval: 30_000 }, // Auto-refresh every 30s
  )

  const {
    data: workersData,
    isLoading: workersLoading,
  } = useWorkersNew(
    { status: "available", per_page: 100 },
    { refetchInterval: 30_000 },
  )

  // Mutations
  const createAssignment = useCreateAssignment()
  const bulkAssign = useBulkAssign()
  const removeAssignment = useRemoveAssignment()
  const updateAssignmentStatus = useUpdateAssignmentStatus()

  const isAssigning = createAssignment.isPending || bulkAssign.isPending

  // -----------------------------------------------------------------------
  // Map API data to UI shapes
  // -----------------------------------------------------------------------
  const orders: DispatchOrder[] = useMemo(() => {
    if (!ordersData?.data) return []
    return ordersData.data.map(mapOrderToDispatch)
  }, [ordersData])

  const availableWorkers: AvailableWorker[] = useMemo(() => {
    if (!workersData?.data) return []
    return workersData.data.map(mapWorkerToAvailable)
  }, [workersData])

  // -----------------------------------------------------------------------
  // Local UI state
  // -----------------------------------------------------------------------
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchWorker, setSearchWorker] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null)
  const [selectedWorkerIds, setSelectedWorkerIds] = useState<string[]>([])

  // Confirm dialog
  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<{ orderId: string; worker: AssignedWorker } | null>(null)

  // Active order
  const activeOrder = activeOrderId ? orders.find((o) => o.id === activeOrderId) ?? null : null

  // Filtered orders by status
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  // Filter + sort workers: matches first, then by search
  const processedWorkers = useMemo(() => {
    let filtered = availableWorkers.filter((w) =>
      w.name.toLowerCase().includes(searchWorker.toLowerCase()) ||
      w.skills.some((s) => s.toLowerCase().includes(searchWorker.toLowerCase())) ||
      w.area.toLowerCase().includes(searchWorker.toLowerCase())
    )

    if (activeOrder) {
      // Sort: matching workers first, then by rating
      const matches = filtered.filter((w) => workerMatchesPosition(w, activeOrder.position))
      const nonMatches = filtered.filter((w) => !workerMatchesPosition(w, activeOrder.position))
      filtered = [...matches, ...nonMatches]
    }

    return filtered
  }, [availableWorkers, searchWorker, activeOrder])

  const matchCount = activeOrder
    ? processedWorkers.filter((w) => workerMatchesPosition(w, activeOrder.position)).length
    : 0

  // Stats
  const stats = useMemo(() => {
    const ordersNeedDispatch = orders.filter((o) => o.status !== "fulfilled").length
    const totalAssigned = orders.reduce((sum, o) => sum + o.workersAssigned, 0)
    const totalNeeded = orders.reduce((sum, o) => sum + o.workersNeeded, 0)
    const unassignedWorkers = availableWorkers.length
    const completionRate = totalNeeded > 0 ? Math.round((totalAssigned / totalNeeded) * 100) : 0
    return { ordersNeedDispatch, totalAssigned, totalNeeded, unassignedWorkers, completionRate }
  }, [orders, availableWorkers])

  // Filter tab counts
  const statusCounts = useMemo(() => {
    const counts: Record<StatusFilter, number> = { all: orders.length, new: 0, dispatching: 0, shortage: 0, fulfilled: 0 }
    orders.forEach((o) => { counts[o.status]++ })
    return counts
  }, [orders])

  // -----------------------------------------------------------------------
  // Core action: assign worker(s) to order via API
  // -----------------------------------------------------------------------
  const assignWorkerToOrder = useCallback((workerId: string, orderId: string) => {
    createAssignment.mutate(
      { order_id: orderId, worker_id: workerId },
    )
  }, [createAssignment])

  // Bulk assign selected workers to active order
  const bulkAssignToActiveOrder = useCallback(() => {
    if (!activeOrderId || selectedWorkerIds.length === 0) return
    const order = orders.find((o) => o.id === activeOrderId)
    if (!order) return

    const remaining = order.workersNeeded - order.workersAssigned
    const toAssign = selectedWorkerIds.slice(0, remaining)

    bulkAssign.mutate(
      { staffing_order_id: activeOrderId, worker_ids: toAssign },
      {
        onSuccess: () => {
          setSelectedWorkerIds([])
        },
      },
    )
  }, [activeOrderId, selectedWorkerIds, orders, bulkAssign])

  // -----------------------------------------------------------------------
  // Remove worker via API
  // -----------------------------------------------------------------------
  function removeWorkerFromOrder(_orderId: string, worker: AssignedWorker) {
    removeAssignment.mutate(worker.id) // worker.id is assignment id
  }

  // -----------------------------------------------------------------------
  // Toggle worker assignment status via API
  // -----------------------------------------------------------------------
  function toggleWorkerStatus(_orderId: string, worker: AssignedWorker) {
    const currentIdx = STATUS_CYCLE_API.indexOf(worker.assignmentStatus)
    const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % STATUS_CYCLE_API.length
    const newStatus = STATUS_CYCLE_API[nextIdx]

    updateAssignmentStatus.mutate({ id: worker.id, status: newStatus })
  }

  // -----------------------------------------------------------------------
  // Sidebar: toggle worker selection
  // -----------------------------------------------------------------------
  function toggleWorkerSelect(workerId: string) {
    setSelectedWorkerIds((prev) =>
      prev.includes(workerId) ? prev.filter((id) => id !== workerId) : [...prev, workerId]
    )
  }

  // -----------------------------------------------------------------------
  // Direct assign from sidebar (single worker to active order)
  // -----------------------------------------------------------------------
  function handleDirectAssign(workerId: string) {
    if (!activeOrderId) {
      toast.error("Vui lòng chọn một yêu cầu trước")
      return
    }
    assignWorkerToOrder(workerId, activeOrderId)
  }

  // -----------------------------------------------------------------------
  // Select/deselect an order
  // -----------------------------------------------------------------------
  function handleSelectOrder(orderId: string) {
    setActiveOrderId((prev) => (prev === orderId ? null : orderId))
    setSelectedWorkerIds([])
  }

  // -----------------------------------------------------------------------
  // Notification
  // -----------------------------------------------------------------------
  function handleSendNotification(order: DispatchOrder) {
    const count = order.assignedWorkers.length
    if (count === 0) {
      toast.error(`${order.code} chưa có ứng viên nào để gửi thông báo`)
      return
    }
    toast.success(`Đã gửi thông báo đến ${count} ứng viên của ${order.code}`)
  }

  // -----------------------------------------------------------------------
  // Remove worker confirm
  // -----------------------------------------------------------------------
  function handleRemoveWorker(orderId: string, worker: AssignedWorker) {
    setRemoveTarget({ orderId, worker })
    setRemoveConfirmOpen(true)
  }

  function confirmRemoveWorker() {
    if (!removeTarget) return
    removeWorkerFromOrder(removeTarget.orderId, removeTarget.worker)
    setRemoveTarget(null)
    setRemoveConfirmOpen(false)
  }

  // -----------------------------------------------------------------------
  // Date navigation
  // -----------------------------------------------------------------------
  function navigateDate(direction: -1 | 1) {
    setSelectedDate((prev) => {
      const next = new Date(prev)
      next.setDate(next.getDate() + direction)
      return next
    })
  }

  // -----------------------------------------------------------------------
  // Loading state
  // -----------------------------------------------------------------------
  if (ordersLoading && workersLoading) {
    return <DispatchBoardSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Điều phối nhân sự</h1>
          <p className="text-muted-foreground">
            Chọn yêu cầu &rarr; chọn ứng viên phù hợp &rarr; phân công
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center rounded-lg border bg-background">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-r-none px-2"
              onClick={() => navigateDate(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1.5 border-x px-3 py-1.5">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 rounded-l-none px-2"
              onClick={() => navigateDate(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Stats row                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="YCTD cần điều phối"
          value={stats.ordersNeedDispatch}
          icon={Package}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          title="Ứng viên đã phân công"
          value={stats.totalAssigned}
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Ứng viên chưa phân công"
          value={stats.unassignedWorkers}
          icon={UserX}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <StatCard
          title="Tỷ lệ hoàn thành"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Filter tabs                                                       */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTER_TABS.map((tab) => {
          const isActive = statusFilter === tab.value
          const count = statusCounts[tab.value]
          return (
            <Button
              key={tab.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className="gap-1.5"
              onClick={() => setStatusFilter(tab.value)}
            >
              {tab.value !== "all" && (
                <span className={`h-2 w-2 rounded-full ${STATUS_CONFIG[tab.value as OrderDispatchStatus]?.dotColor ?? ""}`} />
              )}
              {tab.label}
              <Badge variant={isActive ? "secondary" : "outline"} className="ml-0.5 h-5 px-1.5 text-[10px]">
                {count}
              </Badge>
            </Button>
          )
        })}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Instruction hint when no order selected                           */}
      {/* ----------------------------------------------------------------- */}
      {!activeOrderId && (
        <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>Chọn một yêu cầu bên trái để xem gợi ý ứng viên phù hợp bên phải</span>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Main content: Orders + Available workers                           */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Orders column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Yêu cầu hôm nay
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredOrders.length} đơn)
              </span>
            </h2>
            {ordersLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                isActive={activeOrderId === order.id}
                onSelect={handleSelectOrder}
                onSendNotification={handleSendNotification}
                onViewOrder={(id) => navigate(`/orders/${id}`)}
                onRemoveWorker={handleRemoveWorker}
                onToggleWorkerStatus={toggleWorkerStatus}
                availableWorkers={availableWorkers}
                onQuickAssign={assignWorkerToOrder}
                can={can}
                isAssigning={isAssigning}
              />
            ))}
            {filteredOrders.length === 0 && !ordersLoading && (
              <div className="flex flex-col items-center py-12 text-center">
                <Package className="mb-2 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">Không có yêu cầu nào ở trạng thái này</p>
              </div>
            )}
          </div>
        </div>

        {/* Available workers sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Ứng viên sẵn sàng
                  <Badge variant="secondary">{processedWorkers.length}</Badge>
                </CardTitle>
                {workersLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              {activeOrder && matchCount > 0 && (
                <p className="mt-1 flex items-center gap-1 text-xs text-primary">
                  <Zap className="h-3 w-3" />
                  {matchCount} ứng viên phù hợp với "{activeOrder.position}"
                </p>
              )}
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, kỹ năng, khu vực..."
                  value={searchWorker}
                  onChange={(e) => setSearchWorker(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>

            <Separator />

            {/* Bulk assign bar */}
            {selectedWorkerIds.length > 0 && activeOrderId && can("assignments.create") && (
              <div className="flex items-center gap-2 border-b bg-primary/5 px-4 py-2">
                <span className="text-xs font-medium text-primary">
                  Đã chọn {selectedWorkerIds.length} ứng viên
                </span>
                <Button
                  size="sm"
                  className="ml-auto h-7 gap-1 px-2 text-xs"
                  onClick={bulkAssignToActiveOrder}
                  disabled={isAssigning}
                >
                  {isAssigning ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                  Phân công tất cả vào {activeOrder?.code}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-1.5"
                  onClick={() => setSelectedWorkerIds([])}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}

            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px]">
                <div className="space-y-2 p-4">
                  {processedWorkers.length > 0 ? (
                    processedWorkers.map((worker) => (
                      <AvailableWorkerRow
                        key={worker.id}
                        worker={worker}
                        isSelected={selectedWorkerIds.includes(worker.id)}
                        isMatch={activeOrder ? workerMatchesPosition(worker, activeOrder.position) : false}
                        onToggleSelect={toggleWorkerSelect}
                        onAssign={handleDirectAssign}
                        activeOrderId={activeOrderId}
                        can={can}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <Search className="mb-2 h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        {workersLoading ? "Đang tải danh sách..." : "Không tìm thấy ứng viên phù hợp"}
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* AlertDialog: Confirm remove worker                                */}
      {/* ----------------------------------------------------------------- */}
      <AlertDialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bỏ phân công</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget ? (
                <>
                  Bạn có chắc muốn bỏ phân công <strong>{removeTarget.worker.name}</strong> khỏi{" "}
                  <strong>{orders.find((o) => o.id === removeTarget.orderId)?.code}</strong>?
                </>
              ) : (
                "Xác nhận bỏ phân công?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmRemoveWorker}
              disabled={removeAssignment.isPending}
            >
              {removeAssignment.isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : null}
              Bỏ phân công
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
