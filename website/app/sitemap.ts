import type { MetadataRoute } from "next";
import { getPublicProducts } from "@/lib/publicCatalogue";

import { getPublicBlogPosts } from "@/lib/blogStore";
import { CATEGORY_LANDING_PAGES } from "@/lib/categoryLandingPages";
import { EXPORT_OPERATION_PAGES } from "@/lib/exportOperationPages";


const BASE_URL = "https://gopuexports.com";
// Date of this reviewed content revision; never generated from request time.
const CONTENT_REVISED = "2026-09-16";

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

    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = EXPORT_OPERATION_PAGES.map((page) => ({
    url: `${BASE_URL}/resources/${page.slug}`,
    lastModified: ["export-enquiry-support", "bulk-orders", "global-supply-network"].includes(page.slug) ? CONTENT_REVISED : undefined,

    changeFrequency: "monthly",
    priority: 0.65,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_LANDING_PAGES.map((page) => ({
    url: `${BASE_URL}/export/${page.slug}`,
    lastModified: ["spice-powder-exporter-india", "spice-exporters-from-india", "agricultural-exporter-hyderabad-telangana", "apeda-products-exporters-india", "spice-board-products-exporters-india"].includes(page.slug) ? CONTENT_REVISED : undefined,

    changeFrequency: "monthly",
    priority: 0.75,
  }));

  const productRoutes: MetadataRoute.Sitemap = (await getPublicProducts()).map(product => ({
    url: BASE_URL + "/products/" + product.slug,
    lastModified: product.updatedAt && Date.parse(product.updatedAt) > Date.parse(CONTENT_REVISED) ? product.updatedAt : CONTENT_REVISED,
    changeFrequency: "weekly",
    priority: ["red-chilli", "turmeric-powder", "red-chilli-powder"].includes(product.slug) ? 0.9 : 0.7,
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
      lastModified: post.updatedAt || post.publishedAt || post.createdAt || undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...categoryRoutes, ...resourceRoutes, ...productRoutes, ...blogRoutes];
}

