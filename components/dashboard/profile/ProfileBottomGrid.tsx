"use client";

import { User, Copy, Wallet, Trash2 } from "lucide-react";
import PhoneNumberCard from "@/components/dashboard/profile/PhoneNumberCard";

interface ProfileBottomGridProps {
  user: {
    username: string;
    email: string;
    phoneNumber?: string | null;
  };
}

export default function ProfileBottomGrid({ user }: ProfileBottomGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <PhoneNumberCard phoneNumber={user.phoneNumber} />
      <PaymentMethodsCard />
      <LoginMethodsCard email={user.email} />
      <UsernameCard username={user.username} />
    </div>
  );
}

/* ── Payment Methods ── */
function PaymentMethodsCard() {
  return (
    <div className="bg-[#14161F] border border-white/5 rounded-2xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">
        Payment Methods
      </h3>
      <div className="border border-dashed border-white/10 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center text-center h-[180px] sm:h-[200px]">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
          <Wallet className="w-6 h-6" />
        </div>
        <p className="text-white font-medium mb-1 text-sm sm:text-base">
          No payment method added
        </p>
        <p className="text-xs sm:text-sm text-white/40">
          Add a payment method to receive earnings
        </p>
      </div>
    </div>
  );
}

/* ── Login Methods ── */
function LoginMethodsCard({ email }: { email: string }) {
  return (
    <div className="bg-[#14161F] border border-white/5 rounded-2xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">
        Login Methods
      </h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-white/50">Email</p>
            <p className="text-sm text-white font-medium truncate">{email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 group">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <span className="font-bold text-sm sm:text-base">G</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-medium">Google</p>
          </div>
          <button className="text-white/20 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Username ── */
function UsernameCard({ username }: { username: string }) {
  return (
    <div className="bg-[#14161F] border border-white/5 rounded-2xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-white mb-4 sm:mb-6">
        Username
      </h3>
      <div className="flex items-center bg-[#0B0C10] border border-white/5 rounded-xl px-3 sm:px-4 py-3 mb-4">
        <span className="text-amber-500 mr-2 sm:mr-3 shrink-0">🔒</span>
        <input
          type="text"
          readOnly
          value={username}
          className="bg-transparent border-none outline-none text-white text-sm w-full"
        />
        <button className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors shrink-0">
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Copy</span>
        </button>
      </div>
      <p className="text-xs text-white/40 leading-relaxed">
        ℹ️ Your username cannot be changed once set. It is used for your referral
        link and profile URL.
      </p>
    </div>
  );
}
