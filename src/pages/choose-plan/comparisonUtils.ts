import type { Plan } from "./types";

export interface ComparisonFeature {
  name: string;
  order: number;
  [planCode: string]: string | boolean | number;
}

const UNLIMITED_VALUES = [-1, 999999];
const VALUE_TYPES = {
  INT: "INT",
  BOOL: "BOOL",
  TEXT: "TEXT",
} as const;

type Entitlement = Plan["allEntitlements"][number];

export function extractEntitlementValue(entitlement: Entitlement): string | boolean {
  switch (entitlement.valueType) {
    case VALUE_TYPES.INT: {
      if (entitlement.valueInt === null || entitlement.valueInt === undefined) {
        return "";
      }
      if (UNLIMITED_VALUES.includes(entitlement.valueInt)) {
        return "Unlimited";
      }
      return entitlement.unit
        ? `${entitlement.valueInt} ${entitlement.unit}`
        : String(entitlement.valueInt);
    }
    case VALUE_TYPES.BOOL:
      return entitlement.valueBool ?? false;
    case VALUE_TYPES.TEXT:
      return entitlement.valueText || "";
    default:
      return entitlement.description || entitlement.key;
  }
}

export function buildComparisonFeatures(plans: Plan[]): ComparisonFeature[] {
  const comparisonEntitlements = plans[0]?.allEntitlements
    .sort((a, b) => a.order - b.order) ?? [];

  return comparisonEntitlements.map((entitlement) => {
    const entitlementByPlan: Record<string, string | boolean> = {};

    plans.forEach((plan) => {
      const planEntitlement = plan.allEntitlements.find((e) => e.key === entitlement.key);
      const value = planEntitlement
        ? extractEntitlementValue(planEntitlement)
        : false;

      entitlementByPlan[plan.code.toLowerCase()] = value;
    });

    return {
      name: entitlement.description || entitlement.key,
      order: entitlement.order,
      ...entitlementByPlan,
    } as ComparisonFeature;
  });
}
