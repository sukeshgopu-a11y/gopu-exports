"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";
import { COMPANY } from "@/lib/company";

type IconProps = { size?: number; className?: string };
type IconComponent = (props: IconProps) => React.ReactElement;

const MAIN_LINKS = [
  ["Products", "/products"],
  ["Company", "/about"],
  ["Factory / Operations", "/about#operations"],
  ["Quality & Compliance", "/certifications"],
  ["Resources", "/resources"],
  ["Insights", "/blog"],
  ["Contact", "/contact"],
];

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: COMPANY.social.linkedin, icon: LinkedinIcon },
  { label: "Facebook", href: COMPANY.social.facebook, icon: FacebookIcon },
  { label: "Instagram", href: COMPANY.social.instagram, icon: InstagramIcon },
].filter((item) => Boolean(item.href));

function SvgIcon({ size = 18, className = "", children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

function MailIcon(props: IconProps) {
  return <SvgIcon {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-10 6L2 7" /></SvgIcon>;
}

function PhoneIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6 6l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.72.47 2.61.59A2 2 0 0 1 22 16.92Z" /></SvgIcon>;
}

function MenuIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M4 6h16" /><path d="M4 12h16" /><path d="M4 18h16" /></SvgIcon>;
}

function XIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></SvgIcon>;
}

function FacebookIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(props: IconProps) {
  return <SvgIcon {...props}><rect width="20" height="20" x="2" y="2" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" /><path d="M17.5 6.5h.01" /></SvgIcon>;
}

function LinkedinIcon({ size = 18, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8h4v15h-4V8Zm7.5 0h3.8v2.05h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V23h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.63 0-3.03 2.05-3.03 4.17V23h-4V8Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    const route = href.split("#")[0];
    return route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--brand-border)] bg-[var(--brand-header)] text-[var(--brand-text-light)] shadow-sm">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-[var(--brand-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--brand-header)] focus:outline-none">
        Skip to main content
      </a>

      <div className="border-b border-[var(--brand-border)] bg-[var(--brand-footer)]">
        <div className="mx-auto flex max-w-[1450px] flex-col gap-2 px-4 py-2 text-[11px] font-semibold tracking-[0.02em] text-[var(--brand-text-muted)] min-[560px]:flex-row min-[560px]:items-center min-[560px]:justify-between sm:px-6">
          <div className="flex min-w-0 flex-col gap-1 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4">
            <a href={`mailto:${COMPANY.email}`} className="inline-flex min-h-6 min-w-0 items-center gap-1.5 break-all transition hover:text-[var(--brand-accent)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]">
              <MailIcon size={13} />
              <span className="truncate">{COMPANY.email}</span>
            </a>
            <a href={COMPANY.phoneHref} className="inline-flex min-h-6 items-center gap-1.5 transition hover:text-[var(--brand-accent)] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]">
              <PhoneIcon size={13} />
              {COMPANY.phone}
            </a>
          </div>
          {SOCIAL_LINKS.length > 0 && (
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }: { label: string; href: string; icon: IconComponent }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--brand-border)] text-[var(--brand-text-muted)] transition hover:border-[var(--brand-gold-separator)] hover:text-[var(--brand-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)]"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1450px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:py-3.5">
        <Link href="/" prefetch={false} aria-label="GOPU Exports Home" className="shrink-0 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-accent)]">
          <BrandLogo priority className="h-auto w-[132px] sm:w-[150px]" />
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:ml-auto lg:flex">
          {MAIN_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              prefetch={false}
              aria-current={isActive(href) ? "page" : undefined}
              className={`relative px-3 py-3 text-[10px] font-black uppercase tracking-[0.11em] transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand-accent)] xl:px-4 xl:text-[11px] ${
                isActive(href)
                  ? "text-[var(--brand-text-light)] after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:bg-[var(--brand-accent)] xl:after:left-4 xl:after:right-4"
                  : "text-white/85 hover:text-[var(--brand-accent)]"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--brand-gold-separator)] text-[var(--brand-accent)] transition hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-accent)]">
            <WhatsAppIcon />
          </a>
          <Link href="/contact" prefetch={false} className="rounded-md bg-[var(--brand-accent)] px-5 py-3 text-[11px] font-black uppercase tracking-[0.12em] text-[var(--brand-header)] transition hover:bg-[var(--brand-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-text-light)]">
            Request Quote
          </Link>
        </div>

        <button type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} className="rounded-md border border-[var(--brand-border)] p-2.5 text-[var(--brand-text-light)] transition hover:border-[var(--brand-gold-separator)] hover:text-[var(--brand-accent)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-accent)] lg:hidden">
          {menuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[var(--brand-border)] bg-[var(--brand-footer)] px-5 py-5 shadow-xl lg:hidden">
          <nav className="grid gap-1">
            {MAIN_LINKS.map(([label, href]) => (
              <Link key={href} href={href} prefetch={false} onClick={() => setMenuOpen(false)} aria-current={isActive(href) ? "page" : undefined} className={`border-l-2 px-3 py-3 text-[12px] font-black uppercase tracking-[0.12em] transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-accent)] ${isActive(href) ? "border-[var(--brand-accent)] text-[var(--brand-text-light)]" : "border-transparent text-[var(--brand-text-muted)] hover:border-[var(--brand-gold-separator)] hover:text-[var(--brand-accent)]"}`}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 grid gap-3">
            <Link href="/contact" prefetch={false} onClick={() => setMenuOpen(false)} className="rounded-md bg-[var(--brand-accent)] px-5 py-3 text-center text-sm font-bold text-[var(--brand-header)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-text-light)]">
              Request Quote
            </Link>
            <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--brand-gold-separator)] py-3 text-sm font-bold text-[var(--brand-accent)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--brand-accent)]">
              <WhatsAppIcon /> WhatsApp Inquiry
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
