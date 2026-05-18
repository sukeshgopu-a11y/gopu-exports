import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { certificationBodyToRow, certificationToApi, type CertificationRow } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const supabase = (await requireAdminClient()) ?? createPublicClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true })
    .returns<CertificationRow[]>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(certificationToApi));
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("certifications")
    .insert(certificationBodyToRow(body))
    .select("*")
    .single<CertificationRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(certificationToApi(data), { status: 201 });
}
