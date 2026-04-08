import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Settings as SettingsIcon,
  Camera,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"

export function Settings() {
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [smsNotif, setSmsNotif] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <SettingsIcon className="h-4 w-4 text-white/80" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Hệ thống
            </span>
          </div>
          <h1 className="text-xl font-semibold">Cài đặt</h1>
          <p className="mt-1 text-sm text-white/70">
            Quản lý thông tin tài khoản, thông báo và bảo mật
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="account">
        <TabsList variant="line" className="mb-6">
          <TabsTrigger value="account">Tài khoản</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>

        {/* Account Tab */}
        <TabsContent value="account">
          <div className="space-y-6">
            {/* Avatar section */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[15px] font-semibold">Ảnh đại diện</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-5">
                  <div className="relative group">
                    <Avatar size="lg" className="h-20 w-20 ring-4 ring-primary/10">
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-lg font-semibold text-primary-foreground">
                        NV
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" />
                    </button>
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-foreground">Nguyễn Văn A</p>
                    <p className="text-[11px] text-muted-foreground">Quản trị viên</p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        Tải ảnh lên
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                        Xóa
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile form */}
            <Card className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-[15px] font-semibold">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullName" className="text-[13px]">Họ và tên</Label>
                    <Input
                      id="fullName"
                      defaultValue="Nguyễn Văn A"
                      className="text-[13px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[13px]">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="nguyenvana@example.com"
                      className="text-[13px]"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="phone" className="text-[13px]">Số điện thoại</Label>
                    <Input
                      id="phone"
                      type="tel"
                      defaultValue="0912 345 678"
                      className="text-[13px]"
                    />
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  <Button size="sm">
                    Lưu thay đổi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[15px] font-semibold">Cài đặt thông báo</CardTitle>
              <p className="text-xs text-muted-foreground">
                Chọn cách bạn muốn nhận thông báo từ hệ thống
              </p>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/70">
                {/* Email notifications */}
                <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
                      <Mail className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Thông báo email</p>
                      <p className="text-[11px] text-muted-foreground">
                        Nhận thông báo qua email khi có cập nhật mới
                      </p>
                    </div>
                  </div>
                  <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
                </div>

                {/* Push notifications */}
                <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 shadow-sm">
                      <Bell className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Thông báo đẩy</p>
                      <p className="text-[11px] text-muted-foreground">
                        Nhận thông báo đẩy trên trình duyệt
                      </p>
                    </div>
                  </div>
                  <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
                </div>

                {/* SMS notifications */}
                <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-sm">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Thông báo SMS</p>
                      <p className="text-[11px] text-muted-foreground">
                        Nhận tin nhắn SMS cho các thông báo quan trọng
                      </p>
                    </div>
                  </div>
                  <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
                </div>

                {/* Mobile notifications */}
                <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
                      <Smartphone className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-foreground">Thông báo di động</p>
                      <p className="text-[11px] text-muted-foreground">
                        Nhận thông báo qua ứng dụng di động
                      </p>
                    </div>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <CardTitle className="text-[15px] font-semibold">Đổi mật khẩu</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">
                Đảm bảo tài khoản của bạn được bảo mật bằng mật khẩu mạnh
              </p>
            </CardHeader>
            <CardContent>
              <div className="max-w-md space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="oldPassword" className="text-[13px]">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu hiện tại"
                      className="pr-9 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="text-[13px]">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="pr-9 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-[13px]">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      className="pr-9 text-[13px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="pt-2">
                  <Button size="sm">
                    Đổi mật khẩu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
