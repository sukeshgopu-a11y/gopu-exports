import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_BLOGS } from "@/lib/blogs";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Blog = { _id: string; slug: string; [key: string]: unknown };

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const blog = (await getBlogs()).find((item) => item._id === id || item.slug === id);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(blog);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  const body = await req.json();
  const blogs = await getBlogs();
  const updated = blogs.map((blog) => (blog._id === id ? { ...blog, ...body } : blog));
  await saveBlogs(supabase, updated);
  const blog = updated.find((item) => item._id === id);
  if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/blog");
  revalidatePath(`/blog/${blog.slug}`);
  revalidatePath("/sitemap.xml");
  return NextResponse.json(blog);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();
  const { id } = await params;
  await saveBlogs(supabase, (await getBlogs()).filter((blog) => blog._id !== id));
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ success: true });
}
