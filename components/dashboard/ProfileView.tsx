"use client";

import {
  Instagram,
  Plus,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Trash2,
  User,
  Copy,
  Wallet,
  Compass,
  Video,
  DollarSign,
  Eye,
  Link as LinkIcon,
} from "lucide-react";
import type { ConnectedAccount } from "@/components/dashboard/types";

interface ProfileViewProps {
  user: {
    username: string;
    email: string;
    memberSince: string;
  };
  connectedAccounts: ConnectedAccount[];
  isLoadingAccounts: boolean;
  onAddAccount: () => void;
  onDeleteAccount: (id: string) => void;
}

export default function ProfileView({
  user,
  connectedAccounts,
  isLoadingAccounts,
  onAddAccount,
  onDeleteAccount,
}: ProfileViewProps) {
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
          <p className="text-sm text-white/50">
            Member since: {user.memberSince}
          </p>
          <p className="text-sm text-white/50">Email: {user.email}</p>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-[#14161F] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-white font-bold">
            <div className="w-6 h-6 rounded bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
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
            <p className="text-white font-medium mb-1">
              No Instagram accounts connected
            </p>
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
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shrink-0">
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
              <Compass className="w-4 h-4" />
            </div>
            Statistics
          </div>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-red-500/20">
            <LinkIcon className="w-4 h-4" />
            Generate Referral Link
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <p className="text-white font-medium mb-1">
              No payment method added
            </p>
            <p className="text-sm text-white/40">
              Add a payment method to receive earnings
            </p>
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
            ℹ️ Your username cannot be changed once set. It is used for your
            referral link and profile URL.
          </p>
        </div>
      </div>
    </div>
  );
}
