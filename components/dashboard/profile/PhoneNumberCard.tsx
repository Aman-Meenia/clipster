"use client";

import { useState } from "react";
import { Phone, Save, Loader2, CheckCircle2, X } from "lucide-react";

interface PhoneNumberCardProps {
  phoneNumber: string | null | undefined;
  onPhoneUpdated?: (phone: string | null) => void;
}

export default function PhoneNumberCard({
  phoneNumber: initialPhone,
  onPhoneUpdated,
}: PhoneNumberCardProps) {
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function validate(value: string): string | null {
    if (!value) return null; // optional
    if (value.length < 10) return "Phone number must be at least 10 digits";
    if (value.length > 15) return "Phone number is too long";
    if (!/^\+?[0-9]+$/.test(value))
      return "Phone number can only contain digits and an optional + prefix";
    return null;
  }

  async function handleSave() {
    setError(null);
    setSuccess(false);

    const validationError = validate(phone);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: phone || "" }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message ?? "Failed to update phone number.");
        return;
      }

      setSuccess(true);
      setIsEditing(false);
      onPhoneUpdated?.(data.data?.phoneNumber ?? null);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-[#14161F] border border-white/5 rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-white">
          Phone Number
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-medium text-cosmic-purple hover:text-white transition-colors"
          >
            {phone ? "Edit" : "Add"}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setError(null);
              }}
              placeholder="+91XXXXXXXXXX"
              className={`w-full rounded-xl bg-[#0B0C10] border pl-10 pr-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-cosmic-violet/60 focus:ring-2 focus:ring-cosmic-violet/20 ${
                error ? "border-red-500/50" : "border-white/10"
              }`}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cosmic-violet to-cosmic-blue px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cosmic-violet/20 transition-all hover:shadow-xl hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setPhone(initialPhone ?? "");
                setError(null);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-white/60 hover:bg-white/[0.06] hover:text-white/80 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>

          <p className="text-xs text-white/30 leading-relaxed">
            ℹ️ Phone number is optional. No verification required for now.
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cosmic-violet/10 flex items-center justify-center text-cosmic-violet shrink-0">
            <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white/50">Phone</p>
            <p className="text-sm text-white font-medium truncate">
              {phone || "Not added"}
            </p>
          </div>
          {success && (
            <div className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Saved</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
