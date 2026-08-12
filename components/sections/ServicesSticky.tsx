import Link from "next/link";
import { servicesPage } from "@/lib/content";
import { ArrowIcon } from "@/components/ui/Icons";
import { ServiceStage } from "@/components/sections/services/ServiceStage";
import { SERVICE_SCENES } from "@/components/sections/services/scenes";
import { StoryCopy, StoryProvider } from "@/components/sections/services/story";

/**
 * The continuous post-hero experience (Stage 2C.2): Intro → Branding →
 * the remaining five services, as ONE section with ONE persistent visual
 * stage.
 *
 * Desktop (immersive gate min-width 1100 / min-height 680, one CSS media
 * variant everywhere so layout settles at first paint):
 *
 * - LEFT column: the story region first — the intro headline established,
 *   subordinated on scroll while "01 / Branding" emerges and the
 *   six-disciplines statement passes as a small transitional cue — then
 *   the semantic <ol> of six service chapters in natural flow. All server
 *   HTML (client wrappers still SSR), real headings, real links.
 * - RIGHT column: one sticky stage spanning the entire run. Its content
 *   evolves — story field, dissolve into the Branding media, then the
 *   approved chapter crossfades to SEO and beyond. Nothing ever swaps
 *   boxes; the world persists while its state changes.
 * - GROUND: the section is bone; a paper panel covers the story span and
 *   ramps into bone as Branding resolves — the tonal half of the same
 *   transition. Material colours only.
 *
 * StoryProvider owns the single combined scroll progress and the measured
 * chapter bands; StoryCopy and ServiceStage both derive from it, so the
 * choreography cannot fall out of sync with activation in either scroll
 * direction.
 *
 * Below the gate, everything is natural vertical flow: intro copy, the
 * disciplines cue, then six complete chapters each with a compact static
 * scene. No pinning, no video, no horizontal interaction.
 *
 * Content is servicesPage.showcase, untouched.
 */
export function ServicesSticky() {
  const { services } = servicesPage.showcase;
  const total = String(services.length).padStart(2, "0");

  return (
    <section data-theme="bone" className="section bg-[var(--bg)] !pt-0">
      {/* Paper span for the story, ramping into bone as Branding resolves.
          Immersive only — the flow fallback reads fine on bone alone. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[calc(240vh+14rem)] [@media(min-width:1100px)_and_(min-height:680px)]:block"
      >
        <div className="absolute inset-0 bg-paper" />
        <div className="absolute inset-x-0 -bottom-56 h-56 bg-[linear-gradient(to_bottom,var(--color-paper),transparent)]" />
      </div>

      <div className="shell relative pt-[var(--section-y)]">
        <StoryProvider>
          <div className="[@media(min-width:1100px)_and_(min-height:680px)]:grid [@media(min-width:1100px)_and_(min-height:680px)]:grid-cols-12 [@media(min-width:1100px)_and_(min-height:680px)]:gap-x-[clamp(2.5rem,4vw,5rem)]">
            <div className="[@media(min-width:1100px)_and_(min-height:680px)]:col-span-4">
              <StoryCopy />

              <ol data-service-chapters className="flex flex-col">
                {services.map((service, i) => {
                  const Scene = SERVICE_SCENES[i];
                  return (
                    <li
                      key={service.href}
                      data-service-chapter={i}
                      className="border-t border-[var(--hairline)] py-14 first:border-t-0 [@media(min-width:1100px)_and_(min-height:680px)]:flex [@media(min-width:1100px)_and_(min-height:680px)]:items-center [@media(min-width:1100px)_and_(min-height:680px)]:py-0 [@media(min-width:1100px)_and_(min-height:800px)]:min-h-[78vh] [@media(min-width:1100px)_and_(min-height:680px)_and_(max-height:799px)]:min-h-[88vh]"
                    >
                      <div className="w-full">
                        {/* Editorial chapter head: accent rule, position in
                            the sequence, then the name at stage scale. */}
                        <div className="flex items-center gap-3">
                          <span aria-hidden="true" className="h-px w-10 bg-accent" />
                          <p className="t-mono text-accent">
                            {service.number}
                            <span className="text-ink/35"> / {total}</span>
                          </p>
                        </div>
                        <h3 className="t-display-lg mt-5 text-[clamp(1.875rem,3.4vw,2.75rem)]">
                          {service.name}
                        </h3>
                        <p className="mt-4 max-w-[30ch] text-[1.0625rem] leading-[1.6] text-ink/70">
                          {service.positioning}
                        </p>

                        {/* Compact static scene for the flow layout only. */}
                        <div
                          aria-hidden="true"
                          className="mt-8 h-44 text-accent md:h-52 [@media(min-width:1100px)_and_(min-height:680px)]:hidden"
                        >
                          <Scene />
                        </div>

                        <p className="mt-8 max-w-[44ch] text-[0.9375rem] leading-[1.75] text-ink/65">
                          {service.description}
                        </p>

                        {/* Capabilities as one quiet editorial line. */}
                        <ul className="mt-6 flex max-w-[34rem] flex-wrap gap-x-4 gap-y-2">
                          {service.capabilities.map((capability) => (
                            <li
                              key={capability}
                              className="flex items-center gap-2 text-[0.8125rem] text-ink/55"
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
            </div>

            {/* The one persistent stage, breaking out of the shell to the
                viewport's right edge for the whole run. */}
            <div className="hidden [@media(min-width:1100px)_and_(min-height:680px)]:col-span-8 [@media(min-width:1100px)_and_(min-height:680px)]:block [@media(min-width:1100px)_and_(min-height:680px)]:mr-[calc((min(100vw,1360px)-100vw)/2-var(--gutter))]">
              <ServiceStage names={services.map((s) => s.name)} />
            </div>
          </div>
        </StoryProvider>
      </div>
    </section>
  );
}
