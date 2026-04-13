"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { resetPasswordSchema } from "@/types/auth";
import {
  Film,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Check,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirm?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password strength checks
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
    setErrors({});

    // Check passwords match
    if (password !== confirmPassword) {
      setErrors({ confirm: "Passwords do not match" });
      return;
    }

    // Validate password strength
    const result = resetPasswordSchema.safeParse({ token, password });
    if (!result.success) {
      const errs: typeof errors = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "password" && !errs.password) {
          errs.password = issue.message;
        }
      }
      setErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.error?.message ?? "Reset failed. Please try again."
        );
        return;
      }

      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => router.push("/login"), 3000);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // No token provided
  if (!token) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />

        <div className="relative z-10 w-full max-w-md px-6 py-12 animate-fade-in-up">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cosmic-violet to-cosmic-cyan flex items-center justify-center shadow-lg shadow-cosmic-violet/30">
                <Film className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-wide text-white">
                REELPEY
              </span>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Invalid link</h2>
            <p className="text-sm text-white/50">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] mt-4"
            >
              Request New Link
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>
    );
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

      <div className="relative z-10 w-full max-w-md px-6 py-12 animate-fade-in-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cosmic-violet to-cosmic-cyan flex items-center justify-center shadow-lg shadow-cosmic-violet/30">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-wide text-white">
              REELPEY
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-white text-center leading-tight">
            New <span className="gradient-text">password.</span>
          </h1>
          <p className="mt-3 text-white/50 text-sm text-center">
            Choose a strong password for your account.
          </p>
        </div>

        <div className="glass rounded-2xl p-8 space-y-5">
          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Password <span className="gradient-text">updated!</span>
              </h2>
              <p className="text-sm text-white/50">
                Redirecting to login…
              </p>
            </div>
          ) : (
            <>
              {serverError && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* New Password */}
                <div className="space-y-1.5">
                  <label
                    className="text-sm font-medium text-white/70"
                    htmlFor="password"
                  >
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password)
                          setErrors((p) => ({ ...p, password: undefined }));
                      }}
                      placeholder="Min. 8 characters"
                      className={`w-full rounded-xl bg-white/[0.07] border px-4 py-3 pr-12 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/[0.1] focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                        errors.password
                          ? "border-red-500/50"
                          : "border-white/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.password}
                    </p>
                  )}

                  {/* Strength */}
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
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
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

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label
                    className="text-sm font-medium text-white/70"
                    htmlFor="confirmPassword"
                  >
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirm)
                          setErrors((p) => ({ ...p, confirm: undefined }));
                      }}
                      placeholder="Re-enter password"
                      className={`w-full rounded-xl bg-white/[0.07] border px-4 py-3 pr-12 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/[0.1] focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                        errors.confirm
                          ? "border-red-500/50"
                          : "border-white/10"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirm && (
                    <p className="text-xs text-red-400 mt-1">
                      {errors.confirm}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-white/30">
          <Link
            href="/login"
            className="text-cosmic-purple hover:text-white transition-colors underline underline-offset-2"
          >
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordContent />
    </Suspense>
  );
}
