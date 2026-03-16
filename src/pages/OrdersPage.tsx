import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  RefreshCw,
  X,
  Check,
  Download,
  Printer,
  FileText,
  Package,
  Clock,
  AlertTriangle,
  Image as ImageIcon,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  CheckCircle2,
  Box,
  ArrowRight,
  Copy,
  User,
  Filter,
  Tag,
  RotateCcw,
  PackageCheck,
  XCircle,
  Undo2,
  ShoppingBag,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { marketplaceLogos, marketplaceNames } from "@/components/ui/marketplace-logos"

// ─── Types ────────────────────────────────────────────────────────
type MarketplaceId = "amazon" | "flipkart" | "coupang" | "snapdeal" | "meesho" | "myntra"

type OrderStatusKey = "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled" | "returned"
type FulfillmentStatus = "unfulfilled" | "fulfilled" | "partially_fulfilled"

interface OrderItem {
  id: string
  orderId: string
  orderDate: string
  orderDateRaw: Date
  productTitle: string
  productSku: string
  quantity: number
  customerName: string
  customerPhone: string
  customerAddress: string
  deliveryMethod: string
  shipBy: string
  deliverBy: string
  sla: "ok" | "warning" | "breached"
  slaText?: string
  payment: "Prepaid" | "COD"
  amount: string
  status: OrderStatusKey
  fulfillment: FulfillmentStatus
  marketplace: MarketplaceId
  awbNumber?: string
  awbCarrier?: string
}

// ─── Mock Data ────────────────────────────────────────────────────
const customerNames = [
  "Amit Tiwari", "Priya Singh", "Rahul Kumar", "Kim Soo-jin", "Neha Sharma",
  "Arjun Patel", "Sneha Reddy", "Vikram Mehra", "Ananya Das", "Rohan Joshi",
  "Kavita Nair", "Sanjay Gupta", "Deepika Rao", "Manoj Verma", "Pooja Iyer",
]
const addresses = [
  "122003, Gurugram, Haryana", "Seoul, 30174, Republic of Korea", "400001, Mumbai, Maharashtra",
  "560001, Bangalore, Karnataka", "110001, New Delhi, Delhi", "600001, Chennai, Tamil Nadu",
  "700001, Kolkata, West Bengal", "380001, Ahmedabad, Gujarat",
]
const products = [
  { title: "Reebok Men's Running Shoes - Stride Runner Lightweight Mesh...", sku: "RBK-SHO-001" },
  { title: "Samsung Galaxy Buds Pro - Wireless Earbuds Noise Cancel...", sku: "SAM-EAR-042" },
  { title: "Cotton Casual T-Shirt - V-Neck Premium Fabric Breathable...", sku: "CTN-TSH-118" },
  { title: "Borosil Glass Lunch Box - 3 Compartment Microwave Safe...", sku: "BRS-KIT-067" },
  { title: "Apple AirPods Max - Space Gray Over-Ear Headphones Hi-Fi...", sku: "APL-AUD-003" },
  { title: "Nike Air Max 270 React - Men's Athletic Sneakers Blue...", sku: "NIK-SHO-055" },
  { title: "Sony WH-1000XM5 - Wireless Noise Cancelling Headphones...", sku: "SNY-AUD-012" },
  { title: "Adidas Ultraboost 22 - Running Shoes Cloud White...", sku: "ADI-SHO-089" },
  { title: "OnePlus Nord Buds 2 - True Wireless ANC Earbuds...", sku: "ONP-EAR-034" },
  { title: "Prestige Omega Deluxe Induction Base Fry Pan 24cm...", sku: "PRG-KIT-022" },
]

const statuses: OrderStatusKey[] = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned"]
const fulfillments: FulfillmentStatus[] = ["unfulfilled", "fulfilled", "partially_fulfilled"]
const marketplaces: MarketplaceId[] = ["amazon", "flipkart", "coupang", "snapdeal", "meesho", "myntra"]
const payments: ("Prepaid" | "COD")[] = ["Prepaid", "COD"]
const slaStates: { sla: "ok" | "warning" | "breached"; text?: string }[] = [
  { sla: "ok" }, { sla: "ok" }, { sla: "ok" },
  { sla: "warning", text: "SLA breaching in 2 hrs" },
  { sla: "breached", text: "SLA breached" },
]
const deliveryMethods = ["Self ship", "Easy ship", "Fulfilled by Marketplace"]

