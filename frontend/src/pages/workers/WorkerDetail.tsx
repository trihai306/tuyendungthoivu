import { useParams, Link } from "react-router-dom"
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
import {
  ArrowLeft,
  Star,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  CalendarCheck,
  Briefcase,
  GraduationCap,
  User,
  Send,
  FileText,
  BarChart3,
} from "lucide-react"

// --- Types ---

interface WorkerDetail {
  id: string
  name: string
  initials: string
  city: string
  skills: string[]
  rating: number
  availability: "available" | "working" | "unavailable"
  avatarBg: string
  experience: string
  experienceYears: number
  bio: string
  email: string
  phone: string
  education: string
  experienceHistory: { company: string; role: string; period: string; description: string }[]
  applicationCount: number
}

// --- Mock data ---

const mockWorkerDetails: Record<string, WorkerDetail> = {
  "1": {
    id: "1",
    name: "Trần Văn Bình",
    initials: "TB",
    city: "Hồ Chí Minh",
    skills: ["React", "TypeScript", "Node.js", "TailwindCSS", "PostgreSQL", "Docker"],
    rating: 4.8,
    availability: "available",
    avatarBg: "from-blue-400 to-blue-600",
    experience: "3-5 năm",
    experienceYears: 4,
    bio: "Lập trình viên Full-stack với hơn 4 năm kinh nghiệm phát triển ứng dụng web. Đam mê xây dựng giao diện người dùng thân thiện và hiệu suất cao. Có kinh nghiệm làm việc với các dự án quy mô lớn, từ startup đến doanh nghiệp.",
    email: "tran.b****@gmail.com",
    phone: "0912 *** 456",
    education: "Cử nhân Công nghệ Thông tin - Đại học Bách Khoa TP.HCM",
    experienceHistory: [
      { company: "Công ty ABC Tech", role: "Senior Frontend Developer", period: "2023 - Hiện tại", description: "Phát triển giao diện React cho hệ thống ERP, quản lý đội nhóm 4 người." },
      { company: "Startup XYZ", role: "Full-stack Developer", period: "2021 - 2023", description: "Xây dựng ứng dụng SaaS từ đầu sử dụng React + Node.js." },
    ],
    applicationCount: 12,
  },
  "2": {
    id: "2",
    name: "Nguyễn Thị Cẩm",
    initials: "NC",
    city: "Hà Nội",
    skills: ["Kế toán", "Excel", "SAP", "Thuế", "Kiểm toán"],
    rating: 4.5,
    availability: "working",
    avatarBg: "from-violet-400 to-violet-600",
    experience: "5-10 năm",
    experienceYears: 7,
    bio: "Kế toán viên có chứng chỉ hành nghề với 7 năm kinh nghiệm trong lĩnh vực kế toán - tài chính. Thành thạo các phần mềm kế toán phổ biến, có khả năng xử lý sổ sách và báo cáo thuế cho doanh nghiệp vừa và lớn.",
    email: "nguyen.c****@gmail.com",
    phone: "0987 *** 321",
    education: "Cử nhân Kế toán - Đại học Kinh tế Quốc dân",
    experienceHistory: [
      { company: "Tập đoàn Vingroup", role: "Kế toán trưởng", period: "2020 - Hiện tại", description: "Quản lý kế toán tổng hợp, báo cáo tài chính hàng quý." },
      { company: "Công ty TNHH Hoàng Anh", role: "Kế toán viên", period: "2017 - 2020", description: "Kế toán công nợ, thuế GTGT, TNCN." },
    ],
    applicationCount: 5,
  },
  "3": {
    id: "3",
    name: "Lê Hoàng Dũng",
    initials: "LD",
    city: "Đà Nẵng",
    skills: ["Quản lý kho", "Logistics", "WMS", "Forklift", "Excel"],
    rating: 4.2,
    availability: "available",
    avatarBg: "from-emerald-400 to-emerald-600",
    experience: "1-3 năm",
    experienceYears: 2,
    bio: "Nhân viên kho vận năng động với 2 năm kinh nghiệm quản lý hàng hóa. Có chứng chỉ lái xe nâng và thành thạo hệ thống quản lý kho WMS. Luôn đảm bảo hàng hóa được xuất nhập chính xác và đúng thời hạn.",
    email: "le.d****@gmail.com",
    phone: "0965 *** 789",
    education: "Cao đẳng Logistics - Đại học Đà Nẵng",
    experienceHistory: [
      { company: "Công ty Giao hàng Nhanh", role: "Quản lý kho khu vực", period: "2023 - Hiện tại", description: "Quản lý kho trung tâm miền Trung, điều phối 15 nhân viên." },
      { company: "Lazada Express", role: "Nhân viên kho", period: "2022 - 2023", description: "Phân loại, kiểm kê và xuất nhập hàng hóa." },
    ],
    applicationCount: 8,
  },
}

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

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
                ? "fill-amber-400/50 text-amber-400"
                : "fill-muted text-muted"
          }`}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-muted-foreground">{rating.toFixed(1)}</span>
    </div>
  )
}

export function WorkerDetail() {
  const { id } = useParams<{ id: string }>()
  const worker = mockWorkerDetails[id ?? "1"] ?? mockWorkerDetails["1"]
  const avail = availabilityConfig[worker.availability]

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        render={<Link to="/candidates" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Danh sách ứng viên
      </Button>

      {/* Hero Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40">
          <div className="absolute -bottom-2 -right-4 h-20 w-20 rounded-full bg-white/10 blur-xl" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-8">
            <Avatar className="h-20 w-20 shadow-lg ring-4 ring-card">
              <AvatarFallback
                className={`bg-gradient-to-br ${worker.avatarBg} text-xl font-semibold text-white`}
              >
                {worker.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl font-semibold tracking-tight">{worker.name}</h1>
                <Badge
                  variant="outline"
                  className={`rounded-md text-[11px] font-medium ${avail.className}`}
                >
                  {avail.label}
                </Badge>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {worker.city}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {worker.experience}
                </span>
              </div>
              <div className="mt-2">
                <StarRating rating={worker.rating} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Bio */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <User className="h-4 w-4 text-primary" />
                Giới thiệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{worker.bio}</p>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Star className="h-4 w-4 text-primary" />
                Kỹ năng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-md px-2.5 py-1 text-xs font-normal"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <Briefcase className="h-4 w-4 text-primary" />
                Kinh nghiệm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {worker.experienceHistory.map((exp, i) => (
                  <div key={i}>
                    {i > 0 && <Separator className="mb-4" />}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                        <Briefcase className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{exp.role}</h4>
                        <p className="text-xs text-muted-foreground">{exp.company}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground/70">{exp.period}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                <GraduationCap className="h-4 w-4 text-primary" />
                Học vấn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/10 to-violet-500/5">
                  <GraduationCap className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium">{worker.education}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Contact info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{worker.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Điện thoại</p>
                    <p className="text-sm font-medium">{worker.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4 space-y-2.5">
              <Button className="w-full gap-2" size="lg">
                <Send className="h-4 w-4" />
                Gửi tin nhắn
              </Button>
              <Button variant="outline" className="w-full gap-2" size="lg">
                <CalendarCheck className="h-4 w-4" />
                Mời phỏng vấn
              </Button>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Thống kê</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Số lần ứng tuyển
                  </div>
                  <span className="text-sm font-semibold">{worker.applicationCount}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <BarChart3 className="h-4 w-4" />
                    Đánh giá trung bình
                  </div>
                  <span className="text-sm font-semibold">{worker.rating.toFixed(1)}/5.0</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    Kinh nghiệm
                  </div>
                  <span className="text-sm font-semibold">{worker.experienceYears} năm</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Phản hồi
                  </div>
                  <span className="text-sm font-semibold">Nhanh</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
