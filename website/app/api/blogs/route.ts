import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import { createPublicClient } from "@/src/lib/supabase/public";
import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "@/src/lib/supabase/data";
import { NextRequest, NextResponse } from "next/server";

type Blog = { _id: string; slug: string; published?: boolean; createdAt: string; [key: string]: unknown };

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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let blogs = await getBlogs();
  if (searchParams.get("published") === "true") blogs = blogs.filter((blog) => blog.published);
  return NextResponse.json(blogs.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)));
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
  return NextResponse.json(blog, { status: 201 });
}
