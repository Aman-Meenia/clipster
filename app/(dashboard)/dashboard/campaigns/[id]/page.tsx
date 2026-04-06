"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Users,
  TrendingUp,
  Video,
  Calendar,
  Film,
  Loader2,
  Image as ImageIcon,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from "lucide-react";

interface CampaignDetail {
  id: string;
  images: string[];
  name: string;
  description: string;
  totalBudget: number;
  supportedPlatforms: string[];
  maxSubmissionsPerAccount: number;
  feePerCreator: number;
  maxEarningPerPostPerCreator: number;
  createdAt: string;
  updatedAt: string;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // Submission modal state
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const res = await fetch(`/api/user/campaigns/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error?.message ?? "Campaign not found");
          return;
        }

        setCampaign(data.data);
      } catch {
        setError("Failed to load campaign");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaign();
  }, [id]);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!videoLink.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/user/campaigns/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoLink: videoLink.trim() }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        showToast(data.error?.message ?? "Submission failed.", false);
      } else {
        showToast("Submission sent successfully!", true);
        setVideoLink("");
        setIsSubmitOpen(false);
      }
    } catch {
      showToast("Network error. Please try again.", false);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0C10]">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#0B0C10] text-white gap-4">
        <Film className="w-12 h-12 text-white/10" />
        <p className="text-white/60">{error ?? "Campaign not found"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white">
      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-60 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-2xl text-sm font-medium animate-fade-in-up ${
            toast.ok
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          {toast.ok ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Back button ── */}
      <div className="sticky top-0 z-10 bg-[#0B0C10]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Campaigns
          </button>

          <button
            onClick={() => setIsSubmitOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            Submit Video
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* ── Hero image ── */}
        <div className="relative rounded-2xl overflow-hidden bg-[#14161F] border border-white/5">
          {campaign.images.length > 0 ? (
            <>
              <div className="relative h-[360px] md:h-[420px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={campaign.images[activeImage]}
                  alt={campaign.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-[#0B0C10] to-transparent" />
              </div>

              {/* Thumbnail strip */}
              {campaign.images.length > 1 && (
                <div className="flex gap-2 p-4 pt-0 -mt-16 relative z-10 overflow-x-auto">
                  {campaign.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        i === activeImage
                          ? "border-red-500 shadow-lg shadow-red-500/20"
                          : "border-white/10 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="h-[200px] flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-white/10" />
            </div>
          )}
        </div>

        {/* ── Campaign title + meta ── */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>

          {/* Platform badges */}
          <div className="flex flex-wrap gap-2">
            {campaign.supportedPlatforms.map((p) => (
              <span
                key={p}
                className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-red-600/20 text-red-400 rounded-lg border border-red-600/20"
              >
                {p}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Created{" "}
              {new Date(campaign.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* ── Stats grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={DollarSign}
            label="Total Budget"
            value={`$${campaign.totalBudget.toLocaleString()}`}
            color="text-emerald-400"
            bg="bg-emerald-500/10"
          />
          <StatCard
            icon={Users}
            label="Fee / Creator"
            value={`$${campaign.feePerCreator.toLocaleString()}`}
            color="text-violet-400"
            bg="bg-violet-500/10"
          />
          <StatCard
            icon={TrendingUp}
            label="Max / Post"
            value={`$${campaign.maxEarningPerPostPerCreator.toLocaleString()}`}
            color="text-red-400"
            bg="bg-red-500/10"
          />
          <StatCard
            icon={Video}
            label="Max Submissions"
            value={campaign.maxSubmissionsPerAccount.toString()}
            color="text-cyan-400"
            bg="bg-cyan-500/10"
          />
        </div>

        {/* ── Description ── */}
        <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6 space-y-3">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            About this Campaign
          </h2>
          <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
            {campaign.description}
          </p>
        </div>

        {/* ── Submit CTA at bottom ── */}
        <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold mb-1">Ready to participate?</h3>
            <p className="text-sm text-white/40">
              Submit your video link to earn up to ${campaign.maxEarningPerPostPerCreator.toLocaleString()} per post
            </p>
          </div>
          <button
            onClick={() => setIsSubmitOpen(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-red-600/20 transition-all hover:scale-[1.02] shrink-0"
          >
            <Send className="w-4 h-4" />
            Submit Video
          </button>
        </div>
      </div>

      {/* ── Submit Video Modal ── */}
      {isSubmitOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#12102a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                <h3 className="text-base font-bold text-white">Submit Video</h3>
              </div>
              <button
                onClick={() => setIsSubmitOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <p className="text-sm text-white/50 mb-4">
                  Paste a link to your video for{" "}
                  <span className="text-white font-medium">{campaign.name}</span>.
                  You can submit up to{" "}
                  <span className="text-white font-medium">
                    {campaign.maxSubmissionsPerAccount}
                  </span>{" "}
                  videos for this campaign.
                </p>

                <label className="text-sm font-medium text-white/70 mb-1.5 block">
                  Video URL
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="url"
                    required
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubmitOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold shadow-lg shadow-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ──

function StatCard({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="bg-[#14161F] border border-white/5 rounded-2xl p-5 space-y-3">
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-[11px] text-white/40 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}
