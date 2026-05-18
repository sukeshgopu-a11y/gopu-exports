import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { getProductBySlug } from "@/lib/products";

export const revalidate = 60;

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

async function getProduct(slug: string): Promise<Product | null> {
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
}

async function getRelated(slugs: string[]): Promise<Product[]> {
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
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.metaTitle || product.title,
    description:
      product.metaDescription ||
      `${product.title}${product.tagline ? ` — ${product.tagline}` : ""}. Export quality${product.origin ? ` from ${product.origin}` : ""}${product.moq ? `. MOQ: ${product.moq}` : ""}${product.hs ? `. HS Code: ${product.hs}` : ""}.`,
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
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.image
      ? product.image.startsWith("/")
        ? `https://gopuexports.com${product.image}`
        : product.image
      : undefined,
    category: product.category,
    brand: { "@type": "Brand", name: "GOPU Exports" },
    additionalProperty: [
      product.origin ? { "@type": "PropertyValue", name: "Origin", value: product.origin } : null,
      product.moq ? { "@type": "PropertyValue", name: "MOQ", value: product.moq } : null,
      product.packaging ? { "@type": "PropertyValue", name: "Packaging", value: product.packaging } : null,
      product.hs ? { "@type": "PropertyValue", name: "HS Code", value: product.hs } : null,
    ].filter(Boolean),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gopuexports.com" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://gopuexports.com/products" },
      { "@type": "ListItem", position: 3, name: product.title, item: `https://gopuexports.com/products/${product.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA]">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* ── BREADCRUMB ── */}
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

      {/* ── MAIN DETAIL ── */}
      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* IMAGE */}
          <div className="relative overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm">
            <div className="relative h-[480px]">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#F0F9FA] text-[#0E7490] text-6xl">
                  📦
                </div>
              )}
            </div>
            {applications.length > 0 && (
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {applications.slice(0, 4).map((app) => (
                    <span
                      key={app}
                      className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-[12px] font-semibold text-[#374151]"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div>
            <span className="inline-block rounded-lg bg-[#E6F4F7] px-3 py-1 text-[11px] font-black tracking-[0.18em] text-[#0E7490]">
              {product.category.toUpperCase()}
            </span>

            <h1 className="mt-3 text-[44px] font-black leading-[1.0] tracking-[-0.04em] text-[#0F172A] lg:text-[52px]">
              {product.title}
            </h1>
            {product.tagline && (
              <p className="mt-2 text-[17px] italic text-[#64748B]">{product.tagline}</p>
            )}
            {product.description && (
              <p className="mt-5 text-[15px] leading-[1.9] text-[#475569]">
                {product.description}
              </p>
            )}

            {/* Quick specs */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "MOQ", value: product.moq },
                { label: "Lead Time", value: product.lead },
                { label: "HS Code", value: product.hs },
                { label: "Shelf Life", value: product.shelfLife },
              ]
                .filter((s) => s.value)
                .map(({ label, value }) => (
                  <div key={label} className="rounded-xl border border-[#D9E2EC] bg-white p-4 text-center">
                    <p className="text-[10px] font-black tracking-[0.18em] text-[#94A3B8]">
                      {label.toUpperCase()}
                    </p>
                    <p className="mt-1.5 text-[15px] font-bold text-[#0F172A]">{value}</p>
                  </div>
                ))}
            </div>

            {/* Origin + Packaging */}
            {(product.origin || product.packaging) && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {product.origin && (
                  <div className="rounded-xl border border-[#D9E2EC] bg-white p-4">
                    <p className="text-[10px] font-black tracking-[0.18em] text-[#94A3B8]">ORIGIN</p>
                    <p className="mt-1.5 text-[14px] font-semibold text-[#0F172A]">{product.origin}</p>
                  </div>
                )}
                {product.packaging && (
                  <div className="rounded-xl border border-[#D9E2EC] bg-white p-4">
                    <p className="text-[10px] font-black tracking-[0.18em] text-[#94A3B8]">PACKAGING</p>
                    <p className="mt-1.5 text-[14px] font-semibold text-[#0F172A]">{product.packaging}</p>
                  </div>
                )}
              </div>
            )}

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href={`/contact?product=${encodeURIComponent(product.title)}`}
                className="rounded-xl bg-[#0E7490] px-7 py-4 text-[13px] font-bold tracking-wide text-white shadow-md transition hover:bg-[#0A5A70] hover:shadow-lg"
              >
                REQUEST A QUOTE →
              </Link>
              <Link
                href={`/contact?product=${encodeURIComponent(product.title)}&catalogue=1`}
                className="rounded-xl border border-[#D9E2EC] bg-white px-7 py-4 text-[13px] font-bold tracking-wide text-[#0F172A] transition hover:border-[#0E7490] hover:text-[#0E7490]"
              >
                DOWNLOAD CATALOGUE
              </Link>
              <a
                href={`https://wa.me/918712816876?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(product.title)}%20from%20GOPU%20Exports.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-[#22C55E]/50 bg-[#F0FDF4] px-7 py-4 text-[13px] font-bold text-[#16A34A] transition hover:bg-[#DCFCE7]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WHATSAPP ENQUIRY
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECIFICATIONS + BENEFITS ── */}
      {(specs.length > 0 || benefits.length > 0) && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-2">

              {specs.length > 0 && (
                <div>
                  <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">PRODUCT SPECIFICATIONS</p>
                  <h2 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-[#0F172A]">Technical Details</h2>
                  <div className="mt-6 overflow-hidden rounded-xl border border-[#E2E8F0]">
                    <table className="w-full text-[14px]">
                      <tbody>
                        {specs.map((spec, i) => (
                          <tr key={spec.label} className={i % 2 === 0 ? "bg-[#F8FAFC]" : "bg-white"}>
                            <td className="px-5 py-3.5 font-bold text-[#374151]">{spec.label}</td>
                            <td className="px-5 py-3.5 text-[#64748B]">{spec.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {benefits.length > 0 && (
                <div>
                  <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">WHY BUYERS CHOOSE THIS</p>
                  <h2 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-[#0F172A]">Key Benefits</h2>
                  <ul className="mt-6 space-y-3">
                    {benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-[14px] text-[#475569]">
                        <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#E6F4F7] text-[11px] font-bold text-[#0E7490]">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  {applications.length > 0 && (
                    <div className="mt-8 rounded-xl border border-[#D9E2EC] bg-[#F0F9FA] p-5">
                      <p className="text-[13px] font-bold text-[#0F172A]">Applications</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {applications.map((app) => (
                          <span
                            key={app}
                            className="rounded-lg bg-white border border-[#D9E2EC] px-3 py-1.5 text-[12px] font-semibold text-[#374151]"
                          >
                            {app}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── EXPORT INFORMATION ── */}
      {(exportCountries.length > 0 || exportPorts.length > 0 || product.containerCapacity) && (
        <section className="bg-[#071624] py-14">
          <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
            <p className="text-[11px] font-black tracking-[0.24em] text-[#67C9D8]">EXPORT INFORMATION</p>
            <h2 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-white">Shipping & Export Details</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exportCountries.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <p className="text-[11px] font-black tracking-[0.18em] text-[#67C9D8]">EXPORT DESTINATIONS</p>
                  <ul className="mt-3 space-y-1">
                    {exportCountries.map((c) => (
                      <li key={c} className="text-[14px] text-slate-300 flex items-center gap-2">
                        <span className="text-[#0E7490]">→</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {exportPorts.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <p className="text-[11px] font-black tracking-[0.18em] text-[#67C9D8]">LOADING PORTS</p>
                  <ul className="mt-3 space-y-1">
                    {exportPorts.map((p) => (
                      <li key={p} className="text-[14px] text-slate-300 flex items-center gap-2">
                        <span className="text-[#0E7490]">⚓</span> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {product.containerCapacity && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <p className="text-[11px] font-black tracking-[0.18em] text-[#67C9D8]">CONTAINER CAPACITY</p>
                  <p className="mt-3 text-[17px] font-bold text-white">{product.containerCapacity}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">YOU MAY ALSO LIKE</p>
                <h2 className="mt-2 text-[28px] font-black tracking-[-0.03em] text-[#0F172A]">Related Products</h2>
              </div>
              <Link href="/products" className="text-[13px] font-bold text-[#0E7490] hover:text-[#0A5A70]">
                VIEW ALL →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/products/${rp.slug}`}
                  className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    {rp.image ? (
                      <Image
                        src={rp.image}
                        alt={rp.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#F0F9FA] text-4xl">📦</div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-black tracking-[0.18em] text-[#0E7490]">
                      {rp.category.toUpperCase()}
                    </p>
                    <h3 className="mt-1.5 text-[17px] font-black text-[#0F172A]">{rp.title}</h3>
                    {rp.tagline && (
                      <p className="mt-1 text-[13px] italic text-[#64748B]">{rp.tagline}</p>
                    )}
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
