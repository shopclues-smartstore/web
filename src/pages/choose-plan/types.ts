import { Crown, Gift, Rocket, Zap } from "lucide-react";

import type { SubscriptionPlansQuery } from '@/lib/graphql/generated/types';

type ApiEntitlement = SubscriptionPlansQuery['subscriptionPlans'][number]['entitlements'][number];

export interface Plan {
  id: string;
  code: string;
  name: string;
  price: string;
  period: string;
  description: string;
  popular?: boolean;
  highlight?: string;
  icon: React.ElementType;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  features: { label: string; value: string; highlighted?: boolean; key: string; displayType: string }[];
  allEntitlements: ApiEntitlement[];
}

export interface PlanStyle {
  icon: React.ElementType;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  popular?: boolean;
  highlight?: string;
}

// Plan code to UI styling mapping
export const PLAN_STYLES: Record<string, PlanStyle> = {
  FREE: {
    icon: Gift,
    accentColor: "text-slate-600",
    gradientFrom: "from-slate-400",
    gradientTo: "to-slate-600",
  },
  SILVER: {
    icon: Rocket,
    accentColor: "text-blue-600",
    gradientFrom: "from-blue-400",
    gradientTo: "to-cyan-500",
  },
  GOLD: {
    icon: Crown,
    accentColor: "text-primary",
    gradientFrom: "from-primary",
    gradientTo: "to-cyan-400",
    popular: true,
    highlight: "+2 months free on annual billing",
  },
  PLATINUM: {
    icon: Zap,
    accentColor: "text-violet-600",
    gradientFrom: "from-violet-500",
    gradientTo: "to-purple-600",
  },
};

export const COMPARISON_FEATURES = [
  {
    name: "Products limit",
    free: "50",
    silver: "500",
    gold: "5,000",
    platinum: "Unlimited",
  },
  {
    name: "Marketplaces",
    free: "1",
    silver: "3",
    gold: "10",
    platinum: "Unlimited",
  },
  {
    name: "Order sync",
    free: "Manual",
    silver: "Auto",
    gold: "Real-time",
    platinum: "Real-time + webhooks",
  },
  {
    name: "Inventory alerts",
    free: false,
    silver: true,
    gold: true,
    platinum: true,
  },
  {
    name: "Pricing rules",
    free: false,
    silver: false,
    gold: true,
    platinum: true,
  },
  {
    name: "Bulk import/export",
    free: false,
    silver: true,
    gold: true,
    platinum: true,
  },
  {
    name: "Analytics & reports",
    free: "Basic",
    silver: "Standard",
    gold: "Advanced",
    platinum: "Custom",
  },
  {
    name: "API access",
    free: false,
    silver: false,
    gold: true,
    platinum: true,
  },
  {
    name: "Team members",
    free: "1",
    silver: "3",
    gold: "10",
    platinum: "Unlimited",
  },
  {
    name: "Support",
    free: "Community",
    silver: "Email",
    gold: "Priority",
    platinum: "Dedicated manager",
  },
] as const;
