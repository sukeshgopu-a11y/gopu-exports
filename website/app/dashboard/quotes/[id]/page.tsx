"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, MessageCircle, Phone, Trash2 } from "lucide-react";

type Quote = {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  full_phone_e164?: string;
  whatsapp_number_e164?: string;
  product?: string;
  quantity?: string;
  country?: string;
  notes?: string;
  status: "New" | "Pending" | "Read" | "Contacted" | "Replied" | "Closed";
  createdAt: string;
};

function phoneDigits(value?: string) {
  return String(value ?? "").replace(/\D/g, "");
}

const STATUS_COLORS: Record<string, string> = {
  New: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Read: "bg-cyan-100 text-cyan-700",
  Contacted: "bg-indigo-100 text-indigo-700",
  Replied: "bg-blue-100 text-blue-700",
  Closed: "bg-gray-100 text-gray-500",
};

export default function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => setId(id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/quotes/${id}`)
      .then((res) => res.json())
      .then((data) => setQuote(data.error ? null : data))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string) => {
    if (!quote) return;
    const res = await fetch(`/api/quotes/${quote._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setQuote(updated);
  };

  const deleteQuote = async () => {
    if (!quote || !confirm("Delete this quote request?")) return;
    await fetch(`/api/quotes/${quote._id}`, { method: "DELETE" });
    window.location.href = "/dashboard/quotes";
  };

  if (loading) {
    return <div className="text-sm text-gray-400">Loading quote request...</div>;
  }

  if (!quote) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/quotes" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E7490]">
          <ArrowLeft size={16} />
          Back to quotes
        </Link>
        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-gray-500">Quote request not found.</div>
      </div>
    );
  }

  const details = [
    ["Name", quote.name],
    ["Company", quote.company],
    ["Email", quote.email],
    ["Phone", quote.phone],
    ["Product", quote.product],
    ["Quantity", quote.quantity],
    ["Country", quote.country],
    ["Submitted", new Date(quote.createdAt).toLocaleString()],
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/dashboard/quotes" className="inline-flex items-center gap-2 text-sm font-semibold text-[#0E7490]">
          <ArrowLeft size={16} />
          Back to quotes
        </Link>
        <button onClick={deleteQuote} className="inline-flex items-center gap-2 rounded-xl border border-red-100 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 transition">
          <Trash2 size={16} />
          Delete
        </button>
      </div>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E7490]">Quote Request</p>
            <h1 className="mt-2 text-3xl font-extrabold text-[#0F172A]">{quote.name}</h1>
            {quote.company && <p className="mt-1 text-sm text-gray-500">{quote.company}</p>}
          </div>
          <select
            value={quote.status}
            onChange={(e) => updateStatus(e.target.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold outline-none ${STATUS_COLORS[quote.status]}`}
          >
            {["New", "Pending", "Read", "Contacted", "Replied", "Closed"].map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-gray-50 px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">{label}</p>
              <p className="mt-1 break-words text-sm text-[#0F172A]">{value || "-"}</p>
            </div>
          ))}
        </div>

        {(quote.full_phone_e164 || quote.phone) && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${quote.full_phone_e164 || quote.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Phone size={16} />
              Call {quote.phone}
            </a>
            <a
              href={`https://wa.me/${phoneDigits(quote.whatsapp_number_e164 || quote.full_phone_e164 || quote.phone)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        )}

        <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400">Requirements</p>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#0F172A]">{quote.notes || "-"}</p>
        </div>
      </section>
    </div>
  );
}
