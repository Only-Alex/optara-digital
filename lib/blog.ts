/**
 * The editorial system.
 *
 * There are currently no published articles. The three entries that used to
 * sit in `blogPage.posts` were outlines — a title, a category, an excerpt and
 * a hardcoded reading time, with no body, no publication date and no author,
 * and no article route for their slugs to reach. They are recorded as planned
 * topics at the bottom of this file rather than rendered, because rendering a
 * title with no article behind it is the thing this project does not do.
 *
 * Everything below is the machinery for real articles: the content model,
 * build-time validation, reading time measured from the actual body, and the
 * queries the listing and article routes use. Adding one genuine article to
 * `posts` switches the Blog from its empty state to the full experience —
 * featured article, category navigation, listing, related articles — with no
 * further page work.
 *
 * Content is typed data rather than MDX because this project has no Markdown
 * pipeline and the sprint forbids new dependencies. Typed blocks give the same
 * authoring surface with build-time checking and no parser to sanitise.
 */

import { siteOrigin } from "@/lib/site-url";

/* ── Categories ──────────────────────────────────────────────────────────
   Deliberately one term per subject. The brief warns against near-duplicate
   categories (SEO / Search / Organic Search / AI Search); the service names
   are already the site's vocabulary, so the Blog reuses them exactly. */

export const BLOG_CATEGORIES = [
  "Growth Strategy",
  "Branding",
  "SEO & GEO",
  "Google Ads",
  "Social Media",
  "Website Design",
  "App Development",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

/** Where each category's "explore the service" CTA points. */
export const CATEGORY_SERVICE: Record<
  BlogCategory,
  { label: string; href: string }
> = {
  "Growth Strategy": { label: "Explore all services", href: "/services" },
  Branding: { label: "Explore Branding", href: "/services/branding" },
  "SEO & GEO": { label: "Explore SEO & GEO", href: "/services/seo-geo" },
  "Google Ads": { label: "Explore Google Ads", href: "/services/google-ads" },
  "Social Media": { label: "Explore Social Media", href: "/services/social-media" },
  "Website Design": { label: "Explore Website Design", href: "/services/website-design" },
  "App Development": { label: "Explore App Development", href: "/services/app-development" },
};

/** Slug used in ?category= links, and the reverse lookup. */
export const categorySlug = (category: BlogCategory) =>
  category.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const categoryFromSlug = (slug: string): BlogCategory | null =>
  BLOG_CATEGORIES.find((c) => categorySlug(c) === slug) ?? null;

/* ── Content model ───────────────────────────────────────────────────────
   A closed set of blocks. Nothing here renders raw HTML, so an article
   cannot introduce a script, an iframe or unsanitised markup. */

export type BlogBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "callout";
      variant: "Note" | "Important" | "Example" | "Caution";
      text: string;
    }
  | { type: "table"; caption?: string; head: string[]; rows: string[][] }
  | { type: "code"; language?: string; code: string }
  | {
      type: "figure";
      src: string;
      alt: string;
      caption?: string;
      width: number;
      height: number;
    };

export type BlogPost = {
  title: string;
  description: string;
  slug: string;
  /** ISO date, e.g. "2026-07-31". The date the article genuinely went live. */
  publishedAt: string;
  /** Only when the article was genuinely revised. Never set on every build. */
  updatedAt?: string;
  category: BlogCategory;
  tags?: string[];
  /**
   * Omit unless a real, named, approved person wrote it. Omitted means the
   * publication itself is the author — see `postAuthor` below. There is no
   * verified individual author in this project, so nothing sets this yet.
   */
  author?: string;
  image?: string;
  /** Required whenever `image` is set and carries meaning. */
  imageAlt?: string;
  featured?: boolean;
  /** Explicit, never inferred from a missing date. */
  draft: boolean;
  /** Only for genuinely syndicated content published elsewhere first. */
  canonical?: string;
  body: BlogBlock[];
};

/* ── The articles ────────────────────────────────────────────────────────
   Empty because nothing has been written yet. Adding a real article here is
   the whole publishing step. Shape:

   {
     title: "…",
     description: "…",
     slug: "kebab-case-slug",
     publishedAt: "2026-08-14",
     category: "SEO & GEO",
     draft: false,
     body: [
       { type: "paragraph", text: "…" },
       { type: "heading", level: 2, text: "…" },
     ],
   }
*/

export const posts: BlogPost[] = [];

/* ── Validation ──────────────────────────────────────────────────────────
   Runs when this module is first imported, so a bad article fails the dev
   server and the production build rather than shipping quietly. No schema
   dependency: the checks below are the ones that actually matter here. */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validate(all: BlogPost[]): void {
  const seen = new Set<string>();

  for (const post of all) {
    const where = `blog post "${post.slug || post.title || "(untitled)"}"`;

    if (!post.title?.trim()) throw new Error(`${where}: title is required.`);
    if (!post.description?.trim())
      throw new Error(`${where}: description is required.`);

    if (!SLUG.test(post.slug))
      throw new Error(
        `${where}: slug must be lowercase kebab-case, received "${post.slug}".`,
      );
    if (seen.has(post.slug))
      throw new Error(`${where}: duplicate slug "${post.slug}".`);
    seen.add(post.slug);

    if (!ISO_DATE.test(post.publishedAt) || Number.isNaN(Date.parse(post.publishedAt)))
      throw new Error(
        `${where}: publishedAt must be a valid YYYY-MM-DD date, received "${post.publishedAt}".`,
      );

    if (post.updatedAt !== undefined) {
      if (!ISO_DATE.test(post.updatedAt) || Number.isNaN(Date.parse(post.updatedAt)))
        throw new Error(
          `${where}: updatedAt must be a valid YYYY-MM-DD date, received "${post.updatedAt}".`,
        );
      if (Date.parse(post.updatedAt) < Date.parse(post.publishedAt))
        throw new Error(
          `${where}: updatedAt (${post.updatedAt}) is earlier than publishedAt (${post.publishedAt}).`,
        );
    }

    if (!BLOG_CATEGORIES.includes(post.category))
      throw new Error(`${where}: unknown category "${post.category}".`);

    if (typeof post.draft !== "boolean")
      throw new Error(`${where}: draft must be explicitly true or false.`);

    if (post.image && !post.imageAlt?.trim())
      throw new Error(`${where}: imageAlt is required when image is set.`);

    if (post.canonical) {
      try {
        new URL(post.canonical);
      } catch {
        throw new Error(`${where}: canonical must be an absolute URL.`);
      }
    }

    for (const block of post.body) {
      if (block.type === "figure" && !block.alt && block.alt !== "")
        throw new Error(`${where}: figure blocks need alt text ("" if decorative).`);
      if (block.type === "table" && block.rows.some((r) => r.length !== block.head.length))
        throw new Error(`${where}: every table row must match the header column count.`);
    }
  }
}

