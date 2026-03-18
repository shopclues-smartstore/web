import { useState } from 'react';

import {
  Eye,
  EyeOff,
  Store,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  Link,
  useNavigate,
} from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getOAuthStartUrl,
  login,
  type OAuthProvider,
} from '@/features/auth';
import { authStorage } from '@/features/auth/lib/auth-storage';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
})

type LoginValues = z.infer<typeof loginSchema>

const GoogleIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const AmazonIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
    <path fill="#FF9900" d="M.045 18.02c.072-.116.187-.124.348-.024 3.78 2.214 7.932 3.322 12.457 3.322 3.15 0 6.377-.652 9.684-1.956.2-.078.33-.025.39.16.06.186-.022.33-.244.432-2.87 1.36-6.15 2.04-9.83 2.04-4.724 0-8.96-1.154-12.716-3.462-.097-.06-.137-.14-.089-.243z"/>
    <path fill="#FF9900" d="M20.33 17.39c-.184-.234-.98-.278-2.375-.132-1.394.146-2.598.44-3.614.884-.17.072-.146.17.07.293.625.35 1.26.52 1.904.52.97 0 2.12-.412 3.448-1.236.178-.108.263-.224.256-.346a.26.26 0 00-.039-.133l.35.15z"/>
    <path fill="#232F3E" d="M14.602 6.164C13.83 5.19 12.778 4.7 11.45 4.7c-1.627 0-2.857.64-3.687 1.92-.83 1.28-1.245 2.838-1.245 4.676 0 1.618.373 2.97 1.12 4.052.747 1.084 1.72 1.626 2.92 1.626 1.124 0 2.13-.39 3.017-1.17V17.1c0 1.41-.244 2.44-.73 3.086-.487.648-1.283.97-2.39.97-.656 0-1.27-.127-1.845-.382-.573-.254-.86-.607-.86-1.058 0-.17.053-.28.158-.33l1.17-.556c.136.51.382.897.74 1.16.358.264.76.396 1.204.396 1.29 0 1.935-.805 1.935-2.414V6.164z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

export function LoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const handleSocialLogin = async (provider: OAuthProvider) => {
    const result = await getOAuthStartUrl(provider);
    if (result.ok) {
      window.location.href = result.redirectUrl;
      return;
    }
    toast.error(result.error);
  };

  const onSubmit = async (values: LoginValues) => {
    setFormError(null);
    setIsSubmitting(true);
    const result = await login(values.email, values.password);
    setIsSubmitting(false);
    if (result.ok) {
      authStorage.setSession(result.accessToken, result.userId);
      navigate("/dashboard", { replace: true });
      return;
    }
    setFormError(result.error);
  };

  return (
    <div
      className="min-h-screen bg-background flex items-center justify-center p-6"
      data-testid="login-page"
    >
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
            <Store className="size-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            SmartStore
          </span>
        </div>

        {/* Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
          <h1
            className="font-heading text-2xl font-bold tracking-tight text-center text-foreground mb-1"
            data-testid="login-title"
          >
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Sign in to your SmartStore account
          </p>

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              data-testid="login-google-btn"
              onClick={() => handleSocialLogin("google")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:shadow-sm transition-all duration-200"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                data-testid="login-amazon-btn"
                onClick={() => toast.info("Amazon login is not available yet.")}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:shadow-sm transition-all duration-200"
              >
                <AmazonIcon />
                Amazon
              </button>
              <button
                type="button"
                data-testid="login-facebook-btn"
                onClick={() => handleSocialLogin("meta")}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted hover:shadow-sm transition-all duration-200"
              >
                <FacebookIcon />
                Facebook
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-muted-foreground font-medium">
                Or
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            data-testid="login-form"
          >
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                data-testid="login-email-input"
                aria-invalid={!!errors.email}
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <Link
                  to="/forgot-password"
                  data-testid="forgot-password-link"
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  data-testid="login-password-input"
                  aria-invalid={!!errors.password}
                  className="h-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  data-testid="login-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                data-testid="login-remember-checkbox"
                className="size-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
                {...register("rememberMe")}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              data-testid="login-submit-btn"
              disabled={isSubmitting}
              className="w-full h-10 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            data-testid="login-signup-link"
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Create a new account
          </Link>
        </p>
      </div>
    </div>
  );
}
