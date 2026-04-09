"use client";

import {
  Compass,
  Video,
  DollarSign,
  Eye,
  Link as LinkIcon,
} from "lucide-react";

export default function StatisticsCard() {
  return (
    <div className="bg-[#14161F] border border-white/5 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-2 text-white font-bold">
          <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
            <Compass className="w-4 h-4" />
          </div>
          Statistics
        </div>
        <button className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20 w-full sm:w-auto">
          <LinkIcon className="w-4 h-4" />
          Generate Referral Link
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatItem icon={Video} label="Total videos" value="0" />
        <StatItem icon={DollarSign} label="Money earned" value="$0" />
        <StatItem icon={Eye} label="Total views" value="0" />
      </div>
    </div>
  );
}

function StatItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#0B0C10] border border-white/5 rounded-xl p-4 sm:p-5 relative overflow-hidden group">
      <p className="text-sm text-white/50 mb-2">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold text-red-500">{value}</p>
      <Icon className="absolute right-4 bottom-4 w-10 h-10 sm:w-12 sm:h-12 text-red-500/5 group-hover:scale-110 transition-transform" />
    </div>
  );
}
