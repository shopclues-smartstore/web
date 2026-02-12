import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "@/features/auth/lib/auth-storage";

/**
 * Protects routes that should only be accessible when not logged in (e.g. login, signup).
 * If the user is authenticated, redirects to /dashboard.
 * Use as a layout route element wrapping guest-only routes.
 */
export function GuestOnly() {
  const hasToken = !!authStorage.getAccessToken();

  if (hasToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
