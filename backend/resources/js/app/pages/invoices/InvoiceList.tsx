import { useState, useMemo, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  FileDown,
  Receipt,
  CircleDollarSign,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Printer,
  Mail,
  CheckCircle2,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Calendar,
  CreditCard,
  FileText,
} from "lucide-react"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"

// --- Types ---

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "partial" | "cancelled"

interface InvoiceLineItem {
  stt: number
  description: string
  quantity: number
  unit: string
  unitPrice: number
  amount: number
}

interface PaymentRecord {
  date: string
  amount: number
  method: string
  note: string
}

interface Invoice {
  id: string
  code: string
  customer: string
  customerTaxCode: string
  customerAddress: string
  relatedOrder: string
  period: string
  workerCount: number
  totalAmount: number
  paidAmount: number
  remainingAmount: number
  status: InvoiceStatus
  createdAt: string
  dueDate: string
  issuedDate: string
  lineItems: InvoiceLineItem[]
  payments: PaymentRecord[]
}

// --- Config ---

const statusConfig: Record<InvoiceStatus, { label: string; className: string; dotClass?: string }> = {
  draft: {
    label: "Nháp",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
  sent: {
    label: "Đã gửi",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  paid: {
    label: "Đã thanh toán",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  overdue: {
    label: "Quá hạn",
    className: "bg-red-50 text-red-700 border-red-200",
    dotClass: "animate-pulse",
  },
  partial: {
    label: "Một phần",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-gray-100 text-gray-400 border-gray-200 line-through",
  },
}

// --- Mock Data ---

const initialInvoicesData: Invoice[] = [
  {
    id: "1",
    code: "INV-2026-041",
    customer: "Công ty TNHH Logistic Phương Nam",
    customerTaxCode: "0312345678",
    customerAddress: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    relatedOrder: "ORD-024",
    period: "01/04 - 15/04/2026",
    workerCount: 8,
    totalAmount: 185600000,
    paidAmount: 185600000,
    remainingAmount: 0,
    status: "paid",
    createdAt: "16/04/2026",
    dueDate: "30/04/2026",
    issuedDate: "16/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 8 CN đóng gói - ORD-024", quantity: 96, unit: "ngày công", unitPrice: 1650000, amount: 158400000 },
      { stt: 2, description: "Phụ cấp ca đêm (4 CN x 5 đêm)", quantity: 20, unit: "ca", unitPrice: 180000, amount: 3600000 },
      { stt: 3, description: "Phụ cấp tăng ca (OT)", quantity: 32, unit: "giờ", unitPrice: 75000, amount: 2400000 },
    ],
    payments: [
      { date: "20/04/2026", amount: 100000000, method: "Chuyển khoản", note: "Thanh toán đợt 1" },
      { date: "28/04/2026", amount: 85600000, method: "Chuyển khoản", note: "Thanh toán đợt 2 - tất toán" },
    ],
  },
  {
    id: "2",
    code: "INV-2026-042",
    customer: "Công ty CP Thực phẩm Đại Việt",
    customerTaxCode: "0301234567",
    customerAddress: "456 Điện Biên Phủ, Quận 3, TP.HCM",
    relatedOrder: "ORD-025",
    period: "01/04 - 15/04/2026",
    workerCount: 12,
    totalAmount: 276000000,
    paidAmount: 276000000,
    remainingAmount: 0,
    status: "paid",
    createdAt: "16/04/2026",
    dueDate: "30/04/2026",
    issuedDate: "16/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 12 CN chế biến thực phẩm - ORD-025", quantity: 144, unit: "ngày công", unitPrice: 1750000, amount: 252000000 },
      { stt: 2, description: "Trang bị bảo hộ lao động", quantity: 12, unit: "bộ", unitPrice: 350000, amount: 4200000 },
    ],
    payments: [
      { date: "25/04/2026", amount: 276000000, method: "Chuyển khoản", note: "Thanh toán 1 lần" },
    ],
  },
  {
    id: "3",
    code: "INV-2026-043",
    customer: "Công ty TNHH SX Minh Phát",
    customerTaxCode: "0309876543",
    customerAddress: "789 Quốc lộ 1A, Quận Bình Tân, TP.HCM",
    relatedOrder: "ORD-026",
    period: "01/04 - 15/04/2026",
    workerCount: 6,
    totalAmount: 132000000,
    paidAmount: 0,
    remainingAmount: 132000000,
    status: "sent",
    createdAt: "17/04/2026",
    dueDate: "01/05/2026",
    issuedDate: "17/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 6 CN lắp ráp - ORD-026", quantity: 72, unit: "ngày công", unitPrice: 1600000, amount: 115200000 },
      { stt: 2, description: "Phụ cấp tăng ca (OT)", quantity: 48, unit: "giờ", unitPrice: 75000, amount: 3600000 },
    ],
    payments: [],
  },
  {
    id: "4",
    code: "INV-2026-044",
    customer: "Công ty CP Kho vận Tân Cảng",
    customerTaxCode: "0315678901",
    customerAddress: "12 Nguyễn Hữu Thọ, Quận 7, TP.HCM",
    relatedOrder: "ORD-027",
    period: "16/03 - 31/03/2026",
    workerCount: 15,
    totalAmount: 420000000,
    paidAmount: 200000000,
    remainingAmount: 220000000,
    status: "overdue",
    createdAt: "02/04/2026",
    dueDate: "16/04/2026",
    issuedDate: "02/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 15 CN bốc xếp kho - ORD-027", quantity: 180, unit: "ngày công", unitPrice: 2000000, amount: 360000000 },
      { stt: 2, description: "Phụ cấp ca đêm", quantity: 30, unit: "ca", unitPrice: 200000, amount: 6000000 },
      { stt: 3, description: "Phụ cấp xăng xe", quantity: 15, unit: "người", unitPrice: 500000, amount: 7500000 },
    ],
    payments: [
      { date: "10/04/2026", amount: 200000000, method: "Chuyển khoản", note: "Tạm ứng đợt 1" },
    ],
  },
  {
    id: "5",
    code: "INV-2026-045",
    customer: "Công ty TNHH May mặc Hòa Bình",
    customerTaxCode: "0318765432",
    customerAddress: "34 Lê Văn Việt, Quận 9, TP.HCM",
    relatedOrder: "ORD-028",
    period: "01/04 - 15/04/2026",
    workerCount: 20,
    totalAmount: 380000000,
    paidAmount: 200000000,
    remainingAmount: 180000000,
    status: "partial",
    createdAt: "16/04/2026",
    dueDate: "30/04/2026",
    issuedDate: "16/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 20 CN may công nghiệp - ORD-028", quantity: 240, unit: "ngày công", unitPrice: 1450000, amount: 348000000 },
      { stt: 2, description: "Đào tạo an toàn lao động", quantity: 20, unit: "người", unitPrice: 150000, amount: 3000000 },
    ],
    payments: [
      { date: "22/04/2026", amount: 200000000, method: "Chuyển khoản", note: "Thanh toán đợt 1 (50%)" },
    ],
  },
  {
    id: "6",
    code: "INV-2026-046",
    customer: "Công ty CP XNK Sài Gòn Star",
    customerTaxCode: "0302345678",
    customerAddress: "56 Trần Hưng Đạo, Quận 1, TP.HCM",
    relatedOrder: "ORD-029",
    period: "01/04 - 15/04/2026",
    workerCount: 5,
    totalAmount: 95000000,
    paidAmount: 0,
    remainingAmount: 95000000,
    status: "draft",
    createdAt: "18/04/2026",
    dueDate: "02/05/2026",
    issuedDate: "",
    lineItems: [
      { stt: 1, description: "Cung ứng 5 CN kho vận - ORD-029", quantity: 60, unit: "ngày công", unitPrice: 1500000, amount: 90000000 },
    ],
    payments: [],
  },
  {
    id: "7",
    code: "INV-2026-047",
    customer: "Công ty TNHH Logistic Phương Nam",
    customerTaxCode: "0312345678",
    customerAddress: "123 Nguyễn Văn Linh, Quận 7, TP.HCM",
    relatedOrder: "ORD-030",
    period: "16/04 - 30/04/2026",
    workerCount: 10,
    totalAmount: 230000000,
    paidAmount: 0,
    remainingAmount: 230000000,
    status: "sent",
    createdAt: "01/05/2026",
    dueDate: "15/05/2026",
    issuedDate: "01/05/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 10 CN đóng gói - ORD-030", quantity: 120, unit: "ngày công", unitPrice: 1650000, amount: 198000000 },
      { stt: 2, description: "Phụ cấp tăng ca", quantity: 40, unit: "giờ", unitPrice: 80000, amount: 3200000 },
    ],
    payments: [],
  },
  {
    id: "8",
    code: "INV-2026-048",
    customer: "Công ty CP Thực phẩm Đại Việt",
    customerTaxCode: "0301234567",
    customerAddress: "456 Điện Biên Phủ, Quận 3, TP.HCM",
    relatedOrder: "ORD-031",
    period: "16/03 - 31/03/2026",
    workerCount: 8,
    totalAmount: 180000000,
    paidAmount: 0,
    remainingAmount: 180000000,
    status: "overdue",
    createdAt: "01/04/2026",
    dueDate: "15/04/2026",
    issuedDate: "01/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 8 CN chế biến - ORD-031", quantity: 96, unit: "ngày công", unitPrice: 1750000, amount: 168000000 },
    ],
    payments: [],
  },
  {
    id: "9",
    code: "INV-2026-049",
    customer: "Công ty TNHH Bao bì An Phú",
    customerTaxCode: "0307654321",
    customerAddress: "78 Xa lộ Hà Nội, TP. Thủ Đức, TP.HCM",
    relatedOrder: "ORD-032",
    period: "01/04 - 15/04/2026",
    workerCount: 4,
    totalAmount: 72000000,
    paidAmount: 72000000,
    remainingAmount: 0,
    status: "paid",
    createdAt: "16/04/2026",
    dueDate: "30/04/2026",
    issuedDate: "16/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 4 CN đóng gói bao bì - ORD-032", quantity: 48, unit: "ngày công", unitPrice: 1400000, amount: 67200000 },
    ],
    payments: [
      { date: "24/04/2026", amount: 72000000, method: "Chuyển khoản", note: "Thanh toán đầy đủ" },
    ],
  },
  {
    id: "10",
    code: "INV-2026-050",
    customer: "Công ty CP Cơ khí Tân Tiến",
    customerTaxCode: "0314567890",
    customerAddress: "90 Đại lộ Bình Dương, TP. Thuận An, Bình Dương",
    relatedOrder: "ORD-033",
    period: "01/04 - 15/04/2026",
    workerCount: 7,
    totalAmount: 154000000,
    paidAmount: 0,
    remainingAmount: 154000000,
    status: "sent",
    createdAt: "17/04/2026",
    dueDate: "01/05/2026",
    issuedDate: "17/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 7 CN cơ khí - ORD-033", quantity: 84, unit: "ngày công", unitPrice: 1700000, amount: 142800000 },
      { stt: 2, description: "Phụ cấp độc hại", quantity: 7, unit: "người", unitPrice: 500000, amount: 3500000 },
    ],
    payments: [],
  },
  {
    id: "11",
    code: "INV-2026-051",
    customer: "Công ty TNHH SX Minh Phát",
    customerTaxCode: "0309876543",
    customerAddress: "789 Quốc lộ 1A, Quận Bình Tân, TP.HCM",
    relatedOrder: "ORD-034",
    period: "16/03 - 31/03/2026",
    workerCount: 6,
    totalAmount: 126000000,
    paidAmount: 126000000,
    remainingAmount: 0,
    status: "paid",
    createdAt: "01/04/2026",
    dueDate: "15/04/2026",
    issuedDate: "01/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 6 CN lắp ráp - ORD-034", quantity: 72, unit: "ngày công", unitPrice: 1600000, amount: 115200000 },
    ],
    payments: [
      { date: "12/04/2026", amount: 126000000, method: "Chuyển khoản", note: "Thanh toán đầy đủ" },
    ],
  },
  {
    id: "12",
    code: "INV-2026-052",
    customer: "Công ty CP XNK Sài Gòn Star",
    customerTaxCode: "0302345678",
    customerAddress: "56 Trần Hưng Đạo, Quận 1, TP.HCM",
    relatedOrder: "ORD-035",
    period: "16/03 - 31/03/2026",
    workerCount: 3,
    totalAmount: 54000000,
    paidAmount: 0,
    remainingAmount: 54000000,
    status: "cancelled",
    createdAt: "01/04/2026",
    dueDate: "15/04/2026",
    issuedDate: "01/04/2026",
    lineItems: [
      { stt: 1, description: "Cung ứng 3 CN kho vận - ORD-035", quantity: 36, unit: "ngày công", unitPrice: 1500000, amount: 54000000 },
    ],
    payments: [],
  },
]

