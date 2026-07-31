import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

/**
 * Pin the workspace root.
 *
 * There is a second package-lock.json one directory up, in ~/Desktop, so
 * Turbopack could not tell whether the workspace root was this project or its
 * parent and warned on every build. Resolving it from this file's own location
 * removes the ambiguity without touching a lockfile that is not ours.
 */
const projectRoot = dirname(fileURLToPath(import.meta.url));

const isDev = process.env.NODE_ENV === "development";

/**
 * Content-Security-Policy, built from what this site actually does — verified
 * by live inspection on 2026-07-31: every resource is same-origin, there are
 * no third-party scripts, fonts are self-hosted, the only POSTs are the
 * enquiry Server Actions to this origin, and nothing is framed.
 *
 * Two honest compromises, documented rather than hidden:
 *
 * - `script-src` carries 'unsafe-inline'. Next.js static pages bootstrap with
 *   inline scripts; removing 'unsafe-inline' needs nonces, and per current
 *   Next.js guidance a nonce-based CSP forces every route into dynamic
 *   rendering. This site is fully static and stays that way. The policy still
 *   pins script *origins* to 'self', which blocks any injected external
 *   script tag — but it does not stop inline-script XSS, so it is a
 *   containment layer, not a complete one.
 * - Dev mode adds 'unsafe-eval' (Fast Refresh) and ws:/wss: (HMR). Neither
 *   appears in the production policy.
 *
 * `img-src` allows data: because next/image can emit data-URI placeholders;
 * no other directive needs it. HSTS is deliberately absent here: Vercel
 * already serves `strict-transport-security: max-age=63072000` on the
 * production domain, and widening it (includeSubDomains/preload) is a
 * recorded business decision, not a default.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "worker-src 'self'",
  "manifest-src 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // frame-ancestors is the modern control; X-Frame-Options kept for older UAs.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
