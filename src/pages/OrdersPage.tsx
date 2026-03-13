import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import {
  ChevronDown,
  Search,
  RefreshCw,
  X,
  Check,
  Download,
  Upload,
  Scissors,
  CircleAlert,
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { marketplaceLogos, marketplaceNames } from "@/components/ui/marketplace-logos"

// ─── Types ────────────────────────────────────────────────────────
type MarketplaceId = "amazon" | "flipkart" | "coupang" | "snapdeal" | "meesho" | "myntra"

type OrderStatusKey = "new" | "pending" | "accepted" | "packed" | "ready_to_ship" | "in_transit" | "completed" | "cancelled"

interface MarketplaceChannel {
  id: MarketplaceId
  orderCount: number
}

interface OrderItem {
  id: string
  orderId: string
  orderDate: string
  timeAgo: string
  fulfillment: string
  productTitle: string
  productSku: string
  productCategory: string
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
  marketplace: MarketplaceId
  // Packed-specific fields
  handoverDate?: string
  handoverCountdown?: string
  awbNumber?: string
  awbCarrier?: string
  labelStatus?: "printed" | "pending"
}

// ─── Marketplace Config ───────────────────────────────────────────
const marketplaceChannels: MarketplaceChannel[] = [
  { id: "amazon", orderCount: 100 },
  { id: "flipkart", orderCount: 100 },
  { id: "snapdeal", orderCount: 100 },
  { id: "meesho", orderCount: 100 },
  { id: "coupang", orderCount: 100 },
  { id: "myntra", orderCount: 100 },
]

const statusBarConfig: Record<MarketplaceId, { key: OrderStatusKey; label: string; count: number }[]> = {
  amazon: [
    { key: "pending", label: "Pending", count: 100 },
    { key: "accepted", label: "Accepted", count: 80 },
    { key: "packed", label: "Packed", count: 80 },
    { key: "ready_to_ship", label: "Ready to ship", count: 40 },
    { key: "in_transit", label: "In-transit", count: 20 },
    { key: "completed", label: "Completed", count: 20 },
    { key: "cancelled", label: "Cancelled", count: 20 },
  ],
  flipkart: [
    { key: "pending", label: "Pending", count: 100 },
    { key: "accepted", label: "Accepted", count: 80 },
    { key: "packed", label: "Packed", count: 80 },
    { key: "ready_to_ship", label: "Ready to ship", count: 40 },
    { key: "in_transit", label: "In-transit", count: 20 },
    { key: "completed", label: "Completed", count: 20 },
    { key: "cancelled", label: "Cancelled", count: 20 },
  ],
  coupang: [
    { key: "new", label: "New", count: 100 },
    { key: "accepted", label: "Accepted", count: 80 },
    { key: "packed", label: "Packed", count: 80 },
    { key: "ready_to_ship", label: "Ready to ship", count: 40 },
    { key: "in_transit", label: "In-transit", count: 20 },
    { key: "completed", label: "Completed", count: 20 },
    { key: "cancelled", label: "Cancelled", count: 20 },
  ],
  snapdeal: [
    { key: "pending", label: "Pending", count: 100 },
    { key: "accepted", label: "Accepted", count: 80 },
    { key: "packed", label: "Packed", count: 80 },
    { key: "ready_to_ship", label: "Ready to ship", count: 40 },
    { key: "in_transit", label: "In-transit", count: 20 },
    { key: "completed", label: "Completed", count: 20 },
    { key: "cancelled", label: "Cancelled", count: 20 },
  ],
  meesho: [
    { key: "pending", label: "Pending", count: 100 },
    { key: "accepted", label: "Accepted", count: 80 },
    { key: "packed", label: "Packed", count: 80 },
    { key: "ready_to_ship", label: "Ready to ship", count: 40 },
    { key: "in_transit", label: "In-transit", count: 20 },
    { key: "completed", label: "Completed", count: 20 },
    { key: "cancelled", label: "Cancelled", count: 20 },
  ],
  myntra: [
    { key: "pending", label: "Pending", count: 100 },
    { key: "accepted", label: "Accepted", count: 80 },
    { key: "packed", label: "Packed", count: 80 },
    { key: "ready_to_ship", label: "Ready to ship", count: 40 },
    { key: "in_transit", label: "In-transit", count: 20 },
    { key: "completed", label: "Completed", count: 20 },
    { key: "cancelled", label: "Cancelled", count: 20 },
  ],
}

// Quick filter configs
const quickFilters = [
  "Ship by today",
  "Ship together orders",
  "Verge of cancellation",
  "Verge of late shipment",
  "Verge of SLA breach",
]

// ─── Mock Order Data ──────────────────────────────────────────────
function generateMockOrders(): OrderItem[] {
  const names = ["Amit tiwari", "Mr. choi", "Rahul Kumar", "Priya Singh", "Kim Soo-jin"]
  const addresses = [
    { addr: "122003, Gurugram, Haryana", phone: "9876543210" },
    { addr: "Seoul, 30174, Republic of Korea", phone: "9876543210" },
    { addr: "400001, Mumbai, Maharashtra", phone: "9876543210" },
    { addr: "560001, Bangalore, Karnataka", phone: "9876543210" },
    { addr: "Seoul, 04524, Republic of Korea", phone: "9876543210" },
  ]
  const products = [
    { title: "Reebok Men's Running Shoes - Stride Runner - Lightweight...", sku: "Shoes & Handbags", category: "Shoes & Handbags" },
    { title: "Samsung Galaxy Buds Pro - Wireless Earbuds - Noise Cancel...", sku: "Electronics", category: "Electronics" },
    { title: "Cotton Casual T-Shirt - V-Neck - Premium Fabric...", sku: "Apparel", category: "Apparel" },
    { title: "Borosil Glass Lunch Box - 3 Compartment - Microwave Safe...", sku: "Kitchen", category: "Kitchen" },
  ]
  const slaStates: { sla: "ok" | "warning" | "breached"; text?: string }[] = [
    { sla: "ok" },
    { sla: "warning", text: "SLA breaching in 2 hrs" },
    { sla: "breached", text: "SLA breached" },
  ]
  const statuses: OrderStatusKey[] = ["pending", "accepted", "packed", "ready_to_ship", "in_transit"]
  const marketplaces: MarketplaceId[] = ["amazon", "flipkart", "coupang", "snapdeal", "meesho", "myntra"]

  const orders: OrderItem[] = []
  let idx = 0
  for (const mp of marketplaces) {
    for (let i = 0; i < 8; i++) {
      const nameIdx = (idx + i) % names.length
      const addrIdx = (idx + i) % addresses.length
      const prodIdx = (idx + i) % products.length
      const slaIdx = i % slaStates.length
      const statusIdx = i % statuses.length
      let status = statuses[statusIdx]
      // For coupang, replace "pending" with "new"
      if (mp === "coupang" && status === "pending") status = "new"
      const isPacked = status === "packed"
      orders.push({
        id: `ord-${mp}-${i}`,
        orderId: `7588599904${6732 + i}`,
        orderDate: "24 Nov, 2025\n10:14 AM",
        timeAgo: "2 hours ago",
        fulfillment: "Fulfilment method : Seller",
        productTitle: products[prodIdx].title,
        productSku: products[prodIdx].sku,
        productCategory: products[prodIdx].category,
        quantity: 2,
        customerName: mp === "coupang" ? names[1] : names[nameIdx],
        customerPhone: addresses[addrIdx].phone,
        customerAddress: mp === "coupang" ? addresses[1].addr : addresses[addrIdx].addr,
        deliveryMethod: i % 2 === 0 ? "Self ship" : "Easy ship",
        shipBy: "26 Nov",
        deliverBy: "28 Nov",
        sla: slaStates[slaIdx].sla,
        slaText: slaStates[slaIdx].text,
        payment: i % 3 === 0 ? "COD" : "Prepaid",
        amount: mp === "coupang" ? "₩24,000" : (mp === "amazon" ? "₹1,200" : "₹1,200"),
        status,
        marketplace: mp,
        // Packed-specific
        handoverDate: isPacked ? "11:59 PM, 2 Dec 2025" : undefined,
        handoverCountdown: isPacked ? "13 hours to go" : undefined,
        awbNumber: isPacked ? `7487584489${5889 + i}` : undefined,
        awbCarrier: isPacked ? "Delhivery" : undefined,
        labelStatus: isPacked ? (i % 2 === 0 ? "printed" : "pending") : undefined,
      })
    }
    idx += 3
  }
  return orders
}

const allMockOrders = generateMockOrders()

// ─── Marketplace-aware filter config ──────────────────────────────
function hasShippingFilter(mp: MarketplaceId) {
  return mp !== "coupang"
}
function hasPaymentFilter(mp: MarketplaceId) {
  return mp !== "coupang"
}

// ─── Component ────────────────────────────────────────────────────
export function OrdersPage() {
  const [selectedChannel, setSelectedChannel] = useState<MarketplaceId>("amazon")
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatusKey>("pending")
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null)
  const [searchType, setSearchType] = useState("Order ID")
  const [searchTypeOpen, setSearchTypeOpen] = useState(false)

  // Filter state
  const [shippingMethod, setShippingMethod] = useState("all")
  const [paymentType, setPaymentType] = useState("all")

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [modalOrder, setModalOrder] = useState<OrderItem | null>(null)

  // Drawer state
  const [drawerOrder, setDrawerOrder] = useState<OrderItem | null>(null)

  const channelRef = useRef<HTMLDivElement>(null)
  const searchTypeRef = useRef<HTMLDivElement>(null)

  // Reset status when channel changes
  useEffect(() => {
    const statuses = statusBarConfig[selectedChannel]
    if (statuses.length > 0) {
      setSelectedStatus(statuses[0].key)
    }
    setSelectedOrders(new Set())
    setActiveQuickFilter(null)
  }, [selectedChannel])

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (channelRef.current && !channelRef.current.contains(e.target as Node)) setChannelDropdownOpen(false)
      if (searchTypeRef.current && !searchTypeRef.current.contains(e.target as Node)) setSearchTypeOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const statuses = statusBarConfig[selectedChannel]
  const isPacked = selectedStatus === "packed"

  // Filter orders
  const filteredOrders = useMemo(() => {
    return allMockOrders.filter((o) => {
      if (o.marketplace !== selectedChannel) return false
      if (o.status !== selectedStatus) return false
      if (shippingMethod !== "all" && o.deliveryMethod.toLowerCase().replace(" ", "_") !== shippingMethod) return false
      if (paymentType !== "all" && o.payment.toLowerCase() !== paymentType) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return o.orderId.includes(q) || o.productTitle.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q)
      }
      return true
    })
  }, [selectedChannel, selectedStatus, shippingMethod, paymentType, searchQuery])

  const toggleOrderSelect = useCallback((id: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAllOrders = useCallback(() => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)))
    }
  }, [filteredOrders, selectedOrders.size])

  const openModal = (order: OrderItem) => {
    setModalOrder(order)
    setShowModal(true)
  }

  const ChannelLogo = marketplaceLogos[selectedChannel]?.Logo

  return (
    <div className="space-y-5" data-testid="orders-page">
      {/* Page Title */}
      <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="orders-title">
        Manage orders
      </h1>

      {/* Channel Selector Row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Select channel */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-medium">Select channel</span>
          <div ref={channelRef} className="relative">
            <button
              data-testid="channel-selector-btn"
              onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
              className={cn(
                "flex items-center gap-2 rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-all shadow-sm min-w-[160px]",
                channelDropdownOpen ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/40"
              )}
            >
              {ChannelLogo && <ChannelLogo className="h-3.5" />}
              <span className="ml-1 text-xs font-semibold text-muted-foreground bg-muted rounded px-1.5 py-0.5 tabular-nums">
                {marketplaceChannels.find((c) => c.id === selectedChannel)?.orderCount}
              </span>
              <ChevronDown className={cn("size-4 text-muted-foreground ml-auto transition-transform", channelDropdownOpen && "rotate-180")} />
            </button>

            {channelDropdownOpen && (
              <div
                data-testid="channel-dropdown"
                className="absolute top-full left-0 mt-1.5 w-56 bg-white border border-border rounded-xl shadow-xl p-1.5 z-30 animate-fade-up"
              >
                {marketplaceChannels.map((ch) => {
                  const Logo = marketplaceLogos[ch.id]?.Logo
                  return (
                    <button
                      key={ch.id}
                      data-testid={`channel-${ch.id}`}
                      onClick={() => { setSelectedChannel(ch.id); setChannelDropdownOpen(false) }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                        selectedChannel === ch.id ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {Logo && <Logo className="h-3.5" />}
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground tabular-nums">{ch.orderCount}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Last refresh */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Last data refresh 15 mins ago</span>
            <button data-testid="refresh-btn" className="flex items-center gap-1 text-primary font-medium hover:underline">
              <RefreshCw className="size-3" />
              Refresh now
            </button>
          </div>
        </div>

        {/* Right side: Search type + Search */}
        <div className="flex items-center gap-2 sm:ml-auto">
          <div ref={searchTypeRef} className="relative">
            <button
              data-testid="search-type-btn"
              onClick={() => setSearchTypeOpen(!searchTypeOpen)}
              className="flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-2 text-sm hover:bg-muted/50"
            >
              <span>{searchType}</span>
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </button>
            {searchTypeOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-border rounded-lg shadow-lg p-1 z-20">
                {["Order ID", "Product", "Customer"].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSearchType(t); setSearchTypeOpen(false) }}
                    className={cn("w-full text-left px-3 py-1.5 text-sm rounded-md", searchType === t ? "bg-primary/10 text-primary" : "hover:bg-muted")}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              data-testid="order-search-input"
              placeholder="Search order"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 pl-9 w-48"
            />
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap gap-2" data-testid="status-bar">
        {statuses.map((s) => (
          <button
            key={s.key}
            data-testid={`status-tab-${s.key}`}
            onClick={() => { setSelectedStatus(s.key); setSelectedOrders(new Set()) }}
            className={cn(
              "flex flex-col items-start rounded-lg border-2 px-4 py-3 min-w-[110px] transition-all",
              selectedStatus === s.key
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-white hover:border-primary/30"
            )}
          >
            <span className={cn("text-xs font-medium", selectedStatus === s.key ? "text-primary" : "text-muted-foreground")}>
              {s.label}
            </span>
            <span className={cn("text-xl font-bold tabular-nums mt-0.5", selectedStatus === s.key ? "text-primary" : "text-foreground")}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3" data-testid="filters-row">
        {hasShippingFilter(selectedChannel) && (
          <FilterSelect
            testId="shipping-filter"
            label="Shipping method"
            value={shippingMethod}
            onChange={setShippingMethod}
            options={[
              { value: "all", label: "Self ship" },
              { value: "self_ship", label: "Self ship" },
              { value: "easy_ship", label: "Easy ship" },
            ]}
          />
        )}

        <FilterSelect
          testId="date-filter"
          label="Date"
          value="all"
          onChange={() => {}}
          options={[{ value: "all", label: "Till date" }]}
        />

        {hasPaymentFilter(selectedChannel) && (
          <FilterSelect
            testId="payment-filter"
            label="Payment type"
            value={paymentType}
            onChange={setPaymentType}
            options={[
              { value: "all", label: "Select payment" },
              { value: "prepaid", label: "Prepaid" },
              { value: "cod", label: "COD" },
            ]}
          />
        )}

        <FilterSelect
          testId="sku-filter"
          label="SKU"
          value="all"
          onChange={() => {}}
          options={[{ value: "all", label: "Select SKU" }]}
        />

        <Button data-testid="search-filters-btn" className="h-9 px-6 rounded-lg font-medium">
          Search
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2" data-testid="quick-filters">
        <span className="text-xs text-muted-foreground font-medium mr-1">Quick filters:</span>
        {quickFilters.map((qf) => (
          <button
            key={qf}
            data-testid={`quick-filter-${qf.toLowerCase().replace(/ /g, "-")}`}
            onClick={() => setActiveQuickFilter(activeQuickFilter === qf ? null : qf)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              activeQuickFilter === qf
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-white text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {qf}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <Card className="overflow-hidden" data-testid="orders-table">
        {isPacked ? <PackedTableHeader allChecked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0} onToggleAll={toggleAllOrders} /> : <PendingTableHeader allChecked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0} onToggleAll={toggleAllOrders} />}

        <div className="divide-y divide-border">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground" data-testid="no-orders">
              <Package className="size-10 mb-3 opacity-40" />
              <p className="text-sm font-medium">No orders found</p>
              <p className="text-xs mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            filteredOrders.map((order) =>
              isPacked ? (
                <PackedOrderRow
                  key={order.id}
                  order={order}
                  checked={selectedOrders.has(order.id)}
                  onToggle={() => toggleOrderSelect(order.id)}
                  onOpenDrawer={() => setDrawerOrder(order)}
                />
              ) : (
                <PendingOrderRow
                  key={order.id}
                  order={order}
                  checked={selectedOrders.has(order.id)}
                  onToggle={() => toggleOrderSelect(order.id)}
                  onAction={() => openModal(order)}
                  onOpenDrawer={() => setDrawerOrder(order)}
                />
              )
            )
          )}
        </div>
      </Card>

      {/* Bottom Action Bar */}
      <ActionBar
        selectedCount={selectedOrders.size}
        marketplace={selectedChannel}
        isPacked={isPacked}
      />

      {/* Modal */}
      {showModal && modalOrder && (
        <OrderModal
          order={modalOrder}
          marketplace={selectedChannel}
          onClose={() => { setShowModal(false); setModalOrder(null) }}
        />
      )}

      {/* Order Detail Drawer */}
      {drawerOrder && (
        <OrderDetailDrawer
          order={drawerOrder}
          onClose={() => setDrawerOrder(null)}
        />
      )}
    </div>
  )
}

// ─── Filter Select Component ──────────────────────────────────────
function FilterSelect({ testId, label, value, onChange, options }: {
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

  const selected = options.find((o) => o.value === value) ?? options[0]

  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-muted-foreground font-medium">{label}</span>
      <div ref={ref} className="relative">
        <button
          data-testid={testId}
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm hover:bg-muted/50 min-w-[130px]"
        >
          <span className="flex-1 text-left text-foreground">{selected.label}</span>
          <ChevronDown className="size-3.5 text-muted-foreground" />
        </button>
        {open && (
          <div className="absolute top-full left-0 mt-1 w-full bg-white border border-border rounded-lg shadow-lg p-1 z-20">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={cn("w-full text-left px-3 py-1.5 text-sm rounded-md", value === opt.value ? "bg-primary/10 text-primary" : "hover:bg-muted")}
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

// ─── Table Headers ────────────────────────────────────────────────
function PendingTableHeader({ allChecked, onToggleAll }: { allChecked: boolean; onToggleAll: () => void }) {
  return (
    <div className="hidden lg:grid grid-cols-[40px_100px_150px_250px_160px_140px_90px_80px] gap-4 px-4 py-3 bg-muted/30 text-[11px] font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
      <div className="flex items-center justify-center">
        <Checkbox checked={allChecked} onChange={onToggleAll} testId="select-all-checkbox" />
      </div>
      <span>Order date</span>
      <span>Order details</span>
      <span>Product details</span>
      <span>Customer details</span>
      <span>Delivery details</span>
      <span>Payment</span>
      <span>Status</span>
    </div>
  )
}

function PackedTableHeader({ allChecked, onToggleAll }: { allChecked: boolean; onToggleAll: () => void }) {
  return (
    <div className="hidden lg:grid grid-cols-[40px_100px_280px_160px_150px_150px_100px] gap-4 px-4 py-3 bg-muted/30 text-[11px] font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
      <div className="flex items-center justify-center">
        <Checkbox checked={allChecked} onChange={onToggleAll} testId="select-all-checkbox" />
      </div>
      <span>Order date</span>
      <span>Product details</span>
      <span>Customer details</span>
      <span>Handover date</span>
      <span>AWB number</span>
      <span>Status</span>
    </div>
  )
}

// ─── Checkbox ─────────────────────────────────────────────────────
function Checkbox({ checked, onChange, testId }: { checked: boolean; onChange: () => void; testId: string }) {
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

// ─── Pending Order Row ────────────────────────────────────────────
function PendingOrderRow({ order, checked, onToggle, onAction, onOpenDrawer }: {
  order: OrderItem; checked: boolean; onToggle: () => void; onAction: () => void; onOpenDrawer: () => void
}) {
  const MpLogo = marketplaceLogos[order.marketplace]?.Logo
  return (
    <div
      data-testid={`order-row-${order.id}`}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-[40px_100px_150px_250px_160px_140px_90px_80px] gap-2 lg:gap-4 px-4 py-4 items-start hover:bg-muted/20 transition-colors",
        checked && "bg-primary/5"
      )}
    >
      {/* Checkbox */}
      <div className="flex items-start justify-center pt-1">
        <Checkbox checked={checked} onChange={onToggle} testId={`order-check-${order.id}`} />
      </div>

      {/* Order date */}
      <div className="text-xs text-muted-foreground overflow-hidden">
        <p className="font-medium text-foreground truncate">{order.timeAgo}</p>
        <p className="whitespace-pre-line mt-0.5">{order.orderDate}</p>
      </div>

      {/* Order details */}
      <div className="text-xs overflow-hidden">
        <button onClick={onOpenDrawer} className="text-primary font-medium hover:underline text-left truncate block w-full" data-testid={`order-link-${order.id}`}>
          {order.orderId}
        </button>
        <p className="text-muted-foreground mt-0.5 truncate">{order.fulfillment}</p>
        {MpLogo && (
          <span className={cn("inline-flex items-center rounded-md border px-1.5 py-0.5 mt-1", marketplaceLogos[order.marketplace]?.bgColor)}>
            <MpLogo className="h-2.5" />
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
          <ImageIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="text-xs min-w-0">
          <a href="#" className="text-primary font-medium hover:underline truncate block">{order.productTitle}</a>
          <p className="text-muted-foreground mt-0.5">Quantity : {order.quantity}</p>
          <p className="text-muted-foreground truncate">SKU : {order.productCategory}</p>
        </div>
      </div>

      {/* Customer details */}
      <div className="text-xs overflow-hidden">
        <p className="font-medium text-foreground truncate">{order.customerName}</p>
        <p className="text-muted-foreground truncate">{order.customerPhone}</p>
        <p className="text-muted-foreground mt-0.5 truncate">{order.customerAddress}</p>
      </div>

      {/* Delivery details */}
      <div className="text-xs overflow-hidden">
        <p className="font-medium text-foreground truncate">{order.deliveryMethod}</p>
        <p className="text-muted-foreground truncate">Ship by : {order.shipBy}</p>
        <p className="text-muted-foreground truncate">Deliver by : {order.deliverBy}</p>
        {order.sla === "breached" && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 rounded px-1.5 py-0.5" data-testid={`sla-breached-${order.id}`}>
            {order.slaText}
          </span>
        )}
        {order.sla === "warning" && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-amber-700 bg-amber-50 rounded px-1.5 py-0.5" data-testid={`sla-warning-${order.id}`}>
            {order.slaText}
          </span>
        )}
      </div>

      {/* Payment */}
      <div className="text-xs">
        <p className="font-medium text-foreground">{order.payment}</p>
        <p className="font-semibold text-foreground tabular-nums">{order.amount}</p>
      </div>

      {/* Status */}
      <div>
        <span className={cn(
          "inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 border",
          order.status === "pending" || order.status === "new"
            ? "text-amber-700 bg-amber-50 border-amber-200"
            : order.status === "accepted"
            ? "text-blue-700 bg-blue-50 border-blue-200"
            : "text-muted-foreground bg-muted border-border"
        )}>
          {order.status === "new" ? "New" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </span>
      </div>
    </div>
  )
}

// ─── Packed Order Row ─────────────────────────────────────────────
function PackedOrderRow({ order, checked, onToggle, onOpenDrawer }: {
  order: OrderItem; checked: boolean; onToggle: () => void; onOpenDrawer: () => void
}) {
  return (
    <div
      data-testid={`order-row-${order.id}`}
      className={cn(
        "grid grid-cols-1 lg:grid-cols-[40px_100px_280px_160px_150px_150px_100px] gap-2 lg:gap-4 px-4 py-4 items-start hover:bg-muted/20 transition-colors",
        checked && "bg-primary/5"
      )}
    >
      {/* Checkbox */}
      <div className="flex items-start justify-center pt-1">
        <Checkbox checked={checked} onChange={onToggle} testId={`order-check-${order.id}`} />
      </div>

      {/* Order date */}
      <div className="text-xs text-muted-foreground overflow-hidden">
        <p className="font-medium text-foreground truncate">{order.timeAgo}</p>
        <p className="whitespace-pre-line mt-0.5">{order.orderDate}</p>
      </div>

      {/* Product details */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all" onClick={onOpenDrawer}>
          <ImageIcon className="size-5 text-muted-foreground" />
        </div>
        <div className="text-xs min-w-0">
          <a href="#" className="text-primary font-medium hover:underline truncate block">{order.productTitle}</a>
          <p className="text-muted-foreground mt-0.5">Quantity : {order.quantity}</p>
          <p className="text-muted-foreground truncate">SKU : {order.productCategory}</p>
        </div>
      </div>

      {/* Customer details */}
      <div className="text-xs overflow-hidden">
        <p className="font-medium text-foreground truncate">{order.customerName}</p>
        <p className="text-muted-foreground truncate">{order.customerPhone}</p>
        <p className="text-muted-foreground mt-0.5 truncate">{order.customerAddress}</p>
      </div>

      {/* Handover date */}
      <div className="text-xs overflow-hidden">
        <p className="font-semibold text-foreground truncate">{order.handoverCountdown}</p>
        <p className="text-muted-foreground mt-0.5 truncate">{order.handoverDate}</p>
        {order.sla === "breached" && (
          <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 rounded px-1.5 py-0.5">
            SLA breached
          </span>
        )}
      </div>

      {/* AWB number */}
      <div className="text-xs overflow-hidden">
        <a href="#" className="text-primary font-medium hover:underline tabular-nums truncate block">{order.awbNumber}</a>
        <p className="text-muted-foreground mt-0.5 truncate">{order.awbCarrier}</p>
      </div>

      {/* Label Status */}
      <div>
        <span className={cn(
          "inline-block text-[10px] font-semibold rounded-full px-2 py-0.5 border whitespace-nowrap",
          order.labelStatus === "printed"
            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
            : "text-amber-700 bg-amber-50 border-amber-200"
        )}>
          {order.labelStatus === "printed" ? "Labels printed" : "Labels pending"}
        </span>
      </div>
    </div>
  )
}

// ─── Bottom Action Bar ────────────────────────────────────────────
function ActionBar({ selectedCount, marketplace, isPacked }: {
  selectedCount: number; marketplace: MarketplaceId; isPacked: boolean
}) {
  const isCoupang = marketplace === "coupang"

  return (
    <div
      data-testid="action-bar"
      className="sticky bottom-0 flex items-center justify-between rounded-xl border border-border bg-white px-5 py-3 shadow-lg"
    >
      <span className="text-sm text-muted-foreground" data-testid="selected-count">
        Action on {selectedCount} selected orders:
      </span>

      <div className="flex items-center gap-2">
        {isPacked ? (
          <>
            <Button variant="outline" size="sm" className="gap-1.5" data-testid="action-print-labels">
              <Printer className="size-3.5" />
              Print labels
            </Button>
            <Button size="sm" className="gap-1.5" data-testid="action-create-manifest">
              <FileText className="size-3.5" />
              Create manifest
            </Button>
          </>
        ) : (
          <>
            {!isCoupang && (
              <>
                <Button variant="outline" size="sm" className="gap-1.5" data-testid="action-export">
                  <Download className="size-3.5" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" data-testid="action-import">
                  <Upload className="size-3.5" />
                  Import
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5 opacity-50 cursor-not-allowed" disabled data-testid="action-split">
                  <Scissors className="size-3.5" />
                  Split orders
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" data-testid="action-mark-oos">
                  <CircleAlert className="size-3.5" />
                  Mark OOS
                </Button>
              </>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive" data-testid="action-cancel">
              <X className="size-3.5" />
              Cancel order
            </Button>
            <Button size="sm" className="gap-1.5" data-testid="action-confirm">
              <Check className="size-3.5" />
              Confirm order
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Order Modal ──────────────────────────────────────────────────
function OrderModal({ order, marketplace, onClose }: {
  order: OrderItem; marketplace: MarketplaceId; onClose: () => void
}) {
  const isFlipkart = marketplace === "flipkart"
  const title = isFlipkart ? "Process labels" : "Schedule pickup"
  const cta = isFlipkart ? "Process labels" : "Schedule pickup"
  const ChannelLogo = marketplaceLogos[marketplace]?.Logo

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" data-testid="order-modal-overlay" onClick={onClose}>
      <div
        data-testid="order-modal"
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl mx-4 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h2 className="text-lg font-bold text-foreground font-heading">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted transition-colors" data-testid="modal-close-btn">
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-3 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <ImageIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <a href="#" className="text-sm text-primary font-medium hover:underline line-clamp-2">{order.productTitle}</a>
              <p className="text-xs text-muted-foreground mt-0.5">Quantity : {order.quantity}</p>
              <p className="text-xs text-muted-foreground">Total amount : Rs.2,000</p>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <div>
                <p className="text-muted-foreground mb-0.5">Channel</p>
                {ChannelLogo && <ChannelLogo className="h-3.5" />}
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Shipment</p>
                <p className="font-medium">SDGU00015</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Order ID</p>
                <p className="font-medium tabular-nums">7895784974847</p>
              </div>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="px-6 py-4 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Package details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Package weight (in grams)</label>
              <Input data-testid="package-weight" defaultValue="400" className="h-9" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Package dimensions ( L x W x H in CM )</label>
              <div className="flex gap-2">
                <Input data-testid="package-length" defaultValue="17" className="h-9" />
                <Input data-testid="package-width" defaultValue="15" className="h-9" />
                <Input data-testid="package-height" defaultValue="7" className="h-9" />
              </div>
            </div>
          </div>

          {!isFlipkart && (
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Package identifier</label>
              <Input data-testid="package-identifier" defaultValue="12554779587959" className="h-9" />
            </div>
          )}
        </div>

        {/* Pickup Slot */}
        <div className="px-6 pb-4 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Pickup slot</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Pickup date</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm">
                <span className="flex-1">1 Dec 2025</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1.5">Pickup time</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-1.5 text-sm">
                <span className="flex-1">11:00 AM - 2:00 PM</span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Fee (Amazon only) */}
        {!isFlipkart && (
          <div className="px-6 pb-4">
            <p className="text-xs text-muted-foreground">Total shipping fee</p>
            <p className="text-sm font-bold text-foreground">Rs.70</p>
          </div>
        )}

        {/* CTA */}
        <div className="px-6 pb-6">
          <Button className="w-full h-10 rounded-lg font-medium" data-testid="modal-cta-btn" onClick={onClose}>
            {cta}
          </Button>
        </div>
      </div>
    </div>
  )
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

  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  const statusColor = order.status === "pending" || order.status === "new"
    ? "bg-amber-100 text-amber-800 border-amber-200"
    : order.status === "accepted"
    ? "bg-blue-100 text-blue-800 border-blue-200"
    : order.status === "packed"
    ? "bg-violet-100 text-violet-800 border-violet-200"
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
              {order.status === "new" ? "New" : order.status.charAt(0).toUpperCase() + order.status.slice(1).replace("_", " ")}
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
            <p className="text-xs text-muted-foreground mt-2">{order.timeAgo} &middot; {order.orderDate.replace("\n", ", ")}</p>
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
                  <span>SKU: <span className="font-medium text-foreground">{order.productCategory}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-4">Order Timeline</p>
            <div className="relative pl-6" data-testid="order-timeline">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-1 bottom-1 w-[2px] bg-border" />
              {timelineSteps.map((step, i) => {
                const Icon = step.icon
                const isLast = i === timelineSteps.length - 1
                return (
                  <div key={step.key} className={cn("relative flex items-start gap-3 pb-5", isLast && "pb-0")} data-testid={`timeline-${step.key}`}>
                    {/* Dot */}
                    <div className={cn(
                      "absolute -left-6 size-[22px] rounded-full flex items-center justify-center border-2 z-10",
                      step.done
                        ? "bg-primary border-primary"
                        : "bg-white border-border"
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
              <InfoCell label="Fulfillment" value="Seller" />
              {order.awbNumber && <InfoCell label="AWB Number" value={order.awbNumber} />}
              {order.awbCarrier && <InfoCell label="Carrier" value={order.awbCarrier} />}
            </div>
            {order.sla !== "ok" && (
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

          {/* Packaging Details */}
          <div className="px-5 py-4 border-b border-border">
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium mb-3">Package Details</p>
            <div className="grid grid-cols-2 gap-3">
              <InfoCell label="Weight" value="400g" />
              <InfoCell label="Dimensions" value="17 x 15 x 7 cm" />
              <InfoCell label="Package ID" value="SDGU00015" />
              <InfoCell label="Shipment ID" value={`SHP-${order.orderId.slice(-6)}`} />
            </div>
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
