"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

type Product = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  origin: string;
  moq: string;
  packaging: string;
  lead: string;
  hs: string;
  active: boolean;
};

const CATEGORIES = [
  "Spices & Herbs",
  "Fresh Fruits",
  "Fresh Vegetables",
  "Grains & Cereals",
  "Pulses & Lentils",
  "Oilseeds",
  "Processed Products",
];

const EMPTY: Omit<Product, "_id"> = {
  slug: "",
  title: "",
  category: CATEGORIES[0],
  image: "",
  origin: "",
  moq: "",
  packaging: "",
  lead: "",
  hs: "",
  active: true,
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);

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

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = p;
    setForm(rest);
    setShowForm(true);
  };

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/products/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setProducts((prev) => prev.map((p) => (p._id === editing._id ? updated : p)));
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setProducts((prev) => [created, ...prev]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (p: Product) => {
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

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Products</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {products.length} products · {products.filter((p) => p.active).length} active
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] transition text-white px-5 py-3 rounded-xl font-medium text-sm"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-3">
            <span className="text-3xl">📦</span>
            No products yet.
            <button onClick={openNew} className="text-[#0E7490] font-semibold hover:underline text-sm">
              Add your first product →
            </button>
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
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A] text-sm">{p.title}</p>
                      {p.origin && <p className="text-gray-400 text-xs">{p.origin}</p>}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{p.category}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{p.moq || "—"}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm font-mono text-xs">{p.hs || "—"}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggle(p)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                          p.active
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {p.active ? <><Check size={12} /> Active</> : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEdit(p)}
                          className="text-[#0E7490] hover:text-[#0A5A70] transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => remove(p._id)}
                          className="text-red-400 hover:text-red-600 transition"
                        >
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

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#0F172A]">
                {editing ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Product Title *">
                <Input required placeholder="e.g. Guntur Red Chilli" value={form.title} onChange={set("title")} />
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
                <Input placeholder="e.g. red-chilli" value={form.slug} onChange={set("slug")} />
              </Field>
              <Field label="Origin">
                <Input placeholder="e.g. Guntur, Andhra Pradesh" value={form.origin} onChange={set("origin")} />
              </Field>
              <Field label="Image URL">
                <Input placeholder="/products/red-chilli.jpg" value={form.image} onChange={set("image")} />
              </Field>
              <Field label="MOQ">
                <Input placeholder="e.g. 1 MT" value={form.moq} onChange={set("moq")} />
              </Field>
              <Field label="Packaging">
                <Input placeholder="e.g. 25kg bags" value={form.packaging} onChange={set("packaging")} />
              </Field>
              <Field label="Lead Time">
                <Input placeholder="e.g. 10–15 Days" value={form.lead} onChange={set("lead")} />
              </Field>
              <Field label="HS Code">
                <Input placeholder="e.g. 0904 21 10" value={form.hs} onChange={set("hs")} />
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
