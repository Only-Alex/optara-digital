"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { hero, scrollCue, site } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { FluidCursor } from "@/components/ui/FluidCursor";

export function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section
      id="top"
      data-theme="paper"
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--bg)]"
    >
      <FluidCursor />

      <span
        aria-hidden="true"
        // Sized so the full wordmark always fits. "optara digital" measures
        // 5.7em of glyphs at this tracking, so the font caps at ~17.5% of
        // the viewport width; 16.5vw keeps a margin at every breakpoint. The
        // old 19vw was set for the shorter previous name and clipped it.
        className="pointer-events-none absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-semibold leading-none tracking-[-0.04em] text-ink/[0.045] text-[clamp(3rem,16.5vw,16rem)]"
      >
        {site.name.toLowerCase()}
      </span>

      <span
        aria-hidden="true"
        className="t-mono absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[var(--muted)] lg:block"
      >
        {scrollCue}
      </span>

      <div className="relative flex flex-1 items-center pt-32 pb-16">
        <div className="shell flex flex-col items-center text-center">
          <motion.p
            className="t-mono flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-paper/70 px-4 py-2 text-[var(--muted)] backdrop-blur-sm"
            {...rise(0.1)}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            className="t-display-xl mt-8 max-w-[22ch] text-balance"
            {...rise(0.2)}
          >
            <span className="bg-[linear-gradient(96deg,#5B3DF5_0%,#7A4BFF_38%,#5B3DF5_72%,#3A22C9_100%)] bg-[length:220%_100%] bg-clip-text text-transparent [animation:hue-drift_9s_ease-in-out_infinite]">
              {hero.headline.accent}
            </span>{" "}
            <span>{hero.headline.rest}</span>
          </motion.h1>

          <motion.p
            className="t-body-lg mt-7 max-w-[56ch] text-[var(--muted)]"
            {...rise(0.32)}
          >
            {hero.standfirst}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
            {...rise(0.44)}
          >
            {hero.actions.map((action) => (
              <Button
                key={action.href}
                href={action.href}
                variant={action.primary ? "solid" : "outline"}
                withArrow={action.primary}
                className="justify-center"
              >
                {action.label}
              </Button>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
}
