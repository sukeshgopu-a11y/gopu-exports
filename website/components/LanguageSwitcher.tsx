"use client";

import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";
import { DEFAULT_LOCALE, LOCALES, isLocale } from "@/lib/i18n";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);
  const current = parts[0] && isLocale(parts[0]) ? parts[0] : DEFAULT_LOCALE;
  const rest = current === DEFAULT_LOCALE ? pathname : `/${parts.slice(1).join("/")}`;

  const hrefFor = (code: string) => {
    const safeRest = rest === "" ? "/" : rest;
    if (code === DEFAULT_LOCALE) return safeRest === "/" ? "/" : safeRest;
    return safeRest === "/" ? `/${code}` : `/${code}${safeRest}`;
  };

  return (
    <label className={`inline-flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      <Globe2 className="h-4 w-4 text-[#0E7490]" />
      <span className="sr-only">Select language</span>
      <select
        value={current}
        onChange={(event) => {
          window.location.href = hrefFor(event.target.value);
        }}
        className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 outline-none transition hover:border-[#0E7490] focus:border-[#0E7490]"
      >
        {LOCALES.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
