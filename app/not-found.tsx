import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The shared 404, reached by any unmatched route and by the explicit
 * notFound() calls in app/services/[slug] and app/blog/[slug].
 *
 * No search box, because the site has no search. No "popular pages" list
 * dressed up as recommendations. Just an honest explanation and the three
 * destinations that actually help: home, the services, and contact.
 */
export const metadata: Metadata = {
  title: "Page not found",
  // A 404 must never be indexed, whatever the site-wide robots state.
  robots: { index: false, follow: true },
};

const DESTINATIONS = [
  { label: "Services", href: "/services", note: "The six connected disciplines" },
  { label: "About", href: "/about", note: "How Optara approaches growth" },
  { label: "Blog", href: "/blog", note: "Practical thinking and explanations" },
  { label: "Contact", href: "/contact", note: "Start a conversation" },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="scroll-mt-24 outline-none">
        <section
          data-theme="paper"
          className="relative overflow-hidden bg-[var(--bg)] pb-[var(--section-y)] pt-36 md:pt-44"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.08),transparent_66%)]"
          />
          <div className="shell relative">
            <p className="t-mono text-[var(--muted)]">Error 404</p>
            <h1 className="t-display-xl mt-5 max-w-[16ch]">
              We could not find{" "}
              <span className="text-accent">that page.</span>
            </h1>
            <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
              The address may be mistyped, or the page may have moved since it
              was linked. Nothing is broken on your side.
            </p>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Button href="/" withArrow className="justify-center">
                Return to the homepage
              </Button>
              <Button href="/contact" variant="outline" className="justify-center">
                Speak to us
              </Button>
            </div>

            <ul className="mt-16 grid gap-x-8 gap-y-2 border-t border-[var(--hairline)] pt-10 md:grid-cols-2">
              {DESTINATIONS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-start gap-4 rounded-[16px] border border-transparent p-5 transition-colors duration-200 hover:border-[var(--hairline)] hover:bg-bone focus-visible:border-[var(--hairline)] focus-visible:bg-bone"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[1.0625rem] font-medium transition-colors duration-200 group-hover:text-accent">
                        {item.label}
                        <ArrowIcon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100"
                        />
                      </span>
                      <span className="mt-1.5 block text-[0.9375rem] leading-[1.55] text-ink/70">
                        {item.note}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
