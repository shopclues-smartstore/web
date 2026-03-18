import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Info,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import {
  getOnboardingSteps,
  OnboardingLayout,
} from "@/components/onboarding/OnboardingLayout";
import { Button } from "@/components/ui/button";
import { useViewerBootstrap } from "@/features/auth/hooks";
import {
  useSubscriptionPlansQuery,
  useCreateWorkspaceSubscriptionMutation,
  useAdvanceOnboardingStepMutation,
  type SubscriptionPlanCode,
} from "@/lib/graphql/generated/types";

import { ComparisonModal } from "./choose-plan/ComparisonModal";
import { PlanCarousel } from "./choose-plan/PlanCarousel";
import { transformPlanToUI } from "./choose-plan/transformPlan";
import type { Plan } from "./choose-plan/types";

const findDefaultPlanIndex = (plans: Plan[], workspacePlanCode?: string | null): number => {
  if (plans.length === 0) return 0;

  // If workspace has a plan code, try to find matching plan
  if (workspacePlanCode) {
    const workspacePlanIndex = plans.findIndex(
      (p) => p.code.toUpperCase() === workspacePlanCode.toUpperCase(),
    );
    if (workspacePlanIndex >= 0) {
      return workspacePlanIndex;
    }
  }

  // Fallback to Gold plan (Best Deal)
  const goldIndex = plans.findIndex((p) => p.code.toUpperCase() === "GOLD");
  return goldIndex >= 0 ? goldIndex : Math.min(1, plans.length - 1);
};

export function ChoosePlanPage() {
  const navigate = useNavigate();
  const [compareOpen, setCompareOpen] = useState(false);
  const { workspace } = useViewerBootstrap({ fetchPolicy: "cache-first" });

  const { data, loading, error } = useSubscriptionPlansQuery({
    errorPolicy: "all",
    fetchPolicy: "cache-first",
  });

  const [createSubscription, { loading: creatingSubscription }] =
    useCreateWorkspaceSubscriptionMutation({ errorPolicy: "all" });

  const [advanceOnboardingStep] = useAdvanceOnboardingStepMutation();

  const plans = useMemo(() => {
    if (!data?.subscriptionPlans) return [];

    return data.subscriptionPlans
      .filter((plan) => plan.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(transformPlanToUI)
      .filter((plan): plan is Plan => plan !== null);
  }, [data]);

  const defaultIndex = useMemo(
    () => findDefaultPlanIndex(plans, workspace?.plan?.code),
    [plans, workspace?.plan?.code],
  );

  const [selectedIndex, setSelectedIndex] = useState(() => defaultIndex);

  useEffect(() => {
    if (plans.length > 0) {
      setSelectedIndex(defaultIndex);
    }
  }, [defaultIndex, plans.length]);

  const selectedPlan = plans[selectedIndex] || plans[0];

  useEffect(() => {
    if (error) {
      toast.error("Failed to load subscription plans. Please try again.");
    }
  }, [error]);

  if (loading || plans.length === 0) {
    return (
      <OnboardingLayout
        steps={getOnboardingSteps(1)}
        currentStep={2}
        totalSteps={4}
        wide
      >
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading plans...</p>
          </div>
        </div>
      </OnboardingLayout>
    );
  }

  const handleContinue = async () => {
    if (!selectedPlan || !workspace?.id) {
      toast.error("Please select a plan and ensure workspace is created.");
      return;
    }

    try {
      const result = await createSubscription({
        variables: {
          input: {
            workspaceId: workspace.id,
            planCode: selectedPlan.code.toUpperCase() as SubscriptionPlanCode,
            status: "ACTIVE",
            provider: "MANUAL",
            cancelAtPeriodEnd: false,
          },
        },
      });

      if (result.data?.createWorkspaceSubscription?.subscription) {
        await advanceOnboardingStep({
          variables: { input: { workspaceId: workspace.id, completedStep: "PLAN_SELECT" } },
        });
        toast.success(`${selectedPlan.name} plan activated successfully!`);
        navigate("/onboarding/connect-marketplace");
      } else if (result.error) {
        const errorMessage = result.error.message || "Failed to create subscription.";
        toast.error(errorMessage);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create subscription.";
      toast.error(message);
    }
  };

  return (
    <OnboardingLayout
      steps={getOnboardingSteps(1)}
      currentStep={2}
      totalSteps={4}
      wide
      footer={
        <>
          <Button
            variant="outline"
            data-testid="back-btn"
            className="rounded-lg"
            asChild
          >
            <Link to="/onboarding/store-details">
              <ArrowLeft className="size-4 mr-2" />
              Back
            </Link>
          </Button>
          <Button
            data-testid="continue-btn"
            onClick={handleContinue}
            disabled={creatingSubscription || !workspace?.id}
            className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
          >
            {creatingSubscription ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                Continue with {selectedPlan.name}
                <ArrowRight className="size-4 ml-2" />
              </>
            )}
          </Button>
        </>
      }
    >
      <div data-testid="choose-plan-page">
        <div className="text-center mb-10">
          <div className="mx-auto mb-4 size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <CreditCard className="size-7 text-primary" />
          </div>
          <h1
            className="font-heading text-3xl font-bold tracking-tight text-foreground"
            data-testid="choose-plan-title"
          >
            Choose your plan
          </h1>
          <p className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
            Clear pricing. No strings attached. Start small and upgrade anytime.
          </p>
        </div>

        <div
          className="flex items-center justify-center gap-2 mb-8"
          data-testid="plan-pills"
        >
          {plans.map((plan, i) => (
            <button
              key={plan.id}
              data-testid={`plan-pill-${plan.code.toLowerCase()}`}
              onClick={() => setSelectedIndex(i)}
              className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
                selectedIndex === i
                  ? "bg-foreground text-background shadow-lg"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {plan.name}
              {plan.popular && selectedIndex !== i && (
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          ))}
        </div>

        <PlanCarousel
          plans={plans}
          selectedIndex={selectedIndex}
          onSelectPlan={setSelectedIndex}
        />

        <div className="text-center mb-6" data-testid="selected-confirmation">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 transition-all duration-300">
            <Check className="size-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              <span className="text-primary font-semibold">
                {selectedPlan.name}
              </span>{" "}
              plan selected
              <span className="text-muted-foreground">
                {" "}
                — {selectedPlan.price}
                {selectedPlan.period}
              </span>
            </span>
          </div>
        </div>

        <div className="text-center mb-8 space-y-2">
          <button
            data-testid="compare-plans-btn"
            onClick={() => setCompareOpen(true)}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 hover:gap-2"
          >
            Compare all plans in detail
            <ArrowRight className="size-3 transition-all duration-200" />
          </button>
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Info className="size-3" />
            You can change your plan later from Settings.
          </p>
        </div>
      </div>

      <ComparisonModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
        plans={plans}
      />
    </OnboardingLayout>
  );
}
