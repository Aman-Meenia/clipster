"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginInput } from "@/types/auth";
import {
  Film,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type FieldErrors = Partial<Record<keyof LoginInput, string>>;

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, router]);

  const [form, setForm] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((current) => (current > 0 ? current - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
    if (unverifiedEmail) setUnverifiedEmail(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    // Client-side validation
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof LoginInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data?.error === "EMAIL_NOT_VERIFIED" && typeof data?.email === "string") {
          setUnverifiedEmail(data.email);
          setServerError(null);
          return;
        }

        setUnverifiedEmail(null);
        setServerError(
          data.error?.message ?? "Login failed. Please try again."
        );
        return;
      }

      // Save via context
      const authedUser = data.data?.user;
      if (authedUser) {
        setUnverifiedEmail(null);
        login(authedUser);

        // Redirect to admin page if user is ADMIN
        if (authedUser.role === "ADMIN") {
          router.push("/admin/dashboard");
          return;
        }
      }

      // Default redirect
      router.push("/dashboard");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResendVerification() {
    if (!unverifiedEmail || isResendingVerification || resendCooldown > 0) return;

    setIsResendingVerification(true);
    setResendCooldown(30);
    setServerError(null);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error?.message ?? "Unable to resend verification email.", false);
        return;
      }

      showToast("Verification email sent. Please check your inbox.", true);
    } catch {
      showToast("Network error. Please try again.", false);
    } finally {
      setIsResendingVerification(false);
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
      {toast && (
        <div
          className={`fixed right-5 top-5 z-50 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium shadow-2xl animate-fade-in-up ${
            toast.ok
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/30 bg-red-500/10 text-red-300"
          }`}
        >
          {toast.ok ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

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
            Creator Portal
          </span>
          <h1 className="text-4xl font-extrabold text-white leading-tight">
            Welcome <span className="gradient-text">back.</span>
          </h1>
          <p className="mt-3 text-sm text-white/55">
            Sign in to continue creating and earning.
          </p>
        </div>

        <div className="rounded-[26px] bg-gradient-to-b from-white/22 via-white/8 to-white/[0.03] p-[1px] shadow-[0_20px_80px_rgba(6,182,212,0.08)]">
          {/* Card */}
          <div className="glass relative overflow-hidden rounded-[25px] px-6 py-7 sm:px-8">
            <div className="pointer-events-none absolute -top-20 right-0 h-48 w-48 rounded-full bg-cosmic-violet/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-8 h-52 w-52 rounded-full bg-cosmic-cyan/15 blur-3xl" />

            <form onSubmit={handleSubmit} noValidate className="relative space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60"
                htmlFor="email"
              >
                Email address
              </label>
              <div
                className={`rounded-xl border bg-white/[0.06] transition-all focus-within:bg-white/[0.08] focus-within:ring-2 focus-within:ring-cosmic-violet/20 ${
                  errors.email
                    ? "border-red-500/50 focus-within:border-red-500/50"
                    : "border-white/12 focus-within:border-cosmic-violet/60"
                }`}
              >
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-12 w-full bg-transparent px-4 text-sm text-white placeholder-white/35 outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  className="text-xs font-semibold uppercase tracking-[0.1em] text-white/60"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-cosmic-cyan/90 hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div
                className={`relative rounded-xl border bg-white/[0.06] transition-all focus-within:bg-white/[0.08] focus-within:ring-2 focus-within:ring-cosmic-violet/20 ${
                  errors.password
                    ? "border-red-500/50 focus-within:border-red-500/50"
                    : "border-white/12 focus-within:border-cosmic-violet/60"
                }`}
              >
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            <p className="text-xs text-white/45">
              Use your registered email and password to access your dashboard.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet via-cosmic-purple to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {unverifiedEmail && (
              <div className="rounded-xl border border-amber-400/25 bg-amber-400/8 px-4 py-3 text-center">
                <p className="text-sm text-amber-100">
                  Your email is not verified yet. Please verify it before logging in.
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResendingVerification || resendCooldown > 0}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isResendingVerification ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3.5 w-3.5" />
                      {resendCooldown > 0
                        ? `Resend in ${resendCooldown}s`
                        : "Resend Email"}
                    </>
                  )}
                </button>
              </div>
            )}

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
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-cosmic-cyan hover:text-white transition-colors underline underline-offset-2"
          >
            Sign up
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
