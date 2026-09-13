import { publicMetadata } from "@/lib/seo";
import ContactPageClient from "./ContactPageClient";

export const metadata = publicMetadata(
  "Request an Export Quote from India",
  "International importers and distributors: request a quote for Indian spices, rice and agricultural products. Share your quantity, packing and destination.",
  "/contact",
);

export default function ContactPage() {
  return <ContactPageClient />;
}

