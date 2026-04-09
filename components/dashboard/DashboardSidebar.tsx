"use client";

import Link from "next/link";
import {
  Film,
  Compass,
  FileVideo,
  Wallet,
  User,
  LogOut,
  Settings,
  type LucideIcon,
} from "lucide-react";
import type { Tab } from "@/components/dashboard/types";

interface DashboardSidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onLogout: () => void;
}

/* ── Desktop sidebar icon ── */
function SidebarIcon({
  icon: Icon,
  isActive,
  onClick,
}: {
  icon: LucideIcon;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-all ${
        isActive
          ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
          : "text-white/40 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-5 h-5" />
      {isActive && (
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-600 rounded-l-full" />
      )}
    </button>
  );
}

/* ── Mobile bottom nav item ── */
function BottomNavItem({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
        isActive ? "text-red-500" : "text-white/40"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}

export default function DashboardSidebar({
  activeTab,
  onTabChange,
  onLogout,
}: DashboardSidebarProps) {
  return (
    <>
      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex w-[72px] bg-[#0F111A] border-r border-white/5 flex-col items-center py-6 shrink-0 relative z-20">
        <div className="mb-8">
          <Link href="/">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20 cursor-pointer">
              <Film className="w-5 h-5 text-white" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 flex flex-col gap-4 w-full items-center">
          <SidebarIcon
            icon={Compass}
            isActive={activeTab === "campaigns"}
            onClick={() => onTabChange("campaigns")}
          />
          <SidebarIcon
            icon={FileVideo}
            isActive={activeTab === "submissions"}
            onClick={() => onTabChange("submissions")}
          />
          <SidebarIcon icon={Wallet} isActive={false} />
          <SidebarIcon
            icon={User}
            isActive={activeTab === "profile"}
            onClick={() => onTabChange("profile")}
          />
        </nav>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={onLogout}
            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-white/5 rounded-xl transition-all"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* ── Mobile Bottom Navigation (hidden on desktop) ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0F111A]/95 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
        <div className="flex items-center">
          <BottomNavItem
            icon={Compass}
            label="Campaigns"
            isActive={activeTab === "campaigns"}
            onClick={() => onTabChange("campaigns")}
          />
          <BottomNavItem
            icon={FileVideo}
            label="Submissions"
            isActive={activeTab === "submissions"}
            onClick={() => onTabChange("submissions")}
          />
          <BottomNavItem
            icon={User}
            label="Profile"
            isActive={activeTab === "profile"}
            onClick={() => onTabChange("profile")}
          />
          <BottomNavItem
            icon={LogOut}
            label="Logout"
            isActive={false}
            onClick={onLogout}
          />
        </div>
      </nav>
    </>
  );
}
