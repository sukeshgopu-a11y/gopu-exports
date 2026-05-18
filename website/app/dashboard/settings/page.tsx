"use client";

import { useEffect, useState } from "react";
import { Save, Check } from "lucide-react";

type ContactSettings = {
  companyName: string;
  email: string;
  phone: string;
  whatsapp: string;
  website: string;
  iec: string;
  address: string;
  linkedin: string;
  instagram: string;
  facebook: string;
};

const DEFAULTS: ContactSettings = {
  companyName: "GOPU Exports",
  email: "admin@gopuexports.com",
  phone: "+91 87128 16876",
  whatsapp: "918712816876",
  website: "https://gopuexports.com",
  iec: "",
  address: "Hasanparthy, Warangal, Telangana, 506244, India",
  linkedin: "",
  instagram: "",
  facebook: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#374151] mb-2">{label}</label>
      {children}
    </div>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-[#D9E2EC] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490] transition"
    />
  );
}

export default function SettingsPage() {
  const [contact, setContact] = useState<ContactSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/site-settings?key=contact")
      .then((r) => r.json())
      .then((data) => {
        if (data?.value) setContact({ ...DEFAULTS, ...data.value });
      })
      .finally(() => setLoading(false));
  }, []);

  const set = (key: keyof ContactSettings) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setContact((c) => ({ ...c, [key]: e.target.value }));

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "contact", value: contact }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        Loading settings…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#0F172A]">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Company info and contact details shown on the website</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-base font-bold text-[#0F172A] mb-5">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Name">
              <Input value={contact.companyName} onChange={set("companyName")} />
            </Field>
            <Field label="Business Email">
              <Input type="email" value={contact.email} onChange={set("email")} />
            </Field>
            <Field label="Phone Number">
              <Input value={contact.phone} onChange={set("phone")} />
            </Field>
            <Field label="WhatsApp Number (digits only)">
              <Input value={contact.whatsapp} onChange={set("whatsapp")} placeholder="918712816876" />
            </Field>
            <Field label="Website URL">
              <Input value={contact.website} onChange={set("website")} />
            </Field>
            <Field label="IEC / Registration Number">
              <Input value={contact.iec} onChange={set("iec")} placeholder="IEC Number" />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Company Address">
              <textarea
                rows={3}
                value={contact.address}
                onChange={set("address")}
                className="w-full border border-[#D9E2EC] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0E7490]/30 focus:border-[#0E7490] transition resize-none"
              />
            </Field>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-base font-bold text-[#0F172A] mb-5">Social & Contact Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="LinkedIn">
              <Input value={contact.linkedin} onChange={set("linkedin")} />
            </Field>
            <Field label="Instagram">
              <Input value={contact.instagram} onChange={set("instagram")} />
            </Field>
            <Field label="Facebook">
              <Input value={contact.facebook} onChange={set("facebook")} />
            </Field>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
          <strong>Admin access</strong> is managed through Supabase Auth and the{" "}
          <code className="bg-amber-100 px-1 rounded">admin_users</code> table. Create or update
          dashboard users in Supabase, then add their Auth UUID to{" "}
          <code className="bg-amber-100 px-1 rounded">admin_users</code>.
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-3 bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 transition text-white px-7 py-3 rounded-xl font-semibold text-sm"
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
