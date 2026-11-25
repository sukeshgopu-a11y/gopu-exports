import "server-only";
import { createPublicClient } from "@/src/lib/supabase/public";
import { cache } from "react";
export type PublicCategory = { name: string; description?: string; active?: boolean; order?: number };
export const getPublicCategories = cache(async (): Promise<PublicCategory[]> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const { data, error } = await createPublicClient().from("site_settings").select("value").eq("key", "categories").maybeSingle();
  if (error) throw new Error("Unable to load categories");
  return Array.isArray(data?.value) ? data.value.filter((v: PublicCategory) => typeof v.name === "string").sort((a: PublicCategory, b: PublicCategory) => (a.order || 0) - (b.order || 0)) : [];
});
