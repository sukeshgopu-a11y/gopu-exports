import Link from "next/link";
import { Mail, Phone, ShieldCheck, Globe2 } from "lucide-react";
import BrandLogo from "./BrandLogo";
import LanguageSwitcher from "./LanguageSwitcher";

/* ------------------------------------------------------------------ */
/*  Brand icons                                                         */
/* ------------------------------------------------------------------ */
type IconProps = { className?: string };

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Static data                                                         */
/* ------------------------------------------------------------------ */
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/products", label: "Products" },
  { href: "/markets", label: "Export Markets" },
  { href: "/certifications", label: "Quality & Certifications" },
  { href: "/resources", label: "Buyer Resources" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];
const PRODUCT_LINKS = [
  { href: "/products/basmati-rice", label: "Basmati Rice" },
  { href: "/products/turmeric-powder", label: "Turmeric" },
  { href: "/products/red-chilli", label: "Red Chilli" },
  { href: "/products/cumin-seeds", label: "Cumin Seeds" },
  { href: "/products/coriander-seeds", label: "Coriander Seeds" },
  { href: "/products", label: "View All Products →" },
];
const CERTIFICATIONS = [
  { label: "APEDA", icon: ShieldCheck },
  { label: "FSSAI", icon: ShieldCheck },
  { label: "ISO 9001", icon: ShieldCheck },
  { label: "IEC Registered", icon: Globe2 },
];
const SOCIALS = [
  { href: "https://wa.me/918712816876", label: "WhatsApp", Icon: WhatsAppIcon, color: "#25D366", external: true },
  { href: "mailto:admin@gopuexports.com", label: "Email", Icon: Mail, color: "#FBBF24", external: false },
  { href: "tel:+918712816876", label: "Phone", Icon: Phone, color: "#67C9D8", external: false },
];
const WHATSAPP_NUMBER = "918712816876";


