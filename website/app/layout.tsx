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
    "GOPU Exports is a Hyderabad-based Indian agricultural and spice export company supplying international importers, distributors, wholesalers and B2B food buyers.",
  keywords: [
    "GOPU Exports",
    "Indian agricultural exporter",
    "Indian spice exporter",
    "spice exporter Hyderabad",
    "agricultural exporter Hyderabad",
    "rice exporters from India",
    "red chilli exporter India",
    "turmeric exporter India",
    "B2B export supplier India",
  ],
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
      "Hyderabad-based Indian exporter supplying spices, rice and selected agricultural products to international B2B buyers.",
    images: [
      {
        url: "/logos/og-image.png",
        width: 1200,
        height: 630,
        alt: "GOPU Exports Indian agricultural and spice export company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GOPU Exports | Indian Agricultural & Spice Exporter",
    description: "Indian spices, rice and selected agricultural products for international B2B buyers.",
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

const officialSocialProfiles = Object.values(COMPANY.social).filter(Boolean);

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.legalName,
  alternateName: COMPANY.name,
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
    "Hyderabad-based Indian agricultural and spice export company supplying international importers, distributors, wholesalers and B2B food buyers.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "2nd Floor, Surya Arcade, Door No. 1-9-388, Kushaiguda Road, ECIL",
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
  sameAs: officialSocialProfiles,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConditionalLayout>{children}</ConditionalLayout>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
