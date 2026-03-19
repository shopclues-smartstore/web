import { useNavigate } from "react-router-dom";

import { ReviewView } from "@/components/onboarding/ReviewView";
import { useViewerBootstrap } from "@/features/auth/hooks/useViewerBootstrap";

export function ReviewPage() {
  const navigate = useNavigate();
  const { workspace } = useViewerBootstrap();

  if (!workspace) return null;

  const connectedMarketplaces = workspace.marketplaceConnections.filter(
    (c) => c.status === "CONNECTED",
  );

  return (
    <ReviewView
      plan={workspace.plan}
      store={{
        name: workspace.name,
        country: workspace.country,
        currency: workspace.currency,
        timezone: workspace.timezone,
      }}
      connectedMarketplaces={connectedMarketplaces}
      onStartSync={() => navigate("/onboarding/syncing")}
    />
  );
}
