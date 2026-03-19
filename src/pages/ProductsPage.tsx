import { Package } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { useViewerBootstrap } from "@/features/auth/hooks";
import { AmazonListingsTable } from "@/features/products/components/AmazonListingsTable";

export function ProductsPage() {
  const { workspace, loading } = useViewerBootstrap();

  if (loading) {
    return (
      <div className="space-y-6" data-testid="products-page">
        <div className="h-8 w-40 rounded bg-muted animate-skeleton" />
        <div className="h-4 w-60 rounded bg-muted animate-skeleton" />
      </div>
    );
  }

  if (!workspace?.id) {
    return (
      <div className="space-y-6" data-testid="products-page">
        <EmptyState
          icon={<Package className="size-8 text-muted-foreground" />}
          title="No workspace found"
          description="Set up your workspace to start managing listings."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="products-page">
      {/* Page Header */}
      <div>
        <h1
          className="font-heading text-2xl font-bold tracking-tight text-foreground"
          data-testid="products-title"
        >
          Amazon Listings
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View and sync your Amazon product listings
        </p>
      </div>

      <AmazonListingsTable workspaceId={workspace.id} />
    </div>
  );
}
