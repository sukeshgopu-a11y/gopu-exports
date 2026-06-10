import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import type { BlogFaq, BlogSection } from "@/lib/blogs";
import { createPublicClient } from "@/src/lib/supabase/public";
import { slugify } from "@/src/lib/supabase/data";

export const BLOG_REVALIDATE_SECONDS = 30;
export const DEFAULT_BLOG_IMAGE = "/images/hero-export.webp";

type JsonRecord = Record<string, unknown>;

type BlogPostRow = {
  id: string;
  legacy_id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  author: string;
  tags: string[] | null;
  meta_title: string;
  meta_description: string;
  sections: unknown;
  faqs: unknown;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type BlogStorePost = {
  _id: string;
  id: string;
  legacyId?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  tags: string[];
  published: boolean;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  deletedAt?: string;
  sections?: BlogSection[];
  faqs?: BlogFaq[];
  [key: string]: unknown;
};

function cleanString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanDate(value: unknown, fallback: string) {
  const input = cleanString(value);
  return input && Number.isFinite(Date.parse(input)) ? input : fallback;
}

function normalizeTags(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((tag) => cleanString(tag)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
}

function normalizeSections(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const sections = value
    .map((section) => {
      if (!section || typeof section !== "object") return null;
      const candidate = section as JsonRecord;
      const heading = cleanString(candidate.heading);
      const body = Array.isArray(candidate.body)
        ? candidate.body.map((paragraph) => cleanString(paragraph)).filter(Boolean)
        : [];

      return heading && body.length > 0 ? { heading, body } : null;
    })
    .filter((section): section is BlogSection => Boolean(section));

  return sections.length > 0 ? sections : undefined;
}

function normalizeFaqs(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const faqs = value
    .map((faq) => {
      if (!faq || typeof faq !== "object") return null;
      const candidate = faq as JsonRecord;
      const question = cleanString(candidate.question);
      const answer = cleanString(candidate.answer);

      return question && answer ? { question, answer } : null;
    })
    .filter((faq): faq is BlogFaq => Boolean(faq));

  return faqs.length > 0 ? faqs : undefined;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function rowToBlogPost(row: BlogPostRow): BlogStorePost {
  const createdAt = cleanDate(row.created_at, new Date().toISOString());
  const updatedAt = cleanDate(row.updated_at, createdAt);
  const excerpt = cleanString(row.excerpt);
  const metaTitle = cleanString(row.meta_title, row.title);

  return {
    _id: row.id,
    id: row.id,
    legacyId: row.legacy_id ?? undefined,
    title: cleanString(row.title, "Untitled Blog Post"),
    slug: slugify(cleanString(row.slug, row.title)),
    excerpt,
    content: cleanString(row.content),
    image: cleanString(row.image_url, DEFAULT_BLOG_IMAGE),
    author: cleanString(row.author, "GOPU Exports"),
    tags: normalizeTags(row.tags),
    published: Boolean(row.published),
    metaTitle,
    metaDescription: cleanString(row.meta_description, excerpt),
    createdAt,
    updatedAt,
    publishedAt: row.published_at ?? undefined,
    deletedAt: row.deleted_at ?? undefined,
    sections: normalizeSections(row.sections),
    faqs: normalizeFaqs(row.faqs),
  };
}

export function normalizeBlogPost(input: JsonRecord, fallbackIndex = 0): BlogStorePost {
  const now = new Date().toISOString();
  const title = cleanString(input.title, "Untitled Blog Post");
  const slug = slugify(cleanString(input.slug, title));
  const createdAt = cleanDate(input.createdAt ?? input.created_at, now);
  const excerpt = cleanString(input.excerpt);
  const metaTitle = cleanString(input.metaTitle ?? input.meta_title, title);
  const id = cleanString(input._id ?? input.id, `blog-${slug || fallbackIndex}`);

  return {
    ...input,
    _id: id,
    id,
    legacyId: cleanString(input.legacyId ?? input.legacy_id) || undefined,
    title,
    slug,
    excerpt,
    content: cleanString(input.content),
    image: cleanString(input.image ?? input.image_url, DEFAULT_BLOG_IMAGE),
    author: cleanString(input.author, "GOPU Exports"),
    tags: normalizeTags(input.tags),
    published: input.published === true || input.published === "true",
    metaTitle,
    metaDescription: cleanString(input.metaDescription ?? input.meta_description, excerpt),
    createdAt,
    updatedAt: cleanDate(input.updatedAt ?? input.updated_at, createdAt),
    publishedAt: cleanString(input.publishedAt ?? input.published_at) || undefined,
    deletedAt: cleanString(input.deletedAt ?? input.deleted_at) || undefined,
    sections: normalizeSections(input.sections),
    faqs: normalizeFaqs(input.faqs),
  };
}

function mutationToRow(input: JsonRecord, existing?: BlogPostRow) {
  const existingPost = existing ? rowToBlogPost(existing) : undefined;
  const now = new Date().toISOString();
  const post = normalizeBlogPost({
    ...(existingPost ?? {}),
    ...input,
    _id: existingPost?._id ?? input._id,
    createdAt: existingPost?.createdAt ?? input.createdAt,
    updatedAt: now,
  });

  const publishedAt = post.published
    ? existing?.published_at ?? cleanDate(input.publishedAt ?? input.published_at, now)
    : null;

  const legacyId = existing?.legacy_id ?? (cleanString(input.legacyId ?? input.legacy_id) || null);

  return {
    legacy_id: legacyId,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    image_url: post.image || DEFAULT_BLOG_IMAGE,
    author: post.author,
    tags: post.tags,
    meta_title: post.metaTitle,
    meta_description: post.metaDescription,
    sections: post.sections ?? null,
    faqs: post.faqs ?? null,
    published: post.published,
    published_at: publishedAt,
    updated_at: now,
  };
}

function assertBlogTableError(error: { message: string } | null, action: string) {
  if (error) {
    throw new Error(`Could not ${action}: ${error.message}`);
  }
}

export async function getDashboardBlogPosts(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  assertBlogTableError(error, "read dashboard blog posts");
  return ((data ?? []) as BlogPostRow[]).map(rowToBlogPost);
}

export async function getPublicBlogPosts() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .is("deleted_at", null)
    .eq("published", true)
    .order("published_at", { ascending: false })
    .order("created_at", { ascending: false });

  assertBlogTableError(error, "read public blog posts");
  return ((data ?? []) as BlogPostRow[]).map(rowToBlogPost);
}

export async function getPublicBlogPostBySlug(slug: string) {
  const supabase = createPublicClient();
  const normalizedSlug = slugify(slug);
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .is("deleted_at", null)
    .eq("published", true)
    .eq("slug", normalizedSlug)
    .maybeSingle();

  assertBlogTableError(error, "read public blog post");
  return data ? rowToBlogPost(data as BlogPostRow) : null;
}

export async function getDashboardBlogPost(supabase: SupabaseClient, identifier: string) {
  const cleaned = cleanString(identifier);
  if (!cleaned) return null;

  if (isUuid(cleaned)) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .is("deleted_at", null)
      .eq("id", cleaned)
      .maybeSingle();

    assertBlogTableError(error, "read dashboard blog post");
    return data ? rowToBlogPost(data as BlogPostRow) : null;
  }

  const normalizedSlug = slugify(cleaned);
  if (normalizedSlug) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .is("deleted_at", null)
      .eq("slug", normalizedSlug)
      .maybeSingle();

    assertBlogTableError(error, "read dashboard blog post");
    if (data) return rowToBlogPost(data as BlogPostRow);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .is("deleted_at", null)
    .eq("legacy_id", cleaned)
    .maybeSingle();

  assertBlogTableError(error, "read dashboard blog post");
  return data ? rowToBlogPost(data as BlogPostRow) : null;
}

async function getDashboardBlogPostRow(supabase: SupabaseClient, identifier: string) {
  const cleaned = cleanString(identifier);
  if (!cleaned) return null;

  if (isUuid(cleaned)) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .is("deleted_at", null)
      .eq("id", cleaned)
      .maybeSingle();

    assertBlogTableError(error, "read dashboard blog post row");
    return (data as BlogPostRow | null) ?? null;
  }

  const normalizedSlug = slugify(cleaned);
  if (normalizedSlug) {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .is("deleted_at", null)
      .eq("slug", normalizedSlug)
      .maybeSingle();

    assertBlogTableError(error, "read dashboard blog post row");
    if (data) return data as BlogPostRow;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .is("deleted_at", null)
    .eq("legacy_id", cleaned)
    .maybeSingle();

  assertBlogTableError(error, "read dashboard blog post row");
  return (data as BlogPostRow | null) ?? null;
}

export async function hasDuplicateSlug(supabase: SupabaseClient, slug: string, currentId?: string) {
  const normalizedSlug = slugify(slug);
  if (!normalizedSlug) return false;

  let query = supabase
    .from("blog_posts")
    .select("id")
    .is("deleted_at", null)
    .eq("slug", normalizedSlug)
    .limit(1);

  if (currentId && isUuid(currentId)) {
    query = query.neq("id", currentId);
  }

  const { data, error } = await query;
  assertBlogTableError(error, "check duplicate blog slug");
  return Boolean(data?.length);
}

export async function createBlogPost(supabase: SupabaseClient, input: JsonRecord) {
  const payload = mutationToRow(input);
  const createdAt = cleanDate(input.createdAt ?? input.created_at, new Date().toISOString());

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...payload, created_at: createdAt })
    .select("*")
    .single();

  assertBlogTableError(error, "create blog post");
  return rowToBlogPost(data as BlogPostRow);
}

export async function updateBlogPost(supabase: SupabaseClient, identifier: string, input: JsonRecord) {
  const current = await getDashboardBlogPostRow(supabase, identifier);
  if (!current) return null;

  const payload = mutationToRow(input, current);
  const { data, error } = await supabase
    .from("blog_posts")
    .update(payload)
    .eq("id", current.id)
    .select("*")
    .single();

  assertBlogTableError(error, "update blog post");
  return {
    previousSlug: current.slug,
    post: rowToBlogPost(data as BlogPostRow),
  };
}

export async function softDeleteBlogPost(supabase: SupabaseClient, identifier: string) {
  const current = await getDashboardBlogPostRow(supabase, identifier);
  if (!current) return null;

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("blog_posts")
    .update({ deleted_at: now, published: false, updated_at: now })
    .eq("id", current.id);

  assertBlogTableError(error, "soft delete blog post");
  return rowToBlogPost({ ...current, deleted_at: now, published: false, updated_at: now });
}

export function revalidateBlogPaths(slug?: string, previousSlug?: string) {
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}
