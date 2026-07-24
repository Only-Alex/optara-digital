"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import { work } from "@/lib/content";
import type { CaseStudy } from "@/lib/content";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";

function CasePanel({
  study,
  variant,
}: {
  study: CaseStudy;
  variant: "panel" | "stack";
}) {
  const isPanel = variant === "panel";

  return (
    <article
      className={
        isPanel
          ? "group flex h-full w-[47svh] shrink-0 flex-col gap-5"
          : "group flex w-full max-w-[34rem] flex-col gap-5"
      }
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden bg-white/5 ${
          isPanel ? "h-[70%]" : "aspect-[4/5]"
        }`}
      >
        <Image
          src={study.image}
          alt={study.alt}
          fill
          sizes="(min-width: 1024px) 460px, (min-width: 640px) 60vw, 100vw"
          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <span className="t-mono absolute bottom-4 left-4 text-paper opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View case →
        </span>
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
    </article>
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
        <p className="t-mono text-[var(--muted)]">{work.eyebrow}</p>
        <h2 className="t-display-lg mt-6 max-w-[16ch]">{work.title}</h2>
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
        <div className="shell mt-16 flex flex-col gap-20 pb-[var(--section-y)]">
          {work.cases.map((study) => (
            <CasePanel key={study.index} study={study} variant="stack" />
          ))}
        </div>
      )}
    </section>
  );
}
