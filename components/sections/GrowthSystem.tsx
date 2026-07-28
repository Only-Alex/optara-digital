"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { growthSystem } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { RevealText } from "@/components/ui/RevealText";

const STAGE_COUNT = growthSystem.stages.length;

export function GrowthSystem() {
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Progress across the stage track only, not the whole section, so the line
  // finishes drawing as the last stage reaches comfortable reading height.
  const progress = useScrollProgress(trackRef, ["start 78%", "end 65%"]);

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

  return (
    <section data-theme="paper" className="section relative">
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
              <h2 className="t-display-lg mt-6 max-w-[16ch]">
                {growthSystem.heading}{" "}
                <span className="text-accent">{growthSystem.accentText}</span>
              </h2>
            </RevealText>
          </div>

          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <RevealText delay={0.1}>
              <p className="t-body-lg text-ink/60">
                {growthSystem.supportingParagraph}
              </p>
            </RevealText>
          </div>
        </div>

        <div ref={trackRef} className="relative mt-20 md:mt-24">
          <motion.div
            className="relative"
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
          {/* The stem: the route descending out of the hero's ground before
              it turns and runs the four stages. Desktop only — mobile's rail
              is already vertical. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[7px] top-[-84px] hidden h-[84px] w-px lg:block"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
          >
            <line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="var(--color-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <motion.line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="var(--color-accent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduced ? 1 : stemDrawn }}
            />
          </svg>

          {/* Continuous horizontal route, desktop only. At tablet the stages
              wrap to 2x2, where a single full-width line would be misleading,
              so each stage carries its own rule instead. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-[7px] hidden h-px w-full lg:block"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="var(--color-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="var(--color-accent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduced ? 1 : drawn }}
            />
          </svg>

          {/* Vertical route, mobile. Runs down the left gutter. */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute left-[7px] top-0 block h-full w-px md:hidden"
            viewBox="0 0 1 100"
            preserveAspectRatio="none"
          >
            <line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="var(--color-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <motion.line
              x1="0.5"
              y1="0"
              x2="0.5"
              y2="100"
              stroke="var(--color-accent)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: reduced ? 1 : drawn }}
            />
          </svg>

          <ol className="relative grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-10 md:gap-y-16 lg:grid-cols-4 lg:gap-x-8">
            {growthSystem.stages.map((stage, index) => {
              const active = isActive(index);

              return (
                <li
                  key={stage.number}
                  className="relative pl-9 md:border-t md:pl-0 md:pt-9 lg:border-t-0"
                  style={{
                    borderTopColor: active
                      ? "var(--color-accent)"
                      : "var(--color-line)",
                    transition:
                      "border-color 240ms cubic-bezier(0.16,1,0.3,1)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[1px] block h-[15px] w-[15px] rounded-full bg-paper p-[3px] md:-top-[7px] lg:top-0"
                  >
                    <span
                      className="block h-full w-full rounded-full transition-colors duration-[240ms]"
                      style={{
                        backgroundColor: active
                          ? "var(--color-accent)"
                          : "var(--color-line)",
                        transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
                      }}
                    />
                  </span>

                  {/* Ghost numeral: a depth layer behind the stage, echoing
                      the hero's oversized background type. Legitimate
                      numbering — the four stages are a real sequence. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-0 top-5 select-none font-semibold leading-none tracking-[-0.04em] transition-colors duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-[4.25rem] md:top-8 md:text-[5.25rem]"
                    style={{
                      color: active
                        ? "rgba(59,30,255,0.07)"
                        : "rgba(18,19,26,0.04)",
                    }}
                  >
                    {stage.number}
                  </span>

                  <span
                    className="t-mono relative block transition-colors duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      color: active
                        ? "var(--color-accent)"
                        : "color-mix(in srgb, var(--color-ink) 40%, transparent)",
                    }}
                  >
                    {stage.number}
                  </span>

                  <h3
                    className="t-display-md mt-4 transition-[color,transform] duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      color: active
                        ? "var(--color-ink)"
                        : "color-mix(in srgb, var(--color-ink) 55%, transparent)",
                      // Settles upward as the line reaches it — a depth cue in
                      // the same register as the colour shift. Static under
                      // reduced motion because `active` is then always true.
                      transform: active ? "translateY(0)" : "translateY(5px)",
                    }}
                  >
                    {stage.title}
                  </h3>

                  <motion.ul
                    className="mt-5 flex flex-wrap gap-2"
                    initial={false}
                    animate={
                      reduced
                        ? { opacity: 1, y: 0 }
                        : { opacity: active ? 1 : 0.35, y: active ? 0 : 6 }
                    }
                    transition={{ duration: 0.28, ease: EASE }}
                  >
                    {stage.services.map((service) => (
                      <li
                        key={service}
                        className={`t-mono rounded-full border px-3 py-1.5 transition-colors duration-[240ms] ${
                          active
                            ? "border-accent/35 text-ink/70"
                            : "border-[var(--hairline)] text-ink/60"
                        }`}
                      >
                        {service}
                      </li>
                    ))}
                  </motion.ul>

                  <p
                    className="t-body mt-5 max-w-[38ch] transition-opacity duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)] text-ink/60"
                    style={{ opacity: active ? 1 : 0.62 }}
                  >
                    {stage.description}
                  </p>
                </li>
              );
            })}
          </ol>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
