import { readBoundedJson } from "@/lib/requestBody";
import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { consumeRateLimit } from "@/lib/rateLimit";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "product_view",
  "cta_click",
  "whatsapp_click",
  "email_click",
  "phone_click",
  "inquiry_submit",
  "quote_submit",
  "scroll_depth",
  "session_duration",
]);

function cleanText(value: unknown, max = 240) {
  return String(value ?? "").trim().slice(0, max);
}

function cleanMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 20);
  return Object.fromEntries(entries.map(([key, val]) => [key.slice(0, 60), cleanText(val, 300)]));
}

export async function POST(req: NextRequest) {
  const body = await readBoundedJson(req, 8192).catch(() => null) as Record<string, unknown> | null;
  if (!body || !ALLOWED_EVENTS.has(String(body.event_type))) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json({ success: false, disabled: true }, { status: 202 });
  }

  try {
    if (!(await consumeRateLimit(req, "analytics", 120, 60))) return NextResponse.json({ success: false }, { status: 429 });
  } catch { return NextResponse.json({ success: false }, { status: 503 }); }
  const supabase = createAdminClient();
  const country = cleanText(req.headers.get("x-vercel-ip-country"), 4);
  const city = cleanText(req.headers.get("x-vercel-ip-city"), 120);

  const { error } = await supabase.from("visitor_events").insert({
    event_type: cleanText(body.event_type, 40),
    session_id: cleanText(body.session_id, 80),
    path: cleanText(body.path, 400),
    referrer: cleanText(body.referrer, 400),
    country: country || null,
    city: city || null,
    device: cleanText(body.device, 40),
    browser: cleanText(body.browser, 80),
    metadata: cleanMetadata(body.metadata),
  });

  if (error) {
    console.error("Analytics event insert failed", error.message);
    return NextResponse.json({ success: false }, { status: 202 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function GET() {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const { data, error } = await supabase.rpc("analytics_summary", { p_since: since.toISOString() });
  if (error) return NextResponse.json({ error: "Unable to load analytics." }, { status: 500 });
  return NextResponse.json({ topPages: [], countries: [], devices: [], browsers: [], eventsByType: [], ...data });
}
