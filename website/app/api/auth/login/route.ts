import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("id")
    .eq("id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (adminError || !adminUser) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
