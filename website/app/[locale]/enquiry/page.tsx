import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, LOCALES } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.code !== "en").map((locale) => ({ locale: locale.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Export Enquiry (${getLocale(locale).label})`,
    alternates: { canonical: `/${locale}/enquiry` },
  };
}

export default async function LocalizedEnquiryPage({ params }: Props) {
  const { locale } = await params;
  const current = getLocale(locale);
  return (
    <main dir={current.dir} className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">{current.nativeName}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em]">Bulk Export Enquiry</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            Share product, grade, packing, quantity, destination, and document requirements. The main enquiry form is available in English while localized forms continue expanding.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white">Open Enquiry Form</Link>
            <a href="https://wa.me/918712816876" target="_blank" rel="noreferrer" className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white">WhatsApp Inquiry</a>
          </div>
        </div>
      </section>
    </main>
  );
}