validate(posts);

/* ── Reading time ────────────────────────────────────────────────────────
   Measured from the real body, never stored on the post. 225 words per
   minute is the usual figure for considered prose; headings and list items
   count because they are read, table cells and code do not because they are
   scanned. Rounded up, floor of one minute. */

const WORDS_PER_MINUTE = 225;

export function countWords(body: BlogBlock[]): number {
  let words = 0;
  const add = (text: string) => {
    const t = text.trim();
    if (t) words += t.split(/\s+/).length;
  };

  for (const block of body) {
    switch (block.type) {
      case "paragraph":
      case "heading":
        add(block.text);
        break;
      case "quote":
        add(block.text);
        if (block.attribution) add(block.attribution);
        break;
      case "callout":
        add(block.text);
        break;
      case "list":
        block.items.forEach(add);
        break;
      case "figure":
        if (block.caption) add(block.caption);
        break;
      case "table":
      case "code":
        break;
    }
  }
  return words;
}

export function readingTime(body: BlogBlock[]): number {
  return Math.max(1, Math.ceil(countWords(body) / WORDS_PER_MINUTE));
}

export const readingTimeLabel = (body: BlogBlock[]) => `${readingTime(body)} min read`;

/* ── Queries ─────────────────────────────────────────────────────────────
   One place decides what is publishable and in what order, so no route can
   accidentally list a draft or a post dated in the future. */

const startOfToday = () => {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
};

function isPublishable(post: BlogPost): boolean {
  return !post.draft && Date.parse(post.publishedAt) <= startOfToday();
}

/** Newest first; ties fall back to slug so the order is stable across builds. */
export function getPublishedPosts(): BlogPost[] {
  return posts
    .filter(isPublishable)
    .sort(
      (a, b) =>
        Date.parse(b.publishedAt) - Date.parse(a.publishedAt) ||
        a.slug.localeCompare(b.slug),
    );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getPublishedPosts().find((p) => p.slug === slug);
}

/** Explicitly featured wins; otherwise the most recent. Never a draft. */
export function getFeaturedPost(): BlogPost | undefined {
  const published = getPublishedPosts();
  return published.find((p) => p.featured) ?? published[0];
}

/** Only categories that actually contain a published article. */
export function getActiveCategories(): { category: BlogCategory; count: number }[] {
  const published = getPublishedPosts();
  return BLOG_CATEGORIES.map((category) => ({
    category,
    count: published.filter((p) => p.category === category).length,
  })).filter((entry) => entry.count > 0);
}

/**
 * Same category first, then shared tags, then most recent. The current
 * article and anything unpublished are excluded, and the result is empty
 * rather than padded when there is nothing genuinely relevant.
 */
export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  const others = getPublishedPosts().filter((p) => p.slug !== current.slug);
  const tags = new Set(current.tags ?? []);

  const score = (p: BlogPost) =>
    (p.category === current.category ? 2 : 0) +
    ((p.tags ?? []).some((t) => tags.has(t)) ? 1 : 0);

  return others
    .filter((p) => score(p) > 0)
    .sort(
      (a, b) =>
        score(b) - score(a) || Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
    )
    .slice(0, limit);
}

/* ── Presentation helpers ────────────────────────────────────────────────*/

/**
 * No verified individual author exists in this project, so articles are
 * attributed to the publication. A real name goes in `author` only once a
 * genuine person is approved.
 */
export const postAuthor = (post: BlogPost) => post.author ?? "Optara Digital";

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

export const postUrl = (post: BlogPost) => `${siteOrigin}/blog/${post.slug}`;

/** Stable, deterministic heading IDs — never generated from client state. */
export const headingId = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** A table of contents earns its place only on a genuinely sectioned article. */
export function getTableOfContents(body: BlogBlock[]) {
  const h2s = body.filter(
    (b): b is Extract<BlogBlock, { type: "heading" }> =>
      b.type === "heading" && b.level === 2,
  );
  return h2s.length >= 3
    ? h2s.map((h) => ({ id: headingId(h.text), text: h.text }))
    : [];
}

/* ── Planned topics ──────────────────────────────────────────────────────
   The outlines that previously rendered on /blog as though they were
   articles. Kept here so the editorial intent is not lost, deliberately not
   exported and not rendered anywhere:

     - "GEO vs SEO: what changes when AI answers the question"  (SEO & GEO)
     - "Why cost per qualified lead is the only number that matters"
     - "Rebuilding tracking before you spend another pound"
*/
