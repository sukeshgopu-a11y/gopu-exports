import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GOPU Exports",
    short_name: "GOPU Exports",
    description:
      "Premium Indian agricultural commodities exported to global markets.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F7FA",
    theme_color: "#0E7490",
    icons: [
      { src: "/icon.png?v=3", sizes: "512x512", type: "image/png" },
      { src: "/apple-touch-icon.png?v=3", sizes: "180x180", type: "image/png" },
    ],
  };
}
