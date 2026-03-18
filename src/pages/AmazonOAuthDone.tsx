import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Landing page for the Amazon OAuth popup: /connect/amazon/done
 *
 * The backend redirects the popup here after the OAuth callback completes.
 * This page reads the result from the URL, postMessages it to the opener
 * (the ConnectMarketplacePage), then closes itself.
 *
 * If window.opener is gone (e.g. direct navigation) it shows a fallback UI.
 */
export function AmazonOAuthDone() {
  const [params] = useSearchParams();

  useEffect(() => {
    const status = params.get('status');
    const connectionId = params.get('connectionId') ?? undefined;
    const code = params.get('code') ?? undefined;

    if (!status) return;

    // window.opener is null after Amazon's COOP header severs the opener
    // relationship during cross-origin navigation. BroadcastChannel works
    // across same-origin windows without needing window.opener.
    const bc = new BroadcastChannel('amazon_oauth');
    bc.postMessage({ type: 'AMAZON_OAUTH_DONE', status, connectionId, errorCode: code });
    bc.close();
    window.close();
  }, [params]);

  // Fallback if window didn't close (e.g. opened directly, not as popup)
  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground text-sm">
        {params.get('status') === 'success'
          ? 'Amazon connected successfully. You may close this window.'
          : 'Amazon connection failed. You may close this window.'}
      </p>
    </div>
  );
}
