"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

type Certification = {
  id?: string;
  _id?: string;
  name: string;
  active?: boolean;
  is_active?: boolean;
};

const FALLBACK_LABELS = ["Quality docs available", "Export compliance support", "Buyer document review"];

export default function PublicCertificationBadges({
  variant = "dark",
  limit = 6,
  showLabel = true,
}: {
  variant?: "dark" | "light" | "footer";
  limit?: number;
  showLabel?: boolean;
}) {
  const [items, setItems] = useState<Certification[]>([]);

  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    fetch("/api/certifications?active=true", { cache: "no-store", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!alive) return;
        setItems(Array.isArray(data) ? data.filter((item) => item.active !== false && item.is_active !== false) : []);
      })
      .catch(() => {
        if (alive) setItems([]);
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, []);

  const labels = items.length > 0 ? items.slice(0, limit).map((item) => item.name) : FALLBACK_LABELS.slice(0, Math.min(limit, FALLBACK_LABELS.length));

  if (variant === "footer") {
    return (
      <div className="flex flex-wrap gap-2">
        {labels.map((label) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-300 transition hover:border-amber-400/30 hover:text-amber-300"
          >
            <ShieldCheck className="h-2.5 w-2.5 text-amber-400" />
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
        <Link href="/certifications" className="text-[12px] font-bold text-[#0E7490] transition hover:text-[#0A5A70]">
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
