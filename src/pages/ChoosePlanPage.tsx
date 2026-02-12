import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  ArrowRight,
  CreditCard,
  Check,
  X,
  Info,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  Gift,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
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
  highlight?: string
  icon: React.ElementType
  accentColor: string
  gradientFrom: string
  gradientTo: string
  features: { label: string; value: string; highlighted?: boolean }[]
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Get started with the basics and explore the platform.",
    icon: Gift,
    accentColor: "text-slate-600",
    gradientFrom: "from-slate-400",
    gradientTo: "to-slate-600",
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
    description: "For growing sellers ready to scale their business.",
    icon: Rocket,
    accentColor: "text-blue-600",
    gradientFrom: "from-blue-400",
    gradientTo: "to-cyan-500",
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
    highlight: "+2 months free on annual billing",
    icon: Crown,
    accentColor: "text-primary",
    gradientFrom: "from-primary",
    gradientTo: "to-cyan-400",
    features: [
      { label: "Products", value: "Up to 5,000", highlighted: true },
      { label: "Marketplaces", value: "Up to 10", highlighted: true },
      { label: "Order sync", value: "Real-time sync" },
      { label: "Support", value: "Priority support" },
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "$199",
    period: "/month",
    description: "For high-volume enterprise sellers with advanced needs.",
    icon: Zap,
    accentColor: "text-violet-600",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-600",
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
  const [selectedIndex, setSelectedIndex] = useState(2) // Gold by default
  const [compareOpen, setCompareOpen] = useState(false)

  const selectedPlan = plans[selectedIndex]

  const handleContinue = () => {
    navigate("/onboarding/store-details")
  }

  const handlePrev = () => {
    setSelectedIndex((i) => Math.max(0, i - 1))
  }

  const handleNext = () => {
    setSelectedIndex((i) => Math.min(plans.length - 1, i + 1))
  }

  return (
    <OnboardingLayout
      steps={getOnboardingSteps(0)}
      currentStep={1}
      totalSteps={4}
      wide
      footer={
        <>
          <div />
          <Button
            data-testid="continue-btn"
            onClick={handleContinue}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            Continue with {selectedPlan.name}
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </>
      }
    >
      <div data-testid="choose-plan-page">
        {/* Title */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="size-7 text-primary" />
          </div>
          <h1
            className="font-heading text-3xl font-bold tracking-tight text-foreground"
            data-testid="choose-plan-title"
          >
            Choose your plan
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
            Clear pricing. No strings attached. Start small and upgrade anytime.
          </p>
        </div>

        {/* Plan Selector Pills */}
        <div className="flex items-center justify-center gap-2 mb-8" data-testid="plan-pills">
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              data-testid={`plan-pill-${plan.id}`}
              onClick={() => setSelectedIndex(i)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
                selectedIndex === i
                  ? "bg-foreground text-background shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {plan.name}
              {plan.popular && selectedIndex !== i && (
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Carousel Container */}
        <div className="relative mb-8" data-testid="plan-carousel">
          {/* Nav Arrows */}
          <button
            data-testid="carousel-prev"
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 size-10 rounded-full bg-white border border-border shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:scale-105",
              selectedIndex === 0 && "opacity-30 cursor-not-allowed hover:scale-100"
            )}
          >
            <ChevronLeft className="size-5 text-foreground" />
          </button>
          <button
            data-testid="carousel-next"
            onClick={handleNext}
            disabled={selectedIndex === plans.length - 1}
            className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 size-10 rounded-full bg-white border border-border shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:scale-105",
              selectedIndex === plans.length - 1 && "opacity-30 cursor-not-allowed hover:scale-100"
            )}
          >
            <ChevronRightIcon className="size-5 text-foreground" />
          </button>

          {/* Cards Track */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out items-center py-6"
              style={{
                transform: `translateX(calc(33.333% - ${selectedIndex * 33.333}%))`,
              }}
              data-testid="plan-grid"
            >
              {plans.map((plan, i) => {
                const isCenter = i === selectedIndex
                const offset = i - selectedIndex
                const isAdjacent = Math.abs(offset) === 1
                const isFar = Math.abs(offset) >= 2

                return (
                  <div
                    key={plan.id}
                    className="shrink-0 px-2 transition-all duration-500 ease-out"
                    style={{
                      width: "calc(100% / 3)",
                      transform: isCenter
                        ? "scale(1)"
                        : isAdjacent
                        ? "scale(0.92)"
                        : "scale(0.85)",
                      opacity: isFar ? 0.5 : 1,
                    }}
                  >
                    <button
                      data-testid={`plan-card-${plan.id}`}
                      onClick={() => setSelectedIndex(i)}
                      className={cn(
                        "relative w-full flex flex-col rounded-2xl text-left transition-all duration-500 overflow-hidden",
                        isCenter
                          ? "shadow-2xl z-10"
                          : "shadow-sm hover:shadow-md z-0"
                      )}
                    >
                      {/* Gradient border wrapper for center card */}
                      {isCenter ? (
                        <div className={cn("p-[2px] rounded-2xl bg-gradient-to-br", plan.gradientFrom, plan.gradientTo)}>
                          <div className="bg-white rounded-[14px] p-6 flex flex-col min-h-[380px]">
                            <CenterCardContent plan={plan} />
                          </div>
                        </div>
                      ) : (
                        <div className="border border-border bg-white rounded-2xl p-6 flex flex-col min-h-[380px] hover:border-primary/20 transition-colors duration-300">
                          <SideCardContent plan={plan} />
                        </div>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Selected plan confirmation */}
        <div className="text-center mb-6" data-testid="selected-confirmation">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 transition-all duration-300">
            <Check className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              <span className="text-primary font-semibold">{selectedPlan.name}</span> plan selected
              <span className="text-muted-foreground"> — {selectedPlan.price}{selectedPlan.period}</span>
            </span>
          </div>
        </div>

        {/* Compare + Helper */}
        <div className="text-center mb-8 space-y-2">
          <button
            data-testid="compare-plans-btn"
            onClick={() => setCompareOpen(true)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 hover:gap-2"
          >
            Compare all plans in detail
            <ArrowRight className="size-3 transition-all duration-200" />
          </button>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Info className="size-3" />
            You can change your plan later from Settings.
          </p>
        </div>

        </div>
      </div>

      {/* Compare Plans Modal */}
      {compareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="compare-modal-overlay">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCompareOpen(false)} />
          <div
            data-testid="compare-modal"
            className="relative bg-white rounded-2xl shadow-2xl border border-border w-full max-w-4xl max-h-[85vh] overflow-hidden animate-fade-up"
          >
            {/* Modal header with gradient */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-cyan-500/5 to-violet-500/5" />
              <div className="relative flex items-center justify-between px-8 py-5">
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground">Compare Plans</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">Find the perfect fit for your business</p>
                </div>
                <button
                  data-testid="close-compare-modal"
                  onClick={() => setCompareOpen(false)}
                  className="rounded-xl p-2 text-muted-foreground hover:bg-white/80 hover:text-foreground transition-all duration-200 hover:shadow-sm"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="overflow-auto max-h-[calc(85vh-90px)]">
              <table className="w-full text-sm" data-testid="compare-table">
                <thead>
                  <tr className="border-b border-border sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <th className="text-left px-8 py-4 font-medium text-muted-foreground w-[200px]">Feature</th>
                    {(["Free", "Silver", "Gold", "Platinum"] as const).map((name, i) => {
                      const prices = ["$0", "$29", "$79", "$199"]
                      const isGold = name === "Gold"
                      const gradients = ["from-slate-400 to-slate-600", "from-blue-400 to-cyan-500", "from-primary to-cyan-400", "from-violet-500 to-purple-600"]
                      return (
                        <th key={name} className={cn("text-center px-4 py-4 relative", isGold && "bg-primary/[0.03]")}>
                          {isGold && (
                            <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-primary to-cyan-500 rounded-b-lg px-3 py-0.5 shadow-sm">
                                <Sparkles className="size-2.5" />
                                BEST VALUE
                              </span>
                            </div>
                          )}
                          <div className={cn("inline-flex items-center justify-center size-8 rounded-lg bg-gradient-to-br text-white mb-1.5", gradients[i])}>
                            {[Gift, Rocket, Crown, Zap][i] && (() => {
                              const Icon = [Gift, Rocket, Crown, Zap][i]
                              return <Icon className="size-4" />
                            })()}
                          </div>
                          <div className="font-heading text-sm font-bold text-foreground">{name}</div>
                          <div className="text-xs text-muted-foreground font-normal mt-0.5">{prices[i]}/mo</div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feat, fi) => (
                    <tr
                      key={feat.name}
                      className={cn(
                        "border-b border-border/60 transition-colors hover:bg-muted/30",
                        fi % 2 === 0 && "bg-muted/10"
                      )}
                    >
                      <td className="px-8 py-3.5 font-medium text-foreground">{feat.name}</td>
                      {(["free", "silver", "gold", "platinum"] as const).map((planKey) => {
                        const val = feat[planKey]
                        const isGoldCol = planKey === "gold"
                        return (
                          <td key={planKey} className={cn("text-center px-4 py-3.5", isGoldCol && "bg-primary/[0.03]")}>
                            {typeof val === "boolean" ? (
                              val ? (
                                <div className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-50">
                                  <Check className="size-3.5 text-emerald-600" />
                                </div>
                              ) : (
                                <div className="inline-flex items-center justify-center size-6 rounded-full bg-muted/50">
                                  <X className="size-3.5 text-muted-foreground/30" />
                                </div>
                              )
                            ) : (
                              <span className={cn(
                                "text-sm",
                                isGoldCol ? "font-semibold text-primary" : "text-muted-foreground"
                              )}>
                                {val}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Bottom CTA area */}
              <div className="px-8 py-6 border-t border-border bg-gradient-to-r from-muted/30 via-transparent to-muted/30">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Not sure yet? Start with <span className="font-medium text-foreground">Free</span> and upgrade anytime.
                  </p>
                  <Button
                    data-testid="modal-close-btn"
                    onClick={() => setCompareOpen(false)}
                    className="rounded-lg shadow-sm"
                  >
                    Choose a plan
                    <ArrowRight className="size-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </OnboardingLayout>
  )
}

/* ============================================
   Center Card Content - the "hero" selected card
   ============================================ */
function CenterCardContent({ plan }: { plan: Plan }) {
  const Icon = plan.icon
  return (
    <>
      {/* Badge */}
      {plan.popular && (
        <div className="flex justify-center -mt-1 mb-3" data-testid="popular-badge">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-semibold px-3.5 py-1 shadow-md">
            <Sparkles className="size-3" />
            Best Deal
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className={cn("size-10 rounded-xl bg-gradient-to-br flex items-center justify-center", plan.gradientFrom, plan.gradientTo)}>
          <Icon className="size-5 text-white" />
        </div>
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">{plan.name}</h3>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

      {/* Price - big emphasis */}
      <div className="flex items-baseline gap-1 mb-2">
        <span className="font-heading text-5xl font-bold tracking-tight text-foreground">{plan.price}</span>
        <span className="text-base text-muted-foreground font-medium">{plan.period}</span>
      </div>

      {/* Highlight text */}
      {plan.highlight && (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 mb-4">
          <Sparkles className="size-3" />
          {plan.highlight}
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-border my-3" />

      {/* Features */}
      <div className="space-y-3 flex-1">
        {plan.features.map((feat) => (
          <div key={feat.label} className="flex items-center gap-2.5 text-sm">
            <div className={cn("size-5 rounded-full flex items-center justify-center shrink-0", feat.highlighted ? "bg-primary/10" : "bg-emerald-50")}>
              <Check className={cn("size-3", feat.highlighted ? "text-primary" : "text-emerald-500")} />
            </div>
            <span className="text-muted-foreground">{feat.label}:</span>
            <span className={cn("font-semibold", feat.highlighted ? "text-primary" : "text-foreground")}>{feat.value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className={cn("mt-5 w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white bg-gradient-to-r shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110", plan.gradientFrom, plan.gradientTo)}>
        Selected Plan
      </div>
    </>
  )
}

/* ============================================
   Side Card Content - non-selected cards
   ============================================ */
function SideCardContent({ plan }: { plan: Plan }) {
  const Icon = plan.icon
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className={cn("size-9 rounded-lg bg-muted flex items-center justify-center")}>
            <Icon className="size-4 text-muted-foreground" />
          </div>
          <h3 className="font-heading text-lg font-semibold text-foreground">{plan.name}</h3>
        </div>
        {plan.popular && (
          <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
            Popular
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>

      {/* Price */}
      <div className="flex items-baseline gap-0.5 mb-4">
        <span className="font-heading text-3xl font-bold tracking-tight text-foreground">{plan.price}</span>
        <span className="text-sm text-muted-foreground">{plan.period}</span>
      </div>

      {/* Features */}
      <div className="space-y-2.5 flex-1">
        {plan.features.map((feat) => (
          <div key={feat.label} className="flex items-center gap-2 text-sm">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span className="text-muted-foreground">{feat.label}:</span>
            <span className="font-medium text-foreground">{feat.value}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-5 w-full rounded-xl border border-border py-2.5 text-center text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:text-foreground">
        Select Plan
      </div>
    </>
  )
}
