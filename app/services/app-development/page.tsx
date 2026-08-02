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
 * This page had the hardest verification problem of the six. The approved
 * direction in lib/content.ts lists six App Development capabilities: product
 * strategy, UX and interface design, web applications, internal platforms,
 * prototyping and API integration. Nothing else is evidenced anywhere in the
 * project — there is no React Native, Flutter, Swift, Kotlin or app-store
 * reference, no web app manifest or service worker, no database, auth
 * provider, payment provider or cloud account, and no AI feature work. The
 * only AI in this codebase is the SEO & GEO service's generative-discovery
 * copy, which is a marketing service and not a product capability.
 *
 * So this page claims web applications and internal platforms and stops
 * there. Native and cross-platform mobile development, progressive web apps,
 * payment integration and AI-assisted features are all omitted as capability
 * groups rather than hedged. No provider or platform is named. No security
 * certification, penetration test, compliance status, uptime, scale or
 * adoption claim appears. No figure of any kind appears. And nothing on the
 * page describes an internal engineering team, because the delivery model is
 * not documented anywhere in the project and inventing one would be the
 * easiest lie here.
 */
const TITLE = "App Development and Digital Product Design";
const DESCRIPTION =
  "Create useful digital products with Optara Digital's product strategy, workflow discovery, UX and interface design, web application development and system integration.";

const OUTCOMES = [
  {
    number: "01",
    title: "Clearer workflows",
    body: "Turn a complex or disconnected process into an understandable sequence of actions, so the work itself gets simpler rather than just better looking.",
  },
  {
    number: "02",
    title: "Better user experiences",
    body: "Help people complete valuable tasks with less confusion, repetition and unnecessary effort — particularly the tasks they repeat every day.",
  },
  {
    number: "03",
    title: "Stronger operational consistency",
    body: "Create one controlled system for information, workflows and decisions that currently depend on disconnected tools or manual handling.",
  },
  {
    number: "04",
    title: "Greater capacity to evolve",
    body: "Build a technical foundation that can respond as user needs, commercial priorities and connected systems change, rather than one that resists every change.",
  },
];

/**
 * Deliberately balanced. The website column is written to be genuinely
 * attractive, not as a straw man that makes an application look inevitable —
 * recommending software nobody needs is the failure mode of this page.
 */
const WEBSITE_SIGNALS = [
  "The main objective is communicating services, products or expertise.",
  "Visitors mostly need to explore and understand information.",
  "The journey leads towards an enquiry, a purchase or a content action.",
  "Most users do not need an account.",
  "The experience does not depend on personalised or repeated workflows.",
  "Content visibility and search discovery are major priorities.",
];

const APPLICATION_SIGNALS = [
  "Users need to sign in and return regularly.",
  "Different users need different permissions or different experiences.",
  "The product manages data, workflows or repeated tasks.",
  "Customers need personalised information or functionality.",
  "Existing manual processes are creating real friction.",
  "Several systems need to work together reliably.",
  "The experience has to remember state or respond to history.",
  "The digital product is itself part of what the business sells.",
];

/**
 * Eleven stages grouped into four phases. The grouping is what makes it a
 * journey rather than a feature checklist.
 */
const JOURNEY = [
  {
    phase: "Understand",
    steps: [
      { step: "User need", note: "What someone is actually trying to get done" },
      { step: "Commercial objective", note: "Why it is worth solving for the business" },
    ],
  },
  {
    phase: "Decide",
    steps: [
      { step: "Product decision", note: "What gets built, and just as importantly what does not" },
      { step: "Core workflow", note: "The sequence the product exists to support" },
      { step: "Information architecture", note: "How data, roles and screens relate to each other" },
    ],
  },
  {
    phase: "Build",
    steps: [
      { step: "Interface interaction", note: "The moment the user does the thing" },
      { step: "Data or integration response", note: "What the product and connected systems do about it" },
      { step: "Useful outcome", note: "The task is complete, and something of value changed" },
    ],
  },
  {
    phase: "Learn",
    steps: [
      { step: "User feedback", note: "Where people hesitated, failed or worked around it" },
      { step: "Product learning", note: "What that says about the original assumption" },
      { step: "Improvement", note: "The next release, prioritised by evidence" },
    ],
  },
];

