import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

import { PlanCard } from "./PlanCard";
import type { Plan } from "./types";

interface PlanCarouselProps {
  plans: Plan[];
  selectedIndex: number;
  onSelectPlan: (index: number) => void;
}

const CARDS_PER_VIEW = 3;
const CARD_WIDTH_PERCENT = 100 / CARDS_PER_VIEW;
const CENTER_SCALE = 1;
const ADJACENT_SCALE = 0.92;
const FAR_SCALE = 0.85;
const FAR_OPACITY = 0.5;

export function PlanCarousel({
  plans,
  selectedIndex,
  onSelectPlan,
}: PlanCarouselProps) {
  const isFirst = selectedIndex === 0;
  const isLast = selectedIndex === plans.length - 1;

  const handlePrev = () => {
    onSelectPlan(Math.max(0, selectedIndex - 1));
  };

  const handleNext = () => {
    onSelectPlan(Math.min(plans.length - 1, selectedIndex + 1));
  };

  const getCardTransform = (index: number) => {
    const offset = index - selectedIndex;
    const absOffset = Math.abs(offset);

    if (absOffset === 0) return { scale: CENTER_SCALE, opacity: 1 };
    if (absOffset === 1) return { scale: ADJACENT_SCALE, opacity: 1 };
    return { scale: FAR_SCALE, opacity: FAR_OPACITY };
  };

  return (
    <div className="relative mb-8" data-testid="plan-carousel">
      <button
        data-testid="carousel-prev"
        onClick={handlePrev}
        disabled={isFirst}
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 size-10 rounded-full bg-white border border-border shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:scale-105",
          isFirst && "opacity-30 cursor-not-allowed hover:scale-100",
        )}
      >
        <ChevronLeft className="size-5 text-foreground" />
      </button>
      <button
        data-testid="carousel-next"
        onClick={handleNext}
        disabled={isLast}
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 size-10 rounded-full bg-white border border-border shadow-lg flex items-center justify-center transition-all duration-200 hover:shadow-xl hover:scale-105",
          isLast && "opacity-30 cursor-not-allowed hover:scale-100",
        )}
      >
        <ChevronRight className="size-5 text-foreground" />
      </button>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out items-center py-6"
          style={{
            transform: `translateX(calc(${CARD_WIDTH_PERCENT}% - ${selectedIndex * CARD_WIDTH_PERCENT}%))`,
          }}
          data-testid="plan-grid"
        >
          {plans.map((plan, index) => {
            const isCenter = index === selectedIndex;
            const { scale, opacity } = getCardTransform(index);

            return (
              <div
                key={plan.id}
                className="shrink-0 px-2 transition-all duration-500 ease-out"
                style={{
                  width: `calc(100% / ${CARDS_PER_VIEW})`,
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                <button
                  data-testid={`plan-card-${plan.code.toLowerCase()}`}
                  onClick={() => onSelectPlan(index)}
                  className={cn(
                    "relative w-full flex flex-col rounded-2xl text-left transition-all duration-500 overflow-hidden",
                    isCenter ? "shadow-2xl z-10" : "shadow-sm hover:shadow-md z-0",
                  )}
                >
                  <PlanCard plan={plan} isCenter={isCenter} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
