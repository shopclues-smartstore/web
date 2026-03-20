import { useCallback } from "react";
import { useSyncAmazonOrdersMutation } from "@/lib/graphql/generated/types";

export interface UseSyncAmazonOrdersOptions {
  workspaceId: string;
  onSuccess?: (syncedCount: number) => void;
  onError?: (message: string) => void;
}

export function useSyncAmazonOrders(options: UseSyncAmazonOrdersOptions) {
  const { workspaceId, onSuccess, onError } = options;

  const [runSync, result] = useSyncAmazonOrdersMutation();

  const sync = useCallback(async () => {
    try {
      const createdAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const result = await runSync({
        variables: { input: { workspaceId, createdAfter } },
      });
      if (result.data?.syncAmazonOrders) {
        onSuccess?.(result.data.syncAmazonOrders.syncedCount);
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Orders sync failed");
    }
  }, [workspaceId, runSync, onSuccess, onError]);

  return {
    sync,
    loading: result.loading,
    error: result.error,
    data: result.data?.syncAmazonOrders ?? null,
  };
}
