"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import {
  signupStepOneSchema,
  verifyOtpSchema,
  signupSchema,
} from "@/types/auth";
import {
  Film,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
  Phone,
  Mail,
  Lock,
  Smartphone,
  Copy,
  CheckCheck,
} from "lucide-react";

type StepOneErrors = Partial<Record<"email" | "phoneNumber", string>>;
type StepTwoErrors = { otp?: string };
type StepThreeErrors = { password?: string };

const OTP_LENGTH = 6;

export default function SignupPage() {
  const router = useRouter();

  // Step state: 1 = email+phone, 2 = OTP, 3 = password
  const [step, setStep] = useState(1);

  // Form data persisted across steps
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [stepOneErrors, setStepOneErrors] = useState<StepOneErrors>({});
  const [stepTwoErrors, setStepTwoErrors] = useState<StepTwoErrors>({});
  const [stepThreeErrors, setStepThreeErrors] = useState<StepThreeErrors>({});

  // OTP display state (mocked — OTP returned from API)
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpCopied, setOtpCopied] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ─── Step 1: Submit email + phone, request OTP ───────────────

  async function handleStepOne(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const result = signupStepOneSchema.safeParse({ email, phoneNumber });
    if (!result.success) {
      const errs: StepOneErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof StepOneErrors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setStepOneErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.error?.message ?? "Failed to send OTP. Please try again."
        );
        return;
      }

      // Store the returned OTP for display (mock/dev mode)
      setGeneratedOtp(data.data?.otp ?? null);
      setStep(2);
      // Focus first OTP box after transition
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Step 2: Verify OTP ─────────────────────────────────────

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setStepTwoErrors({});

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtp(next);
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[focusIndex]?.focus();
  }

  async function handleStepTwo(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const code = otp.join("");
    const result = verifyOtpSchema.safeParse({ phoneNumber, otp: code });
    if (!result.success) {
      setStepTwoErrors({ otp: result.error.issues[0].message });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.error?.message ?? "OTP verification failed. Please try again."
        );
        return;
      }

      setStep(3);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ─── Step 3: Create password ─────────────────────────────────

  async function handleStepThree(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const result = signupSchema.safeParse({ email, phoneNumber, password });
    if (!result.success) {
      const errs: StepThreeErrors = {};
      for (const issue of result.error.issues) {
        if (issue.path[0] === "password" && !errs.password) {
          errs.password = issue.message;
        }
      }
      setStepThreeErrors(errs);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phoneNumber, password }),
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

  async function handleCopyOtp() {
    if (generatedOtp) {
      await navigator.clipboard.writeText(generatedOtp);
      setOtpCopied(true);
      setTimeout(() => setOtpCopied(false), 2000);
    }
  }

  // Password strength
  const pwd = password;
  const checks = {
    length: pwd.length >= 8,
    upper: /[A-Z]/.test(pwd),
    lower: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
  };
  const strength = Object.values(checks).filter(Boolean).length;
  const otpFilled = otp.every((d) => d !== "");

  const steps = [
    { label: "Contact Info", icon: Mail },
    { label: "Verify Phone", icon: Smartphone },
    { label: "Set Password", icon: Lock },
  ];

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

          <h1 className="text-4xl font-extrabold text-white text-center leading-tight">
            Create your <span className="gradient-text">account.</span>
          </h1>
          <p className="mt-3 text-white/50 text-sm text-center">
            Join 60K+ creators earning from their content.
          </p>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center gap-0 mb-8">
          {steps.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            const Icon = s.icon;

            return (
              <div key={s.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-br from-cosmic-violet to-cosmic-blue border-cosmic-violet/50"
                        : isActive
                        ? "border-cosmic-violet/60 bg-cosmic-violet/20"
                        : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-cosmic-purple" : "text-white/30"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-medium transition-colors ${
                      isActive || isCompleted
                        ? "text-white/70"
                        : "text-white/25"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-16 h-[2px] mx-2 mb-5 rounded-full transition-all duration-300 ${
                      step > stepNum
                        ? "bg-gradient-to-r from-cosmic-violet to-cosmic-blue"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 space-y-5">
          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          {/* ══════ Step 1: Email + Phone ══════ */}
          {step === 1 && (
            <form onSubmit={handleStepOne} noValidate className="space-y-5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-white/70"
                  htmlFor="email"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (stepOneErrors.email)
                      setStepOneErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="you@example.com"
                  className={`w-full rounded-xl bg-white/[0.07] border px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/[0.1] focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                    stepOneErrors.email
                      ? "border-red-500/50"
                      : "border-white/10"
                  }`}
                />
                {stepOneErrors.email && (
                  <p className="text-xs text-red-400 mt-1">
                    {stepOneErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-white/70"
                  htmlFor="phone"
                >
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (stepOneErrors.phoneNumber)
                        setStepOneErrors((p) => ({
                          ...p,
                          phoneNumber: undefined,
                        }));
                    }}
                    placeholder="+91XXXXXXXXXX"
                    className={`w-full rounded-xl bg-white/[0.07] border pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/[0.1] focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                      stepOneErrors.phoneNumber
                        ? "border-red-500/50"
                        : "border-white/10"
                    }`}
                  />
                </div>
                {stepOneErrors.phoneNumber && (
                  <p className="text-xs text-red-400 mt-1">
                    {stepOneErrors.phoneNumber}
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
                    Send OTP
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ══════ Step 2: Verify OTP ══════ */}
          {step === 2 && (
            <form onSubmit={handleStepTwo} noValidate className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-sm text-white/50">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-white/80 font-medium">
                    {phoneNumber}
                  </span>
                </p>
              </div>

              {/* Dev OTP Display */}
              {generatedOtp && (
                <div className="rounded-xl border border-cosmic-cyan/30 bg-cosmic-cyan/5 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-cosmic-cyan/60 font-semibold mb-0.5">
                      Dev Mode — Your OTP
                    </p>
                    <p className="text-lg font-bold tracking-[0.3em] text-cosmic-cyan">
                      {generatedOtp}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyOtp}
                    className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                  >
                    {otpCopied ? (
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                </div>
              )}

              {/* OTP Boxes */}
              <div className="space-y-2">
                <div
                  className="flex justify-center gap-2"
                  onPaste={handleOtpPaste}
                >
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      aria-label={`Digit ${i + 1}`}
                      className={`w-11 h-14 rounded-xl text-center text-xl font-bold text-white bg-white/[0.07] border outline-none transition-all focus:bg-white/[0.12] focus:border-cosmic-violet/70 focus:ring-2 focus:ring-cosmic-violet/25 caret-cosmic-violet ${
                        stepTwoErrors.otp
                          ? "border-red-500/50 bg-red-500/5"
                          : otp[i]
                          ? "border-cosmic-violet/40"
                          : "border-white/10"
                      }`}
                    />
                  ))}
                </div>
                {stepTwoErrors.otp && (
                  <p className="text-xs text-red-400 text-center">
                    {stepTwoErrors.otp}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setServerError(null);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !otpFilled}
                  className="group flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Verify
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ══════ Step 3: Create Password ══════ */}
          {step === 3 && (
            <form onSubmit={handleStepThree} noValidate className="space-y-5">
              <div className="text-center space-y-1">
                <p className="text-sm text-white/50">
                  Phone verified! Now create a strong password.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-sm font-medium text-white/70"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (stepThreeErrors.password)
                        setStepThreeErrors({});
                    }}
                    placeholder="Min. 8 characters"
                    className={`w-full rounded-xl bg-white/[0.07] border px-4 py-3 pr-12 text-sm text-white placeholder-white/30 outline-none transition-all focus:bg-white/[0.1] focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                      stepThreeErrors.password
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
                {stepThreeErrors.password && (
                  <p className="text-xs text-red-400 mt-1">
                    {stepThreeErrors.password}
                  </p>
                )}

                {/* Strength indicator */}
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

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                    setServerError(null);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm font-medium text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
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
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/30">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cosmic-purple hover:text-white transition-colors underline underline-offset-2"
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
