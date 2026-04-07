import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  Home,
  FileText,
  Users,
  Building,
  BriefcaseBusiness,
  CalendarDays,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: number
}

const mainNav: NavItem[] = [
  { title: "Tổng quan", href: "/", icon: Home },
  { title: "Tin tuyển dụng", href: "/tin-tuyen-dung", icon: FileText, badge: 12 },
  { title: "Ứng viên", href: "/ung-vien", icon: Users, badge: 48 },
  { title: "Doanh nghiệp", href: "/doanh-nghiep", icon: Building },
  { title: "Việc làm", href: "/viec-lam", icon: BriefcaseBusiness },
  { title: "Lịch phỏng vấn", href: "/lich-phong-van", icon: CalendarDays },
]

const secondaryNav: NavItem[] = [
  { title: "Báo cáo", href: "/bao-cao", icon: BarChart3 },
  { title: "Cài đặt", href: "/cai-dat", icon: Settings },
  { title: "Trợ giúp", href: "/tro-giup", icon: HelpCircle },
]

interface SidebarNavProps {
  open?: boolean
  onClose?: () => void
}

export function AppSidebar({ open = true, onClose }: SidebarNavProps) {
  const location = useLocation()

  const renderNavItem = (item: NavItem) => {
    const isActive = location.pathname === item.href
    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onClose}
        className={cn(
          "group relative flex items-center gap-3 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all duration-150",
          isActive
            ? "bg-primary text-primary-foreground shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-primary-foreground")} />
        <span className="truncate">{item.title}</span>
        {item.badge != null && (
          <span className={cn(
            "ml-auto rounded-md px-1.5 py-px text-[10px] font-semibold tabular-nums leading-relaxed",
            isActive
              ? "bg-white/20 text-primary-foreground"
              : "bg-muted text-muted-foreground"
          )}>
            {item.badge}
          </span>
        )}
        {isActive && !item.badge && (
          <ChevronRight className="ml-auto h-3 w-3 opacity-50" />
        )}
      </Link>
    )
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-[248px] flex-col border-r border-border/70 bg-sidebar transition-transform duration-200 ease-in-out md:sticky md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            <div>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
                Quản lý
              </p>
              <div className="space-y-0.5">
                {mainNav.map(renderNavItem)}
              </div>
            </div>

            <div className="mx-3 h-px bg-border/70" />

            <div>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
                Hệ thống
              </p>
              <div className="space-y-0.5">
                {secondaryNav.map(renderNavItem)}
              </div>
            </div>
          </div>
        </nav>

        <div className="border-t border-border/70 p-3">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent">
            <Avatar className="h-8 w-8 ring-2 ring-primary/10">
              <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[11px] font-semibold text-primary-foreground">
                NV
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium leading-tight">Nguyễn Văn A</p>
              <p className="truncate text-[11px] text-muted-foreground">Quản trị viên</p>
            </div>
            <button className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
