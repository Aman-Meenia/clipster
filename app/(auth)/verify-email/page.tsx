"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { verifyEmailSchema } from "@/types/auth";
import { Film, Loader2, ArrowLeft, RefreshCw } from "lucide-react";

const RESEND_COOLDOWN = 60; // seconds
const OTP_LENGTH = 6;

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  function handleOtpChange(index: number, value: string) {
    // Accept only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError(null);

    // Auto-advance
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const next = [...otp];
        next[index] = "";
        setOtp(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtp(next);
    // Focus the next empty or last box
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const code = otp.join("");
    const result = verifyEmailSchema.safeParse({ otp: code });
    if (!result.success) {
      setOtpError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message ?? "Verification failed. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (resendCountdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendCountdown(RESEND_COOLDOWN);
      setOtp(Array(OTP_LENGTH).fill(""));
      setOtpError(null);
      setServerError(null);
      inputRefs.current[0]?.focus();
    } catch {
      setServerError("Could not resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  const filled = otp.every((d) => d !== "");

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
            Enter verification{" "}
            <span className="gradient-text">code.</span>
          </h1>
          <p className="mt-3 text-white/50 text-sm text-center max-w-xs">
            We sent a 6-digit code to{" "}
            <span className="text-white/80 font-medium">{email || "your email"}</span>.
            It expires in 10 minutes.
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 space-y-6">
          {serverError && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            {/* OTP boxes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70 block text-center">
                Verification code
              </label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    className={`w-11 h-14 rounded-xl text-center text-xl font-bold text-white bg-white/[0.07] border outline-none transition-all focus:bg-white/[0.12] focus:border-cosmic-violet/70 focus:ring-2 focus:ring-cosmic-violet/25 caret-cosmic-violet ${
                      otpError
                        ? "border-red-500/50 bg-red-500/5"
                        : otp[i]
                        ? "border-cosmic-violet/40"
                        : "border-white/10"
                    }`}
                  />
                ))}
              </div>
              {otpError && (
                <p className="text-xs text-red-400 text-center">{otpError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !filled}
              className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:shadow-cosmic-violet/30 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify Code"
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="flex items-center justify-between text-sm">
            <Link
              href="/register"
              className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to email
            </Link>

            <button
              type="button"
              onClick={handleResend}
              disabled={resendCountdown > 0 || isResending}
              className="flex items-center gap-1.5 text-white/40 hover:text-cosmic-purple disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            >
              {isResending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              {resendCountdown > 0
                ? `Resend in ${resendCountdown}s`
                : "Resend code"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-white/20">
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

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
