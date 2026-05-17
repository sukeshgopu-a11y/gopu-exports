import Link from "next/link";

export default function CTABanner() {

  return (
    <section className="bg-[#F5F7FA] pb-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="overflow-hidden rounded-[2.5rem] bg-[#0F172A] px-10 py-16 lg:px-16 lg:py-20">

          <div className="max-w-3xl">

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E6F4F7]">

              International Trade Enquiries

            </p>

            <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight text-white">

              Looking For A Reliable Export Supply Partner?

            </h2>

            <p className="mt-6 text-lg leading-9 text-slate-300">

              Contact GOPU Exports for product availability,
              shipment discussions, export coordination,
              and wholesale trade enquiries.

            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/contact"
                className="rounded-md bg-[#0E7490] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#0A5A70]"
              >
                Request A Quote
              </Link>

              <Link
                href="/products"
                className="rounded-md border border-white/20 px-8 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                View Products
              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}