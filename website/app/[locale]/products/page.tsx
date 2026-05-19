import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductsGrid from "@/components/ProductsGrid";
import { getLocale, isLocale, localeCodes } from "@/lib/i18n";
import { uiForLocale } from "@/lib/localizedContent";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { PRODUCTS } from "@/lib/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return localeCodes.filter((code) => code !== "en").map((locale) => ({ locale }));
}

async function getProducts() {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .returns<ProductRow[]>();
    if (error) return PRODUCTS.map((product) => ({ ...product, _id: product.slug }));
    const products = (data ?? []).map(productToApi);
    return products.length > 0 ? products : PRODUCTS.map((product) => ({ ...product, _id: product.slug }));
  } catch {
    return PRODUCTS.map((product) => ({ ...product, _id: product.slug }));
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const { text } = uiForLocale(locale);
  return {
    title: text.productsPage.title,
    description: text.productsPage.body,
    alternates: { canonical: `/${locale}/products` },
  };
}

export default async function LocalizedProductsPage({ params }: Props) {
  const { locale: code } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const { text } = uiForLocale(code);
  const products = await getProducts();

  return (
    <main dir={locale.dir} className="min-h-screen bg-[#F5F7FA]">
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#0E7490]">{text.productsPage.eyebrow}</p>
          <h1 className="mt-4 text-[44px] font-black leading-none tracking-[-0.05em] text-[#0F172A] lg:text-[60px]">
            {text.productsPage.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-[1.8] text-[#64748B]">{text.productsPage.body}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        <ProductsGrid initialProducts={products} locale={code} />
      </section>

      <section className="bg-white border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1450px] px-6 text-center sm:px-8">
          <h2 className="text-[30px] font-black tracking-[-0.04em] text-[#0F172A]">{text.productsPage.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-[#64748B]">{text.productsPage.ctaBody}</p>
          <Link href={`/${code}/contact`} className="mt-7 inline-flex rounded-lg bg-[#0E7490] px-8 py-4 text-[13px] font-bold text-white">
            {text.productsPage.requestProduct}
          </Link>
        </div>
      </section>
    </main>
  );
}
