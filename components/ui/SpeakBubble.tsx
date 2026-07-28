"use client";

import { motion } from "motion/react";
import { speakBubble } from "@/lib/content";
import { DURATION, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Floating contact action, built as the company logo: LogoMark's exact
 * geometry — accent disc, paper ring, paper centre, at the mark's own
 * proportions — with the label set beneath it inside the same disc.
 *
 * The label is permanent rather than revealed on hover: touch devices never
 * hover, so a hover-only label left mobile visitors facing an unlabelled dot.
 * 84/92px, still well down from the original 96/112px bubble.
 */
export function SpeakBubble() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href={speakBubble.href}
      className="group fixed bottom-5 right-5 z-40 grid h-[5.25rem] w-[5.25rem] place-items-center rounded-full bg-accent text-paper shadow-[0_10px_30px_rgba(59,30,255,0.28)] transition-colors duration-200 hover:bg-accent-deep md:bottom-7 md:right-7 md:h-[5.75rem] md:w-[5.75rem]"
      initial={reduced ? false : { opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: reduced
          ? { duration: 0 }
          : { duration: 0.6, ease: EASE, delay: 1.1 },
      }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      whileFocus={reduced ? undefined : { scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: DURATION.micro, ease: EASE }}
    >
      <span className="flex flex-col items-center gap-1.5">
        {/* LogoMark's inner geometry at the mark's own ratios — ring radius
            7.5 and centre radius 2 on a 28 viewBox. Drawn here rather than
            reusing the component so the button surface is itself the disc,
            exactly as the header lockup reads. */}
        <svg
          viewBox="0 0 28 28"
          aria-hidden="true"
          focusable="false"
          className="h-[1.6rem] w-[1.6rem] md:h-7 md:w-7"
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

        <span className="whitespace-nowrap text-[0.6875rem] font-medium leading-none tracking-[-0.01em]">
          {speakBubble.label}
        </span>
      </span>
    </motion.a>
  );
}
