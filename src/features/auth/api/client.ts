import { z } from 'zod';

import { config } from '@/lib/config';

/** Base URL for API (from VITE_API_URL or default). */
const API_BASE = config.apiUrl;

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
  } catch {
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

/** GraphQL login mutation result */
const loginResponseSchema = z.object({
  data: z
    .object({
      iamLogin: z.object({
        accessToken: z.string(),
        user: z.object({
          id: z.string(),
          email: z.string(),
          name: z.string().nullable(),
          status: z.string(),
          roles: z.array(z.string()),
        }),
      }),
    })
    .nullable(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        extensions: z.object({ code: z.string().optional() }).optional(),
      }),
    )
    .optional(),
});

export type LoginResult =
  | { ok: true; accessToken: string; userId: string }
  | { ok: false; error: string };

/**
 * Calls GraphQL iamLogin mutation. On success returns accessToken and userId.
 */
export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  const correlationId = crypto.randomUUID();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-correlation-id": correlationId,
  };

  const query = `
    mutation IamLogin($input: IamLoginInput!) {
      iamLogin(input: $input) {
        accessToken
        user { id email name status roles }
      }
    }
  `;

  let res: Response;
  try {
    res = await fetch(`${config.apiUrl}/graphql`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables: {
          input: { email: email.trim().toLowerCase(), password },
        },
      }),
    });
  } catch {
    return {
      ok: false,
      error: "Unable to reach the server. Please check your connection.",
    };
  }

  let body: unknown;
  try {
    body = await res.json().catch(() => null);
  } catch {
    return { ok: false, error: "Invalid response from server." };
  }

  const parsed = loginResponseSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, error: "Invalid response format." };
  }

  const { data, errors } = parsed.data;
  if (errors?.length) {
    const first = errors[0];
    const code = first.extensions?.code;
    const msg =
      code === "UNAUTHORIZED"
        ? "Invalid email or password."
        : code === "FORBIDDEN"
          ? first.message
          : first.message || "Login failed.";
    return { ok: false, error: msg };
  }

  if (data?.iamLogin) {
    return {
      ok: true,
      accessToken: data.iamLogin.accessToken,
      userId: data.iamLogin.user.id,
    };
  }

  return { ok: false, error: "Something went wrong. Please try again." };
}

const graphQlEnvelopeSchema = z.object({
  data: z.record(z.string(), z.unknown()).nullable().optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        extensions: z.object({ code: z.string().optional() }).optional(),
      }),
    )
    .optional(),
});

const logoutResponseSchema = z.object({
  data: z
    .object({
      iamLogout: z.object({
        message: z.string(),
      }),
    })
    .nullable()
    .optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        extensions: z.object({ code: z.string().optional() }).optional(),
      }),
    )
    .optional(),
});

export type LogoutResult = { ok: true } | { ok: false; error: string };

/**
 * Calls GraphQL iamLogout mutation using the current access token.
 */
export async function logout(
  accessToken: string | null,
): Promise<LogoutResult> {
  if (!accessToken) {
    return { ok: true };
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-correlation-id": crypto.randomUUID(),
    authorization: `Bearer ${accessToken}`,
  };

  let res: Response;
  try {
    res = await fetch(`${config.apiUrl}/graphql`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query: `
          mutation IamLogout {
            iamLogout {
              message
            }
          }
        `,
      }),
    });
  } catch {
    return {
      ok: false,
      error: "Unable to reach the server. Please check your connection.",
    };
  }

  let body: unknown;
  try {
    body = await res.json().catch(() => null);
  } catch {
    return { ok: false, error: "Invalid response from server." };
  }

  const parsed = logoutResponseSchema.safeParse(body);
  if (!parsed.success) {
    const fallback = graphQlEnvelopeSchema.safeParse(body);
    if (!fallback.success) {
      return { ok: false, error: "Invalid response format." };
    }
    const firstError = fallback.data.errors?.[0];
    if (firstError?.extensions?.code === "UNAUTHORIZED") {
      return { ok: true };
    }
    if (firstError) {
      return { ok: false, error: firstError.message || "Logout failed." };
    }
    return { ok: false, error: "Logout failed." };
  }

  const { data, errors } = parsed.data;
  if (errors?.length) {
    const first = errors[0];
    if (first.extensions?.code === "UNAUTHORIZED") {
      return { ok: true };
    }
    return { ok: false, error: first.message || "Logout failed." };
  }

  if (data?.iamLogout) {
    return { ok: true };
  }

  return { ok: false, error: "Logout failed." };
}

const oauthStartEnvelopeSchema = z.object({
  data: z.object({ redirectUrl: z.string().url() }).nullable(),
  error: apiErrorSchema.nullable(),
  correlationId: z.string().optional(),
});

export type OAuthProvider = "google" | "meta";

export type GetOAuthStartUrlResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string };

/** OAuth start endpoints (Option B: GET then redirect to json.data.redirectUrl). */
const OAUTH_START_ENDPOINTS: Record<OAuthProvider, string> = {
  google: `${API_BASE}/v1/auth/oauth/google/start`,
  meta: `${API_BASE}/v1/auth/oauth/meta/start`,
};

export interface GetOAuthStartUrlOptions {
  /** Custom server callback URL (e.g. for another environment). Omit to use server default. */
  redirectUri?: string;
}

/**
 * Option B (recommended): GET /v1/auth/oauth/:provider/start, then send user to json.data.redirectUrl.
 * Call when user clicks "Login with Google" or "Login with Facebook".
 * On success, set window.location.href = result.redirectUrl.
 */
export async function getOAuthStartUrl(
  provider: OAuthProvider,
  options?: GetOAuthStartUrlOptions,
): Promise<GetOAuthStartUrlResult> {
  try {
    let url = OAUTH_START_ENDPOINTS[provider];
    if (options?.redirectUri) {
      url += `?redirect_uri=${encodeURIComponent(options.redirectUri)}`;
    }
    const res = await fetch(url, {
      headers: { "x-correlation-id": crypto.randomUUID() },
    });
    const json: unknown = await res.json().catch(() => null);
    const parsed = oauthStartEnvelopeSchema.safeParse(json);
    if (!parsed.success) {
      return { ok: false, error: "Invalid response from server." };
    }
    const { data, error } = parsed.data;
    if (error) {
      return {
        ok: false,
        error: error.message ?? "OAuth is not available.",
      };
    }
    if (data?.redirectUrl) {
      return { ok: true, redirectUrl: data.redirectUrl };
    }
    return { ok: false, error: "OAuth is not available." };
  } catch {
    return {
      ok: false,
      error: "Unable to reach the server. Please check your connection.",
    };
  }
}
