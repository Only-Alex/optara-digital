"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const items = testimonials.items;
  const active = items[index];

  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + items.length) % items.length);

  return (
    <section data-theme="light" className="section">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-3">
          <p className="t-mono text-[var(--muted)]">{testimonials.eyebrow}</p>
        </div>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <div className="min-h-[16rem]" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.figure
                key={index}
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <blockquote className="t-display-md max-w-[22ch]">
                  “{active.quote}”
                </blockquote>
                <figcaption className="t-mono mt-10 text-[var(--muted)]">
                  {active.name} — {active.role}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center gap-8">
            <div className="relative h-px flex-1 bg-[var(--hairline)]">
              <motion.span
                className="absolute inset-y-0 left-0 bg-blue"
                animate={{ width: `${((index + 1) / items.length) * 100}%` }}
                transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              />
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous testimonial"
                data-cursor="Prev"
                className="t-mono px-2 py-2"
                whileHover={{ color: "#1B32FF", x: -4 }}
                whileFocus={{ color: "#1B32FF", x: -4 }}
                whileTap={{ scale: 0.9 }}
                transition={hoverTransition}
              >
                ←
              </motion.button>
              <span className="t-mono text-[var(--muted)]">
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <motion.button
                type="button"
                onClick={() => go(1)}
                aria-label="Next testimonial"
                data-cursor="Next"
                className="t-mono px-2 py-2"
                whileHover={{ color: "#1B32FF", x: 4 }}
                whileFocus={{ color: "#1B32FF", x: 4 }}
                whileTap={{ scale: 0.9 }}
                transition={hoverTransition}
              >
                →
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