/* ------------------------------------------------------------------ */
/*  Floating particles background                                       */
/* ------------------------------------------------------------------ */
function Particles() {
  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    left: `${5 + (i * 4.3) % 90}%`,
    delay: `${(i * 0.7) % 8}s`,
    duration: `${8 + (i * 1.1) % 10}s`,
    size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
    opacity: 0.15 + (i % 5) * 0.07,
  }));
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 rounded-full bg-amber-300"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float-up ${p.duration} ${p.delay} ease-in infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section heading                                                     */
/* ------------------------------------------------------------------ */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/80">
      {children}
      <span className="mt-2.5 block h-[2px] w-6 rounded-full"
        style={{ background: "linear-gradient(90deg,#f59e0b,#fde68a)", animation: "expand-bar 1s 0.3s ease both" }} />
    </h3>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="group relative inline-block text-[13px] text-slate-400 transition-colors duration-200 hover:text-amber-300">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-amber-300/60 transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes float-up {
          0%   { transform: translateY(0) scale(1); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes aurora {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          25%     { transform: translate(80px,-60px) scale(1.2) rotate(10deg); }
          50%     { transform: translate(-50px,80px) scale(0.9) rotate(-5deg); }
          75%     { transform: translate(60px,40px) scale(1.1) rotate(8deg); }
        }
        @keyframes aurora2 {
          0%,100% { transform: translate(0,0) scale(1) rotate(0deg); }
          30%     { transform: translate(-90px,50px) scale(1.15) rotate(-12deg); }
          60%     { transform: translate(70px,-70px) scale(0.85) rotate(6deg); }
        }
        @keyframes aurora3 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(40px,60px) scale(1.25); }
        }
        @keyframes shimmer {
          0%   { background-position: -400% center; opacity:0.4; }
          50%  { opacity:1; }
          100% { background-position: 400% center; opacity:0.4; }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251,191,36,0.4); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 10px rgba(251,191,36,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(251,191,36,0); }
        }
        @keyframes expand-bar {
          from { width: 0; }
          to   { width: 24px; }
        }
        @keyframes pop-in {
          from { opacity:0; transform: scale(0.85); }
          to   { opacity:1; transform: scale(1); }
        }
        @keyframes slide-in-left {
          from { opacity:0; transform: translateX(-30px); }
          to   { opacity:1; transform: translateX(0); }
        }
        @keyframes slide-in-up {
          from { opacity:0; transform: translateY(30px); }
          to   { opacity:1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%,100% { opacity:0.5; }
          50%     { opacity:1; }
        }
        @keyframes border-spin {
          to { --angle: 360deg; }
        }
        .footer-col-0 { animation: slide-in-up 0.7s 0.0s ease both; }
        .footer-col-1 { animation: slide-in-up 0.7s 0.15s ease both; }
        .footer-col-2 { animation: slide-in-up 0.7s 0.3s ease both; }
        .footer-col-3 { animation: slide-in-up 0.7s 0.45s ease both; }
        .aurora-1 { animation: aurora  20s ease-in-out infinite; }
        .aurora-2 { animation: aurora2 25s ease-in-out infinite; }
        .aurora-3 { animation: aurora3 16s ease-in-out infinite; }
        .shimmer-bar {
          background: linear-gradient(90deg,transparent,#fbbf24aa,#fde68aaa,transparent);
          background-size: 400% auto;
          animation: shimmer 5s linear infinite;
        }
        .wa-pulse { animation: pulse-ring 2.2s cubic-bezier(0.455,0.03,0.515,0.955) infinite; }
        .glow-amber { animation: glow-pulse 3s ease-in-out infinite; }
        @media (max-width: 767px), (prefers-reduced-motion: reduce) {
          .aurora-1,.aurora-2,.aurora-3,.shimmer-bar,.wa-pulse,.glow-amber,
          .footer-col-0,.footer-col-1,.footer-col-2,.footer-col-3 {
            animation: none !important;
          }
        }
      `}</style>

      {/* ── Floating WhatsApp ── */}
      <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27m%20interested%20in%20sourcing%20from%20Gopu%20Exports.`}
        target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp"
        className="wa-pulse fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center
          rounded-full bg-[#25D366] text-white shadow-xl shadow-green-900/40
          transition-transform duration-200 hover:scale-110">
        <WhatsAppIcon className="h-7 w-7" />
      </a>

      {/* ── Footer ── */}
      <footer itemScope itemType="https://schema.org/Organization"
        className="relative overflow-hidden bg-[#060E18] text-slate-300">

        {/* ── Aurora background ── */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* Deep gradient base */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#060E18] via-[#0a1628] to-[#060E18]" />

          {/* Aurora orbs */}
          <div className="aurora-1 absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full
            bg-gradient-radial from-cyan-500/25 via-cyan-400/10 to-transparent blur-[100px]" />
          <div className="aurora-2 absolute -right-32 bottom-0 h-[450px] w-[450px] rounded-full
            bg-gradient-radial from-amber-400/20 via-amber-300/8 to-transparent blur-[90px]" />
          <div className="aurora-3 absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full
            bg-gradient-radial from-violet-500/15 via-indigo-400/8 to-transparent blur-[80px]" />
          <div className="aurora-1 absolute right-1/4 top-0 h-[200px] w-[200px] rounded-full
            bg-gradient-radial from-emerald-400/10 to-transparent blur-[60px]" />

          {/* Fine dot grid */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle,#94a3b8 1px,transparent 1px)", backgroundSize: "24px 24px" }} />

          {/* Diagonal lines overlay */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "repeating-linear-gradient(45deg,#ffffff 0,#ffffff 1px,transparent 0,transparent 50%)",
              backgroundSize: "20px 20px",
            }} />

          {/* Top vignette */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060E18] to-transparent" />
          {/* Bottom vignette */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#060E18] to-transparent" />
        </div>

        {/* Floating particles */}
        <Particles />

        {/* Shimmer top border */}
        <div className="shimmer-bar absolute inset-x-0 top-0 h-[1.5px]" />

        {/* ── Main content ── */}
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

          {/* ── Brand column ── */}
          <div className="footer-col-0 sm:col-span-2 lg:col-span-1">
            {/* Logo with glow */}
            <div className="relative inline-flex">
              <div className="glow-amber absolute -inset-3 rounded-xl bg-amber-400/5 blur-xl" />
              <BrandLogo variant="light" className="relative h-14 w-auto" />
              <span itemProp="name" className="sr-only">GOPU Exports</span>
            </div>

            <p itemProp="description" className="mt-5 text-[13px] leading-6 text-slate-400">
              Premium Indian agricultural commodities sourced from verified farms across Andhra Pradesh, Telangana, Kerala, and Karnataka — exported with full compliance documentation.
            </p>

            {/* Certification badges */}
            <div className="mt-6 flex flex-wrap gap-2">
              {["APEDA", "FSSAI", "ISO 22000", "HACCP", "IEC"].map((cert) => (
                <span key={cert}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10
                    bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-wide text-slate-300
                    transition hover:border-amber-400/30 hover:text-amber-300">
                  <ShieldCheck className="h-2.5 w-2.5 text-amber-400" />
                  {cert}
                </span>
              ))}
            </div>

            {/* Social icons */}
            {SOCIALS.length > 0 && <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ href, label, Icon, color, external }) => (
                <a key={label} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} aria-label={label}
                  className="group relative flex h-9 w-9 items-center justify-center overflow-hidden
                    rounded-full border border-white/10 bg-white/5 text-slate-400 backdrop-blur-sm
                    transition-all duration-300 hover:scale-110 hover:border-transparent hover:text-white"
                  style={{ color }}>
                  <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              ))}
            </div>}

            <div className="mt-5">
              <LanguageSwitcher compact />
            </div>
          </div>

          {/* ── Navigation ── */}
          <nav aria-label="Footer navigation" className="footer-col-1">
            <SectionHeading>Navigation</SectionHeading>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Products ── */}
          <nav aria-label="Product links" className="footer-col-2">
            <SectionHeading>Products</SectionHeading>
            <ul className="mt-5 space-y-3">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* ── Contact + Enquiry ── */}
          <div className="footer-col-3">
            <SectionHeading>Contact Us</SectionHeading>

            <ul className="mt-5 space-y-2.5 text-[13px]" itemProp="contactPoint"
              itemScope itemType="https://schema.org/ContactPoint">
              {[
                { href: "mailto:admin@gopuexports.com", icon: Mail, text: "admin@gopuexports.com", prop: "email" as const },
                { href: "tel:+918712816876", icon: Phone, text: "+91 87128 16876", prop: "telephone" as const },
              ].map(({ href, icon: Icon, text, prop }) => (
                <li key={prop}>
                  <a href={href} itemProp={prop}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5
                      px-3 py-3 backdrop-blur-sm transition-all duration-300
                      hover:border-amber-400/40 hover:bg-amber-400/8 hover:shadow-md hover:shadow-amber-400/10
                      hover:-translate-y-0.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                      bg-amber-400/10 transition-all duration-300 group-hover:bg-amber-400/20 group-hover:scale-110">
                      <Icon className="h-4 w-4 text-amber-300" />
                    </div>
                    <span className="text-slate-400 transition-colors duration-200 group-hover:text-slate-200 text-xs">
                      {text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <SectionHeading>Quick Enquiry</SectionHeading>
              <Link
                href="/contact"
                className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:from-amber-300 hover:to-amber-400"
              >
                Send Export Enquiry
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="relative border-t border-white/[0.07]">
          {/* subtle gradient behind bar */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-amber-400/5" />
          <div className="relative mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-[12px] text-slate-500
            sm:flex-row sm:items-center sm:justify-between sm:px-8">

            <p>© {year} <span className="text-slate-300 font-medium">GOPU Exports</span>. All rights reserved.</p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex flex-wrap gap-1.5">
                {CERTIFICATIONS.map(({ label, icon: Icon }) => (
                  <span key={label}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10
                      bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-400
                      transition hover:border-amber-400/30 hover:text-amber-300">
                    <Icon className="h-2.5 w-2.5 text-amber-400" />
                    {label}
                  </span>
                ))}
              </div>
              {[["Privacy", "/privacy-policy"], ["Terms", "/terms-and-conditions"], ["Shipping", "/shipping-policy"]].map(([label, href]) => (
                <Link key={href} href={href}
                  className="relative text-slate-500 transition-colors hover:text-amber-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-amber-300 after:transition-all hover:after:w-full">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
