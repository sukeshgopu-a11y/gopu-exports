"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Package, Globe, MessageSquare } from "lucide-react";
import { DashboardSkeleton, InlineError } from "@/components/dashboard/LoadingStates";
import { dashboardFetch, getErrorMessage } from "@/lib/dashboardApi";

type Stats = {
  total: number;
  newCount: number;
  products: number;
  markets: number;
  responseRate: number;
};

type InquirySummary = {
  name: string;
  product?: string;
  country?: string;
  status?: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    newCount: 0,
    products: 0,
    markets: 0,
    responseRate: 0,
  });
  const [recent, setRecent] = useState<InquirySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dashboardFetch<{ stats: Stats; recent: InquirySummary[] }>("/api/dashboard/summary");
      setStats(data.stats);
      setRecent(data.recent);
    } catch (err) {
      setError(getErrorMessage(err, "Dashboard summary could not be loaded."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  const statCards = [
    { label: "Total Inquiries", value: stats.total, sub: `${stats.newCount} new`, icon: MessageSquare, color: "bg-blue-100 text-blue-600" },
    { label: "Products", value: stats.products, sub: "In catalogue", icon: Package, color: "bg-orange-100 text-orange-600" },
    { label: "Export Markets", value: stats.markets, sub: "From inquiries", icon: Globe, color: "bg-green-100 text-green-600" },
    { label: "Response Rate", value: `${stats.responseRate}%`, sub: "Replied or closed", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] sm:text-4xl">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Welcome back, GOPU Exports Admin</p>
      </div>

      {error && <InlineError message={error} onRetry={load} />}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-500 text-sm font-medium">{label}</p>
              <div className={`p-2.5 rounded-xl ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-[#0F172A]">
              {loading && typeof value === "number" ? "…" : value}
            </h2>
            <p className="text-green-600 mt-2 text-xs font-medium">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Inquiries */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#0F172A]">Recent Inquiries</h2>
          <Link href="/dashboard/inquiries" className="text-[#0E7490] text-sm font-semibold hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <DashboardSkeleton rows={4} />
        ) : recent.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <p className="text-2xl mb-2">📭</p>
            No inquiries yet. They&apos;ll appear here once buyers contact you.
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-semibold text-[#0F172A] text-sm">{item.name}</p>
                  <p className="text-gray-400 text-xs">
                    {item.product || "General enquiry"}{item.country ? ` · ${item.country}` : ""}
                  </p>
                </div>
                <span className="text-gray-300 text-xs">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Add Product", href: "/dashboard/products", icon: "📦" },
          { label: "View Inquiries", href: "/dashboard/inquiries", icon: "📨" },
          { label: "Manage Gallery", href: "/dashboard/gallery", icon: "🖼️" },
          { label: "Settings", href: "/dashboard/settings", icon: "⚙️" },
        ].map(({ label, href, icon }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3 text-center hover:border-[#0E7490] hover:bg-[#F0F9FA] transition shadow-sm"
          >
            <span className="text-2xl">{icon}</span>
            <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