/**
 * Four chapters. Every discipline here maps to an approved capability in
 * lib/content.ts or to something this codebase itself demonstrates. Groups the
 * brief marked "include only when verified" — mobile applications, progressive
 * web apps, AI-assisted features — are absent rather than softened.
 */
const CAPABILITIES = [
  {
    title: "Product strategy and discovery",
    body: "Understand the problem, the people and the commercial objective, then decide what is genuinely worth building before anything is designed or written.",
    visual: ["User need", "Business objective", "Product decision", "Feature priorities", "First release"],
    disciplines: [
      {
        name: "Product strategy",
        items: [
          "Stakeholder discovery",
          "User and business needs",
          "Product objectives",
          "Opportunity definition",
          "Feature prioritisation",
          "Minimum valuable release",
          "Success criteria",
          "Risk and dependency review",
        ],
      },
      {
        name: "Workflow discovery",
        items: [
          "Stakeholder interviews",
          "Existing-workflow assessment",
          "Task analysis",
          "Journey mapping",
          "Pain-point identification",
          "Role and permission discovery",
        ],
      },
    ],
  },
  {
    title: "UX, prototyping and interface design",
    body: "Turn the product direction into structures, journeys and interfaces that make a complex workflow feel obvious — and make it reviewable before development begins.",
    visual: ["User flows", "Workflow states", "Interface hierarchy", "Prototype review", "Error and recovery"],
    disciplines: [
      {
        name: "Information architecture and UX",
        items: [
          "Application architecture",
          "Navigation models",
          "User and task flows",
          "Wireframes",
          "State planning",
          "Form and data-entry journeys",
          "Error and recovery paths",
          "Accessibility considerations",
        ],
      },
      {
        name: "Prototyping and product design",
        items: [
          "Low and high-fidelity prototypes",
          "Workflow simulation",
          "Stakeholder review",
          "Product visual direction",
          "Component systems and design tokens",
          "Data-display patterns",
          "Empty, loading, error and success states",
          "Responsive product layouts",
        ],
      },
    ],
  },
  {
    title: "Development, data and integrations",
    body: "Build the agreed product on a maintainable technical foundation, and connect it to the systems and information the workflow actually depends on.",
    visual: ["Application modules", "Data relationships", "Permissions", "API connections", "External systems"],
    disciplines: [
      {
        name: "Web application development",
        items: [
          "Next.js App Router development",
          "TypeScript",
          "React component systems",
          "Responsive implementation",
          "Form and workflow logic",
          "Authentication integration",
          "Accessibility implementation",
          "Performance work",
        ],
      },
      {
        name: "Data, platforms and integration",
        items: [
          "Customer and partner portals",
          "Internal platforms and workflow tools",
          "Data modelling",
          "Role and permission models",
          "API structure and integration",
          "Data synchronisation",
          "Environment and deployment planning",
          "Logging and monitoring considerations",
        ],
      },
    ],
  },
  {
    title: "Quality assurance, launch and evolution",
    body: "Test the product against real workflows and the ways they fail, support a controlled release, then let genuine use decide what happens next.",
    visual: ["Test states", "Device and browser checks", "Release", "Feedback", "Roadmap refinement"],
    disciplines: [
      {
        name: "Quality assurance and launch",
        items: [
          "Functional testing",
          "Workflow and form validation",
          "Error-state review",
          "Integration testing",
          "Responsive and browser testing",
          "Accessibility checks",
          "Launch support",
          "Production verification",
        ],
      },
      {
        name: "Ongoing product improvement",
        items: [
          "User-feedback review",
          "Product analytics review where available",
          "Workflow refinement",
          "Interface improvements",
          "Feature prioritisation",
          "Performance improvements",
          "Maintenance planning",
          "Roadmap refinement",
        ],
      },
    ],
  },
];

