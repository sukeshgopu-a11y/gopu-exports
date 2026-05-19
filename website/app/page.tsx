import Image from "next/image";
import Link from "next/link";
import PublicCertificationBadges from "@/components/PublicCertificationBadges";
import { COMPANY } from "@/lib/company";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type FeaturedProduct = {
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  image?: string;
  moq?: string;
};

async function getFeatured(): Promise<FeaturedProduct[]> {
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
    return (data ?? []).map(productToApi) as FeaturedProduct[];
  } catch {
    return [];
  }
}

const TRUST_FEATURES = [
  ["Verification-first trade", "IEC, CIN, GST, official email, and phone are visible before commercial discussion."],
  ["Specification-led sourcing", "Enquiries start with grade, packing, quantity, destination, and document requirements."],
  ["Documentation support", "Commercial, origin, inspection, packing, and product-specific document needs are mapped early."],
  ["Buyer-focused communication", "The process prioritizes practical next steps, clear assumptions, and realistic timelines."],
];

const PROCESS = [
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
      <section className="relative overflow-hidden bg-[#071624]">
        <Image src="/images/hero-bg.webp" alt="Indian agricultural export logistics" fill priority sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#071624]/95 via-[#071624]/78 to-[#0E7490]/38" />
        <div className="relative z-10 mx-auto grid max-w-[1450px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:py-24">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#67C9D8]">Indian agricultural exports</p>
            <h1 className="mt-5 max-w-4xl text-[40px] font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-[56px] lg:text-[72px]">
              Verified export sourcing for serious global buyers.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300">
              GOPU Exports supports importers and procurement teams sourcing Indian spices, rice, and agricultural commodities with specification-led communication, documentation planning, and shipment coordination.
            </p>
            <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row">
              <Link href="/products" className="rounded-xl bg-[#0E7490] px-7 py-3.5 text-center text-sm font-black text-white transition hover:bg-[#0A5A70]">Explore Products</Link>
              <Link href="/company-verification" className="rounded-xl border border-white/25 bg-white/10 px-7 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/20">Verify Company</Link>
              <Link href="/contact" className="rounded-xl border border-white/25 px-7 py-3.5 text-center text-sm font-black text-white transition hover:bg-white/10">Request Quote</Link>
            </div>
            <div className="mt-8">
              <PublicCertificationBadges variant="dark" limit={5} />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-6 shadow-2xl backdrop-blur">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">Company identifiers</p>
            <div className="mt-5 grid gap-3">
              {[
                ["IEC", COMPANY.iec],
                ["CIN", COMPANY.cin],
                ["GST", COMPANY.gst],
                ["Email", COMPANY.email],
                ["Phone", COMPANY.phone],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">{label}</p>
                  <p className="mt-1 break-words text-sm font-black text-white">{value}</p>
                </div>
              ))}
            </div>
            <Link href="/company-verification" className="mt-5 inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-[#071624]">
              Request Verification Documents
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">Featured export catalogue</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">Featured Products</h2>
            </div>
            <Link href="/products" className="text-sm font-black text-[#0E7490]">View All Products &gt;</Link>
          </div>
          <div className="-mx-6 flex gap-5 overflow-x-auto px-6 pb-3 sm:mx-0 sm:px-0">
            {featured.map((product) => (
              <Link key={product.slug} href={`/products/${product.slug}`} className="group w-[270px] flex-none overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:w-[300px]">
                <div className="relative h-52 overflow-hidden bg-[#E6F4F7]">
                  {product.image && <Image src={product.image} alt={`${product.title} export product photo`} fill sizes="300px" quality={60} className="object-cover transition duration-500 group-hover:scale-105" />}
                  <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0E7490]">{product.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="text-[16px] font-black tracking-[-0.02em]">{product.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-[13px] text-[#64748B]">{product.tagline}</p>
                  <p className="mt-4 border-t border-[#F1F5F9] pt-3 text-[12px] font-bold text-[#0E7490]">View details &gt;</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#071624] py-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-10 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">Buyer trust system</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">The GOPU Exports Advantage</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              We structure each export discussion around product specification, packing, documentation, verification, and clear buyer communication.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_FEATURES.map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
                <h3 className="text-base font-black text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="grid gap-8 rounded-3xl border border-[#D9E2EC] bg-white p-7 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">Buyer verification flow</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Built around clear procurement steps.</h2>
              <p className="mt-4 text-sm leading-7 text-[#64748B]">
                Serious buyers need clarity before price discussions. GOPU Exports structures each enquiry around product, packing, documentation, verification, and shipment assumptions.
              </p>
              <Link href="/company-verification" className="mt-6 inline-flex rounded-xl bg-[#0E7490] px-5 py-3 text-sm font-black text-white">View Company Verification</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PROCESS.map((item) => (
                <div key={item} className="rounded-2xl bg-[#F8FAFC] p-4 text-sm font-bold text-[#0F172A]">
                  <span className="mr-2 text-[#0E7490]">✓</span>{item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="rounded-3xl bg-[#0E7490] p-8 text-center text-white sm:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/70">Start procurement discussion</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">Ready to source Indian agricultural products?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/85">
              Send product, grade, packing, quantity, destination, and document requirements so the team can review sourcing feasibility and next steps.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="rounded-xl bg-white px-7 py-3.5 text-sm font-black text-[#0E7490]">Send Enquiry</Link>
              <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="rounded-xl border border-white/30 px-7 py-3.5 text-sm font-black text-white">WhatsApp Inquiry</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
