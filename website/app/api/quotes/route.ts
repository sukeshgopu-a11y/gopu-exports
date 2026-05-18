import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { quoteToApi, type QuoteRow } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { data, error } = await supabase
    .from("quotes")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<QuoteRow[]>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(quoteToApi));
}

export async function POST(req: NextRequest) {
  const supabase = createPublicClient();
  const body = await req.json();

  for (const field of ["name", "email"]) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const { error } = await supabase
    .from("quotes")
    .insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      country: body.country,
      product_name: body.product_name ?? body.product,
      quantity: body.quantity,
      message: body.message ?? body.notes ?? "",
      status: "new",
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true }, { status: 201 });
}
