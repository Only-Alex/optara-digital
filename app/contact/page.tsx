import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/content";
import { siteOrigin } from "@/lib/site-url";
import { AREA_FROM_SLUG } from "@/lib/enquiry";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Accordion, type AccordionItem } from "@/components/ui/Accordion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { LogoMark } from "@/components/ui/Icons";

/**
 * The standalone Contact page.
 *
 * It previously rendered PageHero plus the shared homepage <Contact /> section,
 * so /contact was a verbatim copy of the homepage block. That section is
 * protected this sprint and is left untouched; this page has its own hero,
 * supporting content and form.
 *
 * Two deliberate omissions, both for the same reason — there is nothing
 * genuine to show:
 *
 * 1. No alternative-contact section. site.email has no mailbox behind it and
 *    site.phone sits in Ofcom's drama-reserved range, so both are fiction.
 *    There are no social profiles. Listing dead channels as "another way to
 *    get in touch" would be worse than offering none.
 * 2. No Privacy Policy link, because no Privacy Policy route exists. The form
 *    states what happens to the information instead of linking to nothing.
 *
 * The floating "Speak to us" CTA needs no suppression here: SpeakBubble is
 * mounted only in app/page.tsx, so it never renders on this route.
 */
const TITLE = "Contact Optara Digital | Start a Conversation";
const DESCRIPTION =
  "Tell Optara Digital what your business is trying to achieve and where progress currently feels unclear. Start a conversation about branding, search, paid media, social, websites or app development.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contact",
    type: "website",
  },
};

const HELPS = [
  "The outcome the business is trying to achieve",
  "What is currently preventing progress",
  "Which service or journey feels most relevant",
  "Any important timing or technical constraints",
  "The best way to reply",
];

/**
 * The first two are the approved assurances, unchanged. The third replaces
 * "You keep the audit findings": the audit belongs to Phase 1 of a signed
 * engagement, not to every enquiry, so promising it here would over-claim.
 */
const ASSURANCES = [
  "Reply within two working days",
  "No obligation, no hard sell",
  "Clear next steps, even when the scope needs refining",
];

const NEXT_STAGES = [
  {
    number: "01",
    title: "We review the context",
    body: "We read the enquiry, look at the objective and work out the questions we need answered to understand the current position.",
  },
  {
    number: "02",
    title: "We arrange the right next conversation",
    body: "Where the opportunity looks suitable, we suggest a practical next discussion rather than pushing a predetermined package.",
  },
  {
    number: "03",
    title: "We clarify the priority and scope",
    body: "We set out what should be addressed first, the dependencies involved and what a sensible engagement might look like.",
  },
];

const FAQS: AccordionItem[] = [
  {
    question: "Do we need a complete brief before getting in touch?",
    answer: [
      "No. The business objective, the problem you are running into and a little context are enough to start a useful conversation.",
      "A finished brief often locks in a solution before the problem has been properly examined. We would rather look at that together.",
    ],
  },
  {
    question: "Which service should we choose?",
    answer: [
      "“Not sure yet” is a perfectly good answer, and it is the first option in the list for that reason.",
      "Working out the most valuable place to start is part of what we do. You should not have to diagnose the solution before you can talk to us.",
    ],
  },
  {
    question: "How quickly will Optara reply?",
    answer: [
      "Within two working days. That is a commitment about replying, not about producing a proposal — a considered answer usually needs a conversation first.",
    ],
  },
  {
    question: "Can Optara work with our existing marketing or development team?",
    answer: [
      "Yes, and it is often the better arrangement where there is real capability in-house already. It works when responsibilities, communication and decision-making are clear from the start.",
      "Where it goes wrong is ambiguity — two parties each assuming the other owns something. We would rather agree the boundaries plainly at the beginning.",
    ],
  },
  {
    question: "Does submitting an enquiry create any obligation?",
    answer: [
      "None. Sending the form starts a conversation and nothing more.",
      "We also turn work down when we are not the right fit, and we would tell you that early rather than take on a project we do not think will work.",
    ],
  },
  {
    question: "Can we discuss several connected services?",
    answer: [
      "Yes — “Several connected areas” is one of the options, and connecting disciplines is the way we prefer to work.",
      "That said, the recommendation that follows is often narrower than the enquiry. Starting with one priority and doing it properly usually beats starting everything at once.",
    ],
  },
  {
    question: "Where is Optara Digital based?",
    answer: [
      "Optara Digital is UK-based, and the work is delivered remotely.",
    ],
  },
];

