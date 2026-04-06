"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, Search, Loader2 } from "lucide-react";
import Pagination from "@/components/admin/Pagination";
import EmptyState from "@/components/admin/EmptyState";
import UserRow from "@/components/admin/users/UserRow";
import type { AdminUser } from "@/components/admin/types";

const LIMIT = 15;

/**
 * Admin users panel.
 *
 * Features:
 *  - Debounced search by username / email
 *  - Paginated table with column headers
 *  - Role badge, email-verification status, submission & account counts
 */
export default function UsersPanel() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // ── Debounce search → reset page ─────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const load = useCallback(async (p: number, q: string) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(p),
        limit: String(LIMIT),
      });
      if (q) params.set("search", q);

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data.users);
        setTotal(data.data.total);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page, debouncedSearch);
  }, [page, debouncedSearch, load]);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Users
            <span className="ml-3 text-base font-normal text-white/30">
              ({total})
            </span>
          </h1>
          <p className="mt-1 text-sm text-white/40">
            All registered users on the platform
          </p>
        </div>
      </div>

      {/* ── Search ── */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search by username or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/40 focus:ring-2 focus:ring-violet-500/15 transition-all"
        />
      </div>

      {/* ── Table ── */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={Users}
          title={debouncedSearch ? "No users found" : "No users yet"}
          desc={
            debouncedSearch
              ? `No results for "${debouncedSearch}"`
              : "Users will appear here after signing up."
          }
        />
      ) : (
        <div className="bg-[#0f0d24] border border-white/[0.06] rounded-2xl overflow-hidden">
          {/* Column headers */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold text-white/30 uppercase tracking-wider">
            <span>User</span>
            <span>Role</span>
            <span className="text-center">Submissions</span>
            <span className="text-center">Accounts</span>
            <span>Joined</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/4">
            {users.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </div>
        </div>
      )}

      <Pagination page={page} total={total} limit={LIMIT} onPage={setPage} />
    </div>
  );
}
