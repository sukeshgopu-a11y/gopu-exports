import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie policy for GOPU Exports covering functional cookies, analytics, session storage, and opt-out contact details.",
  alternates: { canonical: "/cookie-policy" },
};

const rows = [
  ["Functional storage", "Supports basic website behavior, navigation, dashboard sessions, and form experience."],
  ["Anonymous analytics", "Measures page views, viewed products, CTA clicks, scroll depth, device type, browser type, and referral source."],
  ["Performance analytics", "Supports Vercel Analytics and Speed Insights for Core Web Vitals and route performance measurement."],
  ["Security/session cookies", "Supports authenticated dashboard access and helps protect admin-only routes."],
];

export default function CookiePolicyPage() {
  return (
    <main className="bg-[#F5F7FA] text-[#0F172A]">
      <section className="bg-[#071624] px-6 py-20 text-white sm:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#67C9D8]">Legal</p>
          <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">Cookie Policy</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">
            GOPU Exports uses limited cookies and browser storage for functionality, analytics, security, and performance measurement.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 sm:px-8">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#D9E2EC] bg-white p-6 shadow-sm sm:p-10">
          <p className="text-sm text-[#64748B]">Last updated: May 19, 2026</p>
          <div className="mt-8 overflow-hidden rounded-xl border border-[#E2E8F0]">
            {rows.map(([name, purpose]) => (
              <div key={name} className="grid gap-2 border-b border-[#E2E8F0] p-5 last:border-b-0 sm:grid-cols-[220px_1fr]">
                <h2 className="text-sm font-black text-[#0F172A]">{name}</h2>
                <p className="text-sm leading-7 text-[#475569]">{purpose}</p>
              </div>
            ))}
          </div>

          <section className="mt-9 space-y-4 text-sm leading-7 text-[#475569]">
            <p>
              We do not use a frontend cookie banner. Analytics disclosure is provided in this policy, the Privacy Policy,
              and the Terms & Conditions so the website experience remains uninterrupted for buyers.
            </p>
            <p>
              Our custom analytics respects browser Do Not Track signals. You can also ask for analytics opt-out support by
              emailing <a href="mailto:admin@gopuexports.com" className="font-bold text-[#0E7490]">admin@gopuexports.com</a>.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
