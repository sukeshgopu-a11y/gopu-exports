import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Request an Export Quote",
  description:
    "Contact GOPU Exports for Indian agricultural export enquiries, product quotations, buyer-specific packing, export documentation and company verification.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
