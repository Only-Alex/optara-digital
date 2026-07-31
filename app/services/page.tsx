import type { Metadata } from "next";
import Link from "next/link";
import { servicesPage, site } from "@/lib/content";
import { siteOrigin } from "@/lib/site-url";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, LogoMark } from "@/components/ui/Icons";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ServiceMockup } from "@/components/ui/ServiceMockup";

const TITLE = "Digital Marketing Services";
const DESCRIPTION =
  "Explore Optara Digital's connected services across branding, SEO and GEO, Google Ads, social media, website design and app development.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: `${TITLE} — ${site.name}`,
    description: DESCRIPTION,
    url: "/services",
  },
};

/**
 * Structured data. Deliberately narrow: a WebPage, a breadcrumb trail and a
 * plain list of the six services as offerings of the organisation. No rating,
 * no review, no price, no service area — none of that is verified, and schema
 * is exactly where an unsupported claim does the most damage.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${siteOrigin}/services#webpage`,
      url: `${siteOrigin}/services`,
      name: `${TITLE} — ${site.name}`,
      description: DESCRIPTION,
      isPartOf: { "@id": `${siteOrigin}#website` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteOrigin },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteOrigin}/services` },
      ],
    },
    {
      "@type": "ItemList",
      name: `${site.name} services`,
      itemListElement: servicesPage.showcase.services.map((service, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: service.name,
        url: `${siteOrigin}${service.href}`,
      })),
    },
  ],
};

export default function ServicesPage() {
  const { hero, intro, showcase, connection, approach, closing } = servicesPage;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header />
      <main id="main" tabIndex={-1} className="scroll-mt-24 outline-none">
        {/* ── Hero ─────────────────────────────────────────────────────────
            Related to the homepage without repeating it: no smoke, no dark
            orbital. A light plane, six markers on fine paths around the real
            mark, and the type carrying the weight. */}
        <section
          data-theme="paper"
          className="relative overflow-hidden bg-[var(--bg)] pb-20 pt-36 md:pt-44"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-[34rem] w-[74rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[radial-gradient(circle,rgba(91,61,245,0.10),transparent_66%)]"
          />
          <div className="shell relative grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div>
              {/* Breadcrumb sits above the h1 rather than in a bar of its own,
                  so it orients without taking a band of the composition. */}
              <nav aria-label="Breadcrumb" className="mb-7">
                <ol className="t-mono flex items-center gap-2 text-[var(--muted)]">
                  <li>
                    <Link href="/" className="transition-colors duration-200 hover:text-accent">
                      Home
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-ink/70">
                    Services
                  </li>
                </ol>
              </nav>

              <RevealText>
                <p className="t-mono text-[var(--muted)]">{hero.eyebrow}</p>
                <h1 className="t-display-xl mt-6 max-w-[16ch]">
                  {hero.title.lead}{" "}
                  <span className="text-accent">{hero.title.accent}</span>
                </h1>
              </RevealText>
              <RevealText delay={0.1}>
                <p className="t-body-lg mt-8 max-w-[54ch] text-ink/75">
                  {hero.standfirst}
                </p>
                <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                  <Button href={hero.actions.primary.href} withArrow className="justify-center">
                    {hero.actions.primary.label}
                  </Button>
                  <Button
                    href={hero.actions.secondary.href}
                    variant="outline"
                    className="justify-center"
                  >
                    {hero.actions.secondary.label}
                  </Button>
                </div>
              </RevealText>
            </div>

            {/* Six markers on a light plane, arranged around the real mark.
                Static: it is complete as a still frame, which is the whole
                point of putting it opposite the page's only h1. */}
            <div aria-hidden="true" className="relative hidden lg:block">
              <svg viewBox="0 0 400 340" className="h-auto w-full">
                <defs>
                  <radialGradient id="svc-hero-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0" stopColor="rgba(91,61,245,0.14)" />
                    <stop offset="1" stopColor="rgba(91,61,245,0)" />
                  </radialGradient>
                </defs>
                <circle cx="200" cy="170" r="150" fill="url(#svc-hero-glow)" />
                {[110, 60].map((r) => (
                  <circle
                    key={r}
                    cx="200"
                    cy="170"
                    r={r}
                    fill="none"
                    stroke="rgba(91,61,245,0.16)"
                    strokeDasharray="3 6"
                  />
                ))}
                {showcase.services.map((_, i) => {
                  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
                  const x = 200 + Math.cos(a) * 110;
                  const y = 170 + Math.sin(a) * 110;
                  return (
                    <g key={i}>
                      <line
                        x1="200"
                        y1="170"
                        x2={x.toFixed(2)}
                        y2={y.toFixed(2)}
                        stroke="rgba(91,61,245,0.20)"
                      />
                      <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="15" fill="var(--color-paper)" />
                      <circle
                        cx={x.toFixed(2)}
                        cy={y.toFixed(2)}
                        r="15"
                        fill="none"
                        stroke="rgba(91,61,245,0.34)"
                      />
                      <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="4" fill="var(--color-accent)" />
                    </g>
                  );
                })}
                <circle cx="200" cy="170" r="34" fill="var(--color-paper)" />
                <circle cx="200" cy="170" r="34" fill="none" stroke="rgba(91,61,245,0.25)" />
              </svg>
              <span className="pointer-events-none absolute left-1/2 top-1/2 block h-12 w-12 -translate-x-1/2 -translate-y-1/2">
                <LogoMark className="h-full w-full" />
              </span>
            </div>
          </div>
        </section>

        {/* ── Why connection matters ───────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
            <div className="lg:col-span-5">
              <RevealText>
                <p className="t-mono text-[var(--muted)]">{intro.eyebrow}</p>
                <h2 className="t-display-lg mt-6">
                  {intro.title.lead}{" "}
                  <span className="text-accent">{intro.title.accent}</span>
                </h2>
              </RevealText>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
              <RevealText delay={0.1}>
                <p className="t-body-lg max-w-[54ch] text-ink/75">{intro.body}</p>
              </RevealText>
            </div>
          </div>
        </section>

        {/* ── The six services ─────────────────────────────────────────────
            Alternating editorial rows. DOM order is always heading, copy,
            capabilities, CTA, then visual; only the desktop grid swaps sides,
            so the reading order never depends on which row it is. */}
        <section id="showcase" data-theme="paper" className="section scroll-mt-28 bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">{showcase.eyebrow}</p>
            </RevealText>

            <ol className="mt-14 flex flex-col">
              {showcase.services.map((service, index) => {
                const flip = index % 2 === 1;
                return (
                  <li
                    key={service.href}
                    className="border-t border-[var(--hairline)] py-14 first:border-t-0 first:pt-0 md:py-20"
                  >
                    <RevealGroup
                      className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-x-[clamp(3rem,5vw,6rem)]"
                      stagger={0.08}
                      soft
                    >
                      <RevealItem className={flip ? "lg:order-2" : undefined}>
                        <div className="flex items-baseline gap-4">
                          <span className="t-mono text-accent">{service.number}</span>
                          <h2 className="t-display-md">{service.name}</h2>
                        </div>
                        <p className="t-body-lg mt-5 max-w-[42ch] font-medium">
                          {service.positioning}
                        </p>
                        <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                          {service.description}
                        </p>

                        <ul className="mt-7 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                          {service.capabilities.map((capability) => (
                            <li
                              key={capability}
                              className="flex items-start gap-2.5 text-[0.9375rem] leading-[1.5] text-ink/70"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-[0.55em] block h-1 w-1 shrink-0 rounded-full bg-accent"
                              />
                              {capability}
                            </li>
                          ))}
                        </ul>

                        <Link
                          href={service.href}
                          className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
                        >
                          Explore {service.name}
                          <ArrowIcon
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                      </RevealItem>

                      <RevealItem className={flip ? "lg:order-1" : undefined}>
                        {/* Same drawings as the homepage's service panel, on a
                            light surface rather than the dark shell — one
                            visual language across the site, presented for this
                            page rather than duplicated from it. */}
                        <div className="relative">
                          <span
                            aria-hidden="true"
                            className="absolute -right-2.5 -top-2.5 h-full w-full rounded-[13px] border border-[rgba(18,19,26,0.07)] bg-[color-mix(in_srgb,var(--color-ink)_3%,transparent)]"
                          />
                          <div
                            data-theme="bone"
                            className="relative aspect-[4/3] w-full overflow-hidden rounded-[13px] border border-[rgba(18,19,26,0.09)] bg-[var(--bg)] p-5 shadow-[0_1px_2px_rgba(18,19,26,0.04),0_18px_50px_rgba(18,19,26,0.06)]"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-accent/[0.07] text-accent"
                            >
                              <ServiceIcon name={service.icon} className="h-4 w-4" />
                            </span>
                            <ServiceMockup index={index} className="h-full w-full" />
                          </div>
                        </div>
                      </RevealItem>
                    </RevealGroup>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* ── How the services connect ─────────────────────────────────── */}
        <section data-theme="bone" className="section bg-[var(--bg)]">
          <div className="shell">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono text-[var(--muted)]">{connection.eyebrow}</p>
                  <h2 className="t-display-lg mt-6 max-w-[20ch]">
                    {connection.title.lead}{" "}
                    <span className="text-accent">{connection.title.accent}</span>
                  </h2>
                </RevealText>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
                <RevealText delay={0.1}>
                  <p className="t-body-lg max-w-[48ch] text-ink/75">{connection.body}</p>
                </RevealText>
              </div>
            </div>

            {/* Horizontal on desktop, vertical on mobile — the rule is drawn
                by the list's own border, so there is no absolutely positioned
                rail to fall out of alignment with the markers. */}
            <RevealGroup
              as="ol"
              className="mt-16 grid gap-y-8 md:grid-cols-3 md:gap-x-8 xl:grid-cols-6"
              stagger={0.06}
              soft
            >
              {connection.stages.map((item, i) => (
                <RevealItem
                  as="li"
                  key={item.stage}
                  className="relative border-l border-[var(--hairline)] pl-5 xl:border-l-0 xl:border-t xl:pl-0 xl:pt-6"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 block h-2 w-2 -translate-x-1/2 rounded-full bg-accent xl:left-0 xl:top-0 xl:-translate-y-1/2 xl:translate-x-0"
                  />
                  <p className="t-mono text-[var(--muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2.5 text-[1.0625rem] font-medium leading-tight">
                    {item.stage}
                  </h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-[1.5] text-accent">
                    {item.service}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── How we work ──────────────────────────────────────────────── */}
        <section data-theme="paper" className="section bg-[var(--bg)]">
          <div className="shell">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">{approach.eyebrow}</p>
              <h2 className="t-display-lg mt-6 max-w-[24ch]">
                {approach.title.lead}{" "}
                <span className="text-accent">{approach.title.accent}</span>
              </h2>
            </RevealText>

            <RevealGroup
              as="ol"
              className="mt-14 grid gap-10 md:grid-cols-3 md:gap-x-[clamp(2.5rem,4vw,4.5rem)]"
              stagger={0.08}
              soft
            >
              {approach.principles.map((principle) => (
                <RevealItem
                  as="li"
                  key={principle.number}
                  className="border-t border-[var(--hairline)] pt-7"
                >
                  <span className="t-mono text-accent">{principle.number}</span>
                  <h3 className="t-display-md mt-4 text-[clamp(1.25rem,1.7vw,1.5rem)]">
                    {principle.title}
                  </h3>
                  <p className="mt-4 max-w-[38ch] text-[1.0625rem] leading-[1.65] text-ink/75">
                    {principle.body}
                  </p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────────────
            A deliberate ending, not a second contact form: the visitor goes
            to the real one through this link. */}
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
                {closing.title.lead}{" "}
                <span className="text-[var(--accent-fg)]">{closing.title.accent}</span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[48ch] text-[rgba(255,255,255,0.78)]">
                {closing.body}
              </p>
            </RevealText>
            <RevealText delay={0.1}>
              <Button href={closing.action.href} variant="light" withArrow>
                {closing.action.label}
              </Button>
            </RevealText>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
