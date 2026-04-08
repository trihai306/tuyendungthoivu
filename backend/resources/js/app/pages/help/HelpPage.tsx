import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Users,
  Building2,
  Home,
  Sparkles,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface FaqItem {
  question: string
  answer: string
}

interface FaqSection {
  title: string
  icon: LucideIcon
  iconBg: string
  items: FaqItem[]
}

const faqSections: FaqSection[] = [
  {
    title: "Tuyển dụng",
    icon: FileText,
    iconBg: "from-blue-500 to-blue-600",
    items: [
      {
        question: "Làm thế nào để đăng tin tuyển dụng mới?",
        answer: "Từ trang Tổng quan hoặc menu bên trái, chọn \"Tin tuyển dụng\" rồi nhấn nút \"Đăng tin mới\". Điền đầy đủ thông tin vị trí tuyển dụng, yêu cầu ứng viên và nhấn \"Đăng tin\" để hoàn tất.",
      },
      {
        question: "Tôi có thể chỉnh sửa tin tuyển dụng đã đăng không?",
        answer: "Có, bạn có thể chỉnh sửa tin tuyển dụng bất kỳ lúc nào. Vào trang \"Tin tuyển dụng\", tìm tin cần chỉnh sửa và nhấn biểu tượng chỉnh sửa hoặc vào chi tiết tin đó.",
      },
      {
        question: "Tin tuyển dụng được hiển thị trong bao lâu?",
        answer: "Mặc định, tin tuyển dụng sẽ được hiển thị trong 30 ngày kể từ ngày đăng. Bạn có thể gia hạn hoặc đóng tin sớm hơn tùy nhu cầu.",
      },
    ],
  },
  {
    title: "Ứng viên",
    icon: Users,
    iconBg: "from-emerald-500 to-emerald-600",
    items: [
      {
        question: "Làm sao để xem hồ sơ ứng viên?",
        answer: "Vào trang \"Ứng viên\" từ menu bên trái để xem danh sách tất cả ứng viên. Nhấn vào tên ứng viên để xem chi tiết hồ sơ, kinh nghiệm làm việc và trạng thái ứng tuyển.",
      },
      {
        question: "Tôi có thể lọc ứng viên theo tiêu chí nào?",
        answer: "Bạn có thể lọc ứng viên theo trạng thái (Mới, Đang xem, Phỏng vấn, Đã duyệt, Từ chối), theo vị trí ứng tuyển, doanh nghiệp, khu vực và nhiều tiêu chí khác.",
      },
    ],
  },
  {
    title: "Doanh nghiệp",
    icon: Building2,
    iconBg: "from-violet-500 to-violet-600",
    items: [
      {
        question: "Làm thế nào để thêm doanh nghiệp đối tác mới?",
        answer: "Vào trang \"Doanh nghiệp\" và nhấn \"Thêm doanh nghiệp\". Điền thông tin chi tiết về doanh nghiệp bao gồm tên, địa chỉ, ngành nghề và thông tin liên hệ.",
      },
      {
        question: "Doanh nghiệp có thể tự đăng tin tuyển dụng không?",
        answer: "Có, doanh nghiệp đối tác có tài khoản riêng và có thể tự đăng tin tuyển dụng sau khi được phê duyệt bởi quản trị viên hệ thống.",
      },
    ],
  },
  {
    title: "Nhà trọ",
    icon: Home,
    iconBg: "from-amber-500 to-amber-600",
    items: [
      {
        question: "Làm sao để quản lý danh sách nhà trọ?",
        answer: "Tính năng quản lý nhà trọ cho phép bạn thêm, chỉnh sửa và theo dõi tình trạng phòng trọ liên kết. Truy cập từ menu \"Quản lý trọ\" để bắt đầu.",
      },
      {
        question: "Tỷ lệ lấp đầy được tính như thế nào?",
        answer: "Tỷ lệ lấp đầy được tính dựa trên số phòng đang có người thuê chia cho tổng số phòng có sẵn trong hệ thống, cập nhật theo thời gian thực.",
      },
    ],
  },
]

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const filteredSections = faqSections
    .map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          searchQuery === "" ||
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-6 py-6 text-primary-foreground shadow-lg shadow-primary/10">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 right-20 h-32 w-32 rounded-full bg-white/5 blur-xl" />

        <div className="relative">
          <div className="mb-1 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-white/80" />
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Hỗ trợ
            </span>
          </div>
          <h1 className="text-xl font-semibold">Trợ giúp</h1>
          <p className="mt-1 text-sm text-white/70">
            Tìm câu trả lời cho các câu hỏi thường gặp và liên hệ hỗ trợ
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mx-auto max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm câu hỏi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 text-[13px]"
        />
      </div>

      {/* FAQ Sections */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <Card className="border-border/50 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                Không tìm thấy kết quả
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Thử tìm kiếm với từ khóa khác hoặc liên hệ hỗ trợ bên dưới
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSections.map((section) => (
            <Card key={section.title} className="border-border/50 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${section.iconBg} shadow-sm`}
                  >
                    <section.icon className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-[15px] font-semibold">
                    {section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="divide-y divide-border/70">
                  {section.items.map((item, idx) => {
                    const key = `${section.title}-${idx}`
                    const isOpen = openItems.has(key)
                    return (
                      <Collapsible
                        key={key}
                        open={isOpen}
                        onOpenChange={() => toggleItem(key)}
                      >
                        <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-left transition-colors hover:text-primary">
                          <span className="text-[13px] font-medium pr-4">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <p className="pb-3 text-[12px] leading-relaxed text-muted-foreground">
                            {item.answer}
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Contact support */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-5">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-[15px] font-semibold text-foreground">
                Cần hỗ trợ thêm?
              </h3>
              <p className="mt-1 text-[12px] text-muted-foreground">
                Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn. Liên hệ qua các kênh bên dưới.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Mail className="h-3 w-3" />
                  hotro@tuyendungnvtv.vn
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Phone className="h-3 w-3" />
                  1900 xxxx
                </Button>
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <MessageCircle className="h-3 w-3" />
                  Chat trực tuyến
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
