import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "@/src/lib/supabase/data";
import { DEFAULT_BLOGS } from "@/lib/blogs";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Blog = { _id: string; slug: string; published?: boolean; createdAt: string; [key: string]: unknown };

async function getBlogs(): Promise<Blog[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "blogs")
    .maybeSingle();
  const saved = Array.isArray(data?.value) ? data.value as Blog[] : [];
  return saved.length > 0 ? saved : DEFAULT_BLOGS;
}

async function saveBlogs(supabase: SupabaseClient, blogs: Blog[]) {
  await supabase.from("site_settings").upsert({ key: "blogs", value: blogs }, { onConflict: "key" });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let blogs = await getBlogs();
  if (searchParams.get("published") === "true") blogs = blogs.filter((blog) => blog.published);
  const res = NextResponse.json(blogs.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
  res.headers.set("Cache-Control", "no-store");
  return res;
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const body = await req.json();
  if (!body.title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const blog: Blog = {
    ...body,
    _id: crypto.randomUUID(),
    slug: body.slug || slugify(body.title),
    createdAt: new Date().toISOString(),
  };
  const blogs = await getBlogs();
  await saveBlogs(supabase, [blog, ...blogs]);
  revalidatePath("/blog");
  revalidatePath(`/blog/${blog.slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json(blog, { status: 201 });
}
