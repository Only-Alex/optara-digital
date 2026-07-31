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
 * The honesty constraints here are specific to paid search, which is the part
 * of the industry most prone to inventing evidence. Nothing on this page
 * guarantees a return, a cost or a lead volume. No monetary value, cost per
 * click, conversion rate or spend figure appears anywhere. No Google Partner
 * claim is made, because that status is not verified. No replica of the Google
 * Ads interface appears, because a convincing fake account implies data that
 * does not exist. And the page says plainly that Google Ads does not suit
 * every business.
 */
const TITLE = "Google Ads Management and Paid Search";
const DESCRIPTION =
  "Capture active demand with connected Google Ads strategy, campaign management, landing-page alignment, conversion tracking and ongoing optimisation from Optara Digital.";

const FACTORS = [
  {
    number: "01",
    title: "Relevant demand",
    body: "Focus investment on searches and audiences closely connected to the services, products and outcomes the business can provide.",
  },
  {
    number: "02",
    title: "Clear campaign structure",
    body: "Organise campaigns around intent, priority and commercial value so budgets can be controlled and performance can be understood.",
  },
  {
    number: "03",
    title: "Strong message continuity",
    body: "Ensure the ad promise, landing-page message and customer next step feel like one connected journey.",
  },
  {
    number: "04",
    title: "Meaningful measurement",
    body: "Track actions that indicate genuine commercial progress rather than optimising around clicks or superficial engagement alone.",
  },
];

const JOURNEY = [
  { step: "Search intent", note: "What the customer is actually trying to do" },
  { step: "Keyword and audience targeting", note: "Which demand is worth paying for" },
  { step: "Campaign and bidding structure", note: "How budget reaches that demand" },
  { step: "Ad-message relevance", note: "What the customer is promised" },
  { step: "Landing-page continuity", note: "Whether the page keeps that promise" },
  { step: "Conversion action", note: "The step that carries commercial value" },
  { step: "Commercial measurement", note: "Whether the journey was worth it" },
  { step: "Ongoing optimisation", note: "What the evidence changes next" },
];

const CAPABILITIES = [
  {
    title: "Strategy and account planning",
    body: "Identify where paid search can create meaningful value and build a campaign plan around the strongest commercial opportunities.",
    items: [
      "Business and objective discovery",
      "Existing-account review",
      "Search-demand analysis",
      "Competitor context",
      "Audience understanding",
      "Campaign planning",
      "Budget-allocation guidance",
      "Measurement planning",
    ],
  },
  {
    title: "Keyword and intent strategy",
    body: "Understand what customers are searching for and separate useful commercial intent from irrelevant or low-value demand.",
    items: [
      "Keyword research",
      "Search-intent analysis",
      "Query grouping",
      "Negative-keyword planning",
      "Match-type strategy",
      "Brand and non-brand structure",
      "Local or national targeting",
      "Opportunity prioritisation",
    ],
  },
  {
    title: "Campaign structure and build",
    body: "Create a clear account structure that supports control, relevance, testing and useful reporting.",
    items: [
      "Search campaigns",
      "Campaign and ad-group structure",
      "Performance Max where appropriate",
      "Location targeting",
      "Audience signals",
      "Device and schedule considerations",
      "Bidding configuration",
      "Ad assets and extensions",
    ],
  },
  {
    title: "Ad messaging",
    body: "Create advertising messages that reflect customer intent, communicate genuine value and connect directly with the destination page.",
    items: [
      "Message strategy",
      "Responsive search ads",
      "Value-proposition alignment",
      "Offer and service messaging",
      "Headline development",
      "Description development",
      "Asset consistency",
      "Controlled message testing",
    ],
  },
  {
    title: "Landing-page alignment",
    body: "Improve the connection between the search, advertisement and landing page so customers can understand the offer and take the appropriate next step.",
    items: [
      "Landing-page assessment",
      "Message continuity",
      "Content hierarchy",
      "CTA clarity",
      "Form-friction review",
      "Mobile usability",
      "Page-speed considerations",
      "Conversion-path recommendations",
    ],
  },
  {
    title: "Conversion tracking",
    body: "Create a reliable measurement foundation so campaign decisions are based on meaningful business actions.",
    items: [
      "Conversion-action planning",
      "Tagging guidance",
      "Form and enquiry tracking",
      "Call tracking where genuinely available",
      "Analytics alignment",
      "Consent-aware measurement",
      "Attribution considerations",
      "Data-quality review",
    ],
  },
  {
    title: "Ongoing optimisation",
    body: "Use search terms, customer behaviour and commercial outcomes to improve campaign priorities over time.",
    items: [
      "Search-term review",
      "Negative-keyword refinement",
      "Budget reallocation",
      "Bid-strategy review",
      "Message testing",
      "Landing-page insights",
      "Conversion-quality review",
      "Performance reporting",
    ],
  },
];

