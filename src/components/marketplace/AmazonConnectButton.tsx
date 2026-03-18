import { CheckCircle2, Loader2, Unlink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AmazonConnectStatus } from '@/features/workspace/hooks/useAmazonConnect';

interface AmazonConnectButtonProps {
  status: AmazonConnectStatus;
  onConnect: () => void;
  onDisconnect: () => void;
}

/**
 * Presentation-only component. All logic lives in useAmazonConnect.
 */
export function AmazonConnectButton({ status, onConnect, onDisconnect }: AmazonConnectButtonProps) {
  if (status === 'success') {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-emerald-700 font-medium">
          <CheckCircle2 className="size-4" />
          Connected
        </span>
        <button
          onClick={onDisconnect}
          className="text-xs text-muted-foreground hover:text-destructive transition-colors underline underline-offset-2"
        >
          <Unlink className="size-3 inline mr-1" />
          Disconnect
        </button>
      </div>
    );
  }

  if (status === 'pending') {
    return (
      <Button disabled className="rounded-lg" size="sm">
        <Loader2 className="size-4 mr-2 animate-spin" />
        Connecting…
      </Button>
    );
  }

  return (
    <Button
      onClick={onConnect}
      className="rounded-lg shadow-sm hover:shadow-md transition-all duration-200 bg-[#FF9900] hover:bg-[#e68a00] text-white"
      size="sm"
    >
      Connect Amazon
    </Button>
  );
}
