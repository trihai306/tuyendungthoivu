import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Plus,
  Bell,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
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
  Filter,
  X,
} from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WorkerAssignmentStatus = "confirmed" | "pending" | "rejected" | "replaced"
type OrderDispatchStatus = "dispatching" | "fulfilled" | "new" | "shortage"

interface AssignedWorker {
  id: string
  name: string
  phone: string
  status: WorkerAssignmentStatus
  avatar: string
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
// Mock Data
// ---------------------------------------------------------------------------

const INITIAL_ORDERS: DispatchOrder[] = [
  {
    id: "1",
    code: "ORD-024",
    customer: "Cty Thuc pham Viet",
    position: "Phuc vu nha hang",
    shift: "06:00 - 14:00",
    address: "123 Nguyen Hue, Q.1, TP.HCM",
    workersNeeded: 8,
    workersAssigned: 5,
    status: "dispatching",
    assignedWorkers: [
      { id: "w1", name: "Nguyen Van An", phone: "0901 234 567", status: "confirmed", avatar: "NA" },
      { id: "w2", name: "Tran Thi Bich", phone: "0902 345 678", status: "confirmed", avatar: "TB" },
      { id: "w3", name: "Le Van Cuong", phone: "0903 456 789", status: "pending", avatar: "LC" },
      { id: "w4", name: "Pham Thi Dao", phone: "0904 567 890", status: "confirmed", avatar: "PD" },
      { id: "w5", name: "Hoang Van Em", phone: "0905 678 901", status: "pending", avatar: "HE" },
    ],
  },
  {
    id: "2",
    code: "ORD-025",
    customer: "Samsung HCMC",
    position: "Cong nhan dong goi",
    shift: "08:00 - 17:00",
    address: "KCN Tan Binh, Q. Tan Phu, TP.HCM",
    workersNeeded: 10,
    workersAssigned: 10,
    status: "fulfilled",
    assignedWorkers: [
      { id: "w6", name: "Vo Thi Phuong", phone: "0906 111 222", status: "confirmed", avatar: "VP" },
      { id: "w7", name: "Bui Van Giang", phone: "0907 222 333", status: "confirmed", avatar: "BG" },
      { id: "w8", name: "Dang Thi Huong", phone: "0908 333 444", status: "confirmed", avatar: "DH" },
      { id: "w9", name: "Nguyen Van Ich", phone: "0909 444 555", status: "confirmed", avatar: "NI" },
      { id: "w10", name: "Tran Van Kha", phone: "0910 555 666", status: "confirmed", avatar: "TK" },
      { id: "w11", name: "Le Thi Loan", phone: "0911 666 777", status: "confirmed", avatar: "LL" },
      { id: "w12", name: "Pham Van Minh", phone: "0912 777 888", status: "confirmed", avatar: "PM" },
      { id: "w13", name: "Hoang Thi Nga", phone: "0913 888 999", status: "confirmed", avatar: "HN" },
      { id: "w14", name: "Vo Van Oanh", phone: "0914 999 000", status: "confirmed", avatar: "VO" },
      { id: "w15", name: "Bui Thi Phuong", phone: "0915 000 111", status: "confirmed", avatar: "BP" },
    ],
  },
  {
    id: "3",
    code: "ORD-026",
    customer: "Galaxy Event",
    position: "Phuc vu su kien",
    shift: "16:00 - 23:00",
    address: "White Palace, 194 Hoang Van Thu, Q.Phu Nhuan",
    workersNeeded: 15,
    workersAssigned: 0,
    status: "new",
    assignedWorkers: [],
  },
  {
    id: "4",
    code: "ORD-027",
    customer: "Lazada Express",
    position: "Boc xep hang hoa",
    shift: "05:00 - 12:00",
    address: "Kho Lazada, Q.9, TP.HCM",
    workersNeeded: 5,
    workersAssigned: 3,
    status: "shortage",
    assignedWorkers: [
      { id: "w16", name: "Nguyen Van Quang", phone: "0916 123 456", status: "confirmed", avatar: "NQ" },
      { id: "w17", name: "Tran Thi Ren", phone: "0917 234 567", status: "rejected", avatar: "TR" },
      { id: "w18", name: "Le Van Son", phone: "0918 345 678", status: "confirmed", avatar: "LS" },
    ],
  },
]

const INITIAL_AVAILABLE_WORKERS: AvailableWorker[] = [
  { id: "a1", name: "Nguyen Minh Tuan", avatar: "NT", skills: ["Phuc vu", "Pha che"], area: "Q.1", rating: 4.8, phone: "0920 111 222" },
  { id: "a2", name: "Tran Thi Uyen", avatar: "TU", skills: ["Boc xep", "Kho van"], area: "Q.9", rating: 4.5, phone: "0921 222 333" },
  { id: "a3", name: "Le Van Vu", avatar: "LV", skills: ["Phuc vu", "Su kien"], area: "Q.3", rating: 4.9, phone: "0922 333 444" },
  { id: "a4", name: "Pham Thi Xuan", avatar: "PX", skills: ["Dong goi", "QC"], area: "Tan Phu", rating: 4.3, phone: "0923 444 555" },
  { id: "a5", name: "Hoang Van Yen", avatar: "HY", skills: ["Phuc vu", "Bartender"], area: "Q.7", rating: 4.7, phone: "0924 555 666" },
  { id: "a6", name: "Vo Thi Dung", avatar: "VD", skills: ["Boc xep"], area: "Q.2", rating: 4.1, phone: "0925 666 777" },
  { id: "a7", name: "Bui Van Bach", avatar: "BB", skills: ["Su kien", "Phuc vu"], area: "Phu Nhuan", rating: 4.6, phone: "0926 777 888" },
  { id: "a8", name: "Dang Thi Cam", avatar: "DC", skills: ["Dong goi", "Boc xep"], area: "Binh Tan", rating: 4.4, phone: "0927 888 999" },
  { id: "a9", name: "Nguyen Van Duc", avatar: "ND", skills: ["Phuc vu"], area: "Q.1", rating: 4.2, phone: "0928 999 000" },
  { id: "a10", name: "Tran Thi Em", avatar: "TE", skills: ["Su kien", "Pha che"], area: "Q.5", rating: 4.8, phone: "0929 000 111" },
  { id: "a11", name: "Le Thi Phuong", avatar: "LP", skills: ["Phuc vu", "Bep"], area: "Q.10", rating: 4.0, phone: "0930 111 222" },
  { id: "a12", name: "Pham Van Gia", avatar: "PG", skills: ["Boc xep", "Lai xe"], area: "Q.12", rating: 4.3, phone: "0931 222 333" },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<OrderDispatchStatus, { label: string; className: string }> = {
  dispatching: { label: "Dang dieu phoi", className: "bg-amber-100 text-amber-700 border-amber-200" },
  fulfilled: { label: "Da du", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  new: { label: "Moi", className: "bg-blue-100 text-blue-700 border-blue-200" },
  shortage: { label: "Thieu nguoi", className: "bg-red-100 text-red-700 border-red-200" },
}

const WORKER_STATUS_CONFIG: Record<WorkerAssignmentStatus, { icon: typeof CheckCircle2; label: string; className: string }> = {
  confirmed: { icon: CheckCircle2, label: "Da xac nhan", className: "text-emerald-600" },
  pending: { icon: CircleDot, label: "Cho xac nhan", className: "text-amber-500" },
  rejected: { icon: XCircle, label: "Tu choi", className: "text-red-500" },
  replaced: { icon: RefreshCw, label: "Thay the", className: "text-blue-500" },
}

const STATUS_CYCLE: WorkerAssignmentStatus[] = ["pending", "confirmed", "rejected"]

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

function computeOrderStatus(order: DispatchOrder): OrderDispatchStatus {
  if (order.assignedWorkers.length === 0) return "new"
  if (order.assignedWorkers.length >= order.workersNeeded) return "fulfilled"
  if (order.assignedWorkers.length < order.workersNeeded && order.assignedWorkers.length > 0) {
    // If fewer than half, shortage; otherwise dispatching
    const ratio = order.assignedWorkers.length / order.workersNeeded
    if (ratio < 0.5) return "shortage"
    return "dispatching"
  }
  return "dispatching"
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

function WorkerStatusIcon({
  status,
  onClick,
}: {
  status: WorkerAssignmentStatus
  onClick?: () => void
}) {
  const config = WORKER_STATUS_CONFIG[status]
  const Icon = config.icon
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <button
            type="button"
            onClick={onClick}
            className="rounded p-0.5 transition-colors hover:bg-muted"
          >
            <Icon className={`h-4 w-4 ${config.className}`} />
          </button>
        </TooltipTrigger>
        <TooltipContent>{config.label} (click de doi)</TooltipContent>
      </Tooltip>
    </TooltipProvider>
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

function OrderCard({
  order,
  onAddWorker,
  onSendNotification,
  onViewOrder,
  onRemoveWorker,
  onToggleWorkerStatus,
}: {
  order: DispatchOrder
  onAddWorker: (orderId: string) => void
  onSendNotification: (order: DispatchOrder) => void
  onViewOrder: (orderId: string) => void
  onRemoveWorker: (orderId: string, worker: AssignedWorker) => void
  onToggleWorkerStatus: (orderId: string, workerId: string) => void
}) {
  const statusCfg = STATUS_CONFIG[order.status]
  const isFulfilled = order.status === "fulfilled"

  return (
    <Card className={`transition-shadow hover:shadow-md ${isFulfilled ? "opacity-75" : ""}`}>
      {/* Order header */}
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

        {/* Meta info row */}
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

        {/* Progress */}
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Can <span className="font-semibold text-foreground">{order.workersNeeded}</span> ung vien
            </span>
            <span className="font-medium">
              {order.workersAssigned < order.workersNeeded ? (
                <span className="text-amber-600">
                  Thieu {order.workersNeeded - order.workersAssigned}
                </span>
              ) : (
                <span className="text-emerald-600">Du nguoi</span>
              )}
            </span>
          </div>
          <ProgressBar assigned={order.workersAssigned} needed={order.workersNeeded} />
        </div>
      </CardHeader>

      <Separator />

      {/* Assigned workers list */}
      <CardContent className="pt-3">
        {order.assignedWorkers.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              Ung vien da phan cong ({order.assignedWorkers.length})
            </p>
            <div className="space-y-1.5">
              {order.assignedWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="group/worker flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="text-[10px]">{worker.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">
                    {worker.name}
                  </span>
                  <WorkerStatusIcon
                    status={worker.status}
                    onClick={() => onToggleWorkerStatus(order.id, worker.id)}
                  />
                  <span className="hidden text-xs text-muted-foreground sm:inline">
                    {worker.phone}
                  </span>
                  <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground sm:hidden" />
                  <button
                    type="button"
                    onClick={() => onRemoveWorker(order.id, worker)}
                    className="rounded p-0.5 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover/worker:opacity-100"
                    title="Bo phan cong"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6 text-center">
            <Users className="mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Chua co worker nao duoc phan cong</p>
            <p className="text-xs text-muted-foreground/70">Nhan &quot;Them ung vien&quot; de bat dau dieu phoi</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" variant="default" className="gap-1.5" onClick={() => onAddWorker(order.id)}>
            <Plus className="h-3.5 w-3.5" />
            Them ung vien
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={() => onSendNotification(order)}>
            <Bell className="h-3.5 w-3.5" />
            Gui thong bao
          </Button>
          <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => onViewOrder(order.id)}>
            <ExternalLink className="h-3.5 w-3.5" />
            Xem yeu cau
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function AvailableWorkerRow({
  worker,
  onAssign,
}: {
  worker: AvailableWorker
  onAssign: (worker: AvailableWorker) => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50">
      <Avatar size="sm">
        <AvatarFallback className="text-[10px]">{worker.avatar}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{worker.name}</p>
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <MapPin className="h-3 w-3" />
            {worker.area}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {worker.rating}
          </span>
        </div>
      </div>

      <div className="hidden flex-wrap gap-1 lg:flex">
        {worker.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-[10px]">
            {skill}
          </Badge>
        ))}
      </div>

      <Button size="sm" variant="outline" className="shrink-0 gap-1" onClick={() => onAssign(worker)}>
        <Plus className="h-3 w-3" />
        <span className="hidden sm:inline">Phan cong</span>
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Dialog: Assign worker to an order (from sidebar "Phan cong" button)
// ---------------------------------------------------------------------------

function AssignWorkerToOrderDialog({
  open,
  onOpenChange,
  worker,
  orders,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  worker: AvailableWorker | null
  orders: DispatchOrder[]
  onConfirm: (workerId: string, orderId: string) => void
}) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")

  // Only show orders that still need workers
  const availableOrders = orders.filter((o) => o.workersAssigned < o.workersNeeded)

  function handleConfirm() {
    if (!worker || !selectedOrderId) return
    onConfirm(worker.id, selectedOrderId)
    setSelectedOrderId("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Phan cong ung vien</DialogTitle>
          <DialogDescription>
            {worker ? (
              <>Phan cong <strong>{worker.name}</strong> vao yeu cau tuyen dung</>
            ) : (
              "Chon yeu cau tuyen dung"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {availableOrders.length > 0 ? (
            availableOrders.map((order) => (
              <label
                key={order.id}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 ${
                  selectedOrderId === order.id ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                }`}
              >
                <input
                  type="radio"
                  name="order-select"
                  value={order.id}
                  checked={selectedOrderId === order.id}
                  onChange={() => setSelectedOrderId(order.id)}
                  className="sr-only"
                />
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    selectedOrderId === order.id ? "border-primary" : "border-muted-foreground/30"
                  }`}
                >
                  {selectedOrderId === order.id && (
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">{order.code}</span>
                    <Badge className={STATUS_CONFIG[order.status].className + " text-[10px]"}>
                      {STATUS_CONFIG[order.status].label}
                    </Badge>
                  </div>
                  <p className="truncate text-sm">{order.customer} - {order.position}</p>
                  <p className="text-xs text-muted-foreground">
                    Can {order.workersNeeded} | Da co {order.workersAssigned} | Thieu {order.workersNeeded - order.workersAssigned}
                  </p>
                </div>
              </label>
            ))
          ) : (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Tat ca yeu cau da du nguoi
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedOrderId || !worker}
          >
            Phan cong
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Dialog: Add worker to order (from order card "Them ung vien" button)
// ---------------------------------------------------------------------------

function AddWorkerToOrderDialog({
  open,
  onOpenChange,
  orderId,
  orders,
  availableWorkers,
  onSelect,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  orderId: string | null
  orders: DispatchOrder[]
  availableWorkers: AvailableWorker[]
  onSelect: (workerId: string, orderId: string) => void
}) {
  const [search, setSearch] = useState("")

  const order = orders.find((o) => o.id === orderId)

  const filtered = availableWorkers.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.skills.some((s) => s.toLowerCase().includes(search.toLowerCase())) ||
    w.area.toLowerCase().includes(search.toLowerCase())
  )

  function handleSelect(workerId: string) {
    if (!orderId) return
    onSelect(workerId, orderId)
    setSearch("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setSearch("") }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Them ung vien</DialogTitle>
          <DialogDescription>
            {order ? (
              <>Chon ung vien cho <strong>{order.code}</strong> - {order.customer}</>
            ) : (
              "Chon ung vien"
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tim theo ten, ky nang, khu vuc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <ScrollArea className="max-h-[300px]">
          <div className="space-y-2">
            {filtered.length > 0 ? (
              filtered.map((worker) => (
                <div
                  key={worker.id}
                  className="flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50"
                >
                  <Avatar size="sm">
                    <AvatarFallback className="text-[10px]">{worker.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{worker.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-0.5">
                        <MapPin className="h-3 w-3" />
                        {worker.area}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {worker.rating}
                      </span>
                      {worker.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px]">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button size="sm" onClick={() => handleSelect(worker.id)}>
                    Chon
                  </Button>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Khong tim thay ung vien phu hop
              </p>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Dong
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function DispatchBoard() {
  const navigate = useNavigate()

  // Mutable state for orders and available workers
  const [orders, setOrders] = useState<DispatchOrder[]>(INITIAL_ORDERS)
  const [availableWorkers, setAvailableWorkers] = useState<AvailableWorker[]>(INITIAL_AVAILABLE_WORKERS)

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [searchWorker, setSearchWorker] = useState("")

  // Dialog states
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [assignDialogWorker, setAssignDialogWorker] = useState<AvailableWorker | null>(null)

  const [addWorkerDialogOpen, setAddWorkerDialogOpen] = useState(false)
  const [addWorkerOrderId, setAddWorkerOrderId] = useState<string | null>(null)

  const [removeConfirmOpen, setRemoveConfirmOpen] = useState(false)
  const [removeTarget, setRemoveTarget] = useState<{ orderId: string; worker: AssignedWorker } | null>(null)

  // Filter workers in sidebar
  const filteredWorkers = availableWorkers.filter((w) =>
    w.name.toLowerCase().includes(searchWorker.toLowerCase()) ||
    w.skills.some((s) => s.toLowerCase().includes(searchWorker.toLowerCase())) ||
    w.area.toLowerCase().includes(searchWorker.toLowerCase())
  )

  // Reactive stats computed from current state
  const stats = useMemo(() => {
    const ordersNeedDispatch = orders.filter((o) => o.status !== "fulfilled").length
    const totalAssigned = orders.reduce((sum, o) => sum + o.workersAssigned, 0)
    const totalNeeded = orders.reduce((sum, o) => sum + o.workersNeeded, 0)
    const unassignedWorkers = availableWorkers.length
    const completionRate = totalNeeded > 0 ? Math.round((totalAssigned / totalNeeded) * 100) : 0
    return { ordersNeedDispatch, totalAssigned, totalNeeded, unassignedWorkers, completionRate }
  }, [orders, availableWorkers])

  // -----------------------------------------------------------------------
  // Core action: assign a worker (from available) to an order
  // -----------------------------------------------------------------------
  function assignWorkerToOrder(workerId: string, orderId: string) {
    const worker = availableWorkers.find((w) => w.id === workerId)
    if (!worker) return

    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    const assignedWorker: AssignedWorker = {
      id: worker.id,
      name: worker.name,
      phone: worker.phone,
      status: "pending",
      avatar: worker.avatar,
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const updated = {
          ...o,
          assignedWorkers: [...o.assignedWorkers, assignedWorker],
          workersAssigned: o.workersAssigned + 1,
        }
        updated.status = computeOrderStatus(updated)
        return updated
      })
    )

    setAvailableWorkers((prev) => prev.filter((w) => w.id !== workerId))

    toast.success(`Da phan cong ${worker.name} vao ${order.code}`)
  }

  // -----------------------------------------------------------------------
  // Remove worker from assignment
  // -----------------------------------------------------------------------
  function removeWorkerFromOrder(orderId: string, worker: AssignedWorker) {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    // Move worker back to available list
    const returnedWorker: AvailableWorker = {
      id: worker.id,
      name: worker.name,
      avatar: worker.avatar,
      skills: [],
      area: "",
      rating: 0,
      phone: worker.phone,
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        const updated = {
          ...o,
          assignedWorkers: o.assignedWorkers.filter((w) => w.id !== worker.id),
          workersAssigned: Math.max(0, o.workersAssigned - 1),
        }
        updated.status = computeOrderStatus(updated)
        return updated
      })
    )

    setAvailableWorkers((prev) => [...prev, returnedWorker])

    toast.success(`Da bo phan cong ${worker.name} khoi ${order.code}`)
  }

  // -----------------------------------------------------------------------
  // Toggle worker assignment status
  // -----------------------------------------------------------------------
  function toggleWorkerStatus(orderId: string, workerId: string) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o
        return {
          ...o,
          assignedWorkers: o.assignedWorkers.map((w) => {
            if (w.id !== workerId) return w
            const currentIdx = STATUS_CYCLE.indexOf(w.status)
            const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % STATUS_CYCLE.length
            const newStatus = STATUS_CYCLE[nextIdx]
            toast.success(`Da doi trang thai ${w.name} sang ${WORKER_STATUS_CONFIG[newStatus].label}`)
            return { ...w, status: newStatus }
          }),
        }
      })
    )
  }

  // -----------------------------------------------------------------------
  // Sidebar: open assign dialog for a worker
  // -----------------------------------------------------------------------
  function handleSidebarAssign(worker: AvailableWorker) {
    setAssignDialogWorker(worker)
    setAssignDialogOpen(true)
  }

  // -----------------------------------------------------------------------
  // Order card: open add worker dialog
  // -----------------------------------------------------------------------
  function handleAddWorkerToOrder(orderId: string) {
    setAddWorkerOrderId(orderId)
    setAddWorkerDialogOpen(true)
  }

  // -----------------------------------------------------------------------
  // Order card: send notification
  // -----------------------------------------------------------------------
  function handleSendNotification(order: DispatchOrder) {
    const count = order.assignedWorkers.length
    if (count === 0) {
      toast.error(`${order.code} chua co ung vien nao de gui thong bao`)
      return
    }
    toast.success(`Da gui thong bao den ${count} ung vien cua ${order.code}`)
  }

  // -----------------------------------------------------------------------
  // Order card: view order detail
  // -----------------------------------------------------------------------
  function handleViewOrder(orderId: string) {
    navigate(`/orders/${orderId}`)
  }

  // -----------------------------------------------------------------------
  // Order card: remove worker (with confirm)
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
  // Header: create dispatch button
  // -----------------------------------------------------------------------
  function handleCreateDispatch() {
    toast.info("Vui long chon ung vien tu danh sach ben phai va phan cong vao yeu cau")
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

  return (
    <div className="space-y-6">
      {/* ----------------------------------------------------------------- */}
      {/* Header                                                            */}
      {/* ----------------------------------------------------------------- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dieu phoi nhan su</h1>
          <p className="text-muted-foreground">
            Quan ly phan cong va dieu phoi ung vien cho cac yeu cau tuyen dung
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date navigator */}
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

          <Button className="gap-1.5" onClick={handleCreateDispatch}>
            <Plus className="h-4 w-4" />
            Tao phan cong
          </Button>
        </div>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Stats row                                                         */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          title="YCTD can dieu phoi"
          value={stats.ordersNeedDispatch}
          icon={Package}
          color="text-amber-600"
          bgColor="bg-amber-50"
        />
        <StatCard
          title="Ung vien da phan cong"
          value={stats.totalAssigned}
          icon={UserCheck}
          color="text-emerald-600"
          bgColor="bg-emerald-50"
        />
        <StatCard
          title="Ung vien chua phan cong"
          value={stats.unassignedWorkers}
          icon={UserX}
          color="text-red-600"
          bgColor="bg-red-50"
        />
        <StatCard
          title="Ty le hoan thanh"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Main content: Orders + Available workers                           */}
      {/* ----------------------------------------------------------------- */}
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Orders column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Yeu cau hom nay
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({orders.length} don)
              </span>
            </h2>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="h-3.5 w-3.5" />
              Loc
            </Button>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAddWorker={handleAddWorkerToOrder}
                onSendNotification={handleSendNotification}
                onViewOrder={handleViewOrder}
                onRemoveWorker={handleRemoveWorker}
                onToggleWorkerStatus={toggleWorkerStatus}
              />
            ))}
          </div>
        </div>

        {/* Available workers sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Ung vien san sang
                  <Badge variant="secondary">{filteredWorkers.length}</Badge>
                </CardTitle>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tim theo ten, ky nang, khu vuc..."
                  value={searchWorker}
                  onChange={(e) => setSearchWorker(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px]">
                <div className="space-y-2 p-4">
                  {filteredWorkers.length > 0 ? (
                    filteredWorkers.map((worker) => (
                      <AvailableWorkerRow
                        key={worker.id}
                        worker={worker}
                        onAssign={handleSidebarAssign}
                      />
                    ))
                  ) : (
                    <div className="flex flex-col items-center py-8 text-center">
                      <Search className="mb-2 h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        Khong tim thay worker phu hop
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
      {/* Dialogs                                                           */}
      {/* ----------------------------------------------------------------- */}

      {/* Dialog: Assign worker from sidebar to an order */}
      <AssignWorkerToOrderDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        worker={assignDialogWorker}
        orders={orders}
        onConfirm={assignWorkerToOrder}
      />

      {/* Dialog: Add worker to a specific order */}
      <AddWorkerToOrderDialog
        open={addWorkerDialogOpen}
        onOpenChange={setAddWorkerDialogOpen}
        orderId={addWorkerOrderId}
        orders={orders}
        availableWorkers={availableWorkers}
        onSelect={assignWorkerToOrder}
      />

      {/* AlertDialog: Confirm remove worker */}
      <AlertDialog open={removeConfirmOpen} onOpenChange={setRemoveConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bo phan cong</AlertDialogTitle>
            <AlertDialogDescription>
              {removeTarget ? (
                <>
                  Ban co chac muon bo phan cong <strong>{removeTarget.worker.name}</strong> khoi{" "}
                  <strong>{orders.find((o) => o.id === removeTarget.orderId)?.code}</strong>?
                </>
              ) : (
                "Xac nhan bo phan cong?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Huy</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmRemoveWorker}>
              Bo phan cong
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
