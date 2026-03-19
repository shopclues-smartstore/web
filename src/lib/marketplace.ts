/**
 * Formats a marketplace provider enum (e.g. "AMAZON") into a display name.
 * Uses displayName if available, otherwise title-cases the provider code.
 */
export function formatProviderName(provider: string, displayName?: string | null): string {
  if (displayName) return displayName;
  return provider.charAt(0) + provider.slice(1).toLowerCase();
}
