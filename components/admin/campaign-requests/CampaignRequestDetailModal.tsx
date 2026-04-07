"use client";

import { useState } from "react";
import Modal from "@/components/admin/Modal";
import type { CampaignRequestResponse } from "@/types/campaign-request";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Mail,
  Phone,
  Bookmark,
  FileText,
  Target,
  Clock,
  StickyNote,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-400",
  APPROVED: "text-emerald-400",
  REJECTED: "text-red-400",
};

interface Props {
  request: CampaignRequestResponse;
  onClose: () => void;
  onStatusUpdated: () => void;
}

export default function CampaignRequestDetailModal({
  request,
  onClose,
  onStatusUpdated,
}: Props) {
  const [adminNotes, setAdminNotes] = useState(request.adminNotes ?? "");
  const [isUpdating, setIsUpdating] = useState<"APPROVED" | "REJECTED" | null>(
    null
  );
  const [error, setError] = useState("");

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setIsUpdating(status);
    setError("");

    try {
      const res = await fetch(`/api/admin/campaign-requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: adminNotes.trim() || undefined }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to update status");
        return;
      }

      onStatusUpdated();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsUpdating(null);
    }
  };

  const createdAt = new Date(request.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Modal onClose={onClose} title="Campaign Request Details" wide>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* ── Status ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/30" />
            <span className="text-sm text-white/40">{createdAt}</span>
          </div>
          <span
            className={`text-sm font-bold ${STATUS_COLORS[request.status]}`}
          >
            {request.status}
          </span>
        </div>

        {/* ── Details grid ── */}
        <div className="space-y-4">
          <DetailItem icon={User} label="Full Name" value={request.fullName} />
          <DetailItem icon={Mail} label="Email" value={request.email} />
          <DetailItem
            icon={Phone}
            label="Phone"
            value={request.phoneNumber || "Not provided"}
          />
          <DetailItem icon={Bookmark} label="Campaign Title" value={request.title} />

          {/* Campaign Goals (multi-line) */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-white/30" />
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
                Campaign Goals
              </span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.04]">
              {request.campaignGoals}
            </p>
          </div>
        </div>

        {/* ── Admin Notes ── */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <StickyNote className="w-4 h-4 text-white/30" />
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Admin Notes
            </span>
          </div>
          <textarea
            id="admin-notes"
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            rows={3}
            placeholder="Add internal notes (optional)..."
            disabled={request.status !== "PENDING"}
            className="w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:bg-white/[0.09] focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 resize-y min-h-[60px] disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* ── Actions ── */}
        {request.status === "PENDING" && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => handleAction("REJECTED")}
              disabled={isUpdating !== null}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating === "REJECTED" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject
            </button>
            <button
              onClick={() => handleAction("APPROVED")}
              disabled={isUpdating !== null}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating === "APPROVED" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Approve
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex items-center gap-2 min-w-[140px]">
        <Icon className="w-4 h-4 text-white/30" />
        <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <span className="text-sm text-white/80">{value}</span>
    </div>
  );
}
