"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqs } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { PlusIcon } from "@/components/ui/Icons";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    // The late dark beat of the shortened homepage — ConnectedSystem holds the
    // mid-page one. An accordion suits ink: only one short answer sits on the
    // dark ground at a time.
    <section id="faqs" data-theme="ink" className="section">
      {/* 34/66 with a gap that opens with the viewport. The previous 4-and-7
          of twelve left a whole empty column between them and still gave the
          answers only 52% to read in. */}
      <div className="shell grid gap-12 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:gap-x-[clamp(3rem,5vw,7rem)]">
        {/* Sticky so the question "Frequently asked questions" keeps answering
            while the reader works down the list. */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{faqs.eyebrow}</p>
            <h2 className="t-display-lg mt-6 max-w-[16ch]">
              {faqs.title.lead}{" "}
              <span className="text-[var(--accent-fg)]">
                {faqs.title.accent}
              </span>
            </h2>
          </RevealText>
        </div>

        {/* Safe area for the floating contact button. It is fixed, so it
            crosses the accordion's right edge at some scroll position whatever
            its vertical placement — measured 22px into the column at 1440.
            The reserve is the button's footprint minus the room the centred
            container already leaves, so it falls to zero from about 1480px up
            and never narrows the questions more than it has to. */}
        <RevealGroup
          as="ul"
          stagger={0.06}
          soft
          className="lg:[padding-right:max(0px,calc(132px_-_max(0px,(100vw_-_1360px)/2)_-_clamp(1.25rem,4vw,4rem)))]"
        >
          {faqs.items.map((item, i) => {
            const isOpen = open === i;
            const panelId = `faq-panel-${i}`;

            return (
              <RevealItem
                key={item.question}
                as="li"
                // The rule brightens under the open item, which is most of
                // what marks it out — no card, no fill.
                className={`border-b transition-colors duration-[240ms] ease-[cubic-bezier(0.16,1,0.3,1)] first:border-t ${
                  isOpen
                    ? "border-paper/25"
                    : "border-[var(--hairline)]"
                }`}
              >
                <motion.button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  // items-start, not items-center: on a question that wraps to
                  // two lines a centred icon drifts away from the first line,
                  // which is the line it belongs to.
                  className="flex w-full items-start justify-between gap-6 py-5 text-left md:py-7"
                  whileHover={{ color: "var(--accent-fg)" }}
                  transition={hoverTransition}
                >
                  {/* 18px climbing to 22px — the questions were set at body
                      size and read as list items rather than as headings. */}
                  <span
                    className={`text-[clamp(1.125rem,1.45vw,1.375rem)] font-medium leading-[1.35] transition-colors duration-200 ${
                      isOpen ? "text-[var(--accent-fg)]" : ""
                    }`}
                  >
                    {item.question}
                  </span>
                  <motion.span
                    aria-hidden="true"
                    className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)]"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: reduced ? 0 : 0.28, ease: EASE }}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      className="overflow-hidden"
                      // height: auto, never a measured constant — the answer
                      // re-wraps on resize and after the webfont lands, and a
                      // cached pixel height would clip the last line.
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: reduced ? 0 : 0.36,
                        ease: EASE,
                        opacity: { duration: reduced ? 0 : 0.24 },
                      }}
                    >
                      {/* pr-12 reserves the indicator's column so a long line
                          can never run beneath it. Answers stay flush with the
                          question's left edge rather than indenting. */}
                      <motion.div
                        className="pb-8 pr-12"
                        initial={reduced ? undefined : { y: -4 }}
                        animate={reduced ? undefined : { y: 0 }}
                        transition={{ duration: reduced ? 0 : 0.36, ease: EASE }}
                      >
                        {item.answer.map((paragraph, p) => (
                          <p
                            key={paragraph}
                            className={`max-w-[42rem] text-[1.0625rem] leading-[1.7] text-paper/80 ${
                              p > 0 ? "mt-4" : ""
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
