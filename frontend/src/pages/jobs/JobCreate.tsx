import { Link, useNavigate } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowLeft,
  Save,
  Send,
  Sparkles,
} from "lucide-react"

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const jobCreateSchema = z.object({
  title: z
    .string()
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  description: z
    .string()
    .min(20, "Mô tả công việc phải có ít nhất 20 ký tự"),
  requirements: z
    .string()
    .min(10, "Yêu cầu phải có ít nhất 10 ký tự"),
  benefits: z
    .string()
    .min(10, "Quyền lợi phải có ít nhất 10 ký tự"),
  salaryMin: z.coerce
    .number({ message: "Vui lòng nhập số" })
    .min(0, "Lương tối thiểu không được âm"),
  salaryMax: z.coerce
    .number({ message: "Vui lòng nhập số" })
    .min(0, "Lương tối đa không được âm"),
  salaryType: z.enum(["hourly", "daily", "monthly"], {
    message: "Vui lòng chọn kiểu lương",
  }),
  city: z.string().min(1, "Vui lòng chọn thành phố"),
  district: z.string().min(1, "Vui lòng nhập quận/huyện"),
  address: z.string().min(5, "Vui lòng nhập địa chỉ cụ thể"),
  jobType: z.enum(["full-time", "part-time", "seasonal"], {
    message: "Vui lòng chọn loại công việc",
  }),
  positions: z.coerce
    .number({ message: "Vui lòng nhập số" })
    .min(1, "Số lượng phải từ 1 trở lên")
    .max(100, "Số lượng không vượt quá 100"),
  startDate: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  endDate: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
}).refine(
  (data) => data.salaryMax >= data.salaryMin,
  {
    message: "Lương tối đa phải lớn hơn hoặc bằng lương tối thiểu",
    path: ["salaryMax"],
  }
)

type JobCreateFormData = z.infer<typeof jobCreateSchema>

// ─── Sub-components ──────────────────────────────────────────────────────────

