"use client";

import { useEffect, useState } from "react";
import { Copy, Download, Mail, MessageCircle, Phone, RefreshCw, Save, Search, Trash2 } from "lucide-react";
import { DashboardSkeleton, InlineError } from "@/components/dashboard/LoadingStates";
import { useToast } from "@/components/dashboard/ToastProvider";
import { dashboardFetch, getErrorMessage } from "@/lib/dashboardApi";

type Inquiry = {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  full_phone_e164?: string;
  whatsapp_number_e164?: string;
  product?: string;
  country?: string;
  quantity?: string;
  incoterm?: string;
  notes?: string;
  adminNotes?: string;
  admin_email_sent?: boolean;
  admin_email_sent_at?: string;
  admin_email_error?: string;
  customer_auto_reply_sent?: boolean;
  customer_auto_reply_sent_at?: string;
  customer_auto_reply_error?: string;
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

function phoneDigits(value?: string) {
  return String(value ?? "").replace(/\D/g, "");
}

function phoneHref(value?: string) {
  return value ? `tel:${value}` : "";
}

function whatsappHref(value?: string) {
  const digits = phoneDigits(value);
  return digits ? `https://wa.me/${digits}` : "";
}

function formatPhone(value?: string) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  return raw.replace(/^(\+\d{1,3})(\d{3})(\d{3})(\d+)$/, "$1 $2 $3 $4");
}

function EmailDeliveryBadges({ item }: { item: Inquiry }) {
  const failed = Boolean(item.admin_email_error || item.customer_auto_reply_error);
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {item.admin_email_sent && (
        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-bold text-blue-700">Admin email sent</span>
      )}
      {item.customer_auto_reply_sent && (
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">Customer reply sent</span>
      )}
      {failed && (
        <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-bold text-red-700">Email failed</span>
      )}
    </div>
  );
}

