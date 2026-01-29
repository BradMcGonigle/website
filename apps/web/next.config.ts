import type { NextConfig } from "next";

const securityHeaders = [
  {
    // Prevent clickjacking attacks
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    // Prevent MIME type sniffing
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    // Control referrer information
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    // Control browser features and APIs
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    // Force HTTPS (only effective on HTTPS domains)
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    // Content Security Policy
    // Allows self-hosted resources and inline styles (needed for Next.js)
    // Adjust as needed for your specific requirements
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed for Next.js dev mode
      "style-src 'self' 'unsafe-inline'", // unsafe-inline needed for styled-jsx and CSS-in-JS
      "img-src 'self' data: https:", // Allow images from any HTTPS source
      "font-src 'self'",
      "connect-src 'self' https:", // Allow API calls to HTTPS endpoints
      "frame-ancestors 'none'", // Prevent embedding (reinforces X-Frame-Options)
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const config: NextConfig = {
  reactStrictMode: true,

  typescript: {
    ignoreBuildErrors: false,
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [
      {
        // Redirect old Gatsby tag pages to links
        source: "/tag/:slug",
        destination: "/links",
        permanent: true,
      },
    ];
  },
};

export default config;