const SYSTEM_LAYERS = [
  { layer: "Demand", parts: ["Commercial objective", "Search intent"] },
  { layer: "Targeting", parts: ["Keyword and audience targeting", "Campaign structure"] },
  { layer: "Message", parts: ["Ad messaging", "Value proposition"] },
  { layer: "Experience", parts: ["Landing-page experience", "Clear next step"] },
  { layer: "Conversion", parts: ["Conversion action", "Lead or sale quality"] },
  { layer: "Measurement", parts: ["Commercial measurement", "Data quality"] },
  { layer: "Improvement", parts: ["Budget and priority refinement", "Message and page learning"] },
];

const PROCESS = [
  {
    number: "01",
    stage: "Discover",
    title: "Understand the objective, customer and current position.",
    body: "We begin with the commercial objective, audience, offer and existing performance so the campaign strategy is grounded in what the business genuinely needs to achieve.",
    activities: [
      "Business discovery",
      "Offer assessment",
      "Audience understanding",
      "Existing-account review",
      "Landing-page review",
      "Measurement assessment",
    ],
  },
  {
    number: "02",
    stage: "Plan",
    title: "Identify the strongest opportunities.",
    body: "We assess search demand, intent, competition and likely journey requirements to define where investment should begin and how success should be measured.",
    activities: [
      "Keyword research",
      "Intent grouping",
      "Campaign planning",
      "Budget guidance",
      "Conversion planning",
      "Landing-page requirements",
    ],
  },
  {
    number: "03",
    stage: "Build",
    title: "Create the campaign and measurement foundation.",
    body: "We build the account structure, targeting, messaging, assets and tracking required for a controlled and understandable launch.",
    activities: [
      "Campaign build",
      "Ad-group structure",
      "Targeting",
      "Negative-keyword strategy",
      "Ad messaging",
      "Conversion tracking",
      "Quality assurance",
    ],
  },
  {
    number: "04",
    stage: "Launch",
    title: "Introduce the campaigns with controlled learning.",
    body: "Campaigns are launched carefully, monitored for data quality and refined as genuine search behaviour begins to reveal which opportunities deserve greater attention.",
    activities: [
      "Launch checks",
      "Search-term monitoring",
      "Budget control",
      "Tracking validation",
      "Early message refinement",
      "Landing-page observation",
    ],
  },
  {
    number: "05",
    stage: "Improve",
    title: "Use evidence to strengthen the complete journey.",
    body: "We review search behaviour, conversion quality and commercial outcomes to refine targeting, messaging, budgets and landing-page priorities over time.",
    activities: [
      "Search-term refinement",
      "Budget reallocation",
      "Bid-strategy review",
      "Ad testing",
      "Landing-page recommendations",
      "Reporting and priority planning",
    ],
  },
];

const SIGNS = [
  "Campaigns generate clicks but few suitable enquiries.",
  "Cost is increasing without a clear explanation.",
  "Search terms include large amounts of irrelevant demand.",
  "Campaign structure has become difficult to understand or control.",
  "Ads and landing pages communicate different messages.",
  "Conversion tracking is incomplete or unreliable.",
  "Reporting focuses on clicks rather than commercial outcomes.",
  "Budgets are spread across too many low-priority campaigns.",
  "Internal teams lack the time to monitor and improve the account.",
  "A new service, market or website requires a clearer paid-search strategy.",
];

