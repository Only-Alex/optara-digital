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
 * Copy lives beside the route, as on the other service pages.
 *
 * The honesty constraints here are specific to web design, where the easiest
 * lies are technical ones. No Lighthouse score, page-speed figure, conversion
 * rate, traffic number or launch timeframe appears anywhere. No invented
 * client interface or screenshot appears, because a convincing fake site
 * implies a portfolio that does not exist. No content management system is
 * named, because none is used or integrated anywhere in this project — the
 * capability list below is limited to what this codebase itself demonstrates.
 * No accessibility certification or legal-compliance claim is made without an
 * audit. And ecommerce is declined in the same terms the site already uses on
 * the homepage FAQ, rather than quietly added because it sounds like revenue.
 */
const TITLE = "Website Design and Development";
const DESCRIPTION =
  "Create a clearer, faster and more effective digital experience with Optara Digital's website strategy, information architecture, UX and interface design and modern development.";

const OUTCOMES = [
  {
    number: "01",
    title: "Clearer understanding",
    body: "Help visitors recognise what the business provides, who it is for and why it matters, without asking them to interpret vague language.",
  },
  {
    number: "02",
    title: "Greater confidence",
    body: "Use coherent branding, useful evidence, considered interaction and professional execution to reduce the uncertainty that stops people enquiring.",
  },
  {
    number: "03",
    title: "Easier action",
    body: "Create clear journeys and appropriate next steps that remove unnecessary friction without pressuring the visitor into anything.",
  },
  {
    number: "04",
    title: "Stronger marketing performance",
    body: "Give search, advertising, social media and campaigns a more relevant destination that keeps the promise made before the visitor arrived.",
  },
];

/**
 * Ten stages, grouped into four phases. A flat ten-row list reads as a
 * checklist; the phases are what make it a journey.
 */
const JOURNEY = [
  {
    phase: "Arrive",
    steps: [
      { step: "Traffic source or customer need", note: "What brought the visitor here, and what they were hoping to find" },
      { step: "Relevant landing point", note: "Whether they land somewhere that matches that expectation" },
    ],
  },
  {
    phase: "Understand",
    steps: [
      { step: "Clear message", note: "What the business does, for whom, in the first screen" },
      { step: "Information hierarchy", note: "What to read first, and where the detail lives" },
      { step: "Supporting evidence", note: "The reasons to believe any of it" },
    ],
  },
  {
    phase: "Decide",
    steps: [
      { step: "Interaction and exploration", note: "Comparing, reading further, checking the awkward questions" },
      { step: "Appropriate next step", note: "An action that fits how ready the person actually is" },
      { step: "Conversion or useful outcome", note: "An enquiry, a call, a download, a return visit" },
    ],
  },
  {
    phase: "Improve",
    steps: [
      { step: "Measurement", note: "Where people hesitated, left or arrived at the wrong page" },
      { step: "Improvement", note: "What that evidence changes about the next iteration" },
    ],
  },
];

/**
 * Four chapters rather than nine parallel cards, because the brief's nine
 * disciplines are really four decisions: what the site is for, what it says,
 * how it is made, and how it keeps earning its place.
 */
