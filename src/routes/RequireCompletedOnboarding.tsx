import { Navigate, Outlet } from "react-router-dom";
import { useViewerBootstrap } from "@/features/auth/hooks";

const ONBOARDING_ROUTE = "/onboarding";

/**
 * Protects dashboard and main app routes: only allows access when
 * workspace.onboarding.status === "COMPLETED". Otherwise redirects to /onboarding,
 * where ViewerBootstrapLoader renders the step from workspace.onboarding.currentStep.
 */
export function RequireCompletedOnboarding() {
  const { workspace, isCompleted, loading } = useViewerBootstrap({
    fetchPolicy: "network-only",
  });

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-background"
        data-testid="onboarding-guard-loading"
      >
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!workspace?.id || !isCompleted) {
    return <Navigate to={ONBOARDING_ROUTE} replace />;
  }

  return <Outlet />;
}
