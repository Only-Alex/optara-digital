"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { hero } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      data-theme="light"
      className="relative flex min-h-svh flex-col justify-end bg-[var(--bg)] pb-8 pt-32 text-[var(--fg)]"
    >
      <div className="shell grid-12 flex-1 items-end">
        <h1 className="t-display-xl col-span-12 lg:col-span-9">
          {hero.lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduced ? undefined : { y: "110%" }}
                animate={reduced ? undefined : { y: "0%" }}
                transition={{
                  duration: 0.9,
                  ease: EASE,
                  delay: 0.15 + lineIndex * 0.09,
                }}
              >
                {line.map((word, wordIndex) =>
                  word.italic ? (
                    <em key={wordIndex} className="italic">
                      {word.text}
                    </em>
                  ) : (
                    <span key={wordIndex}>{word.text}</span>
                  ),
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          className="t-body-lg col-span-12 mt-10 max-w-[46ch] text-[var(--muted)] lg:col-span-5 lg:col-start-7 lg:mt-0 lg:self-end"
          initial={reduced ? undefined : { opacity: 0, y: 24 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        >
          {hero.standfirst}
        </motion.p>
      </div>

      <div className="shell mt-16">
        <hr className="rule" />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-3 pt-5 md:grid-cols-4">
          {hero.meta.map((item) => (
            <li key={item} className="t-mono text-[var(--muted)]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
