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
 * Honesty constraints specific to social: no follower, engagement, reach or
 * impression figure appears anywhere; nothing guarantees growth or virality;
 * no platform partnership or certification is claimed; no replica of a
 * platform feed appears. Content capabilities are deliberately planning- and
 * direction-led rather than production-led, because there is no evidence in
 * this project that filming or photography is offered in house — claiming a
 * crew we cannot prove exists would be the easiest lie on the page.
 */
const TITLE = "Social Media Strategy and Management";
const DESCRIPTION =
  "Build consistent brand visibility with connected Social Media strategy, content planning, creative direction, audience insight and performance optimisation from Optara Digital.";

const OUTCOMES = [
  {
    number: "01",
    title: "Stronger recognition",
    body: "Create a consistent visual and verbal presence that becomes easier to recognise across repeated interactions.",
  },
  {
    number: "02",
    title: "More useful communication",
    body: "Turn business knowledge, customer questions and brand ideas into content that helps audiences understand the value more clearly.",
  },
  {
    number: "03",
    title: "Better audience relationships",
    body: "Create meaningful interaction by listening, responding and developing content around genuine audience interests.",
  },
  {
    number: "04",
    title: "Wider campaign support",
    body: "Use social activity to strengthen brand campaigns, paid media, website traffic, launches and long-term demand.",
  },
];

const CONTENT_SYSTEM = [
  { step: "Commercial objective", note: "What the activity is ultimately for" },
  { step: "Brand position", note: "What the business stands for" },
  { step: "Audience needs", note: "What people are actually trying to work out" },
  { step: "Content themes", note: "A small number of ideas worth returning to" },
  { step: "Creative concepts", note: "How those themes become something worth seeing" },
  { step: "Platform formats", note: "The same idea, shaped for where it appears" },
  { step: "Editorial schedule", note: "A rhythm the team can actually sustain" },
  { step: "Distribution", note: "Organic reach, and paid support where it earns its place" },
  { step: "Audience response", note: "What people asked, shared and ignored" },
  { step: "Learning and refinement", note: "What that evidence changes next" },
];

const CAPABILITIES = [
  {
    title: "Strategy and audience",
    body: "Define the role social media should play within the wider marketing strategy, and who it is genuinely for.",
    items: [
      "Objective setting",
      "Audience understanding",
      "Platform priorities",
      "Competitor context",
      "Brand positioning",
      "Channel roles",
      "Campaign alignment",
      "Measurement planning",
    ],
  },
  {
    title: "Content and creative",
    body: "Create clear themes and a recognisable creative approach so content stays consistent without becoming repetitive.",
    items: [
      "Content pillars",
      "Audience questions",
      "Topic planning",
      "Expertise-led content",
      "Visual direction",
      "Social templates",
      "Copy direction",
      "Campaign creative",
      "Social copy",
      "Static and carousel creative",
      "Short-form video planning",
      "Motion direction",
    ],
  },
  {
    title: "Planning and distribution",
    body: "Organise themes, formats and campaign priorities into a publishing rhythm the team can maintain.",
    items: [
      "Editorial calendars",
      "Campaign scheduling",
      "Content sequencing",
      "Approval workflows",
      "Asset coordination",
      "Platform adaptation",
      "Publishing guidance",
      "Content reuse planning",
    ],
  },
  {
    title: "Community, paid support and learning",
    body: "Use audience interaction, selective paid distribution and honest reporting to improve what comes next.",
    items: [
      "Community principles and response guidance",
      "Audience-question tracking",
      "Recurring-topic identification",
      "Paid-content planning",
      "Paid audience strategy",
      "Creative adaptation and landing-page connection",
      "Content-performance review",
      "Website-journey analysis",
      "Editorial refinement",
    ],
  },
];

const SYSTEM_LAYERS = [
  { layer: "Strategy", parts: ["Commercial objective", "Brand position"] },
  { layer: "Audience", parts: ["Audience need", "Platform behaviour"] },
  { layer: "Content themes", parts: ["Content pillars", "Campaign themes"] },
  { layer: "Creative formats", parts: ["Creative concept", "Format adaptation"] },
  { layer: "Distribution", parts: ["Organic publishing", "Paid support where useful"] },
  { layer: "Response", parts: ["Community interaction", "Website or campaign action"] },
  { layer: "Learning", parts: ["Content insight", "Strategic refinement"] },
];

