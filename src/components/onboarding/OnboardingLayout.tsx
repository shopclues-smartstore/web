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
  children: React.ReactNode
}

export function OnboardingLayout({ steps, currentStep, totalSteps, children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-background" data-testid="onboarding-layout">
      {/* Top bar */}
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-6 py-4">
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
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2" data-testid="onboarding-progress">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2">
                {i > 0 && (
                  <div className={cn("h-px w-6 sm:w-10", step.done || step.active ? "bg-primary" : "bg-border")} />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "size-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors",
                      step.done
                        ? "bg-primary text-primary-foreground"
                        : step.active
                        ? "bg-primary/10 text-primary border-2 border-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step.done ? <Check className="size-3.5" /> : i + 1}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-10 animate-fade-up">
        {children}
      </div>
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
