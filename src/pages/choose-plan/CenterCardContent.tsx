import {
  Check,
  Sparkles,
} from 'lucide-react';

import { cn } from '@/lib/utils';

import { Plan } from './types';

export const CenterCardContent = ({ plan }: { plan: Plan }) => {
    const Icon = plan.icon;
    return (
      <>
        {/* Badge */}
        {plan.popular && (
          <div
            className="flex justify-center -mt-1 mb-3"
            data-testid="popular-badge"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-linear-to-r from-primary to-cyan-500 text-white text-xs font-semibold px-3.5 py-1 shadow-md">
              <Sparkles className="size-3" />
              Best Deal
            </span>
          </div>
        )}
  
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div
            className={cn(
              "size-10 rounded-xl bg-linear-to-br flex items-center justify-center",
              plan.gradientFrom,
              plan.gradientTo,
            )}
          >
            <Icon className="size-5 text-white" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold text-foreground">
              {plan.name}
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
  
        {/* Price - big emphasis */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="font-heading text-5xl font-bold tracking-tight text-foreground">
            {plan.price}
          </span>
          <span className="text-base text-muted-foreground font-medium">
            {plan.period}
          </span>
        </div>
  
        {/* Highlight text */}
        {plan.highlight && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 mb-4">
            <Sparkles className="size-3" />
            {plan.highlight}
          </div>
        )}
  
        {/* Divider */}
        <div className="h-px bg-border my-3" />
  
        {/* Features */}
        <div className="space-y-3 flex-1">
          {plan.features.map((feat) => (
            <div key={feat.label} className="flex items-center gap-2.5 text-sm">
              <div
                className={cn(
                  "size-5 rounded-full flex items-center justify-center shrink-0",
                  feat.highlighted ? "bg-primary/10" : "bg-emerald-50",
                )}
              >
                <Check
                  className={cn(
                    "size-3",
                    feat.highlighted ? "text-primary" : "text-emerald-500",
                  )}
                />
              </div>
              <span className="text-muted-foreground">{feat.label}:</span>
              <span
                className={cn(
                  "font-semibold",
                  feat.highlighted ? "text-primary" : "text-foreground",
                )}
              >
                {feat.value}
              </span>
            </div>
          ))}
        </div>
  
        {/* CTA */}
        <div
          className={cn(
            "mt-5 w-full rounded-xl py-2.5 text-center text-sm font-semibold text-white bg-linear-to-r shadow-lg transition-all duration-300 hover:shadow-xl hover:brightness-110",
            plan.gradientFrom,
            plan.gradientTo,
          )}
        >
          Selected Plan
        </div>
      </>
    );
  }
