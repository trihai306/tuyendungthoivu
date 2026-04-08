import { useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Star,
  Clock,
  Pencil,
  ShoppingCart,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle,
  Loader2,
  TrendingUp,
  CreditCard,
  CalendarDays,
  MessageSquare,
  Send,
  UserCheck,
  CircleDot,
  Hash,
} from "lucide-react"

// --- Types ---

interface Order {
  id: string
  code: string
  position: string
  quantity: number
  status: "processing" | "completed" | "cancelled"
  date: string
}

interface Note {
  id: string
  content: string
  date: string
  author: string
  type: "call" | "meeting" | "note" | "order"
}

// --- Mock data ---

const clientsData: Record<string, {
  id: string
  code: string
  name: string
  industry: string
  address: string
  taxCode: string
  website: string
  contactName: string
  contactRole: string
  contactPhone: string
  contactEmail: string
  contactZalo: string
  status: "active" | "paused" | "new"
  totalOrders: number
  totalWorkers: number
  completionRate: number
  rating: number
  cooperationYears: number
  totalReceivable: number
  totalPaid: number
  totalRemaining: number
  contractNumber: string
  contractDate: string
  contractExpiry: string
  contractValue: string
  orders: Order[]
  notes: Note[]
}> = {
  "1": {
    id: "1",
    code: "KH-001",
    name: "Công ty TNHH Thực phẩm Việt",
    industry: "F&B",
    address: "45 Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh",
    taxCode: "0312345678",
    website: "https://thucphamviet.vn",
    contactName: "Nguyễn Văn An",
    contactRole: "Trưởng phòng Nhân sự",
    contactPhone: "0901 234 567",
    contactEmail: "an.nguyen@thucphamviet.vn",
    contactZalo: "0901234567",
    status: "active",
    totalOrders: 24,
    totalWorkers: 156,
    completionRate: 95,
    rating: 4.5,
    cooperationYears: 2,
    totalReceivable: 120000000,
    totalPaid: 85000000,
    totalRemaining: 35000000,
    contractNumber: "HĐ-2024-001",
    contractDate: "15/01/2024",
    contractExpiry: "15/01/2025",
    contractValue: "500.000.000 VNĐ",
    orders: [
      { id: "o1", code: "ĐH-2024-045", position: "Phụ bếp", quantity: 8, status: "processing", date: "28/03/2026" },
      { id: "o2", code: "ĐH-2024-042", position: "Nhân viên kho", quantity: 5, status: "processing", date: "20/03/2026" },
      { id: "o3", code: "ĐH-2024-038", position: "Nhân viên phục vụ", quantity: 12, status: "completed", date: "10/03/2026" },
      { id: "o4", code: "ĐH-2024-030", position: "Đóng gói", quantity: 10, status: "completed", date: "25/02/2026" },
      { id: "o5", code: "ĐH-2024-025", position: "Phụ bếp", quantity: 6, status: "cancelled", date: "15/02/2026" },
    ],
    notes: [
      { id: "n1", content: "Gọi điện xác nhận yêu cầu ĐH-2024-045, KH yêu cầu ứng viên có kinh nghiệm bếp.", date: "28/03/2026 14:30", author: "Trần Minh", type: "call" },
      { id: "n2", content: "Họp tại văn phòng KH, thảo luận gia hạn hợp đồng 2025.", date: "22/03/2026 10:00", author: "Nguyễn Hoa", type: "meeting" },
      { id: "n3", content: "KH thanh toán đợt 3 - 25 triệu.", date: "18/03/2026 09:15", author: "Lê Thu", type: "note" },
      { id: "n4", content: "Hoàn thành yêu cầu ĐH-2024-038, KH đánh giá 5 sao.", date: "15/03/2026 17:00", author: "Hệ thống", type: "order" },
    ],
  },
  "2": {
    id: "2",
    code: "KH-002",
    name: "Nhà máy Samsung HCMC",
    industry: "Sản xuất",
    address: "KCN Tân Phú Trung, Củ Chi, TP. Hồ Chí Minh",
    taxCode: "0309876543",
    website: "https://samsung.com/vn",
    contactName: "Trần Minh Tuấn",
    contactRole: "Quản lý sản xuất",
    contactPhone: "0912 345 678",
    contactEmail: "tuan.tran@samsung.com",
    contactZalo: "0912345678",
    status: "active",
    totalOrders: 42,
    totalWorkers: 320,
    completionRate: 98,
    rating: 4.8,
    cooperationYears: 3,
    totalReceivable: 280000000,
    totalPaid: 250000000,
    totalRemaining: 30000000,
    contractNumber: "HĐ-2024-002",
    contractDate: "01/03/2024",
    contractExpiry: "01/03/2025",
    contractValue: "1.200.000.000 VNĐ",
    orders: [
      { id: "o1", code: "ĐH-2024-050", position: "Công nhân lắp ráp", quantity: 20, status: "processing", date: "01/04/2026" },
      { id: "o2", code: "ĐH-2024-048", position: "QC kiểm tra", quantity: 8, status: "processing", date: "25/03/2026" },
      { id: "o3", code: "ĐH-2024-040", position: "Đóng gói", quantity: 15, status: "completed", date: "15/03/2026" },
    ],
    notes: [
      { id: "n1", content: "Nhận yêu cầu tăng ca cuối tuần cho đơn ĐH-2024-050.", date: "02/04/2026 08:00", author: "Phạm Long", type: "call" },
      { id: "n2", content: "KH yêu cầu bổ sung 5 ứng viên cho line sản xuất mới.", date: "28/03/2026 15:30", author: "Trần Minh", type: "meeting" },
    ],
  },
}

