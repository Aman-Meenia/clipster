"use client";

import CampaignsPanel from "@/components/admin/campaigns/CampaignsPanel";

/**
 * /admin/dashboard — Default admin page, shows the campaigns panel.
 * Sidebar is provided by layout.tsx.
 */
export default function AdminDashboardPage() {
  return <CampaignsPanel />;
}
