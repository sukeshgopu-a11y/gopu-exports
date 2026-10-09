import { NextResponse } from "next/server";

// Diagnostic mail must never be triggered through a public HTTP endpoint.
export function GET() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}
