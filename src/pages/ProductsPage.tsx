import { useState, useEffect, useRef } from "react"
import {
  ChevronDown,
  Search,
  Filter,
  CheckCircle2,
  Loader2,
  Clock,
  Package,
  Eye,
  Pencil,
  ToggleLeft,
  ToggleRight,
  X,
  Info,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type SyncStatus = "synced" | "syncing" | "pending"

interface MarketplaceSync {
  id: string
  name: string
  status: SyncStatus
  productCount: number
}

interface Product {
  id: string
  title: string
  sku: string
  marketplace: string
  image: string
  status: "ready" | "under_review" | "action_required"
  inventory: number
  price: string
  published: boolean
}

const initialMarketplaces: MarketplaceSync[] = [
  { id: "amazon", name: "Amazon", status: "synced", productCount: 156 },
  { id: "flipkart", name: "Flipkart", status: "synced", productCount: 89 },
  { id: "meesho", name: "Meesho", status: "syncing", productCount: 0 },
  { id: "wish", name: "Wish", status: "pending", productCount: 0 },
]

const mockProducts: Product[] = [
  { id: "p1", title: "Wireless Bluetooth Headphones Pro", sku: "WBH-PRO-001", marketplace: "amazon", image: "", status: "ready", inventory: 234, price: "$49.99", published: true },
  { id: "p2", title: "USB-C Hub 7-in-1 Adapter", sku: "UCH-7IN1-002", marketplace: "amazon", image: "", status: "ready", inventory: 89, price: "$29.99", published: true },
  { id: "p3", title: "Smart LED Desk Lamp", sku: "SLD-LAMP-003", marketplace: "amazon", image: "", status: "under_review", inventory: 45, price: "$39.99", published: false },
  { id: "p4", title: "Mechanical Keyboard RGB", sku: "MK-RGB-004", marketplace: "amazon", image: "", status: "ready", inventory: 312, price: "$79.99", published: true },
  { id: "p5", title: "Portable Power Bank 20000mAh", sku: "PPB-20K-005", marketplace: "amazon", image: "", status: "action_required", inventory: 8, price: "$24.99", published: true },
  { id: "p6", title: "Noise Cancelling Earbuds", sku: "NCE-BUD-006", marketplace: "amazon", image: "", status: "ready", inventory: 167, price: "$59.99", published: true },
  { id: "p7", title: "Ergonomic Mouse Wireless", sku: "EMW-001", marketplace: "flipkart", image: "", status: "ready", inventory: 203, price: "\u20B91,499", published: true },
  { id: "p8", title: "Webcam 1080p Full HD", sku: "WC-1080-002", marketplace: "flipkart", image: "", status: "ready", inventory: 56, price: "\u20B92,299", published: true },
  { id: "p9", title: "USB Microphone Condenser", sku: "UMC-STD-003", marketplace: "flipkart", image: "", status: "under_review", inventory: 34, price: "\u20B93,499", published: false },
  { id: "p10", title: "Smart Watch Fitness Tracker", sku: "SWF-TRK-004", marketplace: "flipkart", image: "", status: "ready", inventory: 128, price: "\u20B94,999", published: true },
  { id: "p11", title: "Laptop Stand Adjustable", sku: "LSA-ALU-005", marketplace: "flipkart", image: "", status: "action_required", inventory: 3, price: "\u20B91,999", published: true },
]

const statusConfig = {
  ready: { label: "Ready", variant: "success" as const, dotColor: "bg-emerald-500" },
  under_review: { label: "Under review", variant: "default" as const, dotColor: "bg-blue-500" },
  action_required: { label: "Action required", variant: "warning" as const, dotColor: "bg-amber-500" },
}

const syncStatusConfig = {
  synced: { label: "Synced", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  syncing: { label: "Syncing", icon: Loader2, color: "text-primary", bg: "bg-primary/10", spin: true },
  pending: { label: "Pending", icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
}

export function ProductsPage() {
  const [marketplaces, setMarketplaces] = useState<MarketplaceSync[]>(initialMarketplaces)
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [bannerVisible, setBannerVisible] = useState(true)

  const filterRef = useRef<HTMLDivElement>(null)

  const syncedCount = marketplaces.filter((m) => m.status === "synced").length
  const totalCount = marketplaces.length
  const allSynced = syncedCount === totalCount

  // Simulate Meesho finishing sync after 8 seconds
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMarketplaces((prev) =>
        prev.map((m) =>
          m.id === "meesho" ? { ...m, status: "synced" as SyncStatus, productCount: 42 } : m
        )
      )
      // Add Meesho products
      const meeshoProducts: Product[] = [
        { id: "p12", title: "Cotton T-Shirt Combo Pack", sku: "CTS-CMB-001", marketplace: "meesho", image: "", status: "ready", inventory: 520, price: "\u20B9499", published: true },
        { id: "p13", title: "Phone Case Silicone Cover", sku: "PCS-SIL-002", marketplace: "meesho", image: "", status: "ready", inventory: 890, price: "\u20B9199", published: true },
        { id: "p14", title: "Kitchen Organizer Set", sku: "KOS-SET-003", marketplace: "meesho", image: "", status: "under_review", inventory: 145, price: "\u20B9349", published: false },
      ]
      setProducts((prev) => [...prev, ...meeshoProducts])
      toast.success("Meesho marketplace sync completed", {
        description: "42 products are now available for review.",
      })
    }, 8000)

    // Simulate Wish finishing sync after 15 seconds
    const timer2 = setTimeout(() => {
      setMarketplaces((prev) =>
        prev.map((m) => {
          if (m.id === "wish") return { ...m, status: "synced" as SyncStatus, productCount: 28 }
          if (m.id === "meesho" && m.status !== "synced") return { ...m, status: "synced" as SyncStatus, productCount: 42 }
          return m
        })
      )
      const wishProducts: Product[] = [
        { id: "p15", title: "Mini Bluetooth Speaker", sku: "MBS-PTB-001", marketplace: "wish", image: "", status: "ready", inventory: 340, price: "$12.99", published: true },
        { id: "p16", title: "LED Strip Lights RGB 5m", sku: "LSL-RGB-002", marketplace: "wish", image: "", status: "ready", inventory: 215, price: "$8.99", published: true },
      ]
      setProducts((prev) => [...prev, ...wishProducts])
      toast.success("Wish marketplace sync completed", {
        description: "28 products are now available for review.",
      })
    }, 15000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Filter products
  const filteredProducts = products.filter((p) => {
    const mp = marketplaces.find((m) => m.id === p.marketplace)
    if (!mp || mp.status !== "synced") return false
    if (selectedFilter !== "all" && p.marketplace !== selectedFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return p.title.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
    }
    return true
  })

  // Get pending/syncing marketplaces for skeletons
  const nonSyncedMps = marketplaces.filter((m) => m.status !== "synced" && !m.id.startsWith("more"))

  const selectedMpName = selectedFilter === "all"
    ? "All Marketplaces"
    : marketplaces.find((m) => m.id === selectedFilter)?.name ?? "All"

  const handleTogglePublish = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    )
  }

  const currentAllSynced = marketplaces.every((m) => m.status === "synced")

  return (
    <div className="space-y-6" data-testid="products-page">
      {/* Status Banner */}
      {bannerVisible && !currentAllSynced && (
        <div
          data-testid="sync-status-banner"
          className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4 animate-fade-up"
        >
          <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <RefreshCw className="size-4 text-primary animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              Your marketplaces are still syncing.
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              You can review products from completed marketplaces while we continue.
            </p>
            <div className="flex items-center gap-2 mt-3">
              {/* Mini progress bar */}
              <div className="h-1.5 w-32 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700"
                  style={{ width: `${(marketplaces.filter((m) => m.status === "synced").length / totalCount) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground" data-testid="sync-progress-text">
                {marketplaces.filter((m) => m.status === "synced").length} of {totalCount} marketplaces synced
              </span>
            </div>
          </div>
          <button
            data-testid="dismiss-sync-banner"
            onClick={() => setBannerVisible(false)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* All synced message */}
      {currentAllSynced && bannerVisible && (
        <div
          data-testid="all-synced-banner"
          className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 animate-fade-up"
        >
          <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-medium text-emerald-800 flex-1">
            All marketplaces are now synced.
          </p>
          <button
            data-testid="dismiss-all-synced"
            onClick={() => setBannerVisible(false)}
            className="text-emerald-600 hover:text-emerald-800 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="products-title">
            Products
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3" data-testid="filters-bar">
        {/* Marketplace Filter */}
        <div ref={filterRef} className="relative">
          <button
            data-testid="marketplace-filter-btn"
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors shadow-sm"
          >
            <Filter className="size-4 text-muted-foreground" />
            <span>{selectedMpName}</span>
            <ChevronDown className={cn("size-4 text-muted-foreground transition-transform duration-200", filterOpen && "rotate-180")} />
          </button>
          {filterOpen && (
            <div
              data-testid="marketplace-filter-dropdown"
              className="absolute top-full left-0 mt-1 w-64 bg-white border border-border rounded-xl shadow-lg p-1 z-20 animate-fade-up"
            >
              <button
                data-testid="filter-all"
                onClick={() => { setSelectedFilter("all"); setFilterOpen(false) }}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                  selectedFilter === "all" ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                )}
              >
                All Marketplaces
                <span className="text-xs text-muted-foreground">{products.filter((p) => marketplaces.find((m) => m.id === p.marketplace)?.status === "synced").length} products</span>
              </button>
              <div className="h-px bg-border my-1" />
              {marketplaces.filter((m) => !m.id.startsWith("more")).map((mp) => {
                const cfg = syncStatusConfig[mp.status]
                const Icon = cfg.icon
                return (
                  <button
                    key={mp.id}
                    data-testid={`filter-${mp.id}`}
                    onClick={() => {
                      if (mp.status === "synced") {
                        setSelectedFilter(mp.id)
                        setFilterOpen(false)
                      }
                    }}
                    disabled={mp.status !== "synced"}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                      mp.status !== "synced" && "opacity-50 cursor-not-allowed",
                      selectedFilter === mp.id ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {mp.name}
                      <span className={cn("inline-flex items-center gap-1 text-xs", cfg.color)}>
                        <Icon className={cn("size-3", cfg.spin && "animate-spin")} />
                        {cfg.label}
                      </span>
                    </div>
                    {mp.status === "synced" && (
                      <span className="text-xs text-muted-foreground">{mp.productCount}</span>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            data-testid="product-search-input"
            placeholder="Search by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9"
          />
        </div>
      </div>

      {/* Product Table */}
      <Card className="overflow-hidden" data-testid="product-table">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_100px_110px_110px_90px_80px_100px] gap-4 px-5 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
          <span>Product</span>
          <span>SKU</span>
          <span>Marketplace</span>
          <span>Status</span>
          <span>Inventory</span>
          <span>Price</span>
          <span>Actions</span>
        </div>

        {/* Product rows */}
        <div className="divide-y divide-border">
          {filteredProducts.map((product) => {
            const stCfg = statusConfig[product.status]
            return (
              <div
                key={product.id}
                data-testid={`product-row-${product.id}`}
                className="grid grid-cols-1 sm:grid-cols-[1fr_100px_110px_110px_90px_80px_100px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors duration-150"
              >
                {/* Product */}
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                    <ImageIcon className="size-4 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground truncate">{product.title}</span>
                </div>

                {/* SKU */}
                <span className="text-xs font-mono text-muted-foreground">{product.sku}</span>

                {/* Marketplace */}
                <div>
                  <Badge variant="outline" className="text-xs capitalize">{product.marketplace}</Badge>
                </div>

                {/* Status */}
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                    <span className={cn("size-1.5 rounded-full", stCfg.dotColor)} />
                    {stCfg.label}
                  </span>
                </div>

                {/* Inventory */}
                <span className={cn("text-sm tabular-nums", product.inventory <= 10 ? "text-amber-600 font-medium" : "text-foreground")}>
                  {product.inventory}
                </span>

                {/* Price */}
                <span className="text-sm font-medium tabular-nums text-foreground">{product.price}</span>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    data-testid={`view-product-${product.id}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="View product"
                  >
                    <Eye className="size-3.5" />
                  </button>
                  <button
                    data-testid={`edit-product-${product.id}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title="Edit product"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    data-testid={`toggle-publish-${product.id}`}
                    onClick={() => handleTogglePublish(product.id)}
                    className={cn(
                      "rounded-md p-1.5 transition-colors",
                      product.published ? "text-emerald-600 hover:bg-emerald-50" : "text-muted-foreground hover:bg-muted"
                    )}
                    title={product.published ? "Unpublish" : "Publish"}
                  >
                    {product.published ? <ToggleRight className="size-3.5" /> : <ToggleLeft className="size-3.5" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Skeleton states for syncing/pending marketplaces */}
      {nonSyncedMps.length > 0 && (selectedFilter === "all" || nonSyncedMps.some((m) => m.id === selectedFilter)) && (
        <div className="space-y-4" data-testid="skeleton-section">
          {nonSyncedMps.map((mp) => {
            const cfg = syncStatusConfig[mp.status]
            const Icon = cfg.icon
            return (
              <div key={mp.id} data-testid={`skeleton-block-${mp.id}`}>
                {/* Label */}
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={cn("size-4", cfg.color, cfg.spin && "animate-spin")} />
                  <span className="text-sm font-medium text-muted-foreground">
                    Products from {mp.name} will appear here once sync completes.
                  </span>
                </div>
                {/* Skeleton rows */}
                <Card className="overflow-hidden">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 sm:grid-cols-[1fr_100px_110px_110px_90px_80px_100px] gap-4 px-5 py-4 items-center border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-lg bg-muted animate-skeleton" />
                        <div className="space-y-1.5 flex-1">
                          <div className="h-3 w-3/4 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.1}s` }} />
                        </div>
                      </div>
                      <div className="h-3 w-16 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
                      <div className="h-5 w-16 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
                      <div className="h-3 w-14 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.1 + 0.15}s` }} />
                      <div className="h-3 w-8 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.1 + 0.2}s` }} />
                      <div className="h-3 w-12 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.1 + 0.25}s` }} />
                      <div className="h-3 w-16 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.1 + 0.3}s` }} />
                    </div>
                  ))}
                </Card>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
