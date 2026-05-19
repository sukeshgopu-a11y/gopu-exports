import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
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
  const body = await req.json().catch(() => null);
  if (!body || !ALLOWED_EVENTS.has(String(body.event_type))) {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  }

  const supabase = createPublicClient();
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

export async function GET(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 500), 1000);
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data, error } = await supabase
    .from("visitor_events")
    .select("id,event_type,session_id,path,referrer,country,city,device,browser,metadata,created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Analytics summary failed", error.message);
    return NextResponse.json({ error: "Unable to load analytics." }, { status: 500 });
  }

  const events = data ?? [];
  const uniqueVisitors = new Set(events.map((event) => event.session_id).filter(Boolean)).size;
  const sessionDurations = events
    .filter((event) => event.event_type === "session_duration")
    .map((event) => Number((event.metadata as { seconds?: unknown } | null)?.seconds ?? 0))
    .filter((seconds) => Number.isFinite(seconds) && seconds > 0);
  const scrollDepths = events
    .filter((event) => event.event_type === "scroll_depth")
    .map((event) => Number((event.metadata as { depth?: unknown } | null)?.depth ?? 0))
    .filter((depth) => Number.isFinite(depth) && depth > 0);
  const countBy = (key: "path" | "country" | "device" | "browser" | "event_type") => {
    const counts = new Map<string, number>();
    for (const event of events) {
      const value = String(event[key] ?? "Unknown").trim() || "Unknown";
      counts.set(value, (counts.get(value) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  return NextResponse.json({
    stats: {
      events: events.length,
      uniqueVisitors,
      pageViews: events.filter((event) => event.event_type === "page_view").length,
      leads: events.filter((event) => ["inquiry_submit", "quote_submit", "whatsapp_click", "email_click"].includes(event.event_type)).length,
      avgSessionSeconds: sessionDurations.length > 0 ? Math.round(sessionDurations.reduce((sum, value) => sum + value, 0) / sessionDurations.length) : 0,
      maxScrollDepth: scrollDepths.length > 0 ? Math.max(...scrollDepths) : 0,
    },
    topPages: countBy("path"),
    countries: countBy("country"),
    devices: countBy("device"),
    browsers: countBy("browser"),
    eventsByType: countBy("event_type"),
    recent: events.slice(0, 30),
  });
}
