"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCommercialMoq } from "@/lib/moq";

type FeaturedProduct = {
  slug: string;
  title: string;
  tagline?: string;
  category: string;
  image?: string;
  moq?: string;
};

type FeaturedProductsCarouselProps = {
  products: FeaturedProduct[];
};

export default function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const isInViewport = useCallback((viewport: HTMLDivElement) => {
    const bounds = viewport.getBoundingClientRect();
    return bounds.top < window.innerHeight * 0.9 && bounds.bottom > 0;
  }, []);

  const move = useCallback((direction: 1 | -1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const card = viewport.querySelector<HTMLElement>("[data-featured-product]");
    const gap = Number.parseFloat(window.getComputedStyle(viewport).gap) || 20;
    const distance = card ? card.offsetWidth + gap : Math.min(Math.max(viewport.clientWidth * 0.84, 270), 360);
    const atEnd = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 16;
    const atStart = viewport.scrollLeft <= 16;

    if (direction === 1 && atEnd) {
      viewport.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (direction === -1 && atStart) {
      viewport.scrollTo({ left: Math.max(0, viewport.scrollWidth - viewport.clientWidth), behavior: "smooth" });
      return;
    }

    viewport.scrollBy({ left: distance * direction, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || products.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      if (!pausedRef.current && !document.hidden && isInViewport(viewport)) {
        move(1);
      }
    }, 4200);

    return () => {
      window.clearInterval(timer);
    };
  }, [isInViewport, move, products.length]);

  const pause = () => {
    pausedRef.current = true;
  };

  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div className="relative -mx-6 px-6 pb-3 sm:mx-0 sm:px-0">
      <div
        ref={viewportRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
      >
        {products.map((product) => (
          <Link
            key={product.slug}
            data-featured-product
            href={`/products/${product.slug}`}
            prefetch={false}
            className="group w-[270px] flex-none snap-start overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:w-[300px]"
          >
            <div className="relative h-52 overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 270px, 300px"
                  quality={58}
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[#F0F9FA] text-4xl" aria-hidden="true">Product</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent" />
              <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#0E7490] backdrop-blur-sm">
                {product.category.toUpperCase()}
              </span>
            </div>
            <div className="p-5">
              <h3 className="text-[16px] font-black tracking-[-0.02em] text-[#0F172A]">{product.title}</h3>
              <p className="mt-1.5 text-[13px] italic text-[#64748B]">{product.tagline}</p>
              <div className="mt-4 flex items-center justify-between border-t border-[#F1F5F9] pt-3">
                <span className="text-[12px] font-semibold text-[#475569]">MOQ: {formatCommercialMoq(product)}</span>
                <span className="text-[12px] font-bold text-[#0E7490]">VIEW DETAILS →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 sm:px-2">
          <button
            type="button"
            aria-label="Show previous featured product"
            onClick={() => move(-1)}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-[#CBD5E1] bg-white/95 text-[#0F172A] shadow-md transition hover:border-[#0E7490] hover:text-[#0E7490] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490] sm:h-11 sm:w-11"
          >
            <ChevronLeft aria-hidden="true" className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Show next featured product"
            onClick={() => move(1)}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className="pointer-events-auto grid h-10 w-10 place-items-center rounded-full border border-[#CBD5E1] bg-white/95 text-[#0F172A] shadow-md transition hover:border-[#0E7490] hover:text-[#0E7490] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490] sm:h-11 sm:w-11"
          >
            <ChevronRight aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
