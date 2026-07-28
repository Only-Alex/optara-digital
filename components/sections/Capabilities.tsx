"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { capabilities } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RevealText } from "@/components/ui/RevealText";
import { CheckIcon } from "@/components/ui/Icons";
import { ServiceMockup } from "@/components/ui/ServiceMockup";
import { TiltCard } from "@/components/ui/TiltCard";

export function Capabilities() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const group = capabilities.groups[active];

  return (
    <section id="services" data-theme="paper" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{capabilities.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[24ch]">
            {capabilities.title.lead}{" "}
            <span className="text-accent">{capabilities.title.accent}</span>
          </h2>
        </RevealText>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <ul
              role="tablist"
              aria-label="Services"
              className="flex flex-col border-t border-[var(--hairline)]"
            >
              {capabilities.groups.map((item, i) => {
                const selected = i === active;
                return (
                  <li key={item.name} className="border-b border-[var(--hairline)]">
                    <motion.button
                      type="button"
                      role="tab"
                      id={`cap-tab-${i}`}
                      aria-selected={selected}
                      aria-controls={`cap-panel-${i}`}
                      onClick={() => setActive(i)}
                      className="relative flex w-full items-center justify-between gap-4 py-5 text-left"
                      whileHover={{ x: 6 }}
                      transition={hoverTransition}
                    >
                      {/* No 01–04 numerals: a tab list is not a sequence, and
                          §4 limits numbering to real ones. */}
                      <span
                        className={`t-display-md transition-colors duration-200 ${
                          selected ? "text-accent" : "text-[var(--fg)]"
                        }`}
                      >
                        {item.name}
                      </span>
                      {selected && (
                        <motion.span
                          layoutId="cap-indicator"
                          className="absolute -bottom-px left-0 h-0.5 w-full bg-accent"
                          transition={{ duration: 0.35, ease: EASE }}
                        />
                      )}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                id={`cap-panel-${active}`}
                role="tabpanel"
                aria-labelledby={`cap-tab-${active}`}
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {/* First point on the page that shows a screen rather than
                    describing one. Decorative, so the copy below still carries
                    the whole meaning if it fails to paint. The tilt is a depth
                    cue on fine pointers only. */}
                <TiltCard className="mb-9 aspect-[4/3] w-full max-w-[30rem] rounded-[13px] bg-[color-mix(in_srgb,var(--fg)_3%,transparent)] p-4 sm:p-5">
                  <ServiceMockup index={active} className="h-full w-full" />
                </TiltCard>

                {group.body.map((paragraph, i) => (
                  <p
                    key={paragraph}
                    className={
                      i === 0
                        ? "t-body-lg mb-5"
                        : "t-body-lg mb-5 text-[var(--muted)]"
                    }
                  >
                    {paragraph}
                  </p>
                ))}

                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {group.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span className="t-body">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
