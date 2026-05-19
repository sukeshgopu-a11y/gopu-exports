import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, isLocale, localeCodes, localizedHomeCopy } from "@/lib/i18n";
import { uiForLocale } from "@/lib/localizedContent";

const BASE_URL = "https://gopuexports.com";

export function generateStaticParams() {
  return localeCodes.filter((code) => code !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: code } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const copy = localizedHomeCopy[locale.code] ?? localizedHomeCopy.en;

  return {
    title: `${locale.label} Buying Desk`,
    description: copy.body,
    alternates: {
      canonical: `/${locale.code}`,
      languages: Object.fromEntries(localeCodes.map((item) => [item, item === "en" ? BASE_URL : `${BASE_URL}/${item}`])),
    },
  };
}

export default async function LocalizedLandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: code } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const copy = localizedHomeCopy[locale.code] ?? localizedHomeCopy.en;
  const { text } = uiForLocale(locale.code);

  return (
    <main dir={locale.dir} className="min-h-screen bg-[#F5F7FA]">
      <section className="border-b border-[#D9E2EC] bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:py-24">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-[-0.04em] text-[#0F172A] sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{copy.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale.code}/products`} className="rounded-lg bg-[#0E7490] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0A5A70]">
              {copy.cta}
            </Link>
            <Link href={`/${locale.code}/contact`} className="rounded-lg border border-[#D9E2EC] bg-white px-6 py-3 text-sm font-bold text-[#0F172A] transition hover:border-[#0E7490] hover:text-[#0E7490]">
              admin@gopuexports.com
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-6 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
        {[
          text.nav[2],
          text.productsPage.featuredCategories,
          text.resources.cards[1]?.[0] ?? text.resources.title,
          text.resources.cards[4]?.[0] ?? text.resources.title,
          text.contact.eyebrow,
          text.footer.quickEnquiry,
        ].map((item) => (
          <div key={item} className="rounded-2xl border border-[#D9E2EC] bg-white p-5">
            <p className="text-sm font-bold text-[#0F172A]">{item}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{locale.marketNote}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
