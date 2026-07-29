"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { growthSystem } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { RevealText } from "@/components/ui/RevealText";

const STAGE_COUNT = growthSystem.stages.length;

export function GrowthSystem() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // The route plays itself once the track is on screen, rather than being
  // scrubbed by the scrollbar: the reader arrives, and the system runs for
  // them through to stage four. Timed rather than scroll-linked, so it always
  // finishes — a fast scroll used to leave the line stranded mid-draw.
  const progress = useMotionValue(0);
  // Margin, not `amount`: the track is ~400px at desktop and ~1200px stacked
  // on mobile, so a percentage-of-element threshold fires at wildly different
  // moments. This trips when the track's top edge has climbed to roughly a
  // third up from the bottom of the viewport — the reader has arrived and
  // settled, rather than the rail merely peeking in — and it behaves the same
  // on any screen.
  const inView = useInView(trackRef, {
    once: true,
    margin: "0px 0px -18% 0px",
  });

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      return;
    }
    if (!inView) return;

    // Refinement-brief pacing: the full route in ~2.4s, run once, then still.
    // Even pacing, not the shared EASE: that curve front-loads almost all of
    // its travel, which would flash stages 01–03 and then crawl to 04. The
    // four nodes need to light at a steady beat.
    const controls = animate(progress, 1, {
      duration: 2.4,
      ease: [0.32, 0, 0.32, 1],
      delay: 0.25,
    });
    return () => controls.stop();
  }, [inView, reduced, progress]);

  // Motion drives the line directly; React state only changes four times, when
  // progress crosses a node. Avoids re-rendering on every frame.
  const [reached, setReached] = useState(0);

  useMotionValueEvent(progress, "change", (value) => {
    const next = Math.min(STAGE_COUNT, Math.floor(value * STAGE_COUNT + 0.35));
    setReached((current) => (current === next ? current : next));
  });

  // The stem draws first — the hero's energy descending into the system —
  // then the route runs horizontal. Same single progress, split in two.
  const stemDrawn = useTransform(progress, [0, 0.12], [0, 1]);
  const drawn = useTransform(progress, [0.12, 1], [0, 1]);
  const isActive = (index: number) => reduced || index < reached;

  // Entry: the whole track reclines slightly in perspective while it is
  // still below the reading line and settles flat as it arrives — the plane
  // rising to meet the reader, one gesture, then still.
  const entry = useScrollProgress(trackRef, ["start 100%", "start 55%"]);
  const trackTilt = useTransform(entry, [0, 1], [9, 0]);
  const trackY = useTransform(entry, [0, 1], [28, 0]);

  // The travelling head sits at the leading edge of the drawn rail, and
  // fades at both ends so it never sits parked at a terminus.
  const headLeft = useTransform(drawn, [0, 1], ["0%", "100%"]);
  const headOpacity = useTransform(progress, [0.12, 0.2, 0.9, 1], [0, 1, 1, 0]);

  // Numerals drift against the copy as the section passes, so they read as a
  // plane set back from the text rather than sitting on it. Small — parallax
  // is a depth cue here, not a ride.
  // ±10, not ±16: with the numeral row no longer clipped, the drift's
  // extremes have to stay clear of the rail above and the title below.
  const sectionScroll = useScrollProgress(sectionRef, ["start end", "end start"]);
  const ghostDrift = useTransform(sectionScroll, [0, 1], [10, -10]);

  return (
    // overflow-x-clip, not hidden: the entry tilt is a 3D transform, and a
    // rotated plane projects wider than its own box, which was pushing the
    // document 8px past a 375px viewport. Clip contains it without creating a
    // scroll container or breaking sticky positioning for any descendant.
    <section
      ref={sectionRef}
      data-theme="paper"
      className="section relative overflow-x-clip"
    >
      {/* Atmosphere handoff from the hero: a faint indigo wash falling from
          the top edge, so the smoke's ground does not simply stop. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(59,30,255,0.05),transparent_72%)]"
      />
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">
                {growthSystem.eyebrow}
              </p>
              {/* Two intentional lines: the accent phrase owns its own line
                  so it can never shatter into isolated words at odd widths. */}
              <h2 className="t-display-lg mt-6">
                {growthSystem.heading}
                <span className="block text-accent">
                  {growthSystem.accentText}
                </span>
              </h2>
            </RevealText>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <RevealText delay={0.1}>
              <p className="t-body-lg max-w-[46ch] text-ink/75">
                {growthSystem.supportingParagraph}
              </p>
            </RevealText>
          </div>
        </div>

        <div ref={trackRef} className="relative mt-16 md:mt-20">
          <motion.div
            // One connected surface holding all four stages — an architectural
            // frame on a barely-cool ground, so the stages read as chambers of
            // one system rather than four detached columns. The inner wrapper
            // is unpadded so every rail offset keeps its original geometry.
            className="relative rounded-[22px] border border-[var(--hairline)] bg-[color-mix(in_srgb,var(--color-bone)_45%,var(--color-paper))] px-6 py-8 md:px-8 md:py-10 lg:px-10"
            style={
              reduced
                ? undefined
                : {
                    rotateX: trackTilt,
                    y: trackY,
                    transformPerspective: 1200,
                    transformOrigin: "top center",
                    willChange: "transform",
                  }
            }
          >
          <div className="relative">
          {/* Rails are scaled divs, not SVG pathLength. Motion implements
              pathLength with a dash array, and against a viewBox stretched
              non-uniformly under non-scaling-stroke that array tiles — which
              is why the rail was rendering as repeating dashes rather than
              one continuous draw. A transform on a plain element cannot
              tile, and is cheaper besides. */}

          {/* The stem: the route descending out of the hero's ground before
              it turns and runs the four stages. Desktop only — mobile's rail
              is already vertical. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[7px] top-[-84px] hidden h-[84px] w-px lg:block"
          >
            <div className="absolute inset-0 bg-[var(--color-line)]" />
            <motion.div
              className="absolute inset-x-0 top-0 h-full origin-top bg-accent"
              style={{ scaleY: reduced ? 1 : stemDrawn }}
            />
            <motion.div
              className="absolute inset-y-0 left-[-2px] w-[5px] origin-top bg-accent/25 blur-[3px]"
              style={{ scaleY: reduced ? 1 : stemDrawn }}
            />
          </div>

          {/* Continuous horizontal route, desktop only. At tablet the stages
              wrap to 2x2, where a single full-width line would be misleading,
              so each stage carries its own rule instead. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[7px] hidden h-px lg:block"
          >
            <div className="absolute inset-0 bg-[var(--color-line)]" />
            {/* Glow beneath the drawn length gives the rail body without a
                hue ramp — depth from blur and opacity, per §4. */}
            <motion.div
              className="absolute inset-x-0 top-[-2px] h-[5px] origin-left bg-accent/25 blur-[3px]"
              style={{ scaleX: reduced ? 1 : drawn }}
            />
            <motion.div
              className="absolute inset-0 origin-left bg-accent"
              style={{ scaleX: reduced ? 1 : drawn }}
            />
            {/* The head of the draw: a lit point travelling the rail, fading
                out as it lands on the final stage. */}
            {!reduced && (
              <motion.span
                className="absolute top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
                style={{
                  left: headLeft,
                  opacity: headOpacity,
                  boxShadow: "0 0 14px 2px rgba(59,30,255,0.55)",
                }}
              />
            )}
          </div>

          {/* Vertical route, mobile. Runs down the left gutter. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[7px] top-0 block h-full w-px md:hidden"
          >
            <div className="absolute inset-0 bg-[var(--color-line)]" />
            <motion.div
              className="absolute inset-y-0 left-[-2px] w-[5px] origin-top bg-accent/25 blur-[3px]"
              style={{ scaleY: reduced ? 1 : drawn }}
            />
            <motion.div
              className="absolute inset-0 origin-top bg-accent"
              style={{ scaleY: reduced ? 1 : drawn }}
            />
          </div>

          <ol className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8">
            {growthSystem.stages.map((stage, index) => {
              const active = isActive(index);

              return (
                <li
                  key={stage.number}
                  // Reached stages sit a little forward of the ones still to
                  // come — depth carrying the meaning, not just decorating it.
                  // last:lg:pr-9 keeps stage 04's longer description clear of
                  // the floating contact button at laptop widths — measured
                  // 20px of text under the disc at 1280 without it.
                  className="group relative pl-9 transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:border-t md:pl-0 md:pt-9 lg:border-t-0 lg:px-2 last:lg:pr-12"
                  style={{
                    borderTopColor: active
                      ? "var(--color-accent)"
                      : "var(--color-line)",
                    transform:
                      active && !reduced ? "translateY(-6px)" : "translateY(0)",
                    transition:
                      "border-color 240ms cubic-bezier(0.16,1,0.3,1), transform 420ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  {/* Node as a lit sphere: a halo that blooms on activation,
                      a paper collar so the rail cannot run through the orb,
                      and a white specular highlight offset up-left. The
                      highlight is lightness only — no hue ramp, per §4. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[1px] block h-[15px] w-[15px] md:-top-[7px] lg:top-0"
                  >
                    <span
                      className="absolute -inset-[9px] rounded-full transition-opacity duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(59,30,255,0.30), transparent 66%)",
                        opacity: active ? 1 : 0,
                      }}
                    />
                    <span className="absolute inset-0 rounded-full bg-[color-mix(in_srgb,var(--color-bone)_45%,var(--color-paper))] p-[3px]">
                      <span
                        className="relative block h-full w-full rounded-full transition-[background-color,transform,box-shadow] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          backgroundColor: active
                            ? "var(--color-accent)"
                            : "var(--color-line)",
                          transform: active ? "scale(1.15)" : "scale(1)",
                          boxShadow: active
                            ? "0 1px 4px rgba(59,30,255,0.55)"
                            : "0 0 0 rgba(59,30,255,0)",
                        }}
                      >
                        <span
                          className="absolute inset-0 rounded-full transition-opacity duration-[280ms]"
                          style={{
                            background:
                              "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.75), transparent 58%)",
                            opacity: active ? 1 : 0,
                          }}
                        />
                      </span>
                    </span>
                  </span>

                  {/* Hover illumination: a restrained wash behind the whole
                      stage. Class-driven so it cannot fight the inline
                      activation styles. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-2xl bg-accent/[0.04] opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:-inset-x-2"
                  />

                  {/* Fine vertical connection from the rail's node down into
                      the stage — drawn as its stage activates, emphasised on
                      hover, so number and node read as one joined fixture. */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-[7px] top-[17px] hidden h-8 w-px origin-top bg-gradient-to-b from-accent/70 to-accent/0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 lg:block ${
                      active ? "scale-y-100 opacity-70" : "scale-y-0 opacity-0"
                    }`}
                  />

                  {/* One numeral per stage, in its own row: the ghost used to
                      be a second copy sitting behind the title, which read as
                      a collision rather than a layer. It is now the stage
                      marker itself — oversized, right-aligned, and drifting
                      slower than the copy so it still sits back in space. */}
                  {/* No overflow-hidden and no bloom here: the clip was
                      shearing the drifting numerals flat, and it was also
                      squaring the round bloom into a visible box of colour
                      behind them. The numeral alone carries the tint. */}
                  <div className="relative flex justify-end">
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none relative select-none font-semibold leading-[0.78] tracking-[-0.05em] transition-colors duration-[500ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-[3.5rem] tabular-nums md:text-[4.5rem]"
                      style={{
                        color: active
                          ? "rgba(59,30,255,0.3)"
                          : "rgba(18,19,26,0.11)",
                        y: reduced ? 0 : ghostDrift,
                      }}
                    >
                      {stage.number}
                    </motion.span>
                  </div>

                  {/* Unreached stages are quieter, never disabled: a stage the
                      reader has not arrived at yet still has to look finished,
                      so the contrast step is emphasis, not an on/off switch. */}
                  {/* Title region reserves two lines at desktop (2 × the
                      1.15 line-height, in em so it tracks the clamp()ed font
                      size). "Scale growth" is the only one-line title; without
                      the reservation its chips and description sat higher than
                      the other three columns. Mobile/tablet flow naturally. */}
                  <h3
                    className="t-display-md mt-4 transition-[color,transform] duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)] lg:min-h-[2.3em]"
                    style={{
                      color: active
                        ? "var(--color-ink)"
                        : "color-mix(in srgb, var(--color-ink) 78%, transparent)",
                      // Settles upward as the line reaches it — a depth cue in
                      // the same register as the colour shift. Static under
                      // reduced motion because `active` is then always true.
                      transform: active ? "translateY(0)" : "translateY(5px)",
                    }}
                  >
                    {stage.title}
                  </h3>

                  {/* Every column's pills on ONE shared line at desktop. The
                      constraint is "Social Media" + "Continuous Optimisation"
                      side by side inside the narrowest quarter-width column
                      (~209px at 1024), which is why the pills drop to a
                      smaller size and tighter metrics at lg. The min-height
                      keeps descriptions level if a future label ever wraps.
                      Tablet/mobile keep the larger pill size and wrap free. */}
                  <motion.ul
                    className="mt-5 flex flex-wrap content-start gap-1.5 lg:min-h-[3.75rem] lg:gap-1"
                    initial={false}
                    animate={
                      reduced
                        ? { opacity: 1, y: 0 }
                        : { opacity: active ? 1 : 0.78, y: active ? 0 : 6 }
                    }
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    {stage.services.map((service) => (
                      <li
                        key={service}
                        // Dot plus label in a small pill — the hero eyebrow's
                        // vocabulary at caption scale.
                        className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border py-1 pl-1.5 pr-2 font-mono text-[0.625rem] uppercase tracking-[0.04em] transition-[background-color,border-color,color] duration-[280ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-accent/30 lg:gap-[2px] lg:py-[3px] lg:pl-[3px] lg:pr-[3px] lg:text-[0.46875rem] lg:tracking-normal ${
                          active
                            ? "border-accent/30 bg-accent/[0.06] text-ink/85"
                            : "border-[var(--hairline)] bg-transparent text-ink/70"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="block h-1 w-1 shrink-0 rounded-full transition-[background-color,box-shadow] duration-[280ms] lg:h-[3px] lg:w-[3px]"
                          style={{
                            backgroundColor: active
                              ? "var(--color-accent)"
                              : "var(--color-line)",
                            boxShadow: active
                              ? "0 0 5px rgba(59,30,255,0.55)"
                              : "0 0 0 rgba(59,30,255,0)",
                          }}
                        />
                        {service}
                      </li>
                    ))}
                  </motion.ul>

                  {/* Refinement brief: darker body at 17px, tighter to the
                      tags above, and never heavily faded when unreached. */}
                  <p
                    className="mt-3.5 max-w-[38ch] text-[1.0625rem] leading-[1.62] text-ink/75 transition-opacity duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{ opacity: active ? 1 : 0.92 }}
                  >
                    {stage.description}
                  </p>
                </li>
              );
            })}
          </ol>
          </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