const PROCESS = [
  {
    number: "01",
    stage: "Discover",
    title: "Understand the business, audience and current activity.",
    body: "We examine the commercial objective, brand position, audience priorities and existing social presence to understand where social media can create the greatest value.",
    activities: [
      "Stakeholder discovery",
      "Brand review",
      "Audience understanding",
      "Existing-channel assessment",
      "Competitor context",
      "Content review",
    ],
  },
  {
    number: "02",
    stage: "Define",
    title: "Give Social Media a clear strategic role.",
    body: "We define the objectives, platform priorities, audience focus and content themes that should guide the wider programme.",
    activities: [
      "Objective setting",
      "Channel roles",
      "Audience priorities",
      "Content pillars",
      "Creative direction",
      "Measurement approach",
    ],
  },
  {
    number: "03",
    stage: "Plan",
    title: "Build the editorial and creative system.",
    body: "We translate the strategy into content themes, formats, campaign priorities and a practical publishing rhythm.",
    activities: [
      "Editorial roadmap",
      "Format planning",
      "Campaign planning",
      "Content sequencing",
      "Approval workflow",
      "Asset requirements",
    ],
  },
  {
    number: "04",
    stage: "Create",
    title: "Develop content and adapt it for each platform.",
    body: "We create or guide the agreed content, ensuring the message remains recognisable while the format reflects the behaviour of each platform and audience.",
    activities: [
      "Content creation",
      "Copy development",
      "Creative adaptation",
      "Publishing support",
      "Paid amplification",
      "Community guidance",
    ],
  },
  {
    number: "05",
    stage: "Learn",
    title: "Use audience response to sharpen future decisions.",
    body: "We review how audiences engage, which ideas create useful action and how social activity supports the wider customer journey.",
    activities: [
      "Content review",
      "Audience-response analysis",
      "Website behaviour",
      "Campaign learning",
      "Editorial refinement",
      "Strategic recommendations",
    ],
  },
];

const SIGNS = [
  "Content is published regularly but lacks a clear strategic purpose.",
  "The brand looks or sounds different from one post to the next.",
  "Teams struggle to decide what to publish.",
  "Social activity is disconnected from wider campaigns.",
  "Content follows trends without strengthening the brand.",
  "Audience engagement produces little useful learning.",
  "Different platforms receive identical content without adaptation.",
  "Internal teams lack the capacity to maintain quality consistently.",
  "Reporting focuses on followers and likes rather than meaningful outcomes.",
  "A launch, repositioning or new market requires a clearer content system.",
];

const RELATED = [
  {
    name: "Branding",
    href: "/services/branding",
    icon: "branding",
    body: "Clear positioning, identity and voice make social content easier to recognise and more consistent.",
  },
  {
    name: "SEO & GEO",
    href: "/services/seo-geo",
    icon: "seo",
    body: "Useful search-led topics can support social content, while audience questions can reveal new search and editorial opportunities.",
  },
  {
    name: "Google Ads",
    href: "/services/google-ads",
    icon: "ads",
    body: "Strong organic content and creative concepts can support paid campaigns and audience development.",
  },
  {
    name: "Website Design",
    href: "/services/website-design",
    icon: "web",
    body: "Social activity becomes more valuable when it leads to clear, relevant and conversion-focused website journeys.",
  },
  {
    name: "App Development",
    href: "/services/app-development",
    icon: "app",
    body: "Social Media can support awareness, education and adoption around digital products and customer platforms.",
  },
] as const;

