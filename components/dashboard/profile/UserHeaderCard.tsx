"use client";

import { User } from "lucide-react";

interface UserHeaderCardProps {
  user: {
    username: string;
    email: string;
    memberSince: string;
  };
}

export default function UserHeaderCard({ user }: UserHeaderCardProps) {
  return (
    <div className="bg-[#14161F] border border-white/5 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-600 flex items-center justify-center text-xl sm:text-2xl font-bold text-white shrink-0">
        {user.username.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 flex-wrap">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">
            {user.username}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-medium text-white/70">
            User
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white/50">
          Member since: {user.memberSince}
        </p>
        <p className="text-xs sm:text-sm text-white/50 truncate">
          Email: {user.email}
        </p>
      </div>
    </div>
  );
}
