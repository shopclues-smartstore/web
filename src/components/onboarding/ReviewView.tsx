import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  CreditCard,
  Info,
  Package,
  Pencil,
  Rocket,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getOnboardingSteps, OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/currency";
import { formatProviderName } from "@/lib/marketplace";
import { SYNC_SCOPE } from "@/shared/constants/onboarding";

export interface ReviewViewPlan {
  name?: string | null;
  priceMonthly?: number | null;
  currency?: string | null;
}

export interface ReviewViewStore {
  name: string;
  country: string;
  currency: string;
  timezone: string;
}

export interface ReviewViewMarketplace {
  id: string;
  provider: string;
  displayName?: string | null;
}

export interface ReviewViewProps {
  plan: ReviewViewPlan | null | undefined;
  store: ReviewViewStore;
  connectedMarketplaces: ReviewViewMarketplace[];
  onStartSync: () => void;
}

export function ReviewView({ plan, store, connectedMarketplaces, onStartSync }: ReviewViewProps) {
  const planPrice =
    plan?.priceMonthly != null && plan?.currency
      ? formatCurrency(plan.priceMonthly, plan.currency) + "/mo"
      : plan?.priceMonthly != null
      ? `${plan.priceMonthly}/mo`
      : null;

  return (
    <OnboardingLayout
      steps={getOnboardingSteps(3)}
      currentStep={4}
      totalSteps={4}
      wide
      footer={
        <>
          <Button variant="outline" data-testid="back-btn" className="rounded-lg" asChild>
            <Link to="/onboarding/connect-marketplace">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button
            data-testid="start-sync-btn"
            onClick={onStartSync}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Rocket className="size-4 mr-2" />
            Start Sync
          </Button>
        </>
      }
    >
      <div data-testid="review-page">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Rocket className="size-7 text-primary" />
          </div>
          <h1
            className="font-heading text-3xl font-bold tracking-tight text-foreground"
            data-testid="review-title"
          >
            Review & start syncing
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
            Confirm your setup and we'll start importing your data.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Plan Summary */}
          <div
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-4"
            data-testid="plan-summary-card"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <CreditCard className="size-4 text-muted-foreground" />
                <h3 className="font-heading text-sm font-semibold">Selected Plan</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                data-testid="edit-plan-btn"
                className="text-xs text-primary"
                asChild
              >
                <Link to="/onboarding/choose-plan">
                  <Pencil className="size-3 mr-1" />
                  Change
                </Link>
              </Button>
            </div>
            <div className="px-6 py-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  className="bg-primary text-primary-foreground gap-1"
                  data-testid="review-plan-badge"
                >
                  <Sparkles className="size-3" />
                  {plan?.name}
                </Badge>
                {planPrice && (
                  <span
                    className="text-sm font-medium text-foreground tabular-nums"
                    data-testid="review-plan-price"
                  >
                    {planPrice}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Store Details Summary */}
          <div
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-4"
            data-testid="store-summary-card"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                <h3 className="font-heading text-sm font-semibold">Store Details</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                data-testid="edit-store-btn"
                className="text-xs text-primary"
                asChild
              >
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
                  <p className="font-medium text-foreground" data-testid="review-store-name">
                    {store.name}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Country</p>
                  <p className="font-medium text-foreground">{store.country}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Currency</p>
                  <p className="font-medium text-foreground">{store.currency}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Timezone</p>
                  <p className="font-medium text-foreground">{store.timezone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Marketplaces Summary */}
          <div
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-4"
            data-testid="marketplace-summary-card"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-muted-foreground" />
                <h3 className="font-heading text-sm font-semibold">Connected Marketplaces</h3>
                <Badge variant="success" className="text-xs">
                  {connectedMarketplaces.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                data-testid="edit-marketplace-btn"
                className="text-xs text-primary"
                asChild
              >
                <Link to="/onboarding/connect-marketplace">
                  <Pencil className="size-3 mr-1" />
                  Edit
                </Link>
              </Button>
            </div>
            <div className="px-6 py-4">
              <div className="flex flex-wrap gap-3">
                {connectedMarketplaces.map((mp) => (
                  <div
                    key={mp.id}
                    data-testid={`review-marketplace-${mp.provider.toLowerCase()}`}
                    className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/50 px-3 py-2"
                  >
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    <span className="text-sm font-medium text-foreground">
                      {formatProviderName(mp.provider, mp.displayName)}
                    </span>
                  </div>
                ))}
                {connectedMarketplaces.length === 0 && (
                  <p className="text-sm text-muted-foreground">No marketplaces connected yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sync Scope */}
          <div
            className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden mb-6"
            data-testid="sync-scope-card"
          >
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-heading text-sm font-semibold flex items-center gap-2">
                <Package className="size-4 text-muted-foreground" />
                Sync Scope
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3">
                {SYNC_SCOPE.map((item) => (
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
              <p className="text-sm font-medium text-foreground">
                We'll start importing your data in the background.
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                This may take a few minutes depending on your catalog size. You can explore the
                dashboard while we sync.
              </p>
            </div>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}
