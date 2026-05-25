import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact GOPU Exports",
  description:
    "Contact GOPU Exports for Indian agricultural export enquiries, product sourcing, quotations, documentation support, and buyer verification requests.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
