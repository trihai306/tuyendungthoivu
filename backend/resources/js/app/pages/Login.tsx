import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Eye, EyeOff, ArrowRight } from "lucide-react"
import { useLogin } from "@/hooks/use-auth"

const loginSchema = z.object({
  login: z.string().min(1, "Vui lòng nhập email hoặc số điện thoại"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu").min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const loginMutation = useLogin()
  const isLoading = loginMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "" },
  })

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null)
    try {
      await loginMutation.mutateAsync(data)
    } catch (error: any) {
      setServerError(error.message ?? "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left - Branding */}
      <div className="relative hidden w-[55%] overflow-hidden lg:block">
        {/* Full gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-primary to-violet-700" />

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />

        {/* Decorative blobs */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="relative flex h-full flex-col justify-between p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 shadow-lg shadow-black/5 backdrop-blur-sm">
              <span className="text-sm font-bold text-white">NV</span>
            </div>
            <div>
              <span className="text-lg font-bold text-white">NVTV</span>
              <span className="ml-1.5 text-lg text-white/70">Tuyển Dụng</span>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Hệ thống đang hoạt động
              </div>
              <h1 className="text-[42px] font-bold leading-[1.1] tracking-tight text-white">
                Nền tảng quản lý<br />tuyển dụng<br />
                <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                  thế hệ mới
                </span>
              </h1>
              <p className="max-w-md text-[15px] leading-relaxed text-white/60">
                Quản lý toàn bộ quy trình tuyển dụng, phân công công việc, theo dõi hiệu suất và quản lý nhà trọ liên kết trên một nền tảng duy nhất.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {[
                { value: "500+", label: "Doanh nghiệp" },
                { value: "10K+", label: "Ứng viên" },
                { value: "98%", label: "Hài lòng" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-white/30">
            © 2026 NVTV Tuyển Dụng. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex w-full items-center justify-center bg-background px-6 py-12 lg:w-[45%]">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="mb-10 flex flex-col items-center gap-3 lg:hidden">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-primary/25">
              <span className="text-base font-bold text-white">NV</span>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">NVTV Tuyển Dụng</p>
              <p className="text-xs text-muted-foreground">Hệ thống quản lý tuyển dụng</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-[26px] font-bold tracking-tight">Chào mừng trở lại</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Đăng nhập để tiếp tục sử dụng hệ thống
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {serverError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="login" className="text-[13px] font-medium">Email hoặc Số điện thoại</Label>
              <Input
                id="login"
                type="text"
                placeholder="name@company.com hoặc 0912345678"
                className="h-11 rounded-xl border-border/70 bg-muted/30 transition-all focus:bg-background"
                aria-invalid={!!errors.login}
                disabled={isLoading}
                {...register("login")}
              />
              {errors.login && <p className="text-xs text-destructive">{errors.login.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[13px] font-medium">Mật khẩu</Label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 rounded-xl border-border/70 bg-muted/30 pr-10 transition-all focus:bg-background"
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" disabled={isLoading} />
              <label htmlFor="remember" className="text-[13px] leading-none text-muted-foreground">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <Button type="submit" className="h-11 w-full rounded-xl text-[13px] font-semibold" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="mr-2 h-4 w-4" />
              )}
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/70" /></div>
          </div>

          <p className="text-center text-[13px] text-muted-foreground">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="font-semibold text-primary hover:text-primary/80 transition-colors">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