// Default fallback for unknown IDs
const defaultClient = clientsData["1"]

// --- Helpers ---

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

const orderStatusConfig: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  processing: { label: "Đang xử lý", className: "bg-blue-50 text-blue-700 border-blue-200/80", icon: Loader2 },
  completed: { label: "Hoàn thành", className: "bg-emerald-50 text-emerald-700 border-emerald-200/80", icon: CheckCircle2 },
  cancelled: { label: "Đã hủy", className: "bg-red-50 text-red-700 border-red-200/80", icon: AlertCircle },
}

const noteIcons: Record<string, typeof Phone> = {
  call: Phone,
  meeting: Users,
  note: MessageSquare,
  order: ShoppingCart,
}

const noteColors: Record<string, string> = {
  call: "bg-blue-50 text-blue-600",
  meeting: "bg-violet-50 text-violet-600",
  note: "bg-amber-50 text-amber-600",
  order: "bg-emerald-50 text-emerald-600",
}

const avatarColors = [
  "from-orange-400 to-orange-600",
  "from-red-400 to-red-600",
  "from-blue-400 to-blue-600",
  "from-emerald-400 to-emerald-600",
  "from-cyan-400 to-cyan-600",
  "from-violet-400 to-violet-600",
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

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(0)}tr`
  }
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

function formatCurrencyFull(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
}

// --- Component ---

export function ClientDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [orderTab, setOrderTab] = useState("processing")

  const client = clientsData[id ?? ""] ?? defaultClient
  const logoBg = getAvatarColor(client.id)
  const initials = getInitials(client.name)
  const indColor = industryColors[client.industry] ?? "bg-gray-50 text-gray-700 border-gray-200/80"
  const stConfig = statusConfig[client.status]

  // Filter orders by tab
  const filteredOrders =
    orderTab === "all"
      ? client.orders
      : client.orders.filter((o) => o.status === orderTab)

  // Payment progress percentage
  const paymentPercent =
    client.totalReceivable > 0
      ? Math.round((client.totalPaid / client.totalReceivable) * 100)
      : 0

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/clients" />}>Khách hàng</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{client.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero header */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40">
          <div className="absolute -bottom-4 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="absolute top-4 right-10 h-16 w-16 rounded-full bg-white/5 blur-lg" />
        </div>
        <CardContent className="relative px-6 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${logoBg} shadow-lg ring-4 ring-card`}
            >
              <span className="text-xl font-bold text-white">{initials}</span>
            </div>
            <div className="flex-1 sm:pb-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{client.name}</h1>
                <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${indColor}`}>
                  {client.industry}
                </Badge>
                <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${stConfig.className}`}>
                  {stConfig.label}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{client.code} &middot; {client.address}</p>
            </div>
            <div className="flex items-center gap-2 sm:pb-0.5">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs" onClick={() => toast.info("Tinh nang dang phat trien")}>
                <Pencil className="h-3.5 w-3.5" />
                Sửa
              </Button>
              <Button size="sm" className="gap-1.5 text-xs" onClick={() => navigate("/orders/create")}>
                <ShoppingCart className="h-3.5 w-3.5" />
                Tạo yêu cầu
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => toast.info("Tinh nang dang phat trien")}>
                      <FileText className="h-3.5 w-3.5 mr-2" />
                      Xem hợp đồng
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info("Tinh nang dang phat trien")}>
                      <Send className="h-3.5 w-3.5 mr-2" />
                      Gửi báo giá
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content 2-column layout */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Left column - 65% */}
        <div className="lg:col-span-3 space-y-4">

          {/* Company info card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Building2 className="h-4 w-4 text-primary" />
                Thông tin doanh nghiệp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={Hash} label="Mã KH" value={client.code} color="bg-gray-50 text-gray-600" />
                <InfoRow icon={Building2} label="Tên công ty" value={client.name} color="bg-blue-50 text-blue-600" />
                <InfoRow icon={CircleDot} label="Ngành nghề" value={client.industry} color="bg-violet-50 text-violet-600" />
                <InfoRow icon={MapPin} label="Địa chỉ" value={client.address} color="bg-amber-50 text-amber-600" />
                <InfoRow icon={FileText} label="Mã số thuế" value={client.taxCode} color="bg-emerald-50 text-emerald-600" />
                <InfoRow icon={Globe} label="Website" value={client.website} color="bg-cyan-50 text-cyan-600" isLink />
              </div>

              <Separator className="my-4" />

              {/* Contact person */}
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Người liên hệ
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={Users} label="Họ tên" value={client.contactName} color="bg-blue-50 text-blue-600" />
                <InfoRow icon={Building2} label="Chức vụ" value={client.contactRole} color="bg-violet-50 text-violet-600" />
                <InfoRow icon={Phone} label="Số điện thoại" value={client.contactPhone} color="bg-emerald-50 text-emerald-600" />
                <InfoRow icon={Mail} label="Email" value={client.contactEmail} color="bg-amber-50 text-amber-600" />
                <InfoRow icon={MessageSquare} label="Zalo" value={client.contactZalo} color="bg-blue-50 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Orders card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <ShoppingCart className="h-4 w-4 text-primary" />
                Yêu cầu tuyển dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="processing" onValueChange={setOrderTab}>
                <TabsList variant="line" className="mb-3">
                  <TabsTrigger value="processing">
                    Đang xử lý ({client.orders.filter((o) => o.status === "processing").length})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Hoàn thành ({client.orders.filter((o) => o.status === "completed").length})
                  </TabsTrigger>
                  <TabsTrigger value="all">
                    Tất cả ({client.orders.length})
                  </TabsTrigger>
                </TabsList>

                {["processing", "completed", "all"].map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    {filteredOrders.length === 0 ? (
                      <div className="flex flex-col items-center py-8 text-muted-foreground">
                        <ShoppingCart className="h-8 w-8 mb-2 opacity-40" />
                        <p className="text-sm">Chưa có yêu cầu nào</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã đơn</TableHead>
                            <TableHead>Vị trí</TableHead>
                            <TableHead className="text-center">SL</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.map((order) => {
                            const osConfig = orderStatusConfig[order.status]
                            return (
                              <TableRow key={order.id}>
                                <TableCell className="text-xs font-mono font-medium">{order.code}</TableCell>
                                <TableCell className="text-sm">{order.position}</TableCell>
                                <TableCell className="text-center text-sm font-semibold">{order.quantity}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={`rounded-md text-[10px] font-medium ${osConfig.className}`}>
                                    {osConfig.label}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">{order.date}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Notes & history card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Clock className="h-4 w-4 text-primary" />
                Ghi chú & Lịch sử
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {client.notes.map((note, index) => {
                  const NoteIcon = noteIcons[note.type] ?? MessageSquare
                  const nColor = noteColors[note.type] ?? "bg-gray-50 text-gray-600"
                  const isLast = index === client.notes.length - 1

                  return (
                    <div key={note.id} className="flex gap-3">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${nColor}`}>
                          <NoteIcon className="h-3.5 w-3.5" />
                        </div>
                        {!isLast && <div className="w-px flex-1 bg-border/60 my-1" />}
                      </div>
                      {/* Content */}
                      <div className={`flex-1 ${isLast ? "pb-0" : "pb-4"}`}>
                        <p className="text-sm leading-relaxed">{note.content}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{note.author}</span>
                          <span>&middot;</span>
                          <span>{note.date}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - 35% */}
        <div className="lg:col-span-2 space-y-4">

          {/* Cooperation overview card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Tổng quan hợp tác</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatRow icon={ShoppingCart} label="Tổng YCTD" value={String(client.totalOrders)} iconColor="text-blue-600" iconBg="bg-blue-50" />
                <Separator />
                <StatRow icon={Users} label="Ứng viên đã cung ứng" value={String(client.totalWorkers)} iconColor="text-emerald-600" iconBg="bg-emerald-50" />
                <Separator />
                <StatRow icon={TrendingUp} label="Tỷ lệ hoàn thành" value={`${client.completionRate}%`} iconColor="text-violet-600" iconBg="bg-violet-50" />
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                      <Star className="h-4 w-4 text-amber-600" />
                    </div>
                    Đánh giá
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < Math.floor(client.rating)
                            ? "fill-amber-400 text-amber-400"
                            : i < client.rating
                              ? "fill-amber-400/50 text-amber-400"
                              : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-semibold">{client.rating}</span>
                  </div>
                </div>
                <Separator />
                <StatRow icon={CalendarDays} label="Thời gian hợp tác" value={`${client.cooperationYears} năm`} iconColor="text-pink-600" iconBg="bg-pink-50" />
              </div>
            </CardContent>
          </Card>

          {/* Payment card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <CreditCard className="h-4 w-4 text-primary" />
                Công nợ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tổng phải thu</span>
                  <span className="font-semibold">{formatCurrencyFull(client.totalReceivable)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Đã thanh toán</span>
                  <span className="font-semibold text-emerald-600">{formatCurrencyFull(client.totalPaid)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Còn lại</span>
                  <span className="font-semibold text-amber-600">{formatCurrencyFull(client.totalRemaining)}</span>
                </div>

                {/* Progress bar */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                    <span>Tiến độ thanh toán</span>
                    <span className="font-medium text-foreground">{paymentPercent}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all"
                      style={{ width: `${paymentPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract card */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <FileText className="h-4 w-4 text-primary" />
                Hợp đồng hiện tại
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Số hợp đồng</span>
                  <span className="font-medium font-mono text-xs">{client.contractNumber}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ngày ký</span>
                  <span className="font-medium">{client.contractDate}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ngày hết hạn</span>
                  <span className="font-medium">{client.contractExpiry}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Giá trị</span>
                  <span className="font-semibold text-primary">{client.contractValue}</span>
                </div>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs" onClick={() => toast.info("Tinh nang dang phat trien")}>
                  <FileText className="h-3.5 w-3.5" />
                  Xem chi tiết hợp đồng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// --- Reusable sub-components ---

function InfoRow({
  icon: Icon,
  label,
  value,
  color,
  isLink = false,
}: {
  icon: typeof Building2
  label: string
  value: string
  color: string
  isLink?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary hover:underline truncate block"
          >
            {value.replace("https://", "").replace("http://", "")}
          </a>
        ) : (
          <p className="text-sm font-medium truncate">{value}</p>
        )}
      </div>
    </div>
  )
}

function StatRow({
  icon: Icon,
  label,
  value,
  iconColor,
  iconBg,
}: {
  icon: typeof Building2
  label: string
  value: string
  iconColor: string
  iconBg: string
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        {label}
      </div>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}
