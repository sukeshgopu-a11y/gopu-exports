"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, PackageCheck, Search, Ship, Star, X } from "lucide-react";
import { formatCommercialMoq } from "@/lib/moq";

type Product = {
  _id: string;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  image: string;
  description?: string;
  origin?: string;
  moq?: string;
  lead?: string;
  hs?: string;
  featured?: boolean;
};

const CATEGORY_ORDER = [
  "Rice & Grains",
  "Spices",
  "Spice Powders & Blends",
  "Millets",
  "Pulses",
  "Fresh Fruits",
  "Fresh Vegetables",
  "Oil Seeds",
  "Processed Agricultural Products",
  "Private Label / Packaging",
];

const CATEGORY_COPY: Record<string, string> = {
  "Rice & Grains": "Rice and grain options for importers, wholesalers, food-service buyers, and private-label packing discussions.",
  "Spices": "Whole spices and herbs for bulk spice buyers, processors, wholesalers, and food-service markets.",
  "Spice Powders & Blends": "Ground spices and blends for bulk supply, private-label projects, seasoning manufacturers, and retail packing.",
  Millets: "Indian millet options for health-food brands, grain wholesalers, ingredient buyers, and retail packing.",
  Pulses: "Pulses and lentils for wholesalers, millers, retail packers, and food manufacturing buyers.",
  "Fresh Fruits": "Fresh produce enquiries planned around season, grade, packing, destination, and transit route.",
  "Fresh Vegetables": "Fresh vegetable sourcing based on variety, packing, shelf life, route, and destination requirements.",
  "Oil Seeds": "Oil seed and kernel options for food processors, ingredient buyers, wholesalers, and edible oil discussions.",
  "Processed Agricultural Products": "Processed agri products and ingredients for food brands, wholesalers, and private-label supply.",
  "Private Label / Packaging": "Buyer-brand and packing discussions for suitable products, order sizes, and destination requirements.",
};

function sortCategories(a: string, b: string) {
  const ai = CATEGORY_ORDER.indexOf(a);
  const bi = CATEGORY_ORDER.indexOf(b);
  return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.localeCompare(b);
}

