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
 * Copy for this page lives beside it rather than in lib/content.ts. It is used
 * by exactly one route, it is long, and colocating keeps the page readable —
 * the shared file is for content two or more places need.
 *
 * Nothing here names a client, a project or a figure. Every claim is about
 * what the work involves, not what it has achieved.
 */
const TITLE = "Branding Agency and Brand Strategy";
const DESCRIPTION =
  "Build a distinctive and consistent brand with Optara Digital's strategy, positioning, visual identity, verbal identity and brand-guideline services.";

const OUTCOMES = [
  {
    number: "01",
    title: "Clearer positioning",
    body: "Give customers a stronger reason to choose the business by defining what makes it relevant, valuable and different.",
  },
  {
    number: "02",
    title: "Stronger recognition",
    body: "Create a distinctive visual and verbal identity that becomes easier to recognise across repeated interactions.",
  },
  {
    number: "03",
    title: "Greater consistency",
    body: "Give teams a practical system for communicating with one voice across campaigns, content and digital experiences.",
  },
  {
    number: "04",
    title: "Better marketing performance",
    body: "Make search, advertising, social media and digital experiences more effective by giving every channel a clearer brand foundation.",
  },
];

const CAPABILITIES = [
  {
    title: "Brand strategy",
    body: "Define the foundations that shape how the business should be understood, positioned and chosen.",
    items: [
      "Research and discovery",
      "Audience definition",
      "Competitive positioning",
      "Brand purpose",
      "Value proposition",
      "Differentiation",
      "Brand architecture",
      "Strategic direction",
    ],
  },
  {
    title: "Verbal identity",
    body: "Create a clear and recognisable way for the business to communicate.",
    items: [
      "Brand voice",
      "Messaging framework",
      "Value proposition language",
      "Key messages",
      "Tagline development",
      "Naming support where appropriate",
      "Content principles",
      "Communication guidance",
    ],
  },
  {
    title: "Visual identity",
    body: "Build a distinctive visual system that translates the strategy into recognisable brand assets.",
    items: [
      "Logo system",
      "Typography",
      "Colour palette",
      "Graphic language",
      "Iconography",
      "Image direction",
      "Layout principles",
      "Digital application",
    ],
  },
  {
    title: "Brand guidelines",
    body: "Turn the identity into a practical system that teams and partners can apply consistently.",
    items: [
      "Logo usage",
      "Colour specifications",
      "Typography rules",
      "Messaging guidance",
      "Tone-of-voice principles",
      "Digital usage",
      "Campaign guidance",
      "Asset organisation",
    ],
  },
];

const PROCESS = [
  {
    number: "01",
    stage: "Discover",
    title: "Understand the business and the opportunity.",
    body: "We examine the business, audience, market and commercial objectives to identify the most valuable direction for the brand.",
    activities: [
      "Stakeholder discovery",
      "Audience understanding",
      "Competitive review",
      "Existing-brand assessment",
      "Commercial priorities",
    ],
  },
  {
    number: "02",
    stage: "Define",
    title: "Create a clear strategic position.",
    body: "We shape the positioning, value proposition, brand personality and central ideas that should guide every expression of the brand.",
    activities: [
      "Positioning",
      "Differentiation",
      "Value proposition",
      "Brand personality",
      "Messaging direction",
    ],
  },
  {
    number: "03",
    stage: "Design",
    title: "Translate the strategy into identity.",
    body: "We develop the visual and verbal system, testing how the brand performs across the touchpoints that matter most.",
    activities: [
      "Identity exploration",
      "Typography and colour",
      "Verbal identity",
      "Digital applications",
      "System refinement",
    ],
  },
  {
    number: "04",
    stage: "Deliver",
    title: "Create a system people can use consistently.",
    body: "We organise the final assets, guidance and practical applications needed for teams and partners to use the brand with confidence.",
    activities: [
      "Final assets",
      "Brand guidelines",
      "Usage principles",
      "Launch support",
      "Team handover",
    ],
  },
];

const SIGNS = [
  "The business has changed but the identity has not.",
  "Customers struggle to understand what makes the company different.",
  "Marketing feels inconsistent across channels.",
  "The visual identity looks dated or generic.",
  "The company is entering a new market or targeting a new audience.",
  "Teams communicate the value proposition differently.",
  "The website and campaigns no longer reflect the quality of the service.",
  "A merger, launch or repositioning requires a clearer system.",
];

const RELATED = [
  {
    name: "SEO & GEO",
    href: "/services/seo-geo",
    icon: "seo",
    body: "Clear positioning and language create stronger content themes and more meaningful search relevance.",
  },
  {
    name: "Google Ads",
    href: "/services/google-ads",
    icon: "ads",
    body: "A distinctive value proposition improves the connection between audience intent, advertising messages and landing pages.",
  },
  {
    name: "Social Media",
    href: "/services/social-media",
    icon: "social",
    body: "A consistent identity and voice make content easier to recognise across repeated interactions.",
  },
  {
    name: "Website Design",
    href: "/services/website-design",
    icon: "web",
    body: "Brand strategy guides messaging, hierarchy, visual direction and the complete digital experience.",
  },
  {
    name: "App Development",
    href: "/services/app-development",
    icon: "app",
    body: "A coherent identity helps digital products feel connected to the wider business and easier for users to trust.",
  },
] as const;

