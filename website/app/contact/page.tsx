import { publicMetadata } from "@/lib/seo";
import ContactPageClient from "./ContactPageClient";

export const metadata = publicMetadata(
  "Request an Export Quote from India",
  "International importers and distributors: request a quote for Indian spices, rice and agricultural products. Share your quantity, packing and destination.",
  "/contact",
);

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string; catalogue?: string }> }) {
  const params = await searchParams;
  return <ContactPageClient initialProduct={typeof params.product === "string" ? params.product.slice(0, 200) : ""} catalogue={Boolean(params.catalogue)} />;
}
