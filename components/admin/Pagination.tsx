"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}

function PageBtn({
  n,
  current,
  onPage,
}: {
  n: number;
  current: number;
  onPage: (p: number) => void;
}) {
  return (
    <button
      onClick={() => onPage(n)}
      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
        n === current
          ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      {n}
    </button>
  );
}

/**
 * Pagination bar with ellipsis logic.
 * Returns null when there is only 1 page.
 */
export default function Pagination({
  page,
  total,
  limit,
  onPage,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  // Build visible page numbers with a window of ±2 around current
  const pages: number[] = [];
  const delta = 2;
  for (
    let i = Math.max(1, page - delta);
    i <= Math.min(totalPages, page + delta);
    i++
  ) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-white/40">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of{" "}
        {total}
      </p>

      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* First page + ellipsis */}
        {pages[0] > 1 && (
          <>
            <PageBtn n={1} current={page} onPage={onPage} />
            {pages[0] > 2 && (
              <span className="px-1 text-white/30">…</span>
            )}
          </>
        )}

        {/* Window pages */}
        {pages.map((n) => (
          <PageBtn key={n} n={n} current={page} onPage={onPage} />
        ))}

        {/* Last page + ellipsis */}
        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && (
              <span className="px-1 text-white/30">…</span>
            )}
            <PageBtn n={totalPages} current={page} onPage={onPage} />
          </>
        )}

        {/* Next */}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
