import { z } from "zod";
import { config } from "@/lib/config";

export interface SignupInput {
  email: string;
  password: string;
  name?: string;
}

const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

const signupSuccessDataSchema = z.object({
  message: z.string(),
});

const apiEnvelopeSchema = z.object({
  data: signupSuccessDataSchema.nullable(),
  error: apiErrorSchema.nullable(),
  correlationId: z.string(),
});

export type SignupSuccessData = z.infer<typeof signupSuccessDataSchema>;

export type SignupResult =
  | { ok: true; data: SignupSuccessData; correlationId: string }
  | { ok: false; error: string; correlationId: string };

/**
 * Calls POST /v1/auth/signup. Parses envelope safely; handles non-JSON responses.
 */
export async function signup(input: SignupInput): Promise<SignupResult> {
  const correlationId = crypto.randomUUID();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-correlation-id": correlationId,
  };

  let res: Response;
  try {
    res = await fetch(`${config.apiUrl}/v1/auth/signup`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        email: input.email.trim().toLowerCase(),
        password: input.password,
        ...(input.name?.trim() ? { name: input.name.trim() } : {}),
      }),
    });
  } catch (err) {
    return {
      ok: false,
      error: "Unable to reach the server. Please check your connection.",
      correlationId,
    };
  }

  let body: unknown;
  try {
    const text = await res.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    return {
      ok: false,
      error: "Invalid response from server.",
      correlationId,
    };
  }

  const parsed = apiEnvelopeSchema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid response format.",
      correlationId,
    };
  }

  const envelope = parsed.data;
  const id = envelope.correlationId ?? correlationId;

  if (res.ok && envelope.data) {
    return {
      ok: true,
      data: envelope.data,
      correlationId: id,
    };
  }

  if (envelope.error) {
    const msg =
      envelope.error.code === "VALIDATION_ERROR"
        ? "Please fix the errors in the form."
        : envelope.error.message || "Something went wrong.";
    return {
      ok: false,
      error: msg,
      correlationId: id,
    };
  }

  return {
    ok: false,
    error: "Something went wrong. Please try again.",
    correlationId: id,
  };
}

const oauthStartEnvelopeSchema = z.object({
  data: z.object({ redirectUrl: z.string().url() }).nullable(),
  error: apiErrorSchema.nullable(),
  correlationId: z.string(),
});

export type OAuthProvider = "google" | "meta";

export type GetOAuthStartUrlResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string };

/**
 * Fetches the OAuth start URL from the backend, then redirects the user to the provider.
 * Call this when the user clicks "Sign in with Google" etc.
 */
export async function getOAuthStartUrl(
  provider: OAuthProvider
): Promise<GetOAuthStartUrlResult> {
  try {
    const res = await fetch(
      `${config.apiUrl}/v1/auth/oauth/${provider}/start`,
      { headers: { "x-correlation-id": crypto.randomUUID() } }
    );
    const body: unknown = await res.json().catch(() => null);
    const parsed = oauthStartEnvelopeSchema.safeParse(body);
    if (!parsed.success) {
      return { ok: false, error: "Invalid response from server." };
    }
    const envelope = parsed.data;
    if (envelope.data?.redirectUrl) {
      return { ok: true, redirectUrl: envelope.data.redirectUrl };
    }
    return {
      ok: false,
      error: envelope.error?.message ?? "OAuth is not available.",
    };
  } catch {
    return {
      ok: false,
      error: "Unable to reach the server. Please check your connection.",
    };
  }
}
