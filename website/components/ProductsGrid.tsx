"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Star, X } from "lucide-react";
import {
  CATEGORY_ORDER,
  categoryIntro,
  categoryLabel,
  localizedProductDescription,
  uiForLocale,
} from "@/lib/localizedContent";

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

export default function ProductsGrid({
  initialProducts = [],
  locale = "en",
}: {
  initialProducts?: Product[];
  locale?: string;
}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [active, setActive] = useState("All");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { text } = uiForLocale(locale);

  useEffect(() => {
    if (initialProducts.length > 0) return;
    fetch("/api/products?active=true", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [initialProducts.length]);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))).sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a);
      const bi = CATEGORY_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi) || a.localeCompare(b);
    }),
  ];

  const filtered = products.filter((p) => {
    const q = query.toLowerCase();
    return (
      (active === "All" || p.category === active) &&
      (!featuredOnly || p.featured) &&
      (!q ||
        p.title.toLowerCase().includes(q) ||
        (p.tagline ?? "").toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.origin ?? "").toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q))
    );
  });

  const grouped = categories
    .filter((category) => category !== "All")
    .map((category) => ({ category, products: filtered.filter((product) => product.category === category) }))
    .filter((group) => group.products.length > 0);

  if (loading) {
    return (
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`${text.common.searchProducts}...`}
          className="w-full rounded-xl border border-[#D9E2EC] bg-white py-3 pl-10 pr-10 text-[13px] outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/20"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#374151]"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-xl px-5 py-2.5 text-[13px] font-bold transition ${
              active === cat
                ? "bg-[#0E7490] text-white shadow-md"
                : "border border-[#D9E2EC] bg-white text-[#374151] hover:border-[#0E7490] hover:text-[#0E7490]"
            }`}
          >
            {cat === "All" ? text.common.all : categoryLabel(cat, locale)}
          </button>
        ))}
        <button
          onClick={() => setFeaturedOnly((value) => !value)}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold transition ${
            featuredOnly
              ? "bg-amber-400 text-[#0F172A] shadow-md"
              : "border border-[#D9E2EC] bg-white text-[#374151] hover:border-amber-400"
          }`}
        >
          <Star size={14} />
          {text.common.featured}
        </button>
      </div>

      <p className="mt-4 text-[13px] text-[#94A3B8]">
        <span className="font-bold text-[#0F172A]">{filtered.length}</span> {text.common.productCount}
      </p>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[#94A3B8]">{text.common.noProducts}</p>
          <button
            onClick={() => {
              setQuery("");
              setActive("All");
              setFeaturedOnly(false);
            }}
            className="mt-3 text-[13px] font-semibold text-[#0E7490] hover:underline"
          >
            {text.common.clearFilters}
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-12">
          {grouped.map(({ category, products: categoryProducts }) => {
            const visible = expanded[category] || query || featuredOnly || active !== "All"
              ? categoryProducts
              : categoryProducts.slice(0, 8);
            const hasMore = categoryProducts.length > visible.length;
            return (
              <section key={category} className="scroll-mt-28">
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-[-0.04em] text-[#0F172A]">
                      {categoryLabel(category, locale)}
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-[#64748B]">
                      {categoryIntro(category, locale)}
                    </p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0E7490]">
                    {categoryProducts.length} {text.common.productCount}
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {visible.map((product) => (
                    <ProductCard key={product.slug} product={product} locale={locale} />
                  ))}
                </div>
                {hasMore && (
                  <button
                    onClick={() => setExpanded((prev) => ({ ...prev, [category]: true }))}
                    className="mt-5 rounded-xl border border-[#D9E2EC] bg-white px-5 py-2.5 text-sm font-bold text-[#0E7490] transition hover:border-[#0E7490]"
                  >
                    {text.common.viewMore} {categoryLabel(category, locale)}
                  </button>
                )}
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function ProductCard({ product, locale }: { product: Product; locale: string }) {
  const { text } = uiForLocale(locale);
  return (
    <Link
      href={locale === "en" ? `/products/${product.slug}` : `/${locale}/products/${product.slug}`}
      className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-56 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={`${product.title} product photo`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            quality={60}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#F0F9FA] px-4 text-center text-sm font-bold text-[#0E7490]">
            {product.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
        <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0E7490] backdrop-blur-sm">
          {categoryLabel(product.category, locale).toUpperCase()}
        </span>
        {product.featured && (
          <span className="absolute right-3 top-3 rounded-lg bg-[#0E7490] px-2.5 py-1 text-[10px] font-bold text-white">
            {text.common.featured.toUpperCase()}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-[17px] font-black tracking-[-0.02em] text-[#0F172A]">{product.title}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[#64748B]">
          {locale === "en"
            ? product.tagline || product.description
            : localizedProductDescription(product.title, product.category, locale)}
        </p>
        <div className="mt-4 space-y-1.5 border-t border-[#F1F5F9] pt-4">
          {product.origin && (
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <span className="text-[#94A3B8]">{text.common.origin}</span>
              <span className="text-right font-semibold text-[#374151]">{product.origin.split(",")[0]}</span>
            </div>
          )}
          {product.moq && (
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <span className="text-[#94A3B8]">{text.common.moq}</span>
              <span className="text-right font-semibold text-[#374151]">{product.moq}</span>
            </div>
          )}
          {product.lead && (
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <span className="text-[#94A3B8]">{text.common.leadTime}</span>
              <span className="text-right font-semibold text-[#374151]">{product.lead}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          {product.hs ? <span className="text-[11px] font-semibold text-[#94A3B8]">{text.common.hs}: {product.hs}</span> : <span />}
          <span className="text-[12px] font-bold text-[#0E7490] group-hover:underline">{text.common.viewDetails} →</span>
        </div>
      </div>
    </Link>
  );
}
