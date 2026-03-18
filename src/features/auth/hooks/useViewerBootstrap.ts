import type { FetchPolicy } from "@apollo/client";
import { useViewerBootstrapQuery } from "@/lib/graphql/generated/types";

interface UseViewerBootstrapOptions {
  /**
   * Apollo fetch policy. Defaults to "cache-first" for most cases.
   * Use "network-only" when you need fresh data (e.g., after mutations).
   */
  fetchPolicy?: FetchPolicy;
  /**
   * Whether to skip the query. Useful for conditional fetching.
   */
  skip?: boolean;
}

/**
 * Hook to access viewer bootstrap data (profile, workspace, onboarding, etc.).
 * 
 * Leverages Apollo's cache - multiple components using this hook will share
 * the same cached data and automatically update when cache changes.
 * 
 * @example
 * ```tsx
 * const { workspace, onboarding, isCompleted, loading } = useViewerBootstrap();
 * 
 * if (workspace?.id) {
 *   // Workspace exists
 * }
 * ```
 */
export function useViewerBootstrap(options: UseViewerBootstrapOptions = {}) {
  const { fetchPolicy = "cache-first", skip = false } = options;
  
  const result = useViewerBootstrapQuery({
    errorPolicy: "all",
    fetchPolicy,
    skip,
  });

  const bootstrap = result.data?.viewerBootstrap;
  const profile = bootstrap?.profile ?? null;
  const workspace = bootstrap?.workspace ?? null;
  const onboarding = workspace?.onboarding ?? null;
  const isCompleted = onboarding?.status === "COMPLETED";
  const currentStep = onboarding?.currentStep ?? null;

  return {
    ...result,
    // Convenient accessors
    profile,
    workspace,
    onboarding,
    isCompleted,
    currentStep,
    // Raw bootstrap data
    bootstrap,
  };
}
