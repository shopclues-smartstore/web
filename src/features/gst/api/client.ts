import { config } from '@/lib/config';

import type {
  GstLookupError,
  GstLookupResponse,
} from './types';

export type GstLookupResult =
  | { ok: true; data: GstLookupResponse }
  | { ok: false; error: string };

/**
 * Fetches business details by GST number (GSTIN).
 * Calls backend GET /v1/gst/lookup?gstin=... which should proxy to an official
 * or licensed GST verification API (e.g. GST portal, ClearTax).
 */
export async function fetchGstDetails(gstin: string): Promise<GstLookupResult> {
  const trimmed = gstin.trim().toUpperCase();
  if (!trimmed) {
    return { ok: false, error: "GST number is required." };
  }

  let res: Response;
  try {
    res = await fetch(
      `${config.apiUrl}/v1/gst/lookup?gstin=${encodeURIComponent(trimmed)}`,
      { method: "GET", headers: { Accept: "application/json" } }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { ok: false, error: message };
  }

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return {
      ok: false,
      error: res.ok ? "Invalid response from server." : "Request failed.",
    };
  }

  if (!res.ok) {
    const err = body as { error?: GstLookupError };
    const message =
      err?.error?.message ?? `Request failed (${res.status}).`;
    return { ok: false, error: message };
  }

  const data = body as GstLookupResponse;
  if (!data?.details?.legalName) {
    return { ok: false, error: "Invalid response: missing business details." };
  }

  return { ok: true, data: { ...data, gstin: data.gstin ?? trimmed } };
}
