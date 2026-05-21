import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_REPORT_BYTES = 16 * 1024;

export async function POST(req: Request) {
  const length = Number(req.headers.get("content-length") || 0);
  if (length > MAX_REPORT_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  try {
    const report = await req.json();
    console.warn("CSP report", {
      blockedUri: report?.["csp-report"]?.["blocked-uri"],
      violatedDirective: report?.["csp-report"]?.["violated-directive"],
      documentUri: report?.["csp-report"]?.["document-uri"],
    });
  } catch {
    // Ignore malformed browser reports. CSP reporting must not affect users.
  }

  return NextResponse.json({ ok: true });
}
