import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { getLocale, isLocale, localeCodes } from "@/lib/i18n";
import { uiForLocale } from "@/lib/localizedContent";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return localeCodes.filter((code) => code !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const { text } = uiForLocale(locale);
  return {
    title: text.contact.title,
    description: text.contact.body,
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function LocalizedContactPage({ params }: Props) {
  const { locale: code } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const { text } = uiForLocale(code);

  return (
    <main dir={locale.dir} className="min-h-screen bg-[#F5F7FA] px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-[#0E7490]">{text.contact.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">{text.contact.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{text.contact.body}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a href="mailto:admin@gopuexports.com" className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
            <Mail className="h-4 w-4 text-[#0E7490]" /> admin@gopuexports.com
          </a>
          <a href="tel:+918712816876" className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
            <Phone className="h-4 w-4 text-[#0E7490]" /> +91 87128 16876
          </a>
        </div>
        <Link href="/contact" className="mt-7 inline-flex rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white">
          {text.contact.open}
        </Link>
      </section>
    </main>
  );
}