const FAQS: AccordionItem[] = [
  {
    question: "Which Social Media platforms should our business use?",
    answer: [
      "The ones where your audience actually is, and where you can sustain something worth their attention. Platform choice should follow audience behaviour, the objective, and what your team can realistically maintain to a decent standard.",
      "Being present everywhere is usually worse than being genuinely good in one or two places. We would rather recommend fewer channels done properly.",
    ],
  },
  {
    question: "How often should we publish content?",
    answer: [
      "Often enough to stay recognisable, rarely enough that every piece is worth publishing. Frequency should follow quality, audience expectations and the resources genuinely available.",
      "We will not recommend a daily schedule as a default. A slower rhythm that holds its standard beats a fast one that visibly runs out of ideas.",
    ],
  },
  {
    question: "Does Optara create the content as well as the strategy?",
    answer: [
      "Yes, within the agreed scope: strategy, content themes, copy, static and carousel creative, campaign concepts and direction for motion and short-form video.",
      "Where a project needs a full film or photography shoot, that is a production requirement we would scope with you and bring in the right people for rather than claim as an in-house crew.",
    ],
  },
  {
    question: "Can you work with our internal marketing team?",
    answer: [
      "Often that is the better arrangement. Your team knows the business and the customers; what is usually missing is a system — themes, templates, a rhythm and a clear standard.",
      "We can provide the strategy and the framework and let your team run it, or share the work, depending on capacity.",
    ],
  },
  {
    question: "Do you provide community management?",
    answer: [
      "We provide response frameworks, tone guidance, escalation principles and tracking of the questions audiences keep asking, so your team can respond quickly and consistently.",
      "We do not offer round-the-clock monitored community management. If that is what the business needs, we will say so rather than stretch a smaller service over the gap.",
    ],
  },
  {
    question: "Can you manage paid social campaigns?",
    answer: [
      "Yes, where paid distribution genuinely earns its place — extending content that is already working, supporting a campaign, or reaching a defined audience.",
      "It works best when the creative, the audience and the landing page are considered together. Paid budget behind weak content mostly buys a wider audience for the same problem.",
    ],
  },
  {
    question: "How do you measure Social Media performance?",
    answer: [
      "On whether the activity is doing its job: which themes hold attention, what audiences ask, how social traffic behaves on the website, and what it contributes to campaigns and enquiries.",
      "Followers and likes are context, not the headline. They are also the easiest numbers to grow without improving anything commercially, which is exactly why we do not lead reporting with them.",
    ],
  },
  {
    question: "Can you work with our existing brand and content?",
    answer: [
      "Yes. Existing templates, assets and content are assessed and kept where they still support the strategy. Starting again is rarely the cheapest or the best answer.",
    ],
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services/social-media" },
  openGraph: {
    title: `${TITLE} — ${site.name}`,
    description: DESCRIPTION,
    url: "/services/social-media",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}/services/social-media#webpage`,
      url: `${siteOrigin}/services/social-media`,
      name: `${TITLE} — ${site.name}`,
      description: DESCRIPTION,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteOrigin}/services` },
        { "@type": "ListItem", position: 3, name: "Social Media", item: `${siteOrigin}/services/social-media` },
      ],
    },
    {
      "@type": "Service",
      name: "Social Media",
      serviceType: "Social media strategy and content",
      url: `${siteOrigin}/services/social-media`,
      description:
        "Social strategy, content strategy, creative direction, editorial planning, community guidance, paid social support and performance reporting.",
      provider: { "@type": "Organization", name: site.name, url: siteOrigin },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Social Media capabilities",
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

export default function SocialMediaPage() {
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
                    Social Media
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">Social Media</p>
                <h1 className="t-display-xl mt-6 max-w-[15ch]">
                  Stay visible with content built{" "}
                  <span className="text-accent">around a clear purpose.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-8 max-w-[52ch] text-ink/75">
                  Optara connects strategy, creative direction, content planning
                  and audience insight to help brands become more recognisable,
                  more consistent and more valuable across social media.
                </p>
                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="/contact" withArrow className="justify-center">
                    Discuss your Social Media
                  </Button>
                  <Button href="#approach" variant="outline" className="justify-center">
                    Explore our approach
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* One idea becoming several formats and coming back as something
                learned. No feed, no platform chrome, no counters — every label
                is real text, and there is not a number in it, because any
                number here would be invented. */}
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
                  <p className="t-mono text-[var(--muted)]">One brand idea</p>
                  <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-accent/25 bg-paper p-3.5">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/[0.08]">
                      <LogoMark className="h-5 w-5" />
                    </span>
                    <span className="text-[0.9375rem] leading-tight text-ink/75">
                      Brand strategy and audience insight
                    </span>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-4 h-7 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  <p className="t-mono text-[var(--muted)]">Content themes</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {["Expertise", "Customer questions", "Campaign"].map((label) => (
                      <li
                        key={label}
                        className="rounded-full border border-accent/25 bg-accent/[0.06] px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/75"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-4 h-7 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.12),rgba(91,61,245,0.45))]"
                  />

                  {/* Three formats off one theme — the argument the page makes,
                      shown rather than stated. */}
                  <p className="t-mono text-[var(--muted)]">Adapted per format</p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      { k: "Short form", v: "Motion" },
                      { k: "Carousel", v: "Sequence" },
                      { k: "Written", v: "Depth" },
                    ].map((f) => (
                      <div
                        key={f.k}
                        className="rounded-[12px] border border-[var(--hairline)] bg-paper p-3"
                      >
                        {/* 11px, not 10px: the rest of the site's mono caption
                            floor. At 10px these were the only text on any
                            service page below it. */}
                        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                          {f.k}
                        </p>
                        <p className="mt-1.5 text-[0.875rem] leading-tight text-ink/70">{f.v}</p>
                      </div>
                    ))}
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-4 h-7 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.45),rgba(91,61,245,0.12))]"
                  />

                  <div className="rounded-[12px] border border-[var(--hairline)] bg-paper p-3.5">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-[var(--muted)]">
                      Audience response
                    </p>
                    <p className="mt-1.5 text-[0.9375rem] leading-tight">
                      What people asked, shared and ignored
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-2.5 rounded-[12px] border border-dashed border-accent/30 px-3.5 py-2.5">
                    <span aria-hidden="true" className="text-accent">
                      ↺
                    </span>
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60">
                      Learning returns to the themes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why social media matters ─────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Why social media matters</p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Consistent visibility creates familiarity.{" "}
                    <span className="text-accent">Clear strategy gives it value.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Social media gives businesses repeated opportunities to
                    communicate what they stand for, demonstrate expertise and
                    remain visible between moments of active demand. The
                    strongest results come when every post supports a
                    recognisable brand and a wider commercial objective.
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

        {/* ── The connected content system ─────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">More than regular posting</p>
                  <h2 className="t-display-lg mt-6 max-w-[20ch]">
                    One clear strategy.{" "}
                    <span className="text-accent">Many useful expressions.</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Strong social media does not begin with isolated post ideas.
                    It begins with a clear brand position, audience
                    understanding and a small number of meaningful content
                    themes. Those foundations can then be translated into
                    different formats and adapted for the behaviour of each
                    platform.
                  </p>
                </RevealText>
              </div>
            </div>

            <RevealGroup as="ol" className="mt-14 flex flex-col" stagger={0.04} soft>
              {CONTENT_SYSTEM.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item.step}
                  className="grid items-baseline gap-2 border-t border-[var(--hairline)] py-5 md:grid-cols-[auto_minmax(0,20rem)_1fr] md:gap-6"
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
              <h2 className="t-display-lg mt-6 max-w-[26ch]">
                A connected Social Media system built around{" "}
                <span className="text-accent">strategy, creativity and learning.</span>
              </h2>
            </RevealText>

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

        {/* ── The content and audience system ──────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">One connected social system</p>
                  <h2 className="t-display-lg mt-6 max-w-[26ch]">
                    Strategy creates focus. Creative creates recognition.{" "}
                    <span className="text-accent">
                      Audience response creates better decisions.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Social media becomes more valuable when content is connected
                    to a clear brand idea and a genuine audience need. Optara
                    links planning, creative, distribution and learning so each
                    piece of content contributes to a wider system rather than
                    disappearing as an isolated post.
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
              <span className="font-medium text-accent">meaningful visibility</span>.
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
                From a clear role to a{" "}
                <span className="text-accent">stronger content system.</span>
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
                <p className="t-mono text-[var(--muted)]">When to review social media</p>
                <h2 className="t-display-lg mt-6">
                  Consistent activity does not always{" "}
                  <span className="text-accent">create consistent value.</span>
                </h2>
                <p className="t-body-lg mt-7 max-w-[40ch] text-ink/75">
                  Not every business needs to publish every day or appear on
                  every platform. The strongest approach is usually a focused
                  one built around the audiences, formats and objectives that
                  matter most.
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
                    Built to strengthen the wider journey
                  </p>
                  <h2 className="t-display-lg mt-6 max-w-[22ch]">
                    Social Media builds familiarity.{" "}
                    <span className="text-accent">
                      The wider system turns it into value.
                    </span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">
                    Social media keeps the brand visible between moments of
                    active demand. Branding creates consistency. SEO &amp; GEO
                    turns expertise into discoverable content. Google Ads
                    supports focused campaigns. Website Design creates the
                    destination. App Development can extend the experience
                    through useful digital products.
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
                  Social <span className="text-accent">questions.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="social-faq" />
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
                Ready to give Social Media{" "}
                <span className="text-[var(--accent-fg)]">a clearer purpose?</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                Tell us what you are currently publishing, where consistency is
                breaking down and which audiences or commercial objectives
                matter most. We will help identify the strongest place to begin.
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <div className="flex flex-col items-start gap-5">
                <Button href="/contact" variant="light" withArrow>
                  Discuss your Social Media
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
