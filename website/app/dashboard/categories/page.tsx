"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, GripVertical, Download, Database } from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  active: boolean;
  order: number;
};

const EMPTY: Omit<Category, "_id"> = {
  name: "",
  slug: "",
  description: "",
  image: "",
  active: true,
  order: 0,
};

const WEBSITE_CATEGORIES: Omit<Category, "_id">[] = [
  { name: "Rice & Grains", slug: "rice-grains", description: "Export-ready rice, grains, and staple commodities.", image: "", active: true, order: 1 },
  { name: "Millets", slug: "millets", description: "Nutritious millet varieties for global B2B buyers.", image: "", active: true, order: 2 },
  { name: "Spices", slug: "spices", description: "Whole spices, seeds, and export-grade spice ingredients.", image: "", active: true, order: 3 },
  { name: "Oil Seeds", slug: "oil-seeds", description: "Oil seeds and related agricultural commodities.", image: "", active: true, order: 4 },
  { name: "Fresh Fruits", slug: "fresh-fruits", description: "Fresh produce handled for export supply chains.", image: "", active: true, order: 5 },
  { name: "Fresh Vegetables", slug: "fresh-vegetables", description: "Vegetable sourcing for importers and distributors.", image: "", active: true, order: 6 },
  { name: "Processed Foods", slug: "processed-foods", description: "Processed food products for international trade.", image: "", active: true, order: 7 },
  { name: "Masala & Powders", slug: "masala-powders", description: "Ground spices, masala blends, and powdered ingredients.", image: "", active: true, order: 8 },
  { name: "Herbal Products", slug: "herbal-products", description: "Herbal and natural product exports.", image: "", active: true, order: 9 },
  { name: "Dry Fruits & Nuts", slug: "dry-fruits-nuts", description: "Dry fruits, nuts, and value-added food products.", image: "", active: true, order: 10 },
  { name: "Organic Products", slug: "organic-products", description: "Organic agricultural products where certification is available.", image: "", active: true, order: 11 },
];

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

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Omit<Category, "_id">>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
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

  const openEdit = (c: Category) => {
    setEditing(c);
    const { _id, ...rest } = c;
    void _id;
    setForm(rest);
    setShowForm(true);
  };

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const autoSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/categories/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const updated = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c._id === editing._id ? updated : c))
        );
      } else {
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: Category) => {
    const res = await fetch(`/api/categories/${c._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    const updated = await res.json();
    setCategories((prev) => prev.map((x) => (x._id === c._id ? updated : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  const importWebsiteData = async () => {
    setSaving(true);
    try {
      const existingSlugs = new Set(categories.map((category) => category.slug));
      let created = 0;
      for (const category of WEBSITE_CATEGORIES) {
        if (existingSlugs.has(category.slug)) continue;
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(category),
        });
        if (res.ok) created++;
      }
      await load();
      if (created === 0) alert("Website categories are already imported.");
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Slug", "Description", "Image", "Active", "Order"];
    const rows = categories.map((c) => [c.name, c.slug, c.description, c.image, c.active, c.order]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Categories</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {categories.length} categories · {categories.filter((c) => c.active).length} active
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
            onClick={openNew}
            className="flex items-center gap-2 bg-[#0E7490] hover:bg-[#0A5A70] transition text-white px-5 py-3 rounded-xl font-medium text-sm"
          >
            <Plus size={16} />
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Loading…</div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-3">
            <span className="text-3xl">📁</span>
            No categories yet.
            <button onClick={importWebsiteData} className="text-[#0E7490] font-semibold hover:underline">
              Import website categories
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500 text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4 w-8"></th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Order</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-4 text-gray-300">
                      <GripVertical size={16} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#0F172A] text-sm">{c.name}</p>
                      {c.description && (
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">{c.description}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs font-mono">{c.slug}</td>
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
                        {c.active ? <><Check size={12} /> Active</> : "Inactive"}
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
                {editing ? "Edit Category" : "Add Category"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>

            <div className="px-8 py-6 space-y-4">
              <Field label="Category Name *">
                <Input
                  required
                  placeholder="e.g. Spices"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({
                      ...f,
                      name,
                      slug: f.slug || autoSlug(name),
                    }));
                  }}
                />
              </Field>

              <Field label="Slug (URL key)">
                <Input
                  placeholder="e.g. spices"
                  value={form.slug}
                  onChange={set("slug")}
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows={2}
                  placeholder="Short description of this category"
                  value={form.description}
                  onChange={set("description")}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490] resize-none"
                />
              </Field>

              <Field label="Image URL">
                <Input
                  placeholder="https://... or /images/category.jpg"
                  value={form.image}
                  onChange={set("image")}
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
                {saving ? "Saving…" : editing ? "Update" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
