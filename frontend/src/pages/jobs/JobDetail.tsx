import { useParams, Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  CalendarDays,
  Building2,
  Briefcase,
  Send,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type JobType = "full-time" | "part-time" | "seasonal"

interface JobDetail {
  id: string
  title: string
  company: string
  companyInitials: string
  companyGradient: string
  companyIndustry: string
  companySize: string
  location: string
  address: string
  salaryMin: number
  salaryMax: number
  jobType: JobType
  postedAt: string
  deadline: string
  positions: number
  views: number
  description: string[]
  requirements: string[]
  benefits: string[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const JOB_TYPE_CONFIG: Record<
  JobType,
  { label: string; className: string }
> = {
  "full-time": {
    label: "Toàn thời gian",
    className:
      "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  "part-time": {
    label: "Bán thời gian",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  seasonal: {
    label: "Thời vụ",
    className:
      "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_JOBS: Record<string, JobDetail> = {
  "1": {
    id: "1",
    title: "Nhân viên phục vụ nhà hàng",
    company: "Công ty TNHH Thực phẩm Việt",
    companyInitials: "TV",
    companyGradient: "from-blue-400 to-blue-600",
    companyIndustry: "Dịch vụ ăn uống",
    companySize: "50-100 nhân viên",
    location: "Hà Nội",
    address: "Số 12, Phố Huế, Hai Bà Trưng, Hà Nội",
    salaryMin: 5000000,
    salaryMax: 8000000,
    jobType: "full-time",
    postedAt: "05/04/2026",
    deadline: "05/05/2026",
    positions: 5,
    views: 234,
    description: [
      "Phục vụ khách hàng tại nhà hàng, đảm bảo chất lượng dịch vụ tốt nhất.",
      "Tiếp nhận order, tư vấn thực đơn cho khách hàng.",
      "Sắp xếp bàn ghế, chuẩn bị dụng cụ trước giờ mở cửa.",
      "Phối hợp với bộ phận bếp để đảm bảo thức ăn được phục vụ đúng thời gian.",
      "Dịn dẹp khu vực làm việc sau ca.",
    ],
    requirements: [
      "Nam/nữ từ 18-35 tuổi, ngoại hình khá.",
      "Ưu tiên có kinh nghiệm phục vụ nhà hàng/khách sạn.",
      "Giao tiếp tốt, thái độ thân thiện, chuyên nghiệp.",
      "Chịu được áp lực công việc cao điểm.",
      "Sẵn sàng làm việc theo ca (sáng/chiều/tối).",
    ],
    benefits: [
      "Mức lương cạnh tranh: 5 - 8 triệu VNĐ/tháng.",
      "Thưởng tháng theo doanh số, thưởng lễ tết.",
      "Đóng BHXH, BHYT, BHTN đầy đủ theo quy định.",
      "Được đào tạo nghiệp vụ miễn phí.",
      "Bữa ăn ca miễn phí, môi trường làm việc năng động.",
      "Cơ hội thăng tiến lên vị trí quản lý.",
    ],
  },
  "2": {
    id: "2",
    title: "Lễ tân khách sạn",
    company: "Khách sạn Sunrise",
    companyInitials: "SR",
    companyGradient: "from-violet-400 to-violet-600",
    companyIndustry: "Khách sạn - Nghỉ dưỡng",
    companySize: "100-200 nhân viên",
    location: "Đà Nẵng",
    address: "Số 88, Đường Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
    salaryMin: 6000000,
    salaryMax: 10000000,
    jobType: "full-time",
    postedAt: "05/04/2026",
    deadline: "30/04/2026",
    positions: 3,
    views: 189,
    description: [
      "Đón tiếp và làm thủ tục check-in/check-out cho khách.",
      "Tư vấn và hỗ trợ khách hàng về dịch vụ khách sạn.",
      "Xử lý các yêu cầu, khiếu nại của khách một cách chuyên nghiệp.",
      "Phối hợp với các bộ phận khác để đảm bảo trải nghiệm khách hàng.",
    ],
    requirements: [
      "Tốt nghiệp Cao đẳng/Đại học chuyên ngành khách sạn hoặc tương đương.",
      "Tiếng Anh giao tiếp tốt (TOEIC 550+).",
      "Kinh nghiệm từ 1 năm tại vị trí lễ tân.",
      "Ngoại hình ưa nhìn, giao tiếp chuyên nghiệp.",
    ],
    benefits: [
      "Lương 6 - 10 triệu VNĐ/tháng + phụ cấp.",
      "Được cung cấp chỗ ở miễn phí (nếu có nhu cầu).",
      "Bảo hiểm đầy đủ, 12 ngày phép/năm.",
      "Cơ hội làm việc trong môi trường quốc tế.",
    ],
  },
  "3": {
    id: "3",
    title: "Nhân viên bán hàng",
    company: "Siêu thị MegaMart",
    companyInitials: "MM",
    companyGradient: "from-emerald-400 to-emerald-600",
    companyIndustry: "Bán lẻ",
    companySize: "200-500 nhân viên",
    location: "Hồ Chí Minh",
    address: "Số 456, Nguyễn Văn Linh, Quận 7, TP.HCM",
    salaryMin: 4500000,
    salaryMax: 7000000,
    jobType: "part-time",
    postedAt: "04/04/2026",
    deadline: "20/04/2026",
    positions: 10,
    views: 312,
    description: [
      "Tư vấn và hỗ trợ khách mua hàng.",
      "Sắp xếp, trưng bày hàng hóa trên kệ.",
      "Kiểm tra hạn sử dụng và chất lượng sản phẩm.",
      "Hỗ trợ thu ngân khi cần thiết.",
    ],
    requirements: [
      "Từ 18 tuổi trở lên, nhận sinh viên làm thêm.",
      "Vui vẻ, nhiệt tình, yêu thích công việc bán hàng.",
      "Có thể làm ca linh hoạt.",
    ],
    benefits: [
      "Lương 4.5 - 7 triệu VNĐ/tháng tùy ca.",
      "Giảm giá ưu đãi khi mua hàng tại siêu thị.",
      "Môi trường làm việc trẻ trung, năng động.",
    ],
  },
  "4": {
    id: "4",
    title: "Phụ bếp nhà hàng",
    company: "Nhà hàng Phố Xanh",
    companyInitials: "PX",
    companyGradient: "from-amber-400 to-amber-600",
    companyIndustry: "Dịch vụ ăn uống",
    companySize: "20-50 nhân viên",
    location: "Hà Nội",
    address: "Số 78, Phố Tây Sơn, Đống Đa, Hà Nội",
    salaryMin: 4000000,
    salaryMax: 6000000,
    jobType: "full-time",
    postedAt: "04/04/2026",
    deadline: "25/04/2026",
    positions: 2,
    views: 98,
    description: [
      "Hỗ trợ đầu bếp chuẩn bị nguyên liệu.",
      "Sơ chế rau củ, thịt cá theo yêu cầu.",
      "Vệ sinh khu vực bếp sau mỗi ca làm.",
    ],
    requirements: [
      "Nam từ 18-40 tuổi, sức khỏe tốt.",
      "Chịu khó, cẩn thận, sạch sẽ.",
      "Không yêu cầu kinh nghiệm, được đào tạo.",
    ],
    benefits: [
      "Lương 4 - 6 triệu VNĐ/tháng.",
      "Bao ăn ca, bao ở.",
      "Tăng lương 6 tháng/lần.",
    ],
  },
  "5": {
    id: "5",
    title: "Nhân viên dọn phòng",
    company: "Resort Biển Xanh",
    companyInitials: "BX",
    companyGradient: "from-rose-400 to-rose-600",
    companyIndustry: "Khách sạn - Nghỉ dưỡng",
    companySize: "100-200 nhân viên",
    location: "Nha Trang",
    address: "Bãi Dài, Cam Ranh, Khánh Hòa",
    salaryMin: 5000000,
    salaryMax: 7500000,
    jobType: "seasonal",
    postedAt: "03/04/2026",
    deadline: "30/04/2026",
    positions: 8,
    views: 156,
    description: [
      "Dọn dẹp phòng khách theo tiêu chuẩn resort 5 sao.",
      "Thay ga giường, khăn tắm, bổ sung đồ dùng.",
      "Báo cáo tình trạng trang thiết bị trong phòng.",
    ],
    requirements: [
      "Nữ từ 18-45 tuổi.",
      "Sức khỏe tốt, chịu được công việc thể chất.",
      "Cẩn thận, tỉ mỉ, trách nhiệm.",
    ],
    benefits: [
      "Lương 5 - 7.5 triệu VNĐ/tháng + phụ cấp mùa vụ.",
      "Bao ở, bao ăn 3 bữa/ngày.",
      "Tổ chức teambuilding, du lịch hàng năm.",
    ],
  },
  "6": {
    id: "6",
    title: "Bảo vệ tòa nhà",
    company: "Công ty An Ninh Sài Gòn",
    companyInitials: "SG",
    companyGradient: "from-cyan-400 to-cyan-600",
    companyIndustry: "Dịch vụ bảo vệ",
    companySize: "200-500 nhân viên",
    location: "Hồ Chí Minh",
    address: "Số 100, Nguyễn Thị Minh Khai, Quận 1, TP.HCM",
    salaryMin: 5500000,
    salaryMax: 8000000,
    jobType: "full-time",
    postedAt: "02/04/2026",
    deadline: "20/04/2026",
    positions: 4,
    views: 201,
    description: [
      "Bảo vệ an ninh trật tự tại tòa nhà văn phòng.",
      "Kiểm tra, hướng dẫn khách ra vào tòa nhà.",
      "Giám sát camera an ninh, xử lý sự cố.",
      "Ghi chép sổ trực, báo cáo hàng ngày.",
    ],
    requirements: [
      "Nam từ 20-45 tuổi, sức khỏe tốt.",
      "Xuất ngũ hoặc có chứng chỉ nghiệp vụ bảo vệ.",
      "Trung thực, kỷ luật, chịu khó.",
    ],
    benefits: [
      "Lương 5.5 - 8 triệu VNĐ/tháng.",
      "Được trang bị đồng phục miễn phí.",
      "Bảo hiểm đầy đủ, thưởng lễ tết.",
      "Cơ hội thăng tiến lên tổ trưởng, đội trưởng.",
    ],
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatSalary(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu`
  }
  return new Intl.NumberFormat("vi-VN").format(amount)
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContentSection({
  title,
  items,
  icon: Icon,
}: {
  title: string
  items: string[]
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
      </div>
      <ul className="space-y-2 pl-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[13px] text-muted-foreground leading-relaxed">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <span className="text-[13px] font-medium text-foreground">{value}</span>
    </div>
  )
}

// ─── Not Found ───────────────────────────────────────────────────────────────

function JobNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Briefcase className="h-8 w-8 text-muted-foreground" />
      </div>
      <h2 className="mt-4 text-[15px] font-semibold">Không tìm thấy tin tuyển dụng</h2>
      <p className="mt-1 text-[13px] text-muted-foreground">
        Tin tuyển dụng này không tồn tại hoặc đã bị xóa.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        render={<Link to="/tin-tuyen-dung" />}
      >
        <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
        Quay lại danh sách
      </Button>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function JobDetail() {
  const { id } = useParams<{ id: string }>()
  const job = id ? MOCK_JOBS[id] : undefined

  if (!job) {
    return <JobNotFound />
  }

  const typeConfig = JOB_TYPE_CONFIG[job.jobType]

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/" />}>
              Trang chủ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/tin-tuyen-dung" />}>
              Tin tuyển dụng
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{job.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Card */}
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 h-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
          <CardContent className="relative p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 rounded-xl shadow-sm">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${job.companyGradient} rounded-xl text-sm font-semibold text-white`}
                  >
                    {job.companyInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">
                    {job.title}
                  </h1>
                  <p className="mt-0.5 text-[13px] text-muted-foreground">
                    {job.company}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`rounded-md text-[11px] font-medium ${typeConfig.className}`}
                    >
                      {typeConfig.label}
                    </Badge>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      {formatSalary(job.salaryMin)} - {formatSalary(job.salaryMax)} VNĐ/tháng
                    </span>
                    <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      Đăng ngày {job.postedAt}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                className="shrink-0 sm:self-start"
                render={<Link to={`/tin-tuyen-dung/${job.id}/ung-tuyen`} />}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Ứng tuyển ngay
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-4 lg:col-span-2">
          <Card className="border-border/50 shadow-sm">
            <CardContent className="p-6 space-y-6">
              <ContentSection
                title="Mô tả công việc"
                items={job.description}
                icon={Briefcase}
              />
              <Separator />
              <ContentSection
                title="Yêu cầu ứng viên"
                items={job.requirements}
                icon={Users}
              />
              <Separator />
              <ContentSection
                title="Quyền lợi"
                items={job.benefits}
                icon={CheckCircle2}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Company Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">
                Thông tin công ty
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl">
                  <AvatarFallback
                    className={`bg-gradient-to-br ${job.companyGradient} rounded-xl text-[10px] font-semibold text-white`}
                  >
                    {job.companyInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[13px] font-semibold text-foreground">
                    {job.company}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {job.companyIndustry}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-0">
                <MetaItem
                  icon={Building2}
                  label="Quy mô"
                  value={job.companySize}
                />
                <MetaItem
                  icon={MapPin}
                  label="Địa chỉ"
                  value={job.address}
                />
              </div>
            </CardContent>
          </Card>

          {/* Apply Button */}
          <Button
            className="w-full"
            size="lg"
            render={<Link to={`/tin-tuyen-dung/${job.id}/ung-tuyen`} />}
          >
            <Send className="mr-1.5 h-4 w-4" />
            Ứng tuyển ngay
          </Button>

          {/* Job Meta */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">
                Thông tin tuyển dụng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0 divide-y divide-border">
                <MetaItem
                  icon={Users}
                  label="Số lượng tuyển"
                  value={`${job.positions} người`}
                />
                <MetaItem
                  icon={CalendarDays}
                  label="Hạn nộp hồ sơ"
                  value={job.deadline}
                />
                <MetaItem
                  icon={Eye}
                  label="Lượt xem"
                  value={`${job.views} lượt`}
                />
                <MetaItem
                  icon={Clock}
                  label="Ngày đăng"
                  value={job.postedAt}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Jobs */}
      <div className="space-y-4">
        <h2 className="text-[15px] font-semibold text-foreground">
          Tin tuyển dụng liên quan
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(MOCK_JOBS)
            .filter((j) => j.id !== job.id)
            .slice(0, 3)
            .map((relatedJob) => {
              const relTypeConfig = JOB_TYPE_CONFIG[relatedJob.jobType]
              return (
                <Link
                  key={relatedJob.id}
                  to={`/tin-tuyen-dung/${relatedJob.id}`}
                  className="block"
                >
                  <Card className="group relative overflow-hidden border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 rounded-xl">
                          <AvatarFallback
                            className={`bg-gradient-to-br ${relatedJob.companyGradient} rounded-xl text-[10px] font-semibold text-white`}
                          >
                            {relatedJob.companyInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[14px] font-semibold leading-snug text-foreground group-hover:text-primary transition-colors truncate">
                            {relatedJob.title}
                          </h3>
                          <p className="mt-0.5 text-[12px] text-muted-foreground truncate">
                            {relatedJob.company}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span>{relatedJob.location}</span>
                        <span className="mx-1">·</span>
                        <DollarSign className="h-3 w-3 shrink-0" />
                        <span>
                          {formatSalary(relatedJob.salaryMin)} -{" "}
                          {formatSalary(relatedJob.salaryMax)} VNĐ
                        </span>
                      </div>
                      <div className="mt-3">
                        <Badge
                          variant="outline"
                          className={`rounded-md text-[11px] font-medium ${relTypeConfig.className}`}
                        >
                          {relTypeConfig.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
        </div>
      </div>

      {/* Back link */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          render={<Link to="/tin-tuyen-dung" />}
        >
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          Quay lại danh sách tin tuyển dụng
        </Button>
      </div>
    </div>
  )
}
