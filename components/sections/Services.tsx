"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { services } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { RevealText } from "@/components/ui/RevealText";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function Services() {
  const [active, setActive] = useState<string | null>(services[0].index);
  const reduced = useReducedMotion();

  return (
    <section id="services" data-theme="light" className="section">
      <div className="shell">
        <RevealText>
          <h2 className="t-mono text-[var(--muted)]">02 — Services</h2>
        </RevealText>

        <ul className="mt-14 border-t border-[var(--hairline)]">
          {services.map((service) => {
            const isOpen = active === service.index;

            return (
              <li
                key={service.index}
                className="relative border-b border-[var(--hairline)]"
                onMouseEnter={() => setActive(service.index)}
              >
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-blue"
                  style={{ transformOrigin: "left" }}
                  initial={false}
                  animate={{ scaleX: isOpen ? 1 : 0 }}
                  transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                />

                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`service-panel-${service.index}`}
                  onClick={() => setActive(isOpen ? null : service.index)}
                  data-cursor={isOpen ? undefined : "Open"}
                  className={`relative flex w-full items-baseline gap-6 py-8 text-left transition-colors duration-300 md:gap-12 ${
                    isOpen ? "text-paper" : "text-[var(--fg)]"
                  }`}
                >
                  <span className="t-mono shrink-0 opacity-70">{service.index}</span>
                  <span className="t-display-md flex-1">{service.name}</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`service-panel-${service.index}`}
                      className="relative overflow-hidden text-paper"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
                    >
                      <div className="grid-12 pb-10">
                        <p className="t-body-lg col-span-12 max-w-[52ch] md:col-span-6 md:col-start-3">
                          {service.description}
                        </p>
                        <ul className="col-span-12 mt-6 flex flex-wrap gap-x-8 gap-y-3 md:col-span-3 md:col-start-10 md:mt-0 md:flex-col">
                          {service.tags.map((tag) => (
                            <li key={tag} className="t-mono opacity-80">
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
