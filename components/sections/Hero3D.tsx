"use client";

import { useEffect, useRef } from "react";
import { hero } from "@/lib/content";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { Button } from "@/components/ui/Button";
import { Marquee } from "@/components/ui/Marquee";
import { Wordmark } from "@/components/ui/Wordmark";
import type { HeroFieldHandle } from "@/components/three/heroField";

/**
 * The interactive 3D hero: server-readable copy over a brand-coloured
 * three.js particle landscape that lifts and brightens around the cursor.
 *
 * Ordering is deliberate. The headline, standfirst and CTAs are plain markup
 * rendered before any script arrives; three.js loads afterwards via a dynamic
 * import inside useEffect, so the ~130KB gzip of 3D never blocks first paint
 * and never reaches any other route's bundle. If WebGL is unavailable or the
 * context dies, the CSS backdrop underneath simply remains — the hero loses a
 * flourish, never its content.
 *
 * Keeps id="top": the floating "Speak to us" bubble watches that element to
 * decide when the hero has left the viewport, and this hero inherits the
 * contract from the one it replaces.
 *
 * The bottom marquee carries the four genuine commitments. The reference site
 * runs an awards strip here; Optara has no verified awards, and this project
 * does not invent credibility — the commitments are the honest equivalent.
 */
const COMMITMENTS = [
  "No long lock-ins",
  "Live within thirty days",
  "You own the work",
  "Reply within two working days",
];

export function Hero3D() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let handle: HeroFieldHandle | null = null;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

    import("@/components/three/heroField").then(({ createHeroField }) => {
      if (cancelled) return;
      handle = createHeroField(stage, { reducedMotion: reduced, coarsePointer });
      if (!handle) return;

      // Pause the loop when the hero scrolls away or the tab hides.
      observer = new IntersectionObserver(
        ([entry]) => handle?.setRunning(entry.isIntersecting && !document.hidden),
        { threshold: 0 },
      );
      observer.observe(stage);
      document.addEventListener("visibilitychange", onVisibility);
    });

    function onVisibility() {
      handle?.setRunning(!document.hidden);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      handle?.destroy();
    };
  }, [reduced]);

  return (
    <section
      id="top"
      data-theme="paper"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[var(--bg)]"
    >
      {/* CSS backdrop: present before three arrives and forever if it cannot.
          A soft brand glow low in the frame, where the particle field lives. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[62%] h-[46rem] w-[110rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(91,61,245,0.14),rgba(43,127,255,0.07)_55%,transparent_75%)]"
      />

      {/* Ghost wordmark, as the outgoing hero used it — the brand gesture the
          footer answers in reverse. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[16%] flex justify-center overflow-hidden"
      >
        <Wordmark
          display
          className="whitespace-nowrap text-[clamp(6rem,17vw,17rem)] text-ink/[0.04]"
        />
      </div>

      {/* The three.js stage fills the hero behind the copy. */}
      <div ref={stageRef} aria-hidden="true" className="absolute inset-0" />

      {/* Scroll cue, reference-style: vertical, hairline, quiet. */}
      <p
        aria-hidden="true"
        className="t-mono absolute left-6 top-1/2 hidden -translate-y-1/2 rotate-180 text-[var(--muted)] [writing-mode:vertical-rl] lg:block"
      >
        Scroll down
      </p>

      {/* A soft paper veil between the field and the copy: the particles stay
          visible around and beneath the text block, but never compete with
          the words themselves. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] h-[38rem] w-[60rem] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(255,255,255,0.9),rgba(255,255,255,0.55)_55%,transparent_78%)]"
      />

      {/* Copy: centred, above the canvas, readable before any JS. */}
      <div className="shell relative z-10 flex flex-1 flex-col items-center justify-center pb-24 pt-36 text-center md:pt-40">
        <p className="t-mono inline-flex items-center gap-2.5 rounded-full border border-[var(--hairline)] bg-paper/70 px-4 py-2 text-[var(--muted)] backdrop-blur-sm">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
          {hero.eyebrow}
        </p>

        <h1 className="t-display-xl mt-8 max-w-[16ch]">
          {/* The logo gradient carries the accent line: blue → violet →
              purple, exactly the mark's own ramp. */}
          <span className="block bg-[linear-gradient(92deg,#2B7FFF_0%,#5B3DF5_52%,#7B2FF7_100%)] bg-clip-text text-transparent">
            {hero.headline.accent}
          </span>
          <span className="block">{hero.headline.rest}</span>
        </h1>

        <p className="t-body-lg mt-8 max-w-[52ch] text-ink/75">
          {hero.standfirst}
        </p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
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
        </div>
      </div>

      {/* The commitments strip: the honest counterpart to the reference's
          awards marquee. Sits on the hero's bottom edge, above the canvas. */}
      <div className="relative z-10 border-t border-[var(--hairline)] bg-paper/60 py-5 backdrop-blur-sm">
        <Marquee items={COMMITMENTS} speed={32} />
      </div>
    </section>
  );
}
