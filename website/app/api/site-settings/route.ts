import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createPublicClient();
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key) {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("key", key)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? { key, value: null });
  }

  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const result: Record<string, unknown> = {};
  for (const s of data ?? []) {
    result[(s as { key: string; value: unknown }).key] = (s as { key: string; value: unknown }).value;
  }
  return NextResponse.json(result);
}

export async function PUT(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const body = await req.json();
  const { key, value } = body;

  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
