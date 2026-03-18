export const AMAZON_CONNECT_ERROR_MESSAGES: Record<string, string> = {
  INVALID_STATE: 'Authorization session expired. Please try again.',
  NONCE_REPLAY: 'This authorization link has already been used. Please try again.',
  LWA_EXCHANGE_FAILED: 'Amazon rejected the authorization. Please try again.',
  SELLER_ALREADY_CONNECTED: 'This Amazon seller account is already connected to another store.',
  CONNECTION_NOT_FOUND: 'No Amazon connection found for this store.',
  POPUP_BLOCKED: 'Your browser blocked the popup. Please allow popups for this site and try again.',
  INTERNAL: 'Something went wrong. Please contact support.',
};

export function getAmazonConnectErrorMessage(code: string | undefined): string {
  if (!code) return AMAZON_CONNECT_ERROR_MESSAGES.INTERNAL;
  return AMAZON_CONNECT_ERROR_MESSAGES[code] ?? AMAZON_CONNECT_ERROR_MESSAGES.INTERNAL;
}
