export default function StatsStrip() {

  const stats = [
    {
      number: "50+",
      label: "Countries Served",
    },
    {
      number: "1500+",
      label: "Shipments Coordinated",
    },
    {
      number: "10+",
      label: "Years Trade Experience",
    },
    {
      number: "100%",
      label: "Buyer Support Focused",
    },
  ];

  return (
    <section className="bg-white">

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 border-y border-[#D9E2EC] px-6 py-10 lg:grid-cols-4">

        {stats.map((stat) => (

          <div
            key={stat.label}
            className="flex flex-col items-center justify-center text-center"
          >

            <p className="text-5xl font-black tracking-tight text-[#0F172A]">

              {stat.number}

            </p>

            <p className="mt-3 text-sm font-medium text-[#64748B]">

              {stat.label}

            </p>

          </div>

        ))}

      </div>

    </section>
  );
}