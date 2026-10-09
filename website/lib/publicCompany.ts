import "server-only";
import { cache } from "react";
import { COMPANY } from "./company";
import { createPublicClient } from "@/src/lib/supabase/public";

export const getPublicCompany = cache(async () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return COMPANY;
  const { data, error } = await createPublicClient().from("site_settings").select("value").eq("key", "contact").maybeSingle();
  if (error) { console.error("Unable to load contact settings"); return COMPANY; }
  const value = data?.value as Record<string, unknown> | undefined;
  // Legacy settings were never published by the old public site. Publish them
  // only after an administrator reviews and saves them in the updated editor.
  if (!value || value.publicContactVersion !== 1) return COMPANY;
  const text = (key: string, fallback: string) => typeof value[key] === "string" && value[key].trim() ? value[key].trim().slice(0, 1000) : fallback;
  const phone = text("phone", COMPANY.phone);
  const address = text("address", COMPANY.hq.address);
  const profile = (key: string, host: string, fallback: string) => {
    try { const url = new URL(text(key, fallback)); return url.protocol === "https:" && [host, `www.${host}`].includes(url.hostname) ? url.href : fallback; } catch { return fallback; }
  };
  return { ...COMPANY, name: text("companyName", COMPANY.name), email: text("email", COMPANY.email), phone,
    phoneHref: `tel:${phone.replace(/[^+\d]/g, "")}`, whatsapp: `https://wa.me/${text("whatsapp", phone).replace(/\D/g, "")}`,
    hq: { ...COMPANY.hq, address },
    social: { linkedin: profile("linkedin", "linkedin.com", COMPANY.social.linkedin), facebook: profile("facebook", "facebook.com", COMPANY.social.facebook), instagram: profile("instagram", "instagram.com", COMPANY.social.instagram) },
  };
});
