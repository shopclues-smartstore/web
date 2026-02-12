import { useState } from 'react';

import {
  Chrome,
  Eye,
  EyeOff,
  Facebook,
  Mail,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  getOAuthStartUrl,
  type OAuthProvider,
  signup,
} from '@/features/auth';
import { zodResolver } from '@hookform/resolvers/zod';

const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(255),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type SignupValues = z.infer<typeof signupSchema>

const iconProps = { className: "size-5", ariaHidden: true }

const marketplaceLogos = ["Amazon", "Flipkart", "Shopify", "eBay", "Etsy"]

export function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [pageState, setPageState] = useState<"form" | "loading" | "success" | "error">("form")
  const [formError, setFormError] = useState<string | null>(null)
  const [oauthRedirecting, setOauthRedirecting] = useState<OAuthProvider | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  })

  const handleSocialSignup = async (provider: OAuthProvider) => {
    setOauthRedirecting(provider)
    const result = await getOAuthStartUrl(provider)
    if (result.ok) {
      window.location.href = result.redirectUrl
      return
    }
    setOauthRedirecting(null)
    toast.error(result.error)
  }

  const onSubmit = async (values: SignupValues) => {
    setFormError(null)
    setPageState("loading")
    const result = await signup({
      email: values.email,
      password: values.password,
      name: values.fullName?.trim() || undefined,
    })
    if (result.ok) {
      setPageState("success")
      return
    }
    setFormError(result.error)
    setPageState("error")
  }

  if (pageState === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center p-6" data-testid="signup-success">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="size-6 text-primary" aria-hidden />
            </div>
            <h1 className="font-heading text-xl font-semibold">Check your email</h1>
            <p className="text-sm text-muted-foreground">
              If an account was created, we&apos;ve sent a verification link to your email.
              Please check your inbox and follow the instructions to confirm your account.
            </p>
            <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" data-testid="signup-page">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Store className="size-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold">SmartStore</span>
          </div>

          <div className="space-y-6">
            <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight">
              Manage all your<br />
              marketplaces from<br />
              <span className="text-white/80">one dashboard.</span>
            </h1>
            <p className="text-lg text-white/70 max-w-md leading-relaxed">
              Sync products, track inventory, manage orders, and optimize pricing
              across every channel — all in one place.
            </p>
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold tabular-nums">10K+</p>
                <p className="text-sm text-white/60 mt-1">Active sellers</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold tabular-nums">50M+</p>
                <p className="text-sm text-white/60 mt-1">Products synced</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold tabular-nums">99.9%</p>
                <p className="text-sm text-white/60 mt-1">Uptime</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-white/50">Trusted by sellers across</p>
            <div className="flex items-center gap-4">
              {marketplaceLogos.map((name) => (
                <span
                  key={name}
                  className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-xs font-medium text-white/80"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="size-4 text-primary-foreground" />
            </div>
            <span className="font-heading text-lg font-bold">SmartStore</span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground" data-testid="signup-title">
            Create your SmartStore account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground mb-8">
            Manage all your marketplaces from one dashboard.
          </p>

          {/* Social Buttons - Google & Facebook */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              data-testid="signup-google-btn"
              onClick={() => handleSocialSignup("google")}
              disabled={!!oauthRedirecting}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
            >
              <Chrome {...iconProps} />
              {oauthRedirecting === "google" ? "Redirecting…" : "Continue with Google"}
            </button>
            <button
              type="button"
              data-testid="signup-facebook-btn"
              onClick={() => handleSocialSignup("meta")}
              disabled={!!oauthRedirecting}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none"
            >
              <Facebook {...iconProps} />
              {oauthRedirecting === "meta" ? "Redirecting…" : "Continue with Facebook"}
            </button>
            <button
              type="button"
              data-testid="signup-amazon-btn"
              onClick={() => toast.info("Amazon sign up is not available yet.")}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:shadow-md transition-all duration-200"
            >
              <ShoppingBag {...iconProps} />
              Continue with Amazon
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground font-medium">Or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="signup-form">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Doe"
                autoComplete="name"
                data-testid="signup-fullname-input"
                aria-invalid={!!errors.fullName}
                className="h-10"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive" role="alert">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                autoComplete="email"
                data-testid="signup-email-input"
                aria-invalid={!!errors.email}
                className="h-10"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  data-testid="signup-password-input"
                  aria-invalid={!!errors.password}
                  className="h-10 pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  data-testid="toggle-password-visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive" role="alert">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  data-testid="signup-confirm-password-input"
                  aria-invalid={!!errors.confirmPassword}
                  className="h-10 pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  data-testid="toggle-confirm-visibility"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive" role="alert">{errors.confirmPassword.message}</p>
            )}
            </div>

            {pageState === "error" && formError && (
              <p className="text-sm text-destructive" role="alert">{formError}</p>
            )}

            <Button
              type="submit"
              data-testid="signup-submit-btn"
              disabled={pageState === "loading"}
              className="w-full h-10 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              {pageState === "loading" ? "Creating account…" : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              data-testid="signup-login-link"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
