import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const { data: category, error } = await supabase.rpc("mutate_category", { p_action: "update", p_id: id, p_body: body });
  if (error) return NextResponse.json({ error: "Category could not be updated" }, { status: 400 });
  revalidatePath("/products");
  return NextResponse.json(category);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const { error } = await supabase.rpc("mutate_category", { p_action: "delete", p_id: id });
  if (error) return NextResponse.json({ error: "Category could not be deleted" }, { status: 400 });
  revalidatePath("/products");
  return NextResponse.json({ success: true });
}
