import type { Metadata } from "next";
import Link from "next/link";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";
import { getLocale, LOCALES } from "@/lib/i18n";
import { uiForLocale } from "@/lib/localizedContent";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== "en").map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { text } = uiForLocale(locale);
  return {
    title: text.resources.title,
    description: text.resources.body,
    alternates: { canonical: `/${locale}/resources` },
  };
}

export default async function LocalizedResourcesPage({ params }: Props) {
  const { locale } = await params;
  const current = getLocale(locale);
  const { text } = uiForLocale(locale);
  return (
    <main dir={current.dir} className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">{text.resources.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">{text.resources.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">{text.resources.body}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/${locale}/contact`} className="rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white">{text.resources.cta}</Link>
            <Link href={`/${locale}/products`} className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white">{text.resources.viewProducts}</Link>
          </div>
        </div>
      </section>
      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          {EXPORT_OPERATION_PAGES.map((page, index) => {
            const card = text.resources.cards[index] ?? [page.title, page.description];
            return (
              <Link key={page.slug} href={`/${locale}/resources/${page.slug}`} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm transition hover:border-[#0E7490]">
                <h2 className="text-xl font-black tracking-[-0.03em]">{card[0]}</h2>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">{card[1]}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
