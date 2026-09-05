import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ClipboardCheck, FileText, PackageCheck, Ship } from "lucide-react";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { getProductBySlug, PRODUCTS } from "@/lib/products";
import { formatCommercialMoq } from "@/lib/moq";

export const revalidate = 300;

type Spec = { label: string; value: string };
type Product = {
  _id: string;
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  image?: string;
  description?: string;
  origin?: string;
  moq?: string;
  packaging?: string;
  lead?: string;
  hs?: string;
  shelfLife?: string;
  applications?: string[];
  specs?: Spec[];
  benefits?: string[];
  related?: string[];
  exportCountries?: string[];
  exportPorts?: string[];
  containerCapacity?: string;
  certifications?: string[];
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
};

type Props = { params: Promise<{ slug: string }> };

const SITE_URL = "https://gopuexports.com";

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="grid gap-1 border-b border-[#E2E8F0] py-3 last:border-b-0 sm:grid-cols-[180px_1fr]">
      <dt className="text-[12px] font-black uppercase tracking-[0.14em] text-[#0E7490]">{label}</dt>
      <dd className="text-[14px] font-semibold leading-6 text-[#0F172A]">{value}</dd>
    </div>
  );
}

function compactMoq(product: Product, commercialMoq: string) {
  const category = product.category.toLowerCase();
  if (category.includes("spice") || category.includes("rice")) return "Bulk orders accepted";
  if (category.includes("fruit") || category.includes("vegetable")) return "LCL/FCL by route";
  return product.moq || commercialMoq;
}

const SPECIFICATION_DISCLAIMER =
  "Final specifications are confirmed against the buyer-approved specification and commercial agreement before order confirmation.";