function LeadActionButtons({ item, compact = false }: { item: Inquiry; compact?: boolean }) {
  const phoneValue = item.full_phone_e164 || item.phone;
  const whatsappValue = item.whatsapp_number_e164 || item.full_phone_e164 || item.phone;
  const actionClass = compact
    ? "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold"
    : "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold";
  return (
    <div className={`flex flex-wrap gap-2 ${compact ? "mt-2" : ""}`}>
      {phoneValue && (
        <a href={phoneHref(phoneValue)} className={`${actionClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}>
          <Phone size={compact ? 12 : 15} />
          {compact ? formatPhone(phoneValue) || "Call" : "Call"}
        </a>
      )}
      {whatsappValue && (
        <a
          href={whatsappHref(whatsappValue)}
          target="_blank"
          rel="noreferrer"
          className={`${actionClass} bg-green-50 text-green-700 hover:bg-green-100`}
        >
          <MessageCircle size={compact ? 12 : 15} />
          WhatsApp
        </a>
      )}
      {item.email && (
        <a href={`mailto:${item.email}`} className={`${actionClass} bg-sky-50 text-sky-700 hover:bg-sky-100`}>
          <Mail size={compact ? 12 : 15} />
          Email
        </a>
      )}
    </div>
  );
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [draftNote, setDraftNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dashboardFetch<Inquiry[]>("/api/inquiries?limit=100");
      setInquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Inquiries could not be loaded."));
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
      const updated = await dashboardFetch<Inquiry>(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setInquiries((prev) => prev.map((i) => (i._id === id ? updated : i)));
      if (selected?._id === id) setSelected(updated);
      toast.success("Inquiry status updated.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Status update failed."));
    }
  };

  const openInquiry = (inquiry: Inquiry) => {
    const next = selected?._id === inquiry._id ? null : inquiry;
    setSelected(next);
    setDraftNote(next?.adminNotes ?? "");
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email copied.");
    } catch {
      toast.error("Could not copy email.");
    }
  };

  const saveAdminNote = async () => {
    if (!selected) return;
    setSavingNote(true);
    try {
      const updated = await dashboardFetch<Inquiry>(`/api/inquiries/${selected._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes: draftNote }),
      });
      setInquiries((prev) => prev.map((i) => (i._id === selected._id ? updated : i)));
      setSelected(updated);
      setDraftNote(updated.adminNotes ?? "");
      toast.success("Admin note saved.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Note save failed."));
    } finally {
      setSavingNote(false);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    try {
      await dashboardFetch<{ success?: boolean }>(`/api/inquiries/${id}`, { method: "DELETE" });
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success("Inquiry deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed."));
    }
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
      (statusFilter === "All" || i.status === statusFilter) &&
      (
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.email.toLowerCase().includes(search.toLowerCase()) ||
        (i.product ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (i.country ?? "").toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
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

      {error && <div className="mb-5"><InlineError message={error} onRetry={load} /></div>}

      {/* Search + filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 flex items-center gap-3 max-w-sm flex-1">
          <Search size={18} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none w-full text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm font-semibold text-gray-600 shadow-sm outline-none"
        >
          {["All","New","Pending","Read","Contacted","Replied","Closed"].map((status) => (
            <option key={status} value={status}>{status === "All" ? "All statuses" : status}</option>
          ))}
        </select>
      </div>

      <div className={`grid gap-6 ${selected ? "xl:grid-cols-[1fr_380px]" : ""}`}>
        {/* Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <DashboardSkeleton rows={5} />
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
                      onClick={() => openInquiry(item)}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer ${selected?._id === item._id ? "bg-[#E6F4F7]" : ""}`}
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-[#0F172A] text-sm">{item.name}</p>
                        {item.company && <p className="text-gray-400 text-xs">{item.company}</p>}
                        <p className="text-gray-400 text-xs">{item.email}</p>
                        <div onClick={(e) => e.stopPropagation()}>
                          <p className="mt-1 text-[11px] font-semibold text-gray-500">{item.country || "Country not set"}</p>
                          <LeadActionButtons item={item} compact />
                        </div>
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
                          {["New","Pending","Read","Contacted","Replied","Closed"].map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                        <EmailDeliveryBadges item={item} />
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
            <div className="mb-5 grid grid-cols-2 gap-2">
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`GOPU Exports enquiry follow-up${selected.product ? ` - ${selected.product}` : ""}`)}&body=${encodeURIComponent(`Dear ${selected.name},\n\nThank you for your enquiry to GOPU Exports.\n\n`)}`}
                onClick={() => void updateStatus(selected._id, "Replied")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E7490] px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0A5A70]"
              >
                <Mail size={15} />
                Reply
              </a>
              <button
                type="button"
                onClick={() => copyEmail(selected.email)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <Copy size={15} />
                Copy Email
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <EmailDeliveryBadges item={selected} />
              {[
                ["Email", selected.email],
                ["Phone", formatPhone(selected.full_phone_e164 || selected.phone) || selected.phone],
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
              {(selected.full_phone_e164 || selected.phone) && (
                <div className="pt-1">
                  <LeadActionButtons item={selected} />
                </div>
              )}
              {selected.notes && (
                <div>
                  <p className="text-gray-400 mb-1">Buyer message</p>
                  <p className="text-[#0F172A] bg-gray-50 rounded-xl p-3 text-xs leading-6">{selected.notes}</p>
                </div>
              )}
              <div>
                <p className="text-gray-400 mb-1">Internal admin notes</p>
                <textarea
                  value={draftNote}
                  onChange={(event) => setDraftNote(event.target.value)}
                  rows={5}
                  placeholder="Add follow-up notes, call outcome, pricing reminders, or next action..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs leading-6 text-[#0F172A] outline-none transition focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/20"
                />
                <button
                  type="button"
                  onClick={saveAdminNote}
                  disabled={savingNote}
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0E7490] px-4 py-2.5 text-sm font-semibold text-[#0E7490] transition hover:bg-[#0E7490]/5 disabled:opacity-60"
                >
                  <Save size={15} />
                  {savingNote ? "Saving..." : "Save Notes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
