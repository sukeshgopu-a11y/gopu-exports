import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocale, isLocale, localeCodes } from "@/lib/i18n";
import { categoryLabel, localizedDetailLabel, localizedProductDescription, uiForLocale } from "@/lib/localizedContent";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ locale: string; slug: string }> };
type Product = {
  slug: string;
  title: string;
  category: string;
  image?: string;
  description?: string;
  origin?: string;
  moq?: string;
  packaging?: string;
  lead?: string;
  hs?: string;
  shelfLife?: string;
  specs?: { label: string; value: string }[];
};

export function generateStaticParams() {
  return localeCodes
    .filter((code) => code !== "en")
    .map((locale) => ({ locale, slug: "basmati-rice" }));
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle<ProductRow>();
  if (error || !data) return null;
  return productToApi(data) as Product;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const product = await getProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: `${product.title} | GOPU Exports`,
    description: localizedProductDescription(product.title, product.category, locale),
    alternates: { canonical: `/${locale}/products/${slug}` },
  };
}

export default async function LocalizedProductPage({ params }: Props) {
  const { locale: code, slug } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const { text } = uiForLocale(code);
  const product = await getProduct(slug);
  if (!product) notFound();
  const detailRows = [
    [text.common.origin, product.origin],
    [text.common.moq, product.moq],
    [text.common.leadTime, product.lead],
    [localizedDetailLabel("packaging", code), product.packaging],
    [text.common.hs, product.hs],
    [localizedDetailLabel("shelfLife", code), product.shelfLife],
  ].filter(([, value]) => Boolean(value));

  return (
    <main dir={locale.dir} className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1450px] gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <Link href={`/${code}/products`} className="text-sm font-bold text-[#0E7490]">← {text.common.allProducts}</Link>
            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">
              {categoryLabel(product.category, code)}
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.05em] sm:text-6xl">{product.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#64748B]">
              {localizedProductDescription(product.title, product.category, code)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/${code}/contact?product=${encodeURIComponent(product.title)}`} className="rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white">
                {text.common.requestQuote}
              </Link>
              <a href="https://wa.me/918712816876" target="_blank" rel="noreferrer" className="rounded-xl border border-[#22C55E]/40 px-6 py-3 text-sm font-bold text-[#16A34A]">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden rounded-3xl border border-[#D9E2EC] bg-white shadow-sm">
            {product.image ? (
              <Image src={product.image} alt={`${product.title} product photo`} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center p-8 text-center text-xl font-black text-[#0E7490]">{product.title}</div>
            )}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[1450px] px-6 py-12 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {detailRows.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#D9E2EC] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#94A3B8]">{label}</p>
              <p className="mt-2 text-base font-black text-[#0F172A]">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
