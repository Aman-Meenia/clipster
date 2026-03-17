interface CampaignCardProps {
  name: string;
  budget: string;
  rate: string;
  budgetUsed: number;
  category: string;
}

export default function CampaignCard({
  name,
  budget,
  rate,
  budgetUsed,
  category,
}: CampaignCardProps) {
  const categoryColors: Record<string, string> = {
    UGC: "from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/20",
    EDITS: "from-violet-500/20 to-blue-500/20 text-violet-300 border-violet-500/20",
    CLIPPING: "from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/20",
    GAMING: "from-emerald-500/20 to-green-500/20 text-emerald-300 border-emerald-500/20",
    GAMBA: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/20",
    LIVESTREAM: "from-red-500/20 to-pink-500/20 text-red-300 border-red-500/20",
    GENERAL: "from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/20",
    SPORTS: "from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/20",
    GYM: "from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/20",
  };

  const colorClass =
    categoryColors[category] ||
    "from-gray-500/20 to-gray-500/20 text-gray-300 border-gray-500/20";

  return (
    <div className="glass-card group relative rounded-2xl p-5 cursor-pointer">
      {/* Glow effect on hover */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-br from-cosmic-violet/10 via-transparent to-cosmic-cyan/10" />

      <div className="relative z-10">
        {/* Category Badge */}
        <span
          className={`inline-flex items-center rounded-full border bg-gradient-to-r px-3 py-1 text-xs font-semibold ${colorClass}`}
        >
          {category}
        </span>

        {/* Campaign Name */}
        <h3 className="mt-3 text-lg font-bold text-white tracking-tight line-clamp-1">
          {name}
        </h3>

        {/* Stats Row */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider">
              Budget
            </p>
            <p className="mt-0.5 text-lg font-bold text-white tabular-nums">
              {budget}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-wider">
              Rate / 1M Views
            </p>
            <p className="mt-0.5 text-lg font-bold text-cosmic-cyan tabular-nums">
              {rate}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
            <span>Budget Used</span>
            <span className="font-semibold text-white/60 tabular-nums">
              {budgetUsed}%
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${budgetUsed}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
