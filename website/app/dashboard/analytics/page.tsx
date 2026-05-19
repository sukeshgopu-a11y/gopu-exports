"use client";

import { useEffect, useState } from "react";
import { Activity, Globe2, MousePointerClick, Users } from "lucide-react";
import { dashboardFetch, getErrorMessage } from "@/lib/dashboardApi";
import { DashboardSkeleton } from "@/components/dashboard/LoadingStates";
import { useToast } from "@/components/dashboard/ToastProvider";

type AnalyticsResponse = {
  stats: {
    events: number;
    uniqueVisitors: number;
    pageViews: number;
    leads: number;
    avgSessionSeconds: number;
    maxScrollDepth: number;
  };
  topPages: { label: string; count: number }[];
  countries: { label: string; count: number }[];
  devices: { label: string; count: number }[];
  eventsByType: { label: string; count: number }[];
  recent: Array<{
    id: string;
    event_type: string;
    path: string;
    country: string | null;
    device: string | null;
    browser: string | null;
    created_at: string;
  }>;
};

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Activity }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <Icon className="h-5 w-5 text-[#0E7490]" />
      </div>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function RankedList({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-lg font-black text-slate-900">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p className="text-sm text-slate-500">No analytics events yet.</p>}
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 truncate font-semibold text-slate-700">{row.label}</span>
              <span className="font-bold text-slate-900">{row.count}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-[#0E7490]" style={{ width: `${Math.max((row.count / max) * 100, 8)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardAnalyticsPage() {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    let alive = true;
    dashboardFetch<AnalyticsResponse>("/api/analytics/events")
      .then((response) => {
        if (alive) setData(response);
      })
      .catch((error) => {
        if (alive) toast.error(getErrorMessage(error, "Unable to load analytics."));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [toast]);

  if (loading) return <DashboardSkeleton rows={8} />;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#0E7490]">Visitor intelligence</p>
        <h1 className="mt-2 text-4xl font-black text-slate-900">Analytics</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Privacy-friendly website events from passive analytics. Counts are real Supabase data only.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Events" value={data?.stats.events ?? 0} icon={Activity} />
        <Stat label="Unique Visitors" value={data?.stats.uniqueVisitors ?? 0} icon={Users} />
        <Stat label="Page Views" value={data?.stats.pageViews ?? 0} icon={Globe2} />
        <Stat label="Lead Actions" value={data?.stats.leads ?? 0} icon={MousePointerClick} />
        <Stat label="Avg. Session" value={data?.stats.avgSessionSeconds ?? 0} icon={Activity} />
        <Stat label="Max Scroll %" value={data?.stats.maxScrollDepth ?? 0} icon={MousePointerClick} />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <RankedList title="Top Pages" rows={data?.topPages ?? []} />
        <RankedList title="Countries" rows={data?.countries ?? []} />
        <RankedList title="Devices" rows={data?.devices ?? []} />
        <RankedList title="Events" rows={data?.eventsByType ?? []} />
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-black text-slate-900">Recent Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-5 py-3">Event</th>
                <th className="px-5 py-3">Page</th>
                <th className="px-5 py-3">Country</th>
                <th className="px-5 py-3">Device</th>
                <th className="px-5 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(data?.recent ?? []).map((event) => (
                <tr key={event.id}>
                  <td className="px-5 py-3 font-semibold text-slate-900">{event.event_type.replaceAll("_", " ")}</td>
                  <td className="max-w-[360px] truncate px-5 py-3 text-slate-600">{event.path}</td>
                  <td className="px-5 py-3 text-slate-600">{event.country || "Unknown"}</td>
                  <td className="px-5 py-3 text-slate-600">{event.device || "Unknown"}</td>
                  <td className="px-5 py-3 text-slate-500">{new Date(event.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
