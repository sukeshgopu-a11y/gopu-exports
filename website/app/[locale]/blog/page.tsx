import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, isLocale, localeCodes } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return localeCodes.filter((code) => code !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  return {
    title: "Export Buyer Blog",
    description: "Localized entry point for GOPU Exports buyer guides, product sourcing articles, and import documentation resources.",
    alternates: { canonical: `/${locale}/blog` },
  };
}

export default async function LocalizedBlogPage({ params }: Props) {
  const { locale: code } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);

  return (
    <main dir={locale.dir} className="min-h-screen bg-[#F5F7FA] px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0E7490]">{locale.nativeName}</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">Export Buyer Blog</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Blog translation architecture is active. Open the full buyer guide library while article-by-article localization continues.
        </p>
        <Link href="/blog" className="mt-7 inline-flex rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white">
          View Buyer Guides
        </Link>
      </section>
    </main>
  );
}
