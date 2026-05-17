export default function ExportMarkets() {

  const markets = [
    "Australia",
    "United Arab Emirates",
    "Saudi Arabia",
    "Singapore",
    "Malaysia",
    "United Kingdom",
    "Europe",
    "Southeast Asia",
  ];

  return (
    <section className="bg-[#F5F7FA] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="rounded-[2.5rem] border border-[#D9E2EC] bg-white p-10 lg:p-16">

          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

            <div>

              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0E7490]">

                Global Export Markets

              </p>

              <h2 className="mt-5 text-5xl font-black leading-tight tracking-tight text-[#0F172A]">

                Serving Buyers Across International Trade Regions

              </h2>

              <p className="mt-6 text-lg leading-9 text-[#64748B]">

                GOPU Exports focuses on supplying
                agricultural commodities to growing
                international markets with reliable
                export coordination and buyer support.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-5">

              {markets.map((market) => (

                <div
                  key={market}
                  className="rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] px-6 py-5 text-sm font-semibold text-[#0F172A]"
                >

                  {market}

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}