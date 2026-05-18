import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
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
  const update = {
    ...("title" in body ? { title: body.title } : {}),
    ...("alt_text" in body ? { alt_text: body.alt_text } : {}),
    ...("image_url" in body ? { image_url: body.image_url } : {}),
    ...("is_active" in body ? { is_active: body.is_active } : {}),
    ...("active" in body ? { is_active: body.active } : {}),
    ...("sort_order" in body ? { sort_order: Number(body.sort_order) } : {}),
  };

  const { data, error } = await supabase
    .from("gallery_images")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/gallery");
  revalidatePath("/sitemap.xml");
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const { id } = await params;
  const { data: image } = await supabase
    .from("gallery_images")
    .select("bucket, storage_path")
    .eq("id", id)
    .maybeSingle<{ bucket: string; storage_path: string | null }>();

  if (image?.storage_path) {
    await supabase.storage.from(image.bucket).remove([image.storage_path]);
  }

  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/gallery");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ success: true });
}
