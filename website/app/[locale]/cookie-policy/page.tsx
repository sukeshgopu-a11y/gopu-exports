import type { Metadata } from "next";
import { getLocale, LOCALES } from "@/lib/i18n";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== "en").map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Cookie Policy (${getLocale(locale).label})`,
    alternates: { canonical: `/${locale}/cookie-policy` },
  };
}

export default async function LocalizedCookiePolicy({ params }: Props) {
  const { locale } = await params;
  const current = getLocale(locale);
  return (
    <main dir={current.dir} className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">{current.nativeName}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">Cookie Policy</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            GOPU Exports uses limited cookies and browser storage for site functionality, analytics, security, and performance.
          </p>
        </div>
      </section>
      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E2EC] bg-white p-6 text-sm leading-7 text-[#475569] shadow-sm sm:p-10">
          <p>
            The website does not show an analytics popup. Cookie and analytics disclosure is provided in the policy pages.
          </p>
          <p className="mt-4">
            Read the full policy here: <Link href="/cookie-policy" className="font-bold text-[#0E7490]">English Cookie Policy</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
