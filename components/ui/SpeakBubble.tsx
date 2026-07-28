"use client";

import { motion } from "motion/react";
import { speakBubble } from "@/lib/content";
import { DURATION, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * The floating contact action IS the company mark, blown up to button scale:
 * the button's own disc is the logo's disc, the white ring spans it just
 * inside the edge, the signature dot sits at the top of the ring's interior,
 * and "Speak to us" sits inside the ring where the mark's centre is.
 *
 * One deliberate deviation from a literal scale-up, stated rather than
 * hidden: the mark's ring stroke is 7% of its diameter, which at 92px would
 * be a 6.5px band — clunky at this size. The ring keeps the mark's placement
 * but wears a 3.3px stroke, which reads as the same weight optically.
 */
export function SpeakBubble() {
  const reduced = useReducedMotion();

  return (
    <motion.a
      href={speakBubble.href}
      className="group fixed bottom-5 right-5 z-40 block h-[5.25rem] w-[5.25rem] rounded-full bg-accent text-paper shadow-[0_10px_30px_rgba(59,30,255,0.28)] transition-colors duration-200 hover:bg-accent-deep md:bottom-7 md:right-7 md:h-[5.75rem] md:w-[5.75rem]"
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
      {/* Ring and dot span the whole button, so the circle itself reads as
          the mark rather than carrying a small copy of it. */}
      <svg
        viewBox="0 0 28 28"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 h-full w-full"
      >
        <circle
          cx="14"
          cy="14"
          r="11.4"
          fill="none"
          stroke="#fff"
          strokeWidth="1"
        />
        <circle cx="14" cy="9.4" r="1.25" fill="#fff" />
      </svg>

      <span className="absolute left-1/2 top-[57%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[0.65rem] font-medium leading-none tracking-[-0.01em] md:text-[0.6875rem]">
        {speakBubble.label}
      </span>
    </motion.a>
  );
}