const CAPABILITIES = [
  {
    title: "Strategy and structure",
    body: "Define the role the website should play within the business and the wider marketing system, then organise the content so visitors can find what is relevant to them.",
    visual: ["Objective", "Audience need", "Sitemap", "Page relationships", "Journey priorities"],
    disciplines: [
      {
        name: "Digital strategy",
        items: [
          "Business-objective discovery",
          "Audience understanding",
          "Existing-site assessment",
          "Competitor context",
          "Customer-journey mapping",
          "Conversion planning",
          "Content priorities",
          "Measurement planning",
        ],
      },
      {
        name: "Information architecture",
        items: [
          "Sitemap planning",
          "Navigation structure",
          "Page hierarchy",
          "Content relationships",
          "User flows",
          "Service architecture",
          "Internal linking",
          "Scalable content structure",
        ],
      },
    ],
  },
  {
    title: "UX and messaging",
    body: "Shape journeys people can actually complete, and a communication hierarchy that connects what the customer needs with what the business is genuinely good at.",
    visual: ["User flow", "Message hierarchy", "Supporting evidence", "CTA progression", "Form path"],
    disciplines: [
      {
        name: "UX design",
        items: [
          "User journeys",
          "Wireframes",
          "Interaction planning",
          "Task flows",
          "Form journeys",
          "Mobile experience",
          "Accessibility considerations",
          "Prototype review",
        ],
      },
      {
        name: "Messaging and content structure",
        items: [
          "Message hierarchy",
          "Page objectives",
          "Headline direction",
          "Value-proposition structure",
          "Service-page planning",
          "CTA strategy",
          "Proof and reassurance placement",
          "Search-informed content structure",
        ],
      },
    ],
  },
  {
    title: "Interface and development",
    body: "Translate the strategy, brand and user journey into a coherent responsive interface, then build it on a foundation that stays maintainable after launch.",
    visual: ["Design tokens", "Components", "Responsive breakpoints", "Semantic structure", "Technical foundation"],
    disciplines: [
      {
        name: "UI and visual design",
        items: [
          "Creative direction",
          "Interface design",
          "Design systems",
          "Typography",
          "Colour application",
          "Component design",
          "Responsive layouts",
          "Interaction design",
          "Motion direction",
        ],
      },
      {
        name: "Development",
        items: [
          "Next.js App Router development",
          "TypeScript",
          "Responsive implementation",
          "Reusable component systems",
          "Enquiry-form implementation",
          "Technical SEO foundations",
          "Accessibility implementation",
          "Performance work",
        ],
      },
    ],
  },
  {
    title: "Conversion, performance and evolution",
    body: "Connect message, interface and interaction so the next step is obvious, then keep the experience fast, usable and open to improvement once real people are using it.",
    visual: ["Customer action", "Journey measurement", "Experience signals", "Improvement priorities", "Content evolution"],
    disciplines: [
      {
        name: "Conversion-focused journeys",
        items: [
          "CTA hierarchy",
          "Enquiry journeys",
          "Form-friction review",
          "Landing-page design",
          "Trust and reassurance placement",
          "Mobile conversion paths",
          "Journey measurement",
          "Iterative improvement",
        ],
      },
      {
        name: "Performance and accessibility",
        items: [
          "Responsive performance",
          "Image optimisation",
          "Layout stability",
          "Semantic structure",
          "Keyboard accessibility",
          "Reduced-motion support",
          "Colour contrast",
          "Core Web Vitals awareness",
          "Device and browser checks",
        ],
      },
    ],
  },
];

const SYSTEM_LAYERS = [
  { layer: "Objective and audience", parts: ["Commercial objective", "Audience need", "Brand position"] },
  { layer: "Structure and message", parts: ["Information architecture", "Message hierarchy"] },
  { layer: "Experience and interface", parts: ["UX", "Interface design", "Responsive behaviour"] },
  { layer: "Development and quality", parts: ["Development", "Accessibility", "Performance"] },
  { layer: "Action and measurement", parts: ["Conversion action", "Measurement"] },
  { layer: "Improvement", parts: ["What the evidence changes next"] },
];

