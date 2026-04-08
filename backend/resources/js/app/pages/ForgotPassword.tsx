import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
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
import { ArrowLeft, Building2, CheckCircle, Loader2 } from "lucide-react"
import { useForgotPassword } from "@/hooks/use-auth"

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không hợp lệ"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const forgotPasswordMutation = useForgotPassword()
  const isLoading = forgotPasswordMutation.isPending

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null)
    try {
      await forgotPasswordMutation.mutateAsync(data)
      setIsSuccess(true)
    } catch (error: any) {
      setServerError(error.message ?? "Không thể gửi yêu cầu. Vui lòng thử lại sau.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-md space-y-6">
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
          {isSuccess ? (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardTitle className="text-xl">Kiểm tra email</CardTitle>
                <CardDescription>
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
                  Vui lòng kiểm tra hộp thư đến (và thư rác) để tiếp tục.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to="/login">Quay lại đăng nhập</Link>
                </Button>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Quên mật khẩu</CardTitle>
                <CardDescription>
                  Nhập email đăng ký để nhận hướng dẫn đặt lại mật khẩu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {serverError && (
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                      {serverError}
                    </div>
                  )}

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

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Gửi yêu cầu
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </CardContent>
            </>
          )}
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          &copy; 2026 NVTV Staffing. All rights reserved.
        </p>
      </div>
    </div>
  )
}
