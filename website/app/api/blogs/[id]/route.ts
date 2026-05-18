import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

type Blog = { _id: string; slug: string; [key: string]: unknown };

async function getBlogs(): Promise<Blog[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "blogs")
    .maybeSingle();
  return Array.isArray(data?.value) ? data.value as Blog[] : [];
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
  return NextResponse.json({ success: true });
}
