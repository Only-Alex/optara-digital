import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { siteOrigin } from "@/lib/site-url";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { ArrowIcon, LogoMark } from "@/components/ui/Icons";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

/**
 * Copy lives beside the route, as on the Branding page: used by one page,
 * long, and easier to read next to the markup it fills.
 *
 * The honesty constraint on this page is sharper than most. Nothing may
 * guarantee a ranking, a citation or an appearance in a generated answer,
 * because the platforms decide those. Nothing states a timescale. No figure
 * appears anywhere — no volumes, no positions, no traffic, no authority score.
 */
const TITLE = "SEO and GEO Agency | Search and AI Visibility";
const DESCRIPTION =
  "Improve visibility across traditional search and AI-powered discovery with Optara Digital's technical SEO, content strategy and generative engine optimisation services.";

const DISCOVERY = [
  {
    number: "01",
    title: "Traditional search",
    body: "People search for specific services, products and answers through established search engines.",
  },
  {
    number: "02",
    title: "Generative discovery",
    body: "People use AI-powered tools to research choices, understand topics and compare possible solutions.",
  },
  {
    number: "03",
    title: "Connected decision journeys",
    body: "Discovery rarely ends at the answer. Customers still need useful pages, clear evidence and a straightforward next step before they act.",
  },
];

const SHARED_FOUNDATION = [
  "Technical quality",
  "Useful content",
  "Clear structure",
  "Authority",
  "Entity consistency",
];

const DISCIPLINES = [
  {
    short: "SEO",
    title: "Search Engine Optimisation",
    body: "SEO improves how search engines access, understand and evaluate a website. It connects technical performance, useful content, site structure and authority around the searches most relevant to the business.",
    pathwayLabel: "How it reaches people",
    pathway: ["Crawling", "Indexation", "Ranking", "Search result", "Landing page"],
    covers: [
      "Crawlability and indexation",
      "Technical performance",
      "Site architecture",
      "Search intent",
      "On-page optimisation",
      "Content quality",
      "Internal linking",
      "Authority and trust",
      "Local or national visibility where appropriate",
      "Measurement and improvement",
    ],
  },
  {
    short: "GEO",
    title: "Generative Engine Optimisation",
    body: "GEO improves how clearly a business, its expertise and its information can be understood within AI-powered research and answer environments. It builds upon strong SEO, structured information, credible content and consistent entity signals.",
    pathwayLabel: "How it reaches people",
    pathway: ["Understanding", "Retrieval", "Synthesis", "Answer inclusion", "Source discovery"],
    covers: [
      "Clear entity information",
      "Consistent brand and service descriptions",
      "Structured content",
      "Direct and useful answers",
      "Topic depth",
      "Source clarity",
      "Evidence and expertise",
      "Structured data where appropriate",
      "Content formats suited to summarisation",
      "Monitoring generative visibility where reliable measurement is available",
    ],
  },
];

