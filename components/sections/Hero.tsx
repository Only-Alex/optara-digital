"use client";

import { motion } from "motion/react";
import { EASE, hoverTransition } from "@/lib/motion";
import { hero } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";

const rise = (delay: number, distance = 16) => ({
  initial: { opacity: 0, y: distance },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
});

export function Hero() {
  const reduced = useReducedMotion();
  const anim = (delay: number, distance?: number) =>
    reduced ? {} : rise(delay, distance);

  return (
    <section
      id="top"
      data-theme="light"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden bg-paper"
    >
      <div className="absolute inset-0 z-0 grid place-items-center">
        <motion.div
          className="relative h-[80%] w-[80%] overflow-hidden bg-fog md:h-full md:w-full"
          initial={reduced ? undefined : { opacity: 0, scale: 1.05 }}
          animate={reduced ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
        >
          {reduced ? (
            <div className="h-full w-full bg-fog" />
          ) : (
            <video
              className="h-full w-full object-cover grayscale contrast-[1.08]"
              src={hero.video.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={hero.video.label}
            />
          )}
        </motion.div>
      </div>

      <div aria-hidden="true" className="h-24" />

      <motion.div
        className="relative z-30 w-full bg-[linear-gradient(to_top,#ffffff_0%,rgba(255,255,255,0.82)_50%,transparent_100%)] pt-40"
        initial={reduced ? undefined : { opacity: 0, y: 20 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.5 }}
      >
        <div className="shell flex flex-col gap-12 pb-10 md:flex-row md:items-end md:justify-between md:gap-16">
          <div className="max-w-[52rem]">
            <motion.p
              className="flex items-center gap-3 text-[13px] text-ink/55"
              {...anim(0.6)}
            >
              <span
                aria-hidden="true"
                className="inline-block h-2 w-2 rounded-full bg-ink"
              />
              {hero.subtitle}
            </motion.p>

            <motion.h1 className="t-display-lg mt-6" {...anim(0.8, 20)}>
              {hero.lines.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.map((word, wordIndex) =>
                    word.italic ? (
                      <em key={wordIndex} className="italic">
                        {word.text}
                      </em>
                    ) : (
                      <span key={wordIndex}>{word.text}</span>
                    ),
                  )}
                </span>
              ))}
            </motion.h1>

            <motion.div className="mt-10 flex flex-wrap gap-3" {...anim(1)}>
              {hero.actions.map((action) => (
                <MagneticButton
                  key={action.href}
                  href={action.href}
                  cursorLabel={action.primary ? "Work" : "Process"}
                  hoverStyle={
                    action.primary
                      ? { backgroundColor: "#1B32FF" }
                      : { borderColor: "#1B32FF", color: "#1B32FF" }
                  }
                  className={
                    action.primary
                      ? "rounded-full bg-ink px-6 py-3 text-[13px] text-paper"
                      : "rounded-full border border-ink/35 px-6 py-3 text-[13px]"
                  }
                >
                  {action.label}
                </MagneticButton>
              ))}
            </motion.div>
          </div>

          <motion.ul className="flex flex-wrap gap-2" {...anim(1.1)}>
            {hero.tags.map((tag) => (
              <motion.li
                key={tag}
                className="rounded-full border border-ink/12 bg-paper px-4 py-2 text-[11px]"
                whileHover={{ borderColor: "#1B32FF", color: "#1B32FF", y: -3 }}
                transition={hoverTransition}
              >
                {tag}
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </section>
  );
}
