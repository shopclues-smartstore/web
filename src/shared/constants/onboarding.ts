import { Package, ShoppingCart, Warehouse } from "lucide-react";

export const SYNC_SCOPE = [
  {
    label: "Products",
    description: "All product listings and variants",
    icon: Package,
    enabled: true,
  },
  {
    label: "Inventory",
    description: "Stock levels across warehouses",
    icon: Warehouse,
    enabled: true,
  },
  {
    label: "Orders",
    description: "Order history and new orders",
    icon: ShoppingCart,
    enabled: true,
  },
] as const;
