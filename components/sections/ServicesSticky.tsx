import Link from "next/link";
import { servicesPage } from "@/lib/content";
import { ArrowIcon } from "@/components/ui/Icons";
import { ServiceStage } from "@/components/sections/services/ServiceStage";
import { SERVICE_SCENES } from "@/components/sections/services/scenes";
import { StoryCopy, StoryProvider } from "@/components/sections/services/story";

/**
 * The post-hero experience (Stage 2C.3B).
 *
 * PROTOTYPE ZONE — Intro → Branding → SEO & GEO only: one StoryProvider
 * wraps a full-viewport sticky visual layer (tonal ground + the Optara
 * Core Three.js protagonist) and the left copy column (story choreography
 * + the first TWO semantic chapters at 72vh rhythm). The provider's bands
 * measure just these two chapters, so the canonical clock runs Intro →
 * Branding centre → SEO centre and the sticky layer releases cleanly at
 * the zone's end — no 3D geometry ever sits behind the later services.
 *
 * On immersive desktop the prototype chapters lead with index, name,
 * positioning and the Explore link; the approved description and
 * capabilities remain in the DOM directly below in a visually subordinate
 * block, so the object keeps the stage while nothing semantic is lost.
 *
 * REST — Google Ads, Social, Website Design, App Development: until the
 * 3D language is approved and extended deliberately, these render as a
 * clean natural-flow presentation with their existing lightweight static
 * scenes, on every viewport. No fake 3D states, no leftover SEO geometry.
 *
 * Below the immersive gate everything (including the prototype chapters)
 * is the same natural flow. Content is servicesPage.showcase, untouched.
 */
export function ServicesSticky() {
  const { services } = servicesPage.showcase;
  const proto = services.slice(0, 2);
  const rest = services.slice(2);
  const total = String(services.length).padStart(2, "0");

  const flowChapter = (
    service: (typeof services)[number],
    i: number,
    withData: boolean,
  ) => {
    const Scene = SERVICE_SCENES[i];
    return (
      <li
        key={service.href}
        {...(withData ? { "data-service-chapter": i } : {})}
        className="border-t border-[var(--hairline)] py-14 first:border-t-0"
      >
        <div className="w-full max-w-[44rem]">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-10 bg-accent" />
            <p className="t-mono text-accent">
              {service.number}
              <span className="text-ink/35"> / {total}</span>
            </p>
          </div>
          <h3 className="t-display-lg mt-5 text-[clamp(1.875rem,3.4vw,2.5rem)]">
            {service.name}
          </h3>
          <p className="mt-4 max-w-[30ch] text-[1.0625rem] leading-[1.6] text-ink/70">
            {service.positioning}
          </p>
          <div aria-hidden="true" className="mt-8 h-44 text-accent md:h-52">
            <Scene />
          </div>
          <p className="mt-8 max-w-[46ch] text-[0.9375rem] leading-[1.75] text-ink/65">
            {service.description}
          </p>
          <ul className="mt-6 flex max-w-[34rem] flex-wrap gap-x-4 gap-y-2">
            {service.capabilities.map((capability) => (
              <li
                key={capability}
                className="flex items-center gap-2 text-[0.8125rem] text-ink/55"
              >
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent/70" />
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
  };

  return (
    <section data-theme="bone" className="section bg-[var(--bg)] !pt-0">
      <div className="shell relative pt-[var(--section-y)] [@media(min-width:1100px)_and_(min-height:680px)]:pt-0">
        <StoryProvider>
          {/* The persistent visual layer: tonal ground + Optara Core.
              Full-viewport sticky, breakout both edges, negative bottom
              margin returns its height so the copy scrolls over it. It
              lives only inside this prototype zone and releases with it. */}
          <div className="pointer-events-none sticky top-0 z-0 hidden h-svh [@media(min-width:1100px)_and_(min-height:680px)]:mb-[-100svh] [@media(min-width:1100px)_and_(min-height:680px)]:ml-[calc((min(100vw,1360px)-100vw)/2-var(--gutter))] [@media(min-width:1100px)_and_(min-height:680px)]:mr-[calc((min(100vw,1360px)-100vw)/2-var(--gutter))] [@media(min-width:1100px)_and_(min-height:680px)]:block">
            <ServiceStage names={services.map((s) => s.name)} />
          </div>

          <div className="relative z-10 [@media(min-width:1100px)_and_(min-height:680px)]:grid [@media(min-width:1100px)_and_(min-height:680px)]:grid-cols-12 [@media(min-width:1100px)_and_(min-height:680px)]:gap-x-[clamp(2.5rem,4vw,5rem)]">
            <div className="[@media(min-width:1100px)_and_(min-height:680px)]:col-span-5">
              <StoryCopy />

              <ol data-service-chapters className="flex flex-col">
                {proto.map((service, i) => {
                  const Scene = SERVICE_SCENES[i];
                  return (
                    <li
                      key={service.href}
                      data-service-chapter={i}
                      className="border-t border-[var(--hairline)] py-14 first:border-t-0 [@media(min-width:1100px)_and_(min-height:680px)]:flex [@media(min-width:1100px)_and_(min-height:680px)]:min-h-[72vh] [@media(min-width:1100px)_and_(min-height:680px)]:items-center [@media(min-width:1100px)_and_(min-height:680px)]:border-t-0 [@media(min-width:1100px)_and_(min-height:680px)]:py-0"
                    >
                      <div className="w-full">
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
                        <p className="mt-4 max-w-[26ch] text-[1.0625rem] leading-[1.6] text-ink/70">
                          {service.positioning}
                        </p>

                        {/* Compact static scene — flow layouts only. */}
                        <div
                          aria-hidden="true"
                          className="mt-8 h-44 text-accent md:h-52 [@media(min-width:1100px)_and_(min-height:680px)]:hidden"
                        >
                          <Scene />
                        </div>

                        <Link
                          href={service.href}
                          className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
                        >
                          Explore {service.name}
                          <ArrowIcon
                            aria-hidden="true"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>

                        {/* Approved secondary copy: present and readable,
                            visually subordinate on the immersive desktop so
                            the object keeps the stage. */}
                        <div className="mt-8 [@media(min-width:1100px)_and_(min-height:680px)]:mt-10 [@media(min-width:1100px)_and_(min-height:680px)]:max-w-[34ch] [@media(min-width:1100px)_and_(min-height:680px)]:opacity-75">
                          <p className="max-w-[46ch] text-[0.9375rem] leading-[1.75] text-ink/65 [@media(min-width:1100px)_and_(min-height:680px)]:text-[0.875rem]">
                            {service.description}
                          </p>
                          <ul className="mt-5 flex max-w-[34rem] flex-wrap gap-x-4 gap-y-2">
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
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </StoryProvider>

        {/* Services 03–06: clean natural flow with their existing static
            scenes until the 3D language is approved and extended. */}
        <ol className="mt-4 flex flex-col [@media(min-width:1100px)_and_(min-height:680px)]:mt-24">
          {rest.map((service, i) => flowChapter(service, i + 2, false))}
        </ol>
      </div>
    </section>
  );
}
