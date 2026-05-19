import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createPublicClient } from "@/src/lib/supabase/public";
import { certificationToApi, type CertificationRow } from "@/src/lib/supabase/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Certifications",
  description:
    "GOPU Exports shows active certification and compliance information from the admin-controlled dashboard for global buyers.",
};

type DbCert = {
  _id: string;
  name: string;
  description?: string;
  issuer?: string;
  logo?: string;
};

const FALLBACK_CERTS = [
  {
    name: "Export Documentation",
    full: "Buyer-ready trade document support",
    desc: "Documentation discussions are handled according to product type, buyer destination, and shipment requirements.",
    icon: "DOC",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Quality Review",
    full: "Specification and packing checks",
    desc: "Product, packing, and quality discussions are aligned with buyer specifications before shipment planning.",
    icon: "QC",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "Compliance Coordination",
    full: "Destination-aware export handling",
    desc: "Buyer requirements, available certifications, and destination-country import needs are reviewed during enquiry handling.",
    icon: "OK",
    color: "from-amber-500 to-orange-600",
  },
];

const PROCESS_STEPS = [
  { step: "01", title: "Farm-Level Inspection", desc: "Quality graders visit farms to check crop condition, moisture levels, and adherence to Good Agricultural Practices before procurement." },
  { step: "02", title: "Warehouse Grading", desc: "Products are graded by size, colour, and purity at our warehouse. Sub-standard lots are rejected — only export-grade material proceeds." },
  { step: "03", title: "Third-Party Lab Testing", desc: "Random samples sent to accredited NABL-certified labs for pesticide residue, aflatoxin, heavy metals, and microbiological analysis." },
  { step: "04", title: "Pre-Shipment Check", desc: "SGS or equivalent inspection at the stuffing point confirms container condition, net weight, moisture, and packaging integrity." },
  { step: "05", title: "Documentation", desc: "Phytosanitary certificate, COA, fumigation report, MSDS, bill of lading, and COO prepared and verified before vessel departure." },
  { step: "06", title: "Post-Shipment Support", desc: "Full documentation set emailed immediately. Tracking updates provided until arrival at port of discharge — with re-inspection support if needed." },
];

const DOCS = [
  "Phytosanitary Certificate",
  "Certificate of Analysis (COA)",
  "Certificate of Origin (COO)",
  "Fumigation Certificate",
  "MSDS (Material Safety Data Sheet)",
  "Bill of Lading",
  "Packing List",
  "Commercial Invoice",
  "Health Certificate",
  "Quality / Inspection Report",
];

const ICON_COLORS = [
  "from-green-500 to-emerald-600",
  "from-blue-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-teal-500 to-cyan-600",
  "from-violet-500 to-purple-600",
  "from-red-500 to-rose-600",
  "from-indigo-500 to-blue-600",
  "from-pink-500 to-rose-600",
];

