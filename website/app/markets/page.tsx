import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "International Buyer Markets",
  description:
    "GOPU Exports supports international buyer enquiries for Indian agricultural and food products with destination-specific product, documentation and shipment planning.",
  alternates: { canonical: "/markets" },
};

const regions = [
  ["Asia Pacific", ["Australia", "Singapore", "Malaysia", "Japan"]],
  ["Middle East", ["UAE", "Saudi Arabia", "Qatar", "Kuwait"]],
  ["Europe", ["United Kingdom", "Germany", "Netherlands", "France"]],
  ["North America", ["USA", "Canada"]],
  ["Africa", ["South Africa", "Kenya"]],
] as const;

const requirements = [
  ["Certificate of Origin", "May be required depending on product, shipment terms, buyer requirements and destination-country rules."],
  ["Phytosanitary Documentation", "May be required for relevant plant and agricultural products depending on destination requirements."],
  ["Food Safety / Product Documents", "Requirements vary by product category, buyer specification and destination market."],
  ["Fumigation Documentation", "May be required for certain products or destinations and should be confirmed before quotation."],
];

export default function MarketsPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#081b2e] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#67C9D8]">International Buyer Markets</p>
          <h1 className="mt-4 text-[48px] font-black leading-[1.02] tracking-[-0.04em] lg:text-[62px]">Markets We Support</h1>
          <p className="mt-5 max-w-2xl text-[16px] leading-8 text-slate-300">
            GOPU Exports reviews export enquiries from international importers, distributors and wholesale buyers. Product eligibility, packing, documentation and commercial feasibility are confirmed for each destination before order confirmation.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="rounded-xl bg-[#0E7490] px-7 py-3.5 text-sm font-black text-white">Request Export Quote</Link>
            <Link href="/products" className="rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-black text-white">View Products</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-14 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0E7490]">Destination Planning</p>
          <h2 className="mt-3 text-[32px] font-black tracking-[-0.04em]">Regional buyer enquiry references</h2>
          <p className="mt-4 text-sm leading-7 text-[#64748B]">
            The countries below represent markets where buyer enquiries may be reviewed. They do not by themselves represent completed historical shipments or guaranteed product eligibility.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {regions.map(([region, countries]) => (
            <div key={region} className="rounded-2xl border border-[#D9E2EC] bg-white p-6">
              <h3 className="text-lg font-black">{region}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {countries.map((country) => (
                  <span key={country} className="rounded-full border border-[#D9E2EC] bg-[#F8FAFC] px-3 py-1.5 text-xs font-bold text-[#475569]">{country}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0E7490]">Export Documentation</p>
          <h2 className="mt-3 text-[30px] font-black tracking-[-0.04em]">Destination requirements are confirmed case by case.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {requirements.map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] p-5">
                <h3 className="font-black">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8">
          <div className="rounded-3xl bg-[#071624] p-9 text-white lg:flex lg:items-center lg:justify-between lg:gap-8">
            <div>
              <h2 className="text-[30px] font-black">Looking to Import from India?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">Send your product, quantity, packing, destination country and document requirements for an export quotation.</p>
            </div>
            <Link href="/contact" className="mt-6 inline-flex rounded-xl bg-[#0E7490] px-7 py-3.5 text-sm font-black text-white lg:mt-0">Request Export Quote</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
