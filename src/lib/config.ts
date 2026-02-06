/**
 * Client-side config. Uses Vite env vars (VITE_*).
 */
export const config = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
} as const;
