import { NextResponse } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const supabase = await createClient();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(email).trim().toLowerCase(),
    password: String(password),
  });

  if (error || !data.user) {
    console.warn("Admin login failed", { email: String(email).trim().toLowerCase(), reason: error?.message });
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
    console.warn("Non-admin dashboard login blocked", { userId: data.user.id });
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
