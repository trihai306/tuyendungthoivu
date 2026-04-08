import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Building2, Loader2, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRegister } from "@/hooks/use-auth"

const VN_PHONE_REGEX = /^(0|\+84)(3[2-9]|5[2689]|7[06-9]|8[1-9]|9[0-9])\d{7}$/

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Vui lòng nhập họ tên")
      .min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z
      .string()
      .min(1, "Vui lòng nhập email")
      .email("Email không hợp lệ"),
    phone: z
      .string()
      .min(1, "Vui lòng nhập số điện thoại")
      .regex(VN_PHONE_REGEX, "Số điện thoại không hợp lệ (VD: 0912345678)"),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z
      .string()
      .min(1, "Vui lòng xác nhận mật khẩu"),
    role: z.enum(["worker", "employer", "staff"], {
      error: "Vui lòng chọn vai trò",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface RoleOption {
  value: RegisterFormData["role"]
  label: string
  description: string
  icon: LucideIcon
}

const roleOptions: RoleOption[] = [
  {
    value: "worker",
    label: "Lao động thời vụ",
    description: "Đăng ký nhận việc thời vụ",
    icon: Users,
  },
  {
    value: "employer",
    label: "Khách hàng",
    description: "Doanh nghiệp cần nhân sự",
    icon: Building2,
  },
  {
    value: "staff",
    label: "Nhân viên nội bộ",
    description: "Điều phối & vận hành",
    icon: Briefcase,
  },
]

export function Register() {
  const [serverError, setServerError] = useState<string | null>(null)
  const registerMutation = useRegister()
  const isLoading = registerMutation.isPending

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null)
    try {
      await registerMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        role: data.role,
        phone: data.phone || undefined,
      })
    } catch (error: any) {
      setServerError(error.message ?? "Đăng ký thất bại. Vui lòng thử lại sau.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">NVTV Staffing</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Hệ thống quản lý cung ứng nhân sự thời vụ
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Đăng ký tài khoản</CardTitle>
            <CardDescription>
              Tạo tài khoản để bắt đầu sử dụng hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {serverError}
                </div>
              )}

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  aria-invalid={!!errors.name}
                  disabled={isLoading}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  aria-invalid={!!errors.email}
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0912345678"
                  aria-invalid={!!errors.phone}
                  disabled={isLoading}
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.confirmPassword}
                  disabled={isLoading}
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>Bạn là</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-3 gap-3">
                      {roleOptions.map((option) => {
                        const isSelected = field.value === option.value
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            type="button"
                            disabled={isLoading}
                            onClick={() => field.onChange(option.value)}
                            className={cn(
                              "flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-all hover:bg-muted/50",
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border",
                              isLoading && "pointer-events-none opacity-50"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                                isSelected
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-xs font-medium leading-tight">
                                {option.label}
                              </p>
                              <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                                {option.description}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                />
                {errors.role && (
                  <p className="text-xs text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng ký
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 NVTV Staffing. All rights reserved.
        </p>
      </div>
    </div>
  )
}
