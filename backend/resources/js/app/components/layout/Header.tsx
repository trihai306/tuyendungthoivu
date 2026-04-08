import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationDropdown } from "@/components/layout/NotificationDropdown"
import {
  Menu,
  Search,
  Command,
} from "lucide-react"

interface HeaderProps {
  onMenuToggle?: () => void
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-border/50 bg-card/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-full items-center gap-4 px-4 lg:px-6">
        <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" onClick={onMenuToggle}>
          <Menu className="h-4 w-4" />
        </Button>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-sm shadow-primary/25">
            <span className="text-[11px] font-bold text-primary-foreground tracking-tight">NV</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[15px] font-semibold tracking-tight">NVTV</span>
            <span className="ml-1 text-[15px] font-normal text-muted-foreground">Staffing</span>
          </div>
        </Link>

        <div className="ml-2 hidden flex-1 md:block md:max-w-sm">
          <button className="flex h-9 w-full items-center gap-2 rounded-lg border border-border/70 bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/70">
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Tìm kiếm...</span>
            <kbd className="pointer-events-none hidden rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:inline-block">
              <Command className="mr-0.5 inline h-2.5 w-2.5" />K
            </kbd>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden">
            <Search className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          <NotificationDropdown />
        </div>
      </div>
    </header>
  )
}
