import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useClients } from "@/hooks/use-clients"
import { useCreateStaffingOrder } from "@/hooks/use-staffing-orders"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  ArrowLeft,
  Building,
  Briefcase,
  Users,
  MapPin,
  AlertTriangle,
  Save,
  X,
  Loader2,
} from "lucide-react"
import type { CreateStaffingOrderDto, GenderRequirement, OrderUrgency, ServiceType } from "@/types"

// ─── Schema ─────────────────────────────────────────────────────────────────

const orderSchema = z.object({
  client_id: z.string().min(1, "Vui lòng chọn khách hàng"),
  position_name: z.string().min(1, "Vui lòng nhập vị trí cần tuyển"),
  job_description: z.string().min(10, "Mô tả công việc tối thiểu 10 ký tự"),
  quantity_needed: z.coerce.number().min(1, "Số lượng tối thiểu là 1"),
  gender_requirement: z.string().optional(),
  age_min: z.coerce.number().min(16).optional().or(z.literal("")),
  age_max: z.coerce.number().max(65).optional().or(z.literal("")),
  other_requirements: z.string().optional(),
  work_address: z.string().min(1, "Vui lòng nhập địa điểm làm việc"),
  work_district: z.string().optional(),
  work_city: z.string().optional(),
  start_date: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  end_date: z.string().optional(),
  shift_type: z.string().optional(),
  worker_rate: z.string().optional(),
  urgency: z.string().min(1, "Vui lòng chọn mức độ khẩn cấp"),
  service_type: z.string().min(1, "Vui lòng chọn loại dịch vụ"),
  notes: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

// ─── Sub-components ─────────────────────────────────────────────────────────

function FormField({
  label,
  required,
  error,
  children,
  className,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5">
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function OrderCreate() {
  const navigate = useNavigate()

  // Fetch clients for dropdown
  const { data: clientsData, isLoading: clientsLoading } = useClients({ per_page: 100 })
  const clients = clientsData?.data ?? []

  // Create mutation
  const createMutation = useCreateStaffingOrder()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      client_id: "",
      position_name: "",
      job_description: "",
      quantity_needed: 1,
      gender_requirement: "",
      age_min: "" as unknown as number,
      age_max: "" as unknown as number,
      other_requirements: "",
      work_address: "",
      work_district: "",
      work_city: "",
      start_date: "",
      end_date: "",
      shift_type: "",
      worker_rate: "",
      urgency: "normal",
      service_type: "",
      notes: "",
    },
  })

  const onSubmit = (data: OrderFormData) => {
    // Build the DTO from form data
    const dto: CreateStaffingOrderDto = {
      client_id: data.client_id,
      position_name: data.position_name,
      job_description: data.job_description || undefined,
      quantity_needed: data.quantity_needed,
      work_address: data.work_address || undefined,
      work_district: data.work_district || undefined,
      work_city: data.work_city || undefined,
      start_date: data.start_date,
      end_date: data.end_date || undefined,
      shift_type: data.shift_type || undefined,
      urgency: (data.urgency as OrderUrgency) || undefined,
      service_type: (data.service_type as ServiceType) || undefined,
      notes: data.notes || undefined,
      other_requirements: data.other_requirements || undefined,
    }

    // Add optional numeric fields
    if (data.gender_requirement && data.gender_requirement !== "") {
      dto.gender_requirement = data.gender_requirement as GenderRequirement
    }
    if (data.age_min && typeof data.age_min === "number") {
      dto.age_min = data.age_min
    }
    if (data.age_max && typeof data.age_max === "number") {
      dto.age_max = data.age_max
    }
    if (data.worker_rate) {
      const rate = parseFloat(data.worker_rate.replace(/[^0-9.]/g, ""))
      if (!isNaN(rate) && rate > 0) {
        dto.worker_rate = rate
      }
    }

    createMutation.mutate(dto, {
      onSuccess: (newOrder) => {
        navigate(`/orders/${newOrder.id}`)
      },
    })
  }

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
            <BreadcrumbLink render={<Link to="/orders" />}>Yêu cầu TD</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tạo yêu cầu mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/orders")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Tạo yêu cầu mới</h1>
          <p className="text-sm text-muted-foreground">
            Nhập thông tin yêu cầu tuyển dụng nhân sự từ khách hàng
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Client & Position */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building className="h-4 w-4 text-muted-foreground" />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Khách hàng"
                required
                error={errors.client_id?.message}
              >
                <Select
                  value={watch("client_id")}
                  onValueChange={(val) => setValue("client_id", val as string, { shouldValidate: true })}
                  disabled={clientsLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={clientsLoading ? "Đang tải..." : "Chọn khách hàng"} />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <FormField
                label="Loại dịch vụ"
                required
                error={errors.service_type?.message}
              >
                <Select
                  value={watch("service_type")}
                  onValueChange={(val) => setValue("service_type", val as string, { shouldValidate: true })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn loại dịch vụ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short_term">Thời vụ ngắn hạn</SelectItem>
                    <SelectItem value="long_term">Dài hạn</SelectItem>
                    <SelectItem value="shift_based">Theo ca</SelectItem>
                    <SelectItem value="project_based">Theo dự án</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Chi tiết công việc
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Vị trí cần tuyển"
                required
                error={errors.position_name?.message}
              >
                <Input
                  placeholder="VD: Công nhân đóng gói, Phục vụ nhà hàng..."
                  {...register("position_name")}
                />
              </FormField>

              <FormField
                label="Số lượng ứng viên"
                required
                error={errors.quantity_needed?.message}
              >
                <Input
                  type="number"
                  min={1}
                  placeholder="Nhập số lượng"
                  {...register("quantity_needed")}
                />
              </FormField>
            </div>

            <FormField
              label="Mô tả công việc"
              required
              error={errors.job_description?.message}
            >
              <Textarea
                placeholder="Mô tả chi tiết công việc, yêu cầu, quy trình làm việc..."
                rows={4}
                {...register("job_description")}
              />
            </FormField>

            <FormField
              label="Mức lương đề xuất"
              error={errors.worker_rate?.message}
            >
              <Input
                placeholder="VD: 280000 (VNĐ/ngày)"
                {...register("worker_rate")}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-muted-foreground" />
              Yêu cầu ứng viên
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Giới tính">
                <Select
                  value={watch("gender_requirement") ?? ""}
                  onValueChange={(val) => setValue("gender_requirement", val as string)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Không yêu cầu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Không yêu cầu</SelectItem>
                    <SelectItem value="male">Nam</SelectItem>
                    <SelectItem value="female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Tuổi từ">
                <Input
                  type="number"
                  min={16}
                  max={65}
                  placeholder="VD: 18"
                  {...register("age_min")}
                />
              </FormField>

              <FormField label="Tuổi đến">
                <Input
                  type="number"
                  min={16}
                  max={65}
                  placeholder="VD: 40"
                  {...register("age_max")}
                />
              </FormField>
            </div>

            <FormField label="Yêu cầu khác">
              <Textarea
                placeholder="VD: Biết lái xe nâng, có chứng chỉ VSATTP, tiếng Anh giao tiếp..."
                rows={2}
                {...register("other_requirements")}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Location & Schedule */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Địa điểm & Thời gian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Địa điểm làm việc"
              required
              error={errors.work_address?.message}
            >
              <Input
                placeholder="VD: KCN Tân Phú Trung, Củ Chi, TP.HCM"
                {...register("work_address")}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Quận/Huyện">
                <Input
                  placeholder="VD: Củ Chi"
                  {...register("work_district")}
                />
              </FormField>

              <FormField label="Tỉnh/Thành phố">
                <Input
                  placeholder="VD: TP.HCM"
                  {...register("work_city")}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Ngày bắt đầu"
                required
                error={errors.start_date?.message}
              >
                <Input type="date" {...register("start_date")} />
              </FormField>

              <FormField label="Ngày kết thúc" error={errors.end_date?.message}>
                <Input type="date" {...register("end_date")} />
              </FormField>
            </div>

            <FormField label="Ca làm việc">
              <Input
                placeholder="VD: Ca sáng 7:00-15:00, Ca chiều 15:00-23:00"
                {...register("shift_type")}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Priority & Notes */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              Ưu tiên & Ghi chú
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              label="Độ khẩn cấp"
              required
              error={errors.urgency?.message}
            >
              <Select
                value={watch("urgency")}
                onValueChange={(val) => setValue("urgency", val as string, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full sm:w-[240px]">
                  <SelectValue placeholder="Chọn mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Bình thường</SelectItem>
                  <SelectItem value="urgent">Gấp</SelectItem>
                  <SelectItem value="critical">Rất gấp</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Ghi chú thêm">
              <Textarea
                placeholder="Các lưu ý đặc biệt cho yêu cầu này..."
                rows={3}
                {...register("notes")}
              />
            </FormField>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/orders")}
            disabled={createMutation.isPending}
          >
            <X className="mr-1.5 h-3.5 w-3.5" />
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            {createMutation.isPending ? "Đang tạo..." : "Tạo yêu cầu"}
          </Button>
        </div>
      </form>
    </div>
  )
}
