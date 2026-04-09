import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardList,
  Building2,
  Users,
  Route,
  CalendarCheck,
  Banknote,
  Receipt,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ChevronsUpDown,
  UserCog,
  Shield,
  User as UserIcon,
  Target,
  DollarSign,
  Wallet,
  type LucideIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/auth-store"
import { useLogout } from "@/hooks/use-auth"
import { hasPermission, type User } from "@/types/user"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: number
  permission?: string // Permission required to see this item
}

// Vận hành - Operations
const mainNav: NavItem[] = [
  { title: "Tổng quan", href: "/", icon: LayoutDashboard },
  { title: "Yêu cầu tuyển dụng", href: "/orders", icon: ClipboardList, permission: "orders.view" },
  { title: "Khách hàng", href: "/clients", icon: Building2, permission: "clients.view" },
  { title: "Ứng viên", href: "/workers", icon: Users, permission: "workers.view" },
  { title: "Điều phối", href: "/dispatch", icon: Route, permission: "assignments.view" },
  { title: "Chấm công", href: "/attendance", icon: CalendarCheck, permission: "attendance.view" },
]

// Tài chính - Finance
const financeNav: NavItem[] = [
  { title: "Bảng lương Workers", href: "/payroll", icon: Banknote, permission: "payroll.view" },
  { title: "Lương nhân viên", href: "/staff-payroll", icon: Wallet, permission: "staff_payroll.view" },
  { title: "Hóa đơn", href: "/invoices", icon: Receipt, permission: "invoices.view" },
  { title: "Doanh thu", href: "/revenue", icon: DollarSign, permission: "revenue.view" },
  { title: "Báo cáo", href: "/reports", icon: BarChart3, permission: "reports.view" },
]

// Quản lý - Management
const managementNav: NavItem[] = [
  { title: "KPI nhân viên", href: "/kpi", icon: Target, permission: "kpi.view" },
  { title: "Cấu hình KPI", href: "/kpi/config", icon: Settings, permission: "kpi.config" },
]

// Hệ thống - System
const systemNav: NavItem[] = [
  { title: "Nhân sự nội bộ", href: "/staff", icon: UserCog, permission: "users.manage" },
  { title: "Phân quyền", href: "/roles", icon: Shield, permission: "roles.manage" },
  { title: "Cài đặt", href: "/settings", icon: Settings, permission: "settings.manage" },
]

interface SidebarNavProps {
  open?: boolean
  onClose?: () => void
}

export function AppSidebar({ open = true, onClose }: SidebarNavProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logoutMutation = useLogout()

  const userName = user?.name ?? "Người dùng"
  const userInitials = userName.split(" ").map((w) => w[0]).join("").slice(-2).toUpperCase()
  const userRole = user?.position ?? user?.roles?.[0]?.display_name ?? ""

  const filterByPermission = (items: NavItem[]): NavItem[] =>
    items.filter((item) => !item.permission || hasPermission(user, item.permission))

  const renderNavSection = (label: string, items: NavItem[]) => {
    const visible = filterByPermission(items)
    if (visible.length === 0) return null
    return (
      <>
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
            {label}
          </p>
          <div className="space-y-0.5">
            {visible.map(renderNavItem)}
          </div>
        </div>
        <div className="mx-3 h-px bg-border/70" />
      </>
    )
  }

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
          "fixed left-0 top-14 z-40 flex h-[calc(100vh-3.5rem)] w-[248px] flex-col border-r border-border/70 bg-sidebar transition-transform duration-200 ease-in-out md:relative md:top-0 md:h-full md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-6">
            {renderNavSection("Vận hành", mainNav)}
            {renderNavSection("Tài chính", financeNav)}
            {renderNavSection("Quản lý", managementNav)}
            {renderNavSection("Hệ thống", systemNav)}
          </div>
        </nav>

        <div className="shrink-0 border-t border-border/70 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent focus:outline-none">
                <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-primary text-[11px] font-semibold text-primary-foreground">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="truncate text-sm font-medium leading-tight">{userName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{userRole}</p>
                </div>
                <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[220px]">
              <div className="px-2 py-1.5">
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                <UserIcon className="h-4 w-4" />
                Thông tin cá nhân
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4" />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-4 w-4" />
                {logoutMutation.isPending ? "Đang đăng xuất..." : "Đăng xuất"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  )
}
