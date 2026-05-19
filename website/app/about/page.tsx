import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PublicCertificationBadges from "@/components/PublicCertificationBadges";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about GOPU Exports, company verification details, founder message, sourcing philosophy, export process, quality control, and documentation support.",
};

const VALUES = [
  { icon: "🏅", title: "Quality First", desc: "We keep product quality, grading, and buyer requirements central to every sourcing discussion." },
  { icon: "🤝", title: "Integrity", desc: "We communicate clearly on pricing, quantity, timelines, and documentation requirements." },
  { icon: "🌱", title: "Responsible Sourcing", desc: "We work with supplier networks that can support product availability, packaging, and trade requirements." },
  { icon: "🌍", title: "Trade Readiness", desc: "Our export process is built around buyer destinations, documentation needs, and shipment coordination." },
  { icon: "⚡", title: "Reliability", desc: "We focus on organised communication, practical timelines, and clear shipment planning." },
  { icon: "💡", title: "Continuous Improvement", desc: "We constantly refine packaging, traceability, and logistics to meet evolving global food safety standards." },
];

const STRENGTHS = [
  {
    icon: "🔬",
    title: "Quality-Focused Exports",
    desc: "Product checks and grading are coordinated around buyer specifications and export handling needs.",
  },
  {
    icon: "🤝",
    title: "Reliable Supplier Network",
    desc: "Supplier relationships are managed to support consistent sourcing across agricultural categories.",
  },
  {
    icon: "📦",
    title: "Export-Compliant Packaging",
    desc: "Packaging options are planned around product handling, buyer requirements, and export documentation needs.",
  },
  {
    icon: "📋",
    title: "Professional Documentation Support",
    desc: "Documentation support is aligned with product type, buyer destination, and standard export requirements.",
  },
  {
    icon: "🚢",
    title: "Timely Shipment Coordination",
    desc: "Orders are coordinated with attention to readiness, logistics communication, and shipment milestones.",
  },
  {
    icon: "🎯",
    title: "Flexible Product Sourcing",
    desc: "The sourcing process supports standard catalogue items as well as specific buyer requirements.",
  },
  {
    icon: "💬",
    title: "Buyer-Centric Communication",
    desc: "Enquiries and order discussions are handled with practical updates and clear next steps.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#071624]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.webp"
            alt="GOPU Exports Operations"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071624]/90 to-[#0E7490]/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1450px] px-6 py-24 sm:px-8 lg:py-32">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-[#0E7490]" />
            <p className="text-[11px] font-black tracking-[0.26em] text-white/60">ABOUT GOPU EXPORTS</p>
          </div>
          <h1 className="mt-5 max-w-3xl text-[48px] font-black leading-[0.92] tracking-[-0.05em] text-white lg:text-[64px]">
            Delivering India&apos;s Finest<br />
            <span className="text-[#67C9D8]">To The World.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-slate-300">
            GOPU Exports is a Warangal-based agricultural export company supporting
            buyer enquiries for spices, rice, fresh produce, and agricultural commodities,
            with specification-led sourcing, documentation planning, and logistics coordination.
          </p>

          {/* Trust tags — no fake numbers */}
          <div className="mt-10">
            <PublicCertificationBadges variant="dark" limit={6} />
          </div>
        </div>
      </section>

      <section id="founder-message" className="bg-white py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-3xl bg-[#071624] p-8 text-white">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">FOUNDER MESSAGE</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em]">Built for careful buyers, not quick claims.</h2>
              <p className="mt-5 text-sm leading-7 text-slate-300">
                Our sourcing philosophy is simple: understand the buyer requirement first, confirm what can be supplied responsibly, and communicate documentation and shipment assumptions clearly before the order moves forward.
              </p>
              <p className="mt-5 text-sm font-semibold text-white">Founder / Director</p>
              <p className="text-sm text-slate-400">GOPU Exports</p>
            </div>
            <div id="vision" className="rounded-3xl border border-[#D9E2EC] bg-[#F8FAFC] p-8">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0E7490]">COMPANY VERIFICATION</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#0F172A]">A verified, process-driven Indian export partner.</h2>
              <p className="mt-5 text-sm leading-7 text-[#64748B]">
                GOPU Exports builds buyer confidence through verifiable company details, practical documentation support, quality-focused sourcing, and disciplined communication from enquiry to dispatch.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ["IEC", COMPANY.iec],
                  ["CIN", COMPANY.cin],
                  ["GST", COMPANY.gst],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#D9E2EC] bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0E7490]">{label}</p>
                    <p className="mt-2 break-words text-sm font-black text-[#0F172A]">{value}</p>
                  </div>
                ))}
              </div>
              <Link href="/company-verification" className="mt-6 inline-flex rounded-xl bg-[#0E7490] px-5 py-3 text-sm font-bold text-white">
                Request Verification Documents
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">OUR STORY</p>
              <h2 className="mt-3 text-[38px] font-black leading-[1.05] tracking-[-0.04em] text-[#0F172A]">
                Built on Trust, Quality<br />and Trade Expertise
              </h2>
              <p className="mt-5 text-[15px] leading-[1.9] text-[#64748B]">
                GOPU Exports was established to help international buyers source Indian
                agricultural products with practical communication, clear specifications,
                and realistic export documentation support. The company focuses on
                structured enquiry handling rather than generic commodity promises.
              </p>
              <p className="mt-4 text-[15px] leading-[1.9] text-[#64748B]">
                Each buyer discussion starts with product type, grade, packing, quantity,
                destination, and document requirements. This helps the team review sourcing
                feasibility, prepare relevant options, and coordinate the next commercial step.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="rounded-lg bg-[#0E7490] px-7 py-3.5 text-[13px] font-bold tracking-wide text-white transition hover:bg-[#0A5A70]"
                >
                  GET A QUOTE →
                </Link>
                <Link
                  href="/products"
                  className="rounded-lg border border-[#D9E2EC] px-7 py-3.5 text-[13px] font-bold text-[#374151] transition hover:border-[#0E7490] hover:text-[#0E7490]"
                >
                  EXPLORE PRODUCTS →
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src="/images/hero-bg.webp"
                  alt="GOPU Exports warehouse and operations"
                  width={700}
                  height={500}
                  className="h-[420px] w-full object-cover"
                />
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-[#D9E2EC] bg-white p-5 shadow-xl">
                <p className="text-[22px] font-black leading-none tracking-[-0.03em] text-[#0E7490]">EXPORT</p>
                <p className="mt-1 text-[13px] font-semibold text-[#374151]">Documentation Ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION / PROMISE ───────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Mission */}
            <div className="rounded-2xl border border-[#D9E2EC] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E6F4F7] text-2xl">🎯</div>
              <h2 className="mt-5 text-[22px] font-black tracking-[-0.03em] text-[#0F172A]">Our Mission</h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-[#64748B]">
                To support buyers with clear Indian agricultural product sourcing, practical
                documentation guidance, and realistic shipment coordination.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl bg-[#071624] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E7490]/20 text-2xl">🌏</div>
              <h2 className="mt-5 text-[22px] font-black tracking-[-0.03em] text-white">Our Vision</h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-slate-400">
                To build a verifiable agricultural export platform through consistent sourcing,
                food safety awareness, and transparent supply-chain communication.
              </p>
            </div>

            {/* Promise */}
            <div className="rounded-2xl border border-[#D9E2EC] bg-[#F0F9FA] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E7490] text-2xl">🤝</div>
              <h2 className="mt-5 text-[22px] font-black tracking-[-0.03em] text-[#0F172A]">Our Promise</h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-[#64748B]">
                Every enquiry receives practical follow-up, clear documentation guidance,
                and coordinated support from product selection through shipment planning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE VALUES ──────────────────────────────────────── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">WHAT DRIVES US</p>
            <h2 className="mt-3 text-[38px] font-black tracking-[-0.04em] text-[#0F172A]">Our Core Values</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-[#D9E2EC] bg-white p-7 transition hover:border-[#0E7490]/30 hover:shadow-md"
              >
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-4 text-[17px] font-bold text-[#0F172A]">{v.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.8] text-[#64748B]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPORT CAPABILITIES ──────────────────────────────── */}
      <section className="bg-[#071624] py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-black tracking-[0.24em] text-[#67C9D8]">EXPORT CAPABILITIES</p>
              <h2 className="mt-3 text-[38px] font-black leading-[1.05] tracking-[-0.04em] text-white">
                End-to-End Export<br />Management
              </h2>
              <p className="mt-5 text-[15px] leading-[1.9] text-slate-400">
                We coordinate key export steps from supplier sourcing and quality checks
                to packaging, documentation, logistics communication, and buyer updates.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Farm-level quality grading and moisture testing",
                  "Quality-focused sourcing and product checks",
                  "Packaging guidance based on buyer requirements",
                  "Export documentation planning and support",
                  "Shipment coordination with logistics partners",
                  "Buyer communication from enquiry to dispatch",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px] text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#0E7490]/30 text-[10px] text-[#67C9D8]">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Quality Inspection", icon: "QC", desc: "Multi-point checks at source, warehouse, and pre-shipment stages." },
                { label: "Documentation", icon: "DS", desc: "Phytosanitary, COO, COA, inspection, and fumigation document support." },
                { label: "Logistics", icon: "LG", desc: "Shipment planning and coordination with logistics partners." },
                { label: "Buyer Support", icon: "BS", desc: "Dedicated updates and responsive export communication." },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5"
                >
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="mt-3 text-[15px] font-bold text-white">{item.label}</h3>
                  <p className="mt-2 text-[12px] leading-[1.7] text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OPERATIONAL STRENGTHS (replaces fake timeline) ───── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">HOW WE OPERATE</p>
            <h2 className="mt-3 text-[38px] font-black tracking-[-0.04em] text-[#0F172A]">
              Our Operational Strengths
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.8] text-[#64748B]">
              Every export from GOPU is backed by a systematic approach to quality,
              supplier management, and buyer communication.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STRENGTHS.map((s) => (
              <div
                key={s.title}
                className="rounded-2xl border border-[#D9E2EC] bg-white p-7 transition hover:border-[#0E7490]/40 hover:shadow-md"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-4 text-[15px] font-bold text-[#0F172A]">{s.title}</h3>
                <p className="mt-2 text-[13px] leading-[1.8] text-[#64748B]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="rounded-2xl bg-[#0E7490] p-12 text-center">
            <h2 className="text-[36px] font-black tracking-[-0.04em] text-white">
              Partner with GOPU Exports
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.8] text-white/80">
              Ready to source Indian agricultural commodities? Send product, packing,
              destination, and document requirements for review.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-lg bg-white px-8 py-4 text-[13px] font-bold tracking-wide text-[#0E7490] transition hover:bg-[#F0F9FA]"
              >
                SEND AN ENQUIRY →
              </Link>
              <Link
                href="/products"
                className="rounded-lg border border-white/30 px-8 py-4 text-[13px] font-bold tracking-wide text-white transition hover:bg-white/10"
              >
                VIEW PRODUCTS →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
