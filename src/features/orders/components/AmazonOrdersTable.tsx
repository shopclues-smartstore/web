import { useState } from 'react';

import {
  AlertCircle,
  ChevronDown,
  Download,
  Filter,
  RefreshCw,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import {
  useSyncAmazonOrders,
} from '@/features/products/hooks/useSyncAmazonOrders';
import { formatCurrency } from '@/lib/currency';
import type { OrderDocumentType } from '@/lib/graphql/generated/types';
import { cn } from '@/lib/utils';

import { useAmazonOrders } from '../hooks/useAmazonOrders';
import { useOrderDocument } from '../hooks/useOrderDocument';

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING", label: "Pending" },
  { value: "UNSHIPPED", label: "Unshipped" },
  { value: "PARTIALLY_SHIPPED", label: "Partially Shipped" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "CANCELED", label: "Canceled" },
  { value: "UNFULFILLABLE", label: "Unfulfillable" },
];

const statusConfig: Record<string, { label: string; dotColor: string; textColor: string }> = {
  PENDING: { label: "Pending", dotColor: "bg-amber-500", textColor: "text-amber-700" },
  UNSHIPPED: { label: "Unshipped", dotColor: "bg-amber-500", textColor: "text-amber-700" },
  PARTIALLY_SHIPPED: { label: "Partially Shipped", dotColor: "bg-blue-500", textColor: "text-blue-700" },
  SHIPPED: { label: "Shipped", dotColor: "bg-emerald-500", textColor: "text-emerald-700" },
  CANCELED: { label: "Canceled", dotColor: "bg-slate-400", textColor: "text-slate-500" },
  UNFULFILLABLE: { label: "Unfulfillable", dotColor: "bg-red-400", textColor: "text-red-600" },
  UNKNOWN: { label: "Unknown", dotColor: "bg-red-400", textColor: "text-red-600" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSyncTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface Props {
  workspaceId: string;
}

export function AmazonOrdersTable({ workspaceId }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const { orders, loading, error, refetch, hasNextPage, loadNextPage, totalCount } =
    useAmazonOrders({
      workspaceId,
      statuses: statusFilter ? [statusFilter] : undefined,
    });

  const { sync, loading: syncing } = useSyncAmazonOrders({
    workspaceId,
    onSuccess: (count) => {
      setLastSyncedAt(new Date());
      toast.success("Sync complete", {
        description: `${count} order${count !== 1 ? "s" : ""} synced from Amazon.`,
      });
      refetch();
    },
    onError: (msg) => toast.error("Sync failed", { description: msg }),
  });

  const { downloadDocument } = useOrderDocument({ workspaceId });

  const filtered = orders.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return o.amazonOrderId.toLowerCase().includes(q);
  });

  const selectedStatusLabel =
    STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All Statuses";

  async function handleDownload(amazonOrderId: string, documentType: OrderDocumentType) {
    const key = `${amazonOrderId}-${documentType}`;
    setDownloadingId(key);
    setOpenDropdownId(null);
    try {
      await downloadDocument(amazonOrderId, documentType);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="space-y-4" data-testid="amazon-orders-table">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Status filter */}
        <div className="relative">
          <button
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
            <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-border rounded-xl shadow-lg p-1 z-20 animate-fade-up">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatusFilter(opt.value); setFilterOpen(false); }}
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
            placeholder="Search by order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 pl-9"
          />
        </div>

        <div className="flex-1" />

        {lastSyncedAt && (
          <span className="text-xs text-muted-foreground shrink-0">
            Last synced {lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}

        <Button size="sm" onClick={sync} disabled={syncing} className="shrink-0">
          <RefreshCw className={cn("size-4 mr-2", syncing && "animate-spin")} />
          {syncing ? "Syncing…" : "Sync Now"}
        </Button>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
          <AlertCircle className="size-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">Failed to load orders. {error.message}</p>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden" data-testid="orders-card">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[1fr_110px_110px_100px_100px_90px_110px_80px] gap-4 px-5 py-3 bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border">
          <span>Order ID</span>
          <span>Date</span>
          <span>Status</span>
          <span>Items</span>
          <span>Total</span>
          <span>Fulfillment</span>
          <span>Last Synced</span>
          <span></span>
        </div>

        {/* Loading skeletons */}
        {loading && orders.length === 0 && (
          <div className="divide-y divide-border" data-testid="orders-skeleton">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-[1fr_110px_110px_100px_100px_90px_110px_80px] gap-4 px-5 py-4 items-center"
              >
                <div className="h-3 w-36 rounded bg-muted animate-skeleton" style={{ animationDelay: `${i * 0.08}s` }} />
                <div className="h-3 w-20 rounded bg-muted animate-skeleton" />
                <div className="h-5 w-20 rounded bg-muted animate-skeleton" />
                <div className="h-3 w-12 rounded bg-muted animate-skeleton" />
                <div className="h-3 w-16 rounded bg-muted animate-skeleton" />
                <div className="h-5 w-12 rounded bg-muted animate-skeleton" />
                <div className="h-3 w-20 rounded bg-muted animate-skeleton" />
                <div className="h-7 w-20 rounded bg-muted animate-skeleton" />
              </div>
            ))}
          </div>
        )}

        {/* Rows */}
        {(!loading || orders.length > 0) && (
          <div className="divide-y divide-border">
            {filtered.map((order) => {
              const stCfg = statusConfig[order.orderStatus] ?? statusConfig.UNKNOWN;
              const shipped = order.numberOfItemsShipped ?? 0;
              const total = (order.numberOfItemsShipped ?? 0) + (order.numberOfItemsUnshipped ?? 0);
              const dlKey = (type: string) => `${order.amazonOrderId}-${type}`;

              return (
                <div
                  key={order.id}
                  data-testid={`order-row-${order.amazonOrderId}`}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_110px_110px_100px_100px_90px_110px_80px] gap-2 sm:gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors duration-150"
                >
                  {/* Order ID */}
                  <span className="text-xs font-mono text-foreground truncate">
                    {order.amazonOrderId}
                  </span>

                  {/* Date */}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.purchaseDate)}
                  </span>

                  {/* Status */}
                  <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", stCfg.textColor)}>
                    <span className={cn("size-1.5 rounded-full shrink-0", stCfg.dotColor)} />
                    {stCfg.label}
                  </span>

                  {/* Items */}
                  <span className="text-sm tabular-nums text-foreground">
                    {total > 0 ? `${shipped}/${total}` : "—"}
                  </span>

                  {/* Total */}
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {order.orderTotal != null && order.currency
                      ? formatCurrency(order.orderTotal, order.currency)
                      : "—"}
                  </span>

                  {/* Fulfillment */}
                  <div>
                    {order.fulfillmentChannel ? (
                      <Badge variant="outline" className="text-xs">
                        {order.fulfillmentChannel === "AFN" ? "FBA" : order.fulfillmentChannel}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </div>

                  {/* Last synced */}
                  <span className="text-xs text-muted-foreground">
                    {formatSyncTime(order.rawSyncedAt)}
                  </span>

                  {/* Actions — Download dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId((id) =>
                          id === order.amazonOrderId ? null : order.amazonOrderId
                        )
                      }
                      className="flex items-center gap-1.5 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-muted/50 transition-colors shadow-sm"
                    >
                      <Download className="size-3.5 text-muted-foreground" />
                      <span>Print</span>
                      <ChevronDown
                        className={cn(
                          "size-3 text-muted-foreground transition-transform duration-150",
                          openDropdownId === order.amazonOrderId && "rotate-180"
                        )}
                      />
                    </button>

                    {openDropdownId === order.amazonOrderId && (
                      <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-border rounded-xl shadow-lg p-1 z-20 animate-fade-up">
                        {(
                          [
                            { type: "TAX_INVOICE" as OrderDocumentType, label: "Tax Invoice" },
                            { type: "PACKING_SLIP" as OrderDocumentType, label: "Packing Slip" },
                          ] as const
                        ).map(({ type, label }) => {
                          const isLoading = downloadingId === dlKey(type);
                          return (
                            <button
                              key={type}
                              disabled={isLoading}
                              onClick={() => handleDownload(order.amazonOrderId, type)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                            >
                              {isLoading ? (
                                <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
                              ) : (
                                <Download className="size-3.5 text-muted-foreground" />
                              )}
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && !error && (
          <EmptyState
            icon={<ShoppingCart className="size-8 text-muted-foreground" />}
            title={searchQuery || statusFilter ? "No orders match your filters" : "No orders synced yet"}
            description={
              searchQuery || statusFilter
                ? "Try adjusting your search or filter."
                : 'Click "Sync Now" to fetch your Amazon orders.'
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

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground">
            Showing {filtered.length} of {totalCount} order{totalCount !== 1 ? "s" : ""}
          </span>
          {hasNextPage && (
            <Button variant="outline" size="sm" onClick={loadNextPage} disabled={loading}>
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
