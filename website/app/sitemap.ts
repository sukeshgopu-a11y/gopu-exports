import type { MetadataRoute } from "next";
import { createPublicClient } from "@/src/lib/supabase/public";
import type { ProductRow } from "@/src/lib/supabase/data";
import { DEFAULT_BLOGS } from "@/lib/blogs";
import { CATEGORY_LANDING_PAGES } from "@/lib/categoryLandingPages";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";
import { PRODUCTS } from "@/lib/products";

const BASE_URL = "https://gopuexports.com";

type BlogPost = { slug: string; published?: boolean; createdAt?: string };

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
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = EXPORT_OPERATION_PAGES.map((page) => ({
    url: `${BASE_URL}/resources/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_LANDING_PAGES.map((page) => ({
    url: `${BASE_URL}/export/${page.slug}`,
    lastModified: new Date(),
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
    : PRODUCTS.map((product) => ({ slug: product.slug, updated_at: new Date().toISOString() }));

  const productRoutes: MetadataRoute.Sitemap = productSource.map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  let settings: { value: unknown } | null = null;
  try {
    const { data } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "blogs")
      .maybeSingle();
    settings = data;
  } catch {
    settings = null;
  }
  const savedPosts = Array.isArray(settings?.value) ? (settings.value as BlogPost[]) : [];
  const posts = savedPosts.length > 0 ? savedPosts : DEFAULT_BLOGS;
  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...categoryRoutes, ...resourceRoutes, ...productRoutes, ...blogRoutes];
}
