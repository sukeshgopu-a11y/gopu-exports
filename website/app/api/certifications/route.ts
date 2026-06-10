import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { certificationBodyToRow, certificationToApi, type CertificationRow } from "@/src/lib/supabase/data";
import { COMPANY } from "@/lib/company";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getServerReadClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return createAdminClient();
  return createPublicClient();
}

function fallbackCertifications(searchParams: URLSearchParams) {
  const items = COMPANY.pendingCertifications.map((item, index) => ({
    _id: item.label,
    id: item.label,
    name: item.label,
    issuer: item.value,
    logo: "",
    logo_url: "",
    description: item.status,
    active: true,
    is_active: true,
    order: index,
    sort_order: index,
    createdAt: "",
    updatedAt: "",
  }));
  const limit = Math.min(Number(searchParams.get("limit") ?? 250), 250);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  return items.slice(offset, offset + limit);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminClient = await requireAdminClient();
  const supabase = adminClient ?? getServerReadClient();
  let query = supabase
    .from("certifications")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (!adminClient || searchParams.get("active") === "true") query = query.eq("is_active", true);
  const limit = Math.min(Number(searchParams.get("limit") ?? 250), 250);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query.returns<CertificationRow[]>();
  if (error) {
    if (adminClient) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(fallbackCertifications(searchParams));
  }
  const res = NextResponse.json((data ?? []).map(certificationToApi));
  res.headers.set("Cache-Control", "no-store");
  return res;
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
  revalidatePath("/");
  revalidatePath("/certifications");
  revalidatePath("/sitemap.xml");
  return NextResponse.json(certificationToApi(data), { status: 201 });
}
