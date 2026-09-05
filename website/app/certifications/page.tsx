import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/company";
import { createPublicClient } from "@/src/lib/supabase/public";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { certificationToApi, type CertificationRow } from "@/src/lib/supabase/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Certifications & Business Verification",
  description:
    "GOPU Exports business verification and active certification information for international buyers, including IEC, CIN, GST and FSSAI.",
  alternates: { canonical: "/certifications" },
};

type PublicCertification = {
  id: string;
  name: string;
  issuer: string;
  logo: string;
  description: string;
};

function fallbackCertifications(): PublicCertification[] {
  return COMPANY.pendingCertifications.map((item) => ({
    id: item.label,
    name: item.label,
    issuer: item.value,
    logo: "",
    description: item.status,
  }));
}

async function getCertifications(): Promise<PublicCertification[]> {
  try {
    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : createPublicClient();
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .returns<CertificationRow[]>();

    if (error) return fallbackCertifications();

    const certifications = (data ?? []).map((row) => {
      const item = certificationToApi(row);
      return {
        id: item.id,
        name: item.name,
        issuer: item.issuer,
        logo: item.logo,
        description: item.description,
      };
    });

    return certifications.length > 0 ? certifications : fallbackCertifications();
  } catch {
    return fallbackCertifications();
  }
}

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="relative overflow-hidden bg-[#071624]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#071624] via-[#082033] to-[#0E7490]/60" />
        <div className="relative z-10 mx-auto max-w-[1450px] px-6 py-20 sm:px-8 lg:py-28">
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-[#0E7490]" />
            <p className="text-[11px] font-black tracking-[0.26em] text-white/60">BUYER VERIFICATION</p>
          </div>
          <h1 className="mt-5 max-w-3xl text-[44px] font-black leading-[0.95] tracking-[-0.05em] text-white lg:text-[62px]">
            Certifications &<br />
            <span className="text-[#67C9D8]">Business Verification.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[16px] leading-8 text-slate-300">
            Active certification details and business identifiers are published for buyer verification. Copies or license references can be provided to verified buyers on request.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1450px] px-6 py-16 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-3xl border border-[#D9E2EC] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-7 w-7 text-[#0E7490]" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Business Verification</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">Verified public identifiers</h2>
              </div>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {COMPANY.verifiedIdentifiers.map((item) => (
                <div key={item.label} className="rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0E7490]">{item.label}</p>
                    <span className="rounded-full bg-[#DCFCE7] px-2.5 py-1 text-[11px] font-bold text-[#166534]">Verified</span>
                  </div>
                  <p className="mt-4 break-words text-lg font-black text-[#0F172A]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#D9E2EC] bg-white p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <FileText className="h-7 w-7 text-[#0E7490]" />
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Trade & Product Certifications</p>
                <h2 className="mt-1 text-3xl font-black tracking-[-0.04em]">Active registrations</h2>
              </div>
            </div>
            <div className="mt-7 grid gap-3">
              {certifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#D9E2EC] bg-[#F8FAFC] p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {item.logo ? (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#D9E2EC] bg-white">
                        <Image src={item.logo} alt={`${item.name} logo`} fill sizes="48px" className="object-contain p-2" />
                      </div>
                    ) : null}
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#0F172A]">{item.name}</p>
                      <p className="mt-1 text-xs leading-5 text-[#64748B]">{item.description}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#DCFCE7] px-3 py-1.5 text-[11px] font-bold text-[#166534]">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-[#D9E2EC] bg-[#071624] p-7 text-white shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-[#67C9D8]" />
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#67C9D8]">Buyer Note</p>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                Document copies and additional license details can be shared with verified buyers during procurement discussions. NABL lab testing and SGS inspections can be coordinated on request where required by product, destination, or buyer specification. For buyer verification and export enquiries, contact {COMPANY.contactPerson}.
              </p>
            </div>
            <Link href="/contact?verification=true" className="shrink-0 rounded-xl bg-white px-5 py-3 text-sm font-black text-[#071624] transition hover:bg-[#F0F9FA]">
              Request Documents
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
