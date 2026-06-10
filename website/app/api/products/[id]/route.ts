import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { productBodyToUpdate, productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { PRODUCTS } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getServerReadClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return createAdminClient();
  return createPublicClient();
}

function staticProduct(id: string) {
  const product = PRODUCTS.find((item) => item.slug === id);
  if (!product) return null;
  return {
    ...product,
    _id: product.slug,
    id: product.slug,
    name: product.title,
    active: true,
    is_active: true,
    is_featured: Boolean(product.featured),
    featured: Boolean(product.featured),
    image_url: product.image,
    createdAt: "",
    updatedAt: "",
  };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminClient = await requireAdminClient();
  const supabase = getServerReadClient();
  const { id } = await params;

  let query = /^[0-9a-fA-F-]{36}$/.test(id)
    ? supabase.from("products").select("*").eq("id", id)
    : supabase.from("products").select("*").eq("slug", id);
  if (!adminClient) query = query.eq("is_active", true);

  const { data, error } = await query.maybeSingle<ProductRow>();

  if (error) {
    const fallback = staticProduct(id);
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    const fallback = staticProduct(id);
    if (fallback) return NextResponse.json(fallback);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
