import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { apolloClient } from "@/lib/graphql/client"
import { authStorage, logout } from "@/features/auth"
import { toast } from "sonner"
import {
  Bell,
  HelpCircle,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Store,
} from "lucide-react"

const stores = [
  { id: "1", name: "My Electronics Store" },
  { id: "2", name: "Home & Garden Shop" },
  { id: "3", name: "Fashion Outlet" },
]

export function Header() {
  const navigate = useNavigate()
  const [storeOpen, setStoreOpen] = useState(false)
  const [selectedStore, setSelectedStore] = useState(stores[0])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const storeRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (storeRef.current && !storeRef.current.contains(e.target as Node)) setStoreOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const notifications = [
    { id: 1, text: "Product synced to Flipkart", time: "2m ago" },
    { id: 2, text: "New order on Amazon", time: "15m ago" },
    { id: 3, text: "Inventory alert: Widget Pro low stock", time: "1h ago" },
  ]

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    setUserMenuOpen(false)

    const result = await logout(authStorage.getAccessToken())
    authStorage.clear()
    await apolloClient.clearStore().catch(() => undefined)
    navigate("/login", { replace: true })

    if (!result.ok) {
      toast.error(result.error)
    }
  }

  return (
    <header
      data-testid="header"
      className="fixed top-0 left-0 right-0 z-40 h-16 bg-white border-b border-border flex items-center px-4 gap-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0" data-testid="header-logo">
        <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
          <Store className="size-4 text-primary-foreground" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight hidden sm:block">
          SmartStore
        </span>
      </div>

      {/* Store Selector - Center */}
      <div className="flex-1 flex justify-center">
        <div ref={storeRef} className="relative">
          <button
            data-testid="store-selector"
            onClick={() => setStoreOpen(!storeOpen)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted transition-colors duration-150"
          >
            <Store className="size-4 text-muted-foreground" />
            <span className="max-w-[200px] truncate">{selectedStore.name}</span>
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", storeOpen && "rotate-180")} />
          </button>
          {storeOpen && (
            <div
              data-testid="store-dropdown"
              className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white border border-border rounded-xl shadow-lg p-1 animate-fade-up z-50"
            >
              {stores.map((store) => (
                <button
                  key={store.id}
                  data-testid={`store-option-${store.id}`}
                  onClick={() => { setSelectedStore(store); setStoreOpen(false) }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150",
                    selectedStore.id === store.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Store className="size-4" />
                  {store.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            data-testid="notifications-btn"
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
          >
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary" />
          </button>
          {notifOpen && (
            <div
              data-testid="notifications-dropdown"
              className="absolute top-full right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-lg animate-fade-up z-50"
            >
              <div className="p-3 border-b border-border">
                <h4 className="font-heading text-sm font-semibold">Notifications</h4>
              </div>
              <div className="p-1 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-muted transition-colors duration-150 cursor-pointer"
                  >
                    <div className="mt-0.5 size-2 rounded-full bg-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{n.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button
          data-testid="help-btn"
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-150"
        >
          <HelpCircle className="size-5" />
        </button>

        {/* User Menu */}
        <div ref={userRef} className="relative">
          <button
            data-testid="user-menu-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-muted transition-colors duration-150"
          >
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
              <span className="text-sm font-semibold text-primary">JS</span>
            </div>
          </button>
          {userMenuOpen && (
            <div
              data-testid="user-menu-dropdown"
              className="absolute top-full right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-lg p-1 animate-fade-up z-50"
            >
              <div className="px-3 py-2.5 border-b border-border mb-1">
                <p className="text-sm font-medium text-foreground">Jane Seller</p>
                <p className="text-xs text-muted-foreground">jane@smartstore.io</p>
              </div>
              <button
                data-testid="user-menu-profile"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              >
                <User className="size-4" />
                Profile
              </button>
              <button
                data-testid="user-menu-settings"
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors duration-150"
              >
                <Settings className="size-4" />
                Settings
              </button>
              <div className="border-t border-border mt-1 pt-1">
                <button
                  data-testid="user-menu-logout"
                  disabled={isLoggingOut}
                  onClick={() => {
                    void handleLogout()
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                >
                  <LogOut className="size-4" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
