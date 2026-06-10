import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import {
  getDashboardBlogPost,
  hasDuplicateSlug,
  normalizeBlogPost,
  revalidateBlogPaths,
  softDeleteBlogPost,
  updateBlogPost,
} from "@/lib/blogStore";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  try {
    const { id } = await params;
    const blog = await getDashboardBlogPost(supabase, id);
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

    const current = await getDashboardBlogPost(supabase, id);
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const blog = normalizeBlogPost({
      ...current,
      ...(body as Record<string, unknown>),
      _id: current._id,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
    });

    console.info("Blog update request", { id: current._id, slug: blog.slug, published: blog.published });

    if (await hasDuplicateSlug(supabase, blog.slug, current._id)) {
      return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 409 });
    }

    const updated = await updateBlogPost(supabase, id, body as Record<string, unknown>);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    console.info("Blog updated", {
      id: updated.post._id,
      slug: updated.post.slug,
      published: updated.post.published,
    });
    revalidateBlogPaths(updated.post.slug, updated.previousSlug);
    return NextResponse.json(updated.post);
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
    const blog = await softDeleteBlogPost(supabase, id);
    if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });

    console.info("Blog soft deleted", { id: blog._id, slug: blog.slug });
    revalidateBlogPaths(undefined, blog.slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog delete failed", error);
    return NextResponse.json({ error: "Unable to delete blog post." }, { status: 500 });
  }
}
