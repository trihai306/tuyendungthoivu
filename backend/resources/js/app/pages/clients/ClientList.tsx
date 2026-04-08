import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "lucide-react"

// --- Types ---

interface Client {
  id: string
  code: string
  name: string
  industry: string
  address: string
  contactName: string
  contactRole: string
  contactPhone: string
  contactEmail: string
  activeOrders: number
  totalWorkers: number
  status: "active" | "paused" | "new"
}

// --- Mock data ---

const mockClients: Client[] = [
  {
    id: "1",
    code: "KH-001",
    name: "Công ty TNHH Thực phẩm Việt",
    industry: "F&B",
    address: "Quận 7, TP. Hồ Chí Minh",
    contactName: "Nguyễn Văn An",
    contactRole: "Trưởng phòng Nhân sự",
    contactPhone: "0901 234 567",
    contactEmail: "an.nguyen@thucphamviet.vn",
    activeOrders: 3,
    totalWorkers: 24,
    status: "active",
  },
  {
    id: "2",
    code: "KH-002",
    name: "Nhà máy Samsung HCMC",
    industry: "Sản xuất",
    address: "KCN Tân Phú Trung, Củ Chi",
    contactName: "Trần Minh Tuấn",
    contactRole: "Quản lý sản xuất",
    contactPhone: "0912 345 678",
    contactEmail: "tuan.tran@samsung.com",
    activeOrders: 5,
    totalWorkers: 48,
    status: "active",
  },
  {
    id: "3",
    code: "KH-003",
    name: "Công ty CP Sự kiện Galaxy",
    industry: "Sự kiện",
    address: "Quận 1, TP. Hồ Chí Minh",
    contactName: "Lê Thị Mai",
    contactRole: "Giám đốc điều hành",
    contactPhone: "0923 456 789",
    contactEmail: "mai.le@galaxyevents.vn",
    activeOrders: 2,
    totalWorkers: 15,
    status: "active",
  },
  {
    id: "4",
    code: "KH-004",
    name: "Kho vận Lazada Express",
    industry: "Logistics",
    address: "Quận 9, TP. Hồ Chí Minh",
    contactName: "Phạm Đức Hùng",
    contactRole: "Trưởng kho",
    contactPhone: "0934 567 890",
    contactEmail: "hung.pham@lazada.vn",
    activeOrders: 4,
    totalWorkers: 36,
    status: "active",
  },
  {
    id: "5",
    code: "KH-005",
    name: "Nhà hàng Hải Sản Biển Đông",
    industry: "F&B",
    address: "Quận 2, TP. Hồ Chí Minh",
    contactName: "Hoàng Thị Lan",
    contactRole: "Quản lý nhà hàng",
    contactPhone: "0945 678 901",
    contactEmail: "lan.hoang@biendong.vn",
    activeOrders: 1,
    totalWorkers: 8,
    status: "paused",
  },
  {
    id: "6",
    code: "KH-006",
    name: "Công ty TNHH May mặc Đại Phát",
    industry: "Sản xuất",
    address: "KCN Tân Bình, TP. HCM",
    contactName: "Võ Quốc Bảo",
    contactRole: "Giám đốc nhà máy",
    contactPhone: "0956 789 012",
    contactEmail: "bao.vo@daiphat.com",
    activeOrders: 2,
    totalWorkers: 20,
    status: "active",
  },
  {
    id: "7",
    code: "KH-007",
    name: "Công ty Tổ chức Tiệc cưới Hoàng Gia",
    industry: "Sự kiện",
    address: "Quận Bình Thạnh, TP. HCM",
    contactName: "Đặng Thùy Dung",
    contactRole: "Phó Giám đốc",
    contactPhone: "0967 890 123",
    contactEmail: "dung.dang@hoanggia.vn",
    activeOrders: 1,
    totalWorkers: 6,
    status: "new",
  },
  {
    id: "8",
    code: "KH-008",
    name: "Giao hàng Nhanh Express",
    industry: "Logistics",
    address: "Quận Tân Bình, TP. HCM",
    contactName: "Bùi Văn Thắng",
    contactRole: "Trưởng phòng Vận hành",
    contactPhone: "0978 901 234",
    contactEmail: "thang.bui@ghn.vn",
    activeOrders: 3,
    totalWorkers: 28,
    status: "active",
  },
  {
    id: "9",
    code: "KH-009",
    name: "Siêu thị Co.opmart Nguyễn Kiệm",
    industry: "Khác",
    address: "Quận Gò Vấp, TP. HCM",
    contactName: "Trịnh Thanh Hà",
    contactRole: "Quản lý cửa hàng",
    contactPhone: "0989 012 345",
    contactEmail: "ha.trinh@coopmart.vn",
    activeOrders: 0,
    totalWorkers: 0,
    status: "new",
  },
  {
    id: "10",
    code: "KH-010",
    name: "Công ty CP Xây dựng Hòa Bình",
    industry: "Khác",
    address: "Quận 3, TP. Hồ Chí Minh",
    contactName: "Ngô Đình Nam",
    contactRole: "Trưởng phòng Nhân sự",
    contactPhone: "0990 123 456",
    contactEmail: "nam.ngo@hoabinh.vn",
    activeOrders: 1,
    totalWorkers: 12,
    status: "active",
  },
]

