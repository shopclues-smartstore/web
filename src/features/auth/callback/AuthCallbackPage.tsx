import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authStorage } from "@/features/auth/lib/auth-storage";

/** Where to send the user after successful OAuth (matches OAUTH_FRONTEND_REDIRECT_URL usage). */
const APP_HOME = "/dashboard";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const userId = params.get("user_id");
    const error = params.get("error");

    if (error) {
      setErrorMessage(decodeURIComponent(error));
      setStatus("error");
      return;
    }

    if (accessToken && userId) {
      authStorage.setSession(accessToken, userId);
      setStatus("success");
      navigate(APP_HOME, { replace: true });
      return;
    }

    setErrorMessage("Missing access token or user ID.");
    setStatus("error");
  }, [navigate]);

  if (status === "processing") {
    return (
      <div
        className="flex min-h-svh flex-col items-center justify-center p-4"
        data-testid="auth-callback-processing"
      >
        <div className="text-muted-foreground">Signing you in…</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        className="flex min-h-svh flex-col items-center justify-center p-4"
        data-testid="auth-callback-error"
      >
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
          <h1 className="mb-2 text-xl font-semibold text-destructive">
            Sign-in failed
          </h1>
          <p className="mb-4 text-sm text-muted-foreground">{errorMessage}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              Back to login
            </a>
            <a
              href="/signup"
              className="text-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
            >
              Back to sign up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
