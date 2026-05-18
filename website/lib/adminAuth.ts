import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("admin_users")
      .select("id")
      .eq("id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    return !error && Boolean(data);
  } catch {
    return false;
  }
}

export async function requireAdminClient(): Promise<SupabaseClient | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !data) return null;
  return supabase;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
