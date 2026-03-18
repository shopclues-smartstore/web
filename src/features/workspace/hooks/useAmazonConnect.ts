import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useAmazonAuthSessionLazyQuery,
  useDisconnectAmazonSellerMutation,
} from '@/lib/graphql/generated/types';
import { useApolloClient } from '@apollo/client/react';

export type AmazonConnectStatus = 'idle' | 'pending' | 'success' | 'error';

interface AmazonConnectState {
  status: AmazonConnectStatus;
  connectionId: string | undefined;
  errorCode: string | undefined;
}

interface ExistingAmazonConnection {
  id: string;
  status: string; // MarketplaceConnectionStatus enum value from GQL
}

const POPUP_WIDTH = 600;
const POPUP_HEIGHT = 700;
const LS_KEY = 'amazon_oauth_result';

function openCentredPopup(url: string): Window | null {
  const left = Math.round(window.screenX + (window.outerWidth - POPUP_WIDTH) / 2);
  const top = Math.round(window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2);
  return window.open(
    url,
    'amazon_oauth',
    `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},toolbar=no,menubar=no`
  );
}

/**
 * Owns the full Amazon OAuth popup lifecycle.
 *
 * Communication strategy: localStorage storage event.
 * - window.opener is severed by Amazon's COOP: same-origin header.
 * - BroadcastChannel is limited to the same agent cluster; COOP puts the
 *   popup in a new cluster, so BC messages never arrive.
 * - The storage event fires in ALL same-origin windows regardless of agent
 *   cluster, making it the only reliable cross-context-group channel here.
 */
export function useAmazonConnect(
  workspaceId: string | undefined,
  existingConnection?: ExistingAmazonConnection | null,
) {
  const client = useApolloClient();
  const popupRef = useRef<Window | null>(null);
  const listeningRef = useRef(false);

  const [state, setState] = useState<AmazonConnectState>(() => ({
    status: existingConnection?.status === 'CONNECTED' ? 'success' : 'idle',
    connectionId: existingConnection?.id,
    errorCode: undefined,
  }));

  // Keep local state in sync with ViewerBootstrap updates.
  // (The initial state initializer only runs once.)
  useEffect(() => {
    // Don't override while the popup is in-flight; close handler will refetch.
    if (state.status === 'pending') return;

    if (existingConnection?.status === 'CONNECTED') {
      setState({ status: 'success', connectionId: existingConnection.id, errorCode: undefined });
      return;
    }

    // If a previously connected seller gets disconnected elsewhere, reflect it.
    if (!existingConnection) {
      setState((prev) =>
        prev.status === 'success' || prev.status === 'error'
          ? { status: 'idle', connectionId: undefined, errorCode: undefined }
          : prev,
      );
    }
  }, [existingConnection, state.status]);

  const [getAuthSession] = useAmazonAuthSessionLazyQuery({ fetchPolicy: 'network-only' });
  const [runDisconnect] = useDisconnectAmazonSellerMutation();

  const stopListening = useCallback(() => {
    if (!listeningRef.current) return;
    listeningRef.current = false;
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
    popupRef.current = null;
    localStorage.removeItem(LS_KEY);
  }, []);

  const connect = useCallback(async () => {
    if (!workspaceId) return;
    setState({ status: 'pending', connectionId: undefined, errorCode: undefined });

    // Clear any stale result from a previous attempt
    localStorage.removeItem(LS_KEY);

    try {
      const { data, error } = await getAuthSession({
        variables: { input: { workspaceId } },
      });
      if (error || !data?.amazonAuthSession) {
        setState({ status: 'error', connectionId: undefined, errorCode: 'INTERNAL' });
        return;
      }

      const popup = openCentredPopup(data.amazonAuthSession.url);
      if (!popup) {
        setState({ status: 'error', connectionId: undefined, errorCode: 'POPUP_BLOCKED' });
        return;
      }
      popupRef.current = popup;
      listeningRef.current = true;

      const checkClosedTimer = setInterval(() => {
        if (popupRef.current?.closed) {
          clearInterval(checkClosedTimer);
          if (listeningRef.current) {
            stopListening();
            // If the popup can't message back due to COOP/agent-cluster issues,
            // refetch ViewerBootstrap once on close and let `existingConnection`
            // drive the UI state.
            client.cache.evict({ fieldName: 'viewerBootstrap' });
            client.cache.gc();
            client.refetchQueries({ include: ['ViewerBootstrap'] });
            setState((prev) => {
              if (prev.status === 'pending') {
                return { status: 'idle', connectionId: undefined, errorCode: undefined };
              }
              return prev;
            });
          }
        }
      }, 500);
    } catch {
      setState({ status: 'error', connectionId: undefined, errorCode: 'INTERNAL' });
    }
  }, [workspaceId, getAuthSession, stopListening, client]);

  // Listen for the result written by AmazonOAuthDone via localStorage
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== LS_KEY || !event.newValue || !listeningRef.current) return;

      let msg: { type?: string; status?: string; connectionId?: string; errorCode?: string } | null = null;
      try { msg = JSON.parse(event.newValue); } catch { return; }
      if (!msg || msg.type !== 'AMAZON_OAUTH_DONE') return;

      stopListening();

      if (msg.status === 'success') {
        setState({ status: 'success', connectionId: msg.connectionId, errorCode: undefined });
        client.cache.evict({ fieldName: 'viewerBootstrap' });
        client.cache.gc();
        client.refetchQueries({ include: ['ViewerBootstrap'] });
      } else {
        setState({ status: 'error', connectionId: undefined, errorCode: msg.errorCode ?? 'INTERNAL' });
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      stopListening();
    };
  }, [client, stopListening]);

  const disconnect = useCallback(async () => {
    if (!workspaceId) return;
    await runDisconnect({ variables: { input: { workspaceId } } });
    setState({ status: 'idle', connectionId: undefined, errorCode: undefined });
    client.cache.evict({ fieldName: 'viewerBootstrap' });
    client.cache.gc();
    client.refetchQueries({ include: ['ViewerBootstrap'] });
  }, [workspaceId, runDisconnect, client]);

  return {
    status: state.status,
    connectionId: state.connectionId,
    errorCode: state.errorCode,
    connect,
    disconnect,
  };
}
