"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Video,
  ExternalLink,
  Loader2,
  Mail,
  Calendar,
} from "lucide-react";
import type { Submission } from "@/components/admin/types";

const LIMIT = 20;

interface CampaignInfo {
  id: string;
  name: string;
  images: string[];
}

/**
 * /admin/dashboard/campaigns/[id]/submissions
 * Submissions table for a specific campaign.
 * Sidebar is provided by layout.tsx.
 */
export default function CampaignSubmissionsPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [campaign, setCampaign] = useState<CampaignInfo | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(
    async (p: number) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/admin/campaigns/${campaignId}/submissions?page=${p}&limit=${LIMIT}`
        );
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.data.submissions);
          setTotal(data.data.total);
          if (data.data.campaign) {
            setCampaign(data.data.campaign);
          }
        }
      } finally {
        setIsLoading(false);
      }
    },
    [campaignId]
  );

  useEffect(() => {
    load(page);
  }, [page, load]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="h-full">
      {/* Header bar */}
      <div className="sticky top-0 z-10 bg-[#060510]/80 backdrop-blur-xl border-b border-white/5">
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Campaigns
            </button>

            <div className="h-5 w-px bg-white/10" />

            <div className="flex items-center gap-3">
              {campaign?.images?.[0] && (
                <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={campaign.images[0]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-base font-bold text-white leading-tight">
                  Submissions
                </h1>
                {campaign && (
                  <p className="text-xs text-white/30 truncate max-w-[300px]">
                    {campaign.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/50 font-medium">
            {total} total
          </span>
        </div>
      </div>

      {/* Table content */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="w-7 h-7 text-violet-400 animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Video className="w-12 h-12 text-white/10 mb-4" />
            <p className="text-white font-medium mb-1">No submissions yet</p>
            <p className="text-sm text-white/40">
              Users haven&apos;t submitted video links for this campaign.
            </p>
          </div>
        ) : (
          <>
            <div className="bg-[#0c0a1e] border border-white/5 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium w-14">#</th>
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Phone</th>
                      <th className="px-6 py-4 font-medium">Video Link</th>
                      <th className="px-6 py-4 font-medium text-right">
                        Submitted
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {submissions.map((s, i) => (
                      <tr
                        key={s.id}
                        className="hover:bg-white/[0.02] transition-colors"
                      >
                        <td className="px-6 py-4 text-white/25 font-mono text-xs">
                          {(page - 1) * LIMIT + i + 1}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                              {s.user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-white font-medium truncate max-w-[160px]">
                              @{s.user.username}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-white/50">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {s.user.email}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-white/40 text-xs">
                          {s.user.phoneNumber ?? "—"}
                        </td>

                        <td className="px-6 py-4">
                          <a
                            href={s.videoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 hover:text-violet-200 text-xs font-medium transition-all max-w-[260px] truncate"
                            title={s.videoLink}
                          >
                            <ExternalLink className="w-3 h-3 shrink-0" />
                            <span className="truncate">{s.videoLink}</span>
                          </a>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center gap-1.5 justify-end text-white/30 text-xs">
                            <Calendar className="w-3 h-3" />
                            {new Date(s.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-white/40">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-white/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
