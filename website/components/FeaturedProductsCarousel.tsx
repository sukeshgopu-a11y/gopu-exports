"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCommercialMoq } from "@/lib/moq";

const AUTO_ADVANCE_MS = 3000;
const INTERACTION_PAUSE_MS = 4500;

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

function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

export default function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const scrollFrameRef = useRef<number | null>(null);
  const autoplayTimerRef = useRef<number | null>(null);
  const autoplayScheduleIdRef = useRef(0);
  const programmaticTargetIndexRef = useRef<number | null>(null);
  const dragStartXRef = useRef<number | null>(null);
  const suppressClickUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [interactionPauseUntil, setInteractionPauseUntil] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const productCount = products.length;
  const safeActiveIndex = productCount === 0 ? 0 : Math.min(activeIndex, productCount - 1);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.25),
      { threshold: [0, 0.25] },
    );

    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  const scrollToProduct = useCallback((index: number, instant = false) => {
    const viewport = viewportRef.current;
    if (!viewport || productCount === 0) return;

    const nextIndex = wrapIndex(index, productCount);
    const card = cardRefs.current[nextIndex];
    if (!card) return;

    programmaticTargetIndexRef.current = nextIndex;
    viewport.scrollTo({
      left: card.offsetLeft,
      behavior: instant || reducedMotion ? "auto" : "smooth",
    });
    setActiveIndex(nextIndex);
  }, [productCount, reducedMotion]);

  const pauseAutoplay = useCallback(() => {
    setInteractionPauseUntil(Date.now() + INTERACTION_PAUSE_MS);
  }, []);

  useEffect(() => {
    if (autoplayTimerRef.current !== null) {
      window.clearTimeout(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }

    if (productCount < 2 || !isInView) return;

    const remainingPause = Math.max(0, interactionPauseUntil - Date.now());
    const scheduleId = ++autoplayScheduleIdRef.current;
    const timer = window.setTimeout(() => {
      if (scheduleId !== autoplayScheduleIdRef.current) return;

      const nextIndex = wrapIndex(safeActiveIndex + 1, productCount);

      if (remainingPause > 0) {
        setInteractionPauseUntil(0);
      }

      // Boundary resets are instant so the user never sees a long reverse scroll.
      scrollToProduct(nextIndex, safeActiveIndex === productCount - 1);
    }, remainingPause || AUTO_ADVANCE_MS);
    autoplayTimerRef.current = timer;

    return () => {
      if (autoplayTimerRef.current === timer) {
        window.clearTimeout(timer);
        autoplayTimerRef.current = null;
      }
    };
  }, [interactionPauseUntil, isInView, productCount, safeActiveIndex, scrollToProduct]);

  useEffect(() => () => {
    if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    if (autoplayTimerRef.current !== null) window.clearTimeout(autoplayTimerRef.current);
  }, []);

  const updateActiveIndexFromScroll = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport || productCount === 0) return;

    if (scrollFrameRef.current !== null) window.cancelAnimationFrame(scrollFrameRef.current);
    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const programmaticTargetIndex = programmaticTargetIndexRef.current;
      if (programmaticTargetIndex !== null) {
        const targetCard = cardRefs.current[programmaticTargetIndex];
        if (targetCard && Math.abs(targetCard.offsetLeft - viewport.scrollLeft) < 2) {
          programmaticTargetIndexRef.current = null;
        }
        scrollFrameRef.current = null;
        return;
      }

      const nextIndex = cardRefs.current.reduce((nearestIndex, card, index) => {
        const nearestCard = cardRefs.current[nearestIndex];
        if (!card || !nearestCard) return nearestIndex;

        return Math.abs(card.offsetLeft - viewport.scrollLeft) < Math.abs(nearestCard.offsetLeft - viewport.scrollLeft)
          ? index
          : nearestIndex;
      }, 0);

      setActiveIndex((current) => current === nextIndex ? current : nextIndex);
      scrollFrameRef.current = null;
    });
  }, [productCount]);

  const move = useCallback((direction: 1 | -1) => {
    if (productCount < 2) return;

    const nextIndex = wrapIndex(safeActiveIndex + direction, productCount);
    pauseAutoplay();
    scrollToProduct(
      nextIndex,
      (direction === 1 && safeActiveIndex === productCount - 1) || (direction === -1 && safeActiveIndex === 0),
    );
  }, [pauseAutoplay, productCount, safeActiveIndex, scrollToProduct]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    programmaticTargetIndexRef.current = null;
    dragStartXRef.current = event.clientX;
    pauseAutoplay();
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragStartXRef.current !== null && Math.abs(event.clientX - dragStartXRef.current) > 12) {
      suppressClickUntilRef.current = Date.now() + 350;
    }
    dragStartXRef.current = null;
    pauseAutoplay();
  };

  const handleCardClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (Date.now() < suppressClickUntilRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  if (productCount === 0) return null;

  return (
    <section data-featured-carousel data-carousel-engine="index-loop-v3" data-active-index={safeActiveIndex} className="relative -mx-6 px-6 pb-3 sm:mx-0 sm:px-0" aria-roledescription="carousel" aria-label="Core export portfolio">
      <div
        ref={viewportRef}
        data-carousel-viewport
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
        onScroll={updateActiveIndexFromScroll}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      >
        {products.map((product, index) => (
          <Link
            key={product.slug}
            ref={(element) => { cardRefs.current[index] = element; }}
            data-featured-product
            href={`/products/${product.slug}`}
            prefetch={false}
            onClickCapture={handleCardClick}
            className="group w-[270px] flex-none snap-start snap-always overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:w-[300px]"
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

      {productCount > 1 && (
        <>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-between px-1 sm:px-2">
            <button
              type="button"
              aria-label="Show previous featured product"
              onClick={() => move(-1)}
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[#CBD5E1] bg-white/95 text-[#0F172A] shadow-md transition hover:border-[#0E7490] hover:text-[#0E7490] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Show next featured product"
              onClick={() => move(1)}
              className="pointer-events-auto grid h-11 w-11 place-items-center rounded-full border border-[#CBD5E1] bg-white/95 text-[#0F172A] shadow-md transition hover:border-[#0E7490] hover:text-[#0E7490] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-1 flex justify-center gap-1.5 sm:hidden" aria-label={`Showing product ${safeActiveIndex + 1} of ${productCount}`}>
            {products.map((product, index) => (
              <button
                key={product.slug}
                type="button"
                aria-label={`Show ${product.title}`}
                aria-current={index === safeActiveIndex ? "true" : undefined}
                onClick={() => {
                  pauseAutoplay();
                  scrollToProduct(index);
                }}
                className="grid h-8 w-5 place-items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7490]"
              >
                <span className={`h-1.5 rounded-full transition-all ${index === safeActiveIndex ? "w-4 bg-[#0E7490]" : "w-1.5 bg-[#CBD5E1]"}`} />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
