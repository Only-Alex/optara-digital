"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { PlusIcon } from "@/components/ui/Icons";

export type AccordionItem = { question: string; answer: string[] };

/**
 * The homepage FAQ's interaction, extracted so a service page can reuse it
 * rather than grow a second accordion that drifts from it. One item open at a
 * time, the open item may be closed, height stays auto so a re-wrap on resize
 * cannot clip the last line, and reduced motion collapses the timings to zero
 * without removing the behaviour.
 */
export function Accordion({
  items,
  idPrefix,
}: {
  items: AccordionItem[];
  idPrefix: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  return (
    <ul>
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${idPrefix}-panel-${i}`;

        return (
          <li
            key={item.question}
            className={`border-b transition-colors duration-[240ms] first:border-t ${
              isOpen ? "border-ink/20" : "border-[var(--hairline)]"
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-6 py-5 text-left md:py-7"
            >
              <span
                className={`text-[clamp(1.0625rem,1.3vw,1.3125rem)] font-medium leading-[1.35] transition-colors duration-200 ${
                  isOpen ? "text-accent" : ""
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
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  className="overflow-hidden"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.36,
                    ease: EASE,
                    opacity: { duration: reduced ? 0 : 0.24 },
                  }}
                >
                  <div className="pb-8 pr-12">
                    {item.answer.map((paragraph, p) => (
                      <p
                        key={paragraph}
                        className={`max-w-[42rem] text-[1.0625rem] leading-[1.7] text-ink/75 ${
                          p > 0 ? "mt-4" : ""
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
