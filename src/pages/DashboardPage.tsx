import { Link } from "react-router-dom"
import {
  Package,
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Link2,
  TrendingUp,
  CheckCircle2,
  Truck,
  RefreshCw,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const metrics = [
  {
    label: "Total Products",
    value: "1,248",
    change: "+12%",
    trend: "up" as const,
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    label: "Active Listings",
    value: "983",
    change: "+8%",
    trend: "up" as const,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    label: "Orders Today",
    value: "47",
    change: "+23%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    label: "Inventory Alerts",
    value: "5",
    change: "Action needed",
    trend: "warning" as const,
    icon: AlertTriangle,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
]

const recentActivity = [
  {
    id: 1,
    icon: RefreshCw,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    text: "Product synced to Flipkart",
    detail: "Widget Pro — 3 variants",
    time: "2 minutes ago",
  },
  {
    id: 2,
    icon: Truck,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    text: "Order shipped on Amazon",
    detail: "Order #AMZ-28451",
    time: "15 minutes ago",
  },
  {
    id: 3,
    icon: Zap,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    text: "Price updated across 3 channels",
    detail: "Smart Speaker v2",
    time: "1 hour ago",
  },
  {
    id: 4,
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    text: "Listing approved on eBay",
    detail: "LED Desk Lamp Pro",
    time: "2 hours ago",
  },
  {
    id: 5,
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    text: "Low inventory alert",
    detail: "USB-C Hub — 8 units remaining",
    time: "3 hours ago",
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-8" data-testid="dashboard-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="dashboard-title">
            Good morning, Jane
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening with your stores today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            data-testid="connect-marketplace-btn"
            className="rounded-lg hover:shadow-sm transition-all duration-200"
            asChild
          >
            <Link to="/marketplaces">
              <Link2 className="size-4 mr-2" />
              Connect marketplace
            </Link>
          </Button>
          <Button
            data-testid="add-product-btn"
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            asChild
          >
            <Link to="/products">
              <Plus className="size-4 mr-2" />
              Add new product
            </Link>
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric) => (
          <Card key={metric.label} className="relative overflow-hidden" data-testid={`metric-${metric.label.toLowerCase().replace(/\s+/g, "-")}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                  <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">{metric.value}</p>
                  <div className="flex items-center gap-1.5">
                    {metric.trend === "up" ? (
                      <Badge variant="success" className="gap-1">
                        <TrendingUp className="size-3" />
                        {metric.change}
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1">
                        <AlertTriangle className="size-3" />
                        {metric.change}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className={`${metric.bgColor} rounded-xl p-3`}>
                  <metric.icon className={`size-5 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2" data-testid="recent-activity-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Activity</CardTitle>
              <button
                data-testid="view-all-activity-btn"
                className="text-sm font-medium text-primary hover:text-primary/80 inline-flex items-center gap-1 transition-colors"
              >
                View all
                <ArrowUpRight className="size-3" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-1">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  data-testid={`activity-item-${item.id}`}
                  className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors duration-150 cursor-pointer"
                >
                  <div className={`${item.iconBg} rounded-lg p-2 shrink-0 mt-0.5`}>
                    <item.icon className={`size-4 ${item.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 mt-0.5">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Stats */}
        <Card data-testid="quick-actions-card">
          <CardHeader className="pb-4">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <button
              data-testid="quick-add-product"
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
            >
              <div className="bg-primary/10 rounded-lg p-2">
                <Plus className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Add a product</p>
                <p className="text-xs text-muted-foreground">List across all channels</p>
              </div>
            </button>

            <button
              data-testid="quick-connect-marketplace"
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
            >
              <div className="bg-emerald-50 rounded-lg p-2">
                <Link2 className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Connect marketplace</p>
                <p className="text-xs text-muted-foreground">Amazon, Flipkart, eBay & more</p>
              </div>
            </button>

            <button
              data-testid="quick-view-orders"
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
            >
              <div className="bg-blue-50 rounded-lg p-2">
                <ShoppingCart className="size-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">View orders</p>
                <p className="text-xs text-muted-foreground">47 orders pending today</p>
              </div>
            </button>

            <button
              data-testid="quick-view-alerts"
              className="flex w-full items-center gap-3 rounded-lg border border-border p-3 text-left hover:bg-muted/50 hover:border-primary/30 transition-all duration-200"
            >
              <div className="bg-amber-50 rounded-lg p-2">
                <AlertTriangle className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Inventory alerts</p>
                <p className="text-xs text-muted-foreground">5 products need attention</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
