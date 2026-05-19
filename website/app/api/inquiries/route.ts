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
    .select("id,name,email,phone,company,country,message,product_name,quantity,incoterm,admin_notes,product_id,status,created_at")
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

  const productName = String(body.product_name ?? body.product ?? "").trim();
  const required: Record<string, string> = {
    name: "Full name is required",
    company: "Company / organisation name is required",
    email: "Email address is required",
    phone: "Phone / WhatsApp number is required",
    country: "Destination country is required",
    product_name: "Product requirement is required",
    quantity: "Quantity is required",
    frequency: "Shipment frequency is required",
  };

  for (const [field, message] of Object.entries(required)) {
    const value = field === "product_name" ? productName : body[field];
    if (!String(value ?? "").trim()) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  const phone = String(body.phone ?? "").trim();
  if (!/^\+?\d{7,15}$/.test(phone)) {
    return NextResponse.json(
      { error: "Phone number must contain only numbers. One leading + is allowed." },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("inquiries")
    .insert({
      name: String(body.name).trim(),
      company: String(body.company).trim(),
      email: String(body.email).trim(),
      phone,
      country: String(body.country).trim(),
      product_name: productName,
      quantity: String(body.quantity).trim(),
      incoterm: body.incoterm ?? "",
      message: body.message ?? body.notes ?? "",
      product_id: body.product_id ?? null,
      status: "new",
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true }, { status: 201 });
}
