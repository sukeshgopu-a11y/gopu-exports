import type { Metadata } from "next";
import Link from "next/link";
import { Building2, CheckCircle2, FileCheck2, Mail, Phone, ShieldCheck } from "lucide-react";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Company Verification",
  description: "Verify GOPU Exports company identifiers including IEC, CIN, GST, contact details, and document request process for international buyers.",
  alternates: { canonical: "/company-verification" },
};

export default function CompanyVerificationPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">Buyer verification desk</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Company Verification & Export Documentation
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            GOPU Exports shares business identifiers and document availability clearly so importers can verify the company before commercial discussions.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            For buyer verification and export enquiries, contact {COMPANY.contactPerson}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact?verification=true" className="rounded-xl bg-[#0E7490] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0A5A70]">
              Request Verification Documents
            </Link>
            <a href={`mailto:${COMPANY.email}`} className="rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10">
              Email Verification Desk
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {COMPANY.verifiedIdentifiers.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E6F4F7] text-[#0E7490]">
                  <ShieldCheck size={22} />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">{item.label}</p>
              </div>
              <p className="mt-5 break-words text-xl font-black tracking-[-0.03em] text-[#0F172A]">{item.value}</p>
              <p className="mt-3 inline-flex rounded-full bg-[#DCFCE7] px-3 py-1 text-xs font-bold text-[#166534]">{item.status}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-[#D9E2EC] bg-white p-7 shadow-sm lg:grid-cols-[0.75fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Building2 className="h-7 w-7 text-[#0E7490]" />
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Australia business presence</p>
            </div>
            <h2 className="mt-3 text-2xl font-black tracking-[-0.03em]">{COMPANY.australia.entityName}</h2>
            <p className="mt-3 text-sm leading-7 text-[#64748B]">
              Australia business presence: {COMPANY.australia.entityName}, {COMPANY.australia.location}.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["ABN", COMPANY.australia.abn],
              ["ABN Status", COMPANY.australia.status],
              ["Entity Type", COMPANY.australia.entityType],
              ["Main Business Location", COMPANY.australia.location],
              ["Source", "ABN Lookup"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-[#F8FAFC] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#0E7490]">{label}</p>
                <p className="mt-2 text-sm font-bold text-[#0F172A]">{value}</p>
              </div>
            ))}
            <a href={COMPANY.australia.sourceUrl} target="_blank" rel="noreferrer" className="rounded-2xl border border-[#0E7490]/20 bg-[#E6F4F7] p-4 text-sm font-bold text-[#0E7490] transition hover:bg-[#D7EEF3] sm:col-span-2">
              {COMPANY.australia.note}
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-3xl border border-[#D9E2EC] bg-white p-7 shadow-sm">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#0E7490]">Verification process</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">How buyers can verify GOPU Exports</h2>
            <div className="mt-6 grid gap-4">
              {[
                "Confirm IEC, CIN, and GST details before formal purchase discussions.",
                "Request available registration documents, product documents, and export documentation samples where relevant.",
                "Share destination-country document requirements early so the team can confirm feasibility before quotation.",
                "Use official email and phone details listed on this page for verification communication.",
              ].map((item) => (
                <div key={item} className="flex gap-3 rounded-2xl bg-[#F8FAFC] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0E7490]" />
                  <p className="text-sm leading-7 text-[#475569]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#D9E2EC] bg-[#071624] p-7 text-white shadow-sm">
            <FileCheck2 className="h-10 w-10 text-[#67C9D8]" />
            <h2 className="mt-5 text-2xl font-black tracking-[-0.03em]">Official contact</h2>
            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Mail size={18} className="text-[#67C9D8]" />
                {COMPANY.email}
              </a>
              <a href={COMPANY.phoneHref} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4">
                <Phone size={18} className="text-[#67C9D8]" />
                {COMPANY.phone}
              </a>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[#67C9D8]">Responsible person</p>
                <p className="mt-1 font-bold text-white">{COMPANY.contactPerson}</p>
                <p className="text-xs text-slate-400">{COMPANY.contactTitle}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                Registered address: {COMPANY.registeredAddress}
              </div>
            </div>
            <Link href="/contact?verification=true" className="mt-6 inline-flex w-full justify-center rounded-xl bg-white px-5 py-3 text-sm font-black text-[#071624]">
              Request Verification Documents
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
