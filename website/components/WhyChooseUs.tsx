export default function WhyChooseUs() {

  const features = [
    {
      title: "Export Documentation",
      description:
        "Professional support for invoices, export documents, compliance, and shipment coordination.",
    },
    {
      title: "Reliable Sourcing",
      description:
        "Carefully sourced agricultural products selected for quality and international trade readiness.",
    },
    {
      title: "Global Logistics Support",
      description:
        "Shipment planning and export coordination for smooth international delivery operations.",
    },
    {
      title: "Buyer Communication",
      description:
        "Transparent communication and long-term business relationship support for importers.",
    },
  ];

  return (
    <section className="bg-white py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="max-w-3xl">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0E7490]">

            Why Buyers Choose Us

          </p>

          <h2 className="mt-5 text-5xl font-black leading-tight tracking-tight text-[#0F172A]">

            Built For Serious International Trade Operations

          </h2>

          <p className="mt-6 text-lg leading-9 text-[#64748B]">

            GOPU Exports focuses on reliable supply,
            professional export coordination, and trusted
            global trade relationships.

          </p>

        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="rounded-[2rem] border border-[#D9E2EC] bg-[#F8FAFC] p-10"
            >

              <div className="h-1 w-14 bg-[#0E7490]" />

              <h3 className="mt-8 text-3xl font-bold text-[#0F172A]">

                {feature.title}

              </h3>

              <p className="mt-5 leading-8 text-[#64748B]">

                {feature.description}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}