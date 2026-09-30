import type { Metadata } from "next";
import { publicMetadata } from "@/lib/seo";
import { getPublicGalleryImages } from "@/lib/publicGallery";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const images = await getPublicGalleryImages();
  const base = publicMetadata(
    "GOPU Exports Product & Operations Gallery",
    "View published product and operations images from GOPU Exports. Contact our Hyderabad team for buyer verification and export enquiries.",
    "/gallery",
  );

  if (images.length === 0) {
    return {
      ...base,
      robots: { index: false, follow: true },
    };
  }

  return base;
}

export default async function GalleryPage() {
  const images = await getPublicGalleryImages();

  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-10 bg-[#0E7490]" />
            <p className="text-[11px] font-black tracking-[0.26em] text-[#0E7490]">PRODUCT & OPERATIONS GALLERY</p>
          </div>
          <h1 className="mt-4 text-[52px] font-black leading-none tracking-[-0.05em] text-[#0F172A] lg:text-[64px]">
            Product & Operations Gallery
          </h1>
          <p className="mt-4 max-w-xl text-[17px] leading-[1.8] text-[#64748B]">
            Published product and operations images from GOPU Exports. Product availability, grade and packing are confirmed for each export enquiry.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-6 py-14 sm:px-8">
        {images.length === 0 ? (
          <div className="rounded-2xl border border-[#D9E2EC] bg-white p-10 text-center">
            <h2 className="text-[22px] font-black tracking-[-0.03em] text-[#0F172A]">
              Published gallery images are not available yet.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-[#64748B]">
              Browse the current export catalogue for active products, or contact the Hyderabad team for product and company verification information.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/products" className="rounded-lg bg-[#0E7490] px-6 py-3 text-[13px] font-bold text-white">
                BROWSE EXPORT PRODUCTS
              </Link>
              <Link href="/company-verification" className="rounded-lg border border-[#D9E2EC] px-6 py-3 text-[13px] font-bold text-[#0F172A]">
                COMPANY VERIFICATION
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((item) => (
              <figure key={item.id} className="group overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm">
                <div className="relative h-[280px] overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.alt_text || item.title || "GOPU Exports gallery image"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
                  <figcaption className="absolute bottom-0 left-0 p-5 text-[16px] font-black text-white">
                    {item.title || item.alt_text || "GOPU Exports"}
                  </figcaption>
                </div>
              </figure>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-12 rounded-2xl bg-[#0E7490] p-10 text-center">
            <h2 className="text-[26px] font-black tracking-[-0.03em] text-white">
              Discuss an Export Requirement
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-white/80">
              Share the product, specifications, packing, quantity and destination for an export quotation.
            </p>
            <Link href="/contact" className="mt-7 inline-flex rounded-lg bg-white px-8 py-4 text-[13px] font-bold tracking-wide text-[#0E7490]">
              REQUEST EXPORT QUOTE
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
