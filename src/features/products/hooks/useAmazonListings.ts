import { useState, useCallback } from "react";
import {
  useAmazonListingsQuery,
  type AmazonListingsQueryVariables,
} from "@/lib/graphql/generated/types";

export interface UseAmazonListingsOptions {
  workspaceId: string;
  pageSize?: number;
  status?: string;
}

export function useAmazonListings(options: UseAmazonListingsOptions) {
  const { workspaceId, pageSize = 50, status } = options;
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const variables: AmazonListingsQueryVariables = {
    input: {
      workspaceId,
      pageSize,
      status: status || null,
      pageToken: pageToken || null,
    },
  };

  const result = useAmazonListingsQuery({
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    skip: !workspaceId,
  });

  const listings = result.data?.amazonListings?.items ?? [];
  const nextPageToken = result.data?.amazonListings?.nextPageToken ?? null;
  const totalCount = result.data?.amazonListings?.totalCount ?? 0;

  const loadNextPage = useCallback(() => {
    if (nextPageToken) {
      setPageToken(nextPageToken);
    }
  }, [nextPageToken]);

  const reset = useCallback(() => {
    setPageToken(undefined);
  }, []);

  return {
    ...result,
    listings,
    nextPageToken,
    totalCount,
    hasNextPage: !!nextPageToken,
    loadNextPage,
    reset,
  };
}
