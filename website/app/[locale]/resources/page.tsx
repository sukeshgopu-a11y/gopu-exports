import type { Metadata } from "next";
import Link from "next/link";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";
import { getLocale, LOCALES } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== "en").map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Buyer Resources (${getLocale(locale).label})`,
    alternates: { canonical: `/${locale}/resources` },
  };
}

export default async function LocalizedResourcesPage({ params }: Props) {
  const { locale } = await params;
  const current = getLocale(locale);
  return (
    <main dir={current.dir} className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">{current.nativeName}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Export Buyer Resources</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            Localized entry points for export process, packaging, quality control, logistics, documentation, FAQ, private label, and bulk order guidance.
          </p>
        </div>
      </section>
      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          {EXPORT_OPERATION_PAGES.map((page) => (
            <Link key={page.slug} href={`/resources/${page.slug}`} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm transition hover:border-[#0E7490]">
              <h2 className="text-xl font-black tracking-[-0.03em]">{page.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#64748B]">{page.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
