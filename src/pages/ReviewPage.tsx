import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Rocket,
  Building2,
  ShoppingBag,
  Package,
  Warehouse,
  ShoppingCart,
  CheckCircle2,
  Pencil,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { OnboardingLayout, getOnboardingSteps } from "@/components/onboarding/OnboardingLayout"

const mockStoreDetails = {
  name: "My Electronics Store",
  country: "India",
  currency: "INR",
  timezone: "Asia/Kolkata",
  marketplace: "Amazon",
}

const mockConnectedMarketplaces = [
  { name: "Amazon", status: "connected" as const },
  { name: "Flipkart", status: "connected" as const },
]

const syncScope = [
  { label: "Products", description: "All product listings and variants", icon: Package, enabled: true },
  { label: "Inventory", description: "Stock levels across warehouses", icon: Warehouse, enabled: true },
  { label: "Orders", description: "Order history and new orders", icon: ShoppingCart, enabled: true },
]

export function ReviewPage() {
  const navigate = useNavigate()

  const handleStartSync = () => {
    navigate("/onboarding/syncing")
  }

  return (
    <OnboardingLayout steps={getOnboardingSteps(3)} currentStep={4} totalSteps={4}>
      <div data-testid="review-page">
        {/* Title */}
        <div className="flex items-start gap-4 mb-8">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Rocket className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="review-title">
              Review & start syncing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Confirm your setup and we'll start importing your data.
            </p>
          </div>
        </div>

        {/* Store Details Summary */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-4" data-testid="store-summary-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground" />
              <h3 className="font-heading text-sm font-semibold">Store Details</h3>
            </div>
            <Button variant="ghost" size="sm" data-testid="edit-store-btn" className="text-xs text-primary" asChild>
              <Link to="/onboarding/store-details">
                <Pencil className="size-3 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Store Name</p>
                <p className="font-medium text-foreground" data-testid="review-store-name">{mockStoreDetails.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Country</p>
                <p className="font-medium text-foreground">{mockStoreDetails.country}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Currency</p>
                <p className="font-medium text-foreground">{mockStoreDetails.currency}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Timezone</p>
                <p className="font-medium text-foreground">{mockStoreDetails.timezone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Primary Marketplace</p>
                <p className="font-medium text-foreground">{mockStoreDetails.marketplace}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Connected Marketplaces Summary */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-4" data-testid="marketplace-summary-card">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-4 text-muted-foreground" />
              <h3 className="font-heading text-sm font-semibold">Connected Marketplaces</h3>
              <Badge variant="success" className="text-xs">{mockConnectedMarketplaces.length}</Badge>
            </div>
            <Button variant="ghost" size="sm" data-testid="edit-marketplace-btn" className="text-xs text-primary" asChild>
              <Link to="/onboarding/connect-marketplace">
                <Pencil className="size-3 mr-1" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-3">
              {mockConnectedMarketplaces.map((mp) => (
                <div
                  key={mp.name}
                  data-testid={`review-marketplace-${mp.name.toLowerCase()}`}
                  className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2"
                >
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span className="text-sm font-medium text-foreground">{mp.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sync Scope */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-6" data-testid="sync-scope-card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
              <Package className="size-4 text-muted-foreground" />
              Sync Scope
            </h3>
          </div>
          <div className="px-6 py-4">
            <div className="space-y-3">
              {syncScope.map((item) => (
                <div
                  key={item.label}
                  data-testid={`sync-scope-${item.label.toLowerCase()}`}
                  className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                >
                  <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div
          data-testid="sync-info-banner"
          className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 mb-8"
        >
          <Info className="size-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">We'll start importing your data in the background.</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              This may take a few minutes depending on your catalog size. You can explore the dashboard while we sync.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border pt-6" data-testid="footer-navigation">
          <Button variant="outline" data-testid="back-btn" className="rounded-lg" asChild>
            <Link to="/onboarding/connect-marketplace">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button
            data-testid="start-sync-btn"
            onClick={handleStartSync}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Rocket className="size-4 mr-2" />
            Start Sync
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
