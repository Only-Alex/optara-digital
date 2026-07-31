import type { Metadata, Viewport } from "next";
import { Instrument_Sans, JetBrains_Mono, Jost } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { site } from "@/lib/content";
import { isIndexable, siteOrigin } from "@/lib/site-url";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-jetbrains-mono",
});

// The wordmark's own face: a light geometric sans matching the logo
// lockup. Used by the lockup only — body and headings stay Instrument Sans.
const wordmark = Jost({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-wordmark",
});

export const metadata: Metadata = {
  // Derived from the serving origin, not from site.url: the intended domain is
  // not registered yet, so a hardcoded base would canonicalise every route to a
  // hostname that does not resolve. See lib/site-url.ts.
  metadataBase: new URL(siteOrigin),
  robots: isIndexable
    ? undefined
    : { index: false, follow: false, googleBot: { index: false, follow: false } },
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "digital marketing agency UK",
    "SEO agency",
    "Google Ads agency",
    "lead generation",
    "website design agency",
  ],
  authors: [{ name: site.name }],
  openGraph: {
    type: "website",
    url: siteOrigin,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-GB"
      className={`${instrumentSans.variable} ${jetbrainsMono.variable} ${wordmark.variable}`}
    >
      <body>
        {/* Skip link. Visually hidden until focused, then the first tab stop on
            every route. Targets the <main id="main" tabIndex={-1}> each page
            renders, which carries scroll-mt so the sticky header cannot cover
            the destination. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-accent focus:px-5 focus:py-3 focus:text-[0.9375rem] focus:font-medium focus:text-paper focus:shadow-[0_10px_30px_rgba(18,19,26,0.18)]"
        >
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
