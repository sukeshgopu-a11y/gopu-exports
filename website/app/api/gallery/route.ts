import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export type GalleryImage = {
  id: string;
  title: string | null;
  alt_text: string | null;
  image_url: string;
  storage_path: string | null;
  bucket: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export async function GET(req: NextRequest) {
  const supabase = (await requireAdminClient()) ?? createPublicClient();
  const { searchParams } = new URL(req.url);

  let query = supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (searchParams.get("active") === "true") query = query.eq("is_active", true);

  const { data, error } = await query.returns<GalleryImage[]>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const res = NextResponse.json(data ?? []);
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const body = await req.json();
  if (!body.image_url) {
    return NextResponse.json({ error: "image_url is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("gallery_images")
    .insert({
      title: body.title ?? null,
      alt_text: body.alt_text ?? body.title ?? null,
      image_url: body.image_url,
      storage_path: body.storage_path ?? null,
      bucket: body.bucket ?? "gallery",
      is_active: body.is_active ?? body.active ?? true,
      sort_order: Number(body.sort_order ?? body.order ?? 0),
    })
    .select("*")
    .single<GalleryImage>();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/gallery");
  revalidatePath("/sitemap.xml");
  return NextResponse.json(data, { status: 201 });
}
