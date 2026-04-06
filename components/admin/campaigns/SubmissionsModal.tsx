"use client";

import { useCallback, useEffect, useState } from "react";
import { X, Video, ExternalLink, Loader2, Mail, User, Calendar } from "lucide-react";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";
import type { Campaign, Submission } from "@/components/admin/types";

interface SubmissionsModalProps {
  campaign: Campaign;
  onClose: () => void;
}

const LIMIT = 10;

/**
 * Full-screen modal with a data table of all user submissions for a campaign.
 * Columns: #, User, Email, Video Link, Submitted At
 */
export default function SubmissionsModal({
  campaign,
  onClose,
}: SubmissionsModalProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(
    async (p: number) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/admin/campaigns/${campaign.id}/submissions?page=${p}&limit=${LIMIT}`
        );
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.data.submissions);
          setTotal(data.data.total);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [campaign.id]
  );

  useEffect(() => {
    load(page);
  }, [page, load]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fade-in-up">
      <div className="bg-[#12102a] border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-violet-400" />
              <h3 className="text-base font-bold text-white">Submissions</h3>
              <span className="px-2 py-0.5 rounded-full bg-white/[0.08] text-xs text-white/50">
                {total}
              </span>
            </div>
            <p className="text-xs text-white/30 mt-0.5 truncate max-w-sm">
              {campaign.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
          ) : submissions.length === 0 ? (
            <EmptyState
              icon={Video}
              title="No submissions yet"
              desc="Users haven't submitted video links for this campaign."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium w-12">#</th>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Video Link</th>
                    <th className="px-4 py-3 font-medium text-right">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.map((s, i) => (
                    <tr
                      key={s.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Row number */}
                      <td className="px-4 py-3.5 text-white/30 font-mono text-xs">
                        {(page - 1) * LIMIT + i + 1}
                      </td>

                      {/* User */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-500/30 to-cyan-500/30 flex items-center justify-center shrink-0 text-xs font-bold text-white">
                            {s.user.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-white font-medium truncate max-w-[150px]">
                            @{s.user.username}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-white/50">
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[200px]">{s.user.email}</span>
                        </div>
                      </td>

                      {/* Video link */}
                      <td className="px-4 py-3.5">
                        <a
                          href={s.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 hover:text-violet-200 text-xs font-medium transition-all max-w-[250px] truncate"
                          title={s.videoLink}
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{s.videoLink}</span>
                        </a>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3.5 text-right">
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
          )}

          <Pagination
            page={page}
            total={total}
            limit={LIMIT}
            onPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
