import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { site } from "@/lib/content";
import { siteOrigin } from "@/lib/site-url";
import {
  CATEGORY_SERVICE,
  categorySlug,
  formatDate,
  getPostBySlug,
  getPublishedPosts,
  getRelatedPosts,
  getTableOfContents,
  headingId,
  postAuthor,
  readingTimeLabel,
  type BlogBlock,
  type BlogPost,
} from "@/lib/blog";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The reusable article template. Every published article renders through
 * this one file, so publishing is a data change rather than a design job.
 *
 * Only published, non-future, non-draft articles are reachable:
 * generateStaticParams lists exactly those, and getPostBySlug applies the same
 * filter at request time, so an unknown or draft slug 404s rather than
 * rendering. Reading time is measured from the real body at build time and is
 * never stored on the post.
 */

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: post.canonical ?? `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      authors: [postAuthor(post)],
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

/* ── Prose ───────────────────────────────────────────────────────────────
   One measure for reading text, wider for figures, tables and code. Body is
   17px rising to 19px, line-height 1.7 — inside the 17–20px desktop and
   1.65–1.8 guidance, and never centred. */

const PROSE = "max-w-[44rem]";
const BODY_TEXT =
  "text-[1.0625rem] leading-[1.7] text-ink/80 md:text-[1.1875rem]";

function Block({ block }: { block: BlogBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className={`${PROSE} ${BODY_TEXT} mt-6`}>{block.text}</p>;

    case "heading": {
      const id = headingId(block.text);
      /* scroll-mt clears the sticky header when an anchor is followed. */
      return block.level === 2 ? (
        <h2
          id={id}
          className={`${PROSE} t-display-md mt-14 scroll-mt-28 text-[clamp(1.375rem,2vw,1.75rem)]`}
        >
          {block.text}
        </h2>
      ) : (
        <h3
          id={id}
          className={`${PROSE} mt-10 scroll-mt-28 text-[1.1875rem] font-medium leading-snug`}
        >
          {block.text}
        </h3>
      );
    }

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={`${PROSE} mt-6 flex flex-col gap-3 ${
            block.ordered ? "list-decimal pl-5" : ""
          }`}
        >
          {block.items.map((item) => (
            <li
              key={item}
              className={
                block.ordered
                  ? `${BODY_TEXT} pl-1`
                  : `${BODY_TEXT} flex items-start gap-3`
              }
            >
              {block.ordered ? null : (
                <span
                  aria-hidden="true"
                  className="mt-[0.6em] block h-1 w-1 shrink-0 rounded-full bg-accent"
                />
              )}
              <span>{item}</span>
            </li>
          ))}
        </List>
      );
    }

    case "quote":
      return (
        <figure className={`${PROSE} mt-10`}>
          <blockquote className="border-l-2 border-accent pl-6 text-[1.25rem] leading-[1.6] text-ink/85">
            {block.text}
          </blockquote>
          {block.attribution ? (
            <figcaption className="t-mono mt-3 pl-6 text-[var(--muted)]">
              {block.attribution}
            </figcaption>
          ) : null}
        </figure>
      );

    case "callout":
      /* The variant is a visible word, not just a colour. */
      return (
        <aside
          className={`${PROSE} mt-8 rounded-[12px] border border-[var(--hairline)] bg-bone p-5`}
        >
          <p className="t-mono text-accent">{block.variant}</p>
          <p className={`${BODY_TEXT} mt-2`}>{block.text}</p>
        </aside>
      );

    case "table":
      /* Scrolls inside its own container so the page never overflows. */
      return (
        <figure className="mt-10 max-w-[52rem]">
          <div className="overflow-x-auto rounded-[12px] border border-[var(--hairline)]">
            <table className="w-full border-collapse text-left text-[0.9375rem]">
              {block.caption ? (
                <caption className="t-caption px-4 pt-4 text-left text-[var(--muted)]">
                  {block.caption}
                </caption>
              ) : null}
              <thead>
                <tr>
                  {block.head.map((cell) => (
                    <th
                      key={cell}
                      scope="col"
                      className="whitespace-nowrap border-b border-[var(--hairline)] px-4 py-3 font-medium"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row) => (
                  <tr key={row.join("|")}>
                    {row.map((cell) => (
                      <td
                        key={cell}
                        className="border-b border-[var(--hairline)] px-4 py-3 text-ink/75 last:border-r-0"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </figure>
      );

    case "code":
      /* tabIndex so the scroll region is reachable by keyboard. */
      return (
        <div className="mt-8 max-w-[52rem]">
          <pre
            tabIndex={0}
            className="overflow-x-auto rounded-[12px] border border-[var(--hairline)] bg-bone p-5 text-[0.875rem] leading-[1.6]"
          >
            <code className="font-mono">{block.code}</code>
          </pre>
        </div>
      );

    case "figure":
      return (
        <figure className="mt-10 max-w-[52rem]">
          <Image
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            sizes="(min-width: 1024px) 52rem, 100vw"
            className="h-auto w-full rounded-[12px] border border-[var(--hairline)]"
          />
          {block.caption ? (
            <figcaption className="t-caption mt-3 text-[var(--muted)]">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );
  }
}

function ArticleBody({ post }: { post: BlogPost }) {
  return (
    <div>
      {post.body.map((block, i) => (
        <Block key={`${block.type}-${i}`} block={block} />
      ))}
    </div>
  );
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const toc = getTableOfContents(post.body);
  const related = getRelatedPosts(post);
  const service = CATEGORY_SERVICE[post.category];
  const author = postAuthor(post);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${siteOrigin}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.description,
        datePublished: post.publishedAt,
        ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
        articleSection: post.category,
        ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
        ...(post.image ? { image: `${siteOrigin}${post.image}` } : {}),
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": post.canonical ?? `${siteOrigin}/blog/${post.slug}`,
        },
        /* Attributed to the publication: no verified individual author
           exists in this project, so no Person is invented here. */
        author: { "@type": "Organization", name: author, url: siteOrigin },
        publisher: { "@id": `${siteOrigin}#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteOrigin}/blog` },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${siteOrigin}/blog/${post.slug}`,
          },
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
      <main>
        {/* ── Article hero ─────────────────────────────────────────────── */}
        <section
          data-theme="paper"
          className="relative overflow-hidden bg-[var(--bg)] pb-12 pt-36 md:pt-44"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.08),transparent_66%)]"
          />
          <div className="shell relative">
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="t-mono flex flex-wrap items-center gap-2 text-[var(--muted)]">
                <li>
                  <Link href="/" className="transition-colors duration-200 hover:text-accent">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/blog" className="transition-colors duration-200 hover:text-accent">
                    Blog
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                {/* The full title would make this unusable, so the crumb is the
                    category and the accessible name carries the article. */}
                <li aria-current="page" className="text-ink/70">
                  <span className="sr-only">{post.title}</span>
                  <span aria-hidden="true">{post.category}</span>
                </li>
              </ol>
            </nav>

            <RevealText>
              <Link
                href={`/blog?category=${categorySlug(post.category)}`}
                className="t-mono text-accent transition-colors duration-200 hover:text-ink"
              >
                {post.category}
              </Link>
              <h1 className="t-display-lg mt-5 max-w-[20ch]">{post.title}</h1>
              <p className={`${PROSE} t-body-lg mt-6 text-ink/75`}>
                {post.description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--hairline)] pt-6">
                <p className="t-mono text-[var(--muted)]">
                  <span className="text-ink/70">{author}</span>
                  <span aria-hidden="true"> · </span>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  <span aria-hidden="true"> · </span>
                  <span>{readingTimeLabel(post.body)}</span>
                  {post.updatedAt ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>
                        Updated{" "}
                        <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                      </span>
                    </>
                  ) : null}
                </p>
              </div>
            </RevealText>
          </div>
        </section>

        {/* ── Article ──────────────────────────────────────────────────── */}
        <article data-theme="paper" className="bg-[var(--bg)] pb-[var(--section-y)]">
          <div className="shell">
            {post.image ? (
              <Image
                src={post.image}
                alt={post.imageAlt ?? ""}
                width={1200}
                height={630}
                priority
                sizes="(min-width: 1024px) 52rem, 100vw"
                className="mb-12 h-auto w-full max-w-[52rem] rounded-[18px] border border-[var(--hairline)]"
              />
            ) : null}

            {/* Above the body on every width: a side rail would either squeeze
                the measure or collide with the floating CTA. */}
            {toc.length > 0 ? (
              <nav
                aria-label="On this page"
                className={`${PROSE} mb-12 rounded-[12px] border border-[var(--hairline)] bg-bone p-5`}
              >
                <p className="t-mono text-[var(--muted)]">On this page</p>
                <ol className="mt-3 flex flex-col gap-2">
                  {toc.map((entry, i) => (
                    <li key={entry.id} className="flex items-baseline gap-3">
                      <span className="t-mono text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <a
                        href={`#${entry.id}`}
                        className="text-[0.9375rem] leading-snug text-ink/75 underline decoration-[var(--hairline)] underline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent"
                      >
                        {entry.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            ) : null}

            <ArticleBody post={post} />
          </div>
        </article>

        {/* ── Service CTA, mapped from the article's category ───────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-8 border-t border-[var(--hairline)] pt-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <h2 className="t-display-md max-w-[20ch]">
                    Turn the thinking into{" "}
                    <span className="text-accent">a clearer next step.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8">
                <RevealText delay={0.08}>
                  <p className="max-w-[46ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                    Explore the related service, or speak to Optara about how
                    this applies to your business.
                  </p>
                  <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Link
                      href={service.href}
                      className="group inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
                    >
                      {service.label}
                      <ArrowIcon
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                    <Link
                      href="/contact"
                      className="group inline-flex items-center gap-2 text-[0.9375rem] text-ink/70 transition-colors duration-200 hover:text-accent"
                    >
                      Speak to us
                      <ArrowIcon
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </RevealText>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related ──────────────────────────────────────────────────────
            Omitted entirely when nothing genuinely relevant exists, rather
            than padded with unrelated articles. */}
        {related.length > 0 ? (
          <section data-theme="paper" className="section bg-[var(--bg)]">
            <div className="shell">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">Related thinking</p>
              </RevealText>
              <ul className="mt-8 grid gap-x-[clamp(2rem,5vw,4rem)] md:grid-cols-2 xl:grid-cols-3">
                {related.map((item) => (
                  <li
                    key={item.slug}
                    className="border-t border-[var(--hairline)] py-7"
                  >
                    <article>
                      <p className="t-mono text-accent">{item.category}</p>
                      <h3 className="mt-3 max-w-[24ch] text-[1.125rem] font-medium leading-snug">
                        <Link
                          href={`/blog/${item.slug}`}
                          className="transition-colors duration-200 hover:text-accent"
                        >
                          {item.title}
                        </Link>
                      </h3>
                      <p className="t-mono mt-3 text-[var(--muted)]">
                        <time dateTime={item.publishedAt}>
                          {formatDate(item.publishedAt)}
                        </time>
                        <span aria-hidden="true"> · </span>
                        {readingTimeLabel(item.body)}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* ── Back to the Blog ─────────────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <RevealText>
              <p className="t-body-lg max-w-[40ch] text-ink/75">
                More practical thinking across brand, search, paid media and
                digital experience.
              </p>
            </RevealText>
            <RevealText delay={0.08}>
              <Button href="/blog" variant="outline" withArrow>
                All articles
              </Button>
            </RevealText>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
