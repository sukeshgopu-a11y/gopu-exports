import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: {
    default: "GOPU Exports — Premium Indian Agricultural Commodities",
    template: "%s | GOPU Exports",
  },
  description:
    "GOPU Exports supplies premium agricultural commodities — spices, rice, fresh produce — to importers and distributors across 18+ global markets from India.",
  keywords: [
    "Indian agricultural exports",
    "spices export India",
    "basmati rice export",
    "turmeric export India",
    "red chilli export",
    "GOPU Exports",
    "export company India",
  ],
  metadataBase: new URL("https://gopuexports.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GOPU Exports",
    title: "GOPU Exports — Premium Indian Agricultural Commodities",
    description:
      "Supplying premium spices, rice, and agricultural commodities to importers across 18+ countries.",
  },
  twitter: {
    card: "summary_large_image",
    title: "GOPU Exports",
    description: "Premium Indian agricultural exports to 18+ global markets.",
  },
  robots: { index: true, follow: true },
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
      </body>
    </html>
  );
}
