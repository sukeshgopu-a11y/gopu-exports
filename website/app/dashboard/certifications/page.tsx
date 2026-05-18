"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Check, Upload, Download, Database } from "lucide-react";

type Cert = {
  _id: string;
  name: string;
  logo: string;
  description: string;
  issuer: string;
  active: boolean;
  order: number;
};

const EMPTY: Omit<Cert, "_id"> = {
  name: "",
  logo: "",
  description: "",
  issuer: "",
  active: true,
  order: 0,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490]"
    />
  );
}

const PRESET_CERTS = [
  "APEDA", "Spice Board of India", "FSSAI", "IEC", "GST Registered",
  "ISO 22000", "HACCP", "ORGANIC INDIA",
];

const WEBSITE_CERTS: Omit<Cert, "_id">[] = [
  { name: "APEDA", issuer: "Agricultural & Processed Food Products Export Development Authority", logo: "", description: "Registration for export of agricultural and processed food products from India.", active: true, order: 1 },
  { name: "FSSAI", issuer: "Food Safety and Standards Authority of India", logo: "", description: "Food safety registration for food product handling and supply.", active: true, order: 2 },
  { name: "ISO 22000", issuer: "Food Safety Management System", logo: "", description: "Food safety management system standard for supply chain processes.", active: true, order: 3 },
  { name: "HACCP", issuer: "Hazard Analysis & Critical Control Points", logo: "", description: "Preventive food safety approach for identifying and controlling hazards.", active: true, order: 4 },
  { name: "IEC", issuer: "Director General of Foreign Trade", logo: "", description: "Import Export Code used for Indian import and export operations.", active: true, order: 5 },
  { name: "Spice Board of India", issuer: "Spice Board of India", logo: "", description: "Registration relevant to spice export compliance and trade.", active: true, order: 6 },
];

function isValidImageSrc(value: string) {
  const src = value.trim();
  return src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:image/");
}

async function createWebsiteDefaults(existing: Cert[]) {
  const existingNames = new Set(existing.map((cert) => cert.name.toLowerCase()));
  let created = 0;
  for (const cert of WEBSITE_CERTS) {
    if (existingNames.has(cert.name.toLowerCase())) continue;
    const res = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cert),
    });
    if (res.ok) created++;
  }
  return created;
}

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Cert | null>(null);
  const [form, setForm] = useState<Omit<Cert, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [autoImportTried, setAutoImportTried] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certifications");
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length === 0 && !autoImportTried) {
          setAutoImportTried(true);
          await createWebsiteDefaults([]);
          const retry = await fetch("/api/certifications");
          const retryData = await retry.json();
          setCerts(Array.isArray(retryData) ? retryData : []);
        } else {
          setCerts(data);
        }
      } else {
        setCerts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [autoImportTried]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const openNew = (name?: string) => {
    setEditing(null);
    setForm({ ...EMPTY, name: name ?? "" });
    setShowForm(true);
  };

  const openEdit = (c: Cert) => {
    setEditing(c);
    const { _id, ...rest } = c;
    void _id;
    setForm(rest);
    setShowForm(true);
  };

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const uploadLogo = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "certifications");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    setForm((f) => ({ ...f, logo: data.url }));
  };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/certifications/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setCerts((prev) => prev.map((c) => (c._id === editing._id ? updated : c)));
      } else {
        const res = await fetch("/api/certifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setCerts((prev) => [...prev, created]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: Cert) => {
    const res = await fetch(`/api/certifications/${c._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    const updated = await res.json();
    setCerts((prev) => prev.map((x) => (x._id === c._id ? updated : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    setCerts((prev) => prev.filter((c) => c._id !== id));
  };

  const importWebsiteData = async () => {
    setSaving(true);
    try {
      const created = await createWebsiteDefaults(certs);
      await load();
      if (created === 0) alert("Website certifications are already imported.");
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Issuer", "Logo", "Description", "Active", "Order"];
    const rows = certs.map((c) => [c.name, c.issuer, c.logo, c.description, c.active, c.order]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "certifications.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Certifications</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Shown on the website certifications page and product pages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 transition px-4 py-3 rounded-xl font-medium text-sm"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={importWebsiteData}
            disabled={saving}
            className="flex items-center gap-2 border border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490]/5 transition px-4 py-3 rounded-xl font-medium text-sm disabled:opacity-50"
          >
            <Database size={16} />
            Import Website Data
          </button>
          <button
            onClick={() => openNew()}
            className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] transition text-white px-5 py-3 rounded-xl font-medium text-sm"
          >
            <Plus size={16} />
            Add Certification
          </button>
        </div>
      </div>

      {/* Quick add presets */}
      {certs.length === 0 && !loading && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-6">
          <p className="text-sm font-semibold text-blue-800 mb-3">Quick Add Common Certifications</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_CERTS.map((name) => (
              <button
                key={name}
                onClick={() => openNew(name)}
                className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-xs font-medium text-blue-700 hover:bg-blue-100 transition"
              >
                + {name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
        ) : certs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-3">
            <span className="text-3xl">🏆</span>
            No certifications yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Certification</th>
                  <th className="px-6 py-4">Issuer</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {certs.map((c) => (
                  <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {c.logo && isValidImageSrc(c.logo) && (
                          <Image src={c.logo} alt={c.name} width={32} height={32} className="h-8 w-8 object-contain rounded" />
                        )}
                        <div>
                          <p className="font-semibold text-[#0F172A] text-sm">{c.name}</p>
                          {c.description && (
                            <p className="text-gray-400 text-xs truncate max-w-[200px]">{c.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{c.issuer || "—"}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{c.order}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggle(c)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          c.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {c.active ? <><Check size={12} /> Active</> : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(c)} className="text-[#0E7490] hover:text-[#0A5A70] transition">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => remove(c._id)} className="text-red-400 hover:text-red-600 transition">
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {editing ? "Edit Certification" : "Add Certification"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              <Field label="Certification Name *">
                <Input
                  required
                  placeholder="e.g. APEDA"
                  value={form.name}
                  onChange={set("name")}
                />
              </Field>
              <Field label="Issuing Authority">
                <Input
                  placeholder="e.g. Agricultural and Processed Food Products Export Development Authority"
                  value={form.issuer}
                  onChange={set("issuer")}
                />
              </Field>
              <Field label="Logo URL">
                <div className="flex gap-2">
                  <Input
                    placeholder="https://... or /logos/apeda.png"
                    value={form.logo}
                    onChange={set("logo")}
                  />
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#0E7490] px-3 py-2 text-xs font-semibold text-[#0E7490] hover:bg-[#0E7490]/5">
                    <Upload size={14} />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void uploadLogo(file);
                      }}
                    />
                  </label>
                </div>
              </Field>
              <Field label="Description">
                <textarea
                  rows={2}
                  placeholder="Brief description of what this certification covers"
                  value={form.description}
                  onChange={set("description")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490] resize-none"
                />
              </Field>
              <Field label="Display Order">
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, order: Number(e.target.value) }))
                  }
                />
              </Field>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.name}
                className="px-5 py-2.5 rounded-xl bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 text-white text-sm font-semibold transition"
              >
                {saving ? "Saving…" : editing ? "Update" : "Add Certification"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
