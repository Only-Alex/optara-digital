"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { faqs } from "@/lib/content";
import { EASE, hoverTransition } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { PlusIcon } from "@/components/ui/Icons";
import { Button } from "@/components/ui/Button";

type Vote = "yes" | "no" | null;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [votes, setVotes] = useState<Record<number, Vote>>({});
  const reduced = useReducedMotion();

  return (
    // The late dark beat of the shortened homepage — ConnectedSystem holds the
    // mid-page one. An accordion suits ink: only one short answer sits on the
    // dark ground at a time.
    <section id="faqs" data-theme="ink" className="section">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
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

        <RevealGroup
          as="ul"
          className="lg:col-span-7 lg:col-start-6"
          stagger={0.06}
          soft
        >
          {faqs.items.map((item, i) => {
            const isOpen = open === i;
            const vote = votes[i] ?? null;

            return (
              <RevealItem
                key={item.question}
                as="li"
                className="border-b border-[var(--hairline)] first:border-t"
              >
                <motion.button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  whileHover={{ color: "var(--accent-fg)" }}
                  transition={hoverTransition}
                >
                  <span className="t-body-lg font-medium">{item.question}</span>
                  <motion.span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--hairline)]"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <PlusIcon className="h-3 w-3" />
                  </motion.span>
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${i}`}
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                    >
                      <div className="pb-8 pr-4">
                        <p className="t-body text-[var(--muted)]">{item.answer}</p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          {vote === null ? (
                            <>
                              <span className="t-mono text-[var(--muted)]">
                                {faqs.helpful.prompt}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setVotes((prev) => ({ ...prev, [i]: "yes" }))
                                }
                                className="t-mono rounded-full border border-[var(--hairline)] px-4 py-2 transition-colors duration-200 hover:border-[var(--accent-fg)] hover:text-[var(--accent-fg)]"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setVotes((prev) => ({ ...prev, [i]: "no" }))
                                }
                                className="t-mono rounded-full border border-[var(--hairline)] px-4 py-2 transition-colors duration-200 hover:border-[var(--accent-fg)] hover:text-[var(--accent-fg)]"
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <motion.div
                              className="flex flex-wrap items-center gap-3"
                              initial={reduced ? undefined : { opacity: 0, y: 6 }}
                              animate={reduced ? undefined : { opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, ease: EASE }}
                              role="status"
                            >
                              <span className="t-mono text-[var(--muted)]">
                                {vote === "yes" ? faqs.helpful.yes : faqs.helpful.no}
                              </span>
                              {vote === "no" && (
                                <Button
                                  href={faqs.helpful.cta.href}
                                  variant="outline"
                                  className="!px-4 !py-2 !text-[0.8125rem]"
                                >
                                  {faqs.helpful.cta.label}
                                </Button>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
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
