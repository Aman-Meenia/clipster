"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { registerSchema, type RegisterInput } from "@/types/auth";
import { Film, Eye, EyeOff, Loader2, ArrowRight, Check } from "lucide-react";

type FieldErrors = Partial<Record<keyof RegisterInput, string>>;

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterInput>({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof RegisterInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    // Client-side Zod validation
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof RegisterInput;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message ?? "Registration failed. Please try again.");
        return;
      }

      // Redirect to email verification, passing email as query param
      router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // Password strength indicators
  const pwd = form.password;
  const checks = {
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
  };
  const strength = Object.values(checks).filter(Boolean).length;

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--background)]">
      {/* Aurora orbs */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />

      {/* Subtle grid */}
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
              CLIPSTER
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-white text-center leading-tight">
            Create your{" "}
            <span className="gradient-text">account.</span>
          </h1>
          <p className="mt-3 text-white/50 text-sm text-center">
            Join 60K+ creators earning from their content.
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 space-y-5">
          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={handleChange}
                placeholder="your_username"
                className={`w-full rounded-xl bg-white/[0.07] border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/[0.1] focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                  errors.username
                    ? "border-red-500/50"
                    : "border-white/10"
                }`}
              />
              {errors.username && (
                <p className="text-xs text-red-400 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full rounded-xl bg-white/[0.07] border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/[0.1] focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                  errors.email
                    ? "border-red-500/50"
                    : "border-white/10"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white/70" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
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
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}

              {/* Password strength */}
              {pwd.length > 0 && (
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-2"
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
          </form>
        </div>

        {/* Footer links */}
        <p className="mt-6 text-center text-xs text-white/30">
          Already have an account?{" "}
          <Link href="/login" className="text-cosmic-purple hover:text-white transition-colors underline underline-offset-2">
            Sign in
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-white/20">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-white/40 transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-white/40 transition-colors">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}