const FAQS: AccordionItem[] = [
  {
    question: "What is included in a branding project?",
    answer: [
      "Scope depends on what the business actually needs. A project can cover brand strategy and positioning, verbal identity and messaging, visual identity, brand guidelines, and the applications that put the brand to work.",
      "We agree the scope before starting, so it reflects the priority rather than a fixed package.",
    ],
  },
  {
    question: "Do we need a complete rebrand?",
    answer: [
      "Often not. Plenty of businesses have equity worth keeping, and replacing everything can lose more than it gains.",
      "We look at what should be retained, what should be refined and what genuinely needs replacing, then recommend the smallest change that solves the problem.",
    ],
  },
  {
    question: "Can Optara work with our existing logo?",
    answer: [
      "Yes, where it still supports the strategy. A logo that is recognised and working is an asset, and the wider identity around it is usually where the bigger gains are.",
      "If the mark is genuinely holding the business back we will say so, and explain why.",
    ],
  },
  {
    question: "How involved will our team need to be?",
    answer: [
      "Most involvement sits in discovery and at the decision points, where your knowledge of the business and its customers matters most.",
      "Between those stages the process is structured so it stays manageable alongside everything else your team is doing.",
    ],
  },
  {
    question: "Will we receive brand guidelines and final assets?",
    answer: [
      "Yes. The agreed final assets and the practical guidance needed to apply them are supplied according to the project scope, organised so teams and outside partners can use them without coming back for interpretation.",
    ],
  },
  {
    question: "Can you apply the brand to our website and marketing?",
    answer: [
      "Yes. Optara also provides website design, social media, Google Ads and related implementation support, so the identity can be applied consistently rather than handed over as a document and left there.",
    ],
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/branding" },
  openGraph: {
    title: `${TITLE} — ${site.name}`,
    description: DESCRIPTION,
    url: "/services/branding",
  },
};

/**
 * Structured data. WebPage, breadcrumbs and a Service describing what is
 * offered. No rating, review, price or service area — none of that is
 * verified, and schema is where an unsupported claim travels furthest.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}/services/branding#webpage`,
      url: `${siteOrigin}/services/branding`,
      name: `${TITLE} — ${site.name}`,
      description: DESCRIPTION,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteOrigin}/services` },
        { "@type": "ListItem", position: 3, name: "Branding", item: `${siteOrigin}/services/branding` },
      ],
    },
    {
      "@type": "Service",
      name: "Branding",
      serviceType: "Brand strategy and identity design",
      url: `${siteOrigin}/services/branding`,
      description:
        "Brand strategy, positioning, verbal identity, visual identity and brand guidelines.",
      provider: { "@type": "Organization", name: site.name, url: siteOrigin },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Branding capabilities",
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

export default function BrandingPage() {
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
                    Branding
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">Branding</p>
                <h1 className="t-display-xl mt-6 max-w-[15ch]">
                  Build a brand people{" "}
                  <span className="text-accent">recognise, trust and remember.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-8 max-w-[52ch] text-ink/75">
                  Optara brings positioning, identity and communication together
                  into one clear brand system. The result is a business that
                  feels more distinctive, more consistent and easier for the
                  right customers to choose.
                </p>
                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="/contact" withArrow className="justify-center">
                    Discuss your brand
                  </Button>
                  <Button href="#approach" variant="outline" className="justify-center">
                    Explore our approach
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* Strategy becoming identity becoming application: four labelled
                layers resolving onto one mark. Static — it has to read as a
                finished frame beside the page's only h1. */}
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
                  <p className="t-mono text-[var(--muted)]">The brand system</p>

                  {/* Strategy layer — real text, not labels inside a graphic. */}
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {["Positioning", "Audience", "Value proposition"].map((label) => (
                      <li
                        key={label}
                        className="rounded-full border border-accent/25 bg-accent/[0.06] px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/75"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>

                  {/* Verbal layer */}
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {["Voice", "Messaging"].map((label) => (
                      <li
                        key={label}
                        className="rounded-full border border-[var(--hairline)] px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/65"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-7 h-10 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.08))]"
                  />

                  {/* The mark the system resolves onto — the real one. */}
                  <div className="flex items-center justify-center">
                    <span className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full border border-accent/25 bg-paper">
                      <LogoMark className="h-9 w-9" />
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-7 h-10 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.08),rgba(91,61,245,0.45))]"
                  />

                  {/* Visual layer: type, colour, and the grid the mark sits on */}
                  <div className="grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-4">
                    <span className="font-[family-name:var(--font-wordmark)] text-[1.75rem] font-semibold uppercase leading-none tracking-[0.06em]">
                      Aa
                    </span>
                    <div className="flex flex-col gap-1.5">
                      <span className="block h-1.5 w-full rounded-full bg-ink/10" />
                      <span className="block h-1.5 w-3/4 rounded-full bg-ink/[0.07]" />
                    </div>
                    <div className="flex gap-1.5">
                      {[
                        "var(--color-accent)",
                        "var(--color-brand-blue)",
                        "var(--color-brand-violet)",
                        "var(--color-ink)",
                      ].map((c) => (
                        <span
                          key={c}
                          className="block h-5 w-5 rounded-full"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/55">
                      Applied consistently
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What strong branding changes ─────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Why branding matters</p>
                  <h2 className="t-display-lg mt-6 max-w-[20ch]">
                    A stronger brand improves{" "}
                    <span className="text-accent">every decision that follows.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Branding gives the business a clearer position, a more
                    recognisable identity and a consistent way to communicate.
                    That clarity strengthens marketing, improves customer
                    confidence and helps teams make better decisions across
                    every channel.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup
              as="ol"
              className="mt-16 grid gap-x-8 gap-y-10 md:grid-cols-2 xl:grid-cols-4"
              stagger={0.07}
              soft
            >
              {OUTCOMES.map((outcome) => (
                <RevealItem
                  as="li"
                  key={outcome.number}
                  className="relative border-t border-[var(--hairline)] pt-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                  />
                  <span className="t-mono text-accent">{outcome.number}</span>
                  <h3 className="mt-3.5 text-[1.125rem] font-medium leading-tight">
                    {outcome.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                    {outcome.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── Capabilities ─────────────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">What we do</p>
              <h2 className="t-display-lg mt-6 max-w-[22ch]">
                Everything needed to create a{" "}
                <span className="text-accent">clear and coherent brand.</span>
              </h2>
            </RevealText>

            {/* Four stacked sections rather than a selector: every capability
                stays visible and readable, with nothing behind a control and
                no state that can render blank. */}
            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.07} soft>
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
                    <p className="mt-4 max-w-[38ch] text-[1.0625rem] leading-[1.65] text-ink/75">
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

        {/* ── The process ──────────────────────────────────────────────── */}
        <section
          id="approach"
          data-theme="bone"
          className="section scroll-mt-28 bg-[var(--bg)]"
        >
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Our approach</p>
              <h2 className="t-display-lg mt-6 max-w-[22ch]">
                From strategic clarity to a brand{" "}
                <span className="text-accent">people can recognise.</span>
              </h2>
            </RevealText>

            <RevealGroup
              as="ol"
              className="mt-14 grid gap-y-10 md:grid-cols-2 md:gap-x-10 xl:grid-cols-4 xl:gap-x-8"
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
                    <h3 className="text-[1.125rem] font-medium">{step.stage}</h3>
                  </div>
                  <p className="mt-3.5 max-w-[30ch] text-[1.0625rem] font-medium leading-[1.4]">
                    {step.title}
                  </p>
                  <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink/70">
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

        {/* ── When to revisit the brand ────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div className="lg:col-span-5">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">When to revisit the brand</p>
                <h2 className="t-display-lg mt-6">
                  The business may have evolved{" "}
                  <span className="text-accent">beyond the brand representing it.</span>
                </h2>
                <p className="t-body-lg mt-7 max-w-[40ch] text-ink/75">
                  Not every business needs to replace everything. Sometimes the
                  greatest value comes from refining the positioning, improving
                  consistency or strengthening selected parts of the existing
                  identity.
                </p>
              </RevealText>
            </div>

            <RevealGroup
              as="ul"
              className="lg:col-span-6 lg:col-start-7"
              stagger={0.05}
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
                  <span className="text-[1.0625rem] leading-[1.55] text-ink/80">
                    {sign}
                  </span>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── How branding strengthens the rest ────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">
                    Built to strengthen everything else
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[20ch]">
                    A clearer brand makes every{" "}
                    <span className="text-accent">marketing channel work harder.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Branding provides the foundation that search, advertising,
                    social media, websites and applications build upon. When the
                    positioning, identity and message are clear, every customer
                    interaction becomes more consistent and every channel has a
                    stronger idea to communicate.
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
                  Branding <span className="text-accent">questions.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="branding-faq" />
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
              <h2 className="t-display-lg max-w-[18ch] text-paper">
                Ready to build a brand with{" "}
                <span className="text-[var(--accent-fg)]">greater clarity?</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[46ch] text-[rgba(255,255,255,0.78)]">
                Tell us where the business is heading and what the current brand
                is struggling to communicate. We will help identify the
                strongest place to begin.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="flex flex-col items-start gap-5">
                <Button href="/contact" variant="light" withArrow>
                  Discuss your brand
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
