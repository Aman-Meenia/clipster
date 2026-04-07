"use client";

import { useState } from "react";
import { createCampaignRequestSchema } from "@/types/campaign-request";
import { ZodError } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";

interface FieldErrors {
  [key: string]: string;
}

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  title: "",
  campaignGoals: "",
};

export default function CampaignRequestForm() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    // Client-side Zod validation
    try {
      createCampaignRequestSchema.parse(form);
    } catch (err) {
      if (err instanceof ZodError) {
        const fieldErrors: FieldErrors = {};
        for (const issue of err.issues) {
          const field = issue.path[0] as string;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        }
        setErrors(fieldErrors);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/campaign-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(
          data.error?.message || "Something went wrong. Please try again."
        );
        return;
      }

      setIsSuccess(true);
      setForm(initialForm);
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Request Submitted!
        </h3>
        <p className="text-white/50 text-sm max-w-xs mb-6">
          Our team will review your campaign request and get back to you within
          24 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  const inputCls =
    "w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:bg-white/[0.09] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20";
  const errorInputCls =
    "w-full rounded-xl bg-white/[0.06] border border-red-500/50 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:bg-white/[0.09] focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Full name<span className="text-red-400">*</span>
        </label>
        <input
          id="campaign-req-fullname"
          type="text"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Your full name"
          className={errors.fullName ? errorInputCls : inputCls}
        />
        {errors.fullName && (
          <p className="mt-1 text-xs text-red-400">{errors.fullName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Email<span className="text-red-400">*</span>
        </label>
        <input
          id="campaign-req-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@gmail.com"
          className={errors.email ? errorInputCls : inputCls}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Phone (optional) */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Phone number{" "}
          <span className="text-white/30 font-normal">(optional)</span>
        </label>
        <input
          id="campaign-req-phone"
          type="tel"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="+91 1234567890"
          className={errors.phoneNumber ? errorInputCls : inputCls}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-xs text-red-400">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Campaign title<span className="text-red-400">*</span>
        </label>
        <input
          id="campaign-req-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Your campaign name or title"
          className={errors.title ? errorInputCls : inputCls}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-400">{errors.title}</p>
        )}
      </div>

      {/* Campaign Goals */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1.5">
          Campaign goals & additional details
          <span className="text-red-400">*</span>
        </label>
        <textarea
          id="campaign-req-goals"
          name="campaignGoals"
          value={form.campaignGoals}
          onChange={handleChange}
          rows={3}
          placeholder="Tell us about your campaign goals, target audience, or any specific requirements"
          className={`${errors.campaignGoals ? errorInputCls : inputCls} resize-y min-h-[80px]`}
        />
        {errors.campaignGoals && (
          <p className="mt-1 text-xs text-red-400">{errors.campaignGoals}</p>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {serverError}
        </div>
      )}

      {/* Submit */}
      <button
        id="campaign-req-submit"
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-rose-500 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
}
