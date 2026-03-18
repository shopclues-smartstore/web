const ACCESS_TOKEN_KEY = "smartstore_access_token";
const USER_ID_KEY = "smartstore_user_id";

/**
 * Decodes a JWT token and returns its payload.
 * Returns null if the token is invalid or malformed.
 */
function decodeJWT(token: string): { exp?: number; [key: string]: unknown } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Checks if a JWT token is valid (exists and not expired).
 * Returns true if token exists and is valid, false otherwise.
 */
function isTokenValid(token: string | null): boolean {
  if (!token) {
    return false;
  }

  const decoded = decodeJWT(token);
  if (!decoded) {
    return false;
  }

  // Check expiration (exp is Unix timestamp in seconds)
  if (decoded.exp) {
    const expirationTime = decoded.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    if (now >= expirationTime) {
      return false;
    }
  }

  return true;
}

export const authStorage = {
  setSession(accessToken: string, userId: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(USER_ID_KEY, userId);
  },
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  },
  /**
   * Checks if the current session is valid (token exists and not expired).
   */
  hasValidSession(): boolean {
    const token = this.getAccessToken();
    return isTokenValid(token);
  },
  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
} as const;
