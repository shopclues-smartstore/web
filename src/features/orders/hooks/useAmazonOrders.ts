import { useState, useCallback } from "react";
import {
  useAmazonOrdersQuery,
  type AmazonOrdersQueryVariables,
} from "@/lib/graphql/generated/types";

export interface UseAmazonOrdersOptions {
  workspaceId: string;
  pageSize?: number;
  statuses?: string[];
}

export function useAmazonOrders(options: UseAmazonOrdersOptions) {
  const { workspaceId, pageSize = 50, statuses } = options;
  const [pageToken, setPageToken] = useState<string | undefined>(undefined);

  const variables: AmazonOrdersQueryVariables = {
    input: {
      workspaceId,
      pageSize,
      statuses: statuses && statuses.length > 0 ? statuses : null,
      pageToken: pageToken ?? null,
    },
  };

  const result = useAmazonOrdersQuery({
    variables,
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
    skip: !workspaceId,
  });

  const orders = result.data?.amazonOrders?.items ?? [];
  const nextPageToken = result.data?.amazonOrders?.nextPageToken ?? null;
  const totalCount = result.data?.amazonOrders?.totalCount ?? 0;

  const loadNextPage = useCallback(() => {
    if (nextPageToken) setPageToken(nextPageToken);
  }, [nextPageToken]);

  const reset = useCallback(() => setPageToken(undefined), []);

  return {
    ...result,
    orders,
    nextPageToken,
    totalCount,
    hasNextPage: !!nextPageToken,
    loadNextPage,
    reset,
  };
}
