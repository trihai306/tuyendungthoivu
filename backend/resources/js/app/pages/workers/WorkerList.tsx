import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Search,
  Star,
  MapPin,
  UserCheck,
  Users,
} from "lucide-react"

// --- Types ---

interface Worker {
  id: string
  name: string
  initials: string
  city: string
  skills: string[]
  rating: number
  availability: "available" | "working" | "unavailable"
  avatarBg: string
  experience: string
}

// --- Mock data ---

const mockWorkers: Worker[] = [
  {
    id: "1",
    name: "Trần Văn Bình",
    initials: "TB",
    city: "Hồ Chí Minh",
    skills: ["React", "TypeScript", "Node.js", "TailwindCSS"],
    rating: 4.8,
    availability: "available",
    avatarBg: "from-blue-400 to-blue-600",
    experience: "3-5 năm",
  },
  {
    id: "2",
    name: "Nguyễn Thị Cẩm",
    initials: "NC",
    city: "Hà Nội",
    skills: ["Kế toán", "Excel", "SAP"],
    rating: 4.5,
    availability: "working",
    avatarBg: "from-violet-400 to-violet-600",
    experience: "5-10 năm",
  },
  {
    id: "3",
    name: "Lê Hoàng Dũng",
    initials: "LD",
    city: "Đà Nẵng",
    skills: ["Quản lý kho", "Logistics", "WMS", "Forklift"],
    rating: 4.2,
    availability: "available",
    avatarBg: "from-emerald-400 to-emerald-600",
    experience: "1-3 năm",
  },
  {
    id: "4",
    name: "Phạm Thị Lan",
    initials: "PL",
    city: "Hồ Chí Minh",
    skills: ["Bán hàng", "CRM", "Tư vấn"],
    rating: 4.9,
    availability: "available",
    avatarBg: "from-amber-400 to-amber-600",
    experience: "3-5 năm",
  },
  {
    id: "5",
    name: "Hoàng Văn Phú",
    initials: "HP",
    city: "Hải Phòng",
    skills: ["Lái xe", "Giao hàng"],
    rating: 4.0,
    availability: "unavailable",
    avatarBg: "from-rose-400 to-rose-600",
    experience: "Dưới 1 năm",
  },
  {
    id: "6",
    name: "Vũ Minh Quân",
    initials: "VQ",
    city: "Hà Nội",
    skills: ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"],
    rating: 4.7,
    availability: "working",
    avatarBg: "from-cyan-400 to-cyan-600",
    experience: "5-10 năm",
  },
  {
    id: "7",
    name: "Đặng Thị Hoa",
    initials: "DH",
    city: "Cần Thơ",
    skills: ["Marketing", "SEO", "Content", "Facebook Ads"],
    rating: 4.3,
    availability: "available",
    avatarBg: "from-pink-400 to-pink-600",
    experience: "3-5 năm",
  },
  {
    id: "8",
    name: "Bùi Thanh Sơn",
    initials: "BS",
    city: "Đà Nẵng",
    skills: ["Điện công nghiệp", "PLC", "Bảo trì"],
    rating: 4.6,
    availability: "available",
    avatarBg: "from-orange-400 to-orange-600",
    experience: "Trên 10 năm",
  },
]

const availabilityConfig = {
  available: {
    label: "Sẵn sàng",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  working: {
    label: "Đang làm việc",
    className: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  unavailable: {
    label: "Không khả dụng",
    className: "bg-gray-50 text-gray-500 border-gray-200/80 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20",
  },
} as const

const cities = ["Tất cả", "Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ"]
const availabilityOptions = ["Tất cả", "Sẵn sàng", "Đang làm việc", "Không khả dụng"]
const experienceOptions = ["Tất cả", "Dưới 1 năm", "1-3 năm", "3-5 năm", "5-10 năm", "Trên 10 năm"]

const availabilityFilterMap: Record<string, Worker["availability"] | null> = {
  "Tất cả": null,
  "Sẵn sàng": "available",
  "Đang làm việc": "working",
  "Không khả dụng": "unavailable",
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
                ? "fill-amber-400/50 text-amber-400"
                : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

export function WorkerList() {
  const [search, setSearch] = useState("")
  const [cityFilter, setCityFilter] = useState("Tất cả")
  const [availabilityFilter, setAvailabilityFilter] = useState("Tất cả")
  const [experienceFilter, setExperienceFilter] = useState("Tất cả")
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 6

  const filtered = useMemo(() => {
    return mockWorkers.filter((w) => {
      const matchSearch =
        !search ||
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))

      const matchCity = cityFilter === "Tất cả" || w.city === cityFilter

      const targetAvail = availabilityFilterMap[availabilityFilter]
      const matchAvailability = !targetAvail || w.availability === targetAvail

      const matchExperience = experienceFilter === "Tất cả" || w.experience === experienceFilter

      return matchSearch && matchCity && matchAvailability && matchExperience
    })
  }, [search, cityFilter, availabilityFilter, experienceFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Users className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">Ứng viên</h1>
        </div>
        <p className="text-sm text-muted-foreground">Danh sách ứng viên trong hệ thống</p>
      </div>

      {/* Search + Filters */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên, kỹ năng..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={cityFilter} onValueChange={(v) => { setCityFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[150px]">
                  <MapPin className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={(v) => { setAvailabilityFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <UserCheck className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {availabilityOptions.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={experienceFilter} onValueChange={(v) => { setExperienceFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kinh nghiệm" />
                </SelectTrigger>
                <SelectContent>
                  {experienceOptions.map((o) => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị <span className="font-medium text-foreground">{paginated.length}</span> / <span className="font-medium text-foreground">{filtered.length}</span> ứng viên
        </p>
      </div>

      {/* Grid */}
      {paginated.length === 0 ? (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-medium">Không tìm thấy ứng viên</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paginated.map((worker) => {
            const avail = availabilityConfig[worker.availability]
            return (
              <Card
                key={worker.id}
                className="group border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3.5">
                    <Avatar className="h-11 w-11 shadow-sm">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${worker.avatarBg} text-xs font-semibold text-white`}
                      >
                        {worker.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-medium leading-snug truncate">
                        {worker.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{worker.city}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`shrink-0 rounded-md text-[10px] font-medium ${avail.className}`}
                    >
                      {avail.label}
                    </Badge>
                  </div>

                  {/* Skills */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {worker.skills.slice(0, 3).map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="rounded-md text-[11px] font-normal"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {worker.skills.length > 3 && (
                      <Badge
                        variant="outline"
                        className="rounded-md text-[11px] font-normal text-muted-foreground"
                      >
                        +{worker.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Rating + Action */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3.5">
                    <StarRating rating={worker.rating} />
                    <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" render={<Link to={`/ung-vien/${worker.id}`} />}>
                      Xem hồ sơ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                text="Trước"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                text="Sau"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
