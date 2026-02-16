import { Navigate, Outlet } from "react-router-dom";
import { authStorage } from "@/features/auth/lib/auth-storage";

/**
 * Protects routes that should only be accessible when not logged in (e.g. login, signup).
 * If the user has a valid session, redirects to /dashboard.
 * Use as a layout route element wrapping guest-only routes.
 */
export function GuestOnly() {
  const hasValidSession = authStorage.hasValidSession();

  if (hasValidSession) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
