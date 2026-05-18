"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";

/* ─── CONFIG ──────────────────────────────────────────────── */
const CONTACT_EMAIL = "admin@gopuexports.com";
const CONTACT_PHONE = "+91 87128 16876";
const WHATSAPP_NUMBER = "918712816876";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Export Markets", href: "/markets" },
  { label: "Certifications", href: "/certifications" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

/* ─── SOCIAL ICON COMPONENTS ──────────────────────────────── */
function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function IconLinkedin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function IconWhatsApp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "Instagram", href: "", Icon: IconInstagram },
  { label: "Facebook", href: "", Icon: IconFacebook },
  { label: "LinkedIn", href: "", Icon: IconLinkedin },
].filter((social) => social.href);

/* ─── LOGO MARK ────────────────────────────────────────────── */
function LogoMark() {
  return <BrandLogo priority className="h-12 w-auto" />;
}

/* ─── COMPONENT ────────────────────────────────────────────── */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setMenuOpen(false);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[#0E7490] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>

      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "shadow-lg shadow-black/10" : ""}`}>

        {/* TOP BAR */}
        <div className="border-b border-[#16304F] bg-[#071624]">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-2 sm:px-6 lg:px-8">

            {/* LEFT — contact */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-white/80 sm:gap-5 sm:text-xs">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-1.5 transition hover:text-[#67C9D8]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="hidden sm:inline">{CONTACT_EMAIL}</span>
              </a>
              <div className="h-3 w-px bg-white/15 hidden sm:block" />
              <a
                href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 transition hover:text-[#67C9D8]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z" />
                </svg>
                {CONTACT_PHONE}
              </a>
            </div>

            {/* RIGHT — social icons only */}
            {SOCIALS.length > 0 && <div className="hidden md:flex items-center gap-3">
              <span className="text-[10px] text-white/30 font-medium mr-1">Follow:</span>
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="text-white/50 hover:text-[#67C9D8] transition-colors duration-150 hover:scale-110 transform"
                >
                  <Icon />
                </a>
              ))}
            </div>}
          </div>
        </div>

        {/* MAIN NAVBAR */}
        <div className={`border-b border-[#D9E2EC] bg-white/98 backdrop-blur-md transition-all duration-300 ${scrolled ? "py-2.5" : "py-4"}`}>
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LOGO */}
            <Link href="/" aria-label="GOPU Exports Home" className="flex-shrink-0">
              <LogoMark />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 ml-auto pr-5">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-3 py-2 text-[12.5px] font-bold tracking-wide rounded-lg transition-all duration-200 ${
                      active
                        ? "text-[#0E7490] bg-[#E6F4F7]"
                        : "text-[#374151] hover:text-[#0E7490] hover:bg-[#F0F9FA]"
                    }`}
                  >
                    {link.label.toUpperCase()}
                    {active && (
                      <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#0E7490] transition-all duration-300" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT CTA */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="hidden lg:flex items-center justify-center rounded-lg border border-[#22C55E]/40 bg-[#F0FDF4] p-2.5 text-[#16A34A] transition hover:bg-[#DCFCE7] hover:border-[#22C55E]"
              >
                <IconWhatsApp />
              </a>
              <Link
                href="/contact"
                className="hidden lg:flex items-center gap-2 rounded-lg bg-[#0E7490] px-5 py-2.5 text-[12px] font-bold tracking-wide text-white transition hover:bg-[#0A5A70] shadow-sm hover:shadow-md"
              >
                GET A QUOTE
              </Link>
              {/* MOBILE MENU TOGGLE */}
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="rounded-lg p-2 text-[#374151] transition hover:bg-[#F1F5F9] lg:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
                  {menuOpen ? (
                    <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  ) : (
                    <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
            className={`fixed inset-0 top-[88px] z-40 bg-white/98 backdrop-blur-sm transition-all duration-250 lg:hidden ${
            menuOpen ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"
          }`}
        >
          <nav className="border-b border-[#E2E8F0] px-5 pt-4 pb-6">
            <ul className="flex flex-col divide-y divide-[#F1F5F9]">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between py-4 text-[15px] font-semibold transition-colors ${
                        active ? "text-[#0E7490]" : "text-[#0F172A] hover:text-[#0E7490]"
                      }`}
                    >
                      {link.label}
                      {active && <span className="h-2 w-2 rounded-full bg-[#0E7490]" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex flex-col gap-3">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="w-full rounded-xl bg-[#0E7490] px-6 py-3.5 text-center text-sm font-bold tracking-wide text-white transition hover:bg-[#0A5A70]"
              >
                GET A QUOTE →
              </Link>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#22C55E]/40 py-3.5 text-sm font-bold text-[#16A34A] transition hover:bg-[#F0FDF4]"
              >
                <IconWhatsApp /> Chat on WhatsApp
              </a>
            </div>
          </nav>
        </div>

      </header>
    </>
  );
}
