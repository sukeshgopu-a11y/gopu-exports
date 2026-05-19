"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, Phone, ShieldCheck, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { COMPANY } from "@/lib/company";

const ABOUT_LINKS = [
  ["Founder Message", "/about#founder-message"],
  ["Our Vision", "/about#vision"],
  ["Company Verification", "/company-verification"],
  ["Export Process", "/resources/export-process"],
  ["Quality Control", "/resources/quality-control"],
  ["Documentation Support", "/resources/documentation-support"],
];

const RESOURCE_LINKS = [
  ["Buyer Resources", "/resources"],
  ["Blog", "/blog"],
  ["Packaging", "/resources/packaging-standards"],
  ["Logistics", "/resources/logistics-shipping"],
  ["Buyer FAQ", "/resources/buyer-faq"],
  ["Export Guides", "/export/indian-agricultural-products-exporters"],
];

const MAIN_LINKS = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Products", "/products"],
  ["Certifications", "/certifications"],
  ["Contact", "/contact"],
];

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

function Dropdown({ label, links }: { label: string; links: string[][] }) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-bold text-slate-700 transition hover:bg-[#F0F9FA] hover:text-[#0E7490]">
        {label}
        <ChevronDown size={14} />
      </button>
      <div className="invisible absolute left-0 top-full z-50 min-w-[260px] translate-y-2 rounded-2xl border border-[#D9E2EC] bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        {links.map(([title, href]) => (
          <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-[#F0F9FA] hover:text-[#0E7490]">
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`sticky top-0 z-50 border-b border-[#D9E2EC] bg-white/95 backdrop-blur transition ${scrolled ? "shadow-lg shadow-slate-900/8" : ""}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#0E7490] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white">
        Skip to main content
      </a>

      <div className="border-b border-slate-200/70 bg-[#071624]">
        <div className="mx-auto flex max-w-[1450px] flex-col gap-1 px-4 py-2 text-[11px] text-white/85 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:px-6">
          <a href={`mailto:${COMPANY.email}`} className="inline-flex min-w-0 items-center gap-1.5 hover:text-[#67C9D8]">
            <Mail size={13} />
            <span className="truncate">{COMPANY.email}</span>
          </a>
          <a href={COMPANY.phoneHref} className="inline-flex items-center gap-1.5 hover:text-[#67C9D8]">
            <Phone size={13} />
            {COMPANY.phone}
          </a>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:py-3.5">
        <Link href="/" aria-label="GOPU Exports Home" className="shrink-0">
          <BrandLogo priority className="h-11 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 lg:ml-auto lg:flex">
          {MAIN_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-2 text-[13px] font-bold transition ${isActive(href) ? "bg-[#E6F4F7] text-[#0E7490]" : "text-slate-700 hover:bg-[#F0F9FA] hover:text-[#0E7490]"}`}
            >
              {label}
            </Link>
          ))}
          <Dropdown label="Resources" links={RESOURCE_LINKS} />
          <Dropdown label="Verification" links={ABOUT_LINKS.slice(2)} />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/company-verification" className="inline-flex items-center gap-2 rounded-lg border border-[#D9E2EC] px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-[#0E7490] hover:text-[#0E7490]">
            <ShieldCheck size={15} />
            Verify
          </Link>
          <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#22C55E]/40 bg-[#F0FDF4] text-[#16A34A] transition hover:bg-[#DCFCE7]">
            <WhatsAppIcon />
          </a>
          <Link href="/contact" className="rounded-lg bg-[#0E7490] px-5 py-2.5 text-xs font-black tracking-wide text-white transition hover:bg-[#0A5A70]">
            Request Quote
          </Link>
        </div>

        <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"} className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#E2E8F0] bg-white px-5 py-5 shadow-xl lg:hidden">
          <nav className="grid gap-1">
            {[...MAIN_LINKS, ["Company Verification", "/company-verification"], ["Resources", "/resources"], ["Blog", "/blog"]].map(([label, href]) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-bold text-slate-800 hover:bg-[#F0F9FA] hover:text-[#0E7490]">
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-3">
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="rounded-xl bg-[#0E7490] px-5 py-3 text-center text-sm font-bold text-white">
              Request Quote
            </Link>
            <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#22C55E]/40 py-3 text-sm font-bold text-[#16A34A]">
              <WhatsAppIcon /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
