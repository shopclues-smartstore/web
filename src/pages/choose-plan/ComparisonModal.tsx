import {
  ArrowRight,
  Crown,
  Gift,
  Rocket,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { FeatureValueCell } from "./FeatureValueCell";
import { buildComparisonFeatures, type ComparisonFeature } from "./comparisonUtils";
import type { Plan } from "./types";

const PLAN_ICONS = [Gift, Rocket, Crown, Zap];

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
}

export function ComparisonModal({ isOpen, onClose, plans }: ComparisonModalProps) {
  if (!isOpen) return null;

  const comparisonFeatures = buildComparisonFeatures(plans);
  const planNames = plans.map((p) => p.name);
  const planCodes = plans.map((p) => p.code.toLowerCase());
  const prices = plans.map((p) => p.price);
  const gradients = plans.map((p) => `${p.gradientFrom} ${p.gradientTo}`);
  const planCodeToIndex = new Map(planCodes.map((code, index) => [code, index]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      data-testid="compare-modal-overlay"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        data-testid="compare-modal"
        className="relative bg-white rounded-2xl shadow-2xl border border-border w-full max-w-4xl max-h-[85vh] overflow-hidden animate-fade-up"
      >
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-cyan-500/5 to-violet-500/5" />
          <div className="relative flex items-center justify-between px-8 py-5">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground">
                Compare Plans
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Find the perfect fit for your business
              </p>
            </div>
            <button
              data-testid="close-compare-modal"
              onClick={onClose}
              className="rounded-xl p-2 text-muted-foreground hover:bg-white/80 hover:text-foreground transition-all duration-200 hover:shadow-sm"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="overflow-auto max-h-[calc(85vh-90px)]">
          <table className="w-full text-sm" data-testid="compare-table">
            <thead>
              <tr className="border-b border-border sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                <th className="text-left px-8 py-4 font-medium text-muted-foreground w-[200px]">
                  Feature
                </th>
                {planNames.map((name, i) => {
                  const isGold = name === "Gold";
                  return (
                    <th
                      key={name}
                      className={cn(
                        "text-center px-4 py-4 relative",
                        isGold && "bg-primary/3",
                      )}
                    >
                      {isGold && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-linear-to-r from-primary to-cyan-500 rounded-b-lg px-3 py-0.5 shadow-sm">
                            <Sparkles className="size-2.5" />
                            BEST VALUE
                          </span>
                        </div>
                      )}
                      <div
                        className={cn(
                          "inline-flex items-center justify-center size-8 rounded-lg bg-linear-to-br text-white mb-1.5",
                          gradients[i],
                        )}
                      >
                        {PLAN_ICONS[i] && (() => {
                          const Icon = PLAN_ICONS[i];
                          return <Icon className="size-4" />;
                        })()}
                      </div>
                      <div className="font-heading text-sm font-bold text-foreground">
                        {name}
                      </div>
                      <div className="text-xs text-muted-foreground font-normal mt-0.5">
                        {prices[i]}/mo
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feat, fi) => (
                <tr
                  key={feat.name}
                  className={cn(
                    "border-b border-border/60 transition-colors hover:bg-muted/30",
                    fi % 2 === 0 && "bg-muted/10",
                  )}
                >
                  <td className="px-8 py-3.5 font-medium text-foreground">
                    {feat.name}
                  </td>
                  {planCodes.map((planKey) => {
                    const value = (feat as ComparisonFeature)[planKey];
                    const planIndex = planCodeToIndex.get(planKey) ?? 0;
                    const isGoldCol = plans[planIndex]?.code.toUpperCase() === "GOLD";
                    return (
                      <td
                        key={planKey}
                        className={cn(
                          "text-center px-4 py-3.5",
                          isGoldCol && "bg-primary/3",
                        )}
                      >
                        <FeatureValueCell value={value} isGoldCol={isGoldCol} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-8 py-6 border-t border-border bg-linear-to-r from-muted/30 via-transparent to-muted/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Not sure yet? Start with{" "}
                <span className="font-medium text-foreground">Free</span> and
                upgrade anytime.
              </p>
              <Button
                data-testid="modal-close-btn"
                onClick={onClose}
                className="rounded-lg shadow-sm"
              >
                Choose a plan
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
