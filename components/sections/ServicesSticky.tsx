import Link from "next/link";
import { servicesPage } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";
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
                <p className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">
                  {service.number}
                </p>
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
                    className="group block rounded-[22px] border border-[var(--hairline)] bg-paper p-7 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_24px_60px_rgba(18,19,26,0.08)] motion-reduce:transform-none md:p-10"
                  >
                    {/* An abstract brand panel where the reference shows client
                        screenshots — Optara shows no work it has not done, so
                        the visual is the service's own gradient and icon. */}
                    <div
                      aria-hidden="true"
                      className="relative flex h-44 items-center justify-center overflow-hidden rounded-[14px] bg-[linear-gradient(120deg,rgba(43,127,255,0.10),rgba(91,61,245,0.14)_50%,rgba(123,47,247,0.10))] before:absolute before:inset-y-0 before:left-0 before:w-1/2 before:-translate-x-[150%] before:skew-x-[-18deg] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] before:transition-transform before:duration-700 before:ease-out group-hover:before:translate-x-[320%] motion-reduce:before:hidden md:h-56"
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
