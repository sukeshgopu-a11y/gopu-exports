"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";

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
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-[#0F172A]">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm">Manage company info and admin preferences</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-3xl">

        {/* Company Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
          <h2 className="text-base font-bold text-[#0F172A] mb-5">Company Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Company Name">
              <Input defaultValue="GOPU Exports" />
            </Field>
            <Field label="Business Email">
              <Input type="email" defaultValue="admin@gopuexports.com" />
            </Field>
            <Field label="Phone Number">
              <Input defaultValue="+91 87128 16876" />
            </Field>
            <Field label="WhatsApp Number">
              <Input defaultValue="+91 87128 16876" />
            </Field>
            <Field label="Website URL">
              <Input defaultValue="https://gopuexports.com" />
            </Field>
            <Field label="IEC / Registration Number">
              <Input defaultValue="" placeholder="IEC Number" />
            </Field>
          </div>
          <div className="mt-5">
            <Field label="Company Address">
              <textarea
                rows={3}
                defaultValue="Hasanparthy, Warangal, Telangana, 506244, India"
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
              <Input placeholder="https://linkedin.com/company/gopuexports" />
            </Field>
            <Field label="Instagram">
              <Input placeholder="https://instagram.com/gopuexports" />
            </Field>
            <Field label="Facebook">
              <Input placeholder="https://facebook.com/gopuexports" />
            </Field>
            <Field label="WhatsApp Link">
              <Input defaultValue="https://wa.me/918712816876" />
            </Field>
          </div>
        </div>

        {/* Security Note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
          <strong>Admin credentials</strong> are configured via environment variables
          (<code className="bg-amber-100 px-1 rounded">ADMIN_EMAIL</code> /{" "}
          <code className="bg-amber-100 px-1 rounded">ADMIN_PASSWORD</code>) in{" "}
          <code className="bg-amber-100 px-1 rounded">.env.local</code>. Update them there and
          restart the server to change login credentials.
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-3 bg-[#0E7490] hover:bg-[#0A5A70] disabled:opacity-60 transition text-white px-7 py-3 rounded-xl font-semibold text-sm"
        >
          {saved ? <Check size={18} /> : <Save size={18} />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
