import type { MetadataRoute } from "next";
import { createPublicClient } from "@/src/lib/supabase/public";
import type { ProductRow } from "@/src/lib/supabase/data";
import { getPublicBlogPosts } from "@/lib/blogStore";
import { CATEGORY_LANDING_PAGES } from "@/lib/categoryLandingPages";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";
import { PRODUCTS } from "@/lib/products";

const BASE_URL = "https://gopuexports.com";
const STATIC_LAST_MODIFIED = new Date("2026-06-10T00:00:00.000Z");

export const revalidate = 30;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/products",
    "/markets",
    "/certifications",
    "/company-verification",
    "/gallery",
    "/resources",
    "/blog",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cookie-policy",
    "/shipping-policy",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = EXPORT_OPERATION_PAGES.map((page) => ({
    url: `${BASE_URL}/resources/${page.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_LANDING_PAGES.map((page) => ({
    url: `${BASE_URL}/export/${page.slug}`,
    lastModified: STATIC_LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const supabase = createPublicClient();
  let products: Pick<ProductRow, "slug" | "updated_at">[] = [];
  try {
    const { data } = await supabase
      .from("products")
      .select("slug,updated_at")
      .eq("is_active", true)
      .returns<Pick<ProductRow, "slug" | "updated_at">[]>();
    products = data ?? [];
  } catch {
    products = [];
  }

  const productSource = products.length > 0
    ? products
    : PRODUCTS.map((product) => ({ slug: product.slug, updated_at: STATIC_LAST_MODIFIED.toISOString() }));

  const productRoutes: MetadataRoute.Sitemap = productSource.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : STATIC_LAST_MODIFIED,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let posts: Awaited<ReturnType<typeof getPublicBlogPosts>> = [];
  try {
    posts = await getPublicBlogPosts();
  } catch {
    posts = [];
  }
  const blogRoutes: MetadataRoute.Sitemap = posts
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.createdAt ? new Date(post.createdAt) : STATIC_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...categoryRoutes, ...resourceRoutes, ...productRoutes, ...blogRoutes];
}
