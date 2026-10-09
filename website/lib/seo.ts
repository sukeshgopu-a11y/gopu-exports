import type { Metadata } from "next";

export const SITE_URL = "https://gopuexports.com";

// Exact revisions keep future editor-written titles intact.
const EDITORIAL_TITLES: Record<string, string> = {
  "How to Choose a Reliable Agricultural Exporter from India": "Choosing an Agricultural Exporter in India",
  "Export Packaging Standards for Spices, Rice, Fruits and Vegetables": "Export Packaging for Spices, Rice & Fresh Produce",
  "Fresh Fruits and Vegetables Export from India | Buyer Guide": "Fresh Produce Exports from India: Buyer Guide",
  "Documents Required for Importing Food Products from India": "Food Imports from India: Required Documents",
};
export function editorialSearchTitle(title: string): string {
  const clean = title.replace(/\s*\|\s*GOPU Exports\s*$/i, "");
  return EDITORIAL_TITLES[clean] ?? clean;
}

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
