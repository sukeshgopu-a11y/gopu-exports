import categoryEditorial from "@/lib/categoryEditorial.json";
import { PRODUCTS } from "@/lib/products";
import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import { slugify } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

async function getCategories() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "categories")
    .maybeSingle();
  if (error) throw new Error("Could not load categories");
  return Array.isArray(data?.value) ? data.value : [];
}

export async function GET() {
  const categories = await getCategories().catch(() => Array.from(new Set(PRODUCTS.map(product => product.category))).map(name => ({ name, slug: slugify(name), description: "", active: true })));
  return NextResponse.json(categories.map(category => ({ ...category, description: (categoryEditorial as Record<string, string>)[category.description] ?? category.description })));
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const category = {
    _id: crypto.randomUUID(),
    name: body.name,
    slug: body.slug || slugify(body.name),
    description: body.description ?? "",
    image: body.image ?? "",
    active: body.active ?? true,
    order: Number(body.order ?? 0),
  };
  const { error } = await supabase.rpc("mutate_category", { p_action: "create", p_id: category._id, p_body: category });
  if (error) return NextResponse.json({ error: "Category could not be saved" }, { status: 400 });
  revalidatePath("/products");
  return NextResponse.json(category, { status: 201 });
}