const CAPABILITIES = [
  {
    title: "Technical SEO",
    body: "Build a technically sound foundation that search engines can access, understand and evaluate efficiently.",
    items: [
      "Technical audits",
      "Crawlability",
      "Indexation",
      "Site architecture",
      "Internal linking",
      "Core Web Vitals guidance",
      "Canonicalisation",
      "Redirect strategy",
      "Structured data",
      "International considerations where relevant",
    ],
  },
  {
    title: "Search strategy",
    body: "Identify the searches, audiences and commercial priorities that should guide the wider SEO programme.",
    items: [
      "Search-intent research",
      "Keyword and topic analysis",
      "Audience needs",
      "Competitor review",
      "Opportunity mapping",
      "Page planning",
      "Search-journey mapping",
      "Priority setting",
    ],
  },
  {
    title: "Content and on-page SEO",
    body: "Create and improve content so that it answers genuine questions, communicates expertise and supports meaningful customer journeys.",
    items: [
      "On-page optimisation",
      "Content briefs",
      "Topic planning",
      "Service-page improvement",
      "Editorial content",
      "Information hierarchy",
      "Internal linking",
      "Content consolidation",
      "Search-focused copy guidance",
    ],
  },
  {
    title: "GEO and AI discovery",
    body: "Structure information so that the business, its expertise and its services are easier to understand across generative search environments.",
    items: [
      "Entity consistency",
      "Generative-answer research",
      "Direct-answer content",
      "Structured information",
      "Source clarity",
      "Expert-content development",
      "FAQ and comparison content",
      "Citation-readiness guidance",
      "AI-discovery monitoring where practical",
    ],
  },
  {
    title: "Authority and trust",
    body: "Strengthen the external and on-site signals that help audiences and search systems evaluate the credibility of the business.",
    items: [
      "Authority assessment",
      "Digital PR alignment",
      "Expert contribution strategy",
      "Brand-mention consistency",
      "Link-quality review",
      "Trust-page recommendations",
      "Author and organisation signals",
      "Reputation-source alignment",
    ],
  },
  {
    title: "Measurement and optimisation",
    body: "Connect visibility data with meaningful website behaviour and commercial outcomes.",
    items: [
      "Search Console analysis",
      "Analytics review",
      "Landing-page performance",
      "Enquiry-path analysis",
      "Conversion tracking guidance",
      "Query and page reporting",
      "Generative-visibility observation",
      "Priority refinement",
    ],
  },
];

const SYSTEM_LAYERS = [
  { layer: "Technical access", parts: ["Crawlability", "Indexation", "Performance"] },
  { layer: "Understanding and relevance", parts: ["Search intent", "Topic relevance", "Content quality", "Entity clarity"] },
  { layer: "Authority and trust", parts: ["Credibility signals", "Brand consistency", "Expertise"] },
  { layer: "Discovery channels", parts: ["Traditional visibility", "Generative visibility"] },
  { layer: "Landing-page action", parts: ["Relevant page", "Useful next step"] },
  { layer: "Measurement and refinement", parts: ["Query and page reporting", "Enquiry paths", "Priority refinement"] },
];

const PROCESS = [
  {
    number: "01",
    stage: "Discover",
    title: "Understand the business, audience and current visibility.",
    body: "We examine commercial objectives, existing performance, customer needs and the wider search environment to identify where improvement can create the greatest value.",
    activities: [
      "Stakeholder discovery",
      "Website review",
      "Search visibility assessment",
      "Audience needs",
      "Competitor context",
      "Analytics review where access is available",
    ],
  },
  {
    number: "02",
    stage: "Diagnose",
    title: "Identify the technical and content barriers.",
    body: "We assess how the website is structured, understood and discovered, separating urgent technical issues from wider strategic opportunities.",
    activities: [
      "Technical audit",
      "Indexation review",
      "Content assessment",
      "Entity consistency",
      "Internal linking",
      "Authority review",
      "Conversion-path review",
    ],
  },
  {
    number: "03",
    stage: "Prioritise",
    title: "Build a practical visibility roadmap.",
    body: "We rank opportunities by commercial relevance, expected value, effort and dependency so the programme begins with the work most likely to create meaningful progress.",
    activities: [
      "Opportunity mapping",
      "Page priorities",
      "Technical roadmap",
      "Content roadmap",
      "GEO priorities",
      "Measurement planning",
    ],
  },
  {
    number: "04",
    stage: "Implement",
    title: "Improve the website, content and discovery signals.",
    body: "We complete or guide the agreed technical, content and structural improvements, ensuring every action supports the wider customer journey.",
    activities: [
      "Technical implementation",
      "Page optimisation",
      "Content creation",
      "Structured data",
      "Internal linking",
      "Entity clarification",
      "Landing-page improvements",
    ],
  },
  {
    number: "05",
    stage: "Improve",
    title: "Measure, learn and refine.",
    body: "We review how visibility and customer behaviour change over time, then use that evidence to sharpen priorities and strengthen the complete system.",
    activities: [
      "Search performance analysis",
      "Landing-page behaviour",
      "Enquiry-path review",
      "Generative-visibility observation",
      "Content refinement",
      "New opportunity identification",
    ],
  },
];

