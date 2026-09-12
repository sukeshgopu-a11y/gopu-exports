import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "About GOPU Exports",
  description:
    "Learn about GOPU Exports, a Hyderabad-based Indian agricultural export company supplying spices, rice and selected food products to international B2B buyers.",
  alternates: { canonical: "/about" },
};

const STRENGTHS = [
  ["Quality-Focused Exports", "Product checks and grade discussions are coordinated around buyer specifications and export handling needs."],
  ["Coordinated Supply Network", "Product availability and supplier communication are managed behind the scenes to support reliable export execution."],
  ["Export-Compliant Packaging", "Packing options are reviewed around product handling, buyer requirements and destination rules."],
  ["Documentation Support", "Documentation requirements are reviewed according to product, buyer destination and issuing-authority requirements."],
  ["Shipment Coordination", "Orders are coordinated around readiness, logistics communication and dispatch milestones."],
  ["Flexible Export Product Supply", "The team can review catalogue products and selected additional Indian agricultural products against buyer requirements."],
];

export default function AboutPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="relative overflow-hidden bg-[#071624]">
        <div className="absolute inset-0">
          <Image src="/images/hero-bg.webp" alt="GOPU Exports agricultural export operations" fill preload sizes="100vw" quality={68} className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071624]/95 to-[#0E7490]/35" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1450px] px-6 py-24 sm:px-8 lg:py-32">
          <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#67C9D8]">ABOUT GOPU EXPORTS</p>
          <h1 className="mt-5 max-w-4xl text-[48px] font-black leading-[0.95] tracking-[-0.05em] text-white lg:text-[66px]">
            Indian agricultural exports built around buyer requirements.
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-8 text-slate-300">
            GOPU Exports is a Hyderabad-based Indian agricultural export company supplying international buyers with spices, rice and selected agricultural products, supported by buyer-specification review, packing, documentation and shipment coordination.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-[1450px] gap-8 px-6 sm:px-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-[#071624] p-8 text-white">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">MANAGEMENT MESSAGE</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">Clear requirements. Responsible supply. Professional export execution.</h2>
            <p className="mt-5 text-sm leading-7 text-slate-300">
              Our approach is simple: understand the buyer requirement, confirm the product and specification we can supply responsibly, and communicate packing, documentation and shipment terms clearly before an order moves forward.
            </p>
            <p className="mt-5 text-sm font-semibold text-white">{COMPANY.contactPerson}</p>
            <p className="text-sm font-semibold text-slate-300">{COMPANY.contactTitle}</p>
          </div>
          <div className="rounded-3xl border border-[#D9E2EC] bg-[#F8FAFC] p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">OUR VISION</p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">A process-driven Indian export partner.</h2>
            <p className="mt-5 text-sm leading-7 text-[#64748B]">
              GOPU Exports builds buyer confidence through clear specifications, responsible export supply, accurate communication and practical documentation support from enquiry to dispatch.
            </p>
            <Link href="/company-verification" className="mt-6 inline-flex rounded-xl bg-[#0E7490] px-5 py-3 text-sm font-bold text-white">View Company Verification</Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto grid max-w-[1450px] items-center gap-12 px-6 sm:px-8 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">OUR COMPANY</p>
            <h2 className="mt-3 text-[38px] font-black leading-[1.05] tracking-[-0.04em]">Indian products for international B2B trade.</h2>
            <p className="mt-5 text-[15px] leading-8 text-[#64748B]">
              GOPU Exports was established to supply Indian agricultural products to international buyers with clearer product specifications, realistic commercial discussions and disciplined export communication.
            </p>
            <p className="mt-4 text-[15px] leading-8 text-[#64748B]">
              Each buyer discussion starts with product, grade, packing, quantity, destination and document requirements. The team then reviews product availability, specification fit and export requirements before the next commercial step.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-xl bg-[#0E7490] px-6 py-3.5 text-sm font-black text-white">Request Export Quote</Link>
              <Link href="/products" className="rounded-xl border border-[#D9E2EC] bg-white px-6 py-3.5 text-sm font-black text-[#0F172A]">View Products</Link>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl">
            <Image src="/images/hero-export.webp" alt="GOPU Exports product handling and export logistics" fill sizes="(max-width: 1024px) 100vw, 50vw" quality={68} className="object-cover" />
          </div>
        </div>
      </section>

      <section id="operations" className="bg-[#071624] py-16 text-white">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">EXPORT CAPABILITIES</p>
            <h2 className="mt-3 text-[38px] font-black tracking-[-0.04em]">From export enquiry to shipment coordination.</h2>
            <p className="mt-5 text-[15px] leading-8 text-slate-300">
              GOPU Exports coordinates product confirmation, quality expectations, packing, documentation and logistics communication around each confirmed buyer requirement.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Product Confirmation", "Product, grade and specification review before commercial confirmation."],
              ["Packing", "Bulk, food-service, retail or private-label formats reviewed where suitable."],
              ["Documentation", "Required documentation mapped against product and destination requirements."],
              ["Shipment Coordination", "Dispatch and freight communication coordinated after order confirmation."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.05] p-6">
                <h3 className="font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">HOW WE OPERATE</p>
          <h2 className="mt-3 text-[36px] font-black tracking-[-0.04em]">Operational strengths for international buyers.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STRENGTHS.map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-[#D9E2EC] bg-white p-6">
                <h3 className="font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="rounded-3xl bg-[#0E7490] p-10 text-center text-white">
            <h2 className="text-[34px] font-black tracking-[-0.04em]">Looking to import Indian agricultural products?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-8 text-white/80">Send your product, specification, packing, quantity, destination and document requirements for review.</p>
            <Link href="/contact" className="mt-7 inline-flex rounded-xl bg-white px-7 py-3.5 text-sm font-black text-[#0E7490]">Request Export Quote</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
