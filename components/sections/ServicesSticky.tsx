import Link from "next/link";
import { servicesPage } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";
import { ServiceStage } from "@/components/sections/services/ServiceStage";
import { SERVICE_SCENES } from "@/components/sections/services/scenes";

/**
 * The six services as the homepage's principal post-hero immersive
 * experience (Stage 2B).
 *
 * Architecture, roomy desktop (immersive gate: min-width 1100px AND
 * min-height 800px, expressed as one CSS media variant so the layout is
 * settled at first paint with no hydration geometry shift):
 *
 * - the LEFT column is a semantic <ol> of six genuine service chapters in
 *   normal document flow — real headings, real copy, real links, each
 *   ~78vh tall so the whole run spans ~468vh of natural scrolling;
 * - the RIGHT column is one persistent sticky visual stage (ServiceStage,
 *   the only client island) whose scene transforms as the active chapter
 *   changes. No scroll snap, no wheel interception, no pinned copy — the
 *   document simply scrolls and DifferenceSticky follows service 06.
 *
 * Below the gate — phones, tablets, 1280×720, 1024×768, short laptops —
 * the same chapters render as deliberate vertical flow sections, each
 * carrying a compact static version of its own scene. Reduced motion gets
 * this same complete content plus an instant (non-animated) stage where
 * the layout is roomy enough to show it.
 *
 * Content is servicesPage.showcase, untouched: same six services, same
 * order, same copy as /services, so the two cannot drift apart.
 *
 * The section opens on a hairline over the bone ground — the deliberate
 * material seam after IntroSplit's paper scene, answering its accent cue
 * without a gradient or overlap.
 */
export function ServicesSticky() {
  const { services } = servicesPage.showcase;

  return (
    <section
      data-theme="bone"
      className="section border-t border-[var(--hairline)] bg-[var(--bg)]"
    >
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

        <div className="mt-16 [@media(min-width:1100px)_and_(min-height:800px)]:grid [@media(min-width:1100px)_and_(min-height:800px)]:grid-cols-12 [@media(min-width:1100px)_and_(min-height:800px)]:gap-x-[clamp(2.5rem,4vw,5rem)]">
          <ol className="flex flex-col [@media(min-width:1100px)_and_(min-height:800px)]:col-span-4">
            {services.map((service, i) => {
              const Scene = SERVICE_SCENES[i];
              return (
                <li
                  key={service.href}
                  data-service-chapter={i}
                  className="border-t border-[var(--hairline)] py-14 first:border-t-0 [@media(min-width:1100px)_and_(min-height:800px)]:flex [@media(min-width:1100px)_and_(min-height:800px)]:min-h-[78vh] [@media(min-width:1100px)_and_(min-height:800px)]:items-center [@media(min-width:1100px)_and_(min-height:800px)]:py-0"
                >
                  <div className="w-full">
                    <p className="t-mono bg-[linear-gradient(92deg,#175FD4,#4C2FD9_55%,#6B21D8)] bg-clip-text text-transparent">
                      {service.number}
                    </p>
                    <h3 className="t-display-lg mt-4 text-[clamp(1.75rem,3.2vw,2.5rem)]">
                      {service.name}
                    </h3>
                    <p className="mt-4 max-w-[30ch] text-[1.0625rem] leading-[1.6] text-ink/70">
                      {service.positioning}
                    </p>

                    {/* Compact static scene for the flow layout only — the
                        immersive layout carries the same scene on the shared
                        stage instead. */}
                    <div
                      aria-hidden="true"
                      className="mt-8 h-44 text-accent md:h-52 [@media(min-width:1100px)_and_(min-height:800px)]:hidden"
                    >
                      <Scene />
                    </div>

                    <p className="mt-8 max-w-[46ch] text-[1rem] leading-[1.7] text-ink/75">
                      {service.description}
                    </p>

                    <ul className="mt-6 flex max-w-[34rem] flex-wrap gap-2">
                      {service.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="rounded-full border border-[var(--hairline)] px-3 py-1.5 text-[0.8125rem] text-ink/65"
                        >
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
                  </div>
                </li>
              );
            })}
          </ol>

          {/* The persistent stage. CSS-gated with the exact same media
              variant as the grid, so stage and layout can never disagree. */}
          <div className="hidden [@media(min-width:1100px)_and_(min-height:800px)]:col-span-8 [@media(min-width:1100px)_and_(min-height:800px)]:block">
            <ServiceStage names={services.map((s) => s.name)} />
          </div>
        </div>
      </div>
    </section>
  );
}