const SIGNS = [
  "The website receives traffic but few suitable enquiries.",
  "Important service pages do not appear for relevant searches.",
  "Search visibility depends heavily on branded queries.",
  "The website has technical indexation or performance issues.",
  "Content exists but lacks a clear topic or customer-intent strategy.",
  "Competitors appear more consistently across organic results.",
  "The business is unclear how it appears within AI-powered research.",
  "A website migration or redesign has affected visibility.",
  "Search and paid campaigns are targeting disconnected landing pages.",
  "Reporting focuses on rankings without showing commercial value.",
];

const RELATED = [
  {
    name: "Branding",
    href: "/services/branding",
    icon: "branding",
    body: "Clear positioning and consistent language help search systems and customers understand what the business represents.",
  },
  {
    name: "Google Ads",
    href: "/services/google-ads",
    icon: "ads",
    body: "Paid-search data can reveal high-intent queries while organic visibility strengthens long-term demand capture.",
  },
  {
    name: "Social Media",
    href: "/services/social-media",
    icon: "social",
    body: "Useful content and brand visibility can support authority, discovery and wider audience understanding.",
  },
  {
    name: "Website Design",
    href: "/services/website-design",
    icon: "web",
    body: "Technical quality, information architecture and landing-page usability directly affect discovery and conversion.",
  },
  {
    name: "App Development",
    href: "/services/app-development",
    icon: "app",
    body: "Search can help users discover valuable tools, platforms and customer-facing digital products where relevant.",
  },
] as const;

