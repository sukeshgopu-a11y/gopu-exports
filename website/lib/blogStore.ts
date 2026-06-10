import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { DEFAULT_BLOGS, type BlogFaq, type BlogSection } from "@/lib/blogs";
import { createAdminClient } from "@/src/lib/supabase/admin";
import { createPublicClient } from "@/src/lib/supabase/public";
import { slugify } from "@/src/lib/supabase/data";

export const BLOG_SETTINGS_KEY = "blogs";
export const BLOG_REVALIDATE_SECONDS = 30;
export const DEFAULT_BLOG_IMAGE = "/images/hero-export.webp";

export type BlogStorePost = {
  _id: string;
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
  sections?: BlogSection[];
  faqs?: BlogFaq[];
  [key: string]: unknown;
};

type BlogSettingsRead = {
  exists: boolean;
  posts: BlogStorePost[];
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
      const candidate = section as Record<string, unknown>;
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
      const candidate = faq as Record<string, unknown>;
      const question = cleanString(candidate.question);
      const answer = cleanString(candidate.answer);

      return question && answer ? { question, answer } : null;
    })
    .filter((faq): faq is BlogFaq => Boolean(faq));

  return faqs.length > 0 ? faqs : undefined;
}

function timestampValue(value: string) {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeBlogPost(input: Record<string, unknown>, fallbackIndex = 0): BlogStorePost {
  const now = new Date().toISOString();
  const title = cleanString(input.title, "Untitled Blog Post");
  const slug = slugify(cleanString(input.slug, title));
  const createdAt = cleanDate(input.createdAt, now);
  const excerpt = cleanString(input.excerpt);
  const metaTitle = cleanString(input.metaTitle, title);

  return {
    ...input,
    _id: cleanString(input._id, `blog-${slug || fallbackIndex}`),
    title,
    slug,
    excerpt,
    content: cleanString(input.content),
    image: cleanString(input.image, DEFAULT_BLOG_IMAGE),
    author: cleanString(input.author, "GOPU Exports"),
    tags: normalizeTags(input.tags),
    published: input.published === true || input.published === "true",
    metaTitle,
    metaDescription: cleanString(input.metaDescription, excerpt),
    createdAt,
    updatedAt: cleanDate(input.updatedAt, createdAt),
    sections: normalizeSections(input.sections),
    faqs: normalizeFaqs(input.faqs),
  };
}

async function readBlogSettings(): Promise<BlogSettingsRead> {
  const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY ? createAdminClient() : createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", BLOG_SETTINGS_KEY)
    .maybeSingle();

  if (error) {
    throw new Error(`Could not read blog settings: ${error.message}`);
  }

  const value = data?.value;
  const posts = Array.isArray(value)
    ? value.map((post, index) => normalizeBlogPost(post as Record<string, unknown>, index))
    : [];

  return {
    exists: Boolean(data),
    posts,
  };
}

function defaultBlogPosts() {
  return DEFAULT_BLOGS.map((post, index) => normalizeBlogPost(post as unknown as Record<string, unknown>, index));
}

export async function getDashboardBlogPosts() {
  const settings = await readBlogSettings();
  return settings.exists ? settings.posts : defaultBlogPosts();
}

export async function getPublicBlogPosts() {
  const settings = await readBlogSettings();
  const posts = settings.exists ? settings.posts : defaultBlogPosts();

  return posts
    .filter((post) => post.published)
    .sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
}

export async function getPublicBlogPostBySlug(slug: string) {
  const normalizedSlug = slugify(slug);
  const posts = await getPublicBlogPosts();
  return posts.find((post) => post.slug === normalizedSlug) ?? null;
}

export async function saveBlogPosts(supabase: SupabaseClient, posts: BlogStorePost[]) {
  const normalized = posts.map((post, index) => normalizeBlogPost(post, index));
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: BLOG_SETTINGS_KEY, value: normalized }, { onConflict: "key" });

  if (error) {
    throw new Error(`Could not save blog settings: ${error.message}`);
  }

  return normalized;
}

export function hasDuplicateSlug(posts: BlogStorePost[], slug: string, currentId?: string) {
  return posts.some((post) => post.slug === slug && post._id !== currentId);
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
