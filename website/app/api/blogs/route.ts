import { requireAdminClient, unauthorized } from "@/lib/adminAuth";
import {
  createBlogPost,
  getDashboardBlogPosts,
  getPublicBlogPosts,
  hasDuplicateSlug,
  normalizeBlogPost,
  revalidateBlogPaths,
} from "@/lib/blogStore";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blogs = searchParams.get("published") === "true"
      ? await getPublicBlogPosts()
      : await (async () => {
          const supabase = await requireAdminClient();
          if (!supabase) return null;
          return getDashboardBlogPosts(supabase);
        })();

    if (!blogs) return unauthorized();

    const res = NextResponse.json(blogs);
    res.headers.set("Cache-Control", "no-store");
    return res;
  } catch (error) {
    console.error("Blog list failed", error);
    return NextResponse.json({ error: "Unable to load blog posts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const supabase = await requireAdminClient();
  if (!supabase) return unauthorized();

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid blog payload." }, { status: 400 });
    }

    if (typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const blog = normalizeBlogPost({
      ...(body as Record<string, unknown>),
      createdAt: now,
      updatedAt: now,
    });

    console.info("Blog create request", { slug: blog.slug, published: blog.published });

    if (await hasDuplicateSlug(supabase, blog.slug)) {
      return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 409 });
    }

    const created = await createBlogPost(supabase, {
      ...(body as Record<string, unknown>),
      createdAt: now,
      updatedAt: now,
    });
    console.info("Blog created", { id: created._id, slug: created.slug, published: created.published });
    revalidateBlogPaths(created.slug);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Blog create failed", error);
    return NextResponse.json({ error: "Unable to create blog post." }, { status: 500 });
  }
}
