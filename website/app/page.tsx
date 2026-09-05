import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { formatCommercialMoq } from "@/lib/moq";
import { COMPANY } from "@/lib/company";
import { cleanPublicProduct } from "@/lib/publicProductCopy";

export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

type FeaturedProduct = {
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  image?: string;
  moq?: string;
};

async function getFeatured(): Promise<FeaturedProduct[]> {
  const priority = [
    "red-chilli",
    "turmeric-powder",
    "coriander-seeds",
    "basmati-rice",
    "sona-masoori-rice",
    "spice-powders",
  ];
  const orderFeatured = (items: FeaturedProduct[]) =>
    [...items].sort((a, b) => {
      const ai = priority.indexOf(a.slug);
      const bi = priority.indexOf(b.slug);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(8)
      .returns<ProductRow[]>();
    if (error) return [];
    return orderFeatured(((data ?? []).map(productToApi) as FeaturedProduct[]).map(cleanPublicProduct));
  } catch {
    return [];
  }
}

const WHY_FEATURES = [
  {
    icon: "QC",
    title: "Quality-Focused Exports",
    desc: "Product discussions are handled around grade, quality expectations, packing, and buyer specifications.",
  },
  {
    icon: "PK",
    title: "Export-Compliant Packaging",
    desc: "Packaging options are planned around product handling, buyer requirements, and export documentation needs.",
  },
  {
    icon: "RS",
    title: "Reliable Supplier Coordination",
    desc: "Supplier communication is organised to support practical sourcing review and clear next steps.",
  },
  {
    icon: "BC",
    title: "Buyer-Centric Communication",
    desc: "Enquiries and order discussions are handled with practical updates and clear next steps.",
  },
];

const PROCUREMENT_STEPS = [
  "Product specification review",
  "Packing and MOQ discussion",
  "Company verification request",
  "Document checklist mapping",
  "Commercial quote preparation",
  "Shipment coordination planning",
];

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.webp"
            alt="Global Export Logistics"
            fill
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            quality={62}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071624]/80 via-[#08182F]/60 to-[#0E7490]/30" />
          <div className="hero-ambient absolute inset-0 opacity-70" aria-hidden="true" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1450px] px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:pt-32 lg:pb-28">
          <div className="hero-copy max-w-[680px]">
            <div className="flex items-center gap-4">
              <div className="h-[2px] w-14 bg-[#0E7490]" />
              <p className="text-[11px] font-black tracking-[0.26em] text-white/80">
                INDIA • GLOBAL TRADE
              </p>
            </div>

            <h1 className="mt-5 text-[38px] font-black leading-[0.96] tracking-[-0.04em] text-white sm:mt-6 sm:text-[48px] lg:text-[68px]">
              Indian Spices, Rice &<br />Agricultural Products<br />
              <span className="text-[#67C9D8]">for Global Markets.</span>
            </h1>

            <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7] text-slate-300 sm:mt-7 sm:text-[17px] sm:leading-[1.8]">
              Specification-led sourcing, packaging, documentation and shipment
              coordination for importers, distributors and food businesses.
            </p>

            <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row sm:mt-8 sm:flex-wrap sm:gap-4">
              <Link
                href="/products"
                prefetch={false}
                className="hero-cta rounded-lg bg-[#0E7490] px-6 py-3.5 text-center text-[12px] font-bold tracking-wide text-white shadow-lg transition hover:bg-[#0A5A70] hover:shadow-xl sm:px-8 sm:py-4 sm:text-[13px]"
              >
                Explore Products →
              </Link>
              <Link
                href="/contact"
                prefetch={false}
                className="hero-cta rounded-lg border border-white/25 bg-white/10 px-6 py-3.5 text-center text-[12px] font-bold tracking-wide text-white backdrop-blur-sm transition hover:bg-white/20 sm:px-8 sm:py-4 sm:text-[13px]"
              >
                Request a Quote →
              </Link>
              <Link
                href="/company-verification"
                prefetch={false}
                className="hero-cta inline-flex items-center justify-center px-2 py-3.5 text-center text-[12px] font-bold tracking-wide text-white transition hover:text-[#67C9D8] sm:px-1 sm:py-4 sm:text-[13px]"
              >
                Verify GOPU Exports →
              </Link>
            </div>

          </div>
          <div className="pointer-events-none absolute bottom-32 right-8 hidden w-[410px] lg:block">
            <div className="hero-motion-beam absolute -inset-8 rounded-[2rem]" aria-hidden="true" />
            <div className="hero-process-line absolute left-5 top-6 h-[calc(100%-48px)] w-px bg-cyan-200/35" aria-hidden="true" />
            <div className="grid gap-4">
            {["Specification Review", "Packing Options", "Documentation", "Shipment Planning"].map((item, index) => (
              <div
                key={item}
                className={`hero-float-card relative ml-8 rounded-2xl border border-cyan-100/25 bg-[#071624]/70 px-5 py-4 text-white shadow-2xl backdrop-blur-md ${index % 2 === 1 ? "hero-float-card-offset" : ""}`}
                style={{ animationDelay: `${index * 0.18}s` }}
              >
                <span className="hero-process-dot absolute -left-[33px] top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border border-[#9EE7EF] bg-[#0E7490] shadow-lg shadow-cyan-300/30" />
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#9EE7EF]">{item}</p>
                <p className="mt-1 text-xs text-white/70">Buyer-ready export support</p>
              </div>
            ))}
            </div>
          </div>
          <div className="hero-scroll-cue absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-white/70 sm:flex">
            <span className="h-9 w-5 rounded-full border border-white/35 p-1">
              <span className="block h-2 w-2 rounded-full bg-white/80" />
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#D9E2EC] bg-white">
        <div className="mx-auto flex max-w-[1450px] flex-col gap-4 px-6 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Corporate Verification</p>
            <p className="mt-1 text-[16px] font-black uppercase tracking-[-0.02em] text-[#0F172A]">{COMPANY.legalName}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-[12px] font-bold text-[#475569]">
            {["IEC Verified", "GST Registered", "CIN Registered", "Hyderabad Head Office", "Telangana Factory"].map((item) => (
              <span key={item} className="rounded-full border border-[#D9E2EC] bg-[#F8FAFC] px-3 py-1.5">{item}</span>
            ))}
          </div>
          <Link href="/company-verification" prefetch={false} className="text-[13px] font-black text-[#0E7490] transition hover:text-[#0A5A70]">
            View Corporate Verification →
          </Link>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">
                CORE EXPORT PORTFOLIO
              </p>
              <h2 className="mt-2 text-[34px] font-black tracking-[-0.04em] text-[#0F172A]">
                Core Export Portfolio
              </h2>
            </div>
            <Link
              href="/products"
              prefetch={false}
              className="hidden text-sm font-bold text-[#0E7490] transition hover:text-[#0A5A70] sm:block"
            >
              Explore Full Product Catalogue →
            </Link>
          </div>

          {featured.length === 0 && (
            <div className="col-span-4 rounded-2xl border border-dashed border-[#D9E2EC] bg-white py-16 text-center text-[#94A3B8]">
              <p className="text-[15px]">No featured products yet.</p>
              <p className="mt-1 text-[13px]">Add products and mark them as featured in the admin panel.</p>
            </div>
          )}
          <div className="-mx-6 overflow-hidden px-6 pb-3 sm:mx-0 sm:px-0">
            <div className="featured-products-track flex w-max gap-5">
              {[...featured.slice(0, 8), ...featured.slice(0, 8)].map((product: FeaturedProduct, index) => (
              <Link
                key={`${product.slug}-${index}`}
                href={`/products/${product.slug}`}
                prefetch={false}
                className="group w-[270px] flex-none overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:w-[300px]"
              >
                <div className="relative h-52 overflow-hidden">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 640px) 270px, 300px"
                      quality={58}
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#F0F9FA] text-4xl">📦</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0E7490] backdrop-blur-sm">
                    {product.category.toUpperCase()}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-[16px] font-black tracking-[-0.02em] text-[#0F172A]">
                    {product.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] italic text-[#64748B]">
                    {product.tagline}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3">
                    <span className="text-[12px] font-semibold text-[#475569]">
                      MOQ: {formatCommercialMoq(product)}
                    </span>
                    <span className="text-[12px] font-bold text-[#0E7490]">
                      VIEW DETAILS →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
            </div>
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              prefetch={false}
              className="inline-block rounded-lg border border-[#0E7490] px-6 py-3 text-sm font-bold text-[#0E7490]"
            >
              VIEW ALL PRODUCTS →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────────── */}
      <section className="bg-[#071624] py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-black tracking-[0.26em] text-[#67C9D8]">
              WHY IMPORTERS TRUST US
            </p>
            <h2 className="mt-3 text-[38px] font-black tracking-[-0.04em] text-white">
              The GOPU Exports Advantage
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[16px] leading-[1.8] text-slate-400">
              We structure each export discussion around product specification, packing,
              documentation, supplier coordination, and clear buyer communication.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-white/[0.10] bg-white/[0.06] p-6 shadow-sm shadow-black/10 transition hover:border-[#67C9D8]/50 hover:bg-white/[0.09]"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#67C9D8]/25 bg-[#67C9D8]/14 text-sm font-black tracking-wide text-[#9EE7EF]">
                  {f.icon}
                </span>
                <h3 className="mt-4 text-[16px] font-black tracking-[-0.01em] text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-[13px] leading-[1.75] text-slate-300">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/certifications"
              prefetch={false}
              className="rounded-lg border border-white/20 px-7 py-3.5 text-[13px] font-bold tracking-wide text-white transition hover:bg-white/10"
            >
              VIEW CERTIFICATIONS →
            </Link>
            <Link
              href="/about"
              prefetch={false}
              className="rounded-lg bg-[#0E7490] px-7 py-3.5 text-[13px] font-bold tracking-wide text-white transition hover:bg-[#0A5A70]"
            >
              ABOUT GOPU EXPORTS →
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXPORT MARKETS ───────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm">
            <div className="grid lg:grid-cols-2">

              {/* LEFT — map */}
              <div className="relative min-h-[340px] overflow-hidden bg-[#071624]">
                <div className="absolute inset-0">
                  <Image
                    src="/images/hero-export.webp"
                    alt="GOPU Exports container logistics and export coordination"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    quality={62}
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#071624]/20 via-[#071624]/5 to-white lg:block hidden" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071624]/45 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-white backdrop-blur-sm">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9EE7EF]">Export Coordination</p>
                  <p className="mt-1 max-w-[260px] text-sm font-semibold leading-6">Packing, documentation, verification, and shipment planning handled step by step.</p>
                </div>
              </div>

              {/* RIGHT — content */}
              <div className="p-10 lg:p-12">
                <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">
                  BUYER PROCUREMENT FLOW
                </p>
                <h2 className="mt-3 text-[34px] font-black leading-[1.05] tracking-[-0.04em] text-[#0F172A]">
                  Built Around Clear<br />Procurement Steps
                </h2>
                <p className="mt-4 text-[15px] leading-[1.8] text-[#64748B]">
                  Serious buyers need clarity before price discussions. GOPU Exports
                  structures each enquiry around product, packing, documentation,
                  verification, and shipment assumptions.
                </p>

                <div className="mt-7 flex flex-wrap gap-2.5">
                  {PROCUREMENT_STEPS.map((step) => (
                    <div
                      key={step}
                      className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:border-[#0E7490] hover:bg-[#E6F4F7]"
                    >
                      <span className="text-[#0E7490]">✓</span>
                      {step}
                    </div>
                  ))}
                </div>

                <Link
                  href="/company-verification"
                  prefetch={false}
                  className="mt-8 inline-flex items-center gap-2 text-[13px] font-bold text-[#0E7490] transition hover:text-[#0A5A70]"
                >
                  VIEW COMPANY VERIFICATION →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <Image
                src="/images/cta-ship.webp"
                alt="Container Ship"
                fill
                sizes="100vw"
                quality={62}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#071624]/95 via-[#08182F]/85 to-[#0E7490]/60" />
            </div>

            <div className="relative z-10 flex flex-col gap-8 px-10 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-16 lg:py-14">
              <div className="max-w-2xl">
                <p className="text-[11px] font-black tracking-[0.26em] text-[#67C9D8]">
                  START IMPORTING FROM INDIA
                </p>
                <h2 className="mt-3 text-[36px] font-black leading-[1.05] tracking-[-0.04em] text-white">
                  Ready To Source Indian<br />Agricultural Products?
                </h2>
                <p className="mt-4 text-[16px] leading-[1.8] text-slate-300">
                  Send product, grade, packing, quantity, destination, and document
                  requirements so the team can review sourcing feasibility and next steps.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Link
                  href="/contact"
                  prefetch={false}
                  className="rounded-lg bg-[#0E7490] px-8 py-4 text-center text-[13px] font-bold tracking-wide text-white shadow-lg transition hover:bg-[#0A5A70] hover:shadow-xl"
                >
                  GET A QUOTE →
                </Link>
                <a
                  href="https://wa.me/919618991917"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-[#22C55E]/50 bg-[#F0FDF4]/10 px-8 py-4 text-[13px] font-bold text-[#4ADE80] transition hover:bg-[#22C55E]/20"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WHATSAPP US
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
