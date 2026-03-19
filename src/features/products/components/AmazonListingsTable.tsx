import { useState } from "react";
import {
  Search,
  RefreshCw,
  Image as ImageIcon,
  Package,
  ChevronDown,
  Filter,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAmazonListings } from "../hooks/useAmazonListings";
import { useSyncAmazonListings } from "../hooks/useSyncAmazonListings";

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "INCOMPLETE", label: "Incomplete" },
  { value: "UNKNOWN", label: "Unknown" },
];

const statusConfig: Record<
  string,
  { label: string; dotColor: string; textColor: string }
> = {
  ACTIVE: {
    label: "Active",
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-700",
  },
  INACTIVE: {
    label: "Inactive",
    dotColor: "bg-slate-400",
    textColor: "text-slate-500",
  },
  INCOMPLETE: {
    label: "Incomplete",
    dotColor: "bg-amber-500",
    textColor: "text-amber-700",
  },
  UNKNOWN: {
    label: "Unknown",
    dotColor: "bg-red-400",
    textColor: "text-red-600",
  },
};

function formatPrice(price?: number | null, currency?: string | null) {
  if (price == null) return "—";
  return currency
    ? `${currency} ${price.toFixed(2)}`
    : price.toFixed(2);
}

function formatSyncTime(rawSyncedAt: string) {
  const d = new Date(rawSyncedAt);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  workspaceId: string;
}

