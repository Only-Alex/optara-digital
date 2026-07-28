"use client";

import { motion } from "motion/react";
import { speakBubble } from "@/lib/content";
import { DURATION, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Floating contact action, wearing the company mark: the same concentric
 * geometry as LogoMark — accent disc, paper ring, paper centre — at 64/72px
 * rather than the old 96/112px text bubble.
 *
 * The mark alone would not tell a first-time visitor what the button does,
 * so the label rides alongside as a pill that expands on hover and focus.
 * The accessible name is always present, so assistive tech never depends on
 * that reveal.
 */
export function SpeakBubble() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href={speakBubble.href}
      aria-label={speakBubble.label}
      className="group fixed bottom-5 right-5 z-40 flex items-center rounded-full md:bottom-7 md:right-7"
      initial={reduced ? false : { opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.6, ease: EASE, delay: 1.1 },
      }}
      whileHover={reduced ? undefined : { scale: 1.05 }}
      whileFocus={reduced ? undefined : { scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: DURATION.micro, ease: EASE }}
    >
      {/* Label pill sitting to the left of the mark, sliding in on hover or
          focus. Absolutely positioned so nothing animates layout — width
          animation is unusable here, since border-box keeps the pill's own
          padding as a floor. aria-hidden: the link carries the name already. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 translate-x-3 whitespace-nowrap rounded-full bg-ink px-4 py-2.5 text-[0.8125rem] font-medium leading-none text-paper opacity-0 shadow-[0_6px_18px_rgba(18,19,26,0.18)] transition-[opacity,translate] duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-hover:translate-x-0 group-hover:opacity-100"
      >
        {speakBubble.label}
      </span>

      <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-accent shadow-[0_10px_30px_rgba(59,30,255,0.28)] transition-colors duration-200 group-hover:bg-accent-deep md:h-[4.5rem] md:w-[4.5rem]">
        {/* LogoMark's geometry at button scale. Drawn here rather than reusing
            the component so the disc itself can be the button surface. */}
        <svg
          viewBox="0 0 28 28"
          aria-hidden="true"
          focusable="false"
          className="h-8 w-8 md:h-9 md:w-9"
        >
          <circle
            cx="14"
            cy="14"
            r="7.5"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
          />
          <circle cx="14" cy="14" r="2" fill="#fff" />
        </svg>
      </span>
    </motion.a>
  );
}
