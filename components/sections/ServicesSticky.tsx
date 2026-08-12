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
 * Architecture, desktop (immersive gate: min-width 1100px AND min-height
 * 680px, expressed as one CSS media variant so the layout is settled at
 * first paint with no hydration geometry shift; 680 because a maximised
 * laptop Chrome window loses ~120–150px to browser chrome, and a real
 * recording showed 800 excluding an ordinary MacBook — see Stage 2C.1A):
 *
 * - the LEFT column is a semantic <ol> of six genuine service chapters in
 *   normal document flow — real headings, real copy, real links, each
 *   78vh tall on roomy viewports (≥800px high) and 88vh in the compact
 *   680–799px band, so short laptops keep a deliberate cinematic dwell
 *   per chapter instead of a rushed one;
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
    <section data-theme="bone" className="section bg-[var(--bg)]">
      {/* The seam from the intro: instead of a hairline cut, the paper
          ground of the previous scene ramps softly into this section's bone
          — a tonal shift, so the two sections read as one continuous space
          rather than stacked blocks. Material colours only; not a brand
          gradient. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(to_bottom,var(--color-paper),transparent)]"
      />
      <div className="shell relative">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">
            {servicesPage.showcase.eyebrow}
          </p>
          <h2 className="t-display-lg mt-6 max-w-[22ch]">
            Six disciplines.{" "}
            <span className="text-accent">One connected system for growth.</span>
          </h2>
        </RevealText>

        <div className="mt-16 [@media(min-width:1100px)_and_(min-height:680px)]:grid [@media(min-width:1100px)_and_(min-height:680px)]:grid-cols-12 [@media(min-width:1100px)_and_(min-height:680px)]:gap-x-[clamp(2.5rem,4vw,5rem)]">
          <ol className="flex flex-col [@media(min-width:1100px)_and_(min-height:680px)]:col-span-4">
            {services.map((service, i) => {
              const Scene = SERVICE_SCENES[i];
              return (
                <li
                  key={service.href}
                  data-service-chapter={i}
                  className="border-t border-[var(--hairline)] py-14 first:border-t-0 [@media(min-width:1100px)_and_(min-height:680px)]:flex [@media(min-width:1100px)_and_(min-height:680px)]:items-center [@media(min-width:1100px)_and_(min-height:680px)]:py-0 [@media(min-width:1100px)_and_(min-height:800px)]:min-h-[78vh] [@media(min-width:1100px)_and_(min-height:680px)_and_(max-height:799px)]:min-h-[88vh]"
                >
                  <div className="w-full">
                    {/* Editorial chapter head: accent rule + flat accent
                        number, then the name at a scale that matches the
                        cinematic stage beside it. */}
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="h-px w-10 bg-accent" />
                      <p className="t-mono text-accent">{service.number}</p>
                    </div>
                    <h3 className="t-display-lg mt-5 text-[clamp(1.875rem,3.4vw,2.75rem)]">
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
                      className="mt-8 h-44 text-accent md:h-52 [@media(min-width:1100px)_and_(min-height:680px)]:hidden"
                    >
                      <Scene />
                    </div>

                    <p className="mt-8 max-w-[46ch] text-[1rem] leading-[1.7] text-ink/75">
                      {service.description}
                    </p>

                    {/* Capabilities as a quiet editorial list — accent
                        points instead of pill chrome. */}
                    <ul className="mt-7 flex max-w-[34rem] flex-wrap gap-x-5 gap-y-2.5">
                      {service.capabilities.map((capability) => (
                        <li
                          key={capability}
                          className="flex items-center gap-2 text-[0.8125rem] text-ink/65"
                        >
                          <span
                            aria-hidden="true"
                            className="h-1 w-1 rounded-full bg-accent/70"
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
                  </div>
                </li>
              );
            })}
          </ol>

          {/* The persistent stage. CSS-gated with the exact same media
              variant as the grid, so stage and layout can never disagree.
              The negative right margin (Stage 2C.1) breaks the stage out of
              the shell to the viewport's right edge — (min(100vw,1360px) −
              100vw)/2 recovers the shell's centering margin and −var(--gutter)
              recovers its padding — so the cinematic plane commands ~66–70%
              of the composition and reads as continuing past the browser
              edge. body{overflow-x:hidden} absorbs the scrollbar-width
              difference between 100vw and the true viewport. */}
          <div className="hidden [@media(min-width:1100px)_and_(min-height:680px)]:col-span-8 [@media(min-width:1100px)_and_(min-height:680px)]:block [@media(min-width:1100px)_and_(min-height:680px)]:mr-[calc((min(100vw,1360px)-100vw)/2-var(--gutter))]">
            <ServiceStage names={services.map((s) => s.name)} />
          </div>
        </div>
      </div>
    </section>
  );
}
