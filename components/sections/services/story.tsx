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
// (useScroll powers the provider's combined progress; StoryCopy now derives
// from useStoryProgress instead of a second timeline.)
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

/**
 * The ONE story progress (Stage 2C.2A): 0..1 across the pinned story
 * region, derived from the provider's combined progress and the measured
 * story band. StoryCopy and ServiceStage both consume THIS hook, so the
 * typography and the stage share a single mathematical timeline and cannot
 * drift — in either scroll direction. Clamped, so every derived ramp holds
 * its end state through the chapter run.
 */
export function useStoryProgress() {
  const { combined, bands } = useStory();
  const bandsRef = useRef(bands);
  bandsRef.current = bands;
  return useTransform(() => {
    const b = bandsRef.current;
    const p = combined ? combined.get() : 0;
    if (!b) return 0;
    return Math.min(1, Math.max(0, p / b.storyEndP));
  });
}

/**
 * The 2C.3A prototype clock: 0..1 across Intro → Branding → SEO entry.
 * 0 at the top of the experience, 0.5 as Branding's chapter centres
 * (stateFloat 1 — the resolved lattice), 1 at the SEO chapter's centre
 * (stateFloat 2 — pathways established). Derived from the same combined
 * progress and measured bands as everything else: one canonical clock,
 * every consumer, both scroll directions.
 */
export function useProtoProgress() {
  const { combined, bands } = useStory();
  const bandsRef = useRef(bands);
  bandsRef.current = bands;
  return useTransform(() => {
    const b = bandsRef.current;
    const p = combined ? combined.get() : 0;
    if (!b) return 0;
    const end = b.firstCenterP + b.chapterFrac;
    if (end <= 0) return 0;
    return Math.min(1, Math.max(0, p / end));
  });
}

/**
 * The tonal story (2C.3B): one deliberate cinematic passage on the same
 * canonical clock. Paper through the intro, deepening to near-black
 * graphite as Branding resolves (the object's hero still sits on the
 * dark ground), opening back to bone as the system unfolds toward SEO —
 * where the section's own bone ground takes over, so the sticky release
 * is seamless. Flat colours only; foreground and accent flip in lockstep
 * so typography stays legible at every progress value, both directions.
 */
export function useTonalColors() {
  const p = useProtoProgress();
  const bg = useTransform(
    p,
    [0, 0.34, 0.44, 0.56, 0.68, 1],
    ["#F6F4EF", "#F6F4EF", "#191B21", "#191B21", "#EFECE4", "#EFECE4"],
  );
  const fg = useTransform(
    p,
    [0, 0.36, 0.44, 0.58, 0.66, 1],
    ["#12131A", "#12131A", "#F7F6F2", "#F7F6F2", "#12131A", "#12131A"],
  );
  const accentFg = useTransform(
    p,
    [0, 0.36, 0.44, 0.58, 0.66, 1],
    ["#5B3DF5", "#5B3DF5", "#8E7BFF", "#8E7BFF", "#5B3DF5", "#5B3DF5"],
  );
  return { bg, fg, accentFg };
}

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
  const { fg, accentFg } = useTonalColors();

  /* Shared story progress from the provider — the same value the stage
     consumes. Four phases (2C.2A): A intro 0–0.42 · B departure
     0.42–0.56 · C reveal 0.56–0.72 · D established 0.72–1. The outgoing
     state is ≥90% gone before the incoming large typography becomes
     prominent, so reverse scrolling replays a clean sequence — pure
     position functions, no direction state. */
  const p = useStoryProgress();

  const headlineY = useTransform(p, [0, 0.56], [0, -56]);
  const headlineOpacity = useTransform(p, [0, 0.42, 0.56], [1, 1, 0]);
  const supportOpacity = useTransform(p, [0, 0.42, 0.58], [1, 1, 0.1]);
  const supportY = useTransform(p, [0, 0.58], [0, -34]);
  /* The disciplines cue carries the departure phase, then clears before
     Branding establishes — nothing of the intro survives into phase D. */
  const cueOpacity = useTransform(p, [0.4, 0.5, 0.64, 0.72], [0, 1, 1, 0]);
  /* The transitional identity: index first, word follows (spec: the eye
     reads one editorial state giving way), both gone before the real
     chapter heading occupies this territory. */
  const markIndexOpacity = useTransform(p, [0.58, 0.64, 0.84, 0.92], [0, 1, 1, 0]);
  const markWordOpacity = useTransform(p, [0.62, 0.68, 0.84, 0.92], [0, 1, 1, 0]);
  const chapterMarkY = useTransform(p, [0.58, 0.7], [24, 0]);

  /* Colours ride the tonal story (text-current inherits the motion fg on
     the root; accent pieces take the AA-safe accent for the current
     ground). The flow fallback renders the same markup with static ink. */
  const copyBlock = (
    <>
      <p className="t-mono flex items-center gap-3 text-current opacity-60">
        <span aria-hidden="true" className="h-px w-10 bg-accent" />
        Optara Digital
      </p>
      {/* Reworded 2026-08-04 on instruction: Optara sells both. */}
      <motion.h2
        className="t-display-lg mt-7 max-w-[14ch]"
        style={enabled ? { y: headlineY, opacity: headlineOpacity } : undefined}
      >
        The exposure you want.{" "}
        <motion.span style={enabled ? { color: accentFg } : undefined} className="text-accent">
          The enquiries you need.
        </motion.span>
      </motion.h2>
      <motion.div
        style={enabled ? { y: supportY, opacity: supportOpacity } : undefined}
      >
        <p className="mt-7 max-w-[36ch] text-[0.9375rem] leading-[1.8] text-current opacity-70">
          {INTRO_COPY}
        </p>
        <Link
          href="/about"
          className="group mt-7 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
        >
          <motion.span
            style={enabled ? { color: accentFg } : undefined}
            className="inline-flex items-center gap-2"
          >
            How we work
            <ArrowIcon
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </motion.span>
        </Link>
      </motion.div>

      {/* The six-disciplines statement, reduced to a transitional cue —
          the real section heading, no longer a full-screen stop. */}
      <motion.div
        className="mt-10 border-l border-current/20 pl-5"
        style={enabled ? { opacity: cueOpacity } : undefined}
      >
        <h2 className="t-mono text-current opacity-60">The six disciplines</h2>
        <p className="mt-2 text-[0.9375rem] text-current opacity-70">
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
    <div ref={regionRef} data-story-region className="relative h-[200vh]">
      <motion.div
        className="sticky top-0 flex h-svh flex-col justify-center"
        style={{ color: fg }}
      >
        {copyBlock}

        {/* The transitional chapter identity: decorative overlap typography
            near the headline's own editorial anchor — the REAL chapter 01
            content follows in the ol immediately after, so this carries no
            unique information and clears before that h3 arrives. */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2"
          style={{ y: chapterMarkY }}
        >
          <motion.p
            className="t-mono"
            style={{ opacity: markIndexOpacity, color: accentFg }}
          >
            01 / 06
          </motion.p>
          <motion.p
            className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-medium leading-none tracking-[-0.02em]"
            style={{ opacity: markWordOpacity }}
          >
            Branding
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
