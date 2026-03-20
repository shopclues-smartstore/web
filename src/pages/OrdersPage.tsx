import { ShoppingCart } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useViewerBootstrap } from "@/features/auth/hooks";
import { AmazonOrdersTable } from "@/features/orders/components/AmazonOrdersTable";

export function OrdersPage() {
  const { workspace, loading } = useViewerBootstrap();

  if (loading) {
    return (
      <div className="space-y-6" data-testid="orders-page">
        <div className="h-8 w-40 rounded bg-muted animate-skeleton" />
        <div className="h-4 w-60 rounded bg-muted animate-skeleton" />
      </div>
    );
  }

  if (!workspace?.id) {
    return (
      <div className="space-y-6" data-testid="orders-page">
        <EmptyState
          icon={<ShoppingCart className="size-8 text-muted-foreground" />}
          title="No workspace found"
          description="Set up your workspace to start managing orders."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="orders-page">
      <div>
        <h1
          className="font-heading text-2xl font-bold tracking-tight text-foreground"
          data-testid="orders-title"
        >
          Amazon Orders
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View and sync your Amazon orders
        </p>
      </div>

      <AmazonOrdersTable workspaceId={workspace.id} />
    </div>
  );
}
