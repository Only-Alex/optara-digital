"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { testimonials } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const items = testimonials.items;

  // No verified, nameable testimonials exist yet. Render nothing rather than
  // an empty carousel, and keep the component ready for when they do.
  if (items.length === 0) return null;

  const active = items[index];

  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + items.length) % items.length);

  return (
    <section data-theme="ink" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{testimonials.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[24ch]">
            {testimonials.title.lead}{" "}
            <span className="text-[var(--accent-fg)]">
              {testimonials.title.accent}
            </span>
          </h2>
        </RevealText>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <div className="min-h-[15rem]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.figure
                  key={index}
                  initial={reduced ? undefined : { opacity: 0, y: 14 }}
                  animate={reduced ? undefined : { opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <blockquote className="t-display-md max-w-[34ch] font-normal">
                    “{active.quote}”
                  </blockquote>
                  <figcaption className="mt-8">
                    <span className="t-body block font-medium">{active.name}</span>
                    <span className="t-caption text-[var(--muted)]">
                      {active.role}
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-end gap-3 lg:col-span-3 lg:justify-end">
            <motion.button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="pill border border-[var(--hairline)] px-5"
              whileHover={{
                borderColor: "var(--accent-fg)",
                color: "var(--accent-fg)",
              }}
              whileFocus={{
                borderColor: "var(--accent-fg)",
                color: "var(--accent-fg)",
              }}
              whileTap={{ scale: 0.94 }}
              transition={hoverTransition}
            >
              <ArrowIcon className="h-4 w-4 rotate-180" />
            </motion.button>
            <motion.button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="pill border border-[var(--hairline)] px-5"
              whileHover={{
                borderColor: "var(--accent-fg)",
                color: "var(--accent-fg)",
              }}
              whileFocus={{
                borderColor: "var(--accent-fg)",
                color: "var(--accent-fg)",
              }}
              whileTap={{ scale: 0.94 }}
              transition={hoverTransition}
            >
              <ArrowIcon className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-4">
          <div className="relative h-px flex-1 bg-[var(--hairline)]">
            <motion.span
              className="absolute inset-y-0 left-0 bg-[var(--accent-fg)]"
              animate={{ width: `${((index + 1) / items.length) * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            />
          </div>
          <span className="t-mono text-[var(--muted)]">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </section>
  );
}
