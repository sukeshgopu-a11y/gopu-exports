import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productBodyToUpdate, productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = createPublicClient();
  const { id } = await params;

  const query = /^[0-9a-fA-F-]{36}$/.test(id)
    ? supabase.from("products").select("*").eq("id", id)
    : supabase.from("products").select("*").eq("slug", id);

  const { data, error } = await query.maybeSingle<ProductRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const res = NextResponse.json(productToApi(data));
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const { data, error } = await supabase
    .from("products")
    .update(productBodyToUpdate(body))
    .eq("id", id)
    .select("*")
    .single<ProductRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${data.slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json(productToApi(data));
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ success: true });
}
