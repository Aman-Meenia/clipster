"use client";

import type { CampaignRequestResponse } from "@/types/campaign-request";

const STATUS_BADGE: Record<string, string> = {
  PENDING:
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED:
    "bg-red-500/10 text-red-400 border-red-500/20",
};

interface CampaignRequestRowProps {
  request: CampaignRequestResponse;
  onClick: () => void;
}

export default function CampaignRequestRow({
  request,
  onClick,
}: CampaignRequestRowProps) {
  const date = new Date(request.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      onClick={onClick}
      className="w-full grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-4 items-center text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
    >
      {/* Name + Email */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {request.fullName}
        </p>
        <p className="text-xs text-white/35 truncate">{request.email}</p>
      </div>

      {/* Title */}
      <p className="text-sm text-white/60 truncate">{request.title}</p>

      {/* Phone */}
      <p className="text-sm text-white/45 truncate">
        {request.phoneNumber || "—"}
      </p>

      {/* Status badge */}
      <div>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_BADGE[request.status]}`}
        >
          {request.status.charAt(0) + request.status.slice(1).toLowerCase()}
        </span>
      </div>

      {/* Date */}
      <p className="text-xs text-white/35">{date}</p>
    </button>
  );
}
