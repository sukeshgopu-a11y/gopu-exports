import { publicMetadata } from "@/lib/seo";
import ProductsGrid from "@/components/ProductsGrid";
import { getPublicProducts } from "@/lib/publicCatalogue";

import { CATEGORY_LANDING_PAGES } from "@/lib/categoryLandingPages";


import Link from "next/link";

export const revalidate = 300;

export const metadata = publicMetadata(
  "Indian Agricultural Export Products",
  "Explore Indian spices, rice, millets, pulses and produce for international bulk orders. Review specifications and request an export quote from GOPU Exports.",
  "/products",
);

export default async function ProductsPage() {
  const products = await getPublicProducts();
  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[#D9E2EC] bg-[#061827]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(103,201,216,0.22),transparent_34%),linear-gradient(135deg,rgba(14,116,144,0.28),transparent_45%)]" />
        <div className="absolute right-0 top-0 h-full w-1/2 bg-[linear-gradient(135deg,transparent,rgba(255,255,255,0.08))]" />
        <div className="relative mx-auto max-w-[1280px] px-6 py-10 sm:px-8 sm:py-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#67C9D8]">Export catalogue</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">Indian Agricultural Export Products</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Indian spices, rice and selected agricultural products for international importers, distributors, wholesalers and food-service buyers.</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span className="text-slate-300">{products.length} products · {categories.length} categories</span>
            <a href="#catalogue" className="font-bold text-[#9EE7EF] underline underline-offset-4">Browse catalogue ↓</a>
            <Link href="/contact" className="rounded-lg bg-[#0E7490] px-4 py-2.5 font-semibold text-white hover:bg-[#0A5A70]">REQUEST EXPORT QUOTE</Link>
          </div>
        </div>
      </section>

      {/* ── GRID WITH FILTERS ────────────────────────────────── */}
      <section id="catalogue" className="mx-auto max-w-[1280px] px-6 py-8 sm:px-8">
        <ProductsGrid initialProducts={products} />
      </section>

      <section className="mx-auto max-w-[1450px] px-6 pb-14 sm:px-8">
        <div className="rounded-2xl border border-[#D9E2EC] bg-white p-7">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Category Buying Guides</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {CATEGORY_LANDING_PAGES.map((page) => (
              <Link
                key={page.slug}
                href={`/export/${page.slug}`}
                className="rounded-lg border border-[#D9E2EC] px-4 py-2.5 text-[13px] font-bold text-[#0F172A] transition hover:border-[#0E7490] hover:text-[#0E7490]"
              >
                {page.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-white border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8 text-center">
          <h2 className="text-[30px] font-black tracking-[-0.04em] text-[#0F172A]">
            Looking to Import from India?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-[#64748B]">
            International importers, distributors, and wholesale buyers can send product specifications, packing needs, quantity, destination, and document requirements for an export quotation.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#0E7490] px-8 py-4 text-[13px] font-bold tracking-wide text-white transition hover:bg-[#0A5A70]"
            >
              REQUEST EXPORT QUOTE →
            </Link>
            <a
              href="https://wa.me/919618991917"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[#22C55E]/50 px-8 py-4 text-[13px] font-bold text-[#16A34A] transition hover:bg-[#F0FDF4]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WHATSAPP US
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}