function FormField({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[13px]">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-[12px] text-destructive">{error}</p>
      )}
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function JobCreate() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<JobCreateFormData>({
    resolver: zodResolver(jobCreateSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      benefits: "",
      salaryMin: 0,
      salaryMax: 0,
      salaryType: "monthly",
      city: "",
      district: "",
      address: "",
      jobType: "full-time",
      positions: 1,
      startDate: "",
      endDate: "",
    },
  })

  const onSubmit = (data: JobCreateFormData) => {
    // TODO: Call API to create job posting
    console.log("Submit job:", data)
    navigate("/tin-tuyen-dung")
  }

  const onSaveDraft = () => {
    // TODO: Save draft
    console.log("Save draft")
  }

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
            <BreadcrumbPage>Đăng tin mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white/80" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Tạo mới
            </span>
          </div>
          <h1 className="text-xl font-semibold">Đăng tin tuyển dụng mới</h1>
          <p className="mt-1 text-sm text-white/70">
            Điền đầy đủ thông tin để đăng tin tuyển dụng của bạn
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Info Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold">
              Thông tin cơ bản
            </CardTitle>
            <CardDescription>
              Thông tin chính về vị trí tuyển dụng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Tiêu đề tin tuyển dụng"
              error={errors.title?.message}
              required
            >
              <Input
                placeholder="Ví dụ: Nhân viên phục vụ nhà hàng"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
            </FormField>

            <FormField
              label="Mô tả công việc"
              error={errors.description?.message}
              required
            >
              <Textarea
                placeholder="Mô tả chi tiết về công việc, nhiệm vụ chính..."
                className="min-h-28"
                {...register("description")}
                aria-invalid={!!errors.description}
              />
            </FormField>

            <FormField
              label="Yêu cầu ứng viên"
              error={errors.requirements?.message}
              required
            >
              <Textarea
                placeholder="Các yêu cầu về trình độ, kinh nghiệm, kỹ năng..."
                className="min-h-24"
                {...register("requirements")}
                aria-invalid={!!errors.requirements}
              />
            </FormField>

            <FormField
              label="Quyền lợi"
              error={errors.benefits?.message}
              required
            >
              <Textarea
                placeholder="Lương, thưởng, bảo hiểm, phụ cấp..."
                className="min-h-24"
                {...register("benefits")}
                aria-invalid={!!errors.benefits}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Salary Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold">
              Mức lương
            </CardTitle>
            <CardDescription>
              Thiết lập mức lương cho vị trí này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                label="Lương tối thiểu (VNĐ)"
                error={errors.salaryMin?.message}
                required
              >
                <Input
                  type="number"
                  placeholder="5000000"
                  {...register("salaryMin")}
                  aria-invalid={!!errors.salaryMin}
                />
              </FormField>

              <FormField
                label="Lương tối đa (VNĐ)"
                error={errors.salaryMax?.message}
                required
              >
                <Input
                  type="number"
                  placeholder="10000000"
                  {...register("salaryMax")}
                  aria-invalid={!!errors.salaryMax}
                />
              </FormField>

              <FormField
                label="Kiểu lương"
                error={errors.salaryType?.message}
                required
              >
                <Controller
                  name="salaryType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={!!errors.salaryType}
                      >
                        <SelectValue placeholder="Chọn kiểu lương" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Theo giờ</SelectItem>
                        <SelectItem value="daily">Theo ngày</SelectItem>
                        <SelectItem value="monthly">Theo tháng</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Location Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold">
              Địa điểm làm việc
            </CardTitle>
            <CardDescription>
              Nơi làm việc của vị trí này
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField
                label="Thành phố"
                error={errors.city?.message}
                required
              >
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={!!errors.city}
                      >
                        <SelectValue placeholder="Chọn thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                        <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                        <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                        <SelectItem value="Nha Trang">Nha Trang</SelectItem>
                        <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                        <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField
                label="Quận/Huyện"
                error={errors.district?.message}
                required
              >
                <Input
                  placeholder="Ví dụ: Hai Bà Trưng"
                  {...register("district")}
                  aria-invalid={!!errors.district}
                />
              </FormField>

              <FormField
                label="Địa chỉ cụ thể"
                error={errors.address?.message}
                required
              >
                <Input
                  placeholder="Số nhà, tên đường..."
                  {...register("address")}
                  aria-invalid={!!errors.address}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Job Details Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-[15px] font-semibold">
              Chi tiết tuyển dụng
            </CardTitle>
            <CardDescription>
              Thông tin bổ sung về vị trí tuyển dụng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FormField
                label="Loại công việc"
                error={errors.jobType?.message}
                required
              >
                <Controller
                  name="jobType"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={!!errors.jobType}
                      >
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">
                          Toàn thời gian
                        </SelectItem>
                        <SelectItem value="part-time">
                          Bán thời gian
                        </SelectItem>
                        <SelectItem value="seasonal">
                          Thời vụ
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField
                label="Số lượng tuyển"
                error={errors.positions?.message}
                required
              >
                <Input
                  type="number"
                  min={1}
                  max={100}
                  placeholder="1"
                  {...register("positions")}
                  aria-invalid={!!errors.positions}
                />
              </FormField>

              <FormField
                label="Ngày bắt đầu"
                error={errors.startDate?.message}
                required
              >
                <Input
                  type="date"
                  {...register("startDate")}
                  aria-invalid={!!errors.startDate}
                />
              </FormField>

              <FormField
                label="Ngày kết thúc"
                error={errors.endDate?.message}
                required
              >
                <Input
                  type="date"
                  {...register("endDate")}
                  aria-invalid={!!errors.endDate}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-4 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            render={<Link to="/tin-tuyen-dung" />}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Quay lại
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onSaveDraft}
            >
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Lưu nháp
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              {isSubmitting ? "Đang đăng..." : "Đăng tin"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
