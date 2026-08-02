import Link from "next/link";
import { difference, servicesPage } from "@/lib/content";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { CursorBubble } from "@/components/ui/CursorBubble";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * The reference site's signature scroll pattern, rebuilt for Optara: each
 * service is a chapter whose name holds sticky on the left while its
 * substance — positioning, description, capabilities — scrolls past on the
 * right, under a cursor-following bubble naming the destination.
 *
 * A server component. The layout is CSS `position: sticky`: no scroll
 * listeners, no pinning, nothing hijacked — the whole section reads perfectly
 * as static content, and only CursorBubble and the reveals are client islands.
 *
 * Content is the approved servicesPage.showcase data — the same six services,
 * numbers, positioning lines and capability lists the /services page renders,
 * so the two cannot drift apart.
 */
export function ServicesSticky() {
  const { services } = servicesPage.showcase;

  return (
    <section data-theme="bone" className="section bg-[var(--bg)]">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">
            {servicesPage.showcase.eyebrow}
          </p>
          <h2 className="t-display-lg mt-6 max-w-[22ch]">
            Six disciplines.{" "}
            <span className="text-accent">One connected system for growth.</span>
          </h2>
        </RevealText>

        <ol className="mt-16 flex flex-col">
          {services.map((service) => (
            <li
              key={service.href}
              className="grid gap-8 border-t border-[var(--hairline)] py-14 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,5rem)] lg:py-20"
            >
              {/* The sticky chapter title. `self-start` is what lets sticky
                  work inside a grid track; top-28 clears the compact header. */}
              <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
                <p className="t-mono text-accent">{service.number}</p>
                <h3 className="t-display-lg mt-4 text-[clamp(1.75rem,3.2vw,2.75rem)]">
                  {service.name}
                </h3>
                <p className="mt-5 max-w-[26ch] text-[1.0625rem] leading-[1.6] text-ink/70">
                  {service.positioning}
                </p>
              </div>

              <div className="lg:col-span-7 lg:col-start-6">
                <CursorBubble label={`View ${service.name}`}>
                  <Link
                    href={service.href}
                    className="group block rounded-[22px] border border-[var(--hairline)] bg-paper p-7 transition-colors duration-300 hover:border-accent/40 md:p-10"
                  >
                    {/* An abstract brand panel where the reference shows client
                        screenshots — Optara shows no work it has not done, so
                        the visual is the service's own gradient and icon. */}
                    <div
                      aria-hidden="true"
                      className="relative flex h-44 items-center justify-center overflow-hidden rounded-[14px] bg-[linear-gradient(120deg,rgba(43,127,255,0.10),rgba(91,61,245,0.14)_50%,rgba(123,47,247,0.10))] md:h-56"
                    >
                      <span className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(18,19,26,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(18,19,26,0.04)_1px,transparent_1px)] [background-size:34px_34px]" />
                      <span className="grid h-20 w-20 place-items-center rounded-full bg-paper/80 text-accent shadow-[0_16px_44px_rgba(91,61,245,0.18)] backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        <ServiceIcon name={service.icon} className="h-8 w-8" />
                      </span>
                    </div>

                    <p className="mt-8 max-w-[58ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                      {service.description}
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {service.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="rounded-full border border-[var(--hairline)] px-3 py-1.5 text-[0.8125rem] text-ink/65"
                        >
                          {capability}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent">
                      Explore {service.name}
                      <ArrowIcon
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
                </CursorBubble>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * The split intro that follows the hero in the reference: floating tilted
 * panels left, copy right, one link out. Server component — the tilt is
 * static CSS transforms, and the panels are abstract brand shapes because no
 * client screenshots exist to float.
 */
export function IntroSplit() {
  return (
    <section data-theme="paper" className="section bg-[var(--bg)]">
      <div className="shell grid items-center gap-14 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
        <div
          aria-hidden="true"
          className="relative mx-auto hidden h-[26rem] w-full max-w-[24rem] lg:col-span-5 lg:block"
        >
          <div className="absolute left-0 top-6 h-56 w-44 -rotate-6 rounded-[18px] bg-[linear-gradient(160deg,rgba(43,127,255,0.13),rgba(91,61,245,0.20))] shadow-[0_24px_60px_rgba(43,127,255,0.18)]" />
          <div className="absolute right-2 top-0 h-64 w-48 rotate-3 rounded-[18px] bg-[linear-gradient(200deg,rgba(91,61,245,0.18),rgba(123,47,247,0.13))] shadow-[0_24px_60px_rgba(123,47,247,0.16)]" />
          <div className="absolute bottom-0 left-1/2 h-52 w-56 -translate-x-1/2 rotate-1 rounded-[18px] border border-[var(--hairline)] bg-paper p-5 shadow-[0_30px_70px_rgba(18,19,26,0.10)]">
            <span className="block h-2.5 w-2/3 rounded-full bg-[linear-gradient(90deg,#2B7FFF,#5B3DF5)]" />
            <span className="mt-3 block h-1.5 w-full rounded-full bg-ink/10" />
            <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-ink/10" />
            <span className="mt-2 block h-1.5 w-5/6 rounded-full bg-ink/10" />
            <span className="mt-6 inline-block rounded-full bg-accent px-4 py-2 text-[0.6875rem] font-medium text-paper">
              Qualified enquiry
            </span>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">Optara Digital</p>
            <h2 className="t-display-lg mt-6 max-w-[18ch]">
              Built for businesses that need{" "}
              <span className="text-accent">enquiries, not exposure.</span>
            </h2>
          </RevealText>
          <RevealText delay={0.08}>
            <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
              We break growth into manageable phases and connect the
              disciplines — brand, search, paid media, social, websites and
              apps — so every channel reinforces the others instead of pulling
              apart. Each engagement is measured against cost per qualified
              lead, and when a channel cannot earn its keep, we say so.
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
            >
              How we work
              <ArrowIcon
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </RevealText>
        </div>
      </div>
    </section>
  );
}

/**
 * "What makes us different", reference-style: the heading holds sticky on the
 * left while the four approved differentiators stack past it as substantial
 * cards. Pure CSS sticky, no observers, all content in the server render.
 */
export function DifferenceSticky() {
  return (
    <section data-theme="paper" className="section bg-[var(--bg)]">
      <div className="shell grid gap-10 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{difference.eyebrow}</p>
            <h2 className="t-display-lg mt-6">
              {difference.title.lead}{" "}
              <span className="text-accent">{difference.title.accent}</span>
            </h2>
          </RevealText>
        </div>

        <RevealGroup
          as="ol"
          className="flex flex-col gap-5 lg:col-span-7 lg:col-start-6"
          stagger={0.07}
          soft
        >
          {difference.items.map((item, i) => (
            <RevealItem
              as="li"
              key={item.title}
              className="rounded-[22px] border border-[var(--hairline)] bg-bone p-8 md:p-10"
            >
              <p className="t-mono text-accent">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="t-display-md mt-4 text-[clamp(1.375rem,2vw,1.75rem)]">
                {item.title}
              </h3>
              <p className="mt-4 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-ink/75">
                {item.body}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