// --- Helpers ---

const industries = ["Tất cả", "Sản xuất", "F&B", "Sự kiện", "Logistics", "Khác"]
const statuses = ["Tất cả", "Đang hợp tác", "Tạm dừng", "Mới"]

const industryColors: Record<string, string> = {
  "Sản xuất": "bg-orange-50 text-orange-700 border-orange-200/80",
  "F&B": "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  "Sự kiện": "bg-violet-50 text-violet-700 border-violet-200/80",
  "Logistics": "bg-amber-50 text-amber-700 border-amber-200/80",
  "Khác": "bg-gray-50 text-gray-700 border-gray-200/80",
}

const statusConfig: Record<string, { label: string; className: string }> = {
  active: { label: "Đang hợp tác", className: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
  paused: { label: "Tạm dừng", className: "bg-amber-50 text-amber-700 border-amber-200/80" },
  new: { label: "Mới", className: "bg-blue-50 text-blue-700 border-blue-200/80" },
}

const statusFilterMap: Record<string, string> = {
  "Đang hợp tác": "active",
  "Tạm dừng": "paused",
  "Mới": "new",
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

// --- Stats ---

const stats = [
  { label: "Tổng khách hàng", value: "45", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Đang hợp tác", value: "28", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
  { label: "YCTD tháng này", value: "12", icon: ShoppingCart, color: "text-violet-600", bg: "bg-violet-50" },
  { label: "Doanh thu tháng", value: "850tr", icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
]

export function ClientList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [industryFilter, setIndustryFilter] = useState("Tất cả")
  const [statusFilter, setStatusFilter] = useState("Tất cả")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Filter logic
  const filtered = mockClients.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    const matchIndustry = industryFilter === "Tất cả" || c.industry === industryFilter
    const matchStatus =
      statusFilter === "Tất cả" || c.status === statusFilterMap[statusFilter]
    return matchSearch && matchIndustry && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">Khách hàng</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Quản lý doanh nghiệp đối tác cung ứng nhân sự
          </p>
        </div>
        <Button className="gap-1.5" onClick={() => toast.info("Tinh nang dang phat trien")}>
          <Plus className="h-4 w-4" />
          Thêm khách hàng
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-bold tracking-tight">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên công ty, mã KH..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <TrendingUp className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* View toggle */}
              <div className="flex items-center rounded-lg border border-border/50 p-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon-xs"
                  onClick={() => setViewMode("grid")}
                  className="h-7 w-7"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon-xs"
                  onClick={() => setViewMode("list")}
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
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị{" "}
          <span className="font-medium text-foreground">{filtered.length}</span> /{" "}
          <span className="font-medium text-foreground">{mockClients.length}</span> khách hàng
        </p>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
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
          {filtered.map((client) => {
            const logoBg = getAvatarColor(client.id)
            const initials = getInitials(client.name)
            const indColor = industryColors[client.industry] ?? "bg-gray-50 text-gray-700 border-gray-200/80"
            const stConfig = statusConfig[client.status]

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
                          {client.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`shrink-0 rounded-md text-[10px] font-medium ${stConfig.className}`}
                        >
                          {stConfig.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={`rounded-md text-[10px] font-medium ${indColor}`}
                        >
                          {client.industry}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{client.code}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>
                        <span className="font-semibold text-foreground">{client.activeOrders}</span> đơn active
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        <span className="font-semibold text-foreground">{client.totalWorkers}</span> ứng viên
                      </span>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {client.contactName} - {client.contactPhone}
                    </span>
                  </div>

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
                          <DropdownMenuItem onClick={() => toast.info("Tinh nang dang phat trien")}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/orders/create")}>
                            <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                            Tạo yêu cầu
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Tinh nang dang phat trien")}>
                            <FileText className="h-3.5 w-3.5 mr-2" />
                            Xem hợp đồng
                          </DropdownMenuItem>
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
                <TableHead className="w-[60px]">Mã KH</TableHead>
                <TableHead>Công ty</TableHead>
                <TableHead>Ngành nghề</TableHead>
                <TableHead className="text-center">Yêu cầu TD</TableHead>
                <TableHead className="text-center">Workers</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => {
                const logoBg = getAvatarColor(client.id)
                const initials = getInitials(client.name)
                const indColor = industryColors[client.industry] ?? "bg-gray-50 text-gray-700 border-gray-200/80"
                const stConfig = statusConfig[client.status]

                return (
                  <TableRow key={client.id}>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {client.code}
                    </TableCell>
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
                            {client.name}
                          </Link>
                          <p className="text-[11px] text-muted-foreground truncate">{client.address}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${indColor}`}>
                        {client.industry}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold">{client.activeOrders}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold">{client.totalWorkers}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{client.contactName}</div>
                      <div className="text-[11px] text-muted-foreground">{client.contactPhone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${stConfig.className}`}>
                        {stConfig.label}
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
                            <DropdownMenuItem onClick={() => toast.info("Tinh nang dang phat trien")}>
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate("/orders/create")}>
                              <ShoppingCart className="h-3.5 w-3.5 mr-2" />
                              Tạo yêu cầu
                            </DropdownMenuItem>
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
    </div>
  )
}
