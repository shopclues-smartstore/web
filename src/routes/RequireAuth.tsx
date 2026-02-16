import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authStorage } from "@/features/auth/lib/auth-storage";

/**
 * Protects routes that require authentication.
 * If the user is not logged in or has an invalid/expired token, redirects to /login.
 * Use as a layout route element wrapping authenticated routes.
 */
export function RequireAuth() {
  const location = useLocation();
  const hasValidSession = authStorage.hasValidSession();

  if (!hasValidSession) {
    // Clear invalid session
    authStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
