import type { Metadata } from "next";

export const SITE_URL = "https://gopuexports.com";

/** Keep canonical, search and sharing copy aligned on each public route. */
export function publicMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: `${title} | GOPU Exports`,
      description,
      url: path,
      siteName: "GOPU Exports",
      images: [{ url: "/logos/og-image.png", width: 1200, height: 630, alt: "GOPU Exports — India, delivered globally" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | GOPU Exports`,
      description,
      images: ["/logos/og-image.png"],
    },
  };
}
