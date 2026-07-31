import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { siteOrigin } from "@/lib/site-url";
import {
  categoryFromSlug,
  categorySlug,
  formatDate,
  getActiveCategories,
  getFeaturedPost,
  getPublishedPosts,
  readingTimeLabel,
  type BlogPost,
} from "@/lib/blog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, LogoMark } from "@/components/ui/Icons";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

/**
 * The Blog overview renders one of two pages from the same source of truth.
 *
 * With no published articles it is an honest empty state: no category
 * controls with nothing behind them, no blank featured panel, no skeleton
 * cards, no "coming soon this week", and no newsletter field, because there is
 * no email platform connected to receive one. Adding a genuine article to
 * `posts` in lib/blog.ts switches this page to the full experience — featured
 * article, categories, listing — with no further design work.
 *
 * "Blog" is used for the eyebrow, breadcrumb and metadata rather than
 * "Insights", because Blog is the visible global navigation label and those
 * are meant to match.
 */
const TITLE = "Blog — Insights on Digital Growth | Optara Digital";
const DESCRIPTION =
  "Practical thinking from Optara Digital across branding, SEO and GEO, Google Ads, social media, website design and app development.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
  },
};

/**
 * Editorial pathways. Each points at the category archive when that category
 * has published articles, and at the service page when it does not — and the
 * label says which, so a service link is never dressed up as an archive.
 */
const PATHWAYS = [
  { decision: "Strengthen the brand", category: "Branding", icon: "branding" },
  { decision: "Improve search visibility", category: "SEO & GEO", icon: "seo" },
  { decision: "Capture active demand", category: "Google Ads", icon: "ads" },
  { decision: "Build a clearer content system", category: "Social Media", icon: "social" },
  { decision: "Create a better website", category: "Website Design", icon: "web" },
  { decision: "Develop a useful digital product", category: "App Development", icon: "app" },
] as const;

const SERVICE_HREF: Record<string, string> = {
  Branding: "/services/branding",
  "SEO & GEO": "/services/seo-geo",
  "Google Ads": "/services/google-ads",
  "Social Media": "/services/social-media",
  "Website Design": "/services/website-design",
  "App Development": "/services/app-development",
};

