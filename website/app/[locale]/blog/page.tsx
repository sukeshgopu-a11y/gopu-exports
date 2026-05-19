import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, isLocale, localeCodes } from "@/lib/i18n";
import { uiForLocale } from "@/lib/localizedContent";
import { DEFAULT_BLOGS } from "@/lib/blogs";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return localeCodes.filter((code) => code !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") return {};
  const { text } = uiForLocale(locale);
  return {
    title: text.blog.title,
    description: text.blog.body,
    alternates: { canonical: `/${locale}/blog` },
  };
}

export default async function LocalizedBlogPage({ params }: Props) {
  const { locale: code } = await params;
  if (!isLocale(code) || code === "en") notFound();
  const locale = getLocale(code);
  const { text } = uiForLocale(code);

  return (
    <main dir={locale.dir} className="min-h-screen bg-[#F5F7FA]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-[#67C9D8]">{text.blog.eyebrow}</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">{text.blog.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">{text.blog.body}</p>
        </div>
      </section>
      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_BLOGS.slice(0, 9).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm transition hover:border-[#0E7490]">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0E7490]">GOPU Exports</p>
              <h2 className="mt-3 text-lg font-black leading-6 tracking-[-0.03em] text-[#0F172A]">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#64748B]">
                {text.blog.body}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
