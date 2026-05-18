"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Check, Search, Upload } from "lucide-react";

type Spec = { label: string; value: string };

type Product = {
  _id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  image: string;
  description: string;
  shortDescription: string;
  origin: string;
  moq: string;
  packaging: string;
  lead: string;
  hs: string;
  shelfLife: string;
  containerCapacity: string;
  applications: string;
  certifications: string;
  exportCountries: string;
  exportPorts: string;
  benefits: string;
  related: string;
  keywords: string;
  specs: Spec[];
  featured: boolean;
  active: boolean;
  metaTitle: string;
  metaDescription: string;
};

type ProductDB = Omit<
  Product,
  "_id" | "applications" | "certifications" | "exportCountries" | "exportPorts" | "benefits" | "related" | "keywords"
> & {
  _id: string;
  applications: string[];
  certifications: string[];
  exportCountries: string[];
  exportPorts: string[];
  benefits: string[];
  related: string[];
  keywords: string[];
};

const CATEGORIES = [
  "Rice & Grains",
  "Millets",
  "Spices",
  "Oil Seeds",
  "Fresh Fruits",
  "Fresh Vegetables",
  "Processed Foods",
  "Masala & Powders",
  "Herbal Products",
  "Dry Fruits & Nuts",
  "Organic Products",
];

const EMPTY: Omit<Product, "_id"> = {
  slug: "",
  title: "",
  tagline: "",
  category: CATEGORIES[0],
  image: "",
  description: "",
  shortDescription: "",
  origin: "",
  moq: "",
  packaging: "",
  lead: "",
  hs: "",
  shelfLife: "",
  containerCapacity: "",
  applications: "",
  certifications: "",
  exportCountries: "",
  exportPorts: "",
  benefits: "",
  related: "",
  keywords: "",
  specs: [],
  featured: false,
  active: true,
  metaTitle: "",
  metaDescription: "",
};

