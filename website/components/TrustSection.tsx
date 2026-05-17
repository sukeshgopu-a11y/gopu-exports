import Container from "./Container";

export default function TrustSection() {

  const items = [
    {
      title: "Verified Export Documentation",
      description:
        "Complete export documentation support including invoice, packing list, COO, fumigation, and shipping compliance.",
    },
    {
      title: "Quality Controlled Products",
      description:
        "Products sourced and processed with strict quality inspection to meet international buyer standards.",
    },
    {
      title: "Global Shipping Support",
      description:
        "Reliable logistics coordination for sea cargo, container booking, and export shipment handling.",
    },
    {
      title: "Buyer-Focused Communication",
      description:
        "Fast response times, transparent pricing, and dedicated support for importers and distributors.",
    },
  ];

  return (
    <section className="py-24 bg-white">

      <Container>

        <div className="max-w-3xl">

          <div className="inline-flex rounded-full bg-[#E6F4F7] px-4 py-2 text-sm font-medium text-[#0E7490]">

            Why Global Buyers Choose Us

          </div>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-[#0F172A]">

            Built For Long-Term International Trade Partnerships

          </h2>

          <p className="mt-6 text-lg leading-8 text-[#64748B]">

            GOPU Exports focuses on reliability,
            consistency, documentation accuracy,
            and long-term relationships with global
            importers and wholesale buyers.

          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          {items.map((item) => (

            <div
              key={item.title}
              className="rounded-3xl border border-[#D9E2EC] bg-[#F8FAFC] p-8"
            >

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6F4F7] text-xl font-bold text-[#0E7490]">

                ✓

              </div>

              <h3 className="mt-6 text-2xl font-semibold text-[#0F172A]">

                {item.title}

              </h3>

              <p className="mt-4 leading-8 text-[#64748B]">

                {item.description}

              </p>

            </div>

          ))}

        </div>

      </Container>

    </section>
  );
}