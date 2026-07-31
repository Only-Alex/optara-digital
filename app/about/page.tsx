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
 * Copy lives beside the route, as on the service pages.
 *
 * An About page is where an agency lies most easily, so the verification for
 * this one was done first and it came back almost empty. There is no founder,
 * director, employee or contractor named anywhere in this project, no
 * biography, no LinkedIn profile, no founding date, no company history, no
 * milestone, no award, accreditation, membership or partnership, and no team
 * photography — public/images holds exactly one file and it is the contact
 * backdrop. So there is no people section on this page. It is replaced by a
 * working-model section built only from facts already approved elsewhere in
 * the project: UK-based, one connected process across the disciplines, and
 * the person who audits the account is the person who runs it.
 *
 * Two further deliberate omissions. Location is "UK-based" and nothing more —
 * no city, no office, no registered address, because none is verified. And
 * nothing here claims a client roster: the case studies are labelled concepts
 * and no client work has cleared approval, so the staffing commitment is
 * written as a commitment rather than as a description of a current client
 * list.
 */
/**
 * `absolute`, because the root layout's title template appends " — Optara
 * Digital" and any About title containing the company name would render it
 * twice.
 */
const TITLE = "About Optara Digital | Connected Digital Growth";
const DESCRIPTION =
  "How Optara Digital connects branding, search, paid media, social, websites and applications around clearer commercial objectives and stronger customer journeys.";

/** The six inputs in the hero visual, in customer-journey order. */
const DISCIPLINES = [
  { label: "Recognition", service: "Branding", href: "/services/branding", icon: "branding" },
  { label: "Discovery", service: "SEO & GEO", href: "/services/seo-geo", icon: "seo" },
  { label: "Demand", service: "Google Ads", href: "/services/google-ads", icon: "ads" },
  { label: "Engagement", service: "Social Media", href: "/services/social-media", icon: "social" },
  { label: "Conversion", service: "Website Design", href: "/services/website-design", icon: "web" },
  { label: "Product value", service: "App Development", href: "/services/app-development", icon: "app" },
] as const;

/**
 * Balanced by construction. The left column describes what happens when work
 * is split across briefs — not an accusation against specialist agencies,
 * plenty of which do excellent work inside their own scope.
 */
const DISCONNECTED = [
  "Separate briefs",
  "Conflicting messages",
  "Channel-only reporting",
  "Repeated work",
  "Weak handovers",
  "An unclear customer journey",
];

const CONNECTED = [
  "A shared objective",
  "Consistent positioning",
  "Coordinated demand",
  "Stronger destinations",
  "Useful measurement",
  "Continuous learning",
];

const GROWTH_STAGES = [
  {
    number: "01",
    title: "Build recognition",
    body: "Branding and consistent communication make the business easier to recognise, understand and remember.",
    services: [DISCIPLINES[0]],
  },
  {
    number: "02",
    title: "Capture demand",
    body: "SEO & GEO, Google Ads and relevant content help the business become visible at the moment customer interest turns active.",
    services: [DISCIPLINES[1], DISCIPLINES[2], DISCIPLINES[3]],
  },
  {
    number: "03",
    title: "Convert attention",
    body: "Clear websites, landing pages and user journeys turn that interest into a meaningful next action.",
    services: [DISCIPLINES[4]],
  },
  {
    number: "04",
    title: "Scale growth",
    body: "Applications, measurement and continuous optimisation build systems that can evolve as the business does.",
    services: [DISCIPLINES[5]],
  },
];

const PRINCIPLES = [
  {
    number: "01",
    name: "Clarity before activity",
    title: "Understand what needs to change before deciding what to do.",
    body: "More campaigns, content or technology do not automatically create progress. We start by identifying the commercial objective, the customer journey and the constraint most worth solving.",
    chain: ["Objective", "Constraint", "Priority", "Decision"],
  },
  {
    number: "02",
    name: "Connection over silos",
    title: "Consider every discipline in relation to the wider journey.",
    body: "Brand, demand generation, content and digital experience should reinforce one another. We protect the connections between them rather than treating each brief as an isolated assignment.",
    chain: ["Shared journey", "Clear handovers", "Shared information"],
  },
  {
    number: "03",
    name: "Evidence with judgement",
    title: "Use data to improve decisions without letting dashboards replace thinking.",
    body: "Performance evidence matters, but numbers need context. We combine quantitative signals, audience behaviour and professional judgement to work out what should change next.",
    chain: ["Quantitative signal", "Audience behaviour", "Context", "Decision"],
  },
  {
    number: "04",
    name: "Useful technology",
    title: "Use technology where it creates genuine value.",
    body: "Automation, applications and artificial intelligence can improve a workflow, but novelty is not a strategy. The right answer is the simplest one capable of delivering the outcome well.",
    chain: ["Problem", "Possible tool", "Value test", "Simplest suitable solution"],
  },
  {
    number: "05",
    name: "Quality that can be used",
    title: "Create work that is distinctive, practical and built to evolve.",
    body: "Strong thinking has limited value when a team cannot apply it. Strategies, brand systems, websites and products should stay understandable, maintainable and useful long after delivery.",
    chain: ["Strategy", "System", "Guidance", "Repeated application", "Evolution"],
  },
];

const APPROACH = [
  {
    number: "01",
    stage: "Understand",
    title: "Establish the commercial objective and current position.",
    body: "We begin with the business, the audience, the existing activity and the intended outcome, rather than assuming a particular channel is the answer.",
  },
  {
    number: "02",
    stage: "Prioritise",
    title: "Identify the constraint with the greatest practical value.",
    body: "We separate the genuinely urgent from the merely distracting, and define a focused place to begin.",
  },
  {
    number: "03",
    stage: "Connect",
    title: "Design the solution around the complete customer journey.",
    body: "We work out the message, channel, destination, technology and measurement needed for the work to create value beyond its immediate output.",
  },
  {
    number: "04",
    stage: "Improve",
    title: "Use evidence and experience to strengthen what follows.",
    body: "After implementation we use genuine behaviour and commercial learning to refine the next priorities, rather than repeating activity out of habit.",
  },
];

const EXPECTATIONS = [
  {
    title: "Clear communication",
    body: "Decisions explained in language you can repeat internally, without hiding behind terminology that makes simple things sound complicated.",
  },
  {
    title: "Visible priorities",
    body: "What is being worked on, why it matters and what should happen next — stated plainly rather than assembled from a monthly report.",
  },
  {
    title: "Honest advice",
    body: "The work most likely to create value, including when that means narrowing the scope, delaying something, or leaving alone what already works.",
  },
  {
    title: "Shared context",
    body: "Decisions informed by the wider brand, customer journey and commercial objective, not only by the channel in front of us.",
  },
  {
    title: "Practical handover",
    body: "Agreed assets, guidance and systems delivered in a form your team can understand, use and keep using without us.",
  },
  {
    title: "Responsible boundaries",
    body: "Clarity about scope, dependencies, limitations and the things outside our control — said at the start rather than when something slips.",
  },
];

const FIT = [
  "There is a clear commercial objective behind the work.",
  "Brand and performance are understood to influence one another.",
  "Considered strategy is valued alongside execution.",
  "There is a willingness to look at the complete customer journey.",
  "Honest recommendations are wanted more than automatic agreement.",
  "Internal knowledge and timely feedback can be made available.",
  "The quality of the final customer experience genuinely matters.",
  "Priorities can be set, rather than everything attempted at once.",
  "The digital work is expected to evolve over time.",
];

const FAQS: AccordionItem[] = [
  {
    question: "What type of agency is Optara Digital?",
    answer: [
      "A digital growth agency. We connect Branding, SEO & GEO, Google Ads, Social Media, Website Design and App Development around a wider commercial objective rather than running each as a separate service line.",
      "The distinction that matters in practice is that decisions in one discipline get made with the others in view — what happens before someone arrives, and what happens after.",
    ],
  },
  {
    question: "Where is Optara Digital based?",
    answer: [
      "Optara Digital is UK-based, and the work is delivered remotely.",
      "We are not going to list an office address or a row of city names for the look of it. Where the work happens matters considerably less than who is doing it and whether it is any good.",
    ],
  },
  {
    question: "Does Optara work across individual services or complete programmes?",
    answer: [
      "Both. You can start with one focused priority — a brand position, a website, a search problem — or with a more connected programme across several disciplines.",
      "Starting narrow is common and often the sensible choice. Nothing here requires you to buy all six services, and we would rather do one thing properly than spread a budget thinly across everything at once.",
    ],
  },
  {
    question: "Who will we work with?",
    answer: [
      "The person who audits the account is the person who runs it. There is no handover to someone more junior once an agreement is signed, and you will always know who is doing the work.",
      "We are not going to describe departments or account teams that do not exist. Where a piece of work needs a specialist discipline we do not cover, we say so rather than stretch to it.",
    ],
  },
  {
    question: "Can Optara work alongside our existing team or another agency?",
    answer: [
      "Yes, and it is often the better arrangement where there is real capability in-house already. It works when responsibilities, communication and decision-making are clear from the start.",
      "Where it goes wrong is ambiguity — two parties each assuming the other owns something. We would rather agree the boundaries plainly at the beginning than discover them halfway through.",
    ],
  },
  {
    question: "What types of businesses does Optara work with?",
    answer: [
      "Fit has more to do with the commercial objective, a willingness to prioritise and the value placed on connected thinking than with a particular industry or company size.",
      "The common thread is a considered, higher-value purchase where the buyer researches before making contact. If you sell low-value products at high volume, a specialist ecommerce agency is a better fit and we will tell you so.",
    ],
  },
  {
    question: "How does a project usually begin?",
    answer: [
      "By understanding the objective, the current position and the problem most worth solving, before scope is confirmed. That conversation quite often changes what the work should be.",
      "We do not offer a free audit as a marketing device. Where a genuine audit is the right first step, it is scoped and agreed as a piece of work in its own right.",
    ],
  },
  {
    question: "Does Optara guarantee results?",
    answer: [
      "No, and we would be wary of anyone who does. Commercial outcomes depend on market conditions, competitors, pricing, how quickly decisions get made internally and what happens after an enquiry arrives — most of which sits outside an agency's control.",
      "What we hold ourselves to is the quality and clarity of the agreed work, honest measurement, and telling you early when something is not working rather than waiting to be asked.",
    ],
  },
];

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/about",
  },
};

/**
 * Organization carries name, url and description only. No founder, no
 * employee count, no founding date, no postal address, no award, no rating —
 * none of it is verified, and structured data is exactly where inventing it
 * would do the most damage.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteOrigin}/about#webpage`,
      url: `${siteOrigin}/about`,
      name: TITLE,
      description: DESCRIPTION,
      about: { "@id": `${siteOrigin}#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "About", item: `${siteOrigin}/about` },
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

export default function AboutPage() {
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
          {/* Even columns rather than the service pages' 0.86fr split: this
              H1 is long, and a narrower copy column pushed it to five lines
              and the CTAs below the fold at 1440x900. */}
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
                    About
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">About Optara</p>
                <h1 className="t-display-xl mt-5 max-w-[18ch]">
                  Growth works better when every decision{" "}
                  <span className="text-accent">strengthens the next.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
                  Optara Digital is a UK-based digital growth agency connecting
                  brand, search, paid media, social, websites and applications
                  around one commercial objective: helping ambitious businesses
                  build stronger momentum.
                </p>
                <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="#principles" withArrow className="justify-center">
                    How we work
                  </Button>
                  <Button href="/contact" variant="outline" className="justify-center">
                    Speak to us
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* Six disciplines converging on one objective, then the journey
                and the loop back. Each discipline is a real link to its
                service page, so the visual is navigation as well as
                illustration, and every label is selectable text rather than a
                picture of words. No orbit, no map, no counter, no photograph. */}
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
                  <p className="t-mono text-[var(--muted)]">Six disciplines</p>
                  <ul className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {DISCIPLINES.map((d) => (
                      <li key={d.label}>
                        <Link
                          href={d.href}
                          className="group flex h-full flex-col gap-1.5 rounded-[10px] border border-[var(--hairline)] bg-paper p-2.5 transition-colors duration-200 hover:border-accent/40 focus-visible:border-accent/40"
                        >
                          <span className="flex items-center gap-1.5 text-accent">
                            <ServiceIcon name={d.icon} className="h-3.5 w-3.5" />
                            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em]">
                              {d.label}
                            </span>
                          </span>
                          <span className="text-[0.8125rem] leading-tight text-ink/60 transition-colors duration-200 group-hover:text-accent">
                            {d.service}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Six paths narrowing to one direction. */}
                  <div aria-hidden="true" className="relative mx-auto my-3 h-6 w-full max-w-[72%]">
                    <span className="absolute inset-x-0 top-0 block h-px bg-[rgba(91,61,245,0.28)]" />
                    <span className="absolute left-0 top-0 block h-2 w-px bg-[rgba(91,61,245,0.28)]" />
                    <span className="absolute right-0 top-0 block h-2 w-px bg-[rgba(91,61,245,0.28)]" />
                    <span className="absolute left-1/2 top-0 block h-full w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(91,61,245,0.4),rgba(91,61,245,0.15))]" />
                  </div>

                  <div className="flex items-center gap-3 rounded-[12px] border border-accent/25 bg-accent/[0.05] p-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-paper">
                      <LogoMark className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                        Shared objective
                      </span>
                      <span className="mt-1 block text-[0.9375rem] leading-tight">
                        One commercial direction
                      </span>
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-3 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.4),rgba(91,61,245,0.15))]"
                  />

                  {/* A 2x2 grid on the narrowest phones and a single row from
                      sm up. These four labels are longer than they look: on one
                      row at 360px they forced the hero's grid track 41px wider
                      than the shell, which ate the right gutter. Wrapping keeps
                      every label fully readable rather than truncating them. */}
                  <p className="t-mono text-[var(--muted)]">Customer journey</p>
                  <ol className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2 rounded-[12px] border border-[var(--hairline)] bg-paper px-3 py-3 sm:flex sm:items-center sm:justify-between sm:gap-1">
                    {["Notice", "Consider", "Choose", "Return"].map((state, i) => (
                      <li key={state} className="flex min-w-0 items-center gap-1">
                        {i > 0 ? (
                          <span
                            aria-hidden="true"
                            className="mr-1 hidden h-px w-2 shrink-0 bg-[rgba(91,61,245,0.35)] sm:block sm:w-5"
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

                  <div className="mt-2.5 flex items-center gap-2.5 rounded-[12px] border border-dashed border-accent/30 px-3.5 py-1.5">
                    <span aria-hidden="true" className="text-accent">
                      ↺
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60">
                      What we learn sharpens the next decision
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Optara exists ────────────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Why Optara exists</p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Marketing loses momentum{" "}
                    <span className="text-accent">
                      when its parts are treated in isolation.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    A brand campaign can create attention without giving anyone
                    a clear next step. Search and paid media can generate
                    traffic that lands on the wrong experience. A strong website
                    can stay invisible without demand behind it. Every part can
                    look reasonable on its own while the whole journey is weaker
                    than it should be.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* Two columns, identical treatment, each headed by real text so
                the contrast never depends on colour alone. */}
            <div className="mt-14 grid gap-4 lg:grid-cols-2">
              <RevealText>
                <div className="h-full rounded-[18px] border border-[var(--hairline)] bg-paper p-7 md:p-9">
                  <p className="t-mono text-[var(--muted)]">When work is split up</p>
                  <h3 className="t-display-md mt-3 text-[clamp(1.25rem,1.8vw,1.5rem)]">
                    Disconnected activity
                  </h3>
                  <ul className="mt-6 flex flex-col gap-3">
                    {DISCONNECTED.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[0.9375rem] leading-[1.55] text-ink/70"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] block h-1 w-1 shrink-0 rounded-full bg-[rgba(18,19,26,0.28)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealText>

              <RevealText delay={0.08}>
                <div className="h-full rounded-[18px] border border-accent/25 bg-paper p-7 md:p-9">
                  <p className="t-mono text-accent">When decisions are connected</p>
                  <h3 className="t-display-md mt-3 text-[clamp(1.25rem,1.8vw,1.5rem)]">
                    Connected momentum
                  </h3>
                  <ul className="mt-6 flex flex-col gap-3">
                    {CONNECTED.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[0.9375rem] leading-[1.55] text-ink/70"
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
              </RevealText>
            </div>

            <RevealText>
              <p className="mt-8 max-w-[64ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                None of this is an argument against specialists — a great deal
                of excellent work is done inside a single discipline. Optara was
                built around a simpler idea: every marketing decision should
                understand what comes before it, what follows it, and what it
                contributes to the wider objective.
              </p>
            </RevealText>
          </div>
        </section>

        {/* ── The connected-growth perspective ─────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">How we see growth</p>
                  <h2 className="t-display-lg mt-6 max-w-[24ch]">
                    Recognition, demand and conversion are{" "}
                    <span className="text-accent">parts of the same journey.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Customers do not experience branding, search, advertising,
                    content and digital products as separate agency services.
                    They experience one business. We consider each interaction
                    against the complete journey, so an improvement in one place
                    strengthens the decisions around it.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* Four chapters with the relevant services connected beneath each:
                the growth story and the service map in one structure. */}
            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {GROWTH_STAGES.map((stage) => (
                <RevealItem
                  as="li"
                  key={stage.number}
                  className="grid gap-6 border-t border-[var(--hairline)] py-9 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)] md:py-11"
                >
                  <div className="flex items-baseline gap-4 md:col-span-5">
                    <span className="t-mono text-accent">{stage.number}</span>
                    <h3 className="t-display-md text-[clamp(1.375rem,2vw,1.75rem)]">
                      {stage.title}
                    </h3>
                  </div>
                  <div className="md:col-span-7">
                    <p className="max-w-[52ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                      {stage.body}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {stage.services.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            className="group inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] px-3.5 py-2 text-[0.875rem] text-ink/75 transition-colors duration-200 hover:border-accent hover:text-accent focus-visible:border-accent"
                          >
                            <ServiceIcon
                              name={s.icon}
                              className="h-3.5 w-3.5 text-accent"
                            />
                            {s.service}
                            <ArrowIcon
                              aria-hidden="true"
                              className="h-3.5 w-3.5 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                            />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── Working principles ───────────────────────────────────────── */}
        <section
          id="principles"
          data-theme="bone"
          className="section scroll-mt-28 bg-[var(--bg)]"
        >
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">What guides the work</p>
              <h2 className="t-display-lg mt-6 max-w-[20ch]">
                Clear principles{" "}
                <span className="text-accent">create better decisions.</span>
              </h2>
            </RevealText>

            {/* Five full-width editorial rows. Everything visible at once —
                nothing behind a tab, a hover or a selector that could leave a
                blank panel or hide content from a phone. */}
            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {PRINCIPLES.map((p) => (
                <RevealItem
                  as="li"
                  key={p.number}
                  className="grid gap-6 border-t border-[var(--hairline)] py-9 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)] md:py-11"
                >
                  <div className="md:col-span-4">
                    <span className="t-mono text-accent">{p.number}</span>
                    <h3 className="t-display-md mt-3 text-[clamp(1.25rem,1.8vw,1.5rem)]">
                      {p.name}
                    </h3>
                    <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
                      {p.chain.map((c, i) => (
                        <li key={c} className="flex items-center gap-2">
                          {i > 0 ? (
                            <span
                              aria-hidden="true"
                              className="block h-px w-2.5 bg-[rgba(91,61,245,0.3)]"
                            />
                          ) : null}
                          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/55">
                            {c}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="md:col-span-7 md:col-start-6">
                    <p className="max-w-[44ch] text-[1.125rem] font-medium leading-[1.45]">
                      {p.title}
                    </p>
                    <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink/70">
                      {p.body}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── How we approach a problem ────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">How we work</p>
                  <h2 className="t-display-lg mt-6 max-w-[24ch]">
                    Begin with the most valuable problem,{" "}
                    <span className="text-accent">not a predetermined package.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Some businesses need clearer positioning. Others need
                    stronger visibility, a better website, or a product that
                    removes operational friction. The right starting point
                    depends on what is limiting progress and what the business
                    is ready to support.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* A route with the rule running through each node, distinct from
                the card-based processes on the service pages. */}
            <RevealGroup
              as="ol"
              className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4"
              stagger={0.07}
              soft
            >
              {APPROACH.map((step) => (
                <RevealItem as="li" key={step.number} className="relative pt-8">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 block h-px bg-[var(--hairline)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-2 w-2 -translate-y-1/2 rounded-full border border-accent bg-[var(--bg)]"
                  />
                  <div className="flex items-baseline gap-3">
                    <span className="t-mono text-accent">{step.number}</span>
                    <h3 className="text-[1.0625rem] font-medium">{step.stage}</h3>
                  </div>
                  <p className="mt-3.5 max-w-[30ch] text-[1rem] font-medium leading-[1.4]">
                    {step.title}
                  </p>
                  <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                    {step.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── What clients should expect ───────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">The working relationship</p>
              <h2 className="t-display-lg mt-6 max-w-[24ch]">
                Direct communication, clear priorities and{" "}
                <span className="text-accent">honest recommendations.</span>
              </h2>
            </RevealText>

            <RevealGroup
              as="ul"
              className="mt-14 grid gap-x-[clamp(2rem,5vw,5rem)] md:grid-cols-2"
              stagger={0.05}
              soft
            >
              {EXPECTATIONS.map((item) => (
                <RevealItem
                  as="li"
                  key={item.title}
                  className="border-t border-[var(--hairline)] py-7"
                >
                  <h3 className="text-[1.0625rem] font-medium leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                    {item.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── Working model ────────────────────────────────────────────────
            Where a team grid would normally go. There is no verified founder,
            employee or contractor information in this project and no team
            photography, so rather than invent people this section says only
            what is actually known about how the work is staffed. */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div className="lg:col-span-5">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">How the work is staffed</p>
                <h2 className="t-display-lg mt-6">
                  The right expertise around{" "}
                  <span className="text-accent">the right problem.</span>
                </h2>
              </RevealText>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <RevealText delay={0.1}>
                <p className="t-body-lg max-w-[52ch] text-ink/75">
                  Optara is UK-based and works remotely. The work stays focused
                  around the commercial objective, with the strategic, creative
                  and technical disciplines brought into one connected process
                  rather than passed between separate teams.
                </p>
                <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                  The person who audits an account is the person who runs it.
                  There is no handover to someone more junior once an agreement
                  is signed, and you will always know who is doing the work.
                </p>
                <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink/70">
                  You will not find invented headcount, an office address or a
                  wall of logos on this page. Where a piece of work needs a
                  discipline we do not cover, we say so and help you find it
                  rather than stretching to cover the gap.
                </p>
              </RevealText>
            </div>
          </div>
        </section>

        {/* ── Who we work well with ────────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div className="lg:col-span-5">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">Who we work well with</p>
                <h2 className="t-display-lg mt-6">
                  Ambitious businesses prepared to{" "}
                  <span className="text-accent">make connected decisions.</span>
                </h2>
                <p className="t-body-lg mt-7 max-w-[40ch] text-ink/75">
                  The right engagement does not depend on buying every service.
                  It depends on starting with a meaningful priority and making
                  decisions that support the wider journey.
                </p>
              </RevealText>
            </div>

            <RevealGroup
              as="ul"
              className="lg:col-span-6 lg:col-start-7"
              stagger={0.04}
              soft
            >
              {FIT.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item}
                  className="flex items-start gap-5 border-b border-[var(--hairline)] py-4 first:border-t"
                >
                  <span className="t-mono shrink-0 text-[var(--muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[1.0625rem] leading-[1.55] text-ink/80">
                    {item}
                  </span>
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
                  About <span className="text-accent">Optara.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="about-faq" />
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
                Looking for clearer direction{" "}
                <span className="text-[var(--accent-fg)]">across digital growth?</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                Tell us what the business is trying to achieve, where momentum
                is being lost and which decisions currently feel disconnected.
                We will help identify the strongest place to begin.
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