const PROCESS = [
  {
    number: "01",
    stage: "Discover",
    title: "Understand the business, audience and opportunity.",
    body: "We begin with the business objectives, customer needs, existing experience and wider marketing context, so the project is shaped around what genuinely needs to change.",
    activities: [
      "Stakeholder discovery",
      "Business objectives",
      "Audience understanding",
      "Existing-site assessment",
      "Competitor context",
      "Analytics review where access is available",
    ],
  },
  {
    number: "02",
    stage: "Define",
    title: "Create the strategic foundation.",
    body: "We define the website's role, priority journeys, content requirements and measurement approach before any visual design begins.",
    activities: [
      "Customer journeys",
      "Conversion objectives",
      "Sitemap",
      "Page priorities",
      "Content strategy",
      "Measurement planning",
    ],
  },
  {
    number: "03",
    stage: "Structure",
    title: "Organise the information and user experience.",
    body: "We shape the navigation, page hierarchy, messaging structure and wireframes so visitors can understand and use the website more easily.",
    activities: [
      "Information architecture",
      "User flows",
      "Wireframes",
      "Message hierarchy",
      "CTA planning",
      "Form journeys",
    ],
  },
  {
    number: "04",
    stage: "Design",
    title: "Create the visual and interaction system.",
    body: "We translate the strategy, brand and user experience into a distinctive responsive interface built around clarity and consistency rather than decoration.",
    activities: [
      "Creative direction",
      "UI design",
      "Design system",
      "Responsive layouts",
      "Interaction design",
      "Prototype refinement",
    ],
  },
  {
    number: "05",
    stage: "Develop",
    title: "Build a stable, responsive and accessible website.",
    body: "We implement the approved experience using an appropriate technical architecture, reusable components and quality controls across devices and browsers.",
    activities: [
      "Front-end development",
      "Integration work where included in scope",
      "Responsive implementation",
      "Accessibility",
      "Performance work",
      "Technical SEO foundations",
    ],
  },
  {
    number: "06",
    stage: "Improve",
    title: "Test, release and continue learning.",
    body: "We complete quality assurance, support the agreed launch process, and use real behaviour to identify what deserves attention next.",
    activities: [
      "Content checks",
      "Device and browser testing",
      "Form validation",
      "Redirect planning where required",
      "Launch support",
      "Measurement review",
    ],
  },
];

const SIGNS = [
  "Visitors struggle to understand what the business actually provides.",
  "The website looks professional but produces few suitable enquiries.",
  "Navigation has become complicated as the business has grown.",
  "Important services are difficult to find.",
  "Messaging differs across pages and campaigns.",
  "The experience performs poorly on mobile.",
  "Pages are slow, unstable or difficult to maintain.",
  "The brand has changed but the website has not.",
  "Search and advertising campaigns lead to weak landing pages.",
  "Internal teams avoid updating the website because the system is too restrictive.",
  "Accessibility or browser issues are limiting who can use the site.",
  "A new market, service or product needs a clearer digital structure.",
];

const RELATED = [
  {
    name: "Branding",
    href: "/services/branding",
    icon: "branding",
    body: "Brand strategy, identity and voice give the website a clearer and more distinctive foundation to design from.",
  },
  {
    name: "SEO & GEO",
    href: "/services/seo-geo",
    icon: "seo",
    body: "Information architecture, technical quality and useful content improve both traditional and generative discovery.",
  },
  {
    name: "Google Ads",
    href: "/services/google-ads",
    icon: "ads",
    body: "Relevant landing pages strengthen the connection between search intent, the advertising message and customer action.",
  },
  {
    name: "Social Media",
    href: "/services/social-media",
    icon: "social",
    body: "A clear website gives social audiences a stronger destination for learning, comparing and taking the next step.",
  },
  {
    name: "App Development",
    href: "/services/app-development",
    icon: "app",
    body: "When the experience needs accounts, workflows or complex functionality, App Development extends beyond a content-led website.",
  },
] as const;

