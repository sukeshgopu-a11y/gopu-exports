import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { getPublicProducts } from "@/lib/publicCatalogue";
import { serializeJsonLd } from "@/lib/jsonLd";
import { publicMetadata, SITE_URL } from "@/lib/seo";

export const revalidate = 300;
export const metadata = { ...publicMetadata("Indian Agricultural & Spice Exporter", "Import Indian spices, rice, pulses and agricultural products from GOPU Exports, Hyderabad. Discuss product specifications, export packing and bulk quotations.", "/"), title: { absolute: "GOPU Exports | Indian Agricultural & Spice Exporter" } };

const categories = [
  { title: "Whole spices", copy: "Chilli, turmeric, cumin and other whole spices.", links: [["Explore whole spices", "/export/spice-exporters-from-india"]] },
  { title: "Spice powders & blends", copy: "Ground spices and masalas for food businesses.", links: [["Explore powders & blends", "/export/spice-powder-exporter-india"]] },
  { title: "Rice & grains", copy: "Basmati, non-basmati and regional rice varieties.", links: [["Explore rice & grains", "/export/rice-exporters-from-india"]] },
  { title: "Millets", copy: "Millet varieties for wholesale and ingredient buyers.", links: [["Explore millets", "/export/millet-suppliers-india"]] },
  { title: "Pulses", copy: "Pulses and lentils for bulk buying requirements.", links: [["Explore pulses", "/products?category=Pulses"]] },
  { title: "Fresh produce", copy: "Plan around season, grade and destination.", links: [["Fruits", "/products?category=Fresh%20Fruits"], ["Vegetables", "/export/fresh-vegetables-exporters-india"]] },
  { title: "Oil seeds", copy: "Seeds and kernels for food and ingredient buyers.", links: [["Explore oil seeds", "/products?category=Oil%20Seeds"]] },
  { title: "Processed agricultural products", copy: "Selected food ingredients and processed products.", links: [["Explore processed products", "/products?category=Processed%20Agricultural%20Products"]] },
];
const steps = [
  ["Share your requirement", "Tell us the product, grade, quantity, packing and destination port.", "/resources/export-enquiry-support"],
  ["Review the offer", "Confirm availability, specifications, testing scope and commercial terms.", "/resources/quality-control"],
  ["Agree the order", "Confirm the sample or specification, payment terms and document checklist in writing.", "/resources/documentation-support"],
  ["Plan the shipment", "Agree packing, dispatch timing and freight arrangements for the confirmed order.", "/resources/logistics-shipping"],
];
const primary = "inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7490] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0A5A70]";

