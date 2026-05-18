import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { PRODUCTS } from "@/lib/products";
import { productBodyToRow } from "@/src/lib/supabase/data";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  let inserted = 0;
  let skipped = 0;

  for (const p of PRODUCTS) {
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("slug", p.slug)
      .maybeSingle();

    if (existing) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("products").insert(productBodyToRow({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      category: p.category,
      image: p.image,
      description: p.description,
      origin: p.origin,
      moq: p.moq,
      packaging: p.packaging,
      lead: p.lead,
      hs: p.hs,
      shelfLife: p.shelfLife,
      applications: p.applications,
      specs: p.specs,
      benefits: p.benefits,
      related: p.related,
      featured: p.featured ?? false,
      active: true,
    }));

    if (error) {
      skipped++;
    } else {
      inserted++;
    }
  }

  return NextResponse.json({
    success: true,
    inserted,
    skipped,
    message: `Seeded ${inserted} products. Skipped ${skipped} already existing.`,
  });
}
