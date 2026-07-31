"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { speakBubble } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * Every threshold is a pair, because a single one flickers.
 *
 * A lone cut-off toggles on every crossing, so a reader nudging the wheel near
 * the boundary makes the button blink — measured at five flips across ten
 * small scrolls before these were split. The band between each pair has to be
 * crossed properly before the state changes back.
 */

/**
 * Hero: measured in pixels off the bottom edge, not as a ratio.
 *
 * A ratio band is only as wide as the hero is tall, it moves with the
 * viewport, and it is sampled only when a registered threshold happens to be
 * crossed — measured, a ratio band let the button toggle at 0.156 and 0.178
 * despite both sitting inside it. The hero's own bottom edge is unambiguous:
 * reveal once it is within 140px of the top of the viewport, and hide again
 * only once it has come back down past 340px. Two hundred pixels of slack is
 * far more than a nudge of the wheel.
 */
const HERO_SHOW_BOTTOM_ABOVE = 140;
const HERO_HIDE_BOTTOM_BELOW = 340;

/** Contact and footer: retire as they arrive, return only once well clear. */
const CLOSING_HIDE_ABOVE = 0.25;
const CLOSING_SHOW_BELOW = 0.12;

/**
 * The floating contact shortcut.
 *
 * One observer drives every visibility rule. It watches three targets — the
 * hero, Contact and the footer — and the button is shown only when the hero
 * has substantially left and neither closing section has meaningfully arrived.
 * A second, competing observer or a scroll listener would be the obvious way
 * to add "hide in the hero" on top of the existing retire logic, and it is
 * exactly how the two rules would end up disagreeing at a boundary.
 */
export function SpeakBubble() {
  const reduced = useReducedMotion();

  const [heroVisible, setHeroVisible] = useState(true);
  const [closingVisible, setClosingVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const closing = [
      document.getElementById("contact"),
      document.querySelector("footer"),
    ].filter(Boolean) as Element[];

    if (!hero && closing.length === 0) return;

    // One observer for all three targets. Each entry is judged against the
    // pair of thresholds belonging to its own target, so the hero can use a
    // different band from the closing sections without a second observer that
    // could fall out of step with this one at a boundary.
    const active = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero) {
            // The hero's own bottom edge, straight off the entry — no extra
            // layout read, and no dependence on how tall the hero happens to
            // be. Between the two marks the previous state stands.
            const bottom = entry.boundingClientRect.bottom;
            if (bottom >= HERO_HIDE_BOTTOM_BELOW) active.add(entry.target);
            else if (bottom <= HERO_SHOW_BOTTOM_ABOVE) active.delete(entry.target);
          } else if (entry.intersectionRatio >= CLOSING_HIDE_ABOVE) {
            active.add(entry.target);
          } else if (entry.intersectionRatio <= CLOSING_SHOW_BELOW) {
            active.delete(entry.target);
          }
        }
        if (hero) setHeroVisible(active.has(hero));
        setClosingVisible(closing.some((el) => active.has(el)));
      },
      {
        // Sampled at every 5% so the hero's bottom edge is reported often
        // enough to catch both of its marks on an ordinary scroll, and the
        // closing sections still report a ratio inside their own band.
        threshold: Array.from({ length: 21 }, (_, i) => i / 20),
      },
    );

    if (hero) observer.observe(hero);
    closing.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const hidden = heroVisible || closingVisible;

  return (
    <motion.a
      href={speakBubble.href}
      aria-label={`${speakBubble.label} — go to the enquiry form`}
      className="group fixed z-40 flex items-center justify-center gap-2 rounded-full bg-accent text-paper transition-[background-color,box-shadow] duration-200 hover:bg-accent-deep focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-paper md:h-[5.5rem] md:w-[5.5rem] md:gap-0 md:px-0 h-[3.25rem] px-5 xl:h-[5.75rem] xl:w-[5.75rem]"
      style={{
        // clamp plus the inset keeps it off a notch or a home indicator, and
        // off the browser edge, without ever tracking a section's own grid.
        right: "calc(clamp(1rem, 2.2vw, 2.625rem) + env(safe-area-inset-right))",
        bottom: "calc(clamp(1rem, 3vw, 3rem) + env(safe-area-inset-bottom))",
        // Written here, not as an arbitrary class: a Tailwind arbitrary value
        // containing spaces is split on whitespace and silently dropped, which
        // is why the previous shadow-[0_10px_30px_rgba(91, 61, 245,0.28)]
        // never rendered a shadow at all.
        boxShadow: "0 8px 24px rgba(91,61,245,0.24)",
        pointerEvents: hidden ? "none" : "auto",
      }}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden || undefined}
      initial={false}
      animate={{
        opacity: hidden ? 0 : 1,
        y: reduced ? 0 : hidden ? 10 : 0,
        scale: reduced ? 1 : hidden ? 0.98 : 1,
      }}
      transition={
        reduced ? { duration: 0 } : { duration: 0.28, ease: EASE }
      }
      // No idle animation and no hover scale — the button settles and stays
      // still. Movement on hover is the arrow alone, on mobile where there is
      // one; the disc answers with colour and shadow.
      whileTap={reduced ? undefined : { scale: 0.98 }}
    >
      {/* The mark's ring and dot span the whole disc, so the circle itself
          reads as the logo. Desktop only: at 52px the ring would crowd the
          label rather than frame it. */}
      <svg
        viewBox="0 0 28 28"
        aria-hidden="true"
        focusable="false"
        className="absolute inset-0 hidden h-full w-full md:block"
      >
        <circle cx="14" cy="14" r="11.4" fill="none" stroke="#fff" strokeWidth="1" />
        <circle cx="14" cy="9.4" r="1.25" fill="#fff" />
      </svg>

      <span className="whitespace-nowrap text-[0.875rem] font-medium leading-none tracking-[-0.01em] md:absolute md:left-1/2 md:top-[57%] md:-translate-x-1/2 md:-translate-y-1/2 md:text-[0.6875rem]">
        {speakBubble.label}
      </span>

      {/* Compact variant only. The disc has the mark to carry it; the pill
          needs the direction cue instead. */}
      <ArrowIcon
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-[3px] md:hidden"
      />
    </motion.a>
  );
}
