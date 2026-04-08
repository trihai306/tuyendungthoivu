import { useParams, Link } from "react-router-dom"
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
  ArrowLeft,
  MapPin,
  Building2,
  Users,
  Globe,
  BadgeCheck,
  FileText,
  Star,
  Briefcase,
  Mail,
  Phone,
  ExternalLink,
  Clock,
} from "lucide-react"

// --- Types ---

interface JobPost {
  id: string
  title: string
  salary: string
  type: string
  postedAt: string
  applicants: number
}

interface EmployerDetail {
  id: string
  name: string
  initials: string
  industry: string
  city: string
  address: string
  size: string
  website: string
  verified: boolean
  logoBg: string
  description: string
  founded: string
  email: string
  phone: string
  totalJobs: number
  totalApplicants: number
  rating: number
  openJobs: JobPost[]
}

// --- Mock data ---

const mockEmployerDetails: Record<string, EmployerDetail> = {
  "1": {
    id: "1",
    name: "FPT Software",
    initials: "FP",
    industry: "Công nghệ thông tin",
    city: "Hồ Chí Minh",
    address: "Lô T2, Đường D1, Khu Công nghệ cao, TP. Thủ Đức",
    size: "1000+ nhân viên",
    website: "https://fpt-software.com",
    verified: true,
    logoBg: "from-orange-400 to-orange-600",
    description: "FPT Software là công ty công nghệ hàng đầu Việt Nam, chuyên cung cấp dịch vụ phần mềm và giải pháp chuyển đổi số cho khách hàng toàn cầu. Với hơn 20 năm kinh nghiệm, FPT Software đã có mặt tại 27 quốc gia và vùng lãnh thổ, phục vụ hơn 1000 khách hàng bao gồm gần 100 công ty Fortune Global 500.\n\nMôi trường làm việc tại FPT Software được đánh giá năng động, sáng tạo với nhiều cơ hội phát triển nghề nghiệp. Công ty đầu tư mạnh vào đào tạo nhân sự và phát triển công nghệ mới.",
    founded: "1999",
    email: "hr@fpt-software.com",
    phone: "(028) 7300 7300",
    totalJobs: 45,
    totalApplicants: 1250,
    rating: 4.5,
    openJobs: [
      { id: "j1", title: "Senior React Developer", salary: "25-40 triệu", type: "Toàn thời gian", postedAt: "2 ngày trước", applicants: 15 },
      { id: "j2", title: "DevOps Engineer", salary: "30-45 triệu", type: "Toàn thời gian", postedAt: "3 ngày trước", applicants: 8 },
      { id: "j3", title: "Business Analyst", salary: "20-30 triệu", type: "Toàn thời gian", postedAt: "1 tuần trước", applicants: 22 },
      { id: "j4", title: "QA Tester", salary: "15-22 triệu", type: "Toàn thời gian", postedAt: "1 tuần trước", applicants: 18 },
    ],
  },
  "2": {
    id: "2",
    name: "Vingroup",
    initials: "VG",
    industry: "Bất động sản",
    city: "Hà Nội",
    address: "Số 7, đường Bằng Lăng 1, KĐT Vinhomes Riverside, Long Biên",
    size: "5000+ nhân viên",
    website: "https://vingroup.net",
    verified: true,
    logoBg: "from-red-400 to-red-600",
    description: "Vingroup là tập đoàn kinh tế tư nhân lớn nhất Việt Nam, hoạt động trong nhiều lĩnh vực bao gồm bất động sản, công nghệ, công nghiệp, thương mại và dịch vụ. Tập đoàn được thành lập với sứ mệnh 'Vì một cuộc sống tốt đẹp hơn cho người Việt Nam'.\n\nVingroup hiện có hệ sinh thái đa dạng với các thương hiệu nổi tiếng như Vinhomes, VinFast, VinSmart, Vinmec, Vinschool. Đây là nơi lý tưởng cho những ai muốn phát triển sự nghiệp trong môi trường chuyên nghiệp, quy mô lớn.",
    founded: "1993",
    email: "tuyendung@vingroup.net",
    phone: "(024) 3974 9999",
    totalJobs: 78,
    totalApplicants: 3500,
    rating: 4.3,
    openJobs: [
      { id: "j5", title: "Kế toán tổng hợp", salary: "18-25 triệu", type: "Toàn thời gian", postedAt: "1 ngày trước", applicants: 30 },
      { id: "j6", title: "Quản lý dự án BĐS", salary: "35-50 triệu", type: "Toàn thời gian", postedAt: "3 ngày trước", applicants: 12 },
      { id: "j7", title: "Nhân viên kinh doanh", salary: "15-20 triệu + hoa hồng", type: "Toàn thời gian", postedAt: "5 ngày trước", applicants: 45 },
    ],
  },
  "3": {
    id: "3",
    name: "Tiki Corporation",
    initials: "TK",
    industry: "Thương mại điện tử",
    city: "Hồ Chí Minh",
    address: "52 Út Tịch, Phường 4, Quận Tân Bình",
    size: "500-1000 nhân viên",
    website: "https://tiki.vn",
    verified: true,
    logoBg: "from-blue-400 to-blue-600",
    description: "Tiki là một trong những sàn thương mại điện tử hàng đầu tại Việt Nam, được thành lập năm 2010. Với tầm nhìn trở thành nền tảng thương mại điện tử tốt nhất Việt Nam, Tiki liên tục đầu tư vào công nghệ, logistics và trải nghiệm khách hàng.\n\nTiki được biết đến với dịch vụ giao hàng nhanh TikiNOW (giao trong 2 giờ) và cam kết về sản phẩm chính hãng 100%.",
    founded: "2010",
    email: "careers@tiki.vn",
    phone: "(028) 3636 8080",
    totalJobs: 32,
    totalApplicants: 890,
    rating: 4.2,
    openJobs: [
      { id: "j8", title: "Product Manager", salary: "30-45 triệu", type: "Toàn thời gian", postedAt: "1 ngày trước", applicants: 20 },
      { id: "j9", title: "Data Engineer", salary: "25-40 triệu", type: "Toàn thời gian", postedAt: "4 ngày trước", applicants: 10 },
    ],
  },
}

