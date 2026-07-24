"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import { EASE } from "@/lib/motion";
import { work } from "@/lib/content";
import type { CaseStudy } from "@/lib/content";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { RevealGroup, RevealItem, RevealText } from "@/components/ui/RevealText";

function CasePanel({
  study,
  variant,
}: {
  study: CaseStudy;
  variant: "panel" | "stack";
}) {
  const isPanel = variant === "panel";

  return (
    <motion.article
      className={
        isPanel
          ? "flex h-full w-[47svh] shrink-0 flex-col gap-5"
          : "flex w-full max-w-[34rem] flex-col gap-5"
      }
      initial="rest"
      animate="rest"
      whileHover="hover"
      data-cursor="View case"
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden bg-white/5 ${
          isPanel ? "h-[70%]" : "aspect-[4/5]"
        }`}
      >
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <Image
            src={study.image}
            alt={study.alt}
            fill
            sizes="(min-width: 1024px) 460px, (min-width: 640px) 60vw, 100vw"
            className="object-cover"
          />
        </motion.div>
        <motion.span
          className="t-mono absolute bottom-4 left-4 text-paper"
          variants={{
            rest: { opacity: 0, y: 8 },
            hover: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3, ease: EASE }}
        >
          View case →
        </motion.span>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-[var(--hairline)] pt-4">
        <h3 className="t-display-md">{study.client}</h3>
        <span className="t-mono text-[var(--muted)]">{study.index}</span>
      </div>

      <p className="t-mono text-[var(--muted)]">{study.sector}</p>
      <p className="t-body-lg">{study.result}</p>
      {!isPanel && (
        <p className="t-caption max-w-[42ch] text-[var(--muted)]">{study.detail}</p>
      )}
    </motion.article>
  );
}

export function Work() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const reduced = useReducedMotion();
  const horizontal = isDesktop && !reduced;

  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    if (!horizontal) {
      setDistance(0);
      return;
    }

    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(track.scrollWidth - window.innerWidth, 0));
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [horizontal]);

  const scrollYProgress = useScrollProgress(outerRef, ["start start", "end end"]);
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section id="work" data-theme="dark" className="bg-[var(--bg)] text-[var(--fg)]">
      <div className="shell pt-[var(--section-y)]">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{work.eyebrow}</p>
        </RevealText>
        <RevealText delay={0.1}>
          <h2 className="t-display-lg mt-6 max-w-[16ch]">{work.title}</h2>
        </RevealText>
      </div>

      {horizontal ? (
        <div
          ref={outerRef}
          style={{ height: `calc(100svh + ${distance}px)` }}
          className="relative mt-20"
        >
          <div className="sticky top-0 flex h-svh items-center overflow-hidden">
            <motion.div
              ref={trackRef}
              style={{ x }}
              className="flex h-[84svh] w-max gap-[clamp(2rem,4vw,5rem)] px-[var(--gutter)]"
            >
              {work.cases.map((study) => (
                <CasePanel key={study.index} study={study} variant="panel" />
              ))}
            </motion.div>
          </div>
        </div>
      ) : (
        <RevealGroup
          className="shell mt-16 flex flex-col gap-20 pb-[var(--section-y)]"
          stagger={0.12}
          soft
        >
          {work.cases.map((study) => (
            <RevealItem key={study.index}>
              <CasePanel study={study} variant="stack" />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </section>
  );
}
