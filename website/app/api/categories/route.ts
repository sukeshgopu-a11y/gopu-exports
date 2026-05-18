import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { slugify } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

async function getCategories() {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "categories")
    .maybeSingle();
  return Array.isArray(data?.value) ? data.value : [];
}

async function saveCategories(supabase: SupabaseClient, categories: unknown[]) {
  await supabase
    .from("site_settings")
    .upsert({ key: "categories", value: categories }, { onConflict: "key" });
}

export async function GET() {
  return NextResponse.json(await getCategories());
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const categories = await getCategories();
  const category = {
    _id: crypto.randomUUID(),
    name: body.name,
    slug: body.slug || slugify(body.name),
    description: body.description ?? "",
    image: body.image ?? "",
    active: body.active ?? true,
    order: Number(body.order ?? 0),
  };
  await saveCategories(supabase, [...categories, category]);
  return NextResponse.json(category, { status: 201 });
}
