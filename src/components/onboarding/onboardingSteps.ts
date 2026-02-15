export interface OnboardingStep {
  label: string
  path: string
  done: boolean
  active: boolean
}

const LABELS = ["Store Details", "Choose Plan", "Connect Marketplace", "Review & Sync"]
const PATHS = [
  "/onboarding/store-details",
  "/onboarding/choose-plan",
  "/onboarding/connect-marketplace",
  "/onboarding/review",
]

export function getOnboardingSteps(activeIndex: number): OnboardingStep[] {
  return LABELS.map((label, i) => ({
    label,
    path: PATHS[i],
    done: i < activeIndex,
    active: i === activeIndex,
  }))
}
