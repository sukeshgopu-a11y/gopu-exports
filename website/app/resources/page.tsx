import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ClipboardCheck, PackageCheck, Ship } from "lucide-react";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";

export const metadata: Metadata = {
  title: "Export Buyer Resources | GOPU Exports",
  description:
    "Practical export buyer resources for Indian agricultural products, packaging, documentation, logistics, private label, and bulk sourcing.",
  alternates: { canonical: "/resources" },
};

export default function ResourcesPage() {
  return (
    <main className="bg-[#F5F8FB]">
      <section className="bg-[#071624] px-5 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#67C9D8]">Buyer resources</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
            Practical export guidance for international agri-product buyers
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Learn how to structure sourcing enquiries, packaging decisions, quality checks, documentation, and shipment coordination for Indian agricultural products.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0A5A70]">
              Request Export Support
            </Link>
            <Link href="/products" className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              View Products
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {[
            { icon: ClipboardCheck, title: "Documentation-ready", text: "Understand common commercial and product documents before shipment planning." },
            { icon: PackageCheck, title: "Packing-aware", text: "Review bulk, retail, and commodity-specific packing considerations." },
            { icon: Ship, title: "Shipment-focused", text: "Clarify logistics, route planning, and buyer-forwarder coordination early." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <Icon className="h-7 w-7 text-[#0E7490]" />
              <h2 className="mt-4 text-lg font-black text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {EXPORT_OPERATION_PAGES.map((page) => (
            <Link
              key={page.slug}
              href={`/resources/${page.slug}`}
              className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0E7490]">Export operations</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">{page.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{page.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0E7490]">
                Read guide <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
