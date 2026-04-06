// ─── Admin Dashboard constants ───────────────────────────────────────────────

export const PLATFORMS = [
  "INSTAGRAM",
  "YOUTUBE",
  "TIKTOK",
  "TWITTER",
  "FACEBOOK",
] as const;

export type PlatformKey = (typeof PLATFORMS)[number];

export const PLATFORM_COLORS: Record<string, string> = {
  INSTAGRAM:
    "from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30",
  YOUTUBE: "from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30",
  TIKTOK:
    "from-slate-500/20 to-gray-500/20 text-slate-300 border-slate-500/30",
  TWITTER: "from-sky-500/20 to-blue-500/20 text-sky-300 border-sky-500/30",
  FACEBOOK:
    "from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30",
};

/** Reusable Tailwind class string for text inputs / textareas. */
export const inputCls =
  "w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all focus:bg-white/[0.09] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20";
