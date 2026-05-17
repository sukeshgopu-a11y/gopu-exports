"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, CATEGORIES } from "@/lib/products";

export default function ProductsGrid() {
  const [active, setActive] = useState<string>("All");

  const filtered =
    active === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);

  return (
    <>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((cat) => (
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
                {cat === "All" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="mt-4 text-[13px] text-[#94A3B8]">
        Showing <span className="font-bold text-[#0F172A]">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
        {active !== "All" && <span> in <span className="font-semibold text-[#0E7490]">{active}</span></span>}
      </p>

      {/* Grid */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <Link
            key={product.slug}
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
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
              <p className="mt-1 text-[13px] italic text-[#64748B]">{product.tagline}</p>

              <div className="mt-4 space-y-1.5 border-t border-[#F1F5F9] pt-4">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#94A3B8]">Origin</span>
                  <span className="font-semibold text-[#374151]">{product.origin.split(",")[0]}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#94A3B8]">MOQ</span>
                  <span className="font-semibold text-[#374151]">{product.moq}</span>
                </div>
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#94A3B8]">Lead Time</span>
                  <span className="font-semibold text-[#374151]">{product.lead}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#94A3B8]">HS: {product.hs}</span>
                <span className="text-[12px] font-bold text-[#0E7490] group-hover:underline">
                  VIEW DETAILS →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[#94A3B8]">No products found in this category.</p>
        </div>
      )}
    </>
  );
}
