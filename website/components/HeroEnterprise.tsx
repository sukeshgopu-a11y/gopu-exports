import Image from "next/image";
import Link from "next/link";

export default function HeroEnterprise() {

  return (
    <section className="bg-[#F5F7FA] py-16">

      <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">

        <div>

          <div className="inline-flex items-center gap-3">

            <div className="h-[2px] w-12 bg-[#0E7490]" />

            <p className="text-sm font-semibold tracking-[0.15em] text-[#0F172A]">

              GLOBAL EXPORT SOLUTIONS

            </p>

          </div>

          <h1 className="mt-8 text-6xl font-black leading-[1.05] tracking-tight text-[#0F172A]">

            Delivering Quality Products To The World

          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-[#64748B]">

            GOPU Exports is your trusted partner in global trade.
            We export premium agricultural products with reliability,
            compliance, and professional export coordination.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/products"
              className="rounded-md bg-[#0E7490] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#0A5A70]"
            >
              Explore Products
            </Link>

            <Link
              href="/contact"
              className="rounded-md border border-[#0E7490] px-8 py-4 text-sm font-semibold text-[#0E7490] transition hover:bg-[#E6F4F7]"
            >
              Get A Quote
            </Link>

          </div>

        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[#D9E2EC] bg-white shadow-sm">

          <div className="relative h-[560px] w-full">

            <Image
              src="/images/hero-export.jpg"
              alt="Export Operations"
              fill
              priority
              className="object-cover"
            />

          </div>

        </div>

      </div>

    </section>
  );
}