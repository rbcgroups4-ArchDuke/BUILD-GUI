import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: false,
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          // ====================================================================
          // CORS - Cross-Origin Resource Sharing
          // Allow requests only from trusted origins (prevent data theft)
          // ====================================================================
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Max-Age",
            value: "86400",
          },

          // ====================================================================
          // CSP - Content Security Policy
          // Prevent XSS attacks by restricting where scripts can come from
          // Allow: self + Tailwind CDN (required for styling)
          // ====================================================================
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com",
              "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
            ].join("; "),
          },

          // ====================================================================
          // X-Frame-Options - Clickjacking Protection
          // Prevent this page from being embedded in an iframe
          // Fraud approvals cannot be hidden in frames
          // ====================================================================
          {
            key: "X-Frame-Options",
            value: "DENY",
          },

          // ====================================================================
          // X-Content-Type-Options - MIME Sniffing Protection
          // Force browser to respect the Content-Type header
          // Prevents executing non-JS files as scripts
          // ====================================================================
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },

          // ====================================================================
          // Strict-Transport-Security (HSTS) - Force HTTPS
          // Ensure all connections use HTTPS (encrypted)
          // max-age: 1 year (31536000 seconds)
          // ====================================================================
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },

          // ====================================================================
          // X-XSS-Protection - Legacy XSS Protection
          // Fallback for older browsers that don't support CSP
          // mode=block: Stop rendering if XSS detected
          // ====================================================================
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },

          // ====================================================================
          // Referrer-Policy - Control Referrer Information
          // strict-origin-when-cross-origin:
          // - Send full referrer to same site
          // - Send only origin to different site
          // Prevents leaking URLs with sensitive info
          // ====================================================================
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },

          // ====================================================================
          // Permissions-Policy (formerly Feature-Policy)
          // Restrict browser features (camera, microphone, geolocation, etc)
          // Not needed for fraud detection but good security hygiene
          // ====================================================================
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
