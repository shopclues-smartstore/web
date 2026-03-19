import { ArrowRight, CheckCircle2, Loader2, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { SyncStep } from "@/features/onboarding/types/syncing";
import { SYNC_FRIENDLY_MESSAGES } from "@/shared/constants/syncing";
import { cn } from "@/lib/utils";

export interface SyncingViewProps {
  steps: SyncStep[];
  messageIndex: number;
  allDone: boolean;
  advancing: boolean;
  onGoToDashboard: () => void;
}

export function SyncingView({
  steps,
  messageIndex,
  allDone,
  advancing,
  onGoToDashboard,
}: SyncingViewProps) {
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
            <div
              className={cn(
                "size-20 rounded-2xl flex items-center justify-center mx-auto transition-all duration-500",
                allDone ? "bg-emerald-50" : "bg-primary/10",
              )}
            >
              {allDone ? (
                <CheckCircle2 className="size-10 text-emerald-500 animate-fade-in" />
              ) : (
                <Loader2 className="size-10 text-primary animate-spin" />
              )}
            </div>
            {!allDone && (
              <div
                className="absolute inset-0 rounded-2xl border-2 border-primary/20 animate-ping opacity-30 mx-auto size-20"
                style={{ left: "50%", transform: "translateX(-50%)" }}
              />
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
            {SYNC_FRIENDLY_MESSAGES[messageIndex]}
          </p>

          {/* Steps */}
          <div className="space-y-3 text-left mb-10">
            {steps.map((step) => (
              <div
                key={step.id}
                data-testid={`sync-step-${step.id}`}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-300",
                  step.status === "done"    && "border-emerald-200 bg-emerald-50/50",
                  step.status === "active"  && "border-primary/30 bg-primary/5",
                  step.status === "pending" && "border-border bg-white opacity-50",
                )}
              >
                <div
                  className={cn(
                    "size-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300",
                    step.status === "done"    && "bg-emerald-100",
                    step.status === "active"  && "bg-primary/10",
                    step.status === "pending" && "bg-muted",
                  )}
                >
                  {step.status === "done" ? (
                    <CheckCircle2 className="size-4 text-emerald-600" />
                  ) : step.status === "active" ? (
                    <Loader2 className="size-4 text-primary animate-spin" />
                  ) : (
                    <step.icon className="size-4 text-muted-foreground" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    step.status === "done"    && "text-emerald-700",
                    step.status === "active"  && "text-foreground",
                    step.status === "pending" && "text-muted-foreground",
                  )}
                >
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

          {/* CTA when done */}
          {allDone && (
            <div className="animate-fade-up" data-testid="sync-complete-section">
              <p className="text-sm text-muted-foreground mb-6">
                You can explore the dashboard while we sync in the background.
              </p>
              <Button
                data-testid="go-to-dashboard-btn"
                onClick={onGoToDashboard}
                disabled={advancing}
                className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200 px-8"
              >
                {advancing && <Loader2 className="size-4 mr-2 animate-spin" />}
                Go to Dashboard
                {!advancing && <ArrowRight className="size-4 ml-2" />}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
