import { useState, useMemo, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth-store"
import { hasPermission } from "@/types/user"
import { useClients, useDeleteClient } from "@/hooks/use-clients"
import type { Client, ClientStatus } from "@/types/staffing"
import type { ClientFilter } from "@/services/clients.service"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SortableHeader } from "@/components/ui/sortable-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  Search,
  Building2,
  Users,
  Plus,
  LayoutGrid,
  List,
  MoreHorizontal,
  Eye,
  Pencil,
  FileText,
  Phone,
  TrendingUp,
  ShoppingCart,
  DollarSign,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"

// --- Helpers ---

const industries = ["Tất cả", "Sản xuất", "F&B", "Sự kiện", "Logistics", "Khác"]

const statusLabels = ["Tất cả", "Đang hợp tác", "Tiềm năng", "Ngừng hợp tác"] as const

const statusLabelToValue: Record<string, string | undefined> = {
  "Đang hợp tác": "active",
  "Tiềm năng": "prospect",
  "Ngừng hợp tác": "inactive",
}

const industryColors: Record<string, string> = {
  "Sản xuất": "bg-orange-50 text-orange-700 border-orange-200/80",
  "F&B": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Sự kiện": "bg-violet-50 text-violet-700 border-violet-200/80",
  "Logistics": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Khác": "bg-gray-50 text-gray-700 border-gray-200/80",
}

