import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff } from "lucide-react"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setServerError(null)
    try {
      console.log("Login data:", data)
      await new Promise((resolve) => setTimeout(resolve, 1500))
    } catch {
      setServerError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute left-1/2 top-1/3 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-sm font-bold text-white">NV</span>
            </div>
            <span className="text-xl font-semibold text-white">NVTV Tuyển Dụng</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-bold leading-tight text-white">
            Hệ thống quản lý<br />tuyển dụng thông minh
          </h1>
          <p className="max-w-md text-base leading-relaxed text-white/70">
            Quản lý toàn bộ quy trình tuyển dụng, phân công công việc, theo dõi hiệu suất nhân viên và quản lý nhà trọ liên kết trên một nền tảng duy nhất.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/60">Doanh nghiệp</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-sm text-white/60">Ứng viên</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">98%</p>
              <p className="text-sm text-white/60">Hài lòng</p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          © 2026 NVTV Tuyển Dụng. All rights reserved.
        </p>
      </div>

      {/* Right side - Login form */}
      <div className="flex w-full items-center justify-center bg-background px-6 lg:w-1/2">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="flex flex-col items-center space-y-2 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <span className="text-sm font-bold text-primary-foreground">NV</span>
            </div>
            <span className="text-lg font-semibold">NVTV Tuyển Dụng</span>
          </div>

          {/* Header */}
          <div className="space-y-2 lg:space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight">Đăng nhập</h2>
            <p className="text-sm text-muted-foreground">
              Nhập thông tin tài khoản để truy cập hệ thống quản lý
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                className="h-11"
                aria-invalid={!!errors.email}
                disabled={isLoading}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary/80"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pr-10"
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" disabled={isLoading} />
              <label
                htmlFor="remember"
                className="text-sm leading-none text-muted-foreground"
              >
                Ghi nhớ đăng nhập
              </label>
            </div>

            <Button type="submit" className="h-11 w-full text-sm font-medium" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Đăng nhập
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-medium text-primary hover:text-primary/80">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
