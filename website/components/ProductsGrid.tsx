"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";

type Product = {
  _id: string;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  image: string;
  origin?: string;
  moq?: string;
  lead?: string;
  hs?: string;
  featured?: boolean;
};

export default function ProductsGrid({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(initialProducts.length === 0);
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (initialProducts.length > 0) {
      return;
    }
    fetch("/api/products?active=true", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [initialProducts.length]);

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category))).sort(),
  ];

  const filtered = products.filter((p) => {
    const matchCat = active === "All" || p.category === active;
    const q = query.toLowerCase();
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      (p.tagline ?? "").toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.origin ?? "").toLowerCase().includes(q);
    return matchCat && matchQ;
  });

  if (loading) {
    return (
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
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

      {/* Category filters */}
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
            {cat}
            {active === cat && (
              <span className="ml-2 rounded-full bg-white/20 px-1.5 py-0.5 text-[11px]">
                {cat === "All"
                  ? products.length
                  : products.filter((p) => p.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mt-4 text-[13px] text-[#94A3B8]">
        Showing{" "}
        <span className="font-bold text-[#0F172A]">{filtered.length}</span>{" "}
        product{filtered.length !== 1 ? "s" : ""}
        {active !== "All" && (
          <span>
            {" "}in{" "}
            <span className="font-semibold text-[#0E7490]">{active}</span>
          </span>
        )}
        {query && (
          <span>
            {" "}matching{" "}
            <span className="font-semibold text-[#0E7490]">&quot;{query}&quot;</span>
          </span>
        )}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-[#94A3B8]">
            {products.length === 0
              ? "No products available yet."
              : "No products found for your search."}
          </p>
          {(query || active !== "All") && (
            <button
              onClick={() => { setQuery(""); setActive("All"); }}
              className="mt-3 text-[13px] font-semibold text-[#0E7490] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    quality={58}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[#F0F9FA] text-[#0E7490] text-4xl">
                    📦
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
                <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0E7490] backdrop-blur-sm">
                  {product.category.toUpperCase()}
                </span>
                {product.featured && (
                  <span className="absolute right-3 top-3 rounded-lg bg-[#0E7490] px-2.5 py-1 text-[10px] font-bold text-white">
                    FEATURED
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-[17px] font-black tracking-[-0.02em] text-[#0F172A]">
                  {product.title}
                </h3>
                {product.tagline && (
                  <p className="mt-1 text-[13px] italic text-[#64748B]">{product.tagline}</p>
                )}

                <div className="mt-4 space-y-1.5 border-t border-[#F1F5F9] pt-4">
                  {product.origin && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#94A3B8]">Origin</span>
                      <span className="font-semibold text-[#374151]">
                        {product.origin.split(",")[0]}
                      </span>
                    </div>
                  )}
                  {product.moq && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#94A3B8]">MOQ</span>
                      <span className="font-semibold text-[#374151]">{product.moq}</span>
                    </div>
                  )}
                  {product.lead && (
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-[#94A3B8]">Lead Time</span>
                      <span className="font-semibold text-[#374151]">{product.lead}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  {product.hs ? (
                    <span className="text-[11px] font-semibold text-[#94A3B8]">
                      HS: {product.hs}
                    </span>
                  ) : (
                    <span />
                  )}
                  <span className="text-[12px] font-bold text-[#0E7490] group-hover:underline">
                    VIEW DETAILS →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
