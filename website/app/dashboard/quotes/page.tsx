"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Eye, RefreshCw, Search, Trash2 } from "lucide-react";
import { DashboardSkeleton, InlineError } from "@/components/dashboard/LoadingStates";
import { useToast } from "@/components/dashboard/ToastProvider";
import { dashboardFetch, getErrorMessage } from "@/lib/dashboardApi";

type Quote = {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  product?: string;
  quantity?: string;
  country?: string;
  notes?: string;
  status: "New" | "Pending" | "Read" | "Contacted" | "Replied" | "Closed";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  New: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Read: "bg-cyan-100 text-cyan-700",
  Contacted: "bg-indigo-100 text-indigo-700",
  Replied: "bg-blue-100 text-blue-700",
  Closed: "bg-gray-100 text-gray-500",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dashboardFetch<Quote[]>("/api/quotes?limit=100");
      setQuotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Quote requests could not be loaded."));
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

  const updateStatus = async (id: string, status: string) => {
    try {
      const updated = await dashboardFetch<Quote>(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setQuotes((prev) => prev.map((q) => (q._id === id ? updated : q)));
      toast.success("Quote status updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Status update failed."));
    }
  };

  const deleteQuote = async (id: string) => {
    if (!confirm("Delete this quote request?")) return;
    try {
      await dashboardFetch<{ success?: boolean }>(`/api/quotes/${id}`, { method: "DELETE" });
      setQuotes((prev) => prev.filter((q) => q._id !== id));
      toast.success("Quote request deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed."));
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Company", "Email", "Phone", "Product", "Quantity", "Country", "Status", "Date"];
    const rows = quotes.map((q) => [
      q.name,
      q.company ?? "",
      q.email,
      q.phone ?? "",
      q.product ?? "",
      q.quantity ?? "",
      q.country ?? "",
      q.status,
      new Date(q.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.csv";
    a.click();
  };

  const filtered = quotes.filter((q) => {
    const haystack = [q.name, q.email, q.company, q.product, q.country].join(" ").toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Quote Requests</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {quotes.length} total · {quotes.filter((q) => q.status === "New").length} new
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500">
            <RefreshCw size={18} />
          </button>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] transition text-white px-5 py-3 rounded-xl font-medium text-sm">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="mb-5"><InlineError message={error} onRetry={load} /></div>}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6 flex items-center gap-3 max-w-sm">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search quotes..." className="outline-none w-full text-sm" />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <DashboardSkeleton rows={5} />
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            {search ? "No matching quote requests" : "No quote requests yet"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Country</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A] text-sm">{item.name}</p>
                      {item.company && <p className="text-gray-400 text-xs">{item.company}</p>}
                      <p className="text-gray-400 text-xs">{item.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{item.product || "-"}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{item.quantity || "-"}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{item.country || "-"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item._id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[item.status]}`}
                      >
                        {["New", "Pending", "Read", "Contacted", "Replied", "Closed"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/quotes/${item._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[#0E7490] hover:bg-[#E6F4F7] transition"
                        >
                          <Eye size={15} />
                          View
                        </Link>
                        <button onClick={() => deleteQuote(item._id)} className="text-red-400 hover:text-red-600 transition">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
