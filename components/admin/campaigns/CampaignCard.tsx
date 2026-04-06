import { DollarSign, TrendingUp, Pencil, Trash2, Video, Image as ImageIcon } from "lucide-react";
import type { Campaign } from "@/components/admin/types";
import { PLATFORM_COLORS } from "@/components/admin/constants";

interface StatChipProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}

function StatChip({ icon: Icon, label, value, color }: StatChipProps) {
  return (
    <div className="bg-white/[0.04] rounded-xl p-3 border border-white/5">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3 h-3 ${color}`} />
        <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
      </div>
      <p className={`text-sm font-bold ${color}`}>{value}</p>
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onViewSubmissions: () => void;
}

/**
 * Card shown in the campaign grid.
 * Displays first image, supported platforms, key budget stats
 * and action buttons (submissions, edit, delete).
 */
export default function CampaignCard({
  campaign: c,
  onEdit,
  onDelete,
  onViewSubmissions,
}: CampaignCardProps) {
  return (
    <div className="group relative bg-[#0f0d24] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 flex flex-col">
      {/* ── Image strip ── */}
      <div className="relative h-44 bg-[#0a0818] overflow-hidden shrink-0">
        {c.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.images[0]}
            alt={c.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-10 h-10 text-white/10" />
          </div>
        )}

        {/* fade-to-card at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#0f0d24] to-transparent" />

        {/* Extra-image count */}
        {c.images.length > 1 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] text-white/70 border border-white/10">
            +{c.images.length - 1} more
          </span>
        )}

        {/* Platform badges */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
          {c.supportedPlatforms.slice(0, 3).map((p) => (
            <span
              key={p}
              className={`inline-flex items-center rounded-full border bg-linear-to-r px-2 py-0.5 text-[10px] font-semibold ${
                PLATFORM_COLORS[p] ?? "text-white/50 border-white/10"
              }`}
            >
              {p}
            </span>
          ))}
          {c.supportedPlatforms.length > 3 && (
            <span className="inline-flex items-center rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/40">
              +{c.supportedPlatforms.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-white text-base line-clamp-1 mb-1">{c.name}</h3>
        <p className="text-xs text-white/40 line-clamp-2 mb-4">{c.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
          <StatChip
            icon={DollarSign}
            label="Budget"
            value={`$${c.totalBudget.toLocaleString()}`}
            color="text-emerald-400"
          />
          <StatChip
            icon={TrendingUp}
            label="Fee / Creator"
            value={`$${c.feePerCreator.toLocaleString()}`}
            color="text-violet-400"
          />
        </div>

        {/* ── Action footer ── */}
        <div className="flex items-center gap-2 pt-4 border-t border-white/5">
          <button
            onClick={onViewSubmissions}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-medium transition-all"
          >
            <Video className="w-3.5 h-3.5" />
            Submissions
          </button>
          <button
            onClick={onEdit}
            title="Edit campaign"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 hover:text-violet-300 transition-all"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete campaign"
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