const statusConfig: Record<ClientStatus, { label: string; className: string }> = {
  active: { label: "Đang hợp tác", className: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  inactive: { label: "Ngừng hợp tác", className: "bg-gray-50 text-gray-600 border-gray-200/80" },
  prospect: { label: "Tiềm năng", className: "bg-blue-50 text-blue-700 border-blue-200/80" },
}

const avatarColors = [
  "from-orange-400 to-orange-600",
  "from-red-400 to-red-600",
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-cyan-400 to-cyan-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-pink-400 to-pink-600",
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

function formatAddress(client: Client): string {
  return [client.address, client.district, client.city].filter(Boolean).join(", ")
}

// --- Stats ---

const baseStats = [
  { label: "Tổng khách hàng", icon: Building2, color: "text-blue-600", bg: "bg-blue-50", permission: "" },
  { label: "Đang hợp tác", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", permission: "" },
  { label: "YCTD tháng này", icon: ShoppingCart, color: "text-violet-600", bg: "bg-violet-50", permission: "" },
  { label: "Doanh thu tháng", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50", permission: "revenue.view" },
]

// --- Skeleton components ---

function StatsSkeletons() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function GridSkeletons() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="border-border/50 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start gap-3.5">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="mt-3 h-3 w-40" />
            <div className="mt-4 border-t border-border/50 pt-3.5">
              <Skeleton className="h-8 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function TableSkeletons() {
  return (
    <Card className="border-border/50 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Công ty</TableHead>
            <TableHead>Ngành nghề</TableHead>
            <TableHead className="text-center">Đơn hàng</TableHead>
            <TableHead>Liên hệ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-5 w-16" /></TableCell>
              <TableCell className="text-center"><Skeleton className="mx-auto h-4 w-6" /></TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-5 w-20" /></TableCell>
              <TableCell><Skeleton className="h-7 w-7" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}

// --- Pagination ---

function PaginationBar({
  page,
  lastPage,
  total,
  from,
  to,
  onPageChange,
}: {
  page: number
  lastPage: number
  total: number
  from: number | null
  to: number | null
  onPageChange: (p: number) => void
}) {
  if (lastPage <= 1) return null

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Hiển thị{" "}
        <span className="font-medium text-foreground">{from ?? 0}</span> -{" "}
        <span className="font-medium text-foreground">{to ?? 0}</span> / {total} khách hàng
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Trước
        </Button>
        <span className="px-3 text-sm text-muted-foreground">
          {page} / {lastPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= lastPage}
          onClick={() => onPageChange(page + 1)}
          className="gap-1"
        >
          Sau
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// --- Main component ---

export function ClientList() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const canCreateClient = hasPermission(user, "clients.create")
  const canUpdateClient = hasPermission(user, "clients.update")
  const canDeleteClient = hasPermission(user, "clients.delete")
  const canViewRevenue = hasPermission(user, "revenue.view")

  // Local UI state
  const [search, setSearch] = useState("")
  const [industryFilter, setIndustryFilter] = useState("Tất cả")
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [sortValue, setSortValue] = useState("-created_at")
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)

  // Debounced search - reset page when filters change
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
    // Simple debounce using setTimeout
    const timer = setTimeout(() => setDebouncedSearch(value), 400)
    return () => clearTimeout(timer)
  }, [])

  // Build filter params for the API
  const filters = useMemo<ClientFilter>(() => {
    const f: ClientFilter = { page, per_page: viewMode === "grid" ? 12 : 20 }
    if (debouncedSearch) f.search = debouncedSearch
    const statusValue = statusLabelToValue[statusFilter]
    if (statusValue) f.status = statusValue
    if (industryFilter !== "Tất cả") f.industry = industryFilter
    if (sortValue) f.sort = sortValue
    return f
  }, [page, debouncedSearch, statusFilter, industryFilter, viewMode, sortValue])

  // API hooks
  const { data, isLoading, isFetching } = useClients(filters)
  const deleteMutation = useDeleteClient()

  const clients = data?.data ?? []
  const meta = data?.meta

  // Compute summary stats from the response meta
  const totalClients = meta?.total ?? 0

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
      },
    })
  }

  const handleFilterChange = (type: "industry" | "status", value: string) => {
    setPage(1)
    if (type === "industry") setIndustryFilter(value)
    else setStatusFilter(value)
  }

  const handleSortChange = (sort: string) => {
    setSortValue(sort)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Khách hàng</h1>
            {isFetching && !isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Quản lý doanh nghiệp đối tác cung ứng nhân sự
          </p>
        </div>
        {canCreateClient && (
          <Button className="gap-1.5" onClick={() => navigate("/clients/create")}>
            <Plus className="h-4 w-4" />
            Thêm khách hàng
          </Button>
        )}
      </div>

      {/* Stats cards */}
      {isLoading ? (
        <StatsSkeletons />
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {baseStats
            .filter((s) => !s.permission || hasPermission(user, s.permission))
            .map((stat, idx) => {
              // Derive stat values from API response
              let value = "-"
              if (idx === 0) value = String(totalClients)
              else if (idx === 1) value = "-" // Would need a separate API call for active count
              else if (idx === 2) value = "-"
              else if (idx === 3) value = "-"

              return (
                <Card key={stat.label} className="border-border/50 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-bold tracking-tight">{value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
        </div>
      )}

      {/* Search + Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên công ty..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={industryFilter} onValueChange={(v) => handleFilterChange("industry", v)}>
                <SelectTrigger className="w-[160px]">
                  <Building2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Ngành nghề" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => handleFilterChange("status", v)}>
                <SelectTrigger className="w-[160px]">
                  <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusLabels.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* View toggle */}
              <div className="flex items-center rounded-lg border border-border/50 p-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon-xs"
                  onClick={() => { setViewMode("grid"); setPage(1) }}
                  className="h-7 w-7"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon-xs"
                  onClick={() => { setViewMode("list"); setPage(1) }}
                  className="h-7 w-7"
                >
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      {!isLoading && meta && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị{" "}
            <span className="font-medium text-foreground">{meta.from ?? 0}</span> -{" "}
            <span className="font-medium text-foreground">{meta.to ?? 0}</span> /{" "}
            <span className="font-medium text-foreground">{meta.total}</span> khách hàng
          </p>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        viewMode === "grid" ? <GridSkeletons /> : <TableSkeletons />
      ) : clients.length === 0 ? (
        /* Empty state */
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-medium">Không tìm thấy khách hàng</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        /* Grid view */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => {
            const logoBg = getAvatarColor(client.id)
            const initials = getInitials(client.company_name)
            const indColor = industryColors[client.industry ?? "Khác"] ?? "bg-gray-50 text-gray-700 border-gray-200/80"
            const stConfig = statusConfig[client.status] ?? statusConfig.prospect

            return (
              <Card
                key={client.id}
                className="group border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="p-5">
                  {/* Top: Logo + Name + Status */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${logoBg} shadow-sm`}
                    >
                      <span className="text-sm font-bold text-white">{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[14px] font-semibold leading-snug truncate">
                          {client.company_name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`shrink-0 rounded-md text-[10px] font-medium ${stConfig.className}`}
                        >
                          {client.status_label || stConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {client.industry && (
                          <Badge
                            variant="outline"
                            className={`rounded-md text-[10px] font-medium ${indColor}`}
                          >
                            {client.industry}
                          </Badge>
                        )}
                        {client.city && (
                          <span className="text-[11px] text-muted-foreground">{client.city}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>
                        <span className="font-semibold text-foreground">{client.staffing_orders_count ?? 0}</span> đơn hàng
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="h-3.5 w-3.5" />
                      <span>
                        <span className="font-semibold text-foreground">{client.contracts_count ?? 0}</span> hợp đồng
                      </span>
                    </div>
                  </div>

                  {/* Contact */}
                  {(client.contact_name || client.contact_phone) && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        {[client.contact_name, client.contact_phone].filter(Boolean).join(" - ")}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 gap-1.5 text-xs"
                      render={<Link to={`/clients/${client.id}`} />}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Xem chi tiết
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          {canUpdateClient && (
                            <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => navigate("/orders/create")}>
                            <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                            Tạo yêu cầu
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                            <FileText className="h-3.5 w-3.5 mr-2" />
                            Xem hợp đồng
                          </DropdownMenuItem>
                          {canDeleteClient && (
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeleteTarget(client)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* List view */
        <Card className="border-border/50 shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader label="Công ty" field="company_name" currentSort={sortValue} onSort={handleSortChange} />
                <SortableHeader label="Ngành nghề" field="industry" currentSort={sortValue} onSort={handleSortChange} />
                <TableHead className="text-center">Đơn hàng</TableHead>
                <TableHead className="text-center">Hợp đồng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <SortableHeader label="Trạng thái" field="status" currentSort={sortValue} onSort={handleSortChange} />
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => {
                const logoBg = getAvatarColor(client.id)
                const initials = getInitials(client.company_name)
                const indColor = industryColors[client.industry ?? "Khác"] ?? "bg-gray-50 text-gray-700 border-gray-200/80"
                const stConfig = statusConfig[client.status] ?? statusConfig.prospect

                return (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${logoBg}`}
                        >
                          <span className="text-[10px] font-bold text-white">{initials}</span>
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/clients/${client.id}`}
                            className="text-sm font-medium hover:text-primary truncate block"
                          >
                            {client.company_name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {formatAddress(client) || "-"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.industry ? (
                        <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${indColor}`}>
                          {client.industry}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold">{client.staffing_orders_count ?? 0}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold">{client.contracts_count ?? 0}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{client.contact_name || "-"}</div>
                      <div className="text-[11px] text-muted-foreground">{client.contact_phone || "-"}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${stConfig.className}`}>
                        {client.status_label || stConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                              <Eye className="h-3.5 w-3.5 mr-2" />
                              Xem chi tiết
                            </DropdownMenuItem>
                            {canUpdateClient && (
                              <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}/edit`)}>
                                <Pencil className="h-3.5 w-3.5 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => navigate("/orders/create")}>
                              <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                              Tạo yêu cầu
                            </DropdownMenuItem>
                            {canDeleteClient && (
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => setDeleteTarget(client)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Pagination */}
      {!isLoading && meta && meta.last_page > 1 && (
        <PaginationBar
          page={meta.current_page}
          lastPage={meta.last_page}
          total={meta.total}
          from={meta.from}
          to={meta.to}
          onPageChange={setPage}
        />
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng{" "}
              <span className="font-medium text-foreground">{deleteTarget?.company_name}</span>?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