function toLines(arr: string[]): string {
  return arr.join("\n");
}
function fromLines(s: string): string[] {
  return s.split("\n").map((l) => l.trim()).filter(Boolean);
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      {hint && <p className="text-[11px] text-gray-400 mb-1.5">{hint}</p>}
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
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490] resize-none"
    />
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="col-span-2 border-b border-gray-100 pb-2 mt-2">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ProductDB | null>(null);
  const [form, setForm] = useState<Omit<Product, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
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

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (p: ProductDB) => {
    setEditing(p);
    setForm({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline || "",
      category: p.category,
      image: p.image || "",
      description: p.description || "",
      shortDescription: p.shortDescription || "",
      origin: p.origin || "",
      moq: p.moq || "",
      packaging: p.packaging || "",
      lead: p.lead || "",
      hs: p.hs || "",
      shelfLife: p.shelfLife || "",
      containerCapacity: p.containerCapacity || "",
      applications: toLines(p.applications || []),
      certifications: toLines(p.certifications || []),
      exportCountries: toLines(p.exportCountries || []),
      exportPorts: toLines(p.exportPorts || []),
      benefits: toLines(p.benefits || []),
      related: toLines(p.related || []),
      keywords: (p.keywords || []).join(", "),
      specs: p.specs || [],
      featured: p.featured || false,
      active: p.active !== false,
      metaTitle: p.metaTitle || "",
      metaDescription: p.metaDescription || "",
    });
    setShowForm(true);
  };

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const setSpec = (idx: number, field: "label" | "value") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => {
        const specs = [...f.specs];
        specs[idx] = { ...specs[idx], [field]: e.target.value };
        return { ...f, specs };
      });
    };

  const addSpec = () =>
    setForm((f) => ({ ...f, specs: [...f.specs, { label: "", value: "" }] }));

  const removeSpec = (idx: number) =>
    setForm((f) => ({ ...f, specs: f.specs.filter((_, i) => i !== idx) }));

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "products");
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    setForm((f) => ({ ...f, image: data.url }));
  };

  const autoSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        applications: fromLines(form.applications),
        certifications: fromLines(form.certifications),
        exportCountries: fromLines(form.exportCountries),
        exportPorts: fromLines(form.exportPorts),
        benefits: fromLines(form.benefits),
        related: fromLines(form.related),
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        metaTitle: form.metaTitle || form.title,
      };

      if (editing) {
        const res = await fetch(`/api/products/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p._id === editing._id ? updated : p)));
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (p: ProductDB) => {
    const res = await fetch(`/api/products/${p._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !p.active }),
    });
    const updated = await res.json();
    setProducts((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const seed = async () => {
    if (!confirm("Import all products from the static library into Supabase? Existing slugs will be skipped.")) return;
    setSeeding(true);
    setSeedMsg(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      setSeedMsg(data.message ?? "Done.");
      await load();
    } catch {
      setSeedMsg("Seed failed — check console.");
    } finally {
      setSeeding(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Products</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {products.length} products · {products.filter((p) => p.active).length} active
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={seed}
            disabled={seeding}
            className="flex items-center gap-2 border border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490]/5 transition px-5 py-3 rounded-xl font-medium text-sm disabled:opacity-50"
          >
            {seeding ? "Seeding…" : "Seed from Library"}
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] transition text-white px-5 py-3 rounded-xl font-medium text-sm"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>
      </div>

      {seedMsg && (
        <div className="mb-5 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <span>{seedMsg}</span>
          <button onClick={() => setSeedMsg(null)} className="text-green-600 hover:text-green-800 font-bold">✕</button>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-5 flex items-center gap-3 max-w-sm">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="outline-none w-full text-sm"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-sm gap-4">
            <span className="text-4xl">📦</span>
            {search ? (
              <p>No matching products</p>
            ) : (
              <>
                <p className="font-medium text-gray-500">No products in the database yet.</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={seed}
                    disabled={seeding}
                    className="bg-[#0E7490] hover:bg-[#0A5A70] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition disabled:opacity-50"
                  >
                    {seeding ? "Importing…" : "Import from Product Library →"}
                  </button>
                  <span className="text-gray-400">or</span>
                  <button onClick={openNew} className="text-[#0E7490] font-semibold hover:underline text-sm">
                    Add manually
                  </button>
                </div>
                <p className="text-xs text-gray-400">Imports all 17 products from lib/products.ts into Supabase</p>
              </>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">MOQ</th>
                  <th className="px-6 py-4">HS Code</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.image && (
                          <Image
                            src={p.image}
                            alt={p.title}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover rounded-lg border border-gray-100"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-[#0F172A] text-sm">{p.title}</p>
                          {p.origin && <p className="text-gray-400 text-xs">{p.origin}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{p.category}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{p.moq || "—"}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-mono">{p.hs || "—"}</td>
                    <td className="px-6 py-4">
                      {p.featured ? (
                        <span className="text-amber-500 text-xs font-semibold">★ Featured</span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggle(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          p.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {p.active ? <><Check size={12} /> Active</> : "Hidden"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => openEdit(p)} className="text-[#0E7490] hover:text-[#0A5A70] transition">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => remove(p._id)} className="text-red-400 hover:text-red-600 transition">
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

      {/* ── FULL-FEATURED PRODUCT FORM MODAL ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl my-8">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {editing ? `Edit: ${editing.title}` : "Add Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* ── BASIC INFO ── */}
              <SectionTitle title="Basic Information" />

              <Field label="Product Title *">
                <Input
                  required
                  placeholder="e.g. Guntur Red Chilli"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((f) => ({
                      ...f,
                      title,
                      slug: f.slug || autoSlug(title),
                      metaTitle: f.metaTitle || title,
                    }));
                  }}
                />
              </Field>

              <Field label="Category *">
                <select
                  value={form.category}
                  onChange={set("category")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30"
                >
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Slug (URL key)">
                <Input
                  placeholder="e.g. red-chilli"
                  value={form.slug}
                  onChange={set("slug")}
                />
              </Field>

              <Field label="Origin">
                <Input
                  placeholder="e.g. Guntur, Andhra Pradesh"
                  value={form.origin}
                  onChange={set("origin")}
                />
              </Field>

              <div className="col-span-2">
                <Field label="Tagline (one-line description)">
                  <Input
                    placeholder="e.g. Sun-dried Guntur chilli with fiery heat"
                    value={form.tagline}
                    onChange={set("tagline")}
                  />
                </Field>
              </div>

              <div className="col-span-2">
                <Field label="Short Description (shown in cards)">
                  <Textarea
                    rows={2}
                    placeholder="Brief description for product listings…"
                    value={form.shortDescription}
                    onChange={set("shortDescription")}
                  />
                </Field>
              </div>

              <div className="col-span-2">
                <Field label="Full Description">
                  <Textarea
                    rows={4}
                    placeholder="Detailed product description for the product page…"
                    value={form.description}
                    onChange={set("description")}
                  />
                </Field>
              </div>

              {/* ── MEDIA ── */}
              <SectionTitle title="Media" />

              <div className="col-span-2">
                <Field label="Hero Image URL">
                  <div className="flex gap-2">
                    <Input
                      placeholder="/products/red-chilli.jpg or https://..."
                      value={form.image}
                      onChange={set("image")}
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
                          if (file) void uploadImage(file);
                        }}
                      />
                    </label>
                  </div>
                </Field>
              </div>

              {/* ── TRADE INFO ── */}
              <SectionTitle title="Trade Information" />

              <Field label="MOQ">
                <Input placeholder="e.g. 1 MT" value={form.moq} onChange={set("moq")} />
              </Field>
              <Field label="Packaging">
                <Input placeholder="e.g. 25 kg PP bags" value={form.packaging} onChange={set("packaging")} />
              </Field>
              <Field label="Lead Time">
                <Input placeholder="e.g. 10–15 Days" value={form.lead} onChange={set("lead")} />
              </Field>
              <Field label="HS Code">
                <Input placeholder="e.g. 0904 21 10" value={form.hs} onChange={set("hs")} />
              </Field>
              <Field label="Shelf Life">
                <Input placeholder="e.g. 12 Months" value={form.shelfLife} onChange={set("shelfLife")} />
              </Field>
              <Field label="Container Capacity">
                <Input placeholder="e.g. 18 MT per 20ft container" value={form.containerCapacity} onChange={set("containerCapacity")} />
              </Field>

              {/* ── SPECIFICATIONS ── */}
              <SectionTitle title="Specifications" />

              <div className="col-span-2 space-y-2">
                {form.specs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      placeholder="Label (e.g. Moisture)"
                      value={spec.label}
                      onChange={setSpec(idx, "label")}
                    />
                    <Input
                      placeholder="Value (e.g. ≤10%)"
                      value={spec.value}
                      onChange={setSpec(idx, "value")}
                    />
                    <button
                      onClick={() => removeSpec(idx)}
                      className="text-red-400 hover:text-red-600 px-2 py-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addSpec}
                  className="text-[#0E7490] text-xs font-semibold hover:underline"
                >
                  + Add Specification
                </button>
              </div>

              {/* ── EXPORT INFO ── */}
              <SectionTitle title="Export Information" />

              <div className="col-span-2">
                <Field label="Export Countries" hint="One per line">
                  <Textarea
                    rows={3}
                    placeholder={"USA\nUAE\nGermany"}
                    value={form.exportCountries}
                    onChange={set("exportCountries")}
                  />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Export Ports" hint="One per line">
                  <Textarea
                    rows={2}
                    placeholder={"Nhava Sheva (Mumbai)\nKakinada Port"}
                    value={form.exportPorts}
                    onChange={set("exportPorts")}
                  />
                </Field>
              </div>

              {/* ── CERTIFICATIONS & APPLICATIONS ── */}
              <SectionTitle title="Certifications & Applications" />

              <div className="col-span-2">
                <Field label="Certifications" hint="One per line">
                  <Textarea
                    rows={2}
                    placeholder={"APEDA\nFSSAI\nISO 22000"}
                    value={form.certifications}
                    onChange={set("certifications")}
                  />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Applications" hint="One per line">
                  <Textarea
                    rows={3}
                    placeholder={"Culinary use\nPharmaceutical industry\nOleoresin extraction"}
                    value={form.applications}
                    onChange={set("applications")}
                  />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Benefits" hint="One per line">
                  <Textarea
                    rows={3}
                    placeholder={"Rich in antioxidants\nAnti-inflammatory properties"}
                    value={form.benefits}
                    onChange={set("benefits")}
                  />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Related Products" hint="One slug per line">
                  <Textarea
                    rows={2}
                    placeholder={"black-pepper\ncumin-seeds"}
                    value={form.related}
                    onChange={set("related")}
                  />
                </Field>
              </div>

              {/* ── SEO ── */}
              <SectionTitle title="SEO" />

              <div className="col-span-2">
                <Field label="Meta Title">
                  <Input
                    placeholder={form.title || "Product meta title"}
                    value={form.metaTitle}
                    onChange={set("metaTitle")}
                  />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Meta Description">
                  <Textarea rows={2} value={form.metaDescription} onChange={set("metaDescription")} />
                </Field>
              </div>
              <div className="col-span-2">
                <Field label="Keywords (comma separated)">
                  <Input
                    placeholder="red chilli export, Indian chilli supplier"
                    value={form.keywords}
                    onChange={set("keywords")}
                  />
                </Field>
              </div>

              {/* ── SETTINGS ── */}
              <SectionTitle title="Settings" />

              <div className="col-span-2 flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-[#0E7490] rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured product</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                    className="w-4 h-4 accent-[#0E7490] rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Active (visible on website)</span>
                </label>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-3xl">
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving || !form.title || !form.category}
                className="px-5 py-2.5 rounded-xl bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 text-white text-sm font-semibold transition"
              >
                {saving ? "Saving…" : editing ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
