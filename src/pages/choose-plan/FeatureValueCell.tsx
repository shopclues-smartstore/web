import { Check, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface FeatureValueCellProps {
  value: string | boolean | number;
  isGoldCol?: boolean;
}

export function FeatureValueCell({ value, isGoldCol = false }: FeatureValueCellProps) {
  if (typeof value === "boolean") {
    return value ? (
      <div className="inline-flex items-center justify-center size-6 rounded-full bg-emerald-50">
        <Check className="size-3.5 text-emerald-600" />
      </div>
    ) : (
      <div className="inline-flex items-center justify-center size-6 rounded-full bg-muted/50">
        <X className="size-3.5 text-muted-foreground/30" />
      </div>
    );
  }

  return (
    <span
      className={cn(
        "text-sm",
        isGoldCol ? "font-semibold text-primary" : "text-muted-foreground",
      )}
    >
      {String(value)}
    </span>
  );
}
