import { consumeRateLimit } from "@/lib/rateLimit";
import { readBoundedJson } from "@/lib/requestBody";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_REPORT_BYTES = 16 * 1024;

export async function POST(req: Request) {
  try {
    if (!(await consumeRateLimit(req, "csp", 30, 60))) return new Response(null, { status: 429 });
  } catch { return new Response(null, { status: 204 }); }
  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_REPORT_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  try {
    const report = await readBoundedJson(req, MAX_REPORT_BYTES) as Record<string, Record<string, unknown>>;
    console.warn("CSP report", {
      blockedUri: report?.["csp-report"]?.["blocked-uri"],
      violatedDirective: report?.["csp-report"]?.["violated-directive"],

    });
  } catch {
    // Ignore malformed browser reports. CSP reporting must not affect users.
  }

  return NextResponse.json({ ok: true });
}
