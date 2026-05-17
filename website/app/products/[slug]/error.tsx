"use client";

import Link from "next/link";

export default function ProductSlugError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-[48px]">🌿</p>
      <h2 className="mt-4 text-[24px] font-black text-[#0F172A]">Product Not Found</h2>
      <p className="mt-2 max-w-md text-[15px] text-[#64748B]">
        This product page could not be loaded. It may have been removed or the URL is incorrect.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-[#0E7490] px-6 py-3 text-[13px] font-bold text-white transition hover:bg-[#0A5A70]"
        >
          Try Again
        </button>
        <Link
          href="/products"
          className="rounded-lg border border-[#D9E2EC] px-6 py-3 text-[13px] font-bold text-[#374151] transition hover:border-[#0E7490] hover:text-[#0E7490]"
        >
          All Products
        </Link>
      </div>
    </div>
  );
}
