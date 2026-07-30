"use client";

import { motion } from "motion/react";
import { services } from "@/lib/content";
import { hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";

export function Services() {
  return (
    <section id="services" data-theme="bone" className="section">
      <div className="shell">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">What we do</p>
          <h2 className="t-display-lg mt-6 max-w-[26ch]">
            Four services,{" "}
            <span className="text-accent">one revenue target.</span>
          </h2>
        </RevealText>

        <RevealGroup
          className="mt-16 grid gap-6 md:grid-cols-2"
          stagger={0.09}
          soft
        >
          {services.map((service) => (
            <RevealItem key={service.index}>
              <motion.article
                className="card flex h-full flex-col p-8 md:p-10"
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={{
                  rest: { y: 0, borderColor: "rgba(18,19,26,0.12)" },
                  hover: { y: -6, borderColor: "#5B3DF5" },
                }}
                transition={hoverTransition}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="t-mono text-accent">{service.index}</span>
                  <motion.span
                    className="text-accent"
                    variants={{
                      rest: { opacity: 0, x: -6 },
                      hover: { opacity: 1, x: 0 },
                    }}
                    transition={hoverTransition}
                  >
                    <ArrowIcon className="h-5 w-5" />
                  </motion.span>
                </div>

                <h3 className="t-display-md mt-6">{service.name}</h3>
                <p className="t-body mt-4 max-w-[38ch] text-[var(--muted)]">
                  {service.description}
                </p>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <li
                      key={tag}
                      className="t-mono rounded-full border border-[var(--hairline)] px-3 py-1.5 text-[var(--muted)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
