"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signupSchema } from "@/types/auth";
import {
  Film,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Check,
} from "lucide-react";

type FormErrors = Partial<Record<"email" | "password", string>>;

export default function SignupPage() {
  const router = useRouter();

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Password strength
  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  const strength = Object.values(checks).filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setFormErrors({});

    // Validate
    const result = signupSchema.safeParse({ email, password });
    if (!result.success) {
      const errs: FormErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFormErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.error?.message ?? "Registration failed. Please try again."
        );
        return;
      }

      // Redirect to email verification notice page
      router.push(
        `/verify-email?email=${encodeURIComponent(email)}&pending=true`
      );
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.16),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.12),transparent_45%)]" />

      <div className="relative z-10 w-full max-w-lg px-5 py-10 sm:px-6 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Link
            href="/"
            className="flex items-center gap-2 mb-6 cursor-pointer"
            aria-label="Go to home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cosmic-violet to-cosmic-cyan flex items-center justify-center shadow-lg shadow-cosmic-violet/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-wide text-white">
              REELPEY
            </span>
          </Link>

          <span className="mb-3 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cosmic-cyan/90">
            Get Started
          </span>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Create your <span className="gradient-text">account.</span>
          </h1>
          <p className="mt-3 text-sm text-white/55">
            Join 60K+ creators earning from their content.
          </p>
        </div>

        <div className="rounded-[26px] bg-gradient-to-b from-white/22 via-white/8 to-white/[0.03] p-[1px] shadow-[0_20px_80px_rgba(124,58,237,0.1)]">
          {/* Card */}
          <div className="glass relative overflow-hidden rounded-[25px] px-6 py-7 sm:px-8">
            <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-cosmic-violet/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-8 h-52 w-52 rounded-full bg-cosmic-cyan/15 blur-3xl" />

            <form onSubmit={handleSubmit} noValidate className="relative space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60"
                htmlFor="signup-email"
              >
                Email address
              </label>
              <div
                className={`rounded-xl border bg-white/[0.06] transition-all focus-within:bg-white/[0.08] focus-within:ring-2 focus-within:ring-cosmic-violet/20 ${
                  formErrors.email
                    ? "border-red-500/50 focus-within:border-red-500/50"
                    : "border-white/12 focus-within:border-cosmic-violet/60"
                }`}
              >
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors((p) => ({ ...p, email: undefined }));
                    }
                    if (serverError) setServerError(null);
                  }}
                  placeholder="you@example.com"
                  className="h-12 w-full bg-transparent px-4 text-sm text-white placeholder-white/35 outline-none"
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-red-400 mt-1">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60"
                htmlFor="signup-password"
              >
                Password
              </label>
              <div
                className={`relative rounded-xl border bg-white/[0.06] transition-all focus-within:bg-white/[0.08] focus-within:ring-2 focus-within:ring-cosmic-violet/20 ${
                  formErrors.password
                    ? "border-red-500/50 focus-within:border-red-500/50"
                    : "border-white/12 focus-within:border-cosmic-violet/60"
                }`}
              >
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (formErrors.password) {
                      setFormErrors((p) => ({ ...p, password: undefined }));
                    }
                    if (serverError) setServerError(null);
                  }}
                  placeholder="Min. 8 characters"
                  className="h-12 w-full bg-transparent px-4 pr-12 text-sm text-white placeholder-white/35 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/75 transition-colors"
                  aria-label={
                    showPassword ? "Hide password value" : "Show password value"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs text-red-400 mt-1">
                  {formErrors.password}
                </p>
              )}

              {/* Strength indicator */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength
                            ? strength <= 1
                              ? "bg-red-500"
                              : strength <= 2
                              ? "bg-amber-500"
                              : strength <= 3
                              ? "bg-sky-400"
                              : "bg-emerald-400"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <ul className="grid grid-cols-1 gap-y-1 sm:grid-cols-2 sm:gap-x-4">
                    {(
                      [
                        [checks.length, "At least 8 characters"],
                        [checks.upper, "One uppercase letter"],
                        [checks.lower, "One lowercase letter"],
                        [checks.number, "One number"],
                      ] as [boolean, string][]
                    ).map(([ok, label]) => (
                      <li
                        key={label}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          ok ? "text-emerald-400" : "text-white/30"
                        }`}
                      >
                        <Check className="w-3 h-3 flex-shrink-0" />
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <p className="text-xs text-white/45">
              Your password must include uppercase, lowercase, number, and 8+
              characters.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="group mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet via-cosmic-purple to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {serverError && (
              <p
                className="pt-1 text-center text-sm text-red-300"
                role="alert"
                aria-live="polite"
              >
                {serverError}
              </p>
            )}
          </form>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/35">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cosmic-cyan hover:text-white transition-colors underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-white/20">
          By continuing, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-white/40 transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-white/40 transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