const FAQS: AccordionItem[] = [
  {
    question: "Do we need a completely new website?",
    answer: [
      "Often not. We assess the current site first, because a full rebuild is the most expensive way to fix a problem that may be structural, editorial or technical rather than visual.",
      "Sometimes the strongest improvement is refining a handful of priority pages, simplifying navigation, rewriting the message hierarchy or rebuilding only the parts that are genuinely limiting performance. We would rather tell you that than sell a redesign you do not need.",
    ],
  },
  {
    question: "How long does a website project take?",
    answer: [
      "It depends on scope, how much content already exists, which integrations are involved, how many people need to approve work and how complex the build is. Content and approvals are the two things that move timelines most, and both sit largely on the client side.",
      "We agree a realistic schedule after discovery, when those variables are known. We will not quote a fixed number of weeks before we understand what is being built.",
    ],
  },
  {
    question: "Will the website be custom designed, and what will it be built with?",
    answer: [
      "The interface is designed around your strategy, audience and brand rather than adapted from an off-the-shelf visual template. That is a statement about the design, not a claim that nothing is ever reused — component systems, established interface patterns and proven layout conventions are reused deliberately, because familiar patterns are usually easier for visitors than novel ones.",
      "Technology is chosen against the project's requirements, integrations, maintainability and performance needs rather than fashion. In practice we build with Next.js and TypeScript, which is what this website is built on. If a project genuinely calls for something else, we would say so rather than force the stack we prefer.",
    ],
  },
  {
    question: "Do you write the website content?",
    answer: [
      "We can support messaging, content structure and copy according to the agreed scope — message hierarchy, page objectives, headline direction and how proof is placed.",
      "Your expertise still matters. The detail that makes a service page convincing usually lives with the people who deliver the work, so the strongest outcome comes from us structuring and drafting, and your team reviewing and correcting.",
    ],
  },
  {
    question: "Will the website be optimised for search engines?",
    answer: [
      "The technical foundations are built in: semantic structure, clean information architecture, canonical URLs, metadata, structured data, a sitemap and performance-conscious implementation.",
      "That is the groundwork, not the whole discipline. Ongoing keyword strategy, content development and authority building are a separate connected service — see SEO & GEO.",
    ],
  },
  {
    question: "Do you build ecommerce websites?",
    answer: [
      "Ecommerce is not a core service. Our work suits considered, higher-value purchases where the buyer researches before making contact, and that is a different problem from high-volume online retail.",
      "If you sell low-value products at high volume, a specialist ecommerce agency is a better fit and we will say so. Where a site needs a small transactional element alongside a content-led experience, we would assess suitability honestly before confirming any scope.",
    ],
  },
  {
    question: "Will the website meet accessibility standards?",
    answer: [
      "Accessibility is considered throughout structure, design and development: semantic markup, heading order, keyboard operability, visible focus, colour contrast, reduced-motion support and sensible touch targets.",
      "We do not claim certification or full legal compliance. A conformance statement requires a formal audit against a specific standard, and that is a separate piece of work we would scope rather than imply.",
    ],
  },
  {
    question: "What happens after launch, and can our team update the site?",
    answer: [
      "Launch includes quality assurance, content checks, device and browser testing, redirect planning where a site is being replaced, and support through release.",
      "An editable content approach can be included when it is part of the agreed scope, and we would plan the content model and editing workflow with you rather than bolting one on at the end. We do not name a platform here, because the right choice depends on who edits the site, how often, and what the content actually is — committing to a system before that conversation is how sites end up with a CMS nobody uses.",
      "Beyond launch, ongoing improvement is an agreed arrangement rather than an open-ended promise. We would rather define what support actually covers than imply unlimited maintenance we cannot sustain.",
    ],
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/website-design" },
  openGraph: {
    title: `${TITLE} — ${site.name}`,
    description: DESCRIPTION,
    url: "/services/website-design",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}/services/website-design#webpage`,
      url: `${siteOrigin}/services/website-design`,
      name: `${TITLE} — ${site.name}`,
      description: DESCRIPTION,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteOrigin}/services` },
        {
          "@type": "ListItem",
          position: 3,
          name: "Website Design",
          item: `${siteOrigin}/services/website-design`,
        },
      ],
    },
    {
      "@type": "Service",
      name: "Website Design",
      serviceType: "Website design and development",
      url: `${siteOrigin}/services/website-design`,
      description:
        "Digital strategy, information architecture, UX design, messaging structure, interface design, Next.js development, conversion-focused journeys, performance and accessibility.",
      provider: { "@type": "Organization", name: site.name, url: siteOrigin },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Website Design capabilities",
        itemListElement: CAPABILITIES.map((group) => ({
          "@type": "OfferCatalog",
          name: group.title,
          itemListElement: group.disciplines.flatMap((discipline) =>
            discipline.items.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item },
            })),
          ),
        })),
      },
    },
  ],
};

export default function WebsiteDesignPage() {
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
                    <Link href="/" className="-mx-2 -my-2 inline-block px-2 py-2 transition-colors duration-200 hover:text-accent">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href="/services" className="-mx-2 -my-2 inline-block px-2 py-2 transition-colors duration-200 hover:text-accent">
                      Services
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink/70">
                    Website Design
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">Website Design</p>
                <h1 className="t-display-xl mt-6 max-w-[15ch]">
                  Turn attention into action through{" "}
                  <span className="text-accent">a better digital experience.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-8 max-w-[52ch] text-ink/75">
                  Optara connects strategy, messaging, user experience, interface
                  design and modern development to build websites that make a
                  business easier to understand, easier to trust and easier to
                  choose.
                </p>
                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="/contact" withArrow className="justify-center">
                    Discuss your website
                  </Button>
                  <Button href="#approach" variant="outline" className="justify-center">
                    Explore our approach
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* A website being built out of its strategic layers, top to bottom:
                objective, structure, message, interface, action. The three
                width states are proportional frames rather than device
                mock-ups, and every label is real HTML text — no screenshot, no
                fake client site, and not a single number, because any figure
                here would be invented. */}
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
                  <p className="t-mono text-[var(--muted)]">Objective</p>
                  <p className="mt-2.5 rounded-full border border-accent/25 bg-paper px-4 py-1.5 text-[0.9375rem] text-ink/70">
                    Be understood, and be chosen
                  </p>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-2.5 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  {/* Structure and message are one layer, not two: how the
                      site is organised and what it says are the same decision
                      seen from either side, so they sit as a matched pair.
                      The hierarchy is a real branch rather than a row of
                      pills, and the message is weighted rules rather than
                      invented headline copy. */}
                  <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div>
                      <p className="t-mono text-[var(--muted)]">Page hierarchy</p>
                      <div className="mt-2.5 rounded-[12px] border border-[var(--hairline)] bg-paper p-3">
                        <p className="text-center font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/70">
                          Home
                        </p>
                        <div
                          aria-hidden="true"
                          className="mx-auto my-1.5 h-3 w-px bg-[rgba(91,61,245,0.3)]"
                        />
                        <div
                          aria-hidden="true"
                          className="mx-[16.66%] h-px bg-[rgba(91,61,245,0.3)]"
                        />
                        <ul className="grid grid-cols-3">
                          {["Services", "Work", "Contact"].map((label) => (
                            <li key={label} className="flex flex-col items-center">
                              <span
                                aria-hidden="true"
                                className="h-2.5 w-px bg-[rgba(91,61,245,0.3)]"
                              />
                              <span className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/55">
                                {label}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <p className="t-mono text-[var(--muted)]">Clear message</p>
                      <div className="mt-2.5 flex flex-1 flex-col justify-center gap-2 rounded-[12px] border border-[var(--hairline)] bg-paper p-3">
                        <span aria-hidden="true" className="block h-2 w-[76%] rounded-full bg-[rgba(91,61,245,0.4)]" />
                        <span aria-hidden="true" className="block h-1.5 w-[54%] rounded-full bg-[rgba(18,19,26,0.16)]" />
                        <span aria-hidden="true" className="block h-1.5 w-[64%] rounded-full bg-[rgba(18,19,26,0.1)]" />
                      </div>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-2.5 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.12),rgba(91,61,245,0.45))]"
                  />

                  {/* One layout, three widths — responsive behaviour designed,
                      not adjusted at the end. Proportional frames, not devices. */}
                  <p className="t-mono text-[var(--muted)]">Responsive interface</p>
                  <ul className="mt-2.5 grid grid-cols-[1.7fr_1fr_0.62fr] items-end gap-2">
                    {["Desktop", "Tablet", "Mobile"].map((label) => (
                      <li
                        key={label}
                        className="rounded-[10px] border border-accent/20 bg-accent/[0.05] p-2"
                      >
                        <span aria-hidden="true" className="block h-1.5 w-2/3 rounded-full bg-[rgba(91,61,245,0.35)]" />
                        <span aria-hidden="true" className="mt-1.5 block h-1 w-full rounded-full bg-[rgba(18,19,26,0.12)]" />
                        <span aria-hidden="true" className="mt-1 block h-1 w-4/5 rounded-full bg-[rgba(18,19,26,0.12)]" />
                        <span className="mt-2 block font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                          {label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-2.5 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.12),rgba(91,61,245,0.45))]"
                  />

                  <div className="flex items-center gap-3 rounded-[12px] border border-[var(--hairline)] bg-paper p-2.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/[0.08]">
                      <LogoMark className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-[var(--muted)]">
                        Conversion action
                      </span>
                      <span className="mt-1 block text-[0.9375rem] leading-tight">
                        A confident next step
                      </span>
                    </span>
                  </div>

                  {/* Measurement as a return path, not a stage bolted on the end. */}
                  <div className="mt-2.5 flex items-center gap-2.5 rounded-[12px] border border-dashed border-accent/30 px-3.5 py-1.5">
                    <span aria-hidden="true" className="text-accent">
                      ↺
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60">
                      Measurement feeds the next improvement
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What a stronger website changes ──────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Why the experience matters</p>
                  <h2 className="t-display-lg mt-6 max-w-[20ch]">
                    A clearer website{" "}
                    <span className="text-accent">
                      strengthens every journey leading into it.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    A website should help visitors understand what the business
                    offers, why it is relevant and what to do next. When
                    strategy, messaging, design and development work together,
                    the experience becomes easier to use and more valuable
                    across every marketing channel.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* A route rather than four cards: the hairline runs through the
                node on each item, so the progression from understanding to
                action is visible in the layout and not only in the words. */}
            <RevealGroup
              as="ol"
              className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-4"
              stagger={0.07}
              soft
            >
              {OUTCOMES.map((outcome) => (
                <RevealItem
                  as="li"
                  key={outcome.number}
                  className="relative pt-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 block h-px bg-[var(--hairline)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-2 w-2 -translate-y-1/2 rounded-full border border-accent bg-[var(--bg)]"
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

        {/* ── The connected digital journey ────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">
                    More than a collection of pages
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Every page should support{" "}
                    <span className="text-accent">one clear customer journey.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Visitors rarely experience strategy, copy, design and
                    technology as separate disciplines. They experience one
                    website. The strongest digital experiences connect what
                    brought someone there, what they need to understand, and the
                    action that creates value for both the customer and the
                    business.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* Ten stages in four phases. The phase heading is a real heading,
                so the grouping survives with styles or motion switched off. */}
            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.05} soft>
              {JOURNEY.map((phase, phaseIndex) => (
                <RevealItem
                  as="li"
                  key={phase.phase}
                  className="grid gap-4 border-t border-[var(--hairline)] py-8 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)]"
                >
                  <div className="flex items-baseline gap-3 md:col-span-3">
                    <span className="t-mono text-accent">
                      {String(phaseIndex + 1).padStart(2, "0")}
                    </span>
                    <h3 className="t-display-md text-[clamp(1.25rem,1.8vw,1.5rem)]">
                      {phase.phase}
                    </h3>
                  </div>
                  <ol className="flex flex-col md:col-span-9">
                    {phase.steps.map((item) => (
                      <li
                        key={item.step}
                        className="grid items-baseline gap-1 py-2.5 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-6"
                      >
                        <p className="text-[1.0625rem] font-medium leading-tight">
                          {item.step}
                        </p>
                        <p className="text-[0.9375rem] leading-[1.55] text-ink/70">
                          {item.note}
                        </p>
                      </li>
                    ))}
                  </ol>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── Capabilities ─────────────────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">What we do</p>
              <h2 className="t-display-lg mt-6 max-w-[24ch]">
                A complete website system built around{" "}
                <span className="text-accent">clarity, usability and action.</span>
              </h2>
            </RevealText>

            {/* Four chapters, each holding two disciplines. Everything is
                visible at once — nothing behind a tab, a hover or a selector
                that would leave a blank panel or hide content from a phone. */}
            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {CAPABILITIES.map((group, i) => (
                <RevealItem
                  as="li"
                  key={group.title}
                  className="grid gap-8 border-t border-[var(--hairline)] py-10 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)] md:py-14"
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

                    {/* The capability visual: the same five-step chain form on
                        every chapter, so the four share one design language,
                        built from real text rather than a picture of words. */}
                    {/* Wraps into a compact row on a phone and becomes the
                        connected vertical chain from md up, where it sits
                        beside the disciplines. Same five labels either way —
                        the layout changes, the content does not. */}
                    <ol className="mt-7 flex flex-wrap gap-x-4 gap-y-2 md:flex-col md:gap-0">
                      {group.visual.map((label, v) => (
                        <li key={label} className="flex items-center gap-2 md:gap-3">
                          <span className="flex flex-col items-center self-stretch">
                            {v > 0 ? (
                              <span
                                aria-hidden="true"
                                className="hidden h-3 w-px bg-[rgba(91,61,245,0.3)] md:block"
                              />
                            ) : null}
                            <span
                              aria-hidden="true"
                              className="block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            />
                            {v < group.visual.length - 1 ? (
                              <span
                                aria-hidden="true"
                                className="hidden h-3 w-px flex-1 bg-[rgba(91,61,245,0.3)] md:block"
                              />
                            ) : null}
                          </span>
                          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60 md:py-1">
                            {label}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-col gap-8 md:col-span-6 md:col-start-7 md:self-center">
                    {group.disciplines.map((discipline) => (
                      <div key={discipline.name}>
                        <h4 className="text-[1.0625rem] font-medium leading-tight">
                          {discipline.name}
                        </h4>
                        <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                          {discipline.items.map((item) => (
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
                      </div>
                    ))}
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>

            {/* Stated plainly rather than left for someone to discover in a
                kick-off call. These are the limits of the list above. */}
            <RevealText>
              <p className="mt-12 max-w-[62ch] border-t border-[var(--hairline)] pt-8 text-[1.0625rem] leading-[1.7] text-ink/70">
                Two honest limits. We do not name a content management system
                before we know who edits the site and how often, and we do not
                claim an accessibility conformance level without a formal audit
                against a specific standard — both are scoped as their own piece
                of work when a project needs them.
              </p>
            </RevealText>
          </div>
        </section>

        {/* ── The website experience system ────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">One connected digital system</p>
                  <h2 className="t-display-lg mt-6 max-w-[26ch]">
                    Strategy creates direction. Design creates clarity.{" "}
                    <span className="text-accent">
                      Development makes the experience real.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    A strong website is shaped by many connected decisions. The
                    business objective influences the customer journey. The
                    journey shapes the structure and the message. The interface
                    guides attention. Development determines how reliably the
                    experience performs. Measurement reveals what should improve
                    next.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* Six stacked layers rather than a node diagram: it stays legible
                on a phone and every label is selectable text. */}
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
              <span className="font-medium text-accent">a clearer path to action</span>.
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
                From commercial objective to{" "}
                <span className="text-accent">a website ready to evolve.</span>
              </h2>
            </RevealText>

            {/* Two rows of three at large widths: six across one row compresses
                each stage past the point of being readable. */}
            <RevealGroup
              as="ol"
              className="mt-14 grid gap-y-10 md:grid-cols-2 md:gap-x-10 xl:grid-cols-3 xl:gap-x-12"
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
                  <p className="mt-3.5 max-w-[30ch] text-[1rem] font-medium leading-[1.4]">
                    {step.title}
                  </p>
                  <p className="mt-3 max-w-[36ch] text-[0.9375rem] leading-[1.6] text-ink/70">
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

        {/* ── When to review the website ───────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div className="lg:col-span-5">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">When to review the website</p>
                <h2 className="t-display-lg mt-6">
                  The business may have evolved{" "}
                  <span className="text-accent">
                    beyond the experience representing it.
                  </span>
                </h2>
                <p className="t-body-lg mt-7 max-w-[40ch] text-ink/75">
                  Not every business needs to replace its entire website.
                  Sometimes the strongest improvement comes from refining
                  priority pages, simplifying navigation, strengthening the
                  message, or rebuilding only the parts that are genuinely
                  limiting performance.
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
                    Built to strengthen every channel
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Marketing creates attention.{" "}
                    <span className="text-accent">
                      The website determines what happens next.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    The website is where branding, search, advertising and
                    social activity become one customer experience. Clear
                    positioning strengthens the message. SEO improves discovery.
                    Google Ads captures active demand. Social Media creates
                    familiarity. App Development extends the experience into
                    more advanced products and workflows.
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
                  Website <span className="text-accent">questions.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="web-faq" />
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
                Ready to create a website{" "}
                <span className="text-[var(--accent-fg)]">that works more clearly?</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                Tell us what the current website is struggling to communicate,
                where visitors are becoming lost and which commercial outcomes
                matter most. We will help identify the strongest place to begin.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="flex flex-col items-start gap-5">
                <Button href="/contact" variant="light" withArrow>
                  Discuss your website
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
