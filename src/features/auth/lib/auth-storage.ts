const ACCESS_TOKEN_KEY = "smartstore_access_token";
const USER_ID_KEY = "smartstore_user_id";

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
  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
} as const;
