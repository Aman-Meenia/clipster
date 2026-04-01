"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Film,
  Compass,
  Flag,
  Users,
  Wallet,
  User,
  LogOut,
  Settings,
  Copy,
  Trash2,
  Video,
  DollarSign,
  Eye,
  Link as LinkIcon,
  X,
  ChevronDown,
  Instagram,
  Plus,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import AddInstagramModal from "@/components/AddInstagramModal";

type Tab = "profile" | "campaigns";

interface ConnectedAccount {
  id: string;
  username: string;
  accountUrl: string;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
}

// --- Mock Data ---

const CAMPAIGNS_DATA = [
  {
    id: 1,
    title: "1i1an1 [CLIPPING]",
    image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80",
    category: "Clipping",
    isNew: true,
    creators: "+54",
    budget: "$3200",
    budgetUsed: 0,
    rate: "$1,000.00",
  },
  {
    id: 2,
    title: "nebbiolo [QUOTE / AESTHETIC]",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&q=80",
    category: "Music",
    isNew: true,
    creators: "+23",
    budget: "$2500",
    budgetUsed: 1,
    rate: "$700.00",
  },
  {
    id: 3,
    title: "Cry For Me [EDITS]",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    category: "Music",
    isNew: true,
    creators: "+32",
    budget: "$2910",
    budgetUsed: 0,
    rate: "$1,000.00",
  },
  {
    id: 4,
    title: "Sam Fender [CLIPPING]",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",
    category: "Clipping",
    isNew: false,
    creators: "+166",
    budget: "$2660",
    budgetUsed: 19,
    rate: "$1,000.00",
  },
  {
    id: 5,
    title: "FLO [CLIPPING]",
    image: "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=800&q=80",
    category: "Clipping",
    isNew: false,
    creators: "+288",
    budget: "$2590",
    budgetUsed: 39,
    rate: "$1,000.00",
  },
  {
    id: 6,
    title: "March Madness & NBA [BASKETBALL]",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    category: "Music",
    isNew: true,
    creators: "+28",
    budget: "$4160",
    budgetUsed: 49,
    rate: "$1,000.00",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAddInstagramOpen, setIsAddInstagramOpen] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // Profile Data
  const user = {
    username: "amanmeenia",
    email: "amanmeenia09876@gmail.com",
    memberSince: "March 11, 2026",
  };

  const fetchConnectedAccounts = useCallback(async () => {
    try {
      const response = await fetch("/api/instagram/accounts");
      const result = await response.json();
      if (result.success) {
        setConnectedAccounts(result.data.accounts);
      }
    } catch (error) {
      console.error("Failed to fetch accounts:", error);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  useEffect(() => {
    fetchConnectedAccounts();
  }, [fetchConnectedAccounts]);

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm("Are you sure you want to remove this Instagram account?")) {
      return;
    }

    try {
      const response = await fetch(`/api/instagram/accounts/${accountId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setConnectedAccounts((prev) => prev.filter((a) => a.id !== accountId));
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const handleLogout = () => {
    // Basic cleanup
    document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#0B0C10] text-gray-100 overflow-hidden font-sans">
      {/* ─── SIDEBAR ─── */}
      <aside className="w-[72px] bg-[#0F111A] border-r border-white/5 flex flex-col items-center py-6 shrink-0 relative z-20">
        <div className="mb-8">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20">
            <Film className="w-5 h-5 text-white" />
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-4 w-full items-center">
          <SidebarIcon
            icon={Compass}
            isActive={activeTab === "campaigns"}
            onClick={() => setActiveTab("campaigns")}
          />
          <SidebarIcon icon={Flag} isActive={false} />
          <SidebarIcon icon={Users} isActive={false} />
          <SidebarIcon icon={Wallet} isActive={false} />
          <SidebarIcon
            icon={User}
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </nav>

        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
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

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 overflow-y-auto relative">
        {activeTab === "profile" && (
          <ProfileView
            user={user}
            connectedAccounts={connectedAccounts}
            isLoadingAccounts={isLoadingAccounts}
            onAddAccount={() => setIsAddInstagramOpen(true)}
            onDeleteAccount={handleDeleteAccount}
          />
        )}
        {activeTab === "campaigns" && <CampaignsView />}
      </main>

      {/* ─── ADD INSTAGRAM MODAL ─── */}
      <AddInstagramModal
        isOpen={isAddInstagramOpen}
        onClose={() => setIsAddInstagramOpen(false)}
        onAccountAdded={fetchConnectedAccounts}
      />

      {/* ─── LOGOUT MODAL ─── */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1A1D27] border border-white/10 rounded-2xl shadow-2xl w-full max-w-[400px] overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Logout</h3>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-white/70">Are you sure you want to logout?</p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/5 bg-[#14161F]">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-lg shadow-red-500/20"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ───

function SidebarIcon({
  icon: Icon,
  isActive,
  onClick,
}: {
  icon: any;
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

function ProfileView({
  user,
  connectedAccounts,
  isLoadingAccounts,
  onAddAccount,
  onDeleteAccount,
}: {
  user: any;
  connectedAccounts: ConnectedAccount[];
  isLoadingAccounts: boolean;
  onAddAccount: () => void;
  onDeleteAccount: (id: string) => void;
}) {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-red-500 mb-6">Profile</h1>

      {/* User Header */}
      <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-xs font-medium text-white/70">
              User
            </span>
          </div>
          <p className="text-sm text-white/50">Member since: {user.memberSince}</p>
          <p className="text-sm text-white/50">Email: {user.email}</p>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
              <Instagram className="w-4 h-4 text-white" />
            </div>
            Connected Accounts
            {connectedAccounts.filter((a) => a.isVerified).length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-white/10 text-xs font-medium text-white/70">
                {connectedAccounts.filter((a) => a.isVerified).length}
              </span>
            )}
          </div>
          <button
            onClick={onAddAccount}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20"
          >
            <Plus className="w-4 h-4" />
            Add Instagram
          </button>
        </div>

        {isLoadingAccounts ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
          </div>
        ) : connectedAccounts.length === 0 ? (
          <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
              <Instagram className="w-6 h-6" />
            </div>
            <p className="text-white font-medium mb-1">No Instagram accounts connected</p>
            <p className="text-sm text-white/40 mb-4">
              Connect your Instagram account to start participating in campaigns
            </p>
            <button
              onClick={onAddAccount}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {connectedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-4 bg-[#0B0C10] border border-white/5 rounded-xl px-4 py-3 group hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <a
                      href={account.accountUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white font-medium hover:text-red-400 transition-colors inline-flex items-center gap-1"
                    >
                      @{account.username}
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </a>
                    {account.isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40">
                    {account.isVerified && account.verifiedAt
                      ? `Verified on ${new Date(account.verifiedAt).toLocaleDateString()}`
                      : `Added on ${new Date(account.createdAt).toLocaleDateString()}`}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteAccount(account.id)}
                  className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
                  title="Remove account"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-6 h-6 rounded bg-red-500/10 flex items-center justify-center text-red-500">
              <Compass className="w-4 h-4" /> {/* Fallback icon, chart not in lucide defaults without explicit import */}
            </div>
            Statistics
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20">
            <LinkIcon className="w-4 h-4" />
            Generate Referral Link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stat Block */}
          <div className="bg-[#0B0C10] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
            <p className="text-sm text-white/50 mb-2">Total videos</p>
            <p className="text-3xl font-bold text-red-500">0</p>
            <Video className="absolute right-4 bottom-4 w-12 h-12 text-red-500/5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="bg-[#0B0C10] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
            <p className="text-sm text-white/50 mb-2">Money earned</p>
            <p className="text-3xl font-bold text-red-500">$0</p>
            <DollarSign className="absolute right-4 bottom-4 w-12 h-12 text-red-500/5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="bg-[#0B0C10] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
            <p className="text-sm text-white/50 mb-2">Total views</p>
            <p className="text-3xl font-bold text-red-500">0</p>
            <Eye className="absolute right-4 bottom-4 w-12 h-12 text-red-500/5 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Methods */}
        <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Payment Methods</h3>
          <div className="border border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[200px]">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-white/30">
              <Wallet className="w-6 h-6" />
            </div>
            <p className="text-white font-medium mb-1">No payment method added</p>
            <p className="text-sm text-white/40">Add a payment method to receive earnings</p>
          </div>
        </div>

        {/* Login Methods */}
        <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Login Methods</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-white/50">Email</p>
                <p className="text-sm text-white font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <span className="font-bold">G</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-medium">Google</p>
              </div>
              <button className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Username</h3>
          <div className="flex items-center bg-[#0B0C10] border border-white/5 rounded-xl px-4 py-3 mb-4">
            <span className="text-amber-500 mr-3 shrink-0">🔒</span>
            <input
              type="text"
              readOnly
              value={user.username}
              className="bg-transparent border-none outline-none text-white text-sm w-full"
            />
            <button className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors shrink-0">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <p className="text-xs text-white/40 leading-relaxed">
            ℹ️ Your username cannot be changed once set. It is used for your referral link and profile URL.
          </p>
        </div>
      </div>
    </div>
  );
}

function CampaignsView() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-blue-500 text-white px-4 py-3 rounded-lg flex items-center justify-between text-sm shadow-lg shadow-blue-500/20">
        <p>You can now submit up to 150 posts per campaign across all your linked accounts.</p>
        <button className="text-white/70 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between py-2">
        <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Campaigns</h1>
        <div className="flex items-center gap-2 bg-[#14161F] border border-white/10 px-4 py-2 rounded-lg text-sm text-white/80 cursor-pointer">
          Sort By: <span className="text-white font-medium ml-1">Newest</span>
          <ChevronDown className="w-4 h-4 text-white/50 ml-2" />
        </div>
      </div>

      <div className="flex justify-center -mt-10 mb-6 pointer-events-none">
         <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
             <Film className="w-5 h-5 text-black" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-wider">CLIPSTER</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#14161F] border border-white/5 rounded-xl p-1 mb-4 w-max">
        {["All", "Music", "Logo", "Clipping", "UGC"].map((tab, i) => (
          <button
            key={tab}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              i === 0
                ? "bg-white/10 text-white shadow-sm"
                : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Platform Filters */}
      <div className="flex items-center gap-6 mb-8 border-b border-white/5 pb-4">
        {["TikTok", "Instagram", "YouTube", "X"].map((platform) => (
          <label key={platform} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-4 h-4 rounded-[4px] bg-red-500 flex items-center justify-center shrink-0">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
              {platform}
            </span>
          </label>
        ))}
        <span className="text-sm text-white/40 ml-auto">48 from 48 campaigns</span>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CAMPAIGNS_DATA.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-[#14161F] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors group flex flex-col"
          >
            <div className="relative h-[200px] overflow-hidden bg-black/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={campaign.image}
                alt={campaign.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
              
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white rounded-md shadow-sm">
                  {campaign.category}
                </span>
                {campaign.isNew && (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white rounded-md shadow-sm">
                    New
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-white mb-4 line-clamp-2">{campaign.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50">Creators</span>
                  <div className="flex items-center">
                    <div className="flex -space-x-2 mr-2">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-5 h-5 rounded-full bg-white/20 border border-[#14161F]" />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-white/90">{campaign.creators}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-white/50">Budget</span>
                  <span className="text-sm font-bold text-emerald-400">{campaign.budget}</span>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm text-white/50">Budget Used</span>
                    <span className="text-sm font-bold text-white/90">{campaign.budgetUsed}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${campaign.budgetUsed > 0 ? 'bg-emerald-500' : 'bg-white/10'}`} 
                      style={{ width: `${Math.max(campaign.budgetUsed, 2)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Rate per 1M Views</p>
                  <p className="text-xl font-bold text-white">{campaign.rate}</p>
                </div>
                <button className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-full transition-colors shadow-lg shadow-red-600/20">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
