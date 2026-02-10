import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Store, Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const forgotSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
})

type ForgotValues = z.infer<typeof forgotSchema>

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  const onSubmit = () => {
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6" data-testid="forgot-password-page">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
            <Store className="size-5 text-primary-foreground" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">SmartStore</span>
        </div>

        {/* Card */}
        <div className="bg-white border border-border rounded-2xl shadow-sm p-8">
          {!sent ? (
            <>
              <h1
                className="font-heading text-2xl font-bold tracking-tight text-center text-foreground mb-1"
                data-testid="forgot-title"
              >
                Reset your password
              </h1>
              <p className="text-sm text-muted-foreground text-center mb-8">
                Enter your email and we'll send you reset instructions.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" data-testid="forgot-form">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email address</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    data-testid="forgot-email-input"
                    aria-invalid={!!errors.email}
                    className="h-10"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  data-testid="forgot-submit-btn"
                  className="w-full h-10 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                >
                  Send reset link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4" data-testid="forgot-success">
              <div className="mx-auto mb-4 size-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="size-7 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                Check your inbox
              </h2>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                We've sent password reset instructions to your email. 
                Please check your inbox and follow the link to reset your password.
              </p>
              <Button
                data-testid="forgot-back-to-login-btn"
                variant="outline"
                className="rounded-lg"
                asChild
              >
                <Link to="/login">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to sign in
                </Link>
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link
            to="/login"
            data-testid="forgot-login-link"
            className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="size-3" />
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
