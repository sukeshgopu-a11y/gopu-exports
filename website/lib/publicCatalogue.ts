import "server-only";
import { cache } from "react";
import { PRODUCTS, type Product } from "./products";
import { cleanPublicProduct } from "./publicProductCopy";
import { createPublicClient } from "@/src/lib/supabase/public";
import { productToApi, type ProductRow } from "@/src/lib/supabase/data";

export type PublicProduct = Pick<Product, "slug" | "title" | "category" | "image"> & Partial<Product> & { _id: string; updatedAt?: string; metaTitle?: string; metaDescription?: string; exportCountries?: string[]; exportPorts?: string[]; containerCapacity?: string; certifications?: string[] };
export const getPublicProducts = cache(async (): Promise<PublicProduct[]> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return PRODUCTS.map(product => cleanPublicProduct({ ...product, _id: product.slug }));
  }
  try {
    const { data, error } = await createPublicClient().from("products").select("*").eq("is_active", true).order("sort_order", { ascending: true }).returns<ProductRow[]>();
    if (error) throw new Error("Public catalogue unavailable");
    // A successful empty response is authoritative: do not resurrect deactivated products.
    return (data ?? []).map(row => cleanPublicProduct(productToApi(row) as PublicProduct));
  } catch {
    // Preview builds and temporary read failures use versioned, reviewed public content only.
    return PRODUCTS.map(product => cleanPublicProduct({ ...product, _id: product.slug }));
  }
});
