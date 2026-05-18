"use client";

import { useState } from "react";

const INCOTERMS = ["FOB", "CIF", "CFR", "EXW", "DDP"];

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur px-4 py-4">
      <div className="text-white text-[22px] font-black leading-none">{number}</div>
      <div className="mt-2 text-white/60 text-[12px] leading-5">{label}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[12px] font-semibold text-[#475569] mb-2">{label}</div>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/10 transition"
    />
  );
}

function Select({ children, value, onChange }: { children: React.ReactNode; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/10 transition"
    >
      {children}
    </select>
  );
}

function OfficeCard({
  flag,
  title,
  badge,
  badgeColor,
  lines,
  map,
}: {
  flag: string;
  title: string;
  badge: string;
  badgeColor: string;
  lines: string[];
  map: string;
}) {
  return (
    <div className="bg-white rounded-[20px] border border-[#D9E2EC] shadow-sm overflow-hidden transition hover:-translate-y-1 duration-300">
      <div className="relative overflow-hidden bg-[#081b2e] px-5 py-5">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className={`inline-flex px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${badgeColor}`}>
              {badge}
            </div>
            <div className="mt-3 text-white text-[18px] leading-none font-black tracking-[-0.5px]">
              {title}
            </div>
          </div>
          <div className="text-3xl">{flag}</div>
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-1.5 text-[13px] leading-6 text-[#64748B]">
          {lines.map((line, i) => <div key={i}>{line}</div>)}
        </div>
        <a
          href={map}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#F5F7FA] hover:bg-[#E6F4F7] transition px-4 py-2.5 text-[13px] font-semibold text-[#0F172A]"
        >
          📍 View on Google Maps
        </a>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [selectedInco, setSelectedInco] = useState("FOB");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    port: "",
    product: "",
    quantity: "",
    frequency: "",
    notes: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          product_name: form.product,
          message: [form.notes, selectedInco ? `Incoterm: ${selectedInco}` : ""]
            .filter(Boolean)
            .join("\n\n"),
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const d = await res.json();
        setError(d.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#F5F7FA] min-h-screen text-[#0F172A]">

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#081b2e]">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        <div className="max-w-[1400px] mx-auto px-8 pt-20 pb-10 relative z-10">
          <div className="grid xl:grid-cols-2 gap-8 items-center">
            {/* LEFT */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="h-[2px] w-8 bg-[#0E7490]" />
                <p className="text-xs font-black tracking-[0.2em] text-white uppercase">
                  Export Enquiries
                </p>
              </div>
              <h1 className="text-white text-[42px] lg:text-[54px] font-black leading-[1.05] tracking-[-0.04em]">
                Agricultural
                <br />
                Export
                <br />
                Solutions.
              </h1>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/70">
                International sourcing and export operations for spices, rice,
                vegetables and agricultural commodities from India to global markets.
              </p>
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard number="25+" label="Export Products" />
                <StatCard number="B2B" label="Export Trade" />
                <StatCard number="Docs" label="Compliance Support" />
                <StatCard number="Quote" label="Prompt Response" />
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="relative rounded-[24px] border border-white/10 bg-white/[0.06] backdrop-blur-xl p-5 shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.18em] text-[#67C9D8]">
                    International Trade
                  </div>
                  <div className="mt-2 text-white text-[24px] font-black leading-none">
                    Export Operations
                  </div>
                </div>
                <div className="w-14 h-14 rounded-[18px] bg-[#0E7490]/20 flex items-center justify-center border border-[#0E7490]/20 text-2xl">
                  🚢
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[["Shipping","Sea / Air"],["Packaging","OEM Ready"],["Tracking","Live Updates"],["Logistics","Worldwide"]].map(([t,v]) => (
                  <div key={t} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div className="text-[9px] uppercase tracking-[0.16em] font-bold text-white/40">{t}</div>
                    <div className="mt-2 text-white text-[15px] font-bold">{v}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-white/40 mb-3">
                  Export Coverage
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Australia","UAE","Saudi","Singapore","UK","Europe"].map((c) => (
                    <div key={c} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-[11px] font-medium">
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-[1400px] mx-auto px-8 py-10">
        <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-6 items-start">

          {/* FORM */}
          <div className="bg-white rounded-[20px] border border-[#D9E2EC] shadow-sm overflow-hidden">
            {/* HEADER */}
            <div className="relative overflow-hidden bg-[#081b2e] px-8 py-6">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right,white 1px,transparent 1px),linear-gradient(to bottom,white 1px,transparent 1px)",
                  backgroundSize: "56px 56px",
                }}
              />
              <div className="relative z-10">
                <div className="text-[10px] uppercase tracking-[0.18em] font-black text-[#67C9D8]">
                  Export Enquiry
                </div>
                <h2 className="mt-3 text-white text-[26px] font-black tracking-[-0.03em]">
                  Submit Your Requirement
                </h2>
                <p className="mt-2 text-white/60 text-[13px] leading-6">
                  Share your product requirement, destination and shipment details.
                </p>
              </div>
            </div>

            {/* FORM BODY */}
            {submitted ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#E6F4F7] flex items-center justify-center text-2xl mb-4">
                  ✓
                </div>
                <h3 className="text-[22px] font-black text-[#0F172A]">
                  Enquiry Received!
                </h3>
                <p className="mt-3 text-[#64748B] text-sm leading-7">
                  Thank you, {form.name}. Our team will respond within 12 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name:"",company:"",email:"",phone:"",country:"",port:"",product:"",quantity:"",frequency:"",notes:"" }); }}
                  className="mt-6 px-6 py-3 rounded-xl bg-[#0E7490] text-white text-sm font-bold hover:bg-[#0A5A70] transition"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Full name *">
                    <Input required placeholder="Your name" value={form.name} onChange={set("name")} />
                  </Field>
                  <Field label="Company / Organisation">
                    <Input placeholder="Importer / Distributor name" value={form.company} onChange={set("company")} />
                  </Field>
                  <Field label="Email address *">
                    <Input required type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} />
                  </Field>
                  <Field label="WhatsApp / Phone">
                    <Input placeholder="+1 234 567 890" value={form.phone} onChange={set("phone")} />
                  </Field>
                  <Field label="Destination country">
                    <Select value={form.country} onChange={set("country") as (e: React.ChangeEvent<HTMLSelectElement>) => void}>
                      <option value="">Select country</option>
                      {["Australia","United Arab Emirates","Saudi Arabia","Germany","United Kingdom","USA","Canada","Singapore","Netherlands","South Africa"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Destination port / city">
                    <Input placeholder="e.g. Sydney, Dubai, Rotterdam" value={form.port} onChange={set("port")} />
                  </Field>
                  <Field label="Product required">
                    <Select value={form.product} onChange={set("product") as (e: React.ChangeEvent<HTMLSelectElement>) => void}>
                      <option value="">Select product</option>
                      {["Guntur Red Chilli (S4)","Turmeric (Nizamabad)","Basmati Rice","Fresh Vegetables","Black Pepper","Cumin Seeds","Pulses"].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Quantity required">
                    <Input placeholder="e.g. 5 MT, 1 FCL, 500 kg" value={form.quantity} onChange={set("quantity")} />
                  </Field>
                  <Field label="Shipment frequency">
                    <Select value={form.frequency} onChange={set("frequency") as (e: React.ChangeEvent<HTMLSelectElement>) => void}>
                      <option value="">Select</option>
                      {["One-time trial order","Monthly","Quarterly","Bi-annual","Annual Contract"].map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                    </Select>
                  </Field>

                  {/* INCOTERMS */}
                  <div>
                    <div className="text-[12px] font-semibold text-[#475569] mb-2">
                      Preferred incoterms
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {INCOTERMS.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setSelectedInco(term)}
                          className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition border ${
                            selectedInco === term
                              ? "bg-[#E6F4F7] border-[#0E7490] text-[#0A5A70]"
                              : "bg-[#F8FAFC] border-[#D9E2EC] text-[#475569]"
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* NOTES */}
                  <div className="md:col-span-2">
                    <div className="text-[12px] font-semibold text-[#475569] mb-2">
                      Quality notes / specific requirements
                    </div>
                    <textarea
                      placeholder="e.g. moisture %, colour grade, phytosanitary requirements…"
                      rows={4}
                      value={form.notes}
                      onChange={set("notes")}
                      className="w-full rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] px-4 py-3 text-sm outline-none resize-y focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/10 transition"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 rounded-xl bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 transition text-white py-3 text-[14px] font-bold"
                >
                  {loading ? "Sending…" : "Send Export Enquiry →"}
                </button>
              </form>
            )}
          </div>

          {/* OFFICES */}
          <div className="space-y-4">
            <OfficeCard
              map="https://maps.google.com/?q=Hasanparthy,Warangal,Telangana,India"
              flag="🇮🇳"
              title="India Headquarters"
              badge="Registered Office"
              badgeColor="bg-[#E6F4F7] text-[#0A5A70]"
              lines={["Hasanparthy","Warangal, Telangana","506244, India","admin@gopuexports.com","+91 87128 16876"]}
            />
            <OfficeCard
              map="https://maps.google.com/?q=Surry+Hills,Sydney,Australia"
              flag="🇦🇺"
              title="Australia Operations"
              badge="Sydney Office"
              badgeColor="bg-[#EFF6FF] text-[#1D4ED8]"
              lines={["Surry Hills","Sydney, NSW","2000, Australia","+61 411 711 106"]}
            />
            <OfficeCard
              map="https://www.google.com/maps/place/Guntur+Market+Yard,+Guntur,+Andhra+Pradesh"
              flag="🇮🇳"
              title="Guntur Yard"
              badge="Field Office"
              badgeColor="bg-[#FFF1F2] text-[#BE123C]"
              lines={["Guntur Market Yard","Guntur, Andhra Pradesh","Field Operations Office","India Procurement & Sourcing","+91 87128 16876"]}
            />
          </div>
        </div>
      </section>

    </main>
  );
}
