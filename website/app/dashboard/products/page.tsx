"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, Check, Search, Upload, Download, FileUp, Save } from "lucide-react";
import { DashboardSkeleton, InlineError } from "@/components/dashboard/LoadingStates";
import { useToast } from "@/components/dashboard/ToastProvider";
import { dashboardFetch, getErrorMessage } from "@/lib/dashboardApi";

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

const CSV_FIELDS = [
  "title",
  "slug",
  "category",
  "image",
  "description",
  "shortDescription",
  "origin",
  "moq",
  "packaging",
  "lead",
  "hs",
  "shelfLife",
  "containerCapacity",
  "exportCountries",
  "exportPorts",
  "certifications",
  "applications",
  "benefits",
  "keywords",
  "featured",
  "active",
  "metaTitle",
  "metaDescription",
];

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

function isValidImageSrc(value: string) {
  const src = value.trim();
  return src === "" || src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:image/");
}

function csvEscape(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let cell = "";
  let row: string[] = [];
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];
    if (char === '"' && quoted && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }
  row.push(cell);
  if (row.some((value) => value.trim())) rows.push(row);
  if (rows.length < 2) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]))
  );
}

function normalizeBulkProduct(raw: Partial<Product> & Record<string, unknown>): Omit<Product, "_id"> {
  const title = String(raw.title ?? raw.name ?? "").trim();
  const image = String(raw.image ?? raw.image_url ?? "").trim();
  return {
    ...EMPTY,
    ...raw,
    title,
    slug: String(raw.slug ?? "").trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    category: String(raw.category ?? EMPTY.category).trim() || EMPTY.category,
    image: isValidImageSrc(image) ? image : "",
    exportCountries: Array.isArray(raw.exportCountries) ? raw.exportCountries.join("\n") : String(raw.exportCountries ?? ""),
    exportPorts: Array.isArray(raw.exportPorts) ? raw.exportPorts.join("\n") : String(raw.exportPorts ?? ""),
    certifications: Array.isArray(raw.certifications) ? raw.certifications.join("\n") : String(raw.certifications ?? ""),
    applications: Array.isArray(raw.applications) ? raw.applications.join("\n") : String(raw.applications ?? ""),
    benefits: Array.isArray(raw.benefits) ? raw.benefits.join("\n") : String(raw.benefits ?? ""),
    related: Array.isArray(raw.related) ? raw.related.join("\n") : String(raw.related ?? ""),
    keywords: Array.isArray(raw.keywords) ? raw.keywords.join(", ") : String(raw.keywords ?? ""),
    specs: Array.isArray(raw.specs) ? raw.specs : [],
    featured: String(raw.featured ?? raw.is_featured ?? "false").toLowerCase() === "true",
    active: String(raw.active ?? raw.is_active ?? "true").toLowerCase() !== "false",
  };
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
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkMode, setBulkMode] = useState<"upload" | "edit">("upload");
  const [bulkText, setBulkText] = useState("");
  const [bulkSaving, setBulkSaving] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [error, setError] = useState("");
  const toast = useToast();

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await dashboardFetch<ProductDB[]>("/api/products?limit=250");
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Products could not be loaded."));
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
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "products");
      const data = await dashboardFetch<{ url: string }>("/api/upload", { method: "POST", body: fd, timeoutMs: 30000 });
      setForm((f) => ({ ...f, image: data.url }));

      if (editing) {
        const updated = await dashboardFetch<ProductDB>(`/api/products/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: data.url }),
        });
        setProducts((prev) => prev.map((p) => (p._id === editing._id ? updated : p)));
        setEditing(updated);
        toast.success("Image uploaded and product updated.");
        return;
      }

      toast.success("Image uploaded. Save the product to publish it.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Image upload failed."));
    }
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
        const updated = await dashboardFetch<ProductDB>(`/api/products/${editing._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setProducts((prev) => prev.map((p) => (p._id === editing._id ? updated : p)));
        toast.success("Product updated.");
      } else {
        const created = await dashboardFetch<ProductDB>("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setProducts((prev) => [created, ...prev]);
        toast.success("Product created.");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Product save failed."));
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (p: ProductDB) => {
    try {
      const updated = await dashboardFetch<ProductDB>(`/api/products/${p._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      setProducts((prev) => prev.map((x) => (x._id === p._id ? updated : x)));
      toast.success(updated.active ? "Product is visible." : "Product is hidden.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Visibility update failed."));
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await dashboardFetch<{ success?: boolean }>(`/api/products/${id}`, { method: "DELETE" });
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed."));
    }
  };

  const seed = async () => {
    if (!confirm("Import all products from the static library into Supabase? Existing slugs will be skipped.")) return;
    setSeeding(true);
    setSeedMsg(null);
    try {
      const data = await dashboardFetch<{ message?: string }>("/api/admin/seed", { method: "POST", timeoutMs: 30000 });
      setSeedMsg(data.message ?? "Done.");
      await load();
    } catch (err) {
      setSeedMsg(getErrorMessage(err, "Seed failed."));
    } finally {
      setSeeding(false);
    }
  };

  const productToBulkRow = (p: ProductDB) => ({
    title: p.title,
    slug: p.slug,
    category: p.category,
    image: p.image,
    description: p.description,
    shortDescription: p.shortDescription,
    origin: p.origin,
    moq: p.moq,
    packaging: p.packaging,
    lead: p.lead,
    hs: p.hs,
    shelfLife: p.shelfLife,
    containerCapacity: p.containerCapacity,
    exportCountries: toLines(p.exportCountries || []),
    exportPorts: toLines(p.exportPorts || []),
    certifications: toLines(p.certifications || []),
    applications: toLines(p.applications || []),
    benefits: toLines(p.benefits || []),
    keywords: (p.keywords || []).join(", "),
    featured: p.featured,
    active: p.active,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
  });

  const exportProducts = () => {
    const csv = [
      CSV_FIELDS.map(csvEscape).join(","),
      ...products.map((p) => {
        const row = productToBulkRow(p) as Record<string, unknown>;
        return CSV_FIELDS.map((field) => csvEscape(row[field])).join(",");
      }),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openBulkUpload = () => {
    setBulkMode("upload");
    setBulkError("");
    setBulkText(`${CSV_FIELDS.join(",")}\nExample Product,example-product,Spices,/products/example.jpg,Full description,Short description,India,1 MT,25 kg bags,10 days,0904,12 months,18 MT,USA; UAE,Nhava Sheva,APEDA; FSSAI,Culinary use,Quality product,example export,false,true,Example Product,Example meta description`);
    setBulkOpen(true);
  };

  const openBulkEdit = () => {
    setBulkMode("edit");
    setBulkError("");
    setBulkText(JSON.stringify(products.map(productToBulkRow), null, 2));
    setBulkOpen(true);
  };

  const saveBulk = async () => {
    setBulkSaving(true);
    setBulkError("");
    try {
      const rows = bulkText.trim().startsWith("[")
        ? JSON.parse(bulkText)
        : parseCsv(bulkText);
      if (!Array.isArray(rows) || rows.length === 0) throw new Error("Add at least one product row.");

      let created = 0;
      let updated = 0;
      for (const raw of rows) {
        const item = normalizeBulkProduct(raw);
        if (!item.title) continue;
        const payload = {
          ...item,
          exportCountries: fromLines(item.exportCountries.replaceAll(";", "\n")),
          exportPorts: fromLines(item.exportPorts.replaceAll(";", "\n")),
          certifications: fromLines(item.certifications.replaceAll(";", "\n")),
          applications: fromLines(item.applications.replaceAll(";", "\n")),
          benefits: fromLines(item.benefits.replaceAll(";", "\n")),
          related: fromLines(item.related.replaceAll(";", "\n")),
          keywords: item.keywords.split(",").map((k) => k.trim()).filter(Boolean),
          metaTitle: item.metaTitle || item.title,
        };
        const existing = products.find((product) => product.slug === item.slug);
        await dashboardFetch<ProductDB>(existing ? `/api/products/${existing._id}` : "/api/products", {
          method: existing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (existing) updated++;
        else created++;
      }
      setBulkOpen(false);
      setSeedMsg(`Bulk save complete: ${created} created, ${updated} updated.`);
      toast.success("Bulk product save complete.");
      await load();
    } catch (error) {
      setBulkError(error instanceof Error ? error.message : "Bulk save failed.");
    } finally {
      setBulkSaving(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col gap-4 mb-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A]">Products</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {products.length} products · {products.filter((p) => p.active).length} active
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportProducts}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 transition px-4 py-3 rounded-xl font-medium text-sm"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={openBulkEdit}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:bg-gray-50 transition px-4 py-3 rounded-xl font-medium text-sm"
          >
            <Save size={16} />
            Bulk Edit
          </button>
          <button
            onClick={openBulkUpload}
            className="flex items-center gap-2 border border-[#0E7490] text-[#0E7490] hover:bg-[#0E7490]/5 transition px-4 py-3 rounded-xl font-medium text-sm"
          >
            <FileUp size={16} />
            Bulk Upload
          </button>
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

      {error && <div className="mb-5"><InlineError message={error} onRetry={load} /></div>}

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
          <DashboardSkeleton rows={6} />
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
                        {isValidImageSrc(p.image) && (
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
                      placeholder="/products/red-chilli.webp or https://..."
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
                    placeholder={"APEDA\nFSSAI\nSpice Board"}
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

      {bulkOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl my-8">
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-[#0F172A]">
                  {bulkMode === "edit" ? "Bulk Edit Products" : "Bulk Upload Products"}
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Use CSV with headers or a JSON array. Existing products are updated by matching slug.
                </p>
              </div>
              <button onClick={() => setBulkOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={22} />
              </button>
            </div>
            <div className="px-8 py-6">
              <Textarea
                rows={18}
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                className="font-mono text-xs"
              />
              {bulkError && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {bulkError}
                </div>
              )}
            </div>
            <div className="px-8 py-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setBulkOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveBulk}
                disabled={bulkSaving}
                className="px-5 py-2.5 rounded-xl bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 text-white text-sm font-semibold transition"
              >
                {bulkSaving ? "Saving..." : "Save Products"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
