import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  DollarSign,
  Store,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Products", icon: Package, path: "/products", syncBadge: true },
  { label: "Inventory", icon: Warehouse, path: "/inventory" },
  { label: "Orders", icon: ShoppingCart, path: "/orders" },
  { label: "Pricing", icon: DollarSign, path: "/pricing" },
  { label: "Marketplaces", icon: Store, path: "/marketplaces" },
  { label: "Reports", icon: BarChart3, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      data-testid="sidebar"
      className={cn(
        "fixed left-0 top-16 bottom-0 z-30 bg-white border-r border-border sidebar-transition flex-col hidden md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto" data-testid="sidebar-nav">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              data-testid={`nav-${item.label.toLowerCase()}`}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 group relative",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="size-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.syncBadge && (
                    <span
                      data-testid="products-sync-badge"
                      className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                      title="Some marketplaces are still syncing"
                    >
                      <Loader2 className="size-2.5 animate-spin" />
                      Syncing
                    </span>
                  )}
                </>
              )}
              {/* Collapsed tooltip for sync badge */}
              {collapsed && item.syncBadge && (
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-foreground text-primary-foreground text-xs px-2.5 py-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  Some marketplaces are still syncing
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-border p-2">
        <button
          data-testid="sidebar-toggle"
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
        >
          {collapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <ChevronLeft className="size-5" />
          )}
        </button>
      </div>
    </aside>
  )
}
