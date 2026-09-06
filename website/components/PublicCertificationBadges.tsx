"use client";

import Link from "next/link";
import { COMPANY } from "@/lib/company";

const LABELS = [
  ...COMPANY.verifiedIdentifiers.map((item) => `${item.label} verified`),
];

function ShieldCheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function PublicCertificationBadges({
  variant = "dark",
  limit = 6,
  showLabel = true,
}: {
  variant?: "dark" | "light" | "footer";
  limit?: number;
  showLabel?: boolean;
}) {
  const labels = LABELS.slice(0, Math.min(limit, LABELS.length));

  if (variant === "footer") {
    return (
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-md border border-[var(--brand-border)] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[var(--brand-text-muted)] transition hover:border-[var(--brand-gold-separator)] hover:text-[var(--brand-accent)]"
          >
            <ShieldCheckIcon className="h-2.5 w-2.5 text-[var(--brand-accent)]" />
            {label}
          </span>
        ))}
      </div>
    );
  }

  if (variant === "light") {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-8">
        {showLabel && (
          <span className="text-[11px] font-black tracking-[0.22em] text-[#94A3B8]">
            VISIBLE CERTIFICATIONS:
          </span>
        )}
        {labels.map((label) => (
          <div key={label} className="flex items-center gap-2 text-[13px] font-bold text-[#374151]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F4F7] text-[10px] text-[#0E7490]">
              ✓
            </span>
            {label}
          </div>
        ))}
        <Link href="/certifications" prefetch={false} className="text-[12px] font-bold text-[#0E7490] transition hover:text-[#0A5A70]">
          SEE ALL →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-bold text-white backdrop-blur-sm"
        >
          ✓ {label}
        </span>
      ))}
    </div>
  );
}
