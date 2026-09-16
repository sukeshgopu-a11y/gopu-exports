import type { Metadata } from "next";
import { publicMetadata } from "@/lib/seo";
import { getPublicProducts } from "@/lib/publicCatalogue";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORY_LANDING_PAGES, getCategoryLandingPage } from "@/lib/categoryLandingPages";



export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };
type ProductCard = { slug: string; title: string; category: string; tagline?: string; moq?: string };

export function generateStaticParams() {
  return CATEGORY_LANDING_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getCategoryLandingPage(slug);
  if (!page) return { title: "Export Category Not Found" };

  return publicMetadata(page.title, page.description, `/export/${page.slug}`);
}

async function getProducts(category?: string): Promise<ProductCard[]> {
  return category ? (await getPublicProducts()).filter(product => product.category === category).slice(0, 8) : [];
}

export default async function ExportCategoryPage({ params }: Props) {
  const { slug } = await params;
  const page = getCategoryLandingPage(slug);
  if (!page) notFound();

  const products = await getProducts(page.productCategory);
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://gopuexports.com" },
      { "@type": "ListItem", position: 2, name: "Export Categories", item: "https://gopuexports.com/products" },
      { "@type": "ListItem", position: 3, name: page.title, item: `https://gopuexports.com/export/${page.slug}` },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F5F7FA] text-[#0F172A]">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1180px] px-6 py-16 sm:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#0E7490]">{page.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-[42px] font-black leading-none tracking-[-0.05em] lg:text-[60px]">
            {page.title}
          </h1>
          <p className="mt-5 max-w-3xl text-[17px] leading-8 text-[#64748B]">{page.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-lg bg-[#0E7490] px-6 py-3.5 text-[13px] font-bold text-white">
              REQUEST EXPORT QUOTE
            </Link>
            <a href="https://wa.me/919618991917" target="_blank" rel="noreferrer" className="rounded-lg border border-[#22C55E]/50 px-6 py-3.5 text-[13px] font-bold text-[#16A34A]">
              WHATSAPP BUYER DESK
            </a>
            <Link href="/products" className="rounded-lg border border-[#D9E2EC] px-6 py-3.5 text-[13px] font-bold text-[#0F172A]">
              VIEW PRODUCTS
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-14 sm:px-8">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap gap-2 text-sm text-[#475569]"><Link href="/">Home</Link><span>/</span><Link href="/products">Export products</Link><span>/</span><span aria-current="page">{page.title}</span></nav>
        {page.relatedGuides && <nav aria-label="Related export guides" className="mb-6 flex flex-wrap gap-4">{page.relatedGuides.map(guide => <Link key={guide.href} href={guide.href} className="font-semibold text-[#0E7490] underline underline-offset-4">{guide.title}</Link>)}</nav>}
        {page.relatedProducts && <div className="mb-8"><h2 className="text-2xl font-bold">Explore the products</h2><div className="mt-4 flex flex-wrap gap-3">{page.relatedProducts.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-lg border border-[#D9E2EC] bg-white px-5 py-3 font-bold text-[#0E7490]">{product.title} →</Link>)}</div></div>}
        <div className="grid gap-6 md:grid-cols-2">
          {page.sections.map((section) => (
            <div key={section.heading} className="rounded-2xl border border-[#D9E2EC] bg-white p-7 shadow-sm">
              <h2 className="text-[24px] font-black tracking-[-0.03em]">{section.heading}</h2>
              <p className="mt-4 text-[15px] leading-8 text-[#64748B]">{section.body}</p>
            </div>
          ))}
        </div>

        {products.length > 0 && (
          <div className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Related Products</p>
                <h2 className="mt-2 text-[30px] font-black tracking-[-0.04em]">Active Catalogue Items</h2>
              </div>
              <Link href="/products" className="text-[13px] font-bold text-[#0E7490]">View all</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-2xl border border-[#D9E2EC] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0E7490]">{product.category}</p>
                  <h3 className="mt-2 text-[17px] font-black">{product.title}</h3>
                  {product.tagline && <p className="mt-2 text-[13px] leading-6 text-[#64748B]">{product.tagline}</p>}
                  {product.moq && <p className="mt-4 text-[12px] font-bold text-[#94A3B8]">MOQ: {product.moq}</p>}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 rounded-2xl bg-[#071624] p-8 text-white">
          <h2 className="text-[28px] font-black tracking-[-0.03em]">Need a product not listed here?</h2>
          <p className="mt-3 max-w-2xl text-[15px] leading-8 text-slate-300">
            Send your exact requirement, packing preference, destination port, and document checklist. For additional products, select Others in the export enquiry form.
          </p>
          <Link href="/contact" className="mt-6 inline-block rounded-lg bg-[#0E7490] px-6 py-3.5 text-[13px] font-bold text-white">
            Send Bulk Inquiry
          </Link>
        </div>
      </section>
    </main>
  );
}

