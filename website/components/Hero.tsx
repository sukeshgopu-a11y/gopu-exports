/**
 * GOPU Exports — Hero Section
 *
 * ✅ Self-contained (no external Container / Button / next/image deps)
 * ✅ React + TypeScript + Tailwind CSS (Vite stack)
 * ✅ SEO-ready: semantic HTML, descriptive alt text, h1 hierarchy
 * ✅ Mobile-first responsive layout
 * ✅ Performance: CSS-only visuals, lazy image, no heavy JS
 * ✅ Accessible: ARIA labels, focus-visible rings, contrast-safe palette
 * ✅ WhatsApp CTA included (wa.me format per project spec)
 */

import React from "react";

/* ─── Replace these with your real values before going live ─────────────── */
const WHATSAPP_NUMBER = "919999999999"; // E.164 without +
const HERO_IMAGE_SRC = "/images/hero-export.jpg"; // optimise: WebP, ~120 KB
/* ────────────────────────────────────────────────────────────────────────── */

interface StatItem {
  value: string;
  label: string;
}

const stats: StatItem[] = [
  { value: "20+", label: "Export Products" },
  { value: "15+", label: "Countries Served" },
  { value: "100%", label: "Quality Focused" },
];

export default function Hero(): React.ReactElement {
  return (
    <section
      aria-label="GOPU Exports — Premium Indian Agricultural Exporter"
      className="relative overflow-hidden bg-[#F5F7FA] py-20 sm:py-24 lg:py-32"
    >
      {/* Subtle decorative circles — CSS only, zero JS cost */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#E6F4F7] opacity-60"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-[#E6F4F7] opacity-50"
      />

      {/* ── Max-width container ─────────────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          {/* ── Left column: copy ──────────────────────────────────────── */}
          <div className="order-2 lg:order-1">

            {/* Trust badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full border border-[#B2D8E0] bg-[#E6F4F7] px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0E7490]"
              role="note"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#0E7490]" />
              Trusted Global Export Partner
            </div>

            {/*
              h1 — one per page, keyword-rich, matches realistic search intent.
              Project spec: "Indian spices exporter", "agriproducts exporter from India"
            */}
            <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-[#0F172A] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.12]">
              Premium Indian{" "}
              <span className="text-[#0E7490]">Agricultural Exports</span>{" "}
              for Global Markets
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#475569] sm:text-lg sm:leading-8">
              GOPU Exports supplies spices, fruits, vegetables, and agriproducts
              directly sourced from Indian farmers — packed, documented, and shipped
              to importers, wholesalers, and distributors worldwide.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-[#0E7490] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-[#0c6278] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
              >
                Explore Products
              </a>

              <a
                href="/enquiry"
                className="inline-flex items-center justify-center rounded-lg border border-[#0E7490] bg-white px-6 py-3 text-sm font-semibold text-[#0E7490] shadow-sm transition-colors duration-150 hover:bg-[#F0FAFC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
              >
                Send Enquiry
              </a>

              {/* WhatsApp — floating version is separate; this is an inline secondary CTA */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact GOPU Exports on WhatsApp"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#22C55E] bg-white px-5 py-3 text-sm font-semibold text-[#16A34A] shadow-sm transition-colors duration-150 hover:bg-[#F0FDF4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]"
              >
                {/* Inline SVG — no extra icon library needed */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>

            {/* Divider + stats */}
            <div className="mt-10 border-t border-[#D9E2EC] pt-8">
              <dl className="grid grid-cols-3 gap-4 sm:gap-8">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd>
                      <span className="block text-2xl font-bold text-[#0F172A] sm:text-3xl">
                        {value}
                      </span>
                      <span className="mt-1 block text-xs text-[#64748B] sm:text-sm">
                        {label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* ── Right column: image ─────────────────────────────────────── */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              {/* Offset shadow card for depth — pure CSS */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-[1.75rem] bg-[#CBD5E1] sm:translate-x-4 sm:translate-y-4"
              />

              <div className="relative overflow-hidden rounded-[1.75rem] border border-[#D9E2EC] bg-white shadow-sm">
                <img
                  src={HERO_IMAGE_SRC}
                  alt="Indian agricultural products ready for international export — spices, fruits, and vegetables sourced directly from Indian farmers by GOPU Exports"
                  width={800}
                  height={900}
                  /*
                    loading="eager" for above-the-fold LCP image.
                    Switch to loading="lazy" for any below-fold images.
                    Use fetchpriority="high" if supported by your env.
                  */
                  loading="eager"
                  decoding="async"
                  className="h-64 w-full object-cover sm:h-80 lg:h-[580px]"
                />

                {/* Floating product-origin badge — adds buyer confidence */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-auto">
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#D9E2EC] bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-sm">
                    <span className="text-lg" aria-hidden="true">🇮🇳</span>
                    <div>
                      <p className="text-xs font-semibold text-[#0F172A]">
                        Farm-Origin Sourcing
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Spices · Fruits · Vegetables
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}