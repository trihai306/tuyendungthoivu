import { useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Users,
  Building2,
  Wallet,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ReportCategory {
  title: string
  description: string
  icon: LucideIcon
  iconBg: string
  stats: string
  badge: string
  badgeColor: string
  link: string
}

const reportCategories: ReportCategory[] = [
  {
    title: "Yêu cầu tuyển dụng",
    description: "Hiệu quả xử lý YCTD, tỷ lệ hoàn thành đơn hàng, thời gian trung bình đáp ứng và năng suất điều phối",
    icon: BarChart3,
    iconBg: "from-blue-500 to-blue-600",
    stats: "Tỷ lệ hoàn thành: 68%",
    badge: "12 báo cáo",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    link: "/orders",
  },
  {
    title: "Ứng viên",
    description: "Phân tích pool ứng viên theo khu vực, kỹ năng, tình trạng sẵn sàng, đánh giá và lịch sử làm việc",
    icon: Users,
    iconBg: "from-emerald-500 to-emerald-600",
    stats: "573 ứng viên trong pool",
    badge: "8 báo cáo",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    link: "/workers",
  },
  {
    title: "Khách hàng",
    description: "Hoạt động khách hàng, số lượng đơn hàng, doanh thu theo khách hàng và đánh giá mức độ hài lòng",
    icon: Building2,
    iconBg: "from-violet-500 to-violet-600",
    stats: "48 khách hàng đối tác",
    badge: "6 báo cáo",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-200/80 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
    link: "/employers",
  },
  {
    title: "Tài chính",
    description: "Tổng hợp doanh thu, chi phí lương, lợi nhuận theo đơn hàng, công nợ khách hàng và tình trạng thanh toán",
    icon: Wallet,
    iconBg: "from-amber-500 to-amber-600",
    stats: "Doanh thu tháng: 1.2 tỷ",
    badge: "5 báo cáo",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    link: "/payroll",
  },
]

export function Reports() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative flex items-center justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white/80" />
              <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
                Phân tích
              </span>
            </div>
            <h1 className="text-xl font-semibold">Báo cáo & Thống kê</h1>
            <p className="mt-1 text-sm text-white/70">
              Tổng hợp dữ liệu và phân tích hiệu quả hoạt động của hệ thống
            </p>
          </div>
        </div>
      </div>

      {/* Development notice */}
      <Card className="border-amber-200/80 bg-amber-50/50 shadow-sm dark:border-amber-500/20 dark:bg-amber-500/5">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-medium text-amber-800 dark:text-amber-300">
              Tính năng đang phát triển
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              Các báo cáo chi tiết sẽ được cập nhật trong phiên bản tiếp theo. Hiện tại bạn có thể xem tổng quan các danh mục báo cáo.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Report categories grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {reportCategories.map((category) => (
          <Card
            key={category.title}
            className="group border-border/50 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${category.iconBg} shadow-sm`}
                >
                  <category.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-semibold text-foreground">
                      {category.title}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`rounded-md text-[10px] font-medium ${category.badgeColor}`}
                    >
                      {category.badge}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-[12px] leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      {category.stats}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 text-[11px] font-medium text-primary hover:text-primary"
                      onClick={() => navigate(category.link)}
                    >
                      Xem chi tiết
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
