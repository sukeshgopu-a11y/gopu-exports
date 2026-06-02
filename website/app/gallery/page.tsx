import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/src/lib/supabase/public";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery",
  alternates: { canonical: "/gallery" },
  description:
    "View GOPU Exports' product gallery — premium spices, basmati rice, fresh fruits and vegetables ready for global export.",
};

type GalleryImage = {
  id: string;
  title: string | null;
  alt_text: string | null;
  image_url: string;
};

async function getGalleryImages() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("gallery_images")
    .select("id,title,alt_text,image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<GalleryImage[]>();

  return data ?? [];
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
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
            Premium Indian agricultural commodities inspected, certified, and
            ready for global export. Spices, rice, fresh fruits, and vegetables.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        {images.length === 0 ? (
          <div className="rounded-2xl border border-[#D9E2EC] bg-white p-10 text-center">
            <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#0F172A]">
              Gallery updates are coming soon.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-[#64748B]">
              The export gallery is managed from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm"
              >
                <div className="relative h-[280px] overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.alt_text || item.title || "GOPU Exports gallery image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-[16px] font-black text-white">
                      {item.title || "GOPU Exports"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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
              BROWSE ALL PRODUCTS
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/30 px-8 py-4 text-[13px] font-bold tracking-wide text-white transition hover:bg-white/10"
            >
              GET A QUOTE
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
