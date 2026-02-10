import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

const marketplaceLogos = ["Amazon", "Flipkart", "Shopify", "eBay", "Etsy"]

export function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  })

  const onSubmit = () => {
    navigate("/onboarding/store-details")
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

          {/* Social Buttons */}
          <div className="space-y-3 mb-6">
            <button
              data-testid="signup-google-btn"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:shadow-md transition-all duration-200"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              data-testid="signup-amazon-btn"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:shadow-md transition-all duration-200"
            >
              <AmazonIcon />
              Continue with Amazon
            </button>
            <button
              data-testid="signup-facebook-btn"
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground shadow-sm hover:bg-muted hover:shadow-md transition-all duration-200"
            >
              <FacebookIcon />
              Continue with Facebook
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

            <Button
              type="submit"
              data-testid="signup-submit-btn"
              className="w-full h-10 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              Create account
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
