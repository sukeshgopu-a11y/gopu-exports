import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GOPU Exports",
    short_name: "GOPU Exports",
    description:
      "Premium Indian agricultural commodities exported to 18+ global markets.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F7FA",
    theme_color: "#0E7490",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
