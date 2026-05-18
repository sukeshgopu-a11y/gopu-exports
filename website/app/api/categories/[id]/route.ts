import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";

type Category = { _id: string; [key: string]: unknown };

async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "categories")
    .maybeSingle();
  return Array.isArray(data?.value) ? data.value as Category[] : [];
}

async function saveCategories(supabase: SupabaseClient, categories: Category[]) {
  await supabase
    .from("site_settings")
    .upsert({ key: "categories", value: categories }, { onConflict: "key" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const categories = await getCategories();
  const updated = categories.map((category) =>
    category._id === id ? { ...category, ...body } : category
  );
  await saveCategories(supabase, updated);
  const category = updated.find((item) => item._id === id);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  await saveCategories(supabase, (await getCategories()).filter((category) => category._id !== id));
  return NextResponse.json({ success: true });
}
