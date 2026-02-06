import { config } from "@/lib/config";

export interface SignupInput {
  email: string;
  password: string;
  name?: string;
}

export interface ApiEnvelope<T> {
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: unknown;
  } | null;
  correlationId: string;
}

export interface SignupSuccessData {
  message: string;
}

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

  const envelope = body as ApiEnvelope<SignupSuccessData> | null;
  if (!envelope || typeof envelope !== "object" || !("correlationId" in envelope)) {
    return {
      ok: false,
      error: "Invalid response format.",
      correlationId,
    };
  }

  const id = String(envelope.correlationId ?? correlationId);

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
