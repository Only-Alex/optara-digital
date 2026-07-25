"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { hero, scrollCue, site } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { InkField } from "@/components/ui/InkField";

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
      className="relative flex min-h-svh flex-col overflow-hidden bg-[var(--bg)]"
    >
      <InkField />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-semibold leading-none tracking-[-0.04em] text-ink/[0.045] text-[clamp(6rem,19vw,20rem)]"
      >
        {site.name.toLowerCase()}
      </span>

      <span
        aria-hidden="true"
        className="t-mono absolute left-4 top-1/2 hidden -translate-y-1/2 -rotate-90 text-[var(--muted)] lg:block"
      >
        {scrollCue}
      </span>

      <div className="relative flex flex-1 items-center pt-32 pb-16">
        <div className="shell flex flex-col items-center text-center">
          <motion.p
            className="t-mono flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-paper/70 px-4 py-2 text-[var(--muted)] backdrop-blur-sm"
            {...rise(0.1)}
          >
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            className="t-display-xl mt-8 max-w-[22ch] text-balance"
            {...rise(0.2)}
          >
            <span className="bg-[linear-gradient(96deg,#3B1EFF_0%,#7A4BFF_38%,#3B1EFF_72%,#1B0FA8_100%)] bg-[length:220%_100%] bg-clip-text text-transparent [animation:hue-drift_9s_ease-in-out_infinite]">
              {hero.headline.accent}
            </span>{" "}
            <span>{hero.headline.rest}</span>
          </motion.h1>

          <motion.p
            className="t-body-lg mt-7 max-w-[56ch] text-[var(--muted)]"
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
      </div>

      <motion.div className="relative" {...rise(0.62)}>
        <div className="shell">
          <ul className="grid grid-cols-2 divide-x divide-y divide-[var(--hairline)] border-t border-[var(--hairline)] sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
            {hero.clients.map((client) => (
              <li
                key={client}
                className="flex min-h-[5.5rem] items-center justify-center px-4 py-5 text-center"
              >
                <span className="t-caption font-medium text-[var(--muted)]">
                  {client}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