export default function ProductsGrid({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [active, setActive] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialProducts.length > 0) return;
    fetch("/api/products?active=true", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [initialProducts.length]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category))).sort(sortCategories)], [products]);
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return products.filter((p) => (
      (active === "All" || p.category === active) &&
      (!featuredOnly || p.featured) &&
      (!q || [p.title, p.tagline, p.category, p.origin, p.description].some((value) => (value ?? "").toLowerCase().includes(q)))
    ));
  }, [active, featuredOnly, products, query]);

  const grouped = categories
    .filter((category) => category !== "All")
    .map((category) => ({ category, products: filtered.filter((product) => product.category === category) }))
    .filter((group) => group.products.length > 0);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-80 animate-pulse rounded-2xl bg-white" />)}
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Buyer-ready filters", "Search by product, category, origin, or sourcing use case.", Search],
          ["Export detail cards", "Review MOQ, origin, lead time, HS code, and packing context.", PackageCheck],
          ["Fast enquiry path", "Open any product and send a product-specific quote request.", Ship],
        ].map(([title, text, Icon]) => (
          <div key={title as string} className="rounded-2xl border border-[#D9E2EC] bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F4F7] text-[#0E7490]">
              <Icon size={19} />
            </div>
            <h2 className="mt-4 text-[16px] font-black tracking-[-0.02em] text-[#0F172A]">{title as string}</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{text as string}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 rounded-3xl border border-[#D9E2EC] bg-white p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="relative max-w-xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, categories, origin, or use case..."
              className="w-full rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] py-3 pl-10 pr-10 text-sm outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/20"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#374151]">
                <X size={14} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFeaturedOnly((value) => !value)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition ${featuredOnly ? "bg-amber-400 text-[#0F172A]" : "border border-[#D9E2EC] bg-white text-[#374151] hover:border-amber-400"}`}
          >
            <Star size={15} />
            Featured only
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-bold transition ${active === cat ? "bg-[#0E7490] text-white" : "border border-[#D9E2EC] bg-white text-[#374151] hover:border-[#0E7490] hover:text-[#0E7490]"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-[#64748B]">
        <span><strong className="text-[#0F172A]">{filtered.length}</strong> export products</span>
        {(query || active !== "All" || featuredOnly) && (
          <button type="button" onClick={() => { setQuery(""); setActive("All"); setFeaturedOnly(false); }} className="font-bold text-[#0E7490]">
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-[#D9E2EC] bg-white py-16 text-center text-[#94A3B8]">
          No products found for this search.
        </div>
      ) : (
        <div className="mt-9 space-y-14">
          {grouped.map(({ category, products: categoryProducts }) => {
            const visible = expanded[category] || query || active !== "All" || featuredOnly ? categoryProducts : categoryProducts.slice(0, 8);
            const hasMore = categoryProducts.length > visible.length;
            return (
              <section key={category} className="scroll-mt-28">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Export category</p>
                    <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#0F172A]">{category}</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#64748B]">{CATEGORY_COPY[category] ?? "Products prepared for B2B enquiry discussions around grade, packing, quantity, destination, and documentation."}</p>
                  </div>
                  <span className="rounded-full bg-[#E6F4F7] px-3 py-1 text-xs font-bold text-[#0E7490]">{categoryProducts.length} products</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visible.map((product) => <ProductCard key={product.slug} product={product} />)}
                </div>
                {hasMore && (
                  <button type="button" onClick={() => setExpanded((prev) => ({ ...prev, [category]: true }))} className="mt-5 rounded-xl border border-[#D9E2EC] bg-white px-5 py-2.5 text-sm font-bold text-[#0E7490] transition hover:border-[#0E7490]">
                    View more {category}
                  </button>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group overflow-hidden rounded-[24px] border border-[#D9E2EC] bg-white shadow-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#A7DCE5] hover:shadow-2xl hover:shadow-slate-200/80">
      <div className="relative h-60 overflow-hidden bg-[#E6F4F7]">
        {product.image ? (
          <Image src={product.image} alt={`${product.title} export product photo`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" quality={62} className="object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center px-4 text-center text-sm font-bold text-[#0E7490]">{product.title}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#061827]/75 via-[#061827]/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0E7490] backdrop-blur-sm">{product.category.toUpperCase()}</span>
        {product.featured && <span className="absolute right-3 top-3 rounded-lg bg-[#0E7490] px-2.5 py-1 text-[10px] font-bold text-white">FEATURED</span>}
        <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-[12px] font-black text-[#0F172A] shadow-xl backdrop-blur">
            View export details
            <ArrowRight size={14} className="text-[#0E7490]" />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-[19px] font-black tracking-[-0.03em] text-[#0F172A]">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#64748B]">{product.tagline || product.description || "Export-ready product for B2B sourcing enquiries."}</p>
        <div className="mt-4 grid gap-2 rounded-2xl bg-[#F8FAFC] p-3">
          {product.origin && <Row label="Origin" value={product.origin.split(",")[0]} />}
          {product.moq && <Row label="MOQ" value={formatCommercialMoq(product)} />}
          {product.lead && <Row label="Lead time" value={product.lead} />}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          {product.hs ? <span className="text-[11px] font-semibold text-[#94A3B8]">HS: {product.hs}</span> : <span />}
          <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#0E7490] group-hover:underline">
            View details <ArrowRight size={13} />
          </span>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-[#F1F5F9] pt-4 text-[12px] font-semibold text-[#64748B]">
          <CheckCircle2 size={14} className="text-[#0E7490]" />
          Specification-led export enquiry
        </div>
      </div>
    </Link>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <span className="text-[#94A3B8]">{label}</span>
      <span className="text-right font-semibold text-[#374151]">{value}</span>
    </div>
  );
}
