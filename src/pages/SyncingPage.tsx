import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Store,
  CheckCircle2,
  Loader2,
  ShoppingBag,
  Package,
  Warehouse,
  Settings2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SyncStep {
  id: string
  label: string
  icon: React.ElementType
  status: "pending" | "active" | "done"
}

const initialSteps: SyncStep[] = [
  { id: "connect", label: "Connecting marketplace", icon: ShoppingBag, status: "pending" },
  { id: "products", label: "Importing products", icon: Package, status: "pending" },
  { id: "inventory", label: "Preparing inventory", icon: Warehouse, status: "pending" },
  { id: "finalize", label: "Finalizing setup", icon: Settings2, status: "pending" },
]

const friendlyMessages = [
  "Hang tight, we're talking to your marketplace...",
  "Fetching your product catalog...",
  "Organizing your inventory data...",
  "Almost there, just a few finishing touches...",
  "Your store is being set up!",
]

export function SyncingPage() {
  const navigate = useNavigate()
  const [steps, setSteps] = useState<SyncStep[]>(initialSteps)
  const [messageIndex, setMessageIndex] = useState(0)
  const [allDone, setAllDone] = useState(false)

  // Animate steps sequentially
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Step 1: active immediately
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => i === 0 ? { ...s, status: "active" } : s))
    }, 300))

    // Step 1: done at 1.5s, step 2: active
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => {
        if (i === 0) return { ...s, status: "done" }
        if (i === 1) return { ...s, status: "active" }
        return s
      }))
      setMessageIndex(1)
    }, 1500))

    // Step 2: done at 3s, step 3: active
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => {
        if (i <= 1) return { ...s, status: "done" }
        if (i === 2) return { ...s, status: "active" }
        return s
      }))
      setMessageIndex(2)
    }, 3000))

    // Step 3: done at 4.5s, step 4: active
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s, i) => {
        if (i <= 2) return { ...s, status: "done" }
        if (i === 3) return { ...s, status: "active" }
        return s
      }))
      setMessageIndex(3)
    }, 4500))

    // All done at 6s
    timers.push(setTimeout(() => {
      setSteps((prev) => prev.map((s) => ({ ...s, status: "done" })))
      setMessageIndex(4)
      setAllDone(true)
    }, 6000))

    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="syncing-page">
      {/* Top bar */}
      <header className="border-b border-border bg-white">
        <div className="max-w-3xl mx-auto flex items-center justify-center px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="size-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">SmartStore</span>
          </div>
        </div>
      </header>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center animate-fade-up">
          {/* Animated icon */}
          <div className="mx-auto mb-8 relative">
            <div className={cn(
              "size-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500",
              allDone ? "bg-emerald-50" : "bg-primary/10"
            )}>
              {allDone ? (
                <CheckCircle2 className="size-10 text-emerald-500 animate-fade-in" />
              ) : (
                <Loader2 className="size-10 text-primary animate-spin" />
              )}
            </div>
            {/* Pulse ring */}
            {!allDone && (
              <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 animate-ping opacity-30 mx-auto size-20" style={{ left: "50%", transform: "translateX(-50%)" }} />
            )}
          </div>

          {/* Title */}
          <h1
            className="font-heading text-2xl font-bold tracking-tight text-foreground mb-2"
            data-testid="syncing-title"
          >
            {allDone ? "You're all set!" : "Setting things up for you"}
          </h1>
          <p
            className="text-sm text-muted-foreground mb-10 transition-all duration-300"
            data-testid="syncing-message"
          >
            {friendlyMessages[messageIndex]}
          </p>

          {/* Steps */}
          <div className="space-y-3 text-left mb-10">
            {steps.map((step) => (
              <div
                key={step.id}
                data-testid={`sync-step-${step.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300",
                  step.status === "done" && "border-emerald-200 bg-emerald-50/50",
                  step.status === "active" && "border-primary/30 bg-primary/5",
                  step.status === "pending" && "border-border bg-white opacity-50"
                )}
              >
                <div className={cn(
                  "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                  step.status === "done" && "bg-emerald-100",
                  step.status === "active" && "bg-primary/10",
                  step.status === "pending" && "bg-muted"
                )}>
                  {step.status === "done" ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : step.status === "active" ? (
                    <Loader2 className="size-4 text-primary animate-spin" />
                  ) : (
                    <step.icon className="size-4 text-muted-foreground" />
                  )}
                </div>
                <span className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  step.status === "done" && "text-emerald-700",
                  step.status === "active" && "text-foreground",
                  step.status === "pending" && "text-muted-foreground"
                )}>
                  {step.label}
                </span>
                {step.status === "done" && (
                  <span className="ml-auto text-xs text-emerald-600 font-medium">Done</span>
                )}
              </div>
            ))}
          </div>

          {/* Skeleton loaders (while syncing) */}
          {!allDone && (
            <div className="space-y-2 mb-8" data-testid="skeleton-loaders">
              <div className="h-3 w-full rounded-full bg-muted animate-skeleton" />
              <div className="h-3 w-4/5 rounded-full bg-muted animate-skeleton" style={{ animationDelay: "0.2s" }} />
              <div className="h-3 w-3/5 rounded-full bg-muted animate-skeleton" style={{ animationDelay: "0.4s" }} />
            </div>
          )}

          {/* Message + CTA when done */}
          {allDone && (
            <div className="animate-fade-up" data-testid="sync-complete-section">
              <p className="text-sm text-muted-foreground mb-6">
                You can explore the dashboard while we sync in the background.
              </p>
              <Button
                data-testid="go-to-dashboard-btn"
                onClick={() => navigate("/dashboard")}
                className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200 px-8"
              >
                Go to Dashboard
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
