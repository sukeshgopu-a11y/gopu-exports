import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { inquiryToApi, type InquiryRow } from "@/src/lib/supabase/data";
import { getLeadEmailConfigurationError, sendLeadEmails } from "@/lib/leadEmail";
import { updateLeadEmailStatus } from "@/lib/leadStatus";
import { buildSourceUrl, buildTimestamp, normalizeLeadPhone, rejectSpam, stringField, validateEmail } from "@/lib/leadValidation";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 250);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
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

  if (rejectSpam(body)) {
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const name = stringField(body, "name", "fullName", "full_name");
  const company = stringField(body, "company", "companyName", "company_name");
  const email = stringField(body, "email");
  const phoneDetails = normalizeLeadPhone(body);
  const phone = phoneDetails?.full_phone_e164 ?? "";
  const country = stringField(body, "country", "destination", "destination_country");
  const productName = stringField(body, "product_name", "product", "productInterested");
  const quantity = stringField(body, "quantity");
  const incoterm = stringField(body, "incoterm");
  const sourceUrl = buildSourceUrl(req, body);
  const timestamp = buildTimestamp();
  const buyerMessage = stringField(body, "message", "notes");
  const leadId = randomUUID();
  const deliveryToken = randomUUID();

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
    const value =
      field === "product_name" ? productName :
      field === "name" ? name :
      field === "company" ? company :
      field === "email" ? email :
      field === "phone" ? phone :
      field === "country" ? country :
      field === "quantity" ? quantity :
      stringField(body, field);
    if (!String(value ?? "").trim()) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (!validateEmail(email)) {
    return NextResponse.json({ error: "Valid email address is required" }, { status: 400 });
  }

  if (!phoneDetails) {
    return NextResponse.json(
      { error: "Please enter a valid phone number for the selected country." },
      { status: 400 }
    );
  }

  const storedMessage = [
    buyerMessage,
    sourceUrl ? `Source URL: ${sourceUrl}` : "",
    `Timestamp: ${timestamp}`,
  ].filter(Boolean).join("\n\n");

  const baseInsert = {
    id: leadId,
    name,
    company,
    email,
    phone,
    country,
    product_name: productName,
    quantity,
    incoterm,
    message: storedMessage,
    product_id: body.product_id ?? null,
    status: "new",
    delivery_token: deliveryToken,
  };

  const initialEmailError = getLeadEmailConfigurationError();
  const emailStatusDefaults = {
    admin_email_sent: false,
    admin_email_error: initialEmailError,
    customer_auto_reply_sent: false,
    customer_auto_reply_error: initialEmailError,
  };

  const { error } = await supabase
    .from("inquiries")
    .insert({
      ...baseInsert,
      ...emailStatusDefaults,
      country_name: phoneDetails.country_name,
      country_code: phoneDetails.country_code,
      dial_code: phoneDetails.dial_code,
      local_phone: phoneDetails.local_phone,
      full_phone_e164: phoneDetails.full_phone_e164,
      whatsapp_number_e164: phoneDetails.whatsapp_number_e164,
    });

  if (error && /country_name|country_code|dial_code|local_phone|full_phone_e164|whatsapp_number_e164|admin_email_sent|customer_auto_reply_sent|delivery_token|schema cache/i.test(error.message)) {
    const fallbackInsert: Record<string, unknown> = { ...baseInsert };
    delete fallbackInsert.delivery_token;
    const fallback = await supabase.from("inquiries").insert(fallbackInsert);
    if (fallback.error) return NextResponse.json({ error: fallback.error.message }, { status: 400 });
  } else if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.log("Lead saved successfully", { leadId, kind: "inquiry" });

  const delivery = await sendLeadEmails({
    id: leadId,
    kind: "inquiry",
    name,
    company,
    email,
    phone,
    phoneDetails,
    country,
    product: productName,
    quantity,
    message: buyerMessage,
    sourceUrl,
    timestamp,
  });
  await updateLeadEmailStatus("inquiries", leadId, delivery, deliveryToken);

  return NextResponse.json({ success: true }, { status: 201 });
}
