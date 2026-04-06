"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Modal from "@/components/admin/Modal";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";
import CampaignCard from "@/components/admin/campaigns/CampaignCard";
import CampaignFormModal from "@/components/admin/campaigns/CampaignFormModal";
import type { Campaign } from "@/components/admin/types";

const LIMIT = 9;

/**
 * Admin campaigns panel.
 *
 * Features:
 *  - Paginated grid of campaigns
 *  - Create / Edit / Delete via modals
 *  - View per-campaign submissions
 *  - Toast feedback for async operations
 */
export default function CampaignsPanel() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Campaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  // Toast
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const router = useRouter();

  // ── Data ──────────────────────────────────────────────────────────────────

  const load = useCallback(async (p: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/campaigns?page=${p}&limit=${LIMIT}`);
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.data.campaigns);
        setTotal(data.data.total);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleDelete(c: Campaign) {
    try {
      const res = await fetch(`/api/campaigns/${c.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast("Campaign deleted.", true);
        setDeleteTarget(null);
        load(page);
      } else {
        showToast(data.error?.message ?? "Delete failed.", false);
      }
    } catch {
      showToast("Network error.", false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-7xl mx-auto">
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

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Campaigns
            <span className="ml-3 text-base font-normal text-white/30">
              ({total})
            </span>
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Manage all influencer campaigns
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-linear-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          desc="Create your first campaign to get started."
          action={
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" /> New Campaign
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {campaigns.map((c) => (
            <CampaignCard
              key={c.id}
              campaign={c}
              onEdit={() => setEditTarget(c)}
              onDelete={() => setDeleteTarget(c)}
              onViewSubmissions={() => router.push(`/admin/dashboard/campaigns/${c.id}/submissions`)}
            />
          ))}
        </div>
      )}

      <Pagination page={page} total={total} limit={LIMIT} onPage={setPage} />

      {/* ── Create modal ── */}
      {createOpen && (
        <CampaignFormModal
          onClose={() => setCreateOpen(false)}
          onSaved={() => {
            showToast("Campaign created!", true);
            setCreateOpen(false);
            setPage(1);
            load(1);
          }}
          onError={(msg) => showToast(msg, false)}
        />
      )}

      {/* ── Edit modal ── */}
      {editTarget && (
        <CampaignFormModal
          editCampaign={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            showToast("Campaign updated!", true);
            setEditTarget(null);
            load(page);
          }}
          onError={(msg) => showToast(msg, false)}
        />
      )}

      {/* ── Delete confirm ── */}
      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)} title="Delete Campaign">
          <p className="text-white/60 mb-2">
            Are you sure you want to delete{" "}
            <span className="text-white font-semibold">{deleteTarget.name}</span>?
          </p>
          <p className="text-xs text-white/30 mb-6">
            This will also remove all uploaded images. This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteTarget(null)}
              className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteTarget)}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-red-500/20"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
