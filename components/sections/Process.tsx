"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { process } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Process() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const [current, setCurrent] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!isDesktop) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = stepRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index >= 0) setCurrent(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <section data-theme="light" className="section">
      <div className="shell grid-12 gap-y-12">
        <div className="col-span-12 lg:col-span-4">
          <RevealText>
            <p className="t-mono text-[var(--muted)]">{process.eyebrow}</p>
          </RevealText>
          <div className="lg:sticky lg:top-[38vh]">
            <RevealText delay={0.08}>
              <h2 className="t-display-md mt-6 max-w-[12ch]">{process.title}</h2>
            </RevealText>
            <div
              aria-hidden="true"
              className="mt-10 hidden h-[1.1em] overflow-hidden lg:block"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={current}
                  className="t-display-xl block leading-none text-blue"
                  initial={reduced ? undefined : { y: "100%", opacity: 0 }}
                  animate={reduced ? undefined : { y: "0%", opacity: 1 }}
                  exit={reduced ? undefined : { y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {process.steps[current].index}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <RevealGroup
          as="ol"
          className="col-span-12 lg:col-span-7 lg:col-start-6"
          stagger={0.1}
          soft
        >
          {process.steps.map((step, i) => (
            <RevealItem
              key={step.index}
              as="li"
              className="border-t border-[var(--hairline)] py-12 last:border-b"
            >
              <div
                ref={(node) => {
                  stepRefs.current[i] = node;
                }}
              >
                <p className="t-mono text-[var(--muted)] lg:hidden">{step.index}</p>
                <h3 className="t-display-md mt-3 lg:mt-0">{step.name}</h3>
                <p className="t-body-lg mt-5 max-w-[52ch] text-[var(--muted)]">
                  {step.description}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