/** ContactPage + breadcrumbs only. No telephone, no postal address and no
 *  contactPoint, because none of those is verified — see the file header. */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": `${siteOrigin}/contact#webpage`,
      url: `${siteOrigin}/contact`,
      name: TITLE,
      description: DESCRIPTION,
      about: { "@id": `${siteOrigin}#organization` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${siteOrigin}/contact` },
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

export default async function ContactRoute({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service } = await searchParams;
  /* Validated against the approved map rather than trusted, so an arbitrary
     query value cannot reach the select as a new option. */
  const preselectedArea = (service && AREA_FROM_SLUG[service]) || "";

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
          className="relative overflow-hidden bg-[var(--bg)] pb-16 pt-36 md:pt-44"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[70rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.09),transparent_66%)]"
          />
          <div className="shell relative grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-x-[clamp(3rem,5vw,6rem)]">
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
                    Contact
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">Contact Optara</p>
                <h1 className="t-display-xl mt-5 max-w-[18ch]">
                  Tell us where you want the business to be{" "}
                  <span className="text-accent">in twelve months.</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
                  Share what you are trying to achieve, where momentum is being
                  lost and which decisions currently feel unclear. You do not
                  need to arrive with a finished brief — we start by
                  understanding the most valuable problem.
                </p>
                <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href="#enquiry" withArrow className="justify-center">
                    Start your enquiry
                  </Button>
                  <Button href="/services" variant="outline" className="justify-center">
                    Explore our services
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* Scattered context resolving into one priority and one
                conversation. Labels are real text; no handset, no envelope,
                no chat bubble, no calendar. */}
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
                  <p className="t-mono text-[var(--muted)]">What you arrive with</p>
                  <ul className="mt-2.5 grid grid-cols-2 gap-2">
                    {[
                      "An objective",
                      "A constraint",
                      "Some history",
                      "A rough budget",
                    ].map((label) => (
                      <li
                        key={label}
                        className="rounded-[10px] border border-[var(--hairline)] bg-paper px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-ink/60"
                      >
                        {label}
                      </li>
                    ))}
                  </ul>

                  <div aria-hidden="true" className="relative mx-auto my-3 h-6 w-full max-w-[70%]">
                    <span className="absolute inset-x-0 top-0 block h-px bg-[rgba(91,61,245,0.28)]" />
                    <span className="absolute left-0 top-0 block h-2 w-px bg-[rgba(91,61,245,0.28)]" />
                    <span className="absolute right-0 top-0 block h-2 w-px bg-[rgba(91,61,245,0.28)]" />
                    <span className="absolute left-1/2 top-0 block h-full w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(91,61,245,0.4),rgba(91,61,245,0.15))]" />
                  </div>

                  <div className="rounded-[12px] border border-accent/25 bg-accent/[0.05] p-3.5">
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-accent">
                      What we work out together
                    </p>
                    <p className="mt-2 text-[0.9375rem] leading-tight text-ink/75">
                      The one problem worth solving first
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mx-auto my-3 h-4 w-px bg-[linear-gradient(180deg,rgba(91,61,245,0.4),rgba(91,61,245,0.15))]"
                  />

                  <div className="flex items-center gap-3 rounded-[12px] border border-[var(--hairline)] bg-paper p-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/[0.08]">
                      <LogoMark className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-mono text-[0.6875rem] uppercase tracking-[0.02em] text-[var(--muted)]">
                        Next step
                      </span>
                      <span className="mt-1 block text-[0.9375rem] leading-tight">
                        A conversation, not a pitch
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Enquiry form ─────────────────────────────────────────────── */}
        <section
          id="enquiry"
          data-theme="bone"
          className="section scroll-mt-28 bg-[var(--bg)]"
        >
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,5rem)]">
              {/* Supporting content first in the DOM, so a phone reads the
                  context before meeting the form. */}
              <div className="lg:col-span-4">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">Start the conversation</p>
                  <h2 className="t-display-lg mt-6 max-w-[16ch]">
                    Give us enough context to{" "}
                    <span className="text-accent">understand the opportunity.</span>
                  </h2>
                  <p className="t-body-lg mt-7 max-w-[42ch] text-ink/75">
                    The form takes a few minutes. Share what matters most — the
                    detail can be developed together afterwards.
                  </p>
                </RevealText>

                <RevealText delay={0.08}>
                  <div className="mt-10 border-t border-[var(--hairline)] pt-8">
                    <h3 className="text-[1.0625rem] font-medium">
                      What helps us respond usefully
                    </h3>
                    <ul className="mt-5 flex flex-col gap-3">
                      {HELPS.map((item) => (
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

                  {/* Sentence case, not the 11px uppercase mono used for
                      eyebrows: these are reassurances, and the third one is a
                      full sentence that reads as shouting in caps. */}
                  <ul className="mt-8 flex flex-col gap-3 border-t border-[var(--hairline)] pt-8">
                    {ASSURANCES.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-[0.9375rem] leading-[1.5] text-ink/75"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[0.5em] block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </RevealText>
              </div>

              <div className="lg:col-span-8">
                {/* Stated before anyone types, not after they have written a
                    brief. Delete this block the moment a transport is wired
                    into app/actions/enquiry.ts. */}
                <div className="mb-6 rounded-[12px] border border-[rgba(18,19,26,0.16)] bg-paper p-5">
                  <p className="text-[1rem] font-medium">
                    Enquiry delivery is not connected yet
                  </p>
                  <p className="mt-2 max-w-[58ch] text-[0.9375rem] leading-[1.6] text-ink/75">
                    This form validates and submits, but there is no mail
                    transport behind it yet, so an enquiry sent today will not
                    reach anyone. We would rather say so here than take a
                    considered brief and quietly lose it.
                  </p>
                </div>

                <EnquiryForm preselectedArea={preselectedArea} />
              </div>
            </div>
          </div>
        </section>

        {/* ── What happens next ────────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">What happens next</p>
              <h2 className="t-display-lg mt-6 max-w-[22ch]">
                A clear conversation{" "}
                <span className="text-accent">before a fixed recommendation.</span>
              </h2>
            </RevealText>

            <RevealGroup
              as="ol"
              className="mt-14 grid gap-x-8 gap-y-12 md:grid-cols-3"
              stagger={0.07}
              soft
            >
              {NEXT_STAGES.map((stage) => (
                <RevealItem as="li" key={stage.number} className="relative pt-8">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 top-0 block h-px bg-[var(--hairline)]"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0 block h-2 w-2 -translate-y-1/2 rounded-full border border-accent bg-[var(--bg)]"
                  />
                  <span className="t-mono text-accent">{stage.number}</span>
                  <h3 className="mt-3.5 text-[1.125rem] font-medium leading-tight">
                    {stage.title}
                  </h3>
                  <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-[1.6] text-ink/70">
                    {stage.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>

            <RevealText>
              <p className="mt-12 max-w-[62ch] border-t border-[var(--hairline)] pt-8 text-[1.0625rem] leading-[1.7] text-ink/70">
                Not every enquiry becomes a project, and we will say so early
                when we are not the right fit rather than taking on work we do
                not think will succeed. There is no audit, proposal or meeting
                promised for every submission.
              </p>
            </RevealText>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell grid gap-12 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:gap-x-[clamp(3rem,5vw,7rem)]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">Questions</p>
                <h2 className="t-display-lg mt-6 max-w-[14ch]">
                  Before you <span className="text-accent">get in touch.</span>
                </h2>
              </RevealText>
            </div>
            <div>
              <Accordion items={FAQS} idPrefix="contact-faq" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
