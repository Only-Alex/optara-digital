"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useTransform,
  type MotionValue,
} from "motion/react";
import { connectedSystem } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { RevealText } from "@/components/ui/RevealText";

// Geometry of the ring, in percentages of the diagram box. SEATS sit exactly
// on the ellipse below (cx/cy 50, rx 36, ry 34), spaced every 72 degrees from
// the top, so the CSS-positioned labels and the SVG line up at any aspect
// ratio. SCATTER is where each module starts: deliberately unaligned.
const SEATS = [
  { x: 50, y: 16 },
  { x: 84.24, y: 39.49 },
  { x: 71.16, y: 77.51 },
  { x: 28.84, y: 77.51 },
  { x: 15.76, y: 39.49 },
];

const SCATTER = [
  { x: 17, y: 11 },
  { x: 81, y: 8 },
  { x: 34, y: 52 },
  { x: 91, y: 63 },
  { x: 57, y: 91 },
];

type Box = { w: number; h: number };

type ModuleProps = {
  index: number;
  short: string;
  full: string;
  progress: MotionValue<number>;
  box: Box;
};

/** One labelled node. Owns its own transforms so the hooks stay unconditional. */
function Module({ index, short, full, progress, box }: ModuleProps) {
  const seat = SEATS[index];
  const start = SCATTER[index];

  // Positioned at the scattered spot and moved to its seat by transform alone,
  // so no layout runs per frame. Anchoring on the scattered spot also means an
  // unmeasured box (offsets of zero) still renders the correct opening state
  // rather than a blank or pre-solved diagram.
  const x = useTransform(
    progress,
    [0, 0.82],
    [0, ((seat.x - start.x) / 100) * box.w],
  );
  const y = useTransform(
    progress,
    [0, 0.82],
    [0, ((seat.y - start.y) / 100) * box.h],
  );
  // Motion cannot interpolate between var() strings, so these step at the
  // threshold; the CSS transition classes below turn the step into a fade.
  // Theme tokens rather than raw colours, so the section can change ground
  // without touching this file again.
  const dotTint = useTransform(
    progress,
    [0.5, 0.9],
    ["var(--hairline)", "var(--accent-fg)"],
  );
  const labelTint = useTransform(
    progress,
    [0.5, 0.9],
    ["var(--muted)", "var(--accent-fg)"],
  );
  const halo = useMotionTemplate`0 0 16px ${dotTint}`;

  return (
    <li
      className="absolute w-28 -translate-x-1/2 -translate-y-1/2 md:w-32"
      style={{ left: `${start.x}%`, top: `${start.y}%` }}
    >
      <motion.div
        className="flex flex-col items-center gap-3 text-center"
        style={{ x, y }}
      >
        <motion.span
          aria-hidden="true"
          className="block h-2.5 w-2.5 rounded-full transition-[background-color,box-shadow] duration-500"
          style={{ backgroundColor: dotTint, boxShadow: halo }}
        />
        <motion.span
          className="t-mono leading-tight transition-colors duration-500"
          style={{ color: labelTint }}
        >
          <span aria-hidden="true">{short}</span>
          <span className="sr-only">{full}</span>
        </motion.span>
      </motion.div>
    </li>
  );
}

function Diagram() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<Box>({ w: 0, h: 0 });

  const progress = useScrollProgress(boxRef, ["start 82%", "end 62%"]);
  const drawn = useTransform(progress, [0.12, 0.92], [0, 1]);
  const captionIn = useTransform(progress, [0.72, 1], [0, 1]);

  // Travel distances are in pixels, so the box has to be measured. Kept in
  // state rather than a ref because useTransform has to rebuild its output
  // range when the size changes. Measured synchronously on mount so the first
  // client paint is already correct; the observer only handles resizes after
  // that, and a browser that never delivers one leaves the diagram scattered
  // but fully legible rather than blank.
  useLayoutEffect(() => {
    const element = boxRef.current;
    if (!element) return;

    const apply = (width: number, height: number) =>
      setBox((current) =>
        current.w === width && current.h === height
          ? current
          : { w: width, h: height },
      );

    const rect = element.getBoundingClientRect();
    apply(rect.width, rect.height);

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      apply(width, height);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative mx-auto mt-16 aspect-[4/3] w-full max-w-3xl md:mt-20 md:aspect-[16/10]"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Soft halo behind the drawn ring. A contained glow on the dark
              ground — §3: direct attention, emotional impact — not an aurora
              wash; the blur stays within the ring's own neighbourhood. */}
          <filter id="cs-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.1" />
          </filter>
        </defs>
        <ellipse
          cx="50"
          cy="50"
          rx="36"
          ry="34"
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <motion.ellipse
          cx="50"
          cy="50"
          rx="36"
          ry="34"
          fill="none"
          stroke="var(--accent-fg)"
          strokeWidth="3"
          opacity="0.5"
          filter="url(#cs-glow)"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: drawn }}
        />
        <motion.ellipse
          cx="50"
          cy="50"
          rx="36"
          ry="34"
          fill="none"
          stroke="var(--accent-fg)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: drawn }}
        />
      </svg>

      <motion.p
        aria-hidden="true"
        className="t-mono absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--muted)]"
        style={{ opacity: captionIn }}
      >
        {connectedSystem.caption}
      </motion.p>

      <ul className="absolute inset-0">
        {connectedSystem.modules.map((module, index) => (
          <Module
            key={module.short}
            index={index}
            short={module.short}
            full={module.full}
            progress={progress}
            box={box}
          />
        ))}
      </ul>
    </div>
  );
}

/** Reduced motion, and every viewport below md, get the settled state as a list. */
function StaticList({ className }: { className: string }) {
  return (
    <ol className={className}>
      {connectedSystem.modules.map((module) => (
        <li key={module.short} className="relative pl-9">
          <span
            aria-hidden="true"
            className="absolute left-[3.5px] top-[7px] block h-2 w-2 rounded-full bg-[var(--accent-fg)]"
          />
          <span className="t-body">{module.full}</span>
        </li>
      ))}
    </ol>
  );
}

export function ConnectedSystem() {
  const reduced = useReducedMotion();

  return (
    // Ink: this is the homepage's mid-page dark moment now that Work has moved
    // to /case-studies. The ring draws in light on dark, which is where the
    // glow treatment earns its place.
    <section id="system" data-theme="ink" className="section">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <RevealText>
              <p className="t-mono text-[var(--muted)]">
                {connectedSystem.eyebrow}
              </p>
              <h2 className="t-display-lg mt-6 max-w-[20ch]">
                {connectedSystem.heading.lead}{" "}
                <span className="text-[var(--accent-fg)]">
                  {connectedSystem.heading.accent}
                </span>
              </h2>
            </RevealText>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <RevealText delay={0.1}>
              <p className="t-body text-[var(--muted)]">
                {connectedSystem.body}
              </p>
              <p className="t-body mt-5">{connectedSystem.secondary}</p>
            </RevealText>
          </div>
        </div>

        {reduced ? (
          <StaticList className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" />
        ) : (
          <>
            {/* The ring needs room to be legible; below md it becomes a list
                with the same reading order. */}
            <div className="hidden md:block">
              <Diagram />
            </div>
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <StaticList className="mt-12 grid gap-5 border-l border-[var(--hairline)] pl-1" />
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
