"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { ArrowIcon } from "@/components/ui/Icons";

/**
 * Stage 2C.2 coordination for the continuous Intro → Branding → Services
 * experience.
 *
 * StoryProvider wraps the whole experience grid and owns:
 * - `combined`: ONE Motion scroll progress across the entire run (story
 *   region + all six chapters), the single source every consumer derives
 *   from, so forward, reverse and scrollbar scrolling can never disagree;
 * - `bands`: measured chapter geometry (where the story hands over to
 *   chapter 01, and how much progress one chapter spans). Measured in an
 *   effect + ResizeObserver — layout is read on resize, never per frame;
 * - `enabled`: the shared immersive gate (min-width 1100 / min-height 680,
 *   matching the CSS variant), false under reduced motion.
 *
 * StoryCopy renders the left column's opening movement: the intro
 * headline established, then subordinated as "01 / BRANDING" emerges, with
 * the six-disciplines statement reduced to a small transitional cue. All
 * of it is real server-delivered HTML (client components still SSR); the
 * /about link never drops below readable opacity and never leaves the
 * document.
 */

type Bands = { firstCenterP: number; chapterFrac: number; storyEndP: number };

const StoryCtx = createContext<{
  combined: MotionValue<number> | null;
  bands: Bands | null;
  enabled: boolean;
}>({ combined: null, bands: null, enabled: false });

export const useStory = () => useContext(StoryCtx);

function useImmersiveGate() {
  const reduced = useReducedMotion();
  const [roomy, setRoomy] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1100px) and (min-height: 680px)");
    const update = () => setRoomy(mq.matches);
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return roomy && !reduced;
}

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const enabled = useImmersiveGate();
  const [bands, setBands] = useState<Bands | null>(null);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const ol = el.querySelector<HTMLElement>("[data-service-chapters]");
      const chapters = ol?.querySelectorAll("[data-service-chapter]").length ?? 0;
      if (!ol || chapters === 0) return;
      const wrapRect = el.getBoundingClientRect();
      const scrollSpan = wrapRect.height - window.innerHeight;
      if (scrollSpan <= 0) {
        setBands(null);
        return;
      }
      const olTop = ol.getBoundingClientRect().top - wrapRect.top;
      const chH = ol.getBoundingClientRect().height / chapters;
      /* Chapter k activates when its centre crosses the viewport centre. */
      const firstCenterP = (olTop + chH / 2 - window.innerHeight / 2) / scrollSpan;
      const chapterFrac = chH / scrollSpan;
      setBands({
        firstCenterP,
        chapterFrac,
        storyEndP: Math.max(0.02, firstCenterP - chapterFrac / 2),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <StoryCtx.Provider value={{ combined: scrollYProgress, bands, enabled }}>
      <div ref={wrapRef} className="relative">
        {children}
      </div>
    </StoryCtx.Provider>
  );
}

/* ── The left column's opening movement ─────────────────────────────── */

const INTRO_COPY =
  "We build visibility and demand as one connected system — brand, search, paid media, social, websites and apps, every channel amplifying the others. Each engagement is measured against cost per qualified lead, and if a channel is not earning its keep, we are the first to tell you.";

export function StoryCopy() {
  const { enabled } = useStory();
  const regionRef = useRef<HTMLDivElement>(null);

  /* Local progress across the pinned story region only: 0 at pin start,
     1 as the region releases into chapter 01. */
  const { scrollYProgress: p } = useScroll({
    target: regionRef,
    offset: ["start start", "end end"],
  });

  const headlineY = useTransform(p, [0, 0.7], [0, -46]);
  const headlineOpacity = useTransform(p, [0, 0.48, 0.72], [1, 1, 0]);
  const supportOpacity = useTransform(p, [0, 0.2, 0.5], [1, 1, 0.42]);
  const supportY = useTransform(p, [0, 0.7], [0, -24]);
  const cueOpacity = useTransform(p, [0.34, 0.5], [0, 1]);
  const chapterMarkOpacity = useTransform(p, [0.5, 0.68, 0.92, 1], [0, 1, 1, 0]);
  const chapterMarkY = useTransform(p, [0.5, 0.7], [28, 0]);

  const copyBlock = (
    <>
      <p className="t-mono flex items-center gap-3 text-[var(--muted)]">
        <span aria-hidden="true" className="h-px w-10 bg-accent" />
        Optara Digital
      </p>
      {/* Reworded 2026-08-04 on instruction: Optara sells both. */}
      <motion.h2
        className="t-display-lg mt-7 max-w-[14ch]"
        style={enabled ? { y: headlineY, opacity: headlineOpacity } : undefined}
      >
        The exposure you want.{" "}
        <span className="text-accent">The enquiries you need.</span>
      </motion.h2>
      <motion.div
        style={enabled ? { y: supportY, opacity: supportOpacity } : undefined}
      >
        <p className="mt-7 max-w-[36ch] text-[0.9375rem] leading-[1.8] text-ink/60">
          {INTRO_COPY}
        </p>
        <Link
          href="/about"
          className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
        >
          How we work
          <ArrowIcon
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </motion.div>

      {/* The six-disciplines statement, reduced to a transitional cue —
          the real section heading, no longer a full-screen stop. */}
      <motion.div
        className="mt-10 border-l border-[var(--hairline)] pl-5"
        style={enabled ? { opacity: cueOpacity } : undefined}
      >
        <h2 className="t-mono text-[var(--muted)]">The six disciplines</h2>
        <p className="mt-2 text-[0.9375rem] text-ink/60">
          One connected system for growth.
        </p>
      </motion.div>
    </>
  );

  if (!enabled) {
    return (
      <div ref={regionRef} data-story-region className="pb-14 pt-2">
        {copyBlock}
      </div>
    );
  }

  return (
    <div ref={regionRef} data-story-region className="relative h-[240vh]">
      <div className="sticky top-0 flex h-svh flex-col justify-center">
        {copyBlock}

        {/* The emerging chapter identity: decorative overlap typography —
            the REAL chapter 01 content follows in the ol immediately
            after, so this carries no unique information. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[16%] left-0"
          style={{ opacity: chapterMarkOpacity, y: chapterMarkY }}
        >
          <p className="t-mono text-accent">01 / 06</p>
          <p className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.02em]">
            Branding
          </p>
        </motion.div>
      </div>
    </div>
  );
}
