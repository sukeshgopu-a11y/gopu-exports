import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { certificationBodyToUpdate, certificationToApi, type CertificationRow } from "@/src/lib/supabase/data";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const { data, error } = await supabase
    .from("certifications")
    .update(certificationBodyToUpdate(body))
    .eq("id", id)
    .select("*")
    .single<CertificationRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/certifications");
  revalidatePath("/sitemap.xml");
  return NextResponse.json(certificationToApi(data));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const { error } = await supabase.from("certifications").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/certifications");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ success: true });
}
