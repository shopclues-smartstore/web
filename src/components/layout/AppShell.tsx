import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"
import { Toaster } from "sonner"

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Start collapsed on smaller screens
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1024px)")
    if (mq.matches) setSidebarCollapsed(true)
    const handler = (e: MediaQueryListEvent) => setSidebarCollapsed(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return (
    <div className="min-h-screen bg-background" data-testid="app-shell">
      <Header />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        data-testid="main-content"
        className={cn(
          "pt-16 min-h-screen sidebar-transition",
          sidebarCollapsed ? "pl-16" : "pl-64"
        )}
      >
        <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-fade-up">
          <Outlet />
        </div>
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  )
}