const FAQS: AccordionItem[] = [
  {
    question: "What is the difference between SEO and GEO?",
    answer: [
      "SEO focuses on how traditional search engines crawl, index, rank and display a website. GEO focuses on how clearly a business and its expertise can be understood inside AI-powered research and answer environments.",
      "They are not separate programmes. Both depend on the same foundations: a technically sound site, genuinely useful content, clear structure and credible authority.",
    ],
  },
  {
    question: "Does GEO replace traditional SEO?",
    answer: [
      "No. Traditional search remains a major route to discovery, and generative tools lean heavily on the same content and technical quality that conventional search rewards.",
      "GEO is an extension of good SEO practice, not a substitute for it. A site with weak foundations does not become discoverable in AI answers by skipping the fundamentals.",
    ],
  },
  {
    question: "Can you guarantee first-page rankings or AI citations?",
    answer: [
      "No, and we would treat any agency that does with caution. Search engines and AI platforms control their own results, change them without notice, and do not sell placement in organic listings or generated answers.",
      "What we can do is improve the factors that genuinely influence visibility: technical quality, relevance, clarity, structure and authority. We report on what actually changed rather than on a promise made at the start.",
    ],
  },
  {
    question: "How long does SEO usually take to show progress?",
    answer: [
      "It depends on the state of the website, the competitiveness of the market and the scope of the work, so we will not put a fixed period on it before looking.",
      "As a general shape: technical corrections can register comparatively quickly, while authority and content depth build over sustained effort. We set expectations per area of work once we have assessed the site.",
    ],
  },
  {
    question: "Can you work with our existing website?",
    answer: [
      "Usually, yes. Most sites can be assessed and improved in place, and that is often the faster and more sensible route.",
      "Where a structural or platform limitation genuinely prevents meaningful progress, we will say so directly and set out the options rather than charging for work that cannot succeed.",
    ],
  },
  {
    question: "What do you measure in an SEO and GEO programme?",
    answer: [
      "Qualified visibility, the searches that bring people in, how those visitors behave on the pages that matter, and the enquiries that follow. Rankings are context, not the headline.",
      "Generative visibility is measured more carefully and described more cautiously, because platform reporting is inconsistent and far less deterministic than traditional search data. We will be clear about what can be observed and what cannot.",
    ],
  },
  {
    question: "Do you create the content as well as the strategy?",
    answer: [
      "Yes. Depending on the agreed scope we can provide strategy and briefs for your team to write against, optimise content you already have, or research and write it ourselves.",
    ],
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/seo-geo" },
  openGraph: {
    title: `${TITLE} — ${site.name}`,
    description: DESCRIPTION,
    url: "/services/seo-geo",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}/services/seo-geo#webpage`,
      url: `${siteOrigin}/services/seo-geo`,
      name: `${TITLE} — ${site.name}`,
      description: DESCRIPTION,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteOrigin}/services` },
        { "@type": "ListItem", position: 3, name: "SEO & GEO", item: `${siteOrigin}/services/seo-geo` },
      ],
    },
    {
      "@type": "Service",
      name: "SEO & GEO",
      serviceType: "Search engine optimisation and generative engine optimisation",
      url: `${siteOrigin}/services/seo-geo`,
      description:
        "Technical SEO, search strategy, content and on-page optimisation, generative engine optimisation, authority development and search measurement.",
      provider: { "@type": "Organization", name: site.name, url: siteOrigin },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "SEO and GEO capabilities",
        itemListElement: CAPABILITIES.map((group) => ({
          "@type": "OfferCatalog",
          name: group.title,
          itemListElement: group.items.map((item) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: item },
          })),
        })),
      },
    },
  ],
};

export default function SeoGeoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          data-theme="paper"
          className="relative overflow-hidden bg-[var(--bg)] pb-20 pt-36 md:pt-44"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[74rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.09),transparent_66%)]"
          />
          <div className="shell relative grid gap-14 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1fr)] lg:items-center lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div>
              <nav aria-label="Breadcrumb" className="mb-7">
                <ol className="t-mono flex flex-wrap items-center gap-2 text-[var(--muted)]">
                  <li>
                    <Link href="/" className="transition-colors duration-200 hover:text-accent">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/services" className="transition-colors duration-200 hover:text-accent">
                      Services
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink/70">
                    SEO &amp; GEO
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">SEO &amp; GEO</p>
                <h1 className="t-display-xl mt-6 max-w-[15ch]">
                  Be visible wherever your customers{" "}
                  <span className="text-accent">search for answers.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-8 max-w-[52ch] text-ink/75">
                  Optara connects technical SEO, content strategy and generative
                  search optimisation to help your business become easier to
                  discover across traditional search engines and AI-powered
                  research journeys.
                </p>
                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="/contact" withArrow className="justify-center">
                    Discuss your search visibility
                  </Button>
                  <Button href="#approach" variant="outline" className="justify-center">
                    Explore our approach
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* One question travelling through the system and arriving in two
                places at once. Every label is real text, so it is readable,
                selectable and available to a screen reader — the diagram is a
                layout, not a picture of words. */}
            <div className="relative">
              <div
                data-theme="bone"
                className="relative overflow-hidden rounded-[18px] border border-[rgba(18,19,26,0.09)] bg-[var(--bg)] p-7 shadow-[0_1px_2px_rgba(18,19,26,0.04),0_20px_60px_rgba(18,19,26,0.07)] md:p-9"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(18,19,26,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(18,19,26,0.04)_1px,transparent_1px)] [background-size:34px_34px]"
                />
                <div className="relative">
                  <p className="t-mono text-[var(--muted)]">Search intent</p>
                  <p className="mt-3 rounded-full border border-accent/25 bg-paper px-4 py-2.5 text-[0.9375rem] text-ink/70">
                    “Who can help us with…”
                  </p>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-5 h-8 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  <p className="t-mono text-[var(--muted)]">Understanding</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {["Technical foundation", "Topic relevance", "Entity understanding", "Authority signals"].map(
                      (label) => (
                        <li
                          key={label}
                          className="rounded-full border border-[var(--hairline)] bg-paper px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/70"
                        >
                          {label}
                        </li>
                      ),
                    )}
                  </ul>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-5 h-8 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.12),rgba(91,61,245,0.45))]"
                  />

                  {/* Two routes, side by side and equal — neither replaces the
                      other, which is the argument the whole page makes. */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { k: "Organic discovery", v: "Search result" },
                      { k: "Generative discovery", v: "Cited source" },
                    ].map((route) => (
                      <div
                        key={route.k}
                        className="rounded-[12px] border border-accent/20 bg-accent/[0.05] p-3.5"
                      >
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                          {route.k}
                        </p>
                        <p className="mt-2 text-[0.9375rem] leading-tight text-ink/75">{route.v}</p>
                      </div>
                    ))}
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-5 h-8 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  <div className="flex items-center gap-3 rounded-[12px] border border-[var(--hairline)] bg-paper p-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/[0.08]">
                      <LogoMark className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-[var(--muted)]">
                        Relevant landing page
                      </span>
                      <span className="mt-1 block text-[0.9375rem] leading-tight">
                        A useful next step
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How search is changing ───────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Search is evolving</p>
                  <h2 className="t-display-lg mt-6 max-w-[18ch]">
                    Discovery no longer happens{" "}
                    <span className="text-accent">in one place.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Customers still use search engines to compare services, find
                    suppliers and make decisions. They also use AI-powered tools
                    to summarise information, explore options and answer complex
                    questions. Businesses now need content and technical
                    foundations that support both forms of discovery.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup
              as="ol"
              className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-3"
              stagger={0.07}
              soft
            >
              {DISCOVERY.map((item) => (
                <RevealItem
                  as="li"
                  key={item.number}
                  className="relative border-t border-[var(--hairline)] pt-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                  />
                  <span className="t-mono text-accent">{item.number}</span>
                  <h3 className="mt-3.5 text-[1.125rem] font-medium leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[36ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                    {item.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── SEO and GEO ──────────────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Two connected disciplines</p>
              <h2 className="t-display-lg mt-6 max-w-[24ch]">
                SEO builds the foundation.{" "}
                <span className="text-accent">GEO strengthens generative discovery.</span>
              </h2>
            </RevealText>

            {/* The shared foundation is stated first and once, above both
                columns, because that is the actual relationship: two routes
                off one base, not two competing products. */}
            <div className="mt-12 rounded-[16px] border border-[var(--hairline)] bg-[color-mix(in_srgb,var(--color-bone)_55%,var(--color-paper))] p-6 md:p-8">
              <p className="t-mono text-[var(--muted)]">Shared foundation</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SHARED_FOUNDATION.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-accent/25 bg-accent/[0.06] px-3.5 py-1.5 text-[0.875rem] text-ink/75"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <RevealGroup
              as="ul"
              className="mt-4 grid gap-4 lg:grid-cols-2"
              stagger={0.08}
              soft
            >
              {DISCIPLINES.map((d) => (
                <RevealItem
                  as="li"
                  key={d.short}
                  className="rounded-[16px] border border-[var(--hairline)] p-6 md:p-8"
                >
                  <span className="t-mono text-accent">{d.short}</span>
                  <h3 className="t-display-md mt-3.5 text-[clamp(1.375rem,2vw,1.75rem)]">
                    {d.title}
                  </h3>
                  <p className="mt-4 text-[1.0625rem] leading-[1.65] text-ink/75">{d.body}</p>

                  <p className="t-mono mt-7 text-[var(--muted)]">{d.pathwayLabel}</p>
                  <ol className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
                    {d.pathway.map((step, i) => (
                      <li key={step} className="flex items-center gap-2">
                        <span className="rounded-full border border-[var(--hairline)] px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/70">
                          {step}
                        </span>
                        {i < d.pathway.length - 1 && (
                          <span aria-hidden="true" className="text-accent/50">
                            →
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>

                  <ul className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                    {d.covers.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[0.9375rem] leading-[1.5] text-ink/70"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] block h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Stated plainly rather than buried in the FAQ. This is the
                sentence that separates honest search work from the rest of
                the category. */}
            <RevealText delay={0.1}>
              <div className="mt-4 rounded-[16px] border border-accent/25 bg-accent/[0.04] p-6 md:p-8">
                <h3 className="text-[1.0625rem] font-medium">What GEO cannot do</h3>
                <p className="mt-3 max-w-[76ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                  GEO does not replace SEO, and no agency can guarantee that an
                  AI platform will mention or cite a business. The platforms
                  decide how their answers are produced and change them without
                  notice. What good GEO work does is make a business easier to
                  understand and more credible to draw on — and measurement
                  across generative platforms is less consistent than
                  traditional search reporting, so we describe it carefully
                  rather than presenting it as precise.
                </p>
              </div>
            </RevealText>
          </div>
        </section>

        {/* ── Capabilities ─────────────────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">What we do</p>
              <h2 className="t-display-lg mt-6 max-w-[24ch]">
                A complete visibility system built around{" "}
                <span className="text-accent">relevance and intent.</span>
              </h2>
            </RevealText>

            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {CAPABILITIES.map((group, i) => (
                <RevealItem
                  as="li"
                  key={group.title}
                  className="grid gap-6 border-t border-[var(--hairline)] py-10 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)] md:py-12"
                >
                  <div className="md:col-span-5">
                    <span className="t-mono text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="t-display-md mt-3.5 text-[clamp(1.375rem,2vw,1.75rem)]">
                      {group.title}
                    </h3>
                    <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                      {group.body}
                    </p>
                  </div>
                  <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2 md:col-span-6 md:col-start-7 md:self-center">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[0.9375rem] leading-[1.5] text-ink/70"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] block h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── The visibility system ────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">One connected visibility system</p>
                  <h2 className="t-display-lg mt-6 max-w-[24ch]">
                    Technical quality creates access. Useful content creates
                    relevance.{" "}
                    <span className="text-accent">Authority creates confidence.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Search visibility is rarely improved through one isolated
                    change. Technical foundations, search intent, content,
                    authority and conversion journeys need to reinforce one
                    another. Optara connects those elements so that discovery
                    leads towards useful pages and meaningful action.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* Six stacked layers rather than a node diagram: it stays legible
                at every width, and nothing depends on tiny labels inside an
                SVG that a reader cannot select or a screen reader announce. */}
            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {SYSTEM_LAYERS.map((row, i) => (
                <RevealItem
                  as="li"
                  key={row.layer}
                  className="grid items-center gap-4 border-t border-[var(--hairline)] py-6 md:grid-cols-[auto_minmax(0,15rem)_1fr] md:gap-6"
                >
                  <span className="t-mono text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium leading-tight">{row.layer}</h3>
                  <ul className="flex flex-wrap gap-2">
                    {row.parts.map((part) => (
                      <li
                        key={part}
                        className="rounded-full border border-[var(--hairline)] px-3 py-1.5 text-[0.875rem] text-ink/70"
                      >
                        {part}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>

            <p className="mt-10 text-[1.0625rem] text-ink/75">
              The outcome these layers exist to produce:{" "}
              <span className="font-medium text-accent">qualified discovery</span>.
            </p>
          </div>
        </section>

        {/* ── Process ──────────────────────────────────────────────────── */}
        <section
          id="approach"
          data-theme="bone"
          className="section scroll-mt-28 bg-[var(--bg)]"
        >
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Our approach</p>
              <h2 className="t-display-lg mt-6 max-w-[22ch]">
                From search opportunity to{" "}
                <span className="text-accent">continuous improvement.</span>
              </h2>
            </RevealText>

            <RevealGroup
              as="ol"
              className="mt-14 grid gap-y-10 md:grid-cols-2 md:gap-x-10 xl:grid-cols-5 xl:gap-x-7"
              stagger={0.07}
              soft
            >
              {PROCESS.map((step) => (
                <RevealItem
                  as="li"
                  key={step.number}
                  className="relative border-t border-[var(--hairline)] pt-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                  />
                  <div className="flex items-baseline gap-3">
                    <span className="t-mono text-accent">{step.number}</span>
                    <h3 className="text-[1.0625rem] font-medium">{step.stage}</h3>
                  </div>
                  <p className="mt-3.5 max-w-[28ch] text-[1rem] font-medium leading-[1.4]">
                    {step.title}
                  </p>
                  <p className="mt-3 max-w-[32ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                    {step.body}
                  </p>
                  <ul className="mt-5 flex flex-col gap-1.5">
                    {step.activities.map((activity) => (
                      <li
                        key={activity}
                        className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/55"
                      >
                        {activity}
                      </li>
                    ))}
                  </ul>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── When to review ───────────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div className="lg:col-span-5">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">When to review search visibility</p>
                <h2 className="t-display-lg mt-6">
                  Strong businesses can remain{" "}
                  <span className="text-accent">difficult to discover.</span>
                </h2>
                <p className="t-body-lg mt-7 max-w-[40ch] text-ink/75">
                  Not every business needs an extensive SEO programme. Sometimes
                  the greatest value comes from correcting technical
                  foundations, improving priority pages or building a clearer
                  strategy around a focused set of opportunities.
                </p>
              </RevealText>
            </div>

            <RevealGroup
              as="ul"
              className="lg:col-span-6 lg:col-start-7"
              stagger={0.04}
              soft
            >
              {SIGNS.map((sign, i) => (
                <RevealItem
                  as="li"
                  key={sign}
                  className="flex items-start gap-5 border-b border-[var(--hairline)] py-4 first:border-t"
                >
                  <span className="t-mono shrink-0 text-[var(--muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.0625rem] leading-[1.55] text-ink/80">{sign}</span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── Related services ─────────────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">
                    Built to connect with the complete journey
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Visibility creates opportunity.{" "}
                    <span className="text-accent">
                      The wider experience determines what happens next.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    SEO and GEO help suitable audiences discover the business.
                    Branding shapes what they understand. Google Ads captures
                    immediate demand. Social Media strengthens visibility and
                    trust. Website Design and App Development turn interest into
                    useful digital experiences.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup
              as="ul"
              className="mt-14 grid gap-x-8 gap-y-2 md:grid-cols-2"
              stagger={0.05}
              soft
            >
              {RELATED.map((service) => (
                <RevealItem as="li" key={service.href}>
                  <Link
                    href={service.href}
                    className="group flex h-full items-start gap-4 rounded-[16px] border border-transparent p-5 transition-colors duration-200 hover:border-[var(--hairline)] hover:bg-paper focus-visible:border-[var(--hairline)] focus-visible:bg-paper"
                  >
                    <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/[0.07] text-accent transition-colors duration-200 group-hover:bg-accent/[0.14]">
                      <ServiceIcon name={service.icon} className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-[1.0625rem] font-medium transition-colors duration-200 group-hover:text-accent">
                        {service.name}
                        <ArrowIcon
                          aria-hidden="true"
                          className="h-4 w-4 shrink-0 text-accent opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100 group-focus-visible:opacity-100"
                        />
                      </span>
                      <span className="mt-2 block max-w-[42ch] text-[0.9375rem] leading-[1.55] text-ink/70">
                        {service.body}
                      </span>
                    </span>
                  </Link>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:gap-x-[clamp(3rem,5vw,7rem)]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">Questions</p>
                <h2 className="t-display-lg mt-6 max-w-[14ch]">
                  Search <span className="text-accent">questions.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="seo-faq" />
            </div>
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
                Ready to improve how your business is{" "}
                <span className="text-[var(--accent-fg)]">discovered?</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                Tell us where search visibility is currently falling short and
                which opportunities matter most. We will help identify the
                strongest place to begin across technical SEO, content and
                generative discovery.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="flex flex-col items-start gap-5">
                <Button href="/contact" variant="light" withArrow>
                  Discuss your search visibility
                </Button>
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-[0.9375rem] text-[rgba(255,255,255,0.72)] transition-colors duration-200 hover:text-paper"
                >
                  Explore all services
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
