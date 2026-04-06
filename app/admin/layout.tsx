import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Clipster",
  description: "Manage campaigns, users, and submissions.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
