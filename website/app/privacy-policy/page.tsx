import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for GOPU Exports covering enquiry data, passive analytics, cookies, and buyer communication.",
  alternates: { canonical: "/privacy-policy" },
};

const sections = [
  {
    title: "Information We Collect",
    body: [
      "When you submit an enquiry, quote request, catalogue request, or contact form, GOPU Exports may collect your name, email address, phone number, company name, country, product interest, quantity, and message details so we can respond to your business request.",
      "We also collect limited technical information such as viewed pages, product views, CTA clicks, WhatsApp/email/phone clicks, browser type, device type, referral source, approximate session activity, and scroll depth. This data is used to understand buyer interest and improve website performance and enquiry flow.",
    ],
  },
  {
    title: "How We Use Information",
    body: [
      "We use enquiry and quote information to respond to buyer requests, prepare product discussions, coordinate sourcing conversations, and improve our export communication process.",
      "Analytics information is used in aggregate or session-level form to understand which products, guides, and contact options are useful to visitors. We do not use analytics to collect passwords, payment details, or private form message contents.",
    ],
  },
  {
    title: "Cookies and Session Analytics",
    body: [
      "The website may use cookies, local storage, or similar browser technologies for site functionality, session analytics, route analytics, Core Web Vitals measurement, and dashboard security. These tools help us understand anonymous website usage and maintain a stable experience.",
      "If your browser sends a Do Not Track signal, our custom analytics tracker will not send events. You may also contact us at admin@gopuexports.com for privacy questions or analytics opt-out assistance.",
    ],
  },
  {
    title: "Data Sharing",
    body: [
      "We do not sell visitor data. We may use trusted infrastructure providers such as Supabase and Vercel to host the website, database, authentication, analytics, and performance monitoring systems.",
      "Information may be shared when required for legal compliance, fraud prevention, security, or to respond to a valid business enquiry.",
    ],
  },
  {
    title: "Retention and Security",
    body: [
      "Business enquiry records may be retained for follow-up, audit, and customer-service purposes. We use access controls, dashboard authentication, and database security policies to limit access to administrative data.",
      "No internet service can be guaranteed completely secure, but we use reasonable technical and operational safeguards to protect submitted information.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">Legal</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            This policy explains how GOPU Exports handles buyer enquiries, website analytics, cookies, and contact information.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm text-[#64748B]">Last updated: May 19, 2026</p>
          <div className="mt-8 space-y-9">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0F172A]">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-[#475569]">{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="mt-10 rounded-xl bg-[#E6F4F7] p-5 text-sm leading-7 text-[#0F172A]">
            For cookie-specific details, read our <Link href="/cookie-policy" className="font-bold text-[#0E7490]">Cookie Policy</Link>.
            For questions, contact <a href="mailto:admin@gopuexports.com" className="font-bold text-[#0E7490]">admin@gopuexports.com</a>.
          </div>
        </div>
      </section>
    </main>
  );
}
