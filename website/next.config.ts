import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const localePattern = "/:locale(ar|zh|es|fr|de|pt|ru|ja|ko|hi|te|tr|it|vi|th|id)";
    return [
      {
        source: localePattern,
        destination: "/",
        permanent: false,
      },
      {
        source: `${localePattern}/:path*`,
        destination: "/:path*",
        permanent: false,
      },
    ];
  },
  async headers() {
    const contentSecurityPolicy = [
      "default-src 'self'",
      "script-src 'self' https://va.vercel-scripts.com https://*.vercel-insights.com 'report-sample'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://*.vercel-insights.com https://vitals.vercel-insights.com https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "report-uri /api/csp-report",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/(admin|dashboard|api)/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "fqepkwnjdlmauskofafd.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
