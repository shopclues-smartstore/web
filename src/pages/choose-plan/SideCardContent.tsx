import { Check } from 'lucide-react';

import { Plan } from './types';

interface SideCardContentProps {
  plan: Plan;
}

export const SideCardContent = ({ plan }: SideCardContentProps) => {
    const Icon = plan.icon;
    return (
      <>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-muted flex items-center justify-center">
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">
              {plan.name}
            </h3>
          </div>
          {plan.popular && (
            <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded-full px-2 py-0.5">
              Popular
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
  
        {/* Price */}
        <div className="flex items-baseline gap-0.5 mb-4">
          <span className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {plan.price}
          </span>
          <span className="text-sm text-muted-foreground">{plan.period}</span>
        </div>
  
        {/* Features */}
        <div className="space-y-2.5 flex-1">
          {plan.features.map((feat) => (
            <div key={feat.label} className="flex items-center gap-2 text-sm">
              <Check className="size-3.5 text-emerald-500 shrink-0" />
              <span className="text-muted-foreground">{feat.label}:</span>
              <span className="font-medium text-foreground">{feat.value}</span>
            </div>
          ))}
        </div>
  
        {/* CTA */}
        <div className="mt-5 w-full rounded-xl border border-border py-2.5 text-center text-sm font-medium text-muted-foreground transition-colors duration-200 hover:border-primary/30 hover:text-foreground">
          Select Plan
        </div>
      </>
    );
  }
  