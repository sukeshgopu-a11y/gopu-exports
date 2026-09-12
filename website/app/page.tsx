import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { COMPANY } from "@/lib/company";
import { cleanPublicProduct } from "@/lib/publicProductCopy";
import FeaturedProductsCarousel from "@/components/FeaturedProductsCarousel";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Indian Agricultural & Spice Exporter",
  description:
    "GOPU Exports is a Hyderabad-based Indian agricultural and spice export company supplying international importers, distributors, wholesalers and food businesses.",
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
    "spice-powders",
    "garam-masala",
    "basmati-rice",
    "sona-masoori-rice",
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
      .limit(6)
      .returns<ProductRow[]>();

    if (error) return [];
    return orderFeatured(((data ?? []).map(productToApi) as FeaturedProduct[]).map(cleanPublicProduct));
  } catch {
    return [];
  }
}

const EXPORT_CATEGORIES = [
  ["Spices & Spice Powders", "Whole spices, ground spices and selected blends for international B2B buyers."],
  ["Rice & Grains", "Indian rice and grain options reviewed against buyer specifications, packing and destination."],
  ["Pulses & Millets", "Selected pulses and millets for wholesale, food-service and ingredient buyers."],
  ["Fresh & Processed Products", "Selected fresh and processed agricultural products subject to availability and route suitability."],
];

const WHY_GOPU = [
  ["Verified Indian Company", "IEC, GST and CIN details are available for buyer verification."],
  ["Buyer-Specific Export Supply", "Product specifications, packing and quantity are reviewed against buyer requirements."],
  ["Export Documentation Support", "Documentation is reviewed according to product, destination and issuing-authority requirements."],
  ["Shipment Coordination", "Commercial and logistics communication is coordinated from order confirmation through dispatch."],
];

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="relative overflow-hidden bg-[#071624]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.webp"
            alt="GOPU Exports international agricultural export logistics"
            fill
            fetchPriority="high"
            loading="eager"
            sizes="100vw"
            quality={62}
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071624]/95 via-[#071624]/80 to-[#0E7490]/40" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1450px] px-6 py-24 sm:px-8 lg:py-32">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#67C9D8]">INDIA, DELIVERED GLOBALLY.</p>
          <h1 className="mt-5 max-w-4xl text-[44px] font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-[58px] lg:text-[76px]">
            Indian Agricultural & Spice Exporter
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-8 text-slate-300 sm:text-[18px]">
            Supplying international importers, distributors, wholesalers and food businesses with Indian spices, rice and selected agricultural products from Hyderabad, India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-[#0E7490] px-7 py-4 text-[13px] font-black uppercase tracking-wide text-white transition hover:bg-[#0A5A70]">
              Request Export Quote
            </Link>
            <Link href="/products" className="rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-[13px] font-black uppercase tracking-wide text-white transition hover:bg-white/15">
              View Products
            </Link>
          </div>
          <Link href="/company-verification" className="mt-5 inline-flex text-sm font-bold text-[#9EE7EF] hover:text-white">
            Verify GOPU Exports →
          </Link>
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="mx-auto max-w-[1450px] px-6 py-16 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">What We Export</p>
            <h2 className="mt-3 text-[34px] font-black tracking-[-0.04em]">Focused product categories for international buyers.</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {EXPORT_CATEGORIES.map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] p-6">
                <h3 className="text-lg font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">{text}</p>
              </div>
            ))}
          </div>
          <Link href="/products" className="mt-8 inline-flex text-sm font-black text-[#0E7490]">
            Explore All Products →
          </Link>
        </div>
      </section>

      <section className="py-18">
        <div className="mx-auto max-w-[1450px] px-6 py-16 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">Featured Export Products</p>
              <h2 className="mt-3 text-[34px] font-black tracking-[-0.04em]">Priority products for buyer enquiries.</h2>
            </div>
            <Link href="/products" className="text-sm font-black text-[#0E7490]">View Full Catalogue →</Link>
          </div>
          <div className="mt-8">
            {featured.length > 0 ? (
              <FeaturedProductsCarousel products={featured.slice(0, 6)} />
            ) : (
              <div className="rounded-2xl border border-dashed border-[#D9E2EC] bg-white px-6 py-12 text-center text-sm text-[#64748B]">
                Featured products will appear when approved catalogue data is available.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#FFF9EF] py-18">
        <div className="mx-auto max-w-[1450px] px-6 py-16 sm:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#7A5A20]">Why GOPU Exports</p>
          <h2 className="mt-3 max-w-3xl text-[34px] font-black tracking-[-0.04em]">Built for clear international B2B export transactions.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {WHY_GOPU.map(([title, text]) => (
              <div key={title} className="border border-[#E5D8BB] bg-white p-6">
                <h3 className="text-base font-black text-[#14231B]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-18">
        <div className="mx-auto max-w-[1450px] px-6 py-16 sm:px-8">
          <div className="grid gap-8 rounded-3xl border border-[#D9E2EC] bg-[#F8FAFC] p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">Company Verification</p>
              <h2 className="mt-3 text-[32px] font-black tracking-[-0.04em]">A company international buyers can verify.</h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#64748B]">
                {COMPANY.legalName} publishes its business identifiers and official contact information for buyer due diligence before commercial discussions.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-[#475569]">
                {["IEC", "GST", "CIN", "Hyderabad Head Office"].map((item) => (
                  <span key={item} className="rounded-full border border-[#D9E2EC] bg-white px-3 py-1.5">{item}</span>
                ))}
              </div>
            </div>
            <Link href="/company-verification" className="rounded-xl bg-[#071624] px-6 py-3.5 text-center text-sm font-black text-white">
              View Company Verification
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#071624] py-18 text-white">
        <div className="mx-auto max-w-[1450px] px-6 py-16 text-center sm:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">International Buyer Desk</p>
          <h2 className="mx-auto mt-3 max-w-3xl text-[38px] font-black tracking-[-0.04em]">Looking to Import from India?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-slate-300">
            Send your product, specification, quantity, packaging and destination requirements for an export quotation.
          </p>
          <Link href="/contact" className="mt-7 inline-flex rounded-xl bg-[#0E7490] px-8 py-4 text-sm font-black uppercase tracking-wide text-white">
            Request Export Quote
          </Link>
        </div>
      </section>
    </main>
  );
}
