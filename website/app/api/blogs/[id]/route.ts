import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import {
  getDashboardBlogPosts,
  hasDuplicateSlug,
  normalizeBlogPost,
  revalidateBlogPaths,
  saveBlogPosts,
} from "@/lib/blogStore";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = (await getDashboardBlogPosts()).find((item) => item._id === id || item.slug === id);
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const res = NextResponse.json(blog);
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (error) {
    console.error("Blog detail load failed", error);
    return NextResponse.json({ error: "Unable to load blog post." }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid blog payload." }, { status: 400 });
    }

    const blogs = await getDashboardBlogPosts();
    const index = blogs.findIndex((blog) => blog._id === id || blog.slug === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const current = blogs[index];
    const blog = normalizeBlogPost({
      ...current,
      ...(body as Record<string, unknown>),
      _id: current._id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    });

    if (hasDuplicateSlug(blogs, blog.slug, current._id)) {
      return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 409 });
    }

    const updated = blogs.map((item, itemIndex) => (itemIndex === index ? blog : item));
    await saveBlogPosts(supabase, updated);
    revalidateBlogPaths(blog.slug, current.slug);
    return NextResponse.json(blog);
  } catch (error) {
    console.error("Blog update failed", error);
    return NextResponse.json({ error: "Unable to update blog post." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  try {
    const { id } = await params;
    const blogs = await getDashboardBlogPosts();
    const blog = blogs.find((item) => item._id === id || item.slug === id);
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await saveBlogPosts(
      supabase,
      blogs.filter((item) => item._id !== blog._id)
    );
    revalidateBlogPaths(undefined, blog.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog delete failed", error);
    return NextResponse.json({ error: "Unable to delete blog post." }, { status: 500 });
  }
}
