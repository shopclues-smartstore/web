import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAdvanceOnboardingStepMutation } from "@/lib/graphql/generated/types";

export interface UseCompleteOnboardingOptions {
  workspaceId: string | undefined;
}

export interface UseCompleteOnboardingResult {
  handleGoToDashboard: () => Promise<void>;
  advancing: boolean;
}

export function useCompleteOnboarding(
  options: UseCompleteOnboardingOptions,
): UseCompleteOnboardingResult {
  const { workspaceId } = options;
  const navigate = useNavigate();
  const [advancing, setAdvancing] = useState(false);
  const [advanceOnboardingStep] = useAdvanceOnboardingStepMutation();

  const handleGoToDashboard = async () => {
    if (!workspaceId) {
      navigate("/dashboard");
      return;
    }
    setAdvancing(true);
    try {
      await advanceOnboardingStep({
        variables: { input: { workspaceId, completedStep: "REVIEW_SYNC" } },
      });
    } finally {
      navigate("/dashboard");
    }
  };

  return { handleGoToDashboard, advancing };
}
