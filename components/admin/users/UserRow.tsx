import {
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { AdminUser } from "@/components/admin/types";

interface UserRowProps {
  user: AdminUser;
}

/**
 * Single row in the admin users table.
 * Displays avatar, email/phone, role badge, submission count,
 * connected-accounts count, and join date.
 */
export default function UserRow({ user: u }: UserRowProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/admin/dashboard/users/${u.id}`)}
      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 items-center px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer"
    >
      {/* ── User ── */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-violet-500/40 to-cyan-500/40 flex items-center justify-center text-sm font-bold text-white shrink-0">
          {u.username.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-semibold text-white truncate">
              @{u.username}
            </p>
            {u.isEmailVerified ? (
              <span title="Email verified">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
              </span>
            ) : (
              <span title="Email not verified">
                <AlertCircle className="w-3 h-3 text-amber-400 shrink-0" />
              </span>
            )}
          </div>
          <p className="text-xs text-white/40 truncate flex items-center gap-1">
            <Mail className="w-2.5 h-2.5" />
            {u.email}
          </p>
          {u.phoneNumber && (
            <p className="text-xs text-white/30 truncate flex items-center gap-1">
              <Phone className="w-2.5 h-2.5" />
              {u.phoneNumber}
            </p>
          )}
        </div>
      </div>

      {/* ── Role ── */}
      <div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            u.role === "ADMIN"
              ? "bg-violet-500/15 border-violet-500/30 text-violet-300"
              : "bg-white/5 border-white/10 text-white/50"
          }`}
        >
          {u.role === "ADMIN" && <ShieldCheck className="w-3 h-3" />}
          {u.role}
        </span>
      </div>

      {/* ── Submissions ── */}
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold">
          <Video className="w-3 h-3" />
          {u._count.campaignSubmissions}
        </span>
      </div>

      {/* ── Connected accounts ── */}
      <div className="text-center">
        <span className="text-sm font-semibold text-white/70">
          {u._count.connectedAccounts}
        </span>
      </div>

      {/* ── Joined ── */}
      <div className="flex items-center gap-1 text-xs text-white/40">
        <Calendar className="w-3 h-3 shrink-0" />
        {new Date(u.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    </div>
  );
}
