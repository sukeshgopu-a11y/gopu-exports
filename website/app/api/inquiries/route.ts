import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { inquiryToApi, type InquiryRow } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 250);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  const { data, error } = await supabase
    .from("inquiries")
    .select("id,name,email,phone,company,country,message,product_id,status,created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
    .returns<InquiryRow[]>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const response = NextResponse.json((data ?? []).map(inquiryToApi));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(req: NextRequest) {
  const supabase = createPublicClient();
  const body = await req.json();

  const required = ["name", "email"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }

  const { error } = await supabase
    .from("inquiries")
    .insert({
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone,
    country: body.country,
      message: body.message ?? body.notes ?? "",
      product_id: body.product_id ?? null,
      status: "new",
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true }, { status: 201 });
}
