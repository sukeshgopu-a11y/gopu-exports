"use client";

import { useEffect, useState } from "react";
import { Search, Download, Trash2, RefreshCw } from "lucide-react";

type Inquiry = {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  product?: string;
  country?: string;
  quantity?: string;
  incoterm?: string;
  notes?: string;
  status: "New" | "Pending" | "Replied" | "Closed";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  New: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Replied: "bg-blue-100 text-blue-700",
  Closed: "bg-gray-100 text-gray-500",
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries");
      const data = await res.json();
      setInquiries(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setInquiries((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status: status as Inquiry["status"] } : i))
    );
    if (selected?._id === id) setSelected((s) => s ? { ...s, status: status as Inquiry["status"] } : s);
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    setInquiries((prev) => prev.filter((i) => i._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const exportCSV = () => {
    const headers = ["Name","Company","Email","Phone","Product","Country","Quantity","Incoterm","Status","Date"];
    const rows = inquiries.map((i) => [
      i.name, i.company ?? "", i.email, i.phone ?? "", i.product ?? "",
      i.country ?? "", i.quantity ?? "", i.incoterm ?? "", i.status,
      new Date(i.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "inquiries.csv"; a.click();
  };

  const filtered = inquiries.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.email.toLowerCase().includes(search.toLowerCase()) ||
      (i.product ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (i.country ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Inquiries</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {inquiries.length} total · {inquiries.filter((i) => i.status === "New").length} new
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition text-gray-500"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] transition text-white px-5 py-3 rounded-xl font-medium text-sm"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6 flex items-center gap-3 max-w-sm">
        <Search size={18} className="text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search inquiries…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full text-sm"
        />
      </div>

      <div className={`grid gap-6 ${selected ? "xl:grid-cols-[1fr_380px]" : ""}`}>
        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              Loading inquiries…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-2">
              <span className="text-3xl">📭</span>
              {search ? "No matching inquiries" : "No inquiries yet"}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Customer</th>
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Country</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr
                      key={item._id}
                      onClick={() => setSelected(selected?._id === item._id ? null : item)}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${selected?._id === item._id ? "bg-[#E6F4F7]" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#0F172A] text-sm">{item.name}</p>
                        {item.company && <p className="text-gray-400 text-xs">{item.company}</p>}
                        <p className="text-gray-400 text-xs">{item.email}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{item.product || "—"}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{item.country || "—"}</td>
                      <td className="px-6 py-4">
                        <select
                          value={item.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateStatus(item._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_COLORS[item.status]}`}
                        >
                          {["New","Pending","Replied","Closed"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-xs">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteInquiry(item._id); }}
                          className="text-red-400 hover:text-red-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="font-bold text-[#0F172A] text-lg">{selected.name}</h3>
                {selected.company && <p className="text-gray-400 text-sm">{selected.company}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Country", selected.country],
                ["Product", selected.product],
                ["Quantity", selected.quantity],
                ["Incoterm", selected.incoterm],
              ].map(([label, value]) =>
                value ? (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-400 w-20 shrink-0">{label}</span>
                    <span className="text-[#0F172A] font-medium">{value}</span>
                  </div>
                ) : null
              )}
              {selected.notes && (
                <div>
                  <p className="text-gray-400 mb-1">Notes</p>
                  <p className="text-[#0F172A] bg-gray-50 rounded-xl p-3 text-xs leading-6">{selected.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <a
                href={`mailto:${selected.email}`}
                className="block w-full text-center bg-[#0E7490] hover:bg-[#0A5A70] text-white font-semibold py-2.5 rounded-xl text-sm transition"
              >
                Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
