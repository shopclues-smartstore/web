import { useCallback } from "react";
import { useSyncAmazonListingsMutation } from "@/lib/graphql/generated/types";
import { AMAZON_LISTINGS } from "@/lib/graphql/operations/queries";

export interface UseSyncAmazonListingsOptions {
  workspaceId: string;
  onSuccess?: (syncedCount: number) => void;
  onError?: (message: string) => void;
}

export function useSyncAmazonListings(options: UseSyncAmazonListingsOptions) {
  const { workspaceId, onSuccess, onError } = options;

  const [runSync, result] = useSyncAmazonListingsMutation({
    refetchQueries: [
      {
        query: AMAZON_LISTINGS,
        variables: { input: { workspaceId, pageSize: 50 } },
      },
    ],
    awaitRefetchQueries: true,
  });

  const sync = useCallback(async () => {
    try {
      const result = await runSync({
        variables: { input: { workspaceId } },
      });
      if (result.data?.syncAmazonListings) {
        onSuccess?.(result.data.syncAmazonListings.syncedCount);
      }
    } catch (err) {
      onError?.(err instanceof Error ? err.message : "Sync failed");
    }
  }, [workspaceId, runSync, onSuccess, onError]);

  return {
    sync,
    loading: result.loading,
    error: result.error,
    data: result.data?.syncAmazonListings ?? null,
  };
}
