"use client";

import { useState } from "react";
import { COMPANY } from "@/lib/company";

const INCOTERMS = ["FOB", "CIF", "CFR", "EXW", "DDP"];
const OTHER = "Others";

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  country: "",
  countryOther: "",
  port: "",
  product: "",
  productOther: "",
  quantity: "",
  frequency: "",
  frequencyOther: "",
  notes: "",
};

function getInitialForm() {
  if (typeof window === "undefined") return EMPTY_FORM;
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product");
  const catalogue = params.get("catalogue");
  if (!product) return EMPTY_FORM;
  return {
    ...EMPTY_FORM,
    product: OTHER,
    productOther: product,
    notes: catalogue ? `Please share the product catalogue and quote details for ${product}.` : "",
  };
}

function TrustCard({ title, label }: { title: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur px-4 py-4">
      <div className="text-white text-[15px] font-black leading-tight">{title}</div>
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-semibold text-red-600">{message}</p>;
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...inputProps } = props;
  return (
    <input
      {...inputProps}
      className={`w-full rounded-xl border border-[#D9E2EC] bg-[#F8FAFC] px-4 py-2.5 text-sm outline-none transition focus:border-[#0E7490] focus:ring-2 focus:ring-[#0E7490]/10 ${className}`}
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

function cleanPhoneInput(value: string) {
  const trimmed = value.trim();
  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return `${hasLeadingPlus ? "+" : ""}${digits}`;
}

function FormSection({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#D9E2EC] bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col gap-1 border-b border-[#EEF2F7] pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-[15px] font-black tracking-[-0.02em] text-[#0F172A]">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-[#64748B]">{note}</p>
        </div>
        <span className="w-fit rounded-full bg-[#E6F4F7] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#0E7490]">
          Required
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </div>
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState(getInitialForm);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = key === "phone" ? cleanPhoneInput(e.target.value) : e.target.value;
      setForm((f) => ({ ...f, [key]: value }));
      setFieldErrors((current) => {
        if (!current[key]) return current;
        const next = { ...current };
        delete next[key];
        return next;
      });
    };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError("");
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!form.company.trim()) nextErrors.company = "Company / organisation name is required.";
    if (!form.email.trim()) nextErrors.email = "Email address is required.";
    if (!form.phone.trim()) nextErrors.phone = "Phone / WhatsApp number is required for enquiry follow-up.";
    if (form.phone.trim() && !/^\+?\d{7,15}$/.test(form.phone.trim())) nextErrors.phone = "Use numbers only. A single leading + is allowed.";
    if (!form.country.trim()) nextErrors.country = "Destination country is required.";
    if (form.country === OTHER && !form.countryOther.trim()) nextErrors.countryOther = "Please enter the destination country.";
    if (!form.port.trim()) nextErrors.port = "Destination port or city is required.";
    if (!form.product.trim()) nextErrors.product = "Product requirement is required.";
    if (form.product === OTHER && !form.productOther.trim()) nextErrors.productOther = "Please enter your product requirement.";
    if (!form.quantity.trim()) nextErrors.quantity = "Quantity is required.";
    if (!form.frequency.trim()) nextErrors.frequency = "Shipment frequency is required.";
    if (form.frequency === OTHER && !form.frequencyOther.trim()) nextErrors.frequencyOther = "Please enter the shipment frequency.";

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setError("Please fix the highlighted fields before sending your enquiry.");
      return;
    }

    setLoading(true);
    try {
      const country = form.country === OTHER ? form.countryOther : form.country;
      const product = form.product === OTHER ? form.productOther : form.product;
      const frequency = form.frequency === OTHER ? form.frequencyOther : form.frequency;
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          source_url: window.location.href,
          country,
          product,
          product_name: product,
          frequency,
          incoterm: selectedInco,
          message: [
            product ? `Product: ${product}` : "",
            form.quantity ? `Quantity: ${form.quantity}` : "",
            form.port ? `Destination port / city: ${form.port}` : "",
            form.notes,
            frequency ? `Frequency: ${frequency}` : "",
            selectedInco ? `Incoterm: ${selectedInco}` : "",
          ]
            .filter(Boolean)
            .join("\n\n"),
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent("gopu:analytics", {
          detail: {
            eventType: "inquiry_submit",
            metadata: {
              product: form.product === OTHER ? form.productOther : form.product,
              country: form.country === OTHER ? form.countryOther : form.country,
            },
          },
        }));
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
                <TrustCard title="Quality-Focused" label="Export sourcing" />
                <TrustCard title="Compliant" label="Packaging support" />
                <TrustCard title="Buyer-Centric" label="Communication" />
                <TrustCard title="Flexible" label="Product sourcing" />
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
                  {["Company verification","Product specification","Packaging review","Document checklist","Quote preparation","Shipment planning"].map((c) => (
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
                  Share the key buyer details needed for a practical export response.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Company", "Phone", "Destination", "Product", "Quantity", "Frequency"].map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/75">
                      {item}
                    </span>
                  ))}
                </div>
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
                  Thank you, {form.name}. Our team will review your requirement and respond with practical next steps.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); }}
                  className="mt-6 px-6 py-3 rounded-xl bg-[#0E7490] text-white text-sm font-bold hover:bg-[#0A5A70] transition"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 bg-[#F8FAFC] p-5 sm:p-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
                  Fill all required buyer fields so our team can respond with correct product, packing, destination, and shipment assumptions. For urgent requirements, call <a href={COMPANY.phoneHref} className="font-black underline">{COMPANY.phone}</a>.
                </div>

                <FormSection title="Buyer Details" note="Who should our export team contact?">
                  <Field label="Full name *">
                    <Input required placeholder="Your name" value={form.name} onChange={set("name")} />
                    <FieldError message={fieldErrors.name} />
                  </Field>
                  <Field label="Company / Organisation *">
                    <Input required placeholder="Importer / Distributor name" value={form.company} onChange={set("company")} />
                    <FieldError message={fieldErrors.company} />
                  </Field>
                  <Field label="Email address *">
                    <Input required type="email" placeholder="you@company.com" value={form.email} onChange={set("email")} />
                    <FieldError message={fieldErrors.email} />
                  </Field>
                  <Field label="WhatsApp / Phone *">
                    <Input required inputMode="tel" pattern="\\+?[0-9]*" placeholder="+918712816876" value={form.phone} onChange={set("phone")} />
                    <FieldError message={fieldErrors.phone} />
                  </Field>
                </FormSection>

                <FormSection title="Destination & Shipment" note="Where is the cargo going and how often will you buy?">
                  <Field label="Destination country *">
                    <Select value={form.country} onChange={set("country") as (e: React.ChangeEvent<HTMLSelectElement>) => void}>
                      <option value="">Select country</option>
                      {["Australia","United Arab Emirates","Saudi Arabia","Germany","United Kingdom","USA","Canada","Singapore","Netherlands","South Africa"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                      <option value={OTHER}>{OTHER}</option>
                    </Select>
                    {form.country === OTHER && (
                      <Input
                        required
                        className="mt-2"
                        placeholder="Enter destination country"
                        value={form.countryOther}
                        onChange={set("countryOther")}
                      />
                    )}
                    <FieldError message={fieldErrors.country} />
                    <FieldError message={fieldErrors.countryOther} />
                  </Field>
                  <Field label="Destination port / city *">
                    <Input required placeholder="e.g. Sydney, Dubai, Rotterdam" value={form.port} onChange={set("port")} />
                    <FieldError message={fieldErrors.port} />
                  </Field>
                  <Field label="Shipment frequency *">
                    <Select value={form.frequency} onChange={set("frequency") as (e: React.ChangeEvent<HTMLSelectElement>) => void}>
                      <option value="">Select frequency</option>
                      {["One-time trial order","Monthly","Quarterly","Bi-annual","Annual Contract"].map((f) => (
                        <option key={f}>{f}</option>
                      ))}
                      <option value={OTHER}>{OTHER}</option>
                    </Select>
                    {form.frequency === OTHER && (
                      <Input
                        required
                        className="mt-2"
                        placeholder="Enter shipment frequency"
                        value={form.frequencyOther}
                        onChange={set("frequencyOther")}
                      />
                    )}
                    <FieldError message={fieldErrors.frequency} />
                    <FieldError message={fieldErrors.frequencyOther} />
                  </Field>
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
                              : "bg-white border-[#D9E2EC] text-[#475569]"
                          }`}
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </FormSection>

                <FormSection title="Product Requirement" note="Tell us what you need to source.">
                  <Field label="Product required *">
                    <Select value={form.product} onChange={set("product") as (e: React.ChangeEvent<HTMLSelectElement>) => void}>
                      <option value="">Select product</option>
                      {["Guntur Red Chilli (S4)","Turmeric (Nizamabad)","Basmati Rice","Fresh Vegetables","Black Pepper","Cumin Seeds","Pulses"].map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                      <option value={OTHER}>{OTHER}</option>
                    </Select>
                    {form.product === OTHER && (
                      <Input
                        required
                        className="mt-2"
                        placeholder="Enter product requirement"
                        value={form.productOther}
                        onChange={set("productOther")}
                      />
                    )}
                    <FieldError message={fieldErrors.product} />
                    <FieldError message={fieldErrors.productOther} />
                  </Field>
                  <Field label="Quantity required *">
                    <Input required placeholder="e.g. 5 MT, 1 FCL, 500 kg" value={form.quantity} onChange={set("quantity")} />
                    <FieldError message={fieldErrors.quantity} />
                  </Field>
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
                </FormSection>

                {error && (
                  <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {error}
                    <div className="mt-2 font-semibold">
                      Urgent support: <a href={COMPANY.phoneHref} className="underline">{COMPANY.phone}</a>
                    </div>
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

          {submitted && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061827]/70 px-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4F7] text-2xl text-[#0E7490]">
                  ✓
                </div>
                <h3 className="mt-4 text-2xl font-black tracking-[-0.03em] text-[#0F172A]">Enquiry Sent</h3>
                <p className="mt-3 text-sm leading-7 text-[#64748B]">
                  Thank you, {form.name}. Your enquiry has been saved and our team will review it.
                </p>
                <div className="mt-4 rounded-2xl bg-[#FFF7ED] px-4 py-3 text-sm text-[#9A3412]">
                  Urgent requirement? Call <a href={COMPANY.phoneHref} className="font-black underline">{COMPANY.phone}</a>.
                </div>
                <button
                  onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); setFieldErrors({}); }}
                  className="mt-6 w-full rounded-xl bg-[#0E7490] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0A5A70]"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          )}

          {/* OFFICES */}
          <div className="space-y-4">
            <OfficeCard
              map="https://maps.google.com/?q=Hasanparthy,Warangal,Telangana,India"
              flag="IN"
              title="India Headquarters"
              badge="Registered Office"
              badgeColor="bg-[#E6F4F7] text-[#0A5A70]"
              lines={[COMPANY.registeredAddress, COMPANY.email, COMPANY.phone]}
            />
            <OfficeCard
              map="https://maps.google.com/?q=Warangal,Telangana,India"
              flag="ID"
              title="Verification Desk"
              badge="Buyer Support"
              badgeColor="bg-[#EFF6FF] text-[#1D4ED8]"
              lines={[`${COMPANY.contactPerson} — ${COMPANY.contactTitle}`, `For buyer verification and export enquiries, contact ${COMPANY.contactPerson}.`, "Request available verification documents", "Use official email for verification requests"]}
            />
            <OfficeCard
              map="https://maps.google.com/?q=NSW+2010,Australia"
              flag="AU"
              title="Australia Business Presence"
              badge="ABN Lookup"
              badgeColor="bg-[#F0FDF4] text-[#166534]"
              lines={[
                `${COMPANY.australia.entityName} — ABN ${COMPANY.australia.abn}`,
                `${COMPANY.australia.status}; ${COMPANY.australia.entityType}`,
                `Main business location: ${COMPANY.australia.location}`,
                COMPANY.australia.note,
              ]}
            />
          </div>
        </div>
      </section>

    </main>
  );
}