const SYSTEM_LAYERS = [
  { layer: "Need and objective", parts: ["User need", "Commercial objective"] },
  { layer: "Product strategy", parts: ["Product direction", "Feature priority"] },
  { layer: "Workflow and experience", parts: ["Workflow", "Information architecture", "UX"] },
  { layer: "Interface and data", parts: ["Interface design", "Data", "Permissions"] },
  { layer: "Development and integration", parts: ["Development", "Integrations", "Accessibility"] },
  { layer: "Testing and release", parts: ["Testing", "Launch"] },
  { layer: "Value and improvement", parts: ["Useful outcome", "Feedback", "Improvement"] },
];

const PROCESS = [
  {
    number: "01",
    stage: "Discover",
    title: "Understand the problem, user and commercial objective.",
    body: "We examine what people need to achieve, where the current workflow creates friction and what valuable outcome the product should support.",
    activities: [
      "Stakeholder discovery",
      "User needs",
      "Current workflow",
      "Business objective",
      "Existing systems",
      "Risks and constraints",
    ],
  },
  {
    number: "02",
    stage: "Define",
    title: "Decide what the product should and should not do.",
    body: "We translate the opportunity into a clear direction, an initial scope and a set of priorities, before features and technology start expanding on their own.",
    activities: [
      "Product objectives",
      "User groups",
      "Core use cases",
      "Feature priorities",
      "Minimum valuable release",
      "Success criteria",
    ],
  },
  {
    number: "03",
    stage: "Structure",
    title: "Design the workflow and information architecture.",
    body: "We shape how users move through the product, how information is organised, and how roles, states and tasks connect to one another.",
    activities: [
      "User and task flows",
      "Application structure",
      "Roles and permissions",
      "Data-entry journeys",
      "Error and recovery paths",
    ],
  },
  {
    number: "04",
    stage: "Prototype",
    title: "Make the experience testable before full development.",
    body: "We build a prototype at the fidelity the question deserves, so workflows, interface decisions and technical assumptions can be reviewed while they are still cheap to change.",
    activities: [
      "Wireframes",
      "Interactive prototype",
      "Workflow review",
      "Stakeholder review",
      "Technical feasibility",
      "Iteration",
    ],
  },
  {
    number: "05",
    stage: "Design",
    title: "Create the product interface and component system.",
    body: "We translate approved workflows into a clear, accessible and responsive interface designed for repeated real-world use rather than a first impression.",
    activities: [
      "Product interface design",
      "Design system",
      "Component states",
      "Responsive behaviour",
      "Loading and error states",
      "Accessibility considerations",
    ],
  },
  {
    number: "06",
    stage: "Develop",
    title: "Build, integrate and validate the product.",
    body: "We implement the agreed product on an appropriate technical architecture, connect the systems it depends on, and test critical workflows throughout rather than at the end.",
    activities: [
      "Application development",
      "Authentication and permissions",
      "API and data integration",
      "Functional testing",
      "Responsive and browser testing",
      "Quality assurance",
    ],
  },
  {
    number: "07",
    stage: "Improve",
    title: "Release carefully and learn from real use.",
    body: "We support the agreed launch, review early behaviour and use evidence to identify the next most valuable improvement. Launch is where product learning starts.",
    activities: [
      "Production checks",
      "Release support",
      "Monitoring considerations",
      "User feedback",
      "Product analytics where available",
      "Roadmap refinement",
    ],
  },
];

const SIGNS = [
  "Customers complete repeated tasks through emails, spreadsheets or manual support.",
  "Internal teams depend on disconnected systems and duplicated data entry.",
  "Users need secure accounts, personalised information or role-based access.",
  "A customer portal would materially improve service and communication.",
  "An existing product has become difficult to use or to maintain.",
  "Important workflows rely on several tools that do not connect reliably.",
  "A new digital product is central to the business model.",
  "A manual process is limiting service capacity or consistency.",
  "A prototype exists but needs clearer product direction and technical delivery.",
  "There is a feature idea, but the underlying user problem has not been validated.",
  "A content-led website cannot support the workflow the business actually needs.",
];