const RELATED = [
  {
    name: "Branding",
    href: "/services/branding",
    icon: "branding",
    body: "Clear positioning and a distinctive value proposition make advertising messages more relevant and credible.",
  },
  {
    name: "SEO & GEO",
    href: "/services/seo-geo",
    icon: "seo",
    body: "Organic and paid-search insight can reveal useful demand patterns while the two channels support different stages of visibility.",
  },
  {
    name: "Social Media",
    href: "/services/social-media",
    icon: "social",
    body: "Repeated brand exposure can strengthen familiarity before high-intent searches occur.",
  },
  {
    name: "Website Design",
    href: "/services/website-design",
    icon: "web",
    body: "Landing-page clarity, performance and usability strongly influence whether paid traffic becomes meaningful action.",
  },
  {
    name: "App Development",
    href: "/services/app-development",
    icon: "app",
    body: "Paid campaigns can support the launch and adoption of useful digital products when targeting and onboarding are connected.",
  },
] as const;

const FAQS: AccordionItem[] = [
  {
    question: "Is Google Ads suitable for every business?",
    answer: [
      "No. It works where there is genuine search demand, where the economics allow a customer to be worth more than it costs to win them, and where the business can actually handle the enquiries or sales that arrive.",
      "If the demand is not there, the margins do not support the competition, or the landing experience cannot convert, we will say so rather than take a budget that has little chance of returning.",
    ],
  },
  {
    question: "Can you guarantee a specific return on ad spend?",
    answer: [
      "No, and no responsible agency can. Performance depends on external demand, competitor behaviour, your pricing, the strength of the offer and what happens after the enquiry arrives — most of which sits outside an advertising account.",
      "What we commit to is a clear structure, honest measurement and telling you early when something is not working.",
    ],
  },
  {
    question: "How much should we spend on Google Ads?",
    answer: [
      "Budget should follow the demand that exists, the competitiveness of those searches, what a customer is worth to you, and how much data the account needs before decisions can be made with any confidence.",
      "We would rather establish that from your numbers than name an arbitrary minimum.",
    ],
  },
  {
    question: "How quickly can campaigns begin generating useful data?",
    answer: [
      "Data starts arriving as soon as campaigns run, but early data is not the same as a reliable conclusion. Useful decisions need enough volume and enough quality to separate a real pattern from noise.",
      "How long that takes depends on the search volume in your market, so we will not put a fixed number of days on it before we have looked.",
    ],
  },
  {
    question: "Can Optara manage an existing Google Ads account?",
    answer: [
      "Yes. We audit what is there first, because established accounts often hold useful conversion history and learning that a rebuild would throw away.",
      "Where restructuring is genuinely needed we explain what changes and why, rather than starting again by default.",
    ],
  },
  {
    question: "Do you create or improve landing pages?",
    answer: [
      "Yes. Where the destination page is the thing limiting performance, we assess and improve it through our website design service rather than continuing to optimise campaigns that send people somewhere unconvincing.",
    ],
  },
  {
    question: "How do you measure campaign success?",
    answer: [
      "On qualified enquiries, sales and commercial value. Clicks, impressions and click-through rate are diagnostic detail, not the headline.",
      "We are also clear about the limits of attribution: consent, cross-device journeys and offline steps all mean the picture is directional rather than perfect, and we would rather say that than present a number as more certain than it is.",
    ],
  },
  {
    question: "Do we keep ownership of the advertising account?",
    answer: [
      "Yes. The account should be yours, in your name, with your team holding appropriate access. If we ever part company you keep the account, its history and its learning rather than starting from nothing.",
    ],
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/google-ads" },
  openGraph: {
    title: `${TITLE} — ${site.name}`,
    description: DESCRIPTION,
    url: "/services/google-ads",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}/services/google-ads#webpage`,
      url: `${siteOrigin}/services/google-ads`,
      name: `${TITLE} — ${site.name}`,
      description: DESCRIPTION,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteOrigin}/services` },
        { "@type": "ListItem", position: 3, name: "Google Ads", item: `${siteOrigin}/services/google-ads` },
      ],
    },
    {
      "@type": "Service",
      name: "Google Ads",
      serviceType: "Paid search management",
      url: `${siteOrigin}/services/google-ads`,
      description:
        "Paid-search strategy, keyword and intent research, campaign build, ad messaging, landing-page alignment, conversion tracking and ongoing optimisation.",
      provider: { "@type": "Organization", name: site.name, url: siteOrigin },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Google Ads capabilities",
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

export default function GoogleAdsPage() {
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
                    Google Ads
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">Google Ads</p>
                <h1 className="t-display-xl mt-6 max-w-[14ch]">
                  Capture active demand and{" "}
                  <span className="text-accent">turn it into opportunity.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-8 max-w-[52ch] text-ink/75">
                  Optara connects search intent, campaign structure, relevant
                  messaging and conversion-focused landing pages to help Google
                  Ads investment generate more valuable commercial outcomes.
                </p>
                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="/contact" withArrow className="justify-center">
                    Discuss your Google Ads
                  </Button>
                  <Button href="#approach" variant="outline" className="justify-center">
                    Explore our approach
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* One search travelling to a commercial action, with the loop that
                feeds what it learned back into targeting. Every label is real
                text — the diagram is a layout, not a picture of words — and
                there is not a single figure in it, because any number here
                would be invented. */}
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
                  <p className="t-mono text-[var(--muted)]">Active demand</p>
                  <p className="mt-3 rounded-full border border-accent/25 bg-paper px-4 py-2.5 text-[0.9375rem] text-ink/70">
                    “…near me, today”
                  </p>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-4 h-7 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  <p className="t-mono text-[var(--muted)]">Targeting</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {["Search intent", "Campaign structure"].map((label) => (
                      <li
                        key={label}
                        className="rounded-full border border-[var(--hairline)] bg-paper px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/70"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-4 h-7 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.12),rgba(91,61,245,0.45))]"
                  />

                  {/* The promise and the page that has to keep it, shown as a
                      matched pair — the argument the whole page makes. */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[12px] border border-accent/20 bg-accent/[0.05] p-3.5">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                        Relevant message
                      </p>
                      <p className="mt-2 text-[0.9375rem] leading-tight text-ink/75">
                        What is promised
                      </p>
                    </div>
                    <div className="rounded-[12px] border border-accent/20 bg-accent/[0.05] p-3.5">
                      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                        Landing-page match
                      </p>
                      <p className="mt-2 text-[0.9375rem] leading-tight text-ink/75">
                        Whether it is kept
                      </p>
                    </div>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-4 h-7 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  <div className="flex items-center gap-3 rounded-[12px] border border-[var(--hairline)] bg-paper p-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/[0.08]">
                      <LogoMark className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-[var(--muted)]">
                        Conversion action
                      </span>
                      <span className="mt-1 block text-[0.9375rem] leading-tight">
                        A qualified opportunity
                      </span>
                    </span>
                  </div>

                  {/* The loop back — optimisation is a return path, not a new
                      stage bolted on the end. */}
                  <div className="mt-4 flex items-center gap-2.5 rounded-[12px] border border-dashed border-accent/30 px-3.5 py-2.5">
                    <span aria-hidden="true" className="text-accent">
                      ↺
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60">
                      Measurement feeds back into targeting
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What makes paid search work ──────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">What makes paid search work</p>
                  <h2 className="t-display-lg mt-6 max-w-[20ch]">
                    Clicks are easy to buy.{" "}
                    <span className="text-accent">Valuable journeys are harder to build.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Google Ads can create immediate visibility when customers
                    are actively searching. However, performance depends on much
                    more than bidding for keywords. The targeting, message,
                    landing page and measurement must all support the same
                    commercial objective.
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
              {FACTORS.map((factor) => (
                <RevealItem
                  as="li"
                  key={factor.number}
                  className="relative border-t border-[var(--hairline)] pt-7"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                  />
                  <span className="t-mono text-accent">{factor.number}</span>
                  <h3 className="mt-3.5 text-[1.125rem] font-medium leading-tight">
                    {factor.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                    {factor.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── The complete journey ─────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">More than campaign management</p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    The campaign begins with the search.{" "}
                    <span className="text-accent">
                      Performance depends on everything that follows.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    A search query reveals intent. The campaign determines
                    whether the business appears. The advertisement shapes
                    expectation. The landing page builds confidence. Conversion
                    tracking reveals whether the journey created genuine value.
                    Optimisation must consider every stage.
                  </p>
                </RevealText>
              </div>
            </div>

            {/* Eight numbered steps with a plain-language note against each,
                rather than an SVG flow whose labels would be unreadable on a
                phone. The final step points back to the first in words. */}
            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.05} soft>
              {JOURNEY.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item.step}
                  className="grid items-baseline gap-2 border-t border-[var(--hairline)] py-5 md:grid-cols-[auto_minmax(0,22rem)_1fr] md:gap-6"
                >
                  <span className="t-mono text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.0625rem] font-medium leading-tight">{item.step}</h3>
                  <p className="text-[0.9375rem] leading-[1.55] text-ink/70">{item.note}</p>
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
                A connected paid-search system built around{" "}
                <span className="text-accent">intent and commercial value.</span>
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

        {/* ── The performance system ───────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">One connected performance system</p>
                  <h2 className="t-display-lg mt-6 max-w-[26ch]">
                    Targeting creates relevance. Landing pages create
                    confidence.{" "}
                    <span className="text-accent">Measurement creates better decisions.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Campaign performance cannot be understood in isolation.
                    Search demand, targeting, advertising messages, landing
                    pages and conversion quality all influence the outcome.
                    Optara connects those elements so optimisation is based on
                    the complete journey rather than one metric.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.06} soft>
              {SYSTEM_LAYERS.map((row, i) => (
                <RevealItem
                  as="li"
                  key={row.layer}
                  className="grid items-center gap-4 border-t border-[var(--hairline)] py-6 md:grid-cols-[auto_minmax(0,12rem)_1fr] md:gap-6"
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
              <span className="font-medium text-accent">a qualified opportunity</span>.
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
                From active demand to{" "}
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
                <p className="t-mono text-[var(--muted)]">When to review paid search</p>
                <h2 className="t-display-lg mt-6">
                  Advertising can generate activity{" "}
                  <span className="text-accent">without creating valuable results.</span>
                </h2>
                <p className="t-body-lg mt-7 max-w-[40ch] text-ink/75">
                  Not every business needs a larger advertising budget.
                  Sometimes the greatest improvement comes from better
                  targeting, stronger landing pages, more accurate tracking or a
                  narrower focus on the opportunities most likely to create
                  value.
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
                    Built to support the complete journey
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Paid search captures demand.{" "}
                    <span className="text-accent">
                      The wider system determines its value.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Google Ads can create immediate visibility when customers
                    are actively searching. Branding shapes the message. SEO
                    reveals wider demand. Website Design strengthens landing
                    pages. Social Media builds familiarity. App Development can
                    create the tools or digital products customers ultimately
                    need.
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
                  Paid-search <span className="text-accent">questions.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="ads-faq" />
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
                Ready to make paid search{" "}
                <span className="text-[var(--accent-fg)]">work harder?</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                Tell us what the campaigns are currently generating, where
                performance feels unclear and which commercial outcomes matter
                most. We will help identify the strongest place to begin.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="flex flex-col items-start gap-5">
                <Button href="/contact" variant="light" withArrow>
                  Discuss your Google Ads
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
