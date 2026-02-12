import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  CreditCard,
  Check,
  X,
  Star,
  Info,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { OnboardingLayout, getOnboardingSteps } from "@/components/onboarding/OnboardingLayout"

interface Plan {
  id: string
  name: string
  price: string
  period: string
  description: string
  popular?: boolean
  features: { label: string; value: string }[]
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with the basics.",
    features: [
      { label: "Products", value: "Up to 50" },
      { label: "Marketplaces", value: "1 marketplace" },
      { label: "Order sync", value: "Manual only" },
      { label: "Support", value: "Community" },
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: "$29",
    period: "/month",
    description: "For growing sellers ready to scale.",
    features: [
      { label: "Products", value: "Up to 500" },
      { label: "Marketplaces", value: "Up to 3" },
      { label: "Order sync", value: "Auto sync" },
      { label: "Support", value: "Email support" },
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: "$79",
    period: "/month",
    description: "Best value for multi-channel sellers.",
    popular: true,
    features: [
      { label: "Products", value: "Up to 5,000" },
      { label: "Marketplaces", value: "Up to 10" },
      { label: "Order sync", value: "Real-time sync" },
      { label: "Support", value: "Priority support" },
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$199",
    period: "/month",
    description: "For high-volume enterprise sellers.",
    features: [
      { label: "Products", value: "Unlimited" },
      { label: "Marketplaces", value: "Unlimited" },
      { label: "Order sync", value: "Real-time + webhooks" },
      { label: "Support", value: "Dedicated manager" },
    ],
  },
]

const comparisonFeatures = [
  { name: "Products limit", free: "50", silver: "500", gold: "5,000", platinum: "Unlimited" },
  { name: "Marketplaces", free: "1", silver: "3", gold: "10", platinum: "Unlimited" },
  { name: "Order sync", free: "Manual", silver: "Auto", gold: "Real-time", platinum: "Real-time + webhooks" },
  { name: "Inventory alerts", free: false, silver: true, gold: true, platinum: true },
  { name: "Pricing rules", free: false, silver: false, gold: true, platinum: true },
  { name: "Bulk import/export", free: false, silver: true, gold: true, platinum: true },
  { name: "Analytics & reports", free: "Basic", silver: "Standard", gold: "Advanced", platinum: "Custom" },
  { name: "API access", free: false, silver: false, gold: true, platinum: true },
  { name: "Team members", free: "1", silver: "3", gold: "10", platinum: "Unlimited" },
  { name: "Support", free: "Community", silver: "Email", gold: "Priority", platinum: "Dedicated manager" },
]

export function ChoosePlanPage() {
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [compareOpen, setCompareOpen] = useState(false)

  const handleContinue = () => {
    navigate("/onboarding/store-details")
  }

  return (
    <OnboardingLayout steps={getOnboardingSteps(0)} currentStep={1} totalSteps={4}>
      <div data-testid="choose-plan-page">
        {/* Title */}
        <div className="flex items-start gap-4 mb-8">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <CreditCard className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="choose-plan-title">
              Choose your plan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Start small and upgrade anytime.
            </p>
          </div>
        </div>

        {/* Plan Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6" data-testid="plan-grid">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id
            return (
              <button
                key={plan.id}
                data-testid={`plan-card-${plan.id}`}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  "relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md ring-2 ring-primary/20"
                    : "border-border bg-white hover:border-primary/30 hover:shadow-sm",
                  plan.popular && !isSelected && "border-primary/30"
                )}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2" data-testid="popular-badge">
                    <Badge className="bg-primary text-primary-foreground shadow-sm px-3 gap-1">
                      <Sparkles className="size-3" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{plan.description}</p>
                  </div>
                  {/* Selection indicator */}
                  <div className={cn(
                    "size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200",
                    isSelected ? "border-primary bg-primary" : "border-border"
                  )}>
                    {isSelected && <Check className="size-3 text-primary-foreground" />}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-0.5 mb-4">
                  <span className="font-heading text-3xl font-bold tracking-tight text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>

                {/* Features */}
                <div className="space-y-2.5">
                  {plan.features.map((feat) => (
                    <div key={feat.label} className="flex items-center gap-2 text-sm">
                      <Check className="size-3.5 text-emerald-500 shrink-0" />
                      <span className="text-muted-foreground">{feat.label}:</span>
                      <span className="font-medium text-foreground">{feat.value}</span>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Compare plans link */}
        <div className="text-center mb-6">
          <button
            data-testid="compare-plans-btn"
            onClick={() => setCompareOpen(true)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
          >
            Compare plans
            <ArrowRight className="size-3" />
          </button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-muted-foreground text-center mb-8 flex items-center justify-center gap-1">
          <Info className="size-3" />
          You can change your plan later from Settings.
        </p>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-border pt-6" data-testid="footer-navigation">
          <Button
            data-testid="continue-btn"
            onClick={handleContinue}
            disabled={!selectedPlan}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Compare Plans Modal */}
      {compareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="compare-modal-overlay">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCompareOpen(false)} />
          <div
            data-testid="compare-modal"
            className="relative bg-white rounded-2xl shadow-xl border border-border w-full max-w-3xl max-h-[80vh] overflow-hidden animate-fade-up"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-heading text-lg font-semibold">Compare Plans</h2>
              <button
                data-testid="close-compare-modal"
                onClick={() => setCompareOpen(false)}
                className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-auto max-h-[calc(80vh-60px)]">
              <table className="w-full text-sm" data-testid="compare-table">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground w-[180px]">Feature</th>
                    <th className="text-center px-3 py-3 font-semibold text-foreground">Free</th>
                    <th className="text-center px-3 py-3 font-semibold text-foreground">Silver</th>
                    <th className="text-center px-3 py-3 font-semibold text-foreground relative">
                      Gold
                      <Badge className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] bg-primary text-primary-foreground px-1.5">Popular</Badge>
                    </th>
                    <th className="text-center px-3 py-3 font-semibold text-foreground">Platinum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparisonFeatures.map((feat) => (
                    <tr key={feat.name} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{feat.name}</td>
                      {(["free", "silver", "gold", "platinum"] as const).map((planKey) => {
                        const val = feat[planKey]
                        return (
                          <td key={planKey} className="text-center px-3 py-3">
                            {typeof val === "boolean" ? (
                              val ? (
                                <Check className="size-4 text-emerald-500 mx-auto" />
                              ) : (
                                <X className="size-4 text-muted-foreground/40 mx-auto" />
                              )
                            ) : (
                              <span className="text-muted-foreground">{val}</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </OnboardingLayout>
  )
}
