"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { hero, scrollCue } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { FluidCursor } from "@/components/ui/FluidCursor";
import { CheckIcon } from "@/components/ui/Icons";

/**
 * The four commercial commitments, confirmed genuine by the business. They
 * close the hero as a ticker where the reference design runs an awards strip;
 * Optara has no verified awards, so the commitments are the honest version.
 */
const COMMITMENTS = [
  "No long lock-ins",
  "Live within thirty days",
  "You own the work",
  "Reply within two working days",
];

/** One pass of the ticker. Rendered twice so the loop is seamless; the copy
 *  is marked decorative and the first pass carries the real text. Each item
 *  carries its own trailing separator so both runs join identically. */
function CommitmentRun({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`flex items-center ${hidden ? "motion-reduce:hidden" : "motion-reduce:flex-wrap motion-reduce:justify-center"}`}
    >
      {COMMITMENTS.map((item) => (
        <li key={item} className="flex shrink-0 items-center">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#2B7FFF,#5B3DF5_55%,#7B2FF7)] text-paper shadow-[0_4px_14px_rgba(91,61,245,0.35)]">
            <CheckIcon className="h-3 w-3" />
          </span>
          <span className="t-mono ml-3 whitespace-nowrap text-ink/70">{item}</span>
          <span
            aria-hidden="true"
            className="mx-10 h-1 w-1 shrink-0 rounded-full bg-[linear-gradient(135deg,#2B7FFF,#7B2FF7)] opacity-60"
          />
        </li>
      ))}
    </ul>
  );
}

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

      {/* Ghost wordmark, in the logo's own setting. Uppercase and widely
          tracked, it runs far wider than the old lowercase version, so the
          cap comes down to keep it inside the viewport at every breakpoint —
          see the measurement in the sprint notes. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center"
      >
        <Wordmark
          display
          className="text-ink/[0.045] text-[clamp(2.4rem,11.2vw,11rem)]"
        />
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
            {/* The logo's full ramp — blue #2B7FFF through violet #5B3DF5 to
                purple #7B2FF7 — matched to the approved screenshot: blue on
                the M, purple on the final letters. Static, because the old
                drift animation slid the window so the full ramp was never
                on screen at once, which is exactly what the screenshot asks
                for. */}
            <span className="bg-[linear-gradient(92deg,#2B7FFF_0%,#5B3DF5_52%,#7B2FF7_100%)] bg-clip-text text-transparent">
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

      {/* The commitments ticker on the hero's bottom edge. A CSS-only loop —
          two identical runs, the track sliding half its own width — with the
          edges dissolved by a mask so items enter and leave as light rather
          than hitting a hard cut. The top edge is a brand-gradient hairline
          rather than a flat border, the pace is unhurried, and hovering
          pauses the run so the four commitments can actually be read.
          Reduced motion stops the slide, hides the duplicate run and lets
          the four wrap centred instead. */}
      <div className="relative z-10 bg-paper/70 py-5 backdrop-blur-sm">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(43,127,255,0.55)_20%,rgba(91,61,245,0.55)_50%,rgba(123,47,247,0.55)_80%,transparent)]"
        />
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max [animation:hero-ticker_48s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:[animation:none]">
            <CommitmentRun />
            <CommitmentRun hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
