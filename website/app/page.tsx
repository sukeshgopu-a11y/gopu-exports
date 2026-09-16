import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";
import { getPublicProducts } from "@/lib/publicCatalogue";
import { publicMetadata } from "@/lib/seo";

export const revalidate = 300;
export const metadata = { ...publicMetadata("Indian Agricultural & Spice Exporter", "GOPU Exports is a Hyderabad-based Indian agricultural export company supplying spices, rice and selected food products to international importers, distributors and B2B buyers.", "/"), title: { absolute: "GOPU Exports | Indian Agricultural & Spice Exporter" } };
const categories = [
  ["Spices & Spice Powders", "/export/spice-exporters-from-india"],
  ["Rice & Grains", "/export/rice-exporters-from-india"],
  ["Pulses & Millets", "/products?category=Pulses"],
  ["Fresh & Processed Agricultural Products", "/products?category=Processed%20Agricultural%20Products"],
];
const benefits = [
  ["Verified Indian Company", "Published IEC, GST and CIN for buyer due diligence."],
  ["Buyer-Specific Export Supply", "Product grade and packing agreed around your requirements."],
  ["Export Documentation Support", "Document requirements reviewed for your product and destination."],
  ["Shipment Coordination", "Packing, dispatch and freight arrangements agreed for each order."],
];
const primary = "inline-block rounded-lg bg-[#0E7490] px-6 py-3.5 text-sm font-bold text-white hover:bg-[#0A5A70]";
export default async function HomePage() {
  const priority = ["red-chilli", "turmeric-powder", "red-chilli-powder", "garam-masala", "basmati-rice", "turmeric-fingers"];
  const products = await getPublicProducts();
  const featured = priority.flatMap(slug => products.filter(product => product.slug === slug));
  return <main className="bg-[#F5F7FA] text-[#0F172A]">
    <section className="relative overflow-hidden bg-[#071624] text-white">
      <Image src="/images/hero-bg.webp" alt="Cargo ship at an international container terminal" fill fetchPriority="high" loading="eager" sizes="100vw" quality={62} className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#071624]/95 via-[#071624]/80 to-[#071624]/35" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-14 sm:px-8 sm:py-20">
        <p className="text-sm font-bold tracking-[0.16em] text-[#9EE7EF]">INDIA, DELIVERED GLOBALLY.</p>
        <h1 className="mt-5 max-w-[850px] text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">Indian Agricultural &amp; Spice Exporter</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">Supplying international importers, distributors, wholesalers and food businesses with Indian spices, rice and selected agricultural products from Hyderabad, India.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link href="/contact" className={primary}>REQUEST EXPORT QUOTE</Link><Link href="/products" className="rounded-lg border border-white/50 px-6 py-3.5 text-sm font-bold hover:bg-white/10">VIEW PRODUCTS</Link></div>
        <Link href="/company-verification" className="mt-6 inline-block text-xs font-bold tracking-wide text-slate-200 underline underline-offset-4">VERIFY GOPU EXPORTS</Link>
      </div>
    </section>
    <section className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8">
      <h2 className="text-3xl font-bold">What We Export</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{categories.map(([label, href]) => <Link key={label} href={href} className="rounded-lg border border-[#D9E2EC] bg-white px-5 py-5 font-semibold hover:border-[#0E7490]">{label} →</Link>)}</div>
      <Link href="/products" className="mt-6 inline-block text-sm font-bold text-[#0E7490]">EXPLORE ALL PRODUCTS →</Link>
    </section>
    <section className="border-y border-[#D9E2EC] bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8"><h2 className="text-3xl font-bold">Featured Export Products</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">{featured.map(product => <Link key={product.slug} href={"/products/" + product.slug} className="overflow-hidden rounded-xl border border-[#D9E2EC] hover:border-[#0E7490]">
          {product.image && <div className="relative aspect-square bg-slate-100"><Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 190px" className="object-cover" /></div>}
          <div className="p-4"><h3 className="font-bold leading-6">{product.title}</h3><p className="mt-3 text-xs font-semibold text-[#0E7490]">View specifications →</p></div>
        </Link>)}</div>
      </div>
    </section>
    <section className="mx-auto max-w-[1280px] px-6 py-12 sm:px-8"><h2 className="text-3xl font-bold">Why GOPU Exports</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(([title, copy]) => <div key={title} className="border-t-2 border-[#0E7490] pt-4"><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#475569]">{copy}</p></div>)}</div>
    </section>
    <section className="border-y border-[#D9E2EC] bg-white"><div className="mx-auto grid max-w-[1280px] gap-8 px-6 py-12 sm:px-8 lg:grid-cols-2">
      <div><h2 className="text-3xl font-bold">A company international buyers can verify.</h2><p className="mt-4 text-base leading-7 text-[#475569]">{COMPANY.legalName}, headquartered in Hyderabad, Telangana, India.</p><Link href="/company-verification" className="mt-6 inline-block text-sm font-bold text-[#0E7490]">VERIFY GOPU EXPORTS →</Link></div>
      <dl className="grid gap-3 sm:grid-cols-2">{[["IEC", COMPANY.iec], ["GST", COMPANY.gst], ["CIN", COMPANY.cin], ["Head Office", "Hyderabad, Telangana, India"]].map(([label, value]) => <div key={label} className="min-w-0 rounded-lg bg-[#F5F7FA] p-4"><dt className="text-xs font-bold text-[#0E7490]">{label}</dt><dd className="mt-2 break-words text-sm font-semibold">{value}</dd></div>)}</dl>
    </div></section>
    <section className="bg-[#071624] text-white"><div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-6 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-3xl font-bold">Looking to Import from India?</h2><p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">Send your product, specification, quantity, packaging and destination requirements for an export quotation.</p></div><div className="shrink-0"><Link href="/contact" className={primary}>REQUEST EXPORT QUOTE</Link></div></div></section>
  </main>;
}