const RELATED = [
  {
    name: "Website Design",
    href: "/services/website-design",
    icon: "web",
    body: "The public website communicates the product, builds confidence and guides visitors into the application or portal.",
  },
  {
    name: "Branding",
    href: "/services/branding",
    icon: "branding",
    body: "A clear identity and product voice make application experiences more recognisable, consistent and trustworthy.",
  },
  {
    name: "SEO & GEO",
    href: "/services/seo-geo",
    icon: "seo",
    body: "Search supports discovery of public product pages and useful resources, helping people understand the product before they sign in.",
  },
  {
    name: "Google Ads",
    href: "/services/google-ads",
    icon: "ads",
    body: "Paid campaigns can support a launch or focused acquisition when targeting, onboarding and measurement are connected.",
  },
  {
    name: "Social Media",
    href: "/services/social-media",
    icon: "social",
    body: "Social content can explain product value, demonstrate workflows and support education and ongoing adoption.",
  },
] as const;

const FAQS: AccordionItem[] = [
  {
    question: "How do we know whether we need an application or a website?",
    answer: [
      "A website mainly communicates and guides: someone arrives, understands what you offer and takes an action. An application supports repeated tasks, personalised data, permissions and workflows that carry state from one visit to the next.",
      "The test is what people need to do, not which sounds more advanced. We recommend the simplest thing capable of delivering the value — and if that is a better website, or configuring a tool you already pay for, we will say so rather than sell a build.",
    ],
  },
  {
    question: "Can you help define the product before development begins?",
    answer: [
      "Yes, and it is usually where the money is best spent. Discovery, workflow definition, feature prioritisation and prototyping exist to find out what is genuinely worth building before anyone commits to building it.",
      "This is proportionate discovery shaped around stakeholders and the existing workflow, not a formal research programme. We would rather be straight about that than describe a scale of research we do not run.",
    ],
  },
  {
    question: "Do you build web applications, mobile applications or both?",
    answer: [
      "Web applications. We build browser-based products with Next.js and TypeScript — customer portals, internal platforms and workflow tools — designed to work properly on a phone as well as a desktop.",
      "We do not offer native iOS or Android development, and we would not claim it in order to win a project. If a product genuinely needs native capability, that is a specialist commission and we would say so at the point it becomes clear rather than after you have committed.",
    ],
  },
  {
    question: "What is a minimum viable product?",
    answer: [
      "The smallest coherent version that delivers genuine value and lets you test the assumption underneath it. It is a complete, well-made product with a narrow scope.",
      "It is not an unfinished or low-quality version of the real thing. Shipping something broken and calling it an MVP teaches you nothing except that people dislike broken software.",
    ],
  },
  {
    question: "How long does an application take to design and build?",
    answer: [
      "It depends on scope, workflow complexity, how many systems have to be integrated, how much of the content and data already exists, and how quickly decisions can be made on your side.",
      "A realistic schedule follows discovery, when those things are actually known. We will not name a fixed duration before we understand what is being built — an early number that turns out to be wrong helps nobody.",
    ],
  },
  {
    question: "Can you integrate the application with our existing systems?",
    answer: [
      "Often, but it depends on the system rather than on us. Integration suitability comes down to whether a documented API exists, what access and permissions can be granted, how the data is structured and what the third party's own limits allow.",
      "We assess this during discovery, because an integration assumed to be simple is one of the most common ways a project slips. We do not guarantee that every system can be connected.",
    ],
  },
  {
    question: "Who owns the application and its source code?",
    answer: [
      "Ownership, licensing and repository access should be written down and agreed before work begins, and we will put it in the proposal rather than leave it to be discovered later.",
      "Our default position is that you own what you commission. Where any third-party library, service or component carries its own licence — which is normal in every modern application — we identify it so you know exactly what you own outright and what you are using under licence.",
    ],
  },
  {
    question: "How do you approach security and data protection?",
    answer: [
      "Security is treated as part of architecture, implementation and testing rather than a step at the end: how people are authenticated, what each role is permitted to do, how data is stored and transmitted, what is logged, and what happens when something fails.",
      "We will not claim a product is secure, certified or compliant. We do not provide penetration testing or formal security audit — those are specialist services, and where a product's risk profile calls for them we would tell you to commission one rather than imply our own testing is a substitute.",
    ],
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/app-development" },
  openGraph: {
    title: `${TITLE} — ${site.name}`,
    description: DESCRIPTION,
    url: "/services/app-development",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}/services/app-development#webpage`,
      url: `${siteOrigin}/services/app-development`,
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
          name: "App Development",
          item: `${siteOrigin}/services/app-development`,
        },
      ],
    },
    {
      "@type": "Service",
      name: "App Development",
      serviceType: "Web application development and digital product design",
      url: `${siteOrigin}/services/app-development`,
      description:
        "Product strategy, workflow discovery, information architecture, UX, prototyping, product interface design, web application development, system integration, quality assurance and ongoing product improvement.",
      provider: { "@type": "Organization", name: site.name, url: siteOrigin },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "App Development capabilities",
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

export default function AppDevelopmentPage() {
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
                    App Development
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">App Development</p>
                <h1 className="t-display-xl mt-6 max-w-[15ch]">
                  Create useful digital products{" "}
                  <span className="text-accent">built around real needs.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-8 max-w-[52ch] text-ink/75">
                  Optara connects product strategy, user experience, interface
                  design and web application development to build products that
                  make valuable tasks clearer, faster and easier to complete.
                </p>
                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="/contact" withArrow className="justify-center">
                    Discuss your application
                  </Button>
                  <Button href="#approach" variant="outline" className="justify-center">
                    Explore our approach
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* A product forming out of its layers: need, the scope decision,
                the workflow it exists to support, interface paired with the
                data behind it, the outcome, and the loop back. The in-scope /
                not-now pair is the argument the page makes — deciding what not
                to build is the work. Every label is real text; there is no
                dashboard, no device frame, no fake user and no number. */}
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
                  <p className="t-mono text-[var(--muted)]">User need</p>
                  <p className="mt-2.5 rounded-full border border-accent/25 bg-paper px-4 py-1.5 text-[0.9375rem] text-ink/70">
                    “I need to do this again next week”
                  </p>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-2.5 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  {/* Scope as a decision with two sides. Stated in words, not
                      by colour alone: each column is labelled. */}
                  <p className="t-mono text-[var(--muted)]">Product decision</p>
                  <div className="mt-2.5 grid grid-cols-2 gap-3">
                    <div className="rounded-[12px] border border-accent/25 bg-accent/[0.05] p-3">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                        Build first
                      </p>
                      <p className="mt-1.5 text-[0.9375rem] leading-tight text-ink/75">
                        The one workflow
                      </p>
                    </div>
                    <div className="rounded-[12px] border border-dashed border-[rgba(18,19,26,0.2)] bg-paper p-3">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/50">
                        Not yet
                      </p>
                      <p className="mt-1.5 text-[0.9375rem] leading-tight text-ink/55">
                        Everything else
                      </p>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-2.5 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.12),rgba(91,61,245,0.45))]"
                  />

                  {/* The workflow as connected states — the shape that makes
                      this an application rather than a page. */}
                  <p className="t-mono text-[var(--muted)]">Core workflow</p>
                  <ol className="mt-2.5 flex items-center justify-between gap-1 rounded-[12px] border border-[var(--hairline)] bg-paper px-3 py-3">
                    {["Start", "Review", "Approve", "Done"].map((state, i) => (
                      <li key={state} className="flex min-w-0 items-center gap-1">
                        {/* w-2 at the base size, not w-3: at 360px the four
                            states plus three connectors were demanding 6px
                            more than the shell's inner width, which ate the
                            right gutter. */}
                        {i > 0 ? (
                          <span
                            aria-hidden="true"
                            className="mr-1 block h-px w-2 shrink-0 bg-[rgba(91,61,245,0.35)] sm:w-5"
                          />
                        ) : null}
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span
                            aria-hidden="true"
                            className="block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          />
                          <span className="truncate font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/65">
                            {state}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-2.5 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  {/* Interface and data as a matched pair: in a product they
                      are the same decision seen from two sides. */}
                  <div className="grid gap-x-3 gap-y-3 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <p className="t-mono text-[var(--muted)]">Interface</p>
                      <div className="mt-2.5 flex flex-1 flex-col justify-center gap-2 rounded-[12px] border border-[var(--hairline)] bg-paper p-3">
                        <span aria-hidden="true" className="block h-2 w-[70%] rounded-full bg-[rgba(91,61,245,0.4)]" />
                        <span aria-hidden="true" className="block h-1.5 w-[46%] rounded-full bg-[rgba(18,19,26,0.16)]" />
                        <span aria-hidden="true" className="block h-6 w-[58%] rounded-[6px] border border-accent/25 bg-accent/[0.06]" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="t-mono text-[var(--muted)]">Data and integration</p>
                      <ul className="mt-2.5 flex flex-1 flex-col justify-center gap-1.5 rounded-[12px] border border-[var(--hairline)] bg-paper p-3">
                        {["Records", "Permissions", "Connected system"].map((label) => (
                          <li key={label} className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className="block h-1 w-1 shrink-0 rounded-full bg-accent"
                            />
                            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60">
                              {label}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

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
                        Useful outcome
                      </span>
                      <span className="mt-1 block text-[0.9375rem] leading-tight">
                        The task is genuinely done
                      </span>
                    </span>
                  </div>

                  <div className="mt-2.5 flex items-center gap-2.5 rounded-[12px] border border-dashed border-accent/30 px-3.5 py-1.5">
                    <span aria-hidden="true" className="text-accent">
                      ↺
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60">
                      Feedback decides the next release
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What a useful application changes ────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Why digital products matter</p>
                  <h2 className="t-display-lg mt-6 max-w-[20ch]">
                    The right product{" "}
                    <span className="text-accent">
                      removes friction from something valuable.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    A useful application creates a clearer way for customers,
                    teams or partners to complete important tasks. The greatest
                    value usually comes from improving a real workflow rather
                    than adding more features or introducing technology for its
                    own sake.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup
              as="ol"
              className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-4"
              stagger={0.07}
              soft
            >
              {OUTCOMES.map((outcome) => (
                <RevealItem as="li" key={outcome.number} className="relative pt-8">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 block h-px bg-[var(--hairline)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-2 w-2 -translate-y-1/2 rounded-full border border-accent bg-[var(--bg)]"
                  />
                  <span className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">{outcome.number}</span>
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

        {/* ── Website or application ───────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">
                    Choose the right type of experience
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Not every digital need{" "}
                    <span className="text-accent">requires a custom application.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    A website communicates information and guides visitors
                    towards an action. An application lets users complete
                    ongoing tasks, manage information or take part in a more
                    complex workflow. The right answer depends on the problem,
                    not on the label.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* Two columns given equal weight and identical treatment. Each is
                headed by real text rather than distinguished by colour, so the
                comparison survives greyscale, reduced motion and a screen
                reader reading it top to bottom. */}
            <div className="mt-14 grid gap-4 lg:grid-cols-2">
              <RevealText>
                <div className="h-full rounded-[18px] border border-[var(--hairline)] bg-bone p-7 md:p-9">
                  <p className="t-mono text-[var(--muted)]">Option one</p>
                  <h3 className="t-display-md mt-3 text-[clamp(1.375rem,2vw,1.75rem)]">
                    A website may be right
                  </h3>
                  <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                    When the job is to be understood and chosen.
                  </p>
                  <ul className="mt-7 flex flex-col gap-3">
                    {WEBSITE_SIGNALS.map((signal) => (
                      <li
                        key={signal}
                        className="flex items-start gap-3 text-[0.9375rem] leading-[1.55] text-ink/70"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.5em] block h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {signal}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-7 border-t border-[var(--hairline)] pt-5 text-[0.9375rem] leading-[1.6] text-ink/70">
                    This is our{" "}
                    <Link
                      href="/services/website-design"
                      className="font-medium text-accent underline decoration-accent/30 underline-offset-4 transition-colors duration-200 hover:decoration-accent"
                    >
                      Website Design
                    </Link>{" "}
                    service.
                  </p>
                </div>
              </RevealText>

              <RevealText delay={0.08}>
                <div className="h-full rounded-[18px] border border-[var(--hairline)] bg-bone p-7 md:p-9">
                  <p className="t-mono text-[var(--muted)]">Option two</p>
                  <h3 className="t-display-md mt-3 text-[clamp(1.375rem,2vw,1.75rem)]">
                    An application may be right
                  </h3>
                  <p className="mt-4 max-w-[44ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                    When the job is to get something done, repeatedly.
                  </p>
                  <ul className="mt-7 flex flex-col gap-3">
                    {APPLICATION_SIGNALS.map((signal) => (
                      <li
                        key={signal}
                        className="flex items-start gap-3 text-[0.9375rem] leading-[1.55] text-ink/70"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.5em] block h-1 w-1 shrink-0 rounded-full bg-accent"
                        />
                        {signal}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-7 border-t border-[var(--hairline)] pt-5 text-[0.9375rem] leading-[1.6] text-ink/70">
                    This is the service on this page.
                  </p>
                </div>
              </RevealText>
            </div>

            <RevealText>
              <p className="mt-8 max-w-[64ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                Often the strongest answer is both: a content-led website that
                explains the offer, connected to an application that does the
                work. Our position is to recommend the simplest approach capable
                of delivering the value — including telling you that the tool
                you already pay for would do the job.
              </p>
            </RevealText>
          </div>
        </section>

        {/* ── The connected product journey ────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">
                    More than a collection of features
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Every feature should support{" "}
                    <span className="text-accent">a clear user journey.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Users do not experience product strategy, interface design,
                    data and development as separate disciplines. They
                    experience one application. The strongest products connect
                    the problem being solved, the task being completed and the
                    value created through one coherent workflow.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.05} soft>
              {JOURNEY.map((phase, phaseIndex) => (
                <RevealItem
                  as="li"
                  key={phase.phase}
                  className="grid gap-4 border-t border-[var(--hairline)] py-8 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)]"
                >
                  <div className="flex items-baseline gap-3 md:col-span-3">
                    <span className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">
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
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">What we do</p>
              <h2 className="t-display-lg mt-6 max-w-[24ch]">
                A complete digital-product system built around{" "}
                <span className="text-accent">users, workflows and value.</span>
              </h2>
            </RevealText>

            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {CAPABILITIES.map((group, i) => (
                <RevealItem
                  as="li"
                  key={group.title}
                  className="grid gap-8 border-t border-[var(--hairline)] py-10 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)] md:py-14"
                >
                  <div className="md:col-span-5">
                    <span className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="t-display-md mt-3.5 text-[clamp(1.375rem,2vw,1.75rem)]">
                      {group.title}
                    </h3>
                    <p className="mt-4 max-w-[40ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                      {group.body}
                    </p>

                    {/* One chain form shared by all four chapters, so the
                        capability visuals are a single design language. Wraps
                        on a phone, becomes a connected vertical chain from md
                        up. Real text, never a picture of words. */}
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

            {/* The limits of the list above, stated here rather than left to
                be discovered in a kick-off call. */}
            <RevealText>
              <p className="mt-12 max-w-[64ch] border-t border-[var(--hairline)] pt-8 text-[1.0625rem] leading-[1.7] text-ink/70">
                What this list deliberately does not include. We build web
                applications, so we do not offer native iOS or Android
                development. We do not provide penetration testing or formal
                security certification. We do not treat artificial intelligence
                as a standing feature to add to a product, and we do not name a
                hosting, database or payment provider before knowing what the
                product actually needs. Where a project requires any of these,
                we say so and help you commission it properly.
              </p>
            </RevealText>
          </div>
        </section>

        {/* ── The digital-product system ───────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">One connected product system</p>
                  <h2 className="t-display-lg mt-6 max-w-[26ch]">
                    Product thinking creates focus. Design creates clarity.{" "}
                    <span className="text-accent">
                      Development creates capability.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    A useful application is shaped by many connected decisions.
                    The user need determines the workflow. The workflow shapes
                    the interface and the data. Technical architecture
                    determines how reliably the experience operates. Testing and
                    feedback reveal what should improve next.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {SYSTEM_LAYERS.map((row, i) => (
                <RevealItem
                  as="li"
                  key={row.layer}
                  className="grid items-center gap-4 border-t border-[var(--hairline)] py-6 md:grid-cols-[auto_minmax(0,16rem)_1fr] md:gap-6"
                >
                  <span className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">
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
              <span className="font-medium text-accent">
                a clearer way to complete valuable work
              </span>
              .
            </p>
          </div>
        </section>

        {/* ── Process ──────────────────────────────────────────────────── */}
        <section
          id="approach"
          data-theme="paper"
          className="section scroll-mt-28 bg-[var(--bg)]"
        >
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Our approach</p>
              <h2 className="t-display-lg mt-6 max-w-[22ch]">
                From a valuable problem to{" "}
                <span className="text-accent">a product ready to learn.</span>
              </h2>
            </RevealText>

            {/* Four then three at the widest widths, so seven stages never
                compress into an unreadable single row. */}
            <RevealGroup
              as="ol"
              className="mt-14 grid gap-y-10 md:grid-cols-2 md:gap-x-10 xl:grid-cols-4 xl:gap-x-8"
              stagger={0.06}
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
                    <span className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">{step.number}</span>
                    <h3 className="text-[1.0625rem] font-medium">{step.stage}</h3>
                  </div>
                  <p className="mt-3.5 max-w-[30ch] text-[1rem] font-medium leading-[1.4]">
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

        {/* ── When to consider an application ──────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div className="lg:col-span-5">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">When to consider an application</p>
                <h2 className="t-display-lg mt-6">
                  A valuable workflow may have{" "}
                  <span className="text-accent">outgrown the tools supporting it.</span>
                </h2>
                <p className="t-body-lg mt-7 max-w-[40ch] text-ink/75">
                  Not every workflow needs custom software. An existing
                  platform, a better process or a focused website experience is
                  often the stronger answer. We think custom development is
                  worth recommending only when it creates value those options
                  genuinely cannot.
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
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">
                    Built to connect with the wider experience
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[24ch]">
                    Products create value when strategy, visibility and
                    experience{" "}
                    <span className="text-accent">work together.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    App Development creates the functionality that lets users
                    complete valuable tasks. Website Design creates the content
                    and conversion experience around it. Branding shapes trust
                    and identity. SEO & GEO supports discovery where the product
                    has searchable value. Google Ads supports focused
                    acquisition. Social Media helps explain the product.
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
                    className="group flex h-full items-start gap-4 rounded-[16px] border border-transparent p-5 transition-colors duration-200 hover:border-[var(--hairline)] hover:bg-bone focus-visible:border-[var(--hairline)] focus-visible:bg-bone"
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
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:gap-x-[clamp(3rem,5vw,7rem)]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">Questions</p>
                <h2 className="t-display-lg mt-6 max-w-[14ch]">
                  Product <span className="text-accent">questions.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="app-faq" />
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
                Ready to turn a valuable workflow{" "}
                <span className="text-[var(--accent-fg)]">into a useful product?</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                Tell us what users need to achieve, where the current process
                creates friction and which outcome matters most. We will help
                work out whether a custom application is the right place to
                begin.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="flex flex-col items-start gap-5">
                <Button href="/contact" variant="light" withArrow>
                  Discuss your application
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
