import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "View GOPU Exports' product gallery — premium spices, basmati rice, fresh fruits and vegetables ready for global export.",
};

const GALLERY_ITEMS = [
  {
    src: "/products/turmeric.jpg",
    label: "Turmeric",
    sub: "High Curcumin Export Grade",
  },
  {
    src: "/products/rice.jpg",
    label: "Basmati Rice",
    sub: "Aged Long Grain",
  },
  {
    src: "/products/red-chilli.jpg",
    label: "Red Chilli",
    sub: "Guntur S4 Grade",
  },
  {
    src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop",
    label: "Green Cardamom",
    sub: "Premium Export Grade",
  },
  {
    src: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=800&auto=format&fit=crop",
    label: "Black Pepper",
    sub: "MG1 Grade — Malabar",
  },
  {
    src: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop",
    label: "Alphonso Mango",
    sub: "GI Protected Origin",
  },
  {
    src: "https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop",
    label: "Red Onion",
    sub: "Nashik Premium Export",
  },
  {
    src: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop",
    label: "Non-Basmati Rice",
    sub: "IR64 Parboiled Export",
  },
  {
    src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop",
    label: "Cloves",
    sub: "High Eugenol Grade",
  },
];

export default function GalleryPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">

      {/* HERO */}
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-10 bg-[#0E7490]" />
            <p className="text-[11px] font-black tracking-[0.26em] text-[#0E7490]">PRODUCT GALLERY</p>
          </div>
          <h1 className="mt-4 text-[52px] font-black leading-none tracking-[-0.05em] text-[#0F172A] lg:text-[64px]">
            Our Products
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.8] text-[#64748B]">
            Premium Indian agricultural commodities — inspected, certified, and
            ready for global export. Spices, rice, fresh fruits, and vegetables.
          </p>
        </div>
      </section>

      {/* GALLERY GRID */}
      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.src}
              className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm"
            >
              <div className="relative h-[280px] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-[16px] font-black text-white">{item.label}</p>
                  <p className="text-[12px] text-white/70">{item.sub}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-[#0E7490] p-10 text-center">
          <h2 className="text-[26px] font-black tracking-[-0.03em] text-white">
            Interested in Any of These Products?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-white/80">
            Request a detailed quote with full specifications, packaging options,
            and pricing for your destination country.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/products"
              className="rounded-lg bg-white px-8 py-4 text-[13px] font-bold tracking-wide text-[#0E7490] transition hover:bg-[#F0F9FA]"
            >
              BROWSE ALL PRODUCTS →
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/30 px-8 py-4 text-[13px] font-bold tracking-wide text-white transition hover:bg-white/10"
            >
              GET A QUOTE →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
