import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { inquiryToApi, toDbStatus, type InquiryRow } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const update = {
    ...("status" in body ? { status: toDbStatus(body.status) } : {}),
    ...("message" in body || "notes" in body ? { message: body.message ?? body.notes } : {}),
    ...("adminNotes" in body || "admin_notes" in body ? { admin_notes: body.admin_notes ?? body.adminNotes ?? "" } : {}),
  };
  const { data, error } = await supabase
    .from("inquiries")
    .update(update)
    .eq("id", id)
    .select("*")
    .single<InquiryRow>();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(inquiryToApi(data));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const { error } = await supabase.from("inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