const industryColors: Record<string, string> = {
  "Công nghệ thông tin": "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  "Bất động sản": "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  "Thương mại điện tử": "bg-cyan-50 text-cyan-700 border-cyan-200/80 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20",
}

export function EmployerDetail() {
  const { id } = useParams<{ id: string }>()
  const employer = mockEmployerDetails[id ?? "1"] ?? mockEmployerDetails["1"]
  const industryColor = industryColors[employer.industry] ?? "bg-gray-50 text-gray-700 border-gray-200/80"

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2"
        render={<Link to="/employers" />}
      >
        <ArrowLeft className="h-4 w-4" />
        Danh sách doanh nghiệp
      </Button>

      {/* Hero Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative h-28 bg-gradient-to-r from-primary/80 via-primary/60 to-primary/40">
          <div className="absolute -bottom-4 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          <div className="absolute top-4 right-10 h-16 w-16 rounded-full bg-white/5 blur-lg" />
        </div>
        <CardContent className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
            <div
              className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${employer.logoBg} shadow-lg ring-4 ring-card`}
            >
              <span className="text-2xl font-bold text-white">{employer.initials}</span>
            </div>
            <div className="flex-1 sm:pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight">{employer.name}</h1>
                {employer.verified && (
                  <BadgeCheck className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <Badge
                  variant="outline"
                  className={`rounded-md text-[11px] font-medium ${industryColor}`}
                >
                  {employer.industry}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {employer.city}
                </span>
                <a
                  href={employer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <Globe className="h-3.5 w-3.5" />
                  Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="about">
            <TabsList variant="line" className="mb-4">
              <TabsTrigger value="about">Giới thiệu</TabsTrigger>
              <TabsTrigger value="jobs">
                Tin tuyển dụng
                <Badge variant="secondary" className="ml-1.5 rounded-md text-[10px] h-4 px-1.5">
                  {employer.openJobs.length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* About tab */}
            <TabsContent value="about">
              <div className="space-y-4">
                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-[15px] font-semibold">
                      <Building2 className="h-4 w-4 text-primary" />
                      Giới thiệu công ty
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                      {employer.description.split("\n\n").map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[15px] font-semibold">Thông tin chung</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                          <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Ngành nghề</p>
                          <p className="text-sm font-medium">{employer.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                          <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Quy mô</p>
                          <p className="text-sm font-medium">{employer.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
                          <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Năm thành lập</p>
                          <p className="text-sm font-medium">{employer.founded}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
                          <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[11px] text-muted-foreground">Địa chỉ</p>
                          <p className="text-sm font-medium">{employer.address}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Jobs tab */}
            <TabsContent value="jobs">
              <div className="space-y-3">
                {employer.openJobs.map((job) => (
                  <Card key={job.id} className="group border-border/50 shadow-sm transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium truncate">{job.title}</h3>
                          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {job.type}
                            </span>
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              {job.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {job.postedAt}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                            <Users className="h-3 w-3" />
                            <span>{job.applicants} ứng viên đã ứng tuyển</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0 h-7 text-xs">
                          Chi tiết
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
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
                    Tổng tin tuyển dụng
                  </div>
                  <span className="text-sm font-semibold">{employer.totalJobs}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Tổng ứng viên
                  </div>
                  <span className="text-sm font-semibold">{employer.totalApplicants.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-4 w-4" />
                    Đánh giá
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold">{employer.rating.toFixed(1)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    Đang tuyển
                  </div>
                  <Badge variant="secondary" className="rounded-md text-[11px]">
                    {employer.openJobs.length} vị trí
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Liên hệ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{employer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
                    <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">Điện thoại</p>
                    <p className="text-sm font-medium">{employer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-500/10">
                    <Globe className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground">Website</p>
                    <a
                      href={employer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline truncate block"
                    >
                      {employer.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-4">
              <Button className="w-full gap-2" size="lg">
                <Mail className="h-4 w-4" />
                Liên hệ tuyển dụng
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
