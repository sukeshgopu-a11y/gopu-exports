import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { productBodyToRow, productToApi, type ProductRow } from "@/src/lib/supabase/data";
import { PRODUCTS } from "@/lib/products";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getServerReadClient() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) return createAdminClient();
  return createPublicClient();
}

function staticProducts(searchParams: URLSearchParams) {
  let products = PRODUCTS.map((product) => ({
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
  }));

  if (searchParams.get("featured") === "true") {
    products = products.filter((product) => product.featured);
  }
  if (searchParams.get("category")) {
    products = products.filter((product) => product.category === searchParams.get("category"));
  }

  const limit = Math.min(Number(searchParams.get("limit") ?? 250), 250);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  return products.slice(offset, offset + limit);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminClient = await requireAdminClient();
  const supabase = adminClient ?? getServerReadClient();

  let query = supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (!adminClient || searchParams.get("active") === "true") query = query.eq("is_active", true);
  if (searchParams.get("featured") === "true") query = query.eq("is_featured", true);
  if (searchParams.get("category")) query = query.eq("category", searchParams.get("category"));
  const limit = Math.min(Number(searchParams.get("limit") ?? 250), 250);
  const offset = Math.max(Number(searchParams.get("offset") ?? 0), 0);
  query = query.range(offset, offset + limit - 1);

  const { data, error } = await query.returns<ProductRow[]>();
  if (error) {
    if (adminClient) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(staticProducts(searchParams));
  }

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
