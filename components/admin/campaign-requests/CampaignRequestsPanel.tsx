"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ClipboardList,
  Search,
  Loader2,
  Filter,
} from "lucide-react";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";
import CampaignRequestRow from "./CampaignRequestRow";
import CampaignRequestDetailModal from "./CampaignRequestDetailModal";
import type { CampaignRequestResponse } from "@/types/campaign-request";

const LIMIT = 15;

type StatusFilter = "" | "PENDING" | "APPROVED" | "REJECTED";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

/**
 * Admin panel for viewing and managing campaign requests.
 * Features: search, status filter tabs, paginated table, detail modal.
 */
export default function CampaignRequestsPanel() {
  const [requests, setRequests] = useState<CampaignRequestResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<CampaignRequestResponse | null>(null);

  // ── Debounce search → reset page ─────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page on status filter change
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = useCallback(
    async (p: number, q: string, status: StatusFilter) => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(p),
          limit: String(LIMIT),
        });
        if (q) params.set("search", q);
        if (status) params.set("status", status);

        const res = await fetch(`/api/admin/campaign-requests?${params}`);
        const data = await res.json();
        if (data.success) {
          setRequests(data.data.requests);
          setTotal(data.data.total);
        }
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(page, debouncedSearch, statusFilter);
  }, [page, debouncedSearch, statusFilter, load]);

  // ── After status update, refresh ──────────────────────────────────────────
  const handleStatusUpdated = () => {
    setSelectedRequest(null);
    load(page, debouncedSearch, statusFilter);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Campaign Requests
            <span className="ml-3 text-base font-normal text-white/30">
              ({total})
            </span>
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Review and manage incoming campaign requests
          </p>
        </div>
      </div>

      {/* ── Search + Filters ── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            id="campaign-req-search"
            type="text"
            placeholder="Search by name, email, or title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/15 transition-all"
          />
        </div>

        {/* Status filter tabs */}
        <div className="flex items-center gap-1 bg-white/[0.04] border border-white/[0.06] rounded-xl p-1">
          <Filter className="w-4 h-4 text-white/30 ml-2 mr-1" />
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === tab.value
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                  : "text-white/45 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={
            debouncedSearch || statusFilter
              ? "No requests found"
              : "No campaign requests yet"
          }
          desc={
            debouncedSearch || statusFilter
              ? "Try adjusting your search or filter."
              : "Campaign requests will appear here when submitted."
          }
        />
      ) : (
        <div className="bg-[#0f0d24] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold text-white/30 uppercase tracking-wider">
            <span>Name / Email</span>
            <span>Title</span>
            <span>Phone</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/4">
            {requests.map((r) => (
              <CampaignRequestRow
                key={r.id}
                request={r}
                onClick={() => setSelectedRequest(r)}
              />
            ))}
          </div>
        </div>
      )}

      <Pagination page={page} total={total} limit={LIMIT} onPage={setPage} />

      {/* ── Detail Modal ── */}
      {selectedRequest && (
        <CampaignRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusUpdated={handleStatusUpdated}
        />
      )}
    </div>
  );
}
