import Link from "next/link";
import { publicMetadata } from "@/lib/seo";
import { ArrowRight, BookOpen, Globe2, Newspaper } from "lucide-react";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";

export const metadata = publicMetadata(
  "Export Guides, Markets & Insights for Importers",
  "Explore Indian food export guides, international markets and buyer insights. Plan orders, packaging, documentation and shipments with GOPU Exports.",
  "/resources",
);

export default function ResourcesPage() {
  return (
    <main className="bg-[#F5F8FB]">
      <section className="bg-[#071624] px-5 py-12 text-white sm:px-8 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#67C9D8]">Resources for international buyers</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight sm:text-5xl">Export Guide Library for International Buyers</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Export guides, market information and practical insights — everything in one place to help you plan your next order.</p>
          <nav aria-label="Resource sections" className="mt-7 flex flex-wrap gap-3">
            {[
              { label: "Export guides", href: "#export-guides", Icon: BookOpen },
              { label: "Markets we support", href: "#export-markets", Icon: Globe2 },
              { label: "Insights", href: "#insights", Icon: Newspaper },
            ].map(({ label, href, Icon }) => (
              <a key={href} href={href} className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-3 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <Icon className="h-4 w-4 text-[#67C9D8]" aria-hidden="true" />{label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section id="export-guides" aria-labelledby="guides-title" className="scroll-mt-48 px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-start gap-3">
            <span className="rounded-xl bg-[#DFF1F4] p-3 text-[#0E7490]"><BookOpen className="h-6 w-6" aria-hidden="true" /></span>
            <div><h2 id="guides-title" className="text-2xl font-bold text-slate-900">Export guides</h2><p className="mt-1 text-sm leading-6 text-slate-600">Understand the steps from your first enquiry to shipment.</p></div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {EXPORT_OPERATION_PAGES.map((page) => (
              <Link key={page.slug} href={`/resources/${page.slug}`} className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-[#0E7490] hover:shadow-md focus-visible:outline-2 focus-visible:outline-[#0E7490]">
                <h3 className="text-lg font-bold text-slate-900">{page.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{page.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0E7490]">Read guide <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-slate-200 bg-white px-5 py-10 sm:px-8 sm:py-12">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <section id="export-markets" aria-labelledby="markets-title" className="scroll-mt-48 rounded-2xl border border-[#CDE8ED] bg-[#F0F9FA] p-6 sm:p-8">
            <Globe2 className="h-8 w-8 text-[#0E7490]" aria-hidden="true" />
            <h2 id="markets-title" className="mt-4 text-2xl font-bold text-slate-900">Export markets</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Explore international destinations and discuss product, packing and documentation requirements for your market.</p>
            <Link href="/markets" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0E7490]">Explore markets <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </section>
          <section id="insights" aria-labelledby="insights-title" className="scroll-mt-48 rounded-2xl border border-amber-200 bg-[#FFFAF0] p-6 sm:p-8">
            <Newspaper className="h-8 w-8 text-amber-700" aria-hidden="true" />
            <h2 id="insights-title" className="mt-4 text-2xl font-bold text-slate-900">Insights</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">Read articles about Indian agricultural products and practical considerations for international importers and distributors.</p>
            <Link href="/blog" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-800">Browse insights <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </section>
        </div>
        <div className="mx-auto mt-8 flex max-w-6xl flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">Ready to discuss a product and destination?</p>
          <Link href="/contact" className="inline-flex justify-center rounded-lg bg-[#0E7490] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0A5A70]">REQUEST EXPORT QUOTE</Link>
        </div>
      </div>
    </main>
  );
}
