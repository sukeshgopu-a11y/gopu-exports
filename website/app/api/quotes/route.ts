import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { quoteToApi, type QuoteRow } from "@/src/lib/supabase/data";
import { sendLeadEmails } from "@/lib/leadEmail";
import { buildSourceUrl, buildTimestamp, rejectSpam, stringField, validateEmail, validatePhone } from "@/lib/leadValidation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 250);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  const { data, error } = await supabase
    .from("quotes")
    .select("id,name,email,phone,company,country,product_name,quantity,message,status,created_at")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
    .returns<QuoteRow[]>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const response = NextResponse.json((data ?? []).map(quoteToApi));
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export async function POST(req: NextRequest) {
  const supabase = createPublicClient();
  const body = await req.json();

  if (rejectSpam(body)) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const name = stringField(body, "name", "fullName", "full_name");
  const company = stringField(body, "company", "companyName", "company_name");
  const email = stringField(body, "email");
  const phone = stringField(body, "phone", "phoneNumber", "phone_number");
  const country = stringField(body, "country", "destination", "destination_country");
  const productName = stringField(body, "product_name", "product", "productInterested");
  const quantity = stringField(body, "quantity");
  const sourceUrl = buildSourceUrl(req, body);
  const timestamp = buildTimestamp();
  const buyerMessage = stringField(body, "message", "notes");

  const required: Record<string, string> = {
    name: "Full name is required",
    company: "Company / organisation name is required",
    email: "Email address is required",
    phone: "Phone / WhatsApp number is required",
    country: "Destination country is required",
    product_name: "Product requirement is required",
    quantity: "Quantity is required",
  };

  for (const [field, message] of Object.entries(required)) {
    const value =
      field === "product_name" ? productName :
      field === "name" ? name :
      field === "company" ? company :
      field === "email" ? email :
      field === "phone" ? phone :
      field === "country" ? country :
      field === "quantity" ? quantity :
      stringField(body, field);
    if (!value) return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!validateEmail(email)) return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
  if (!validatePhone(phone)) {
    return NextResponse.json(
      { error: "Phone number must contain only numbers. One leading + is allowed." },
      { status: 400 }
    );
  }

  const storedMessage = [
    buyerMessage,
    sourceUrl ? `Source URL: ${sourceUrl}` : "",
    `Timestamp: ${timestamp}`,
  ].filter(Boolean).join("\n\n");

  const { error } = await supabase
    .from("quotes")
    .insert({
      name,
      email,
      phone,
      company,
      country,
      product_name: productName,
      quantity,
      message: storedMessage,
      status: "new",
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  await sendLeadEmails({
    kind: "quote",
    name,
    company,
    email,
    phone,
    country,
    product: productName,
    quantity,
    message: buyerMessage,
    sourceUrl,
    timestamp,
  });
  return NextResponse.json({ success: true }, { status: 201 });
}
