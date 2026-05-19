"use client";

import Link from "next/link";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";
import PublicCertificationBadges from "./PublicCertificationBadges";
import { COMPANY } from "@/lib/company";

const NAVIGATION = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Products", "/products"],
  ["Certifications", "/certifications"],
  ["Contact", "/contact"],
];

const TRUST_LINKS = [
  ["Company Verification", "/company-verification"],
  ["Documentation Support", "/resources/documentation-support"],
  ["Buyer FAQ", "/resources/buyer-faq"],
  ["Export Process", "/resources/export-process"],
  ["Quality Control", "/resources/quality-control"],
];

const POLICY_LINKS = [
  ["Privacy Policy", "/privacy-policy"],
  ["Terms & Conditions", "/terms-and-conditions"],
  ["Cookie Policy", "/cookie-policy"],
  ["Shipping Policy", "/shipping-policy"],
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-[13px] text-slate-400 transition hover:text-amber-300">
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#060E18] text-slate-300">
      <a href={`${COMPANY.whatsapp}?text=Hi%2C%20I%27m%20interested%20in%20sourcing%20from%20GOPU%20Exports.`} target="_blank" rel="noreferrer" aria-label="Chat with GOPU Exports on WhatsApp" className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/30 transition hover:scale-105">
        <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.051 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,116,144,0.22),transparent_34%),linear-gradient(135deg,#060E18,#0a1628_48%,#060E18)]" aria-hidden="true" />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]">
        <div>
          <Link href="/" aria-label="GOPU Exports Home" className="inline-flex">
            <BrandLogo variant="light" className="h-14 w-auto" />
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
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Navigation</h3>
          <ul className="mt-5 grid gap-3">
            {NAVIGATION.map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
        </nav>

        <nav aria-label="Trust and buyer resources">
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Buyer Trust</h3>
          <ul className="mt-5 grid gap-3">
            {TRUST_LINKS.map(([label, href]) => <li key={href}><FooterLink href={href}>{label}</FooterLink></li>)}
          </ul>
        </nav>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-white">Contact Us</h3>
          <div className="mt-5 grid gap-3 text-[13px]">
            <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-300 transition hover:border-amber-400/40">
              <Mail size={17} className="text-amber-300" />
              {COMPANY.email}
            </a>
            <a href={COMPANY.phoneHref} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-300 transition hover:border-amber-400/40">
              <Phone size={17} className="text-amber-300" />
              {COMPANY.phone}
            </a>
            <Link href="/company-verification" className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-slate-300 transition hover:border-amber-400/40">
              <ShieldCheck size={17} className="text-amber-300" />
              Request verification documents
            </Link>
          </div>
          <Link href="/contact" className="mt-5 inline-flex w-full justify-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-bold text-slate-900 transition hover:from-amber-300 hover:to-amber-400">
            Send Export Enquiry
          </Link>
        </div>
      </div>

      <div className="relative border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>© {year} <span className="font-semibold text-slate-300">GOPU Exports</span>.</p>
          <div className="flex flex-wrap gap-4">
            {POLICY_LINKS.map(([label, href]) => <FooterLink key={href} href={href}>{label}</FooterLink>)}
          </div>
        </div>
      </div>
    </footer>
  );
}
