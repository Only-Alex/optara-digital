"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { hero } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";

export function Hero() {
  const reduced = useReducedMotion();
  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section
      id="top"
      data-theme="paper"
      className="relative overflow-hidden bg-[var(--bg)] pb-16 pt-32 md:pt-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[38rem] w-[80rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,30,255,0.10),transparent_65%)]"
      />

      <div className="shell relative flex flex-col items-center text-center">
        <motion.p
          className="t-mono flex items-center gap-2 rounded-full border border-[var(--hairline)] px-4 py-2 text-[var(--muted)]"
          {...rise(0.1)}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          className="t-display-xl mt-8 max-w-[24ch] text-balance"
          {...rise(0.2)}
        >
          <span className="text-accent">{hero.headline.accent}</span>{" "}
          <span>{hero.headline.rest}</span>
        </motion.h1>

        <motion.p
          className="t-body-lg mt-7 max-w-[58ch] text-[var(--muted)]"
          {...rise(0.32)}
        >
          {hero.standfirst}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          {...rise(0.44)}
        >
          {hero.actions.map((action) => (
            <Button
              key={action.href}
              href={action.href}
              variant={action.primary ? "solid" : "outline"}
              withArrow={action.primary}
              className="justify-center"
            >
              {action.label}
            </Button>
          ))}
        </motion.div>
      </div>

      <motion.div className="mt-20" {...rise(0.6)}>
        <p className="t-mono mb-6 text-center text-[var(--muted)]">
          {hero.clientsLabel}
        </p>
        <Marquee items={hero.clients} />
      </motion.div>
    </section>
  );
}
