import type { Metadata } from "next";
import ProductsGrid from "@/components/ProductsGrid";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Browse GOPU Exports' complete agricultural product catalogue — premium spices, basmati rice, fresh fruits, and vegetables for global importers.",
};

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#F5F7FA]">

      {/* ── HEADER ───────────────────────────────────────────── */}
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-10 bg-[#0E7490]" />
            <p className="text-[11px] font-black tracking-[0.26em] text-[#0E7490]">EXPORT CATALOGUE</p>
          </div>
          <h1 className="mt-4 text-[52px] font-black leading-none tracking-[-0.05em] text-[#0F172A] lg:text-[64px]">
            Our Products
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.8] text-[#64748B]">
            Premium Indian agricultural commodities — inspected, certified, and
            export-ready. Serving importers and distributors in 18+ countries.
          </p>
        </div>
      </section>

      {/* ── GRID WITH FILTERS ────────────────────────────────── */}
      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        <ProductsGrid />
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-white border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8 text-center">
          <h2 className="text-[30px] font-black tracking-[-0.04em] text-[#0F172A]">
            Don't See What You're Looking For?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-[#64748B]">
            We source a wide range of Indian agricultural commodities on request.
            Send us your product specifications and we'll get back to you within 24 hours.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="rounded-lg bg-[#0E7490] px-8 py-4 text-[13px] font-bold tracking-wide text-white transition hover:bg-[#0A5A70]"
            >
              REQUEST A PRODUCT →
            </a>
            <a
              href="https://wa.me/918712816876"
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
