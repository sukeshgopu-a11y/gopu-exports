"use client";

import Link from "next/link";
import BrandLogo from "./BrandLogo";
import PublicCertificationBadges from "./PublicCertificationBadges";
import { COMPANY } from "@/lib/company";

type IconProps = { size?: number; className?: string };
type IconComponent = (props: IconProps) => React.ReactElement;

const NAVIGATION = [
  ["About", "/about"],
  ["Factory", "/about#operations"],
  ["Company Verification", "/company-verification"],
  ["Quality & Compliance", "/certifications"],
];

const PRODUCT_LINKS = [
  ["Spices", "/products?category=Spices"],
  ["Rice", "/products?category=Rice%20%26%20Grains"],
  ["Pulses", "/products?category=Pulses"],
  ["Millets", "/products?category=Millets"],
  ["Fresh Produce", "/products?category=Fresh%20Fruits"],
];

const RESOURCE_LINKS = [
  ["Request Quote", "/contact"],
  ["Resources", "/resources"],
  ["Packaging Standards", "/resources/packaging-standards"],
  ["Contact", "/contact"],
  ["Insights", "/blog"],
];

const POLICY_LINKS = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms-and-conditions"],
  ["Cookie Policy", "/cookie-policy"],
  ["Shipping Policy", "/shipping-policy"],
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

function ShieldCheckIcon(props: IconProps) {
  return <SvgIcon {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" /><path d="m9 12 2 2 4-4" /></SvgIcon>;
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} prefetch={false} className="text-[13px] text-slate-400 transition hover:text-amber-300">
      {children}
    </Link>
  );
}

function AddressBlock({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-300">{title}</p>
      <address className="mt-3 not-italic text-[13px] leading-6 text-slate-300">
        {lines.map((line) => <span key={line} className="block">{line}</span>)}
      </address>
    </div>
  );
}

export default function Footer() {
  const hqLines = COMPANY.hq.address.split(", ");
  const factoryLines = COMPANY.factory.address.split(", ");

  return (
    <footer className="relative overflow-hidden bg-[#071624] text-slate-300">
      <a href={`${COMPANY.whatsapp}?text=Hi%2C%20I%27m%20interested%20in%20sourcing%20from%20GOPU%20Exports.`} target="_blank" rel="noreferrer" aria-label="Chat with GOPU Exports on WhatsApp" className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/30 transition hover:scale-105">
        <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>

      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.15fr_0.75fr_0.75fr_0.9fr_1.2fr]">
        <div>
          <Link
            href="/"
            prefetch={false}
            aria-label="GOPU Exports Home"
            className="inline-flex max-w-[245px] rounded-md border border-amber-200/20 bg-[#FFF9EF] px-4 py-3 shadow-sm"
          >
            <BrandLogo variant="light" className="h-auto w-[210px]" />
          </Link>
          <p className="mt-5 text-[13px] leading-6 text-slate-400">
            Professional Indian agricultural export company focused on specification-led sourcing, documentation support, and buyer-ready shipment coordination.
          </p>
          <div className="mt-5 grid gap-2 text-[12px] text-slate-400">
            <span>IEC: <strong className="text-slate-200">{COMPANY.iec}</strong></span>
            <span>CIN: <strong className="text-slate-200">{COMPANY.cin}</strong></span>
            <span>GST: <strong className="text-slate-200">{COMPANY.gst}</strong></span>
          </div>
          <div className="mt-5">
            <PublicCertificationBadges variant="footer" limit={5} />
          </div>
        </div>

        <nav aria-label="Footer navigation">
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Company</h3>
          <ul className="mt-5 grid gap-3">
            {NAVIGATION.map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
        </nav>

        <nav aria-label="Footer product links">
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Products</h3>
          <ul className="mt-5 grid gap-3">
            {PRODUCT_LINKS.map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
        </nav>

        <nav aria-label="Footer buyer links">
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Buyers</h3>
          <ul className="mt-5 grid gap-3">
            {RESOURCE_LINKS.map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
        </nav>

        <div className="grid gap-3">
          <AddressBlock title="Head Office" lines={hqLines} />
          <AddressBlock title="Our Factory" lines={factoryLines} />
        </div>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Contact Us</h3>
          <div className="mt-5 grid gap-3 text-[13px]">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-300">
              <p className="text-xs uppercase tracking-[0.16em] text-amber-300">Responsible contact</p>
              <p className="mt-1 font-bold text-slate-100">{COMPANY.contactPerson}</p>
              <p className="text-xs font-bold text-slate-300">{COMPANY.contactTitle}</p>
            </div>
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-300 transition hover:border-amber-400/40">
              <MailIcon size={17} className="text-amber-300" />
              {COMPANY.email}
            </a>
            <a href={COMPANY.phoneHref} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-300 transition hover:border-amber-400/40">
              <PhoneIcon size={17} className="text-amber-300" />
              {COMPANY.phone}
            </a>
            <Link href="/company-verification" prefetch={false} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-300 transition hover:border-amber-400/40">
              <ShieldCheckIcon size={17} className="text-amber-300" />
              Request verification documents
            </Link>
          </div>
          <Link href="/contact" prefetch={false} className="mt-5 inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-bold text-slate-900 transition hover:from-amber-300 hover:to-amber-400">
            Send Export Enquiry
          </Link>
          <div className="mt-5">
            <p className="text-[12px] leading-5 text-slate-400">
              Follow GOPU Exports for product updates, sourcing notes, and export documentation insights.
            </p>
            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }: { label: string; href: string; icon: IconComponent }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition hover:border-amber-400/40 hover:text-amber-300"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© 2026 <span className="font-semibold text-slate-300">Gopu Exports Private Limited</span>. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {POLICY_LINKS.map(([label, href]) => <FooterLink key={href} href={href}>{label}</FooterLink>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