function generateMockOrders(): OrderItem[] {
  const orders: OrderItem[] = []
  const baseDate = new Date(2025, 10, 24) // Nov 24, 2025

  for (let i = 0; i < 87; i++) {
    const mp = marketplaces[i % marketplaces.length]
    const status = statuses[i % statuses.length]
    const prod = products[i % products.length]
    const slaState = slaStates[i % slaStates.length]
    const dayOffset = Math.floor(i / 6)
    const date = new Date(baseDate.getTime() - dayOffset * 86400000)
    const isCoupang = mp === "coupang"

    let fulfillment: FulfillmentStatus = "unfulfilled"
    if (status === "shipped" || status === "delivered") fulfillment = "fulfilled"
    else if (status === "packed") fulfillment = Math.random() > 0.5 ? "partially_fulfilled" : "unfulfilled"

    orders.push({
      id: `ord-${i}`,
      orderId: `ORD-${(100000 + i).toString()}`,
      orderDate: date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      orderDateRaw: date,
      productTitle: prod.title,
      productSku: prod.sku,
      quantity: (i % 4) + 1,
      customerName: customerNames[i % customerNames.length],
      customerPhone: `98${String(76543210 + i).slice(0, 8)}`,
      customerAddress: isCoupang ? "Seoul, 04524, Republic of Korea" : addresses[i % addresses.length],
      deliveryMethod: deliveryMethods[i % deliveryMethods.length],
      shipBy: new Date(date.getTime() + 2 * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      deliverBy: new Date(date.getTime() + 5 * 86400000).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
      sla: (status === "pending" || status === "confirmed") ? slaState.sla : "ok",
      slaText: (status === "pending" || status === "confirmed") ? slaState.text : undefined,
      payment: payments[i % payments.length],
      amount: isCoupang ? `₩${(15000 + i * 1000).toLocaleString()}` : `₹${(800 + i * 50).toLocaleString()}`,
      status,
      fulfillment,
      marketplace: mp,
      awbNumber: status === "shipped" || status === "packed" ? `AWB${748758448 + i}` : undefined,
      awbCarrier: status === "shipped" || status === "packed" ? (i % 2 === 0 ? "Delhivery" : "BlueDart") : undefined,
    })
  }
  return orders
}

const allMockOrders = generateMockOrders()

// ─── Quick Filter Tabs ────────────────────────────────────────────
type QuickFilterKey = "all" | "pending_fulfillment" | "shipped" | "cancelled" | "returns"

const quickFilterTabs: { key: QuickFilterKey; label: string; icon: React.ElementType }[] = [
  { key: "all", label: "All Orders", icon: ShoppingBag },
  { key: "pending_fulfillment", label: "Pending Fulfillment", icon: Clock },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "cancelled", label: "Cancelled", icon: XCircle },
  { key: "returns", label: "Returns", icon: Undo2 },
]

const ITEMS_PER_PAGE = 10