export default async function HomePage() {
  const products = await getPublicProducts();
  const priority = ["red-chilli", "turmeric-fingers", "cumin-seeds", "basmati-rice", "turmeric-powder", "red-chilli-powder"];
  const featured = priority.flatMap(slug => products.filter(product => product.slug === slug));
  return <main className="bg-[#F5F7FA] text-[#0F172A]">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
      "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`,
      url: SITE_URL, name: "GOPU Exports", publisher: { "@id": `${SITE_URL}/#organization` },
    }) }} />
    <section className="relative overflow-hidden bg-[#071624] text-white">
      <Image src="/images/hero-bg.webp" alt="Cargo ship at an international container terminal" fill fetchPriority="high" loading="eager" sizes="100vw" quality={62} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071624]/95 via-[#071624]/85 to-[#071624]/55" />
      <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.5fr_0.8fr]">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-[#9EE7EF]">INDIA, DELIVERED GLOBALLY.</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[56px]">Indian Agricultural &amp; Spice Exporter</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">Indian spices, rice and agricultural products for importers, distributors and food businesses. Work with our Hyderabad team on specifications, packing and export quotations.</p>
          <div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className={primary}>Request an export quote <ArrowRight size={16} /></Link><Link href="/products" className="rounded-lg border border-white/50 px-6 py-3.5 text-sm font-bold hover:bg-white/10">Explore the catalogue</Link></div>
          <p className="mt-6 text-sm text-slate-300">Based in Hyderabad, India <span aria-hidden="true">·</span> B2B export enquiries</p>
        </div>
        <aside className="rounded-2xl border border-white/20 bg-[#071624]/85 p-6 sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#9EE7EF]">Your buying brief</p>
          <h2 className="mt-3 text-2xl font-semibold">A clear enquiry starts here.</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-slate-200">{["Product and required grade", "Quantity and preferred packing", "Destination port and delivery timing"].map(item => <li key={item} className="flex gap-3"><CheckCircle2 size={18} className="mt-1 shrink-0 text-[#9EE7EF]" />{item}</li>)}</ul>
          <p className="mt-5 border-t border-white/15 pt-5 text-sm leading-6 text-slate-300">Availability, price and shipment terms are confirmed for each requirement.</p>
          <Link href="/resources/buyer-faq" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#9EE7EF] underline underline-offset-4">First time importing? Read the buyer FAQ <ArrowRight size={14} /></Link>
        </aside>
      </div>
    </section>
    <section className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0E7490]">The export catalogue</p><h2 className="mt-3 text-3xl font-bold">Find the right product for your market.</h2></div><Link href="/products" className="text-sm font-bold text-[#0E7490] underline underline-offset-4">View all products</Link></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{categories.map(category => <div key={category.title} className="flex flex-col rounded-xl border border-[#D9E2EC] bg-white p-5"><h3 className="text-lg font-semibold">{category.title}</h3><p className="mt-2 text-sm leading-6 text-[#475569]">{category.copy}</p><div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 pt-5">{category.links.map(([label, href]) => <Link key={href} href={href} className="inline-flex items-center gap-1 text-sm font-bold text-[#0E7490] hover:underline">{label} <ArrowRight size={14} /></Link>)}</div></div>)}</div>
    </section>
    <section className="border-y border-[#D9E2EC] bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8 sm:py-16"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0E7490]">Start your shortlist</p><h2 className="mt-3 text-3xl font-bold">Featured export products</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#475569]">Review product information, download a specification sheet and send a product-specific enquiry.</p>
        <div className="mt-7 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{featured.map(product => <Link key={product.slug} href={"/products/" + product.slug} className="group overflow-hidden rounded-xl border border-[#D9E2EC] transition hover:border-[#0E7490] hover:shadow-md">
          {product.image && <div className="relative aspect-square bg-slate-100"><Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 190px" className="object-cover" /></div>}
          <div className="p-4"><h3 className="font-semibold leading-6">{product.title}</h3><p className="mt-3 text-xs font-semibold text-[#0E7490] group-hover:underline">View specifications →</p></div>
        </Link>)}</div>
      </div>
    </section>
    <section className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8 sm:py-16"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0E7490]">From enquiry to shipment</p><h2 className="mt-3 text-3xl font-bold">Know what happens next.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#475569]">Product requirements and order terms are reviewed before a commitment is made.</p>
      <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{steps.map(([title, copy, href], index) => <li key={title} className="border-t border-[#B8D3DB] pt-5"><span className="text-sm font-bold text-[#0E7490]">0{index + 1}</span><h3 className="mt-3 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#475569]">{copy}</p><Link href={href} className="mt-4 inline-block text-sm font-semibold text-[#0E7490] underline underline-offset-4">{title} guide</Link></li>)}</ol>
    </section>
    <section className="border-y border-[#D9E2EC] bg-white"><div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-2">
      <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0E7490]">Buyer due diligence</p><h2 className="mt-3 text-3xl font-bold">Know the company behind your enquiry.</h2><p className="mt-4 text-base leading-7 text-[#475569]">{COMPANY.legalName}, headquartered in Hyderabad, Telangana. Review our published business identifiers and request the documents relevant to your purchase.</p><p className="mt-3 text-sm leading-6 text-[#64748B]">Company registration identifies the business. Product testing, compliance documents and shipment requirements are reviewed separately.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3"><Link href="/company-verification" className="text-sm font-bold text-[#0E7490] underline underline-offset-4">Company verification</Link><Link href="/export/agricultural-exporter-hyderabad-telangana" className="text-sm font-bold text-[#0E7490] underline underline-offset-4">Our Hyderabad office</Link></div></div>
      <dl className="grid gap-3 sm:grid-cols-2">{[["IEC", COMPANY.iec], ["GST", COMPANY.gst], ["CIN", COMPANY.cin], ["Head office", "Hyderabad, Telangana, India"]].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg bg-[#F5F7FA] p-5"><dt className="text-xs font-bold text-[#0E7490]">{label}</dt><dd className="mt-2 break-words text-sm font-semibold leading-6">{value}</dd></div>)}</dl>
    </div></section>
    <section className="bg-[#071624] text-white"><div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-12 sm:px-8 sm:py-16 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-3xl font-bold">Let’s discuss your import requirement.</h2><p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Send your product, quantity, packing and destination. Include any testing or documentation requirements with your enquiry.</p><a href={`mailto:${COMPANY.email}`} className="mt-4 inline-block text-sm text-[#9EE7EF] underline underline-offset-4">{COMPANY.email}</a></div><Link href="/contact" className={`${primary} shrink-0`}>Request an export quote <ArrowRight size={16} /></Link></div></section>
  </main>;
}
