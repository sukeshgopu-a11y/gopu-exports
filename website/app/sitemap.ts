import type { MetadataRoute } from "next";
import { createPublicClient } from "@/src/lib/supabase/public";
import type { ProductRow } from "@/src/lib/supabase/data";
import { DEFAULT_BLOGS } from "@/lib/blogs";
import { CATEGORY_LANDING_PAGES } from "@/lib/categoryLandingPages";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n";

const BASE_URL = "https://gopuexports.com";

type BlogPost = { slug: string; published?: boolean; createdAt?: string };

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/products",
    "/markets",
    "/certifications",
    "/gallery",
    "/resources",
    "/blog",
    "/contact",
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const localizedRoutes: MetadataRoute.Sitemap = LOCALES.filter((locale) => locale.code !== DEFAULT_LOCALE).flatMap((locale) =>
    ["", "/products", "/blog", "/contact"].map((path) => ({
      url: `${BASE_URL}/${locale.code}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 0.55 : 0.45,
    }))
  );

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
  const { data: products } = await supabase
    .from("products")
    .select("slug,updated_at")
    .eq("is_active", true)
    .returns<Pick<ProductRow, "slug" | "updated_at">[]>();

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
    url: `${BASE_URL}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const { data: settings } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "blogs")
    .maybeSingle();
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

  return [...staticRoutes, ...localizedRoutes, ...categoryRoutes, ...resourceRoutes, ...productRoutes, ...blogRoutes];
}
