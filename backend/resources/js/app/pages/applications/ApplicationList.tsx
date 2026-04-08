import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  BriefcaseBusiness,
  Search,
  Filter,
  Sparkles,
} from "lucide-react"

type ApplicationStatus = "Mới" | "Đang xem" | "Phỏng vấn" | "Đã duyệt" | "Từ chối"

interface Application {
  id: string
  candidateName: string
  candidateInitials: string
  avatarBg: string
  position: string
  company: string
  appliedDate: string
  status: ApplicationStatus
}

const statusConfig: Record<ApplicationStatus, { className: string }> = {
  "Mới": {
    className: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  "Đang xem": {
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  "Phỏng vấn": {
    className: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  },
  "Đã duyệt": {
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  "Từ chối": {
    className: "bg-red-50 text-red-600 border-red-200/80 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
}

const mockApplications: Application[] = [
  {
    id: "1",
    candidateName: "Trần Văn Bình",
    candidateInitials: "TB",
    avatarBg: "from-blue-400 to-blue-600",
    position: "Kỹ sư phần mềm",
    company: "Công ty TNHH ABC",
    appliedDate: "05/04/2026",
    status: "Mới",
  },
  {
    id: "2",
    candidateName: "Nguyễn Thị Cẩm",
    candidateInitials: "NC",
    avatarBg: "from-violet-400 to-violet-600",
    position: "Nhân viên kế toán",
    company: "Tập đoàn XYZ",
    appliedDate: "04/04/2026",
    status: "Phỏng vấn",
  },
  {
    id: "3",
    candidateName: "Lê Hoàng Dũng",
    candidateInitials: "LD",
    avatarBg: "from-emerald-400 to-emerald-600",
    position: "Quản lý kho",
    company: "Công ty CP Logistics VN",
    appliedDate: "03/04/2026",
    status: "Đã duyệt",
  },
  {
    id: "4",
    candidateName: "Phạm Thị Hoa",
    candidateInitials: "PH",
    avatarBg: "from-amber-400 to-amber-600",
    position: "Nhân viên bán hàng",
    company: "Siêu thị BigMart",
    appliedDate: "02/04/2026",
    status: "Đang xem",
  },
  {
    id: "5",
    candidateName: "Hoàng Văn Phúc",
    candidateInitials: "HP",
    avatarBg: "from-rose-400 to-rose-600",
    position: "Lái xe tải",
    company: "Công ty Vận tải Miền Nam",
    appliedDate: "01/04/2026",
    status: "Từ chối",
  },
  {
    id: "6",
    candidateName: "Đặng Minh Tuấn",
    candidateInitials: "DT",
    avatarBg: "from-cyan-400 to-cyan-600",
    position: "Thợ điện công nghiệp",
    company: "Nhà máy Thành Công",
    appliedDate: "31/03/2026",
    status: "Mới",
  },
  {
    id: "7",
    candidateName: "Vũ Thị Lan",
    candidateInitials: "VL",
    avatarBg: "from-pink-400 to-pink-600",
    position: "Nhân viên may",
    company: "Công ty May Việt Tiến",
    appliedDate: "30/03/2026",
    status: "Phỏng vấn",
  },
  {
    id: "8",
    candidateName: "Bùi Quốc Anh",
    candidateInitials: "BA",
    avatarBg: "from-indigo-400 to-indigo-600",
    position: "Bảo vệ",
    company: "Công ty An ninh Thái Sơn",
    appliedDate: "29/03/2026",
    status: "Đã duyệt",
  },
]

type TabKey = "all" | "pending" | "interview" | "approved" | "rejected"

const tabFilters: Record<TabKey, ApplicationStatus[] | null> = {
  all: null,
  pending: ["Mới", "Đang xem"],
  interview: ["Phỏng vấn"],
  approved: ["Đã duyệt"],
  rejected: ["Từ chối"],
}

export function ApplicationList() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredApplications = mockApplications.filter((app) => {
    const statusFilter = tabFilters[activeTab]
    const matchesStatus = statusFilter === null || statusFilter.includes(app.status)
    const matchesSearch =
      searchQuery === "" ||
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const renderTable = (applications: Application[]) => (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-10 pl-6 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Ứng viên
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Vị trí
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Doanh nghiệp
              </TableHead>
              <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Ngày nộp
              </TableHead>
              <TableHead className="h-10 pr-6 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                  Không tìm thấy đơn ứng tuyển nào
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => {
                const config = statusConfig[app.status]
                return (
                  <TableRow
                    key={app.id}
                    className="group cursor-pointer border-0 transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="py-3 pl-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 shadow-sm">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${app.avatarBg} text-[10px] font-semibold text-white`}
                          >
                            {app.candidateInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-[13px] font-medium">{app.candidateName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-muted-foreground">
                      {app.position}
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-muted-foreground">
                      {app.company}
                    </TableCell>
                    <TableCell className="py-3 text-[13px] text-muted-foreground">
                      {app.appliedDate}
                    </TableCell>
                    <TableCell className="py-3 pr-6 text-right">
                      <Badge
                        variant="outline"
                        className={`rounded-md text-[11px] font-medium ${config.className}`}
                      >
                        {app.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Việc làm
              </span>
            </div>
            <h1 className="text-xl font-semibold">Quản lý ứng tuyển</h1>
            <p className="mt-1 text-sm text-white/70">
              Theo dõi và quản lý tất cả các đơn ứng tuyển từ ứng viên
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              size="sm"
              className="bg-white text-primary hover:bg-white/90 shadow-sm"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm ứng viên, vị trí, doanh nghiệp..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-1.5 h-3.5 w-3.5" />
          Bộ lọc
        </Button>
      </div>

      {/* Tabs + Table */}
      <Tabs defaultValue="all" onValueChange={(v) => setActiveTab(v as TabKey)}>
        <TabsList variant="line" className="mb-4">
          <TabsTrigger value="all">
            Tất cả
            <span className="ml-1.5 rounded-md bg-muted px-1.5 py-px text-[10px] font-semibold tabular-nums text-muted-foreground">
              {mockApplications.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="pending">Đang chờ</TabsTrigger>
          <TabsTrigger value="interview">Phỏng vấn</TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Từ chối</TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderTable(filteredApplications)}</TabsContent>
        <TabsContent value="pending">{renderTable(filteredApplications)}</TabsContent>
        <TabsContent value="interview">{renderTable(filteredApplications)}</TabsContent>
        <TabsContent value="approved">{renderTable(filteredApplications)}</TabsContent>
        <TabsContent value="rejected">{renderTable(filteredApplications)}</TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Hiển thị <span className="font-medium text-foreground">{filteredApplications.length}</span> trong tổng số{" "}
          <span className="font-medium text-foreground">{mockApplications.length}</span> đơn ứng tuyển
        </p>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" text="Trước" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" text="Sau" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
