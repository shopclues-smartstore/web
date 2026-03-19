import { useEffect, useRef } from "react";

import { SyncingView } from "@/components/onboarding/SyncingView";
import { useViewerBootstrap } from "@/features/auth/hooks/useViewerBootstrap";
import { useCompleteOnboarding } from "@/features/onboarding/hooks/useCompleteOnboarding";
import { useSyncingProgress } from "@/features/onboarding/hooks/useSyncingProgress";
import { useSyncAmazonListings } from "@/features/products/hooks/useSyncAmazonListings";

export function SyncingPage() {
  const { workspace } = useViewerBootstrap();
  const { steps, messageIndex, allDone } = useSyncingProgress();
  const { handleGoToDashboard, advancing } = useCompleteOnboarding({ workspaceId: workspace?.id });

  const { sync } = useSyncAmazonListings({ workspaceId: workspace?.id ?? "" });
  const syncFired = useRef(false);

  // Fire background sync once — fire-and-forget, never blocks UI
  useEffect(() => {
    if (!workspace?.id || syncFired.current) return;
    syncFired.current = true;
    sync();
  }, [workspace?.id, sync]);

  return (
    <SyncingView
      steps={steps}
      messageIndex={messageIndex}
      allDone={allDone}
      advancing={advancing}
      onGoToDashboard={handleGoToDashboard}
    />
  );
}
