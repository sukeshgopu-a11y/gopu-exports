import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { quoteToApi, toDbStatus, type QuoteRow } from "@/src/lib/supabase/data";
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
  };

  const { data, error } = await supabase
    .from("quotes")
    .update(update)
    .eq("id", id)
    .select("*")
    .single<QuoteRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(quoteToApi(data));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const { error } = await supabase.from("quotes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