// ─── Main Component ───────────────────────────────────────────────
export function OrdersPage() {
  const [activeTab, setActiveTab] = useState<QuickFilterKey>("all")
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [fulfillmentFilter, setFulfillmentFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [drawerOrder, setDrawerOrder] = useState<OrderItem | null>(null)

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1)
    setSelectedOrders(new Set())
  }, [activeTab, marketplaceFilter, statusFilter, fulfillmentFilter, dateFilter, searchQuery])

  // ─── Computed counts ──────────────────────────────────────────
  const counts = useMemo(() => {
    const all = allMockOrders.length
    const pendingFulfillment = allMockOrders.filter(o => o.fulfillment === "unfulfilled" || o.fulfillment === "partially_fulfilled").length
    const shipped = allMockOrders.filter(o => o.status === "shipped").length
    const cancelled = allMockOrders.filter(o => o.status === "cancelled").length
    const returns = allMockOrders.filter(o => o.status === "returned").length
    return { all, pending_fulfillment: pendingFulfillment, shipped, cancelled, returns }
  }, [])

  // ─── Filter logic ─────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    return allMockOrders.filter((o) => {
      // Quick filter tab
      if (activeTab === "pending_fulfillment" && o.fulfillment !== "unfulfilled" && o.fulfillment !== "partially_fulfilled") return false
      if (activeTab === "shipped" && o.status !== "shipped") return false
      if (activeTab === "cancelled" && o.status !== "cancelled") return false
      if (activeTab === "returns" && o.status !== "returned") return false

      // Dropdown filters
      if (marketplaceFilter !== "all" && o.marketplace !== marketplaceFilter) return false
      if (statusFilter !== "all" && o.status !== statusFilter) return false
      if (fulfillmentFilter !== "all" && o.fulfillment !== fulfillmentFilter) return false

      // Date filter
      if (dateFilter !== "all") {
        const now = new Date()
        const dayMs = 86400000
        if (dateFilter === "today" && (now.getTime() - o.orderDateRaw.getTime()) > dayMs) return false
        if (dateFilter === "7days" && (now.getTime() - o.orderDateRaw.getTime()) > 7 * dayMs) return false
        if (dateFilter === "30days" && (now.getTime() - o.orderDateRaw.getTime()) > 30 * dayMs) return false
      }

      // Search
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.productSku.toLowerCase().includes(q) ||
          o.productTitle.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [activeTab, marketplaceFilter, statusFilter, fulfillmentFilter, dateFilter, searchQuery])

  // ─── Pagination ───────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ITEMS_PER_PAGE))
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredOrders.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredOrders, currentPage])

  const toggleOrderSelect = useCallback((id: string) => {
    setSelectedOrders(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAllOnPage = useCallback(() => {
    const pageIds = paginatedOrders.map(o => o.id)
    const allSelected = pageIds.every(id => selectedOrders.has(id))
    if (allSelected) {
      setSelectedOrders(prev => {
        const next = new Set(prev)
        pageIds.forEach(id => next.delete(id))
        return next
      })
    } else {
      setSelectedOrders(prev => {
        const next = new Set(prev)
        pageIds.forEach(id => next.add(id))
        return next
      })
    }
  }, [paginatedOrders, selectedOrders])

  const allOnPageSelected = paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrders.has(o.id))

  const hasActiveFilters = marketplaceFilter !== "all" || statusFilter !== "all" || fulfillmentFilter !== "all" || dateFilter !== "all" || searchQuery !== ""

  const clearFilters = () => {
    setMarketplaceFilter("all")
    setStatusFilter("all")
    setFulfillmentFilter("all")
    setDateFilter("all")
    setSearchQuery("")
  }

  return (
    <div className="space-y-5" data-testid="orders-page">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="orders-title">
            Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and track orders across all your marketplaces
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last synced 5 mins ago</span>
            <button data-testid="refresh-btn" className="flex items-center gap-1 text-primary font-medium hover:underline">
              <RefreshCw className="size-3" />
              Sync now
            </button>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 ml-2" data-testid="export-all-btn">
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Filter Tabs */}
      <div className="flex items-center gap-1 border-b border-border" data-testid="quick-filter-tabs">
        {quickFilterTabs.map(tab => {
          const isActive = activeTab === tab.key
          const Icon = tab.icon
          const count = counts[tab.key]
          return (
            <button
              key={tab.key}
              data-testid={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              <span className={cn(
                "text-xs font-semibold tabular-nums rounded-full px-2 py-0.5",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}>
                {count}
              </span>
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* Search + Filters Row */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-3" data-testid="filters-row">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <label className="text-[11px] text-muted-foreground font-medium block mb-1.5">Search orders</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              data-testid="order-search-input"
              placeholder="Order ID, customer, SKU, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <FilterDropdown
          testId="marketplace-filter"
          label="Marketplace"
          value={marketplaceFilter}
          onChange={setMarketplaceFilter}
          options={[
            { value: "all", label: "All Marketplaces" },
            ...marketplaces.map(mp => ({ value: mp, label: marketplaceNames[mp] ?? mp })),
          ]}
        />
        <FilterDropdown
          testId="status-filter"
          label="Order Status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: "all", label: "All Statuses" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "packed", label: "Packed" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
            { value: "returned", label: "Returned" },
          ]}
        />
        <FilterDropdown
          testId="fulfillment-filter"
          label="Fulfillment"
          value={fulfillmentFilter}
          onChange={setFulfillmentFilter}
          options={[
            { value: "all", label: "All" },
            { value: "unfulfilled", label: "Unfulfilled" },
            { value: "fulfilled", label: "Fulfilled" },
            { value: "partially_fulfilled", label: "Partial" },
          ]}
        />
        <FilterDropdown
          testId="date-filter"
          label="Date Range"
          value={dateFilter}
          onChange={setDateFilter}
          options={[
            { value: "all", label: "All Time" },
            { value: "today", label: "Today" },
            { value: "7days", label: "Last 7 days" },
            { value: "30days", label: "Last 30 days" },
          ]}
        />

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium pb-0.5 shrink-0"
            data-testid="clear-filters-btn"
          >
            <RotateCcw className="size-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground" data-testid="results-count">
          Showing <span className="font-semibold text-foreground tabular-nums">{filteredOrders.length}</span> orders
          {hasActiveFilters && " (filtered)"}
        </p>
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden" data-testid="orders-table">
        {/* Table Header */}
        <div className="hidden lg:grid grid-cols-[40px_110px_56px_240px_150px_100px_100px_100px_80px_60px] gap-3 px-4 py-3 bg-muted/30 text-[11px] font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
          <div className="flex items-center justify-center">
            <OrderCheckbox checked={allOnPageSelected} onChange={toggleAllOnPage} testId="select-all-checkbox" />
          </div>
          <span>Order ID</span>
          <span>Source</span>
          <span>Product</span>
          <span>Customer</span>
          <span>Date</span>
          <span>Status</span>
          <span>Fulfillment</span>
          <span>Amount</span>
          <span></span>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border">
          {paginatedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground" data-testid="no-orders">
              <Package className="size-12 mb-4 opacity-30" />
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-xs mt-1 max-w-xs text-center">Try adjusting your search or filters to find what you're looking for</p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" className="mt-4 gap-1.5" onClick={clearFilters}>
                  <RotateCcw className="size-3" />
                  Clear all filters
                </Button>
              )}
            </div>
          ) : (
            paginatedOrders.map(order => (
              <OrderRow
                key={order.id}
                order={order}
                checked={selectedOrders.has(order.id)}
                onToggle={() => toggleOrderSelect(order.id)}
                onOpenDrawer={() => setDrawerOrder(order)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10" data-testid="pagination">
            <p className="text-xs text-muted-foreground tabular-nums">
              Page {currentPage} of {totalPages} &middot; {filteredOrders.length} total orders
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                data-testid="prev-page-btn"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {generatePageNumbers(currentPage, totalPages).map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-xs">...</span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0 text-xs"
                    onClick={() => setCurrentPage(page as number)}
                    data-testid={`page-${page}-btn`}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                data-testid="next-page-btn"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Bulk Action Bar */}
      {selectedOrders.size > 0 && (
        <BulkActionBar count={selectedOrders.size} onClear={() => setSelectedOrders(new Set())} />
      )}

      {/* Order Detail Drawer */}
      {drawerOrder && (
        <OrderDetailDrawer order={drawerOrder} onClose={() => setDrawerOrder(null)} />
      )}
    </div>
  )
}

// ─── Filter Dropdown ──────────────────────────────────────────────
function FilterDropdown({ testId, label, value, onChange, options }: {
  testId: string
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selected = options.find(o => o.value === value) ?? options[0]
  const isFiltered = value !== "all"

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      <div ref={ref} className="relative">
        <button
          data-testid={testId}
          onClick={() => setOpen(!open)}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm min-w-[130px] transition-all",
            isFiltered
              ? "border-primary bg-primary/5 text-primary font-medium"
              : "border-border bg-white text-foreground hover:bg-muted/50"
          )}
        >
          <span className="flex-1 text-left truncate">{selected.label}</span>
          <ChevronDown className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-180", isFiltered ? "text-primary" : "text-muted-foreground")} />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-full min-w-[160px] bg-white border border-border rounded-xl shadow-xl p-1 z-30 animate-fade-up">
            {options.map(opt => (
              <button
                key={opt.value}
                data-testid={`${testId}-${opt.value}`}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                  value === opt.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Checkbox ─────────────────────────────────────────────────────
function OrderCheckbox({ checked, onChange, testId }: { checked: boolean; onChange: () => void; testId: string }) {
  return (
    <button
      data-testid={testId}
      onClick={onChange}
      className={cn(
        "size-4 rounded border-2 flex items-center justify-center transition-colors shrink-0",
        checked ? "bg-primary border-primary" : "border-muted-foreground/40 hover:border-primary/60"
      )}
    >
      {checked && <Check className="size-3 text-white" strokeWidth={3} />}
    </button>
  )
}

// ─── Order Row ────────────────────────────────────────────────────
function OrderRow({ order, checked, onToggle, onOpenDrawer }: {
  order: OrderItem; checked: boolean; onToggle: () => void; onOpenDrawer: () => void
}) {
  const MpLogo = marketplaceLogos[order.marketplace]?.Logo

  return (
    <div
      data-testid={`order-row-${order.id}`}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-[40px_110px_56px_240px_150px_100px_100px_100px_80px_60px] gap-2 lg:gap-3 px-4 py-3.5 items-center hover:bg-muted/20 transition-colors cursor-pointer",
        checked && "bg-primary/[0.03]"
      )}
      onClick={onOpenDrawer}
    >
      {/* Checkbox */}
      <div className="flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <OrderCheckbox checked={checked} onChange={onToggle} testId={`order-check-${order.id}`} />
      </div>

      {/* Order ID */}
      <div className="text-xs overflow-hidden">
        <span className="text-primary font-semibold tabular-nums truncate block" data-testid={`order-link-${order.id}`}>
          {order.orderId}
        </span>
      </div>

      {/* Marketplace */}
      <div className="flex items-center" data-testid={`order-marketplace-${order.id}`}>
        {MpLogo && (
          <span className={cn(
            "inline-flex items-center justify-center rounded-md border size-8",
            marketplaceLogos[order.marketplace]?.bgColor
          )} title={marketplaceNames[order.marketplace]}>
            <MpLogo className="h-2.5" />
          </span>
        )}
      </div>

      {/* Product */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="size-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <ImageIcon className="size-4 text-muted-foreground/60" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground truncate leading-snug">{order.productTitle}</p>
          <p className="text-[11px] text-muted-foreground truncate mt-0.5">SKU: {order.productSku} &middot; Qty: {order.quantity}</p>
        </div>
      </div>

      {/* Customer */}
      <div className="text-xs overflow-hidden">
        <p className="font-medium text-foreground truncate">{order.customerName}</p>
        <p className="text-muted-foreground truncate mt-0.5">{order.customerAddress.split(",")[0]}</p>
      </div>

      {/* Date */}
      <div className="text-xs text-muted-foreground tabular-nums">
        {order.orderDate}
      </div>

      {/* Status */}
      <div>
        <StatusBadge status={order.status} />
      </div>

      {/* Fulfillment */}
      <div>
        <FulfillmentBadge fulfillment={order.fulfillment} />
      </div>

      {/* Amount */}
      <div className="text-xs font-semibold text-foreground tabular-nums">
        {order.amount}
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center">
        <ChevronRight className="size-4 text-muted-foreground/50" />
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────
function StatusBadge({ status }: { status: OrderStatusKey }) {
  const config: Record<OrderStatusKey, { label: string; className: string }> = {
    pending: { label: "Pending", className: "text-amber-700 bg-amber-50 border-amber-200" },
    confirmed: { label: "Confirmed", className: "text-blue-700 bg-blue-50 border-blue-200" },
    packed: { label: "Packed", className: "text-violet-700 bg-violet-50 border-violet-200" },
    shipped: { label: "Shipped", className: "text-sky-700 bg-sky-50 border-sky-200" },
    delivered: { label: "Delivered", className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    cancelled: { label: "Cancelled", className: "text-red-700 bg-red-50 border-red-200" },
    returned: { label: "Returned", className: "text-orange-700 bg-orange-50 border-orange-200" },
  }
  const c = config[status]
  return (
    <span className={cn("inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 border whitespace-nowrap", c.className)} data-testid={`status-badge-${status}`}>
      {c.label}
    </span>
  )
}

// ─── Fulfillment Badge ────────────────────────────────────────────
function FulfillmentBadge({ fulfillment }: { fulfillment: FulfillmentStatus }) {
  const config: Record<FulfillmentStatus, { label: string; className: string }> = {
    unfulfilled: { label: "Unfulfilled", className: "text-amber-700 bg-amber-50/60 border-amber-200/60" },
    fulfilled: { label: "Fulfilled", className: "text-emerald-700 bg-emerald-50/60 border-emerald-200/60" },
    partially_fulfilled: { label: "Partial", className: "text-violet-700 bg-violet-50/60 border-violet-200/60" },
  }
  const c = config[fulfillment]
  return (
    <span className={cn("inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 border whitespace-nowrap", c.className)} data-testid={`fulfillment-badge-${fulfillment}`}>
      {c.label}
    </span>
  )
}

// ─── Bulk Action Bar ──────────────────────────────────────────────
function BulkActionBar({ count, onClear }: { count: number; onClear: () => void }) {
  return (
    <div
      data-testid="bulk-action-bar"
      className="sticky bottom-4 mx-auto max-w-3xl flex items-center justify-between rounded-xl border border-border bg-white px-5 py-3 shadow-xl animate-fade-up"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground tabular-nums" data-testid="selected-count">
          {count} selected
        </span>
        <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground font-medium">
          Deselect all
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5" data-testid="bulk-mark-fulfilled">
          <PackageCheck className="size-3.5" />
          Mark Fulfilled
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" data-testid="bulk-print-labels">
          <Printer className="size-3.5" />
          Print Labels
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" data-testid="bulk-export">
          <Download className="size-3.5" />
          Export
        </Button>
      </div>
    </div>
  )
}

// ─── Pagination Helper ────────────────────────────────────────────
function generatePageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "...")[] = [1]
  if (current > 3) pages.push("...")
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push("...")
  pages.push(total)
  return pages
}

// ─── Order Detail Drawer ──────────────────────────────────────────
const timelineSteps = [
  { key: "placed", label: "Order Placed", icon: Package, time: "24 Nov, 10:14 AM", done: true },
  { key: "confirmed", label: "Order Confirmed", icon: CheckCircle2, time: "24 Nov, 10:18 AM", done: true },
  { key: "packed", label: "Packed", icon: Box, time: "25 Nov, 2:30 PM", done: true },
  { key: "shipped", label: "Shipped", icon: Truck, time: "26 Nov, 9:00 AM", done: false },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, time: "—", done: false },
]

function OrderDetailDrawer({ order, onClose }: { order: OrderItem; onClose: () => void }) {
  const MpLogo = marketplaceLogos[order.marketplace]?.Logo
  const mpName = marketplaceNames[order.marketplace] ?? order.marketplace

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  const statusColor =
    order.status === "pending" ? "bg-amber-100 text-amber-800 border-amber-200"
    : order.status === "confirmed" ? "bg-blue-100 text-blue-800 border-blue-200"
    : order.status === "packed" ? "bg-violet-100 text-violet-800 border-violet-200"
    : order.status === "shipped" ? "bg-sky-100 text-sky-800 border-sky-200"
    : order.status === "delivered" ? "bg-emerald-100 text-emerald-800 border-emerald-200"
    : order.status === "cancelled" ? "bg-red-100 text-red-800 border-red-200"
    : order.status === "returned" ? "bg-orange-100 text-orange-800 border-orange-200"
    : "bg-muted text-muted-foreground border-border"

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30 transition-opacity" onClick={onClose} data-testid="drawer-backdrop" />

      {/* Drawer */}
      <div
        data-testid="order-detail-drawer"
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-border flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-bold text-foreground font-heading" data-testid="drawer-title">Order Details</h2>
            <span className={cn("text-[10px] font-semibold rounded-full px-2 py-0.5 border", statusColor)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted transition-colors" data-testid="drawer-close-btn">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Order ID + Marketplace */}
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Order ID</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-foreground tabular-nums" data-testid="drawer-order-id">{order.orderId}</span>
                  <button onClick={() => copyToClipboard(order.orderId)} className="text-muted-foreground hover:text-foreground transition-colors" title="Copy Order ID">
                    <Copy className="size-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">Marketplace</p>
                <div className="flex items-center gap-2 mt-1" data-testid="drawer-marketplace">
                  {MpLogo && (
                    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5", marketplaceLogos[order.marketplace]?.bgColor)}>
                      <MpLogo className="h-3" />
                    </span>
                  )}
                  <span className="text-xs font-medium text-foreground">{mpName}</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{order.orderDate}</p>
          </div>

          {/* Product Info */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-3">Product</p>
            <div className="flex items-start gap-3">
              <div className="size-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <ImageIcon className="size-6 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground leading-snug">{order.productTitle}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                  <span>Qty: <span className="font-medium text-foreground">{order.quantity}</span></span>
                  <span>SKU: <span className="font-medium text-foreground">{order.productSku}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-4">Order Timeline</p>
            <div className="relative pl-6" data-testid="order-timeline">
              <div className="absolute left-[11px] top-1 bottom-1 w-[2px] bg-border" />
              {timelineSteps.map((step, i) => {
                const Icon = step.icon
                const isLast = i === timelineSteps.length - 1
                return (
                  <div key={step.key} className={cn("relative flex items-start gap-3 pb-5", isLast && "pb-0")} data-testid={`timeline-${step.key}`}>
                    <div className={cn(
                      "absolute -left-6 size-[22px] rounded-full flex items-center justify-center border-2 z-10",
                      step.done ? "bg-primary border-primary" : "bg-white border-border"
                    )}>
                      <Icon className={cn("size-3", step.done ? "text-white" : "text-muted-foreground")} />
                    </div>
                    <div className="pt-0.5">
                      <p className={cn("text-sm font-medium", step.done ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Customer Details */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-3">Customer</p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <User className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-medium text-foreground">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">{order.customerPhone}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="size-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{order.customerAddress}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Shipping */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-3">Shipping & Delivery</p>
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Method" value={order.deliveryMethod} />
              <InfoCell label="Ship by" value={order.shipBy} />
              <InfoCell label="Deliver by" value={order.deliverBy} />
              <InfoCell label="Fulfillment" value={order.fulfillment === "fulfilled" ? "Fulfilled" : order.fulfillment === "partially_fulfilled" ? "Partial" : "Unfulfilled"} />
              {order.awbNumber && <InfoCell label="AWB Number" value={order.awbNumber} />}
              {order.awbCarrier && <InfoCell label="Carrier" value={order.awbCarrier} />}
            </div>
            {order.sla !== "ok" && order.slaText && (
              <div className="mt-3">
                <span className={cn(
                  "inline-flex items-center gap-1 text-xs font-semibold rounded px-2 py-1",
                  order.sla === "breached" ? "text-red-700 bg-red-50" : "text-amber-700 bg-amber-50"
                )}>
                  <AlertTriangle className="size-3" />
                  {order.slaText}
                </span>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="px-5 py-4">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-3">Payment</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">{order.payment}</span>
              </div>
              <span className="text-base font-bold text-foreground tabular-nums">{order.amount}</span>
            </div>
            {order.payment === "Prepaid" && (
              <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                <CheckCircle2 className="size-3" />
                Payment received
              </p>
            )}
            {order.payment === "COD" && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <Clock className="size-3" />
                Collect on delivery
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border px-5 py-3 flex items-center gap-2 bg-muted/20">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" data-testid="drawer-action-secondary">
            <Printer className="size-3.5" />
            Print Invoice
          </Button>
          <Button size="sm" className="flex-1 gap-1.5" data-testid="drawer-action-primary">
            <ArrowRight className="size-3.5" />
            Process Order
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.25s ease-out;
        }
      `}</style>
    </>
  )
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
    </div>
  )
}
