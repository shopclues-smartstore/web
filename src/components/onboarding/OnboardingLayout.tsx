import { Link } from "react-router-dom"
import { Store, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface OnboardingStep {
  label: string
  path: string
  done: boolean
  active: boolean
}

interface OnboardingLayoutProps {
  steps: OnboardingStep[]
  currentStep: number
  totalSteps: number
  wide?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
}

export function OnboardingLayout({ steps, currentStep, totalSteps, wide, children, footer }: OnboardingLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-background" data-testid="onboarding-layout">
      {/* Fixed top: header + progress */}
      <div className="shrink-0">
        {/* Top bar */}
        <header className="border-b border-border bg-white">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-3.5">
            <Link to="/" className="flex items-center gap-2" data-testid="onboarding-logo">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <Store className="size-4 text-primary-foreground" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight">SmartStore</span>
            </Link>
            <span className="text-sm text-muted-foreground" data-testid="step-counter">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </header>

        {/* Progress steps */}
        <div className="border-b border-border bg-white">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <div className="flex items-center justify-center gap-1" data-testid="onboarding-progress">
              {steps.map((step, i) => (
                <div key={step.label} className="flex items-center gap-1">
                  {i > 0 && (
                    <div className={cn(
                      "h-px w-8 md:w-16 lg:w-20 shrink-0",
                      step.done || step.active ? "bg-primary" : "bg-border"
                    )} />
                  )}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div
                      className={cn(
                        "size-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors shrink-0",
                        step.done
                          ? "bg-primary text-primary-foreground"
                          : step.active
                          ? "bg-primary/10 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step.done ? <Check className="size-3" /> : i + 1}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium whitespace-nowrap hidden sm:block",
                        step.active ? "text-foreground" : step.done ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable center content */}
      <div className="flex-1 overflow-y-auto">
        <div className={cn("mx-auto px-6 py-8 animate-fade-up", wide ? "max-w-5xl" : "max-w-3xl")}>
          {children}
        </div>
      </div>

      {/* Fixed footer */}
      {footer && (
        <div className="shrink-0 border-t border-border bg-white" data-testid="onboarding-footer">
          <div className={cn("mx-auto px-6 py-4 flex items-center justify-between", wide ? "max-w-5xl" : "max-w-3xl")}>
            {footer}
          </div>
        </div>
      )}
    </div>
  )
}

export function getOnboardingSteps(activeIndex: number): OnboardingStep[] {
  const labels = ["Choose Plan", "Store Details", "Connect Marketplace", "Review & Sync"]
  const paths = ["/onboarding/choose-plan", "/onboarding/store-details", "/onboarding/connect-marketplace", "/onboarding/review"]
  return labels.map((label, i) => ({
    label,
    path: paths[i],
    done: i < activeIndex,
    active: i === activeIndex,
  }))
}
