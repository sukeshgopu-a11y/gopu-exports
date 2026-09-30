import "server-only";
import { cache } from "react";
import { createPublicClient, hasPublicSupabaseConfig } from "@/src/lib/supabase/public";

export type PublicGalleryImage = {
  id: string;
  title: string | null;
  alt_text: string | null;
  image_url: string;
};

export const getPublicGalleryImages = cache(async (): Promise<PublicGalleryImage[]> => {
  if (!hasPublicSupabaseConfig()) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("gallery_images")
    .select("id,title,alt_text,image_url")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .returns<PublicGalleryImage[]>();

  if (error) {
    throw new Error(`Public gallery unavailable: ${error.message}`);
  }

  return data ?? [];
});
