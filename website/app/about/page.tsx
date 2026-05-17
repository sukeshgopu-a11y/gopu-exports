import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about GOPU Exports — India's trusted agricultural export company supplying premium spices, rice, and fresh produce to global importers with certified quality and reliable logistics.",
};

const VALUES = [
  { icon: "🏅", title: "Quality First", desc: "Every product is tested and inspected before leaving our facility — zero compromise on grade, moisture, or purity specifications." },
  { icon: "🤝", title: "Integrity", desc: "We honour every commitment — on pricing, quantity, and delivery timelines. Our word is our contract." },
  { icon: "🌱", title: "Sustainability", desc: "Direct farmer partnerships and traceable supply chains support sustainable agriculture and fair trade practices." },
  { icon: "🌍", title: "Global Standards", desc: "Our team understands import regulations, phytosanitary norms, and customs requirements across destination countries worldwide." },
  { icon: "⚡", title: "Reliability", desc: "Consistent quality, on-time shipments, and complete documentation on every order — our track record earns long-term buyer trust." },
  { icon: "💡", title: "Continuous Improvement", desc: "We constantly refine packaging, traceability, and logistics to meet evolving global food safety standards." },
];

const STRENGTHS = [
  {
    icon: "🔬",
    title: "Quality-Focused Exports",
    desc: "Multi-point quality checks at farm level, warehouse grading, and pre-shipment inspection by accredited third-party agencies.",
  },
  {
    icon: "🤝",
    title: "Reliable Supplier Network",
    desc: "Direct relationships with verified farmers across Andhra Pradesh, Kerala, Karnataka, Maharashtra, and Tamil Nadu.",
  },
  {
    icon: "📦",
    title: "Export-Compliant Packaging",
    desc: "Custom packaging from 1 kg retail to 50 kg bulk — jute bags, PP bags, vacuum-sealed, and private-label options.",
  },
  {
    icon: "📋",
    title: "Professional Documentation",
    desc: "In-house documentation team prepares phytosanitary certificates, COA, COO, fumigation reports, MSDS, and bill of lading.",
  },
  {
    icon: "🚢",
    title: "Timely Shipment Coordination",
    desc: "Dedicated logistics coordinators manage container booking, freight forwarding, and port handling across five major Indian ports.",
  },
  {
    icon: "🎯",
    title: "Flexible Product Sourcing",
    desc: "Wide sourcing network allows us to supply seasonal commodities and custom product specifications on request.",
  },
  {
    icon: "💬",
    title: "Buyer-Centric Communication",
    desc: "Responsive WhatsApp, email, and video-call support in your time zone — with a dedicated account manager for every buyer.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#071624]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
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
            GOPU Exports is a Warangal-based agricultural export company supplying
            premium spices, rice, and fresh produce to importers worldwide —
            backed by certified quality, full documentation, and dependable logistics.
          </p>

          {/* Trust tags — no fake numbers */}
          <div className="mt-10 flex flex-wrap gap-3">
            {["APEDA Registered", "FSSAI Licensed", "ISO 22000", "HACCP Compliant", "IEC Registered", "Spice Board Certified"].map((tag) => (
              <span
                key={tag}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-bold text-white backdrop-blur-sm"
              >
                ✓ {tag}
              </span>
            ))}
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
                GOPU Exports was established with a single mission: to bring the richness of
                Indian agriculture to the global marketplace with complete transparency and
                uncompromising quality. What began as a focused spice trading operation
                has grown into a multi-category export firm serving importers, distributors,
                and supermarket chains across multiple continents.
              </p>
              <p className="mt-4 text-[15px] leading-[1.9] text-[#64748B]">
                We have built direct relationships with farmers across Andhra Pradesh,
                Kerala, Karnataka, Maharashtra, and Tamil Nadu — ensuring traceability from
                field to port. Every product we export carries the pride of Indian agricultural
                heritage and the rigour of modern food safety standards.
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
                  src="/images/hero-bg.jpg"
                  alt="GOPU Exports warehouse and operations"
                  width={700}
                  height={500}
                  className="h-[420px] w-full object-cover"
                />
              </div>
              {/* floating badge */}
              <div className="absolute -bottom-6 -left-6 rounded-2xl border border-[#D9E2EC] bg-white p-5 shadow-xl">
                <p className="text-[28px] font-black leading-none tracking-[-0.03em] text-[#0E7490]">APEDA</p>
                <p className="mt-1 text-[13px] font-semibold text-[#374151]">Registered Exporter</p>
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
                To deliver world-class Indian agricultural products to global buyers with
                integrity, reliability, and certified quality — enabling long-term trade
                partnerships that benefit both importers and source farmers.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-2xl bg-[#071624] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E7490]/20 text-2xl">🌏</div>
              <h2 className="mt-5 text-[22px] font-black tracking-[-0.03em] text-white">Our Vision</h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-slate-400">
                To be recognised as India&apos;s most trusted agricultural export brand — known
                across every importing country for consistency, food safety compliance,
                and transparent supply chains from farm to port.
              </p>
            </div>

            {/* Promise */}
            <div className="rounded-2xl border border-[#D9E2EC] bg-[#F0F9FA] p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0E7490] text-2xl">🤝</div>
              <h2 className="mt-5 text-[22px] font-black tracking-[-0.03em] text-[#0F172A]">Our Promise</h2>
              <p className="mt-3 text-[15px] leading-[1.8] text-[#64748B]">
                Every enquiry receives a detailed response within 24 hours. Every order ships
                with complete phytosanitary, COA, and customs documentation. Every shipment
                arrives on specification — or we make it right.
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
                We handle the entire export process — from farmer sourcing and quality
                inspection to container booking, documentation, and tracking to port of
                discharge. Our in-house team eliminates the complexity of international trade.
              </p>
              <ul className="mt-7 space-y-3">
                {[
                  "Farm-level quality grading and moisture testing",
                  "Third-party lab testing (pesticide, aflatoxin, heavy metals)",
                  "Custom packaging: retail 1 kg to bulk 50 kg",
                  "Full phytosanitary, COA, fumigation, MSDS documentation",
                  "Multi-port shipping: Chennai, Mumbai, Mundra, JNPT, Kolkata",
                  "EXIM bank financed shipments and LC handling",
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
                { label: "Quality Inspection", icon: "🔬", desc: "Multi-point checks at source, warehouse, and pre-shipment stages." },
                { label: "Documentation", icon: "📋", desc: "Phytosanitary, COO, COA, HACCP, fumigation — all managed in-house." },
                { label: "Logistics", icon: "🚢", desc: "Container booking, freight forwarding, and port handling across 5 major ports." },
                { label: "Buyer Support", icon: "💬", desc: "Dedicated account manager, WhatsApp updates, and responsive communication." },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-3 text-[15px] font-bold text-white">{item.label}</h3>
                  <p className="mt-2 text-[13px] leading-[1.7] text-slate-400">{item.desc}</p>
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
              Ready to source premium Indian agricultural commodities? Send us your
              requirements and receive a detailed quote within 24 hours.
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
