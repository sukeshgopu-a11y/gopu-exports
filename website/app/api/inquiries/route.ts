import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { inquiryToApi, type InquiryRow } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<InquiryRow[]>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(inquiryToApi));
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
