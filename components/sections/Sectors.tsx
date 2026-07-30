"use client";

import { motion } from "motion/react";
import { sectors } from "@/lib/content";
import { hoverTransition } from "@/lib/motion";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

export function Sectors() {
  return (
    <section id="sectors" data-theme="paper" className="section">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">{sectors.eyebrow}</p>
              <h2 className="t-display-lg mt-6 max-w-[22ch]">
                {sectors.title.lead}{" "}
                <span className="text-accent">{sectors.title.accent}</span>
              </h2>
            </RevealText>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <RevealText delay={0.1}>
              <p className="t-body-lg text-[var(--muted)]">{sectors.standfirst}</p>
            </RevealText>
          </div>
        </div>

        <RevealGroup
          as="ul"
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.07}
          soft
        >
          {sectors.items.map((item) => (
            <RevealItem key={item.name} as="li">
              <motion.div
                className="card h-full p-7"
                initial="rest"
                animate="rest"
                whileHover="hover"
                variants={{
                  rest: { y: 0, borderColor: "rgba(18,19,26,0.12)" },
                  hover: { y: -5, borderColor: "#5B3DF5" },
                }}
                transition={hoverTransition}
              >
                <h3 className="t-body font-medium">{item.name}</h3>
                <p className="t-caption mt-3 text-[var(--muted)]">{item.body}</p>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
