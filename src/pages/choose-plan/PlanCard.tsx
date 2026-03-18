import { cn } from '@/lib/utils';

import { CenterCardContent } from './CenterCardContent';
import { SideCardContent } from './SideCardContent';
import type { Plan } from './types';

interface PlanCardProps {
  plan: Plan;
  isCenter?: boolean;
}

export function PlanCard({ plan, isCenter = false }: PlanCardProps) {

  if (isCenter) {
    return (
      <div
        className={cn(
          "p-[2px] rounded-2xl bg-linear-to-br",
          plan.gradientFrom,
          plan.gradientTo,
        )}
      >
        <div className="bg-white rounded-[14px] p-6 flex flex-col min-h-[380px]">
          <CenterCardContent plan={plan} />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-border bg-white rounded-2xl p-6 flex flex-col min-h-[380px] hover:border-primary/20 transition-colors duration-300">
      <SideCardContent plan={plan} />
    </div>
  );
}