export function AmazonListingsTable({ workspaceId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const { listings, loading, error, refetch, hasNextPage, loadNextPage, totalCount } =
    useAmazonListings({
      workspaceId,
      status: statusFilter || undefined,
    });

  const { sync, loading: syncing } = useSyncAmazonListings({
    workspaceId,
    onSuccess: (count) => {
      setLastSyncedAt(new Date());
      toast.success("Sync complete", {
        description: `${count} listing${count !== 1 ? "s" : ""} synced from Amazon.`,
      });
      refetch();
    },
    onError: (msg) => {
      toast.error("Sync failed", { description: msg });
    },
  });

  // Client-side search filter
  const filtered = listings.filter((l) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.sku.toLowerCase().includes(q) ||
      (l.title ?? "").toLowerCase().includes(q) ||
      (l.asin ?? "").toLowerCase().includes(q)
    );
  });

  const selectedStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All Statuses";

  return (
    <div className="space-y-4" data-testid="amazon-listings-table">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Status filter */}
        <div className="relative">
          <button
            data-testid="status-filter-btn"
            onClick={() => setFilterOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium hover:bg-muted/50 transition-colors shadow-sm"
          >
            <Filter className="size-4 text-muted-foreground" />
            <span>{selectedStatusLabel}</span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-200",
                filterOpen && "rotate-180"
              )}
            />
          </button>
          {filterOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-border rounded-xl shadow-lg p-1 z-20 animate-fade-up">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setStatusFilter(opt.value);
                    setFilterOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center rounded-lg px-3 py-2 text-sm transition-colors",
                    statusFilter === opt.value
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            data-testid="listings-search-input"
            placeholder="Search by SKU, ASIN or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9"
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Last sync time */}
        {lastSyncedAt && (
          <span className="text-xs text-muted-foreground shrink-0">
            Last synced {lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}

        {/* Sync Now button */}
        <Button
          data-testid="sync-now-btn"
          size="sm"
          onClick={sync}
          disabled={syncing}
          className="shrink-0"
        >
          <RefreshCw className={cn("size-4 mr-2", syncing && "animate-spin")} />
          {syncing ? "Syncing…" : "Sync Now"}
        </Button>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
          <AlertCircle className="size-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">
            Failed to load listings. {error.message}
          </p>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden" data-testid="listings-card">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[48px_1fr_110px_100px_110px_90px_80px_120px] gap-4 px-5 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
          <span></span>
          <span>Title / SKU</span>
          <span>ASIN</span>
          <span>Status</span>
          <span>Product Type</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Last Synced</span>
        </div>

        {/* Loading skeletons */}
        {loading && listings.length === 0 && (
          <div className="divide-y divide-border" data-testid="listings-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[48px_1fr_110px_100px_110px_90px_80px_120px] gap-4 px-5 py-4 items-center"
              >
                <div className="size-10 rounded-lg bg-muted animate-skeleton" />
                <div className="space-y-1.5">
                  <div className="h-3 w-3/4 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
                  <div className="h-2.5 w-1/3 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.08 + 0.04}s` }} />
                </div>
                <div className="h-3 w-20 rounded bg-muted animate-skeleton" />
                <div className="h-5 w-16 rounded bg-muted animate-skeleton" />
                <div className="h-3 w-20 rounded bg-muted animate-skeleton" />
                <div className="h-3 w-10 rounded bg-muted animate-skeleton" />
                <div className="h-3 w-14 rounded bg-muted animate-skeleton" />
                <div className="h-3 w-20 rounded bg-muted animate-skeleton" />
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        {!loading || listings.length > 0 ? (
          <div className="divide-y divide-border">
            {filtered.map((listing) => {
              const stCfg = statusConfig[listing.status ?? "UNKNOWN"] ?? statusConfig.UNKNOWN;
              return (
                <div
                  key={`${listing.sku}-${listing.marketplaceId}`}
                  data-testid={`listing-row-${listing.sku}`}
                  className="grid grid-cols-1 sm:grid-cols-[48px_1fr_110px_100px_110px_90px_80px_120px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors duration-150"
                >
                  {/* Image */}
                  <div className="size-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {listing.imageUrl ? (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title ?? listing.sku}
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Title + SKU */}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {listing.title ?? listing.sku}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground mt-0.5">
                      {listing.sku}
                    </p>
                  </div>

                  {/* ASIN */}
                  <span className="text-xs font-mono text-muted-foreground">
                    {listing.asin ?? "—"}
                  </span>

                  {/* Status */}
                  <div>
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", stCfg.textColor)}>
                      <span className={cn("size-1.5 rounded-full", stCfg.dotColor)} />
                      {stCfg.label}
                    </span>
                  </div>

                  {/* Product Type */}
                  <div>
                    {listing.productType ? (
                      <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                        {listing.productType}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Quantity */}
                  <span
                    className={cn(
                      "text-sm tabular-nums",
                      listing.quantity != null && listing.quantity <= 10
                        ? "text-amber-600 font-medium"
                        : "text-foreground"
                    )}
                  >
                    {listing.quantity ?? "—"}
                  </span>

                  {/* Price */}
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {formatPrice(listing.price, listing.currency)}
                  </span>

                  {/* Last synced */}
                  <span className="text-xs text-muted-foreground">
                    {formatSyncTime(listing.rawSyncedAt)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Empty state */}
        {!loading && filtered.length === 0 && !error && (
          <EmptyState
            icon={<Package className="size-8 text-muted-foreground" />}
            title={searchQuery || statusFilter ? "No listings match your filters" : "No listings synced yet"}
            description={
              searchQuery || statusFilter
                ? "Try adjusting your search or filter."
                : "Click \"Sync Now\" to fetch your Amazon listings."
            }
            action={
              !searchQuery && !statusFilter ? (
                <Button size="sm" onClick={sync} disabled={syncing}>
                  <RefreshCw className={cn("size-4 mr-2", syncing && "animate-spin")} />
                  {syncing ? "Syncing…" : "Sync Now"}
                </Button>
              ) : undefined
            }
          />
        )}
      </Card>

      {/* Footer: count + load more */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            Showing {filtered.length} of {totalCount} listing{totalCount !== 1 ? "s" : ""}
          </span>
          {hasNextPage && (
            <Button
              variant="outline"
              size="sm"
              onClick={loadNextPage}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="size-4 mr-2 animate-spin" />
                  Loading…
                </>
              ) : (
                "Load more"
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