export default async function CertificationsPage() {
  let dbCerts: DbCert[] = [];
  let dbLoaded = false;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .returns<CertificationRow[]>();
    if (!error) {
      dbLoaded = true;
      dbCerts = (data ?? []).map(certificationToApi) as DbCert[];
    }
  } catch {
    dbLoaded = true;
  }

  const usingDb = dbLoaded;
  const certNames = usingDb
    ? dbCerts.map((c) => c.name)
    : FALLBACK_CERTS.map((c) => c.name);

  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-[#071624]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.webp"
            alt="Quality and Certifications"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#071624]/90 to-[#0E7490]/30" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1450px] px-6 py-24 sm:px-8 lg:py-32">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-[#0E7490]" />
            <p className="text-[11px] font-black tracking-[0.26em] text-white/60">
              QUALITY & COMPLIANCE
            </p>
          </div>
          <h1 className="mt-5 text-[48px] font-black leading-[0.92] tracking-[-0.05em] text-white lg:text-[64px]">
            Certified for<br />
            <span className="text-[#67C9D8]">Global Trade.</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.8] text-slate-300">
            GOPU Exports shows active certification and compliance information from the dashboard, so buyers see the current public document status before enquiry.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {certNames.slice(0, 6).map((name) => (
              <span
                key={name}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-bold text-white backdrop-blur-sm"
              >
                ✓ {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS GRID ── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">OUR ACCREDITATIONS</p>
            <h2 className="mt-3 text-[38px] font-black tracking-[-0.04em] text-[#0F172A]">
              Certifications We Hold
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.8] text-[#64748B]">
              Each certification represents a commitment to food safety, quality control,
              and regulatory compliance across our entire export chain.
            </p>
          </div>

          {usingDb && dbCerts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#D9E2EC] bg-white p-10 text-center text-[#64748B]">
              No public certifications are currently visible. The dashboard controls this section.
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {usingDb
              ? dbCerts.map((cert, i) => (
                  <div
                    key={cert._id}
                    className="rounded-2xl border border-[#D9E2EC] bg-white p-7 shadow-sm transition hover:shadow-md"
                  >
                    <div
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${ICON_COLORS[i % ICON_COLORS.length]} shadow-md`}
                    >
                      {cert.logo ? (
                        <Image src={cert.logo} alt={cert.name} width={32} height={32} className="h-8 w-8 object-contain" />
                      ) : (
                        <span className="text-2xl text-white font-black">
                          {cert.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="mt-5">
                      <h3 className="text-[22px] font-black tracking-[-0.02em] text-[#0F172A]">
                        {cert.name}
                      </h3>
                      {cert.issuer && (
                        <p className="mt-1 text-[12px] font-semibold text-[#94A3B8]">{cert.issuer}</p>
                      )}
                    </div>
                    {cert.description && (
                      <p className="mt-4 text-[14px] leading-[1.8] text-[#64748B]">{cert.description}</p>
                    )}
                    <div className="mt-5 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F4F7] text-[10px] font-bold text-[#0E7490]">✓</span>
                      <span className="text-[12px] font-semibold text-[#0E7490]">Currently Active</span>
                    </div>
                  </div>
                ))
              : FALLBACK_CERTS.map((cert) => (
                  <div
                    key={cert.name}
                    className="rounded-2xl border border-[#D9E2EC] bg-white p-7 shadow-sm transition hover:shadow-md"
                  >
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cert.color} text-2xl shadow-md`}>
                      {cert.icon}
                    </div>
                    <div className="mt-5">
                      <h3 className="text-[22px] font-black tracking-[-0.02em] text-[#0F172A]">
                        {cert.name}
                      </h3>
                      <p className="mt-1 text-[12px] font-semibold text-[#94A3B8]">{cert.full}</p>
                    </div>
                    <p className="mt-4 text-[14px] leading-[1.8] text-[#64748B]">{cert.desc}</p>
                    <div className="mt-5 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E6F4F7] text-[10px] font-bold text-[#0E7490]">✓</span>
                      <span className="text-[12px] font-semibold text-[#0E7490]">Currently Active</span>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* ── QUALITY PROCESS ── */}
      <section className="bg-[#071624] py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="mb-12 text-center">
            <p className="text-[11px] font-black tracking-[0.24em] text-[#67C9D8]">HOW WE ENSURE QUALITY</p>
            <h2 className="mt-3 text-[38px] font-black tracking-[-0.04em] text-white">
              Our Quality Process
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-[1.8] text-slate-400">
              Every shipment passes through a 6-stage quality control process — from farm
              to vessel loading — before reaching your port.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS_STEPS.map((step) => (
              <div key={step.step} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-7">
                <span className="text-[40px] font-black leading-none tracking-[-0.05em] text-[#0E7490]/40">
                  {step.step}
                </span>
                <h3 className="mt-3 text-[17px] font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.8] text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPORT DOCUMENTS ── */}
      <section className="py-20">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-black tracking-[0.24em] text-[#0E7490]">DOCUMENTATION</p>
              <h2 className="mt-3 text-[38px] font-black leading-[1.05] tracking-[-0.04em] text-[#0F172A]">
                Complete Export<br />Documentation
              </h2>
              <p className="mt-4 text-[15px] leading-[1.9] text-[#64748B]">
                We prepare and verify the full documentation set required for your destination
                country&apos;s customs clearance — eliminating delays and import rejections.
              </p>
              <Link
                href="/contact"
                className="mt-7 inline-block rounded-lg bg-[#0E7490] px-7 py-3.5 text-[13px] font-bold tracking-wide text-white transition hover:bg-[#0A5A70]"
              >
                REQUEST DOCUMENT CHECKLIST →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DOCS.map((doc) => (
                <div key={doc} className="flex items-center gap-3 rounded-xl border border-[#D9E2EC] bg-white p-4 text-[14px] font-semibold text-[#374151]">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#E6F4F7] text-[12px] font-bold text-[#0E7490]">✓</span>
                  {doc}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pb-16">
        <div className="mx-auto max-w-[1450px] px-6 sm:px-8">
          <div className="rounded-2xl bg-[#0E7490] p-12 text-center">
            <h2 className="text-[32px] font-black tracking-[-0.04em] text-white">
              Need Certification Documents for Your Shipment?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[15px] leading-[1.8] text-white/80">
              Contact our team and receive the complete document package — phytosanitary, COA, fumigation, COO, and more.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="rounded-lg bg-white px-8 py-4 text-[13px] font-bold tracking-wide text-[#0E7490] transition hover:bg-[#F0F9FA]">
                REQUEST DOCUMENTS →
              </Link>
              <a href="https://wa.me/918712816876" target="_blank" rel="noreferrer" className="rounded-lg border border-white/30 px-8 py-4 text-[13px] font-bold tracking-wide text-white transition hover:bg-white/10">
                WHATSAPP US →
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
