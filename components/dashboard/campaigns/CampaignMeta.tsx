"use client";

import { Calendar } from "lucide-react";

interface CampaignMetaProps {
  name: string;
  supportedPlatforms: string[];
  createdAt: string;
}

export default function CampaignMeta({
  name,
  supportedPlatforms,
  createdAt,
}: CampaignMetaProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{name}</h1>

      {/* Platform badges */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {supportedPlatforms.map((p) => (
          <span
            key={p}
            className="px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-red-600/20 text-red-400 rounded-lg border border-red-600/20"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-white/40">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          Created{" "}
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
