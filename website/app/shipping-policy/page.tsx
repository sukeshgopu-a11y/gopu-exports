import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping and logistics policy for GOPU Exports buyer enquiries, export packing, documentation, and shipment coordination.",
  alternates: { canonical: "/shipping-policy" },
};

const items = [
  {
    title: "Shipment Planning",
    body: "Shipment planning depends on product type, order quantity, packing format, destination, Incoterms, inspection requirements, and route availability. Final timelines are confirmed only during quotation and order discussion.",
  },
  {
    title: "Packaging",
    body: "Packaging options may include PP bags, jute bags, cartons, vacuum packs, food-grade bags, mesh bags, crates, or private-label retail packs depending on the product and buyer requirements.",
  },
  {
    title: "Documentation",
    body: "Common export documents may include commercial invoice, packing list, certificate of origin, phytosanitary support, fumigation records, inspection documents, and product-specific declarations when applicable.",
  },
  {
    title: "Freight and Incoterms",
    body: "Buyers may nominate a forwarder or request freight coordination support. FOB, CIF, CFR, or other terms must be agreed in writing before shipment planning.",
  },
];

export default function ShippingPolicyPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">Buyer Support</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Shipping Policy</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            Practical shipping information for international buyers discussing Indian agricultural product sourcing.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto grid max-w-4xl gap-5">
          {items.map((item) => (
            <section key={item.title} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black tracking-[-0.03em]">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[#475569]">{item.body}</p>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
