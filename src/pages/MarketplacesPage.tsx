import { AlertTriangle, CheckCircle2, Clock, RefreshCw, ShoppingBag, Unlink } from 'lucide-react';
import { useViewerBootstrap } from '@/features/auth/hooks/useViewerBootstrap';
import { useAmazonConnect } from '@/features/workspace/hooks/useAmazonConnect';
import { AmazonConnectButton } from '@/components/marketplace/AmazonConnectButton';
import { getAmazonConnectErrorMessage } from '@/lib/marketplace-errors';
import { cn } from '@/lib/utils';

interface Marketplace {
  id: string;
  name: string;
  icon?: string;
  color: string;
  bgColor: string;
  available: boolean;
}

const MARKETPLACES: Marketplace[] = [
  { id: 'amazon', name: 'Amazon', icon: '/brands/amazon.svg', color: 'text-orange-600', bgColor: 'bg-orange-50', available: true },
  { id: 'flipkart', name: 'Flipkart', icon: '/brands/flipkart.svg', color: 'text-blue-600', bgColor: 'bg-blue-50', available: false },
  { id: 'meesho', name: 'Meesho', color: 'text-pink-600', bgColor: 'bg-pink-50', available: false },
  { id: 'noon', name: 'Noon', icon: '/brands/noon.svg', color: 'text-yellow-600', bgColor: 'bg-yellow-50', available: false },
  { id: 'ondc', name: 'ONDC', icon: '/brands/ondc.svg', color: 'text-blue-600', bgColor: 'bg-blue-50', available: false },
  { id: 'shopclues', name: 'ShopClues', icon: '/brands/shopclues.svg', color: 'text-orange-600', bgColor: 'bg-orange-50', available: false },
];

function formatLastSync(iso: string | null | undefined): string {
  if (!iso) return 'Never';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return d.toLocaleDateString();
}

export function MarketplacesPage() {
  const { workspace } = useViewerBootstrap();
  const amazonConnection = workspace?.marketplaceConnections?.find(
    (c) => c.provider === 'AMAZON',
  );
  const amazonConnect = useAmazonConnect(workspace?.id, amazonConnection);

  const isAmazonConnected = amazonConnect.status === 'success';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Marketplaces</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your connected sales channels and sync settings.
        </p>
      </div>

      {/* Amazon OAuth error */}
      {amazonConnect.status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            {getAmazonConnectErrorMessage(amazonConnect.errorCode)}
          </p>
        </div>
      )}

      {/* Connected Marketplaces */}
      {isAmazonConnected && amazonConnection && (
        <section>
          <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Connected
          </h2>
          <div className="rounded-xl border border-emerald-200 bg-white overflow-hidden">
            <div className="flex items-center gap-4 p-5">
              {/* Logo */}
              <div className="size-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                <img src="/brands/amazon.svg" alt="Amazon" className="h-6 w-auto object-contain" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-sm">Amazon</span>
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                    <CheckCircle2 className="size-3" />
                    Connected
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {amazonConnection.displayName && (
                    <span className="truncate">{amazonConnection.displayName}</span>
                  )}
                  {amazonConnection.externalSellerId && (
                    <span className="font-mono">ID: {amazonConnection.externalSellerId}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Last sync: {formatLastSync(amazonConnection.lastSyncAt)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={amazonConnect.disconnect}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Unlink className="size-3.5" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Marketplace Grid */}
      <section>
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          {isAmazonConnected ? 'Add Another Marketplace' : 'Connect a Marketplace'}
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {MARKETPLACES.map((mp) => {
            const isConnected = mp.id === 'amazon' && isAmazonConnected;
            if (isConnected) return null; // already shown above when connected

            return (
              <div
                key={mp.id}
                className={cn(
                  'relative rounded-xl border bg-white p-5 flex flex-col items-center gap-3',
                  mp.available
                    ? 'border-border hover:border-primary/40 hover:shadow-sm transition-all duration-200'
                    : 'border-border opacity-60',
                )}
              >
                {/* Coming Soon badge */}
                {!mp.available && (
                  <span className="absolute top-2 right-2 text-[10px] font-semibold text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    Soon
                  </span>
                )}

                {/* Logo / Name */}
                <div className={cn('size-12 rounded-xl flex items-center justify-center', mp.bgColor)}>
                  {mp.icon ? (
                    <img src={mp.icon} alt={mp.name} className="h-6 w-auto object-contain" />
                  ) : (
                    <ShoppingBag className={cn('size-5', mp.color)} />
                  )}
                </div>

                <span className="text-sm font-semibold">{mp.name}</span>

                {/* Action */}
                {mp.id === 'amazon' ? (
                  <AmazonConnectButton
                    status={amazonConnect.status}
                    onConnect={amazonConnect.connect}
                    onDisconnect={amazonConnect.disconnect}
                  />
                ) : (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <RefreshCw className="size-3" />
                    Coming soon
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
