import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Export Markets",
  description:
    "GOPU Exports supports international buyer enquiries for Indian agricultural commodities with practical product, documentation, and shipment planning.",
};

const markets = [
  {
    region: "Asia Pacific",
    color: "bg-[#E6F4F7] text-[#0E7490]",
    countries: [
      { name: "Australia", flag: "🇦🇺", products: ["Spices", "Rice", "Fresh Produce"] },
      { name: "Singapore", flag: "🇸🇬", products: ["Spices", "Pulses", "Rice"] },
      { name: "Malaysia", flag: "🇲🇾", products: ["Spices", "Rice", "Oilseeds"] },
      { name: "Japan", flag: "🇯🇵", products: ["Spices", "Fresh Produce"] },
    ],
  },
  {
    region: "Middle East",
    color: "bg-[#FFF7ED] text-[#C2410C]",
    countries: [
      { name: "UAE", flag: "🇦🇪", products: ["Rice", "Spices", "Vegetables"] },
      { name: "Saudi Arabia", flag: "🇸🇦", products: ["Rice", "Spices", "Pulses"] },
      { name: "Qatar", flag: "🇶🇦", products: ["Rice", "Fresh Produce"] },
      { name: "Kuwait", flag: "🇰🇼", products: ["Spices", "Rice"] },
    ],
  },
  {
    region: "Europe",
    color: "bg-[#EFF6FF] text-[#1D4ED8]",
    countries: [
      { name: "Germany", flag: "🇩🇪", products: ["Spices", "Organic Produce"] },
      { name: "United Kingdom", flag: "🇬🇧", products: ["Spices", "Rice", "Pulses"] },
      { name: "Netherlands", flag: "🇳🇱", products: ["Fresh Produce", "Spices"] },
      { name: "France", flag: "🇫🇷", products: ["Spices", "Oilseeds"] },
    ],
  },
  {
    region: "North America",
    color: "bg-[#F0FDF4] text-[#166534]",
    countries: [
      { name: "USA", flag: "🇺🇸", products: ["Rice", "Spices", "Pulses"] },
      { name: "Canada", flag: "🇨🇦", products: ["Spices", "Rice", "Oilseeds"] },
    ],
  },
  {
    region: "Africa",
    color: "bg-[#FDF4FF] text-[#7C3AED]",
    countries: [
      { name: "South Africa", flag: "🇿🇦", products: ["Spices", "Rice"] },
      { name: "Kenya", flag: "🇰🇪", products: ["Spices", "Pulses"] },
    ],
  },
];

const requirements = [
  {
    title: "Phytosanitary Certificate",
    desc: "Required for all fresh produce and agricultural commodity exports.",
  },
  {
    title: "Certificate of Origin",
    desc: "Origin documentation can be discussed based on product type, shipment terms, and buyer destination.",
  },
  {
    title: "Food Safety Documentation",
    desc: "Food safety documentation requirements are reviewed based on product category and destination rules.",
  },
  {
    title: "Fumigation Certificate",
    desc: "Required for rice, pulses, and grains for pest-free export.",
  },
];

export default function MarketsPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">

      {/* HERO */}
      <section className="bg-[#081b2e] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-20">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-[2px] w-8 bg-[#0E7490]" />
            <p className="text-xs font-black tracking-[0.2em] text-white uppercase">
              Global Reach
            </p>
          </div>
          <h1 className="text-[48px] lg:text-[62px] font-black leading-[1.05] text-white">
            Our Export Markets
            <span className="text-[#0E7490]">.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-slate-300 max-w-[580px]">
            GOPU Exports supports importers, distributors, and wholesale buyers
            reviewing Indian agricultural commodities with practical product,
            documentation, and logistics planning.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact"
              className="rounded-md bg-[#0E7490] px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-[#0A5A70]"
            >
              ENQUIRE NOW →
            </Link>
            <Link
              href="/products"
              className="rounded-md border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold tracking-wide text-white transition hover:bg-white/20"
            >
              VIEW PRODUCTS →
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST PILLARS */}
      <section className="bg-white border-b border-[#D9E2EC]">
        <div className="mx-auto max-w-[1400px] px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#D9E2EC]">
            {[
              ["🌍", "Region Planning", "Destination-specific enquiry review"],
              ["📋", "Document Checklist", "Shipment documents mapped early"],
              ["🔬", "Quality Discussion", "Product parameters reviewed clearly"],
              ["💬", "Responsive Support", "Practical buyer communication"],
            ].map(([icon, label, sub]) => (
              <div key={label} className="px-8 py-7">
                <div className="text-3xl mb-2">{icon}</div>
                <div className="text-[15px] font-bold text-[#0F172A]">{label}</div>
                <div className="mt-1 text-[13px] text-[#64748B]">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETS BY REGION */}
      <section className="py-14">
        <div className="mx-auto max-w-[1400px] px-8">
          <div className="mb-10">
            <p className="text-xs font-black tracking-[0.2em] text-[#0E7490] uppercase">
              Buyer Enquiry Planning
            </p>
            <h2 className="mt-3 text-[32px] font-black tracking-[-0.04em] text-[#0F172A]">
              Regional Planning References
            </h2>
          </div>

          <div className="space-y-8">
            {markets.map((region) => (
              <div
                key={region.region}
                className="bg-white rounded-[16px] border border-[#D9E2EC] p-7"
              >
                <div className={`inline-flex px-4 py-1.5 rounded-full text-xs font-black tracking-wide mb-5 ${region.color}`}>
                  {region.region.toUpperCase()}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {region.countries.map((country) => (
                    <div
                      key={country.name}
                      className="rounded-[12px] border border-[#D9E2EC] bg-[#F8FAFC] p-5 hover:border-[#0E7490] hover:bg-[#E6F4F7] transition"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{country.flag}</span>
                        <span className="font-black text-[15px] text-[#0F172A]">
                          {country.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {country.products.map((p) => (
                          <span
                            key={p}
                            className="text-[11px] font-semibold bg-white border border-[#D9E2EC] rounded-full px-2.5 py-1 text-[#475569]"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTATION */}
      <section className="py-12 bg-white">
        <div className="mx-auto max-w-[1400px] px-8">
          <div className="mb-8">
            <p className="text-xs font-black tracking-[0.2em] text-[#0E7490] uppercase">
              Export Compliance
            </p>
            <h2 className="mt-3 text-[28px] font-black tracking-[-0.04em] text-[#0F172A]">
              Standard Export Documentation
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {requirements.map((r) => (
              <div
                key={r.title}
                className="rounded-[14px] border border-[#D9E2EC] bg-[#F8FAFC] p-6"
              >
                <div className="w-10 h-10 rounded-full bg-[#E6F4F7] flex items-center justify-center text-[#0E7490] font-black mb-4">
                  ✓
                </div>
                <h3 className="text-[14px] font-black text-[#0F172A] mb-2">
                  {r.title}
                </h3>
                <p className="text-[13px] leading-6 text-[#64748B]">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#F5F7FA]">
        <div className="mx-auto max-w-[1400px] px-8">
          <div className="rounded-2xl bg-[#0E2A3B] px-8 py-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-[28px] font-black text-white">
                Ready to Import from India?
              </h2>
              <p className="mt-2 text-slate-300 text-[14px] leading-7 max-w-xl">
                Send product requirements and destination country so the team can
                review documentation, packaging, and logistics assumptions.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 px-8 py-4 rounded-lg bg-[#0E7490] text-white text-sm font-black hover:bg-[#0A6178] transition"
            >
              GET A QUOTE →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
