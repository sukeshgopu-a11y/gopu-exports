import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: {
    default: "GOPU Exports | Indian Agricultural & Spice Exporter",
    template: "%s | GOPU Exports",
  },
  description:
    "GOPU Exports is a Hyderabad-based Indian agricultural export company supplying spices, rice and selected food products to international importers, distributors and B2B buyers.",
  metadataBase: new URL("https://gopuexports.com"),
  icons: {
    icon: [
      { url: "/favicon.ico?v=4" },
      { url: "/icon.png?v=4", type: "image/png", sizes: "512x512" },
    ],
    shortcut: [{ url: "/favicon.ico?v=4" }],
    apple: [{ url: "/apple-touch-icon.png?v=4", sizes: "180x180", type: "image/png" }],
  },
  applicationName: "GOPU Exports",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gopuexports.com",
    siteName: "GOPU Exports",
    title: "GOPU Exports | Indian Agricultural & Spice Exporter",
    description:
      "GOPU Exports is a Hyderabad-based Indian agricultural export company supplying spices, rice and selected food products to international importers, distributors and B2B buyers.",
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "GOPU Exports Indian agri commodities export company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOPU Exports | Indian Agricultural & Spice Exporter",
    description: "GOPU Exports is a Hyderabad-based Indian agricultural export company supplying spices, rice and selected food products to international importers, distributors and B2B buyers.",
    images: ["/logos/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://gopuexports.com/#organization",
  name: COMPANY.name,
  legalName: COMPANY.legalName,
  url: "https://gopuexports.com",
  logo: "https://gopuexports.com/logos/gopu-exports-logo-full.webp",
  email: COMPANY.email,
  telephone: COMPANY.phone,
  taxID: COMPANY.gst,
  identifier: [
    { "@type": "PropertyValue", name: "IEC", value: COMPANY.iec },
    { "@type": "PropertyValue", name: "CIN", value: COMPANY.cin },
    { "@type": "PropertyValue", name: "GST", value: COMPANY.gst },
  ],
  description:
    "GOPU Exports is a Hyderabad-based Indian agricultural export company supplying spices, rice and selected food products to international importers, distributors and B2B buyers.",
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.registeredAddress,
    addressLocality: "Hyderabad",
    postalCode: "500062",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: COMPANY.email,
      telephone: COMPANY.phone,
      availableLanguage: ["English"],
    },
  ],
  // Add sameAs only after ownership of the official profile URLs is verified.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

