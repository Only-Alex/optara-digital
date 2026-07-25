"use client";

import { motion } from "motion/react";
import { work } from "@/lib/content";
import { hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Work() {
  return (
    <section id="results" data-theme="bone" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{work.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[26ch]">
            {work.title.lead}{" "}
            <span className="text-accent">{work.title.accent}</span>
          </h2>
        </RevealText>

        <RevealGroup
          as="ul"
          className="mt-16 border-t border-[var(--hairline)]"
          stagger={0.07}
          soft
        >
          {work.cases.map((item) => (
            <RevealItem
              key={item.client}
              as="li"
              className="border-b border-[var(--hairline)]"
            >
              <motion.div
                className="grid gap-4 py-8 md:grid-cols-12 md:items-baseline md:gap-6"
                initial="rest"
                animate="rest"
                whileHover="hover"
              >
                <motion.div
                  className="md:col-span-4"
                  variants={{ rest: { x: 0 }, hover: { x: 8 } }}
                  transition={hoverTransition}
                >
                  <h3 className="t-body font-medium">{item.client}</h3>
                  <p className="t-mono mt-2 text-[var(--muted)]">{item.sector}</p>
                </motion.div>

                <motion.p
                  className="t-display-md md:col-span-4"
                  variants={{
                    rest: { color: "#12131A" },
                    hover: { color: "#3B1EFF" },
                  }}
                  transition={hoverTransition}
                >
                  {item.headline}
                </motion.p>

                <div className="md:col-span-4">
                  <p className="t-caption text-[var(--muted)]">{item.detail}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {item.services.map((service) => (
                      <li
                        key={service}
                        className="t-mono rounded-full bg-paper px-3 py-1.5 text-[var(--muted)]"
                      >
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