function BuyerStep({ icon: Icon, title, text }: { icon: typeof ClipboardCheck; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-[#D9E2EC] bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F4F7] text-[#0E7490]">
        <Icon size={19} />
      </div>
      <h3 className="mt-4 text-[15px] font-black tracking-[-0.02em] text-[#0F172A]">{title}</h3>
      <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{text}</p>
    </div>
  );
}

function SpecTable({ title, rows }: { title: string; rows: Spec[] }) {
  if (!rows.length) return null;
  return (
    <div>
      <h3 className="text-[18px] font-black tracking-[-0.02em] text-[#0F172A]">{title}</h3>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white">
        <table className="w-full text-left text-[14px]">
          <thead className="bg-[#0F172A] text-white">
            <tr>
              <th className="px-5 py-3 font-black">Parameter</th>
              <th className="px-5 py-3 font-black">Specification / Range</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={`${row.label}-${index}`} className={index % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"}>
                <td className="px-5 py-3 font-bold text-[#374151]">{row.label}</td>
                <td className="px-5 py-3 text-[#475569]">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle<ProductRow>();
  if (error || !data) {
    const fallback = getProductBySlug(slug);
    return fallback ? ({ ...fallback, _id: fallback.slug } as Product) : null;
  }
  return productToApi(data) as Product;
});

const getRelated = cache(async (slugs: string[]): Promise<Product[]> => {
  if (!slugs.length) return [];
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("slug", slugs)
    .eq("is_active", true)
    .returns<ProductRow[]>();
  if (error) return [];
  return (data ?? []).map(productToApi) as Product[];
});

export async function generateStaticParams() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("products")
    .select("slug")
    .eq("is_active", true)
    .returns<Array<{ slug: string }>>();

  const slugs = new Set<string>();
  PRODUCTS.forEach((product) => slugs.add(product.slug));
  (data ?? []).forEach((product) => {
    if (product.slug) slugs.add(product.slug);
  });

  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  const commercialMoq = formatCommercialMoq(product);
  return {
    title: product.metaTitle || product.title,
    description:
      product.metaDescription ||
      `${product.title}${product.tagline ? ` - ${product.tagline}` : ""}. Export quality${product.origin ? ` from ${product.origin}` : ""}${product.moq ? `. MOQ: ${commercialMoq}` : ""}${product.hs ? `. HS Code: ${product.hs}` : ""}.`,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.metaTitle || `${product.title} | GOPU Exports`,
      description: product.metaDescription || product.description || `Export enquiry details for ${product.title}.`,
      url: `/products/${product.slug}`,
      type: "website",
      images: product.image ? [{ url: product.image, alt: `${product.title} export product` }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.metaTitle || `${product.title} | GOPU Exports`,
      description: product.metaDescription || product.description || `Export enquiry details for ${product.title}.`,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const related = await getRelated(product.related ?? []);
  const specs = product.specs ?? [];
  const benefits = product.benefits ?? [];
  const applications = product.applications ?? [];
  const exportCountries = product.exportCountries ?? [];
  const exportPorts = product.exportPorts ?? [];
  const commercialMoq = formatCommercialMoq(product);
  const heroMoq = compactMoq(product, commercialMoq);
  const midpoint = Math.ceil(specs.length / 2);
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/products` },
      { "@type": "ListItem", position: 3, name: product.title, item: productUrl },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-3 sm:px-8">
          <nav className="flex items-center gap-2 text-[13px] text-[#94A3B8]">
            <Link href="/" className="hover:text-[#0E7490]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#0E7490]">Products</Link>
            <span>/</span>
            <span className="font-semibold text-[#0F172A]">{product.title}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-[1300px] px-6 py-12 sm:px-8">
        <div className="overflow-hidden rounded-[32px] border border-[#D9E2EC] bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.82fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="inline-block rounded-lg bg-[#E6F4F7] px-3 py-1 text-[11px] font-black tracking-[0.18em] text-[#0E7490]">
                  {product.category.toUpperCase()}
                </span>
                {product.featured && <span className="w-fit rounded-lg bg-amber-100 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-amber-700">FEATURED EXPORT ITEM</span>}
              </div>

              <div className="mt-8">
                <h1 className="text-[40px] font-black leading-[0.98] tracking-[-0.055em] text-[#0F172A] sm:text-[56px] lg:text-[68px]">
                  {product.title}
                </h1>
                {product.tagline && <p className="mt-3 text-[18px] italic text-[#64748B]">{product.tagline}</p>}
                {product.description && <p className="mt-6 max-w-3xl text-[15px] leading-[1.9] text-[#475569]">{product.description}</p>}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["MOQ", heroMoq],
                  ["Origin", product.origin?.split(",")[0]],
                  ["HS Code", product.hs],
                ].map(([label, value]) => value && (
                  <div key={label} className="rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0E7490]">{label}</p>
                    <p className="mt-2 text-[14px] font-black leading-6 text-[#0F172A]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/contact?product=${encodeURIComponent(product.title)}`} className="inline-flex items-center gap-2 rounded-xl bg-[#0E7490] px-6 py-3.5 text-[13px] font-black uppercase tracking-wide text-white transition hover:bg-[#0A5A70]">
                  Product Enquiry <ArrowRight size={15} />
                </Link>
                <a href={`/api/products/${product.slug}/specification`} download className="inline-flex items-center gap-2 rounded-xl border border-[#D9E2EC] bg-white px-6 py-3.5 text-[13px] font-black uppercase tracking-wide text-[#0F172A] transition hover:border-[#0E7490] hover:text-[#0E7490]">
                  Download Specification <FileText size={15} />
                </a>
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden bg-[#E6F4F7] lg:min-h-full">
              {product.image ? (
                <Image src={product.image} alt={`${product.title} product image`} fill preload sizes="(max-width: 1024px) 100vw, 520px" className="object-cover" />
              ) : (
                <div className="flex h-full min-h-[360px] items-center justify-center text-sm font-semibold text-[#64748B]">
                  Product image will appear after dashboard upload.
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#061827]/75 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0E7490]">Buyer review focus</p>
                <p className="mt-1 text-[14px] font-bold leading-6 text-[#0F172A]">Grade, packing, MOQ, destination, and documentation can be reviewed before quote finalisation.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 border-t border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
            <BuyerStep icon={ClipboardCheck} title="Specification Review" text="Share grade, form, packing, quantity, and destination for a practical export review." />
            <BuyerStep icon={PackageCheck} title="Packing Options" text="Discuss PP bags, jute bags, cartons, retail packs, or private-label formats where suitable." />
            <BuyerStep icon={Ship} title="Shipment Planning" text="Plan LCL or FCL availability around product category, route, and buyer timeline." />
            <BuyerStep icon={FileText} title="Documentation Support" text="Documentation availability depends on the product, destination, buyer requirements and issuing authorities." />
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
            <div>
              <h2 className="text-[24px] font-black tracking-[-0.03em] text-[#0F172A]">Product Details</h2>
              <dl className="mt-4 rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] px-5">
                <DetailRow label="Product Name" value={product.title} />
                <DetailRow label="Category" value={product.category} />
                <DetailRow label="Origin" value={product.origin} />
                <DetailRow label="MOQ" value={commercialMoq} />
                <DetailRow label="Packaging" value={product.packaging} />
                <DetailRow label="Lead Time" value={product.lead} />
                <DetailRow label="HS Code" value={product.hs} />
                <DetailRow label="Shelf Life" value={product.shelfLife} />
              </dl>
            </div>

            <div>
              <h2 className="text-[24px] font-black tracking-[-0.03em] text-[#0F172A]">Bulk Export Information</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  ["Container Loading", product.containerCapacity],
                  ["Loading Ports", exportPorts.length ? exportPorts.join(", ") : undefined],
                  ["Export Destinations", exportCountries.length ? exportCountries.join(", ") : undefined],
                  ["Applications", applications.length ? applications.join(", ") : undefined],
                ].map(([label, value]) => value && (
                  <div key={label} className="rounded-2xl border border-[#D9E2EC] bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#0E7490]">{label}</p>
                    <p className="mt-2 text-[14px] font-semibold leading-6 text-[#475569]">{value}</p>
                  </div>
                ))}
              </div>
              {benefits.length > 0 && (
                <div className="mt-4 rounded-2xl border border-[#D9E2EC] bg-[#F0F9FA] p-5">
                  <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#0E7490]">Buyer Notes</p>
                  <ul className="mt-3 grid gap-2">
                    {benefits.slice(0, 5).map((benefit) => (
                      <li key={benefit} className="flex gap-2 text-[14px] leading-6 text-[#475569]">
                        <span className="mt-1 text-[#0E7490]">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-[13px] font-semibold leading-6 text-amber-900">
                {SPECIFICATION_DISCLAIMER}
              </p>
            </div>
          </div>

          {specs.length > 0 && (
            <div id="product-specifications" className="grid gap-8 px-6 pb-6 sm:px-8 sm:pb-8 lg:grid-cols-2 lg:px-10">
              <SpecTable title="Physical / Quality Specifications" rows={specs.slice(0, midpoint)} />
              <SpecTable
                title="Commercial Specifications"
                rows={specs.slice(midpoint).map((spec) => ({
                  ...spec,
                  value: spec.label.toLowerCase() === "moq" ? commercialMoq : spec.value,
                }))}
              />
            </div>
          )}

          <div className="grid gap-8 border-t border-[#E2E8F0] px-6 py-8 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:px-10">
            <div>
              <h2 className="text-[24px] font-black tracking-[-0.03em] text-[#0F172A]">Packaging & Shipping Details</h2>
              <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#475569]">
                <p><strong className="text-[#0F172A]">Packing:</strong> {product.packaging || "Food-grade export packing options can be reviewed based on buyer requirement and destination rules."}</p>
                <p><strong className="text-[#0F172A]">MOQ:</strong> {commercialMoq}</p>
                {product.containerCapacity && <p><strong className="text-[#0F172A]">Container loading capacity:</strong> {product.containerCapacity}</p>}
                {product.shelfLife && <p><strong className="text-[#0F172A]">Shelf life:</strong> {product.shelfLife} under suitable storage conditions.</p>}
                <p><strong className="text-[#0F172A]">Documentation:</strong> Documentation availability depends on the product, destination, buyer requirements and issuing authorities.</p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/contact?product=${encodeURIComponent(product.title)}`} className="rounded-xl bg-[#0E7490] px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#0A5A70]">
                  Request Quote
                </Link>
                <a href={`https://wa.me/919618991917?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.title)}%20from%20GOPU%20Exports.`} target="_blank" rel="noreferrer" className="rounded-xl border border-[#22C55E]/50 bg-[#F0FDF4] px-6 py-3 text-[13px] font-bold text-[#16A34A] transition hover:bg-[#DCFCE7]">
                  WhatsApp Enquiry
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] p-5">
              <p className="text-[13px] font-black uppercase tracking-[0.16em] text-[#0E7490]">Procurement checklist</p>
              <div className="mt-4 grid gap-3">
                {[
                  "Product grade or variety",
                  "Required packing size",
                  "Trial order or bulk quantity",
                  "Destination port or country",
                  "Document requirements",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-[13px] font-semibold text-[#475569]">
                    <CheckCircle2 size={16} className="shrink-0 text-[#0E7490]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">YOU MAY ALSO LIKE</p>
                <h2 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-[#0F172A]">Related Products</h2>
              </div>
              <Link href="/products" className="text-[13px] font-bold text-[#0E7490] hover:text-[#0A5A70]">
                View All
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rp) => (
                <Link key={rp.slug} href={`/products/${rp.slug}`} className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    {rp.image ? (
                      <Image src={rp.image} alt={rp.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#F0F9FA] text-sm font-semibold text-[#64748B]">Image pending</div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-black tracking-[0.18em] text-[#0E7490]">{rp.category.toUpperCase()}</p>
                    <h3 className="mt-1.5 text-[17px] font-black text-[#0F172A]">{rp.title}</h3>
                    {rp.tagline && <p className="mt-1 text-[13px] italic text-[#64748B]">{rp.tagline}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
