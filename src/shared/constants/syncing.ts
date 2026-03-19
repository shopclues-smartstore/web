import { Package, Settings2, ShoppingBag, Warehouse } from "lucide-react";

import type { SyncStep } from "@/features/onboarding/types/syncing";

export const INITIAL_SYNC_STEPS: SyncStep[] = [
  { id: "connect",   label: "Connecting marketplace", icon: ShoppingBag, status: "pending" },
  { id: "products",  label: "Importing products",     icon: Package,     status: "pending" },
  { id: "inventory", label: "Preparing inventory",    icon: Warehouse,   status: "pending" },
  { id: "finalize",  label: "Finalizing setup",       icon: Settings2,   status: "pending" },
];

export const SYNC_FRIENDLY_MESSAGES: string[] = [
  "Hang tight, we're talking to your marketplace...",
  "Fetching your product catalog...",
  "Organizing your inventory data...",
  "Almost there, just a few finishing touches...",
  "Your store is being set up!",
];