function ArticleMeta({ post }: { post: BlogPost }) {
  return (
    <p className="t-mono flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--muted)]">
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden="true">·</span>
      <span>{readingTimeLabel(post.body)}</span>
      {post.updatedAt ? (
        <>
          <span aria-hidden="true">·</span>
          <span>
            Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
          </span>
        </>
      ) : null}
    </p>
  );
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: categoryParam } = await searchParams;
  const published = getPublishedPosts();
  const activeCategories = getActiveCategories();
  const hasArticles = published.length > 0;

  const selected = categoryParam ? categoryFromSlug(categoryParam) : null;
  const filtering = Boolean(selected);
  const visible = selected ? published.filter((p) => p.category === selected) : published;

  const featured = !filtering ? getFeaturedPost() : undefined;
  const listed = featured ? visible.filter((p) => p.slug !== featured.slug) : visible;

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${siteOrigin}/blog#blog`,
        url: `${siteOrigin}/blog`,
        name: `Blog — ${site.name}`,
        description: DESCRIPTION,
        publisher: { "@id": `${siteOrigin}#organization` },
        ...(hasArticles
          ? {
              blogPost: published.map((p) => ({
                "@type": "BlogPosting",
                headline: p.title,
                description: p.description,
                datePublished: p.publishedAt,
                ...(p.updatedAt ? { dateModified: p.updatedAt } : {}),
                url: `${siteOrigin}/blog/${p.slug}`,
              })),
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteOrigin}/blog` },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${siteOrigin}#organization`,
        name: site.name,
        url: siteOrigin,
        description: site.description,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main id="main" tabIndex={-1} className="scroll-mt-24 outline-none">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          data-theme="paper"
          className="relative overflow-hidden bg-[var(--bg)] pb-20 pt-36 md:pt-44"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[74rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.09),transparent_66%)]"
          />
          <div className="shell relative grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div>
              <nav aria-label="Breadcrumb" className="mb-7">
                <ol className="t-mono flex flex-wrap items-center gap-2 text-[var(--muted)]">
                  <li>
                    <Link href="/" className="transition-colors duration-200 hover:text-accent">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink/70">
                    Blog
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">Blog</p>
                <h1 className="t-display-xl mt-5 max-w-[18ch]">
                  Clear thinking for{" "}
                  <span className="text-accent">connected digital growth.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
                  Ideas, explanations and practical perspectives across brand,
                  search, paid media, social, websites and digital products —
                  written to help businesses make stronger decisions.
                </p>
                <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  {/* No "explore the latest thinking" until there is something
                      to explore. */}
                  {hasArticles ? (
                    <>
                      <Button href="#latest" withArrow className="justify-center">
                        Explore the latest thinking
                      </Button>
                      <Button href="/services" variant="outline" className="justify-center">
                        Explore our services
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button href="/services" withArrow className="justify-center">
                        Explore our services
                      </Button>
                      <Button href="/contact" variant="outline" className="justify-center">
                        Speak to us
                      </Button>
                    </>
                  )}
                </div>
              </RevealText>
            </div>

            {/* Editorial page geometry: an abstract article structure above the
                subjects Optara writes about, as real text. No magazine covers,
                no fake screenshots, no light bulb, no typewriter. */}
            <div className="relative">
              <div
                data-theme="bone"
                className="relative overflow-hidden rounded-[18px] border border-[rgba(18,19,26,0.09)] bg-[var(--bg)] p-6 shadow-[0_1px_2px_rgba(18,19,26,0.04),0_20px_60px_rgba(18,19,26,0.07)] md:p-7"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(18,19,26,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(18,19,26,0.04)_1px,transparent_1px)] [background-size:34px_34px]"
                />
                <div className="relative">
                  <p className="t-mono text-[var(--muted)]">What we write about</p>

                  <div className="mt-3 rounded-[12px] border border-[var(--hairline)] bg-paper p-4">
                    <span aria-hidden="true" className="block h-2.5 w-[72%] rounded-full bg-[rgba(91,61,245,0.4)]" />
                    <span aria-hidden="true" className="mt-3 block h-1.5 w-full rounded-full bg-[rgba(18,19,26,0.12)]" />
                    <span aria-hidden="true" className="mt-2 block h-1.5 w-[92%] rounded-full bg-[rgba(18,19,26,0.12)]" />
                    <span aria-hidden="true" className="mt-2 block h-1.5 w-[58%] rounded-full bg-[rgba(18,19,26,0.12)]" />
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-3 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.4),rgba(91,61,245,0.15))]"
                  />

                  <ul className="grid grid-cols-2 gap-2">
                    {[
                      "Strategy",
                      "Recognition",
                      "Discovery",
                      "Demand",
                      "Conversion",
                      "Product",
                    ].map((term) => (
                      <li
                        key={term}
                        className="rounded-[10px] border border-[var(--hairline)] bg-paper px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60"
                      >
                        {term}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 flex items-center gap-2.5 rounded-[12px] border border-dashed border-accent/30 px-3.5 py-2">
                    <span aria-hidden="true" className="text-accent">
                      ↺
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60">
                      Written to be useful, not to fill a schedule
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {hasArticles ? (
          <>
            {/* ── Featured ─────────────────────────────────────────────── */}
            {featured ? (
              <section data-theme="bone" className="section bg-[var(--bg)]">
                <div className="shell">
                  <RevealText>
                    <p className="t-mono text-[var(--muted)]">Featured thinking</p>
                  </RevealText>
                  <RevealText delay={0.06}>
                    <article className="mt-8 grid gap-8 border-t border-[var(--hairline)] pt-10 lg:grid-cols-2 lg:gap-x-[clamp(3rem,5vw,6rem)]">
                      <div>
                        <Link
                          href={`/blog?category=${categorySlug(featured.category)}`}
                          className="t-mono text-accent transition-colors duration-200 hover:text-ink"
                        >
                          {featured.category}
                        </Link>
                        <h2 className="t-display-lg mt-4 max-w-[20ch]">
                          <Link
                            href={`/blog/${featured.slug}`}
                            className="transition-colors duration-200 hover:text-accent"
                          >
                            {featured.title}
                          </Link>
                        </h2>
                        <p className="t-body-lg mt-6 max-w-[52ch] text-ink/75">
                          {featured.description}
                        </p>
                        <div className="mt-6">
                          <ArticleMeta post={featured} />
                        </div>
                        <Link
                          href={`/blog/${featured.slug}`}
                          className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
                        >
                          Read the article
                          <ArrowIcon
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>

                      {/* Decorative, stable dimensions, no implied photograph. */}
                      <div
                        aria-hidden="true"
                        className="relative min-h-[14rem] overflow-hidden rounded-[18px] border border-[var(--hairline)] bg-paper"
                      >
                        <span className="pointer-events-none absolute inset-0 opacity-[0.6] [background-image:linear-gradient(rgba(18,19,26,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(18,19,26,0.04)_1px,transparent_1px)] [background-size:34px_34px]" />
                        <span className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.14),transparent_70%)]" />
                        <span className="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
                          <span className="block h-2 w-[62%] rounded-full bg-[rgba(91,61,245,0.35)]" />
                          <span className="block h-1.5 w-[86%] rounded-full bg-[rgba(18,19,26,0.12)]" />
                          <span className="block h-1.5 w-[54%] rounded-full bg-[rgba(18,19,26,0.12)]" />
                        </span>
                      </div>
                    </article>
                  </RevealText>
                </div>
              </section>
            ) : null}

            {/* ── Categories + listing ─────────────────────────────────── */}
            <section
              id="latest"
              data-theme="paper"
              className="section scroll-mt-28 bg-[var(--bg)]"
            >
              <div className="shell">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Latest thinking</p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Ideas for{" "}
                    <span className="text-accent">stronger digital decisions.</span>
                  </h2>
                </RevealText>

                {/* Real links rather than client-side filter state, so the URL
                    is shareable and Back works. */}
                {activeCategories.length > 0 ? (
                  <nav aria-label="Article categories" className="mt-10">
                    <ul className="flex flex-wrap gap-2">
                      <li>
                        <Link
                          href="/blog"
                          aria-current={!selected ? "page" : undefined}
                          className={`inline-flex min-h-[2.75rem] items-center rounded-full border px-4 text-[0.875rem] transition-colors duration-200 ${
                            !selected
                              ? "border-accent bg-accent/[0.07] font-medium text-accent"
                              : "border-[var(--hairline)] text-ink/70 hover:border-accent hover:text-accent"
                          }`}
                        >
                          All articles
                        </Link>
                      </li>
                      {activeCategories.map(({ category, count }) => {
                        const active = selected === category;
                        return (
                          <li key={category}>
                            <Link
                              href={`/blog?category=${categorySlug(category)}`}
                              aria-current={active ? "page" : undefined}
                              className={`inline-flex min-h-[2.75rem] items-center gap-2 rounded-full border px-4 text-[0.875rem] transition-colors duration-200 ${
                                active
                                  ? "border-accent bg-accent/[0.07] font-medium text-accent"
                                  : "border-[var(--hairline)] text-ink/70 hover:border-accent hover:text-accent"
                              }`}
                            >
                              {category}
                              <span className="text-[0.75rem] text-[var(--muted)]">
                                {count}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>
                ) : null}

                {listed.length > 0 ? (
                  <RevealGroup
                    as="ul"
                    className="mt-12 grid gap-x-[clamp(2rem,5vw,4rem)] md:grid-cols-2"
                    stagger={0.05}
                    soft
                  >
                    {listed.map((post) => (
                      <RevealItem
                        as="li"
                        key={post.slug}
                        className="border-t border-[var(--hairline)] py-8"
                      >
                        <article>
                          <Link
                            href={`/blog?category=${categorySlug(post.category)}`}
                            className="t-mono text-accent transition-colors duration-200 hover:text-ink"
                          >
                            {post.category}
                          </Link>
                          <h3 className="t-display-md mt-3 max-w-[24ch] text-[clamp(1.25rem,1.8vw,1.5rem)]">
                            <Link
                              href={`/blog/${post.slug}`}
                              className="transition-colors duration-200 hover:text-accent"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                            {post.description}
                          </p>
                          <div className="mt-4">
                            <ArticleMeta post={post} />
                          </div>
                        </article>
                      </RevealItem>
                    ))}
                  </RevealGroup>
                ) : (
                  /* A selected category with nothing published in it. Says so
                     plainly and offers the two useful ways out. */
                  <div className="mt-12 border-t border-[var(--hairline)] pt-10">
                    <p className="t-body-lg max-w-[46ch] text-ink/75">
                      No published articles currently match
                      {selected ? ` ${selected}` : " this topic"}.
                    </p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <Link
                        href="/blog"
                        className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
                      >
                        View all articles
                        <ArrowIcon
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                      {selected && SERVICE_HREF[selected] ? (
                        <Link
                          href={SERVICE_HREF[selected]}
                          className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink/70 transition-colors duration-200 hover:text-accent"
                        >
                          Explore the {selected} service
                          <ArrowIcon
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          /* ── Honest empty state ─────────────────────────────────────────
             No category controls, no blank featured panel, no skeleton cards,
             no newsletter field, no publishing-frequency promise. */
          <section data-theme="bone" className="section bg-[var(--bg)]">
            <div className="shell">
              <div className="grid gap-10 border-t border-[var(--hairline)] pt-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
                <div className="lg:col-span-6">
                  <RevealText>
                    <h2 className="t-display-lg max-w-[20ch]">
                      Our editorial library is{" "}
                      <span className="text-accent">being prepared.</span>
                    </h2>
                  </RevealText>
                </div>
                <div className="lg:col-span-5 lg:col-start-8">
                  <RevealText delay={0.1}>
                    <p className="t-body-lg max-w-[48ch] text-ink/75">
                      Optara will use this space to share practical thinking
                      across brand, search, paid media, social, websites and
                      digital products. Until then, explore the services or tell
                      us about the decision your business is currently facing.
                    </p>
                    <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-[1.7] text-ink/70">
                      We would rather publish nothing than publish filler, so
                      there is no schedule to promise here and no list to join
                      yet.
                    </p>
                  </RevealText>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Editorial pathways ───────────────────────────────────────── */}
        <section
          data-theme={hasArticles ? "bone" : "paper"}
          className="section bg-[var(--bg)]"
        >
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Explore by priority</p>
              <h2 className="t-display-lg mt-6 max-w-[24ch]">
                Start with the decision{" "}
                <span className="text-accent">you are trying to make.</span>
              </h2>
            </RevealText>

            <RevealGroup
              as="ul"
              className="mt-12 grid gap-x-8 gap-y-2 md:grid-cols-2"
              stagger={0.05}
              soft
            >
              {PATHWAYS.map((pathway) => {
                const active = activeCategories.find(
                  (c) => c.category === pathway.category,
                );
                const href = active
                  ? `/blog?category=${categorySlug(pathway.category)}`
                  : SERVICE_HREF[pathway.category];
                const destination = active
                  ? `Explore ${pathway.category} insights`
                  : `Explore our ${pathway.category} service`;

                return (
                  <RevealItem as="li" key={pathway.decision}>
                    <Link
                      href={href}
                      className="group flex h-full items-start gap-4 rounded-[16px] border border-transparent p-5 transition-colors duration-200 hover:border-[var(--hairline)] hover:bg-paper focus-visible:border-[var(--hairline)] focus-visible:bg-paper"
                    >
                      <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/[0.07] text-accent transition-colors duration-200 group-hover:bg-accent/[0.14]">
                        <ServiceIcon name={pathway.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2 text-[1.0625rem] font-medium transition-colors duration-200 group-hover:text-accent">
                          {pathway.decision}
                          <ArrowIcon
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100"
                          />
                        </span>
                        <span className="mt-2 block text-[0.9375rem] leading-[1.55] text-ink/70">
                          {destination}
                        </span>
                      </span>
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────────── */}
        <section data-theme="ink" className="section relative overflow-hidden bg-[var(--bg)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.16),transparent_68%)]"
          />
          <div className="shell relative flex flex-col items-start gap-10 lg:flex-row lg:items-end lg:justify-between">
            <RevealText>
              <span aria-hidden="true" className="mb-8 block">
                <LogoMark className="h-9 w-9" />
              </span>
              <h2 className="t-display-lg max-w-[20ch] text-paper">
                {hasArticles ? (
                  <>
                    Need help applying the thinking{" "}
                    <span className="text-[var(--accent-fg)]">to your business?</span>
                  </>
                ) : (
                  <>
                    Working through a decision{" "}
                    <span className="text-[var(--accent-fg)]">right now?</span>
                  </>
                )}
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                Tell us which decision you are working through and where
                progress currently feels unclear. We will help identify the
                strongest practical place to begin.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="flex flex-col items-start gap-5">
                <Button href="/contact" variant="light" withArrow>
                  Speak to us
                </Button>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-[0.9375rem] text-[rgba(255,255,255,0.72)] transition-colors duration-200 hover:text-paper"
                >
                  Explore our services
                  <ArrowIcon
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </RevealText>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
