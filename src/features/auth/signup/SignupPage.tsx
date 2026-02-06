import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, Check, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupFormSchema, type SignupFormValues } from "../api/schemas";
import { signup } from "../api/client";

type PageState = "form" | "loading" | "success" | "error";

export function SignupPage() {
  const [pageState, setPageState] = useState<PageState>("form");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [correlationId, setCorrelationId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const copyCorrelationId = async () => {
    if (!correlationId) return;
    try {
      await navigator.clipboard.writeText(correlationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    setPageState("loading");
    setErrorMessage("");
    setCorrelationId("");

    const result = await signup({
      email: values.email,
      password: values.password,
      name: values.name?.trim() || undefined,
    });

    if (result.ok) {
      setPageState("success");
    } else {
      setErrorMessage(result.error);
      setCorrelationId(result.correlationId);
      setPageState("error");
    }
  };

  if (pageState === "success") {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-6" data-testid="signup-success">
        <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="size-6 text-primary" aria-hidden />
            </div>
            <h1 className="text-xl font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              If an account was created, we&apos;ve sent a verification link to your email.
              Please check your inbox and follow the instructions to confirm your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-4 sm:p-6" data-testid="signup-form">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-6 text-xl font-semibold">Create an account</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="signup-form-element">
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Must be 8–128 characters.
            </p>
          </div>

          {pageState === "error" && errorMessage && (
            <div
              className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive"
              role="alert"
            >
              <p>{errorMessage}</p>
              {correlationId && (
                <div className="mt-2 flex items-center gap-2">
                  <code className="flex-1 truncate rounded bg-muted px-2 py-1 text-xs">
                    {correlationId}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={copyCorrelationId}
                    aria-label="Copy correlation ID"
                  >
                    {copied ? (
                      <Check className="size-3" aria-hidden />
                    ) : (
                      <Copy className="size-3" aria-hidden />
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={pageState === "loading"}
            data-testid="signup-submit"
          >
            {pageState === "loading" ? "Creating account…" : "Sign up"}
          </Button>
        </form>
      </div>
    </div>
  );
}
