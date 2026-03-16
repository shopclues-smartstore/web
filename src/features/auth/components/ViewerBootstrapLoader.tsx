import type { ComponentType } from "react";
import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { toast } from "sonner";

import { useViewerBootstrap } from "@/features/auth/hooks";
import type { WorkspaceOnboardingStep } from "@/lib/graphql/generated/types";
import { ChoosePlanPage } from "@/pages/ChoosePlanPage";
import { ConnectMarketplacePage } from "@/pages/ConnectMarketplacePage";
import { ReviewPage } from "@/pages/ReviewPage";
import { StoreDetailsPage } from "@/pages/StoreDetailsPage";

/**
 * Maps workspace.onboarding.currentStep to the component that should be loaded.
 * Only the component for the current step is rendered (no URL-based routing).
 */
const ONBOARDING_STEP_COMPONENTS: Record<WorkspaceOnboardingStep, ComponentType> = {
  STORE_DETAILS: StoreDetailsPage,
  PLAN_SELECT: ChoosePlanPage,
  CONNECT_MARKETPLACES: ConnectMarketplacePage,
  REVIEW_SYNC: ReviewPage,
  DONE: ReviewPage,
} as const;

const DEFAULT_STEP: WorkspaceOnboardingStep = "STORE_DETAILS";

const PATH_TO_STEP: Record<string, WorkspaceOnboardingStep> = {
  "/onboarding/store-details": "STORE_DETAILS",
  "/onboarding/choose-plan": "PLAN_SELECT",
  "/onboarding/connect-marketplace": "CONNECT_MARKETPLACES",
  "/onboarding/review": "REVIEW_SYNC",
};

function getStepFromPath(pathname: string): WorkspaceOnboardingStep | null {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/onboarding";
  return PATH_TO_STEP[normalizedPath] ?? null;
}

/**
 * Fetches viewer bootstrap and, when on the onboarding flow, loads only the
 * component for workspace.onboarding.currentStep. When onboarding is completed,
 * redirects to dashboard.
 *
 * - Mounted in AppShell: only loads bootstrap data (cache), renders null.
 * - Rendered at /onboarding: shows the step component for currentStep, or
 *   redirects to /dashboard when status === COMPLETED.
 */
export function ViewerBootstrapLoader() {
  const location = useLocation();
  const isOnOnboardingPath = location.pathname.startsWith("/onboarding");
  const { isCompleted, currentStep, error, loading } = useViewerBootstrap({
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (error) {
      console.error("Failed to load viewer bootstrap:", error);
      const errorMessage = error.message?.toLowerCase() || "";
      const isAuthError =
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("forbidden") ||
        errorMessage.includes("authentication");
      if (isAuthError) {
        toast.error("Failed to load user data. Please refresh the page.");
      }
    }
  }, [error]);

  // On onboarding path: resolve step and render that component (or redirect)
  if (isOnOnboardingPath) {
    if (loading) {
      return (
        <div
          className="flex min-h-screen items-center justify-center bg-background"
          data-testid="viewer-bootstrap-loading"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      );
    }

    if (isCompleted) {
      return <Navigate to="/dashboard" replace />;
    }

    const stepFromPath = getStepFromPath(location.pathname);
    const stepFromBootstrap =
      currentStep && currentStep in ONBOARDING_STEP_COMPONENTS
        ? (currentStep as WorkspaceOnboardingStep)
        : DEFAULT_STEP;
    // Prefer explicit onboarding sub-route from URL (Back/Next links),
    // fallback to bootstrap currentStep when route is /onboarding.
    const resolvedStep = stepFromPath ?? stepFromBootstrap;
    const StepComponent = ONBOARDING_STEP_COMPONENTS[resolvedStep];

    return <StepComponent />;
  }

  // Not on onboarding (e.g. inside AppShell): only load bootstrap, render nothing
  return null;
}
