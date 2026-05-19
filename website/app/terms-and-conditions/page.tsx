import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and conditions for using the GOPU Exports website, submitting enquiries, and reviewing export product information.",
  alternates: { canonical: "/terms-and-conditions" },
};

const terms = [
  {
    title: "Website Information",
    body: "Product descriptions, specifications, packaging details, lead times, and documentation information are provided for business enquiry purposes. Final commercial terms depend on product availability, buyer requirements, destination rules, inspection needs, and written quotation confirmation.",
  },
  {
    title: "Enquiries and Quotes",
    body: "Submitting an enquiry or quote request does not create a binding sales contract. GOPU Exports may contact you using the email, phone, WhatsApp, company, country, product, quantity, and message details you provide to discuss sourcing and quotation requirements.",
  },
  {
    title: "Analytics and Website Improvement",
    body: "The website uses passive, privacy-conscious analytics and performance measurement to understand viewed pages, product interest, session activity, device type, referral source, CTA clicks, enquiry activity, and Core Web Vitals. This helps improve the buyer journey and dashboard visibility without collecting passwords or payment details.",
  },
  {
    title: "Cookies and Local Storage",
    body: "Cookies, local storage, and similar technologies may be used for website functionality, analytics, security, route performance, and dashboard authentication. More details are available in the Cookie Policy.",
  },
  {
    title: "No False Guarantees",
    body: "GOPU Exports does not guarantee import approval, customs clearance, fixed market prices, freight timelines, or destination-country certification acceptance unless expressly confirmed in writing by the relevant issuing or regulatory authority.",
  },
  {
    title: "Contact",
    body: "For website, privacy, or business enquiry questions, contact admin@gopuexports.com or call +91 87128 16876.",
  },
];

export default function TermsPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">Legal</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Terms & Conditions</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            These terms apply to website use, product information, enquiry submissions, and buyer communication.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm text-[#64748B]">Last updated: May 19, 2026</p>
          <div className="mt-8 space-y-8">
            {terms.map((item) => (
              <section key={item.title}>
                <h2 className="text-2xl font-black tracking-[-0.03em] text-[#0F172A]">{item.title}</h2>
                <p className="mt-4 text-sm leading-7 text-[#475569]">{item.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
