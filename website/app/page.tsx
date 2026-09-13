import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { COMPANY } from "@/lib/company";
import { cleanPublicProduct } from "@/lib/publicProductCopy";
import { publicMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = publicMetadata(
  "Indian Spice & Rice Exporter in Hyderabad",
  "GOPU Exports supplies Indian spices, rice and agricultural products to international importers and distributors. Based in Hyderabad, Telangana. Request an export quote.",
  "/",
);

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

const categories = [
  ["Spices", "/export/spice-exporters-from-india"],
  ["Rice", "/export/rice-exporters-from-india"],
  ["Millets", "/export/millet-suppliers-india"],
  ["Fresh vegetables", "/export/fresh-vegetables-exporters-india"],
];
const steps = [
  ["Tell us what you import", "Send the product, grade, quantity and destination country."],
  ["Agree the order", "Confirm specifications, samples where needed, packaging and commercial terms."],
  ["Prepare for export", "Coordinate product checks, packing and the agreed shipment documents."],
  ["Arrange shipment", "Confirm the freight plan and receive dispatch and document updates."],
];
const faqs = [
  ["Who can request an export quote?", "Importers, distributors, wholesalers, food-service businesses and private-label brands. Include your company name and destination country."],
  ["What is the minimum order?", "MOQ depends on the product, pack size and destination. Share your trial or repeat-order quantity so we can confirm availability and freight feasibility."],
  ["Can I request samples, lab reports or private-label packs?", "Yes. Tell us what you need when you enquire. Availability, testing scope, sample charges and packaging quantities are confirmed in the quotation."],
];

export default async function HomePage() {
  const featured = (await getFeatured()).slice(0, 4);
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="relative overflow-hidden bg-[#071624] text-white">
        <Image src="/images/hero-bg.webp" alt="Cargo ship at an international container terminal" fill fetchPriority="high" loading="eager" sizes="100vw" quality={62} className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071624]/95 via-[#071624]/80 to-[#071624]/35" />
        <div className="relative mx-auto max-w-[1280px] px-6 py-14 sm:px-8 sm:py-20">
          <p className="text-sm font-bold tracking-[0.16em] text-[#9EE7EF]">INDIA, DELIVERED GLOBALLY.</p>
          <h1 className="mt-5 max-w-[800px] text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Indian spices &amp; rice.<br /><span className="text-[#9EE7EF]">Exported for your business.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">GOPU Exports is an Indian agricultural and food-products export company in Hyderabad, Telangana, supplying international importers, distributors and wholesale buyers.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-lg bg-[#0E7490] px-6 py-3.5 text-base font-bold text-white hover:bg-[#0A5A70]">Request an export quote</Link>
            <Link href="/products" className="rounded-lg border border-white/50 px-6 py-3.5 text-base font-bold text-white hover:bg-white/10">Explore products</Link>
          </div>
          <p className="mt-6 text-sm text-slate-300">Indian products · Buyer-specific packing · Export documentation · Shipment coordination</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-widest text-[#0E7490]">Export catalogue</p><h2 className="mt-2 text-3xl font-bold">Products for your market</h2></div>
          <Link href="/products" className="text-base font-bold text-[#0E7490]">View all products →</Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {categories.map(([label, href]) => <Link key={href} href={href} className="rounded-lg border border-[#D9E2EC] bg-white px-4 py-3 text-base font-semibold hover:border-[#0E7490]">{label} →</Link>)}
        </div>
        {featured.length > 0 && <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {featured.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} className="overflow-hidden rounded-xl border border-[#D9E2EC] bg-white transition hover:border-[#0E7490]">
            {product.image && <div className="relative aspect-[4/3] bg-slate-100"><Image src={product.image} alt={product.title} fill sizes="(max-width: 1024px) 45vw, 280px" className="object-cover" /></div>}
            <div className="p-4"><p className="text-xs font-bold uppercase tracking-wide text-[#0E7490]">{product.category}</p><h3 className="mt-2 text-lg font-bold">{product.title}</h3><p className="mt-3 text-sm font-semibold text-[#0E7490]">Specifications &amp; export enquiry →</p></div>
          </Link>)}
        </div>}
      </section>

      <section className="border-y border-[#D9E2EC] bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-12 sm:px-8 lg:grid-cols-2">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0E7490]">Company &amp; verification</p><h2 className="text-3xl font-bold">Your export partner in India</h2><p className="mt-4 text-base leading-7 text-[#475569]">From product selection to shipment, work with one export team on specifications, packaging and order documents. Our Hyderabad head office is your contact for Indian agricultural exports.</p><Link href="/about" className="mt-4 inline-block font-bold text-[#0E7490]">About GOPU Exports →</Link></div>
          <div><p className="font-bold">{COMPANY.legalName}</p><dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">{[["IEC", COMPANY.iec], ["GSTIN", COMPANY.gst], ["CIN", COMPANY.cin]].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg bg-[#F5F7FA] p-3 last:sm:col-span-2"><dt className="font-bold text-[#0E7490]">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl><Link href="/company-verification" className="mt-4 inline-block font-bold text-[#0E7490]">Review company documents →</Link><p className="mt-2 text-sm text-[#475569]">Product testing and inspection requirements are agreed for each order.</p></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0E7490]">How exports work</p><h2 className="text-3xl font-bold">From your enquiry to shipment</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([title, description], index) => <li key={title} className="border-t-2 border-[#0E7490] pt-4"><p className="text-sm font-bold text-[#0E7490]">0{index + 1}</p><h3 className="mt-2 text-lg font-bold">{title}</h3><p className="mt-2 text-base leading-7 text-[#475569]">{description}</p></li>)}</ol>
        <Link href="/resources/export-process" className="mt-6 inline-block font-bold text-[#0E7490]">Read the export process →</Link>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-12 sm:px-8 lg:grid-cols-2">
          <div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0E7490]">Buyer information</p><h2 className="text-3xl font-bold">Planning your next import?</h2><p className="mt-4 text-base leading-7 text-[#475569]">Tell us your destination country and delivery port. We review product availability, packaging and shipment requirements before confirming your order.</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-base font-bold text-[#0E7490]"><Link href="/markets">International buyer information →</Link><Link href="/resources/packaging-standards">Packing options →</Link></div><p className="mt-6 text-base leading-7 text-[#475569]">Explore <Link className="underline" href="/export/agricultural-exporter-hyderabad-telangana">our Hyderabad export business</Link> and <Link className="underline" href="/export/andhra-pradesh-chilli-rice-exports">chilli and rice from Andhra Pradesh</Link>.</p></div>
          <div className="divide-y divide-[#D9E2EC] rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] px-5">{faqs.map(([question, answer]) => <details key={question} className="py-4"><summary className="cursor-pointer text-base font-bold leading-7">{question}</summary><p className="mt-3 text-base leading-7 text-[#475569]">{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="bg-[#071624] text-white">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-3xl font-bold">Import Indian products with GOPU Exports</h2><p className="mt-3 text-base leading-7 text-slate-300">Send your product, quantity and destination. Start with an export quote.</p></div><div className="flex shrink-0 flex-wrap gap-3"><Link href="/contact" className="rounded-lg bg-[#0E7490] px-6 py-3.5 font-bold hover:bg-[#0A5A70]">Request an export quote</Link><a href={`${COMPANY.whatsapp}?text=${encodeURIComponent("Hello GOPU Exports, I would like an export quote. Product: Quantity: Destination country: Port:")}`} target="_blank" rel="noreferrer" className="rounded-lg border border-white/40 px-6 py-3.5 font-bold hover:bg-white/10">WhatsApp export team</a></div></div>
      </section>
    </main>
  );
}
