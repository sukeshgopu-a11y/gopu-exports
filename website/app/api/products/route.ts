import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productBodyToRow, productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const supabase = (await requireAdminClient()) ?? createPublicClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (searchParams.get("active") === "true") query = query.eq("is_active", true);
  if (searchParams.get("featured") === "true") query = query.eq("is_featured", true);
  if (searchParams.get("category")) query = query.eq("category", searchParams.get("category"));
  if (searchParams.get("limit")) query = query.limit(Math.min(Number(searchParams.get("limit")), 250));

  const { data, error } = await query.returns<ProductRow[]>();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const res = NextResponse.json((data ?? []).map(productToApi));
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  const body = await req.json();
  if (!body.title && !body.name) {
    return NextResponse.json(
      { error: "name is required" },
      { status: 400 }
    );
  }

  if (!body.category) {
    return NextResponse.json({ error: "category is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .insert(productBodyToRow(body))
    .select("*")
    .single<ProductRow>();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${data.slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json(productToApi(data), { status: 201 });
}