// --- Helpers ---

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatCompactVND(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1).replace(".0", "")} tỷ`
  }
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(0)} triệu`
  }
  return formatVND(amount)
}

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.dotClass && (
        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full bg-current ${config.dotClass}`} />
      )}
      {config.label}
    </Badge>
  )
}

// --- Component ---

const ITEMS_PER_PAGE = 8

export function InvoiceList() {
  const can = usePermissions()
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoicesData)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [monthFilter, setMonthFilter] = useState<string>("")
  const [customerFilter, setCustomerFilter] = useState<string>("")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Unique customers for filter
  const uniqueCustomers = useMemo(
    () => Array.from(new Set(invoices.map((inv) => inv.customer))),
    [invoices],
  )

  // Filter logic
  const filtered = useMemo(() => invoices.filter((inv) => {
    const matchSearch =
      !search ||
      inv.code.toLowerCase().includes(search.toLowerCase()) ||
      inv.customer.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || inv.status === statusFilter
    const matchMonth =
      !monthFilter ||
      (monthFilter === "03" && inv.period.includes("03/2026")) ||
      (monthFilter === "04" && inv.period.includes("04/2026")) ||
      (monthFilter === "05" && inv.period.includes("05/2026"))
    const matchCustomer = !customerFilter || inv.customer === customerFilter
    return matchSearch && matchStatus && matchMonth && matchCustomer
  }), [invoices, search, statusFilter, monthFilter, customerFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  // Stats derived from state
  const stats = useMemo(() => ({
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.totalAmount, 0),
    pending: invoices
      .filter((i) => ["sent", "draft", "partial"].includes(i.status))
      .reduce((s, i) => s + i.remainingAmount, 0),
    overdue: invoices
      .filter((i) => i.status === "overdue")
      .reduce((s, i) => s + i.remainingAmount, 0),
  }), [invoices])

  function openDetail(invoice: Invoice) {
    setSelectedInvoice(invoice)
    setDialogOpen(true)
  }

  // Compute subtotal/vat/total for detail
  function getInvoiceTotals(inv: Invoice) {
    const subtotal = inv.lineItems.reduce((s, li) => s + li.amount, 0)
    const vat = Math.round(subtotal * 0.1)
    const total = subtotal + vat
    return { subtotal, vat, total }
  }

  // ── Action handlers ──────────────────────────────────────────────────────

  const handleExportReport = useCallback(() => {
    const header = "Ma HD\tKhach hang\tYCTD\tKy\tUng vien\tTong tien\tDa TT\tCon lai\tTrang thai\tNgay tao"
    const rows = invoices.map((inv) =>
      `${inv.code}\t${inv.customer}\t${inv.relatedOrder}\t${inv.period}\t${inv.workerCount}\t${inv.totalAmount}\t${inv.paidAmount}\t${inv.remainingAmount}\t${statusConfig[inv.status].label}\t${inv.createdAt}`
    )
    const text = [header, ...rows].join("\n")
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Đã sao chép dữ liệu hóa đơn vào clipboard")
    }).catch(() => {
      toast.error("Không thể sao chép dữ liệu")
    })
  }, [invoices])

  const handleCreateInvoice = useCallback(() => {
    toast.info("Tính năng đang phát triển")
  }, [])

  const handlePrintInvoice = useCallback((inv: Invoice) => {
    toast.info(`Đang in hóa đơn ${inv.code}...`)
    const w = window.open("", "_blank", "width=800,height=600")
    if (w) {
      const totals = getInvoiceTotals(inv)
      const lineRows = inv.lineItems.map((li) =>
        `<tr><td>${li.stt}</td><td>${li.description}</td><td style="text-align:right">${li.quantity}</td><td>${li.unit}</td><td style="text-align:right">${formatVND(li.unitPrice)}</td><td style="text-align:right">${formatVND(li.amount)}</td></tr>`
      ).join("")
      w.document.write(`
        <html><head><title>Hóa đơn ${inv.code}</title>
        <style>body{font-family:sans-serif;padding:40px}h1{font-size:20px}table{width:100%;border-collapse:collapse;margin-top:20px}td,th{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5}.right{text-align:right}.total{font-weight:bold}</style>
        </head><body>
        <h1>HÓA ĐƠN DỊCH VỤ - ${inv.code}</h1>
        <table>
          <tr><th>Khách hàng</th><td>${inv.customer}</td></tr>
          <tr><th>MST</th><td>${inv.customerTaxCode}</td></tr>
          <tr><th>Địa chỉ</th><td>${inv.customerAddress}</td></tr>
          <tr><th>YCTD</th><td>${inv.relatedOrder}</td></tr>
          <tr><th>Kỳ</th><td>${inv.period}</td></tr>
          <tr><th>Ngày xuất</th><td>${inv.issuedDate || "Chưa xuất"}</td></tr>
          <tr><th>Hạn TT</th><td>${inv.dueDate}</td></tr>
        </table>
        <h3 style="margin-top:20px">Chi tiết</h3>
        <table>
          <tr><th>STT</th><th>Mô tả</th><th class="right">SL</th><th>Đơn vị</th><th class="right">Đơn giá</th><th class="right">Thành tiền</th></tr>
          ${lineRows}
        </table>
        <p style="margin-top:10px">Tạm tính: ${formatVND(totals.subtotal)}</p>
        <p>VAT (10%): ${formatVND(totals.vat)}</p>
        <p class="total">Tổng cộng: ${formatVND(totals.total)}</p>
        <script>setTimeout(()=>window.print(),300)</script>
        </body></html>
      `)
    }
  }, [])

  const handleSendEmail = useCallback((inv: Invoice) => {
    toast.success(`Đã gửi hóa đơn ${inv.code} qua email cho ${inv.customer}`)
  }, [])

  const handleDuplicate = useCallback((inv: Invoice) => {
    const newId = String(Date.now())
    const newCode = `INV-${inv.code.split("-").slice(1, 2).join("-")}-${String(invoices.length + 1).padStart(3, "0")}`
    const duplicated: Invoice = {
      ...inv,
      id: newId,
      code: newCode,
      status: "draft",
      paidAmount: 0,
      remainingAmount: inv.totalAmount,
      payments: [],
      issuedDate: "",
    }
    setInvoices((prev) => [duplicated, ...prev])
    toast.success(`Đã nhân bản hóa đơn ${inv.code} → ${newCode}`)
  }, [invoices.length])

  const handleDelete = useCallback((inv: Invoice) => {
    setInvoices((prev) => prev.filter((i) => i.id !== inv.id))
    toast.success(`Đã xóa hóa đơn ${inv.code}`)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hóa đơn</h1>
          <p className="text-muted-foreground">
            Quản lý hóa đơn dịch vụ cung ứng nhân sự
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportReport}>
            <FileDown className="h-4 w-4" />
            Xuất báo cáo
          </Button>
          {can("invoices.create") && (
            <Button className="gap-2" onClick={handleCreateInvoice}>
              <Plus className="h-4 w-4" />
              Tạo hóa đơn
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Tổng hóa đơn tháng</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              <CircleDollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Đã thanh toán</p>
              <p className="text-2xl font-bold text-emerald-600">{formatCompactVND(stats.paid)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
              <p className="text-2xl font-bold text-orange-600">{formatCompactVND(stats.pending)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Quá hạn</p>
              <p className="text-2xl font-bold text-red-600">{formatCompactVND(stats.overdue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mã HĐ, khách hàng..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v === "__all__" ? "" : v)}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả trạng thái</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="sent">Đã gửi</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="partial">Một phần</SelectItem>
                <SelectItem value="overdue">Quá hạn</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={(v) => setMonthFilter(v === "__all__" ? "" : v)}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Tháng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả tháng</SelectItem>
                <SelectItem value="03">Tháng 3/2026</SelectItem>
                <SelectItem value="04">Tháng 4/2026</SelectItem>
                <SelectItem value="05">Tháng 5/2026</SelectItem>
              </SelectContent>
            </Select>
            <Select value={customerFilter} onValueChange={(v) => setCustomerFilter(v === "__all__" ? "" : v)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">Tất cả khách hàng</SelectItem>
                {uniqueCustomers.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Mã HĐ</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="w-[90px]">Yêu cầu TD</TableHead>
                  <TableHead>Kỳ</TableHead>
                  <TableHead className="text-center w-[70px]">Ứng viên</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead className="text-right">Đã TT</TableHead>
                  <TableHead className="text-right">Còn lại</TableHead>
                  <TableHead className="w-[120px]">Trạng thái</TableHead>
                  <TableHead className="w-[100px]">Ngày tạo</TableHead>
                  <TableHead className="w-[60px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-32 text-center text-muted-foreground">
                      Không tìm thấy hóa đơn nào phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInvoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => openDetail(inv)}
                    >
                      <TableCell className="font-mono text-sm font-medium text-primary">
                        {inv.code}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate font-medium">{inv.customer}</div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {inv.relatedOrder}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {inv.period}
                      </TableCell>
                      <TableCell className="text-center">{inv.workerCount}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums font-medium">
                        {formatVND(inv.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-emerald-600">
                        {inv.paidAmount > 0 ? formatVND(inv.paidAmount) : "-"}
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums">
                        {inv.remainingAmount > 0 ? (
                          <span className={inv.status === "overdue" ? "text-red-600 font-semibold" : "text-orange-600"}>
                            {formatVND(inv.remainingAmount)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{inv.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetail(inv) }}>
                                <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePrintInvoice(inv) }}>
                                <Printer className="mr-2 h-4 w-4" /> In hóa đơn
                              </DropdownMenuItem>
                              {can("invoices.send") && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSendEmail(inv) }}>
                                  <Mail className="mr-2 h-4 w-4" /> Gửi email
                                </DropdownMenuItem>
                              )}
                              {can("invoices.create") && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDuplicate(inv) }}>
                                  <Copy className="mr-2 h-4 w-4" /> Nhân bản
                                </DropdownMenuItem>
                              )}
                              {can("invoices.update") && (
                                <DropdownMenuItem
                                  onClick={(e) => { e.stopPropagation(); handleDelete(inv) }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Xóa
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Hiển thị {paginatedInvoices.length} / {filtered.length} hóa đơn
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon-sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className={`min-w-[32px] ${currentPage === i + 1 ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon-sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedInvoice && <InvoiceDetailContent invoice={selectedInvoice} getInvoiceTotals={getInvoiceTotals} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// --- Invoice Detail Dialog Content ---

function InvoiceDetailContent({
  invoice,
  getInvoiceTotals,
}: {
  invoice: Invoice
  getInvoiceTotals: (inv: Invoice) => { subtotal: number; vat: number; total: number }
}) {
  const totals = getInvoiceTotals(invoice)

  return (
    <div className="space-y-5">
      {/* Dialog Header */}
      <DialogHeader>
        <div className="flex items-center gap-3">
          <DialogTitle className="text-lg">{invoice.code}</DialogTitle>
          <StatusBadge status={invoice.status} />
        </div>
        <DialogDescription>
          Hóa đơn dịch vụ cung ứng nhân sự - {invoice.customer}
        </DialogDescription>
      </DialogHeader>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="gap-1.5">
          <Printer className="h-3.5 w-3.5" /> In
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Mail className="h-3.5 w-3.5" /> Gửi email
        </Button>
        {invoice.status !== "paid" && invoice.status !== "cancelled" && (
          <Button size="sm" className="gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" /> Đánh dấu đã TT
          </Button>
        )}
      </div>

      <Separator />

      {/* Customer Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Thông tin khách hàng
          </h4>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="font-medium">{invoice.customer}</p>
                <p className="text-sm text-muted-foreground">MST: {invoice.customerTaxCode}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FileText className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
              <p className="text-sm text-muted-foreground">{invoice.customerAddress}</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Thông tin hóa đơn
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Ngày xuất:</span>
              <span className="font-medium">{invoice.issuedDate || "Chưa xuất"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Hạn thanh toán:</span>
              <span className="font-medium">{invoice.dueDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">YCTD:</span>
              <span className="font-mono text-primary">{invoice.relatedOrder}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Kỳ:</span>
              <span className="font-medium">{invoice.period}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Line Items Table */}
      <div>
        <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Chi tiết hóa đơn
        </h4>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[50px] text-center">STT</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right w-[80px]">SL</TableHead>
                <TableHead className="w-[90px]">Đơn vị</TableHead>
                <TableHead className="text-right w-[120px]">Đơn giá</TableHead>
                <TableHead className="text-right w-[130px]">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.lineItems.map((item) => (
                <TableRow key={item.stt}>
                  <TableCell className="text-center text-muted-foreground">{item.stt}</TableCell>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{item.quantity}</TableCell>
                  <TableCell className="text-muted-foreground">{item.unit}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums">{formatVND(item.unitPrice)}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums font-medium">{formatVND(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="mt-3 ml-auto w-full max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tạm tính:</span>
            <span className="font-mono tabular-nums">{formatVND(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT (10%):</span>
            <span className="font-mono tabular-nums">{formatVND(totals.vat)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Tổng cộng:</span>
            <span className="font-mono tabular-nums text-primary">{formatVND(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      {invoice.payments.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Lịch sử thanh toán
            </h4>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[120px]">Ngày TT</TableHead>
                    <TableHead className="text-right">Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoice.payments.map((p, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-sm">{p.date}</TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-emerald-600 font-medium">
                        {formatVND(p.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
                          {p.method}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}

      {invoice.payments.length === 0 && invoice.status !== "draft" && invoice.status !== "cancelled" && (
        <>
          <Separator />
          <div className="rounded-lg border border-dashed p-6 text-center">
            <CreditCard className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Chưa có thanh toán nào</p>
          </div>
        </>
      )}
    </div>
  )
}
