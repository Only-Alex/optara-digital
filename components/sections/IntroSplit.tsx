"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { IntroSpatial } from "@/components/ui/IntroSpatial";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * The post-hero intro as an L2 spatial transition (Stage 2A).
 *
 * On a tall-enough desktop the section deepens to 130vh and its content
 * pins on a sticky full-viewport stage while scroll drives two transforms:
 * the 3D panel cluster enters slightly lower and smaller, settles into its
 * normal plane through the pinned dwell, then drifts gently past as the
 * section exits; the copy translates a few pixels on the same curve. A flat
 * accent hairline draws downward late in the scene as the cue toward the
 * services section. Transform-only per frame — opacity never gates the
 * copy, so everything is readable at every scroll position and without
 * JavaScript (the initial server render is the plain flow layout).
 *
 * Scene gate: `(min-width: 1024px) and (min-height: 800px)` and motion not
 * reduced. Everything else — phones, tablets, short desktop viewports
 * (1280x720, 1024x768), reduced motion, no JS — gets the ordinary flow
 * section unchanged from before this stage: natural document height, no
 * pinning, no scroll transforms, IntroSpatial's own fallbacks intact.
 *
 * Scroll reading is Motion's useScroll/useTransform only: rAF-batched,
 * Lenis-compatible, no scroll listeners, no per-frame React state.
 */

/** True only on viewports with room for the pinned stage, motion allowed. */
function useSceneEnabled() {
  const reduced = useReducedMotion();
  const [roomy, setRoomy] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 800px)");
    const update = () => setRoomy(mq.matches);
    update();
    /* Both signals on purpose: `change` is the canonical one, and `resize`
       covers environments where an emulated viewport updates mq.matches
       without dispatching the change event. update() only reads a cached
       boolean, so the extra listener costs nothing meaningful. */
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return roomy && !reduced;
}

export function IntroSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const enabled = useSceneEnabled();

  /* Progress 0→1 across the section's whole traversal of the viewport.
     The pinned dwell occupies the middle stops; the flat entry/exit tails
     keep the hand-off to normal scrolling seamless. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const clusterY = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [70, 0, 0, -44]);
  const clusterScale = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [0.92, 1, 1, 1]);
  const copyY = useTransform(scrollYProgress, [0, 0.35, 0.75, 1], [40, 0, 0, -20]);
  const cueScale = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);

  /* The gate swaps whole style objects rather than gating each value: motion
     values bound directly in `style` is the documented, reliably-subscribed
     path. When the scene is off — including the pre-hydration server render —
     the styles are identity constants, so the flow layout carries no offsets. */
  const clusterStyle = enabled ? { y: clusterY, scale: clusterScale } : { y: 0, scale: 1 };
  const copyStyle = enabled ? { y: copyY } : { y: 0 };

  return (
    <section
      ref={sectionRef}
      data-theme="paper"
      className={
        enabled
          ? "relative h-[130vh] bg-[var(--bg)] text-[var(--fg)]"
          : "section bg-[var(--bg)]"
      }
    >
      <div
        className={
          enabled
            ? "sticky top-0 flex h-svh items-center overflow-hidden"
            : undefined
        }
      >
        <div className="shell grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]">
          {/* Hidden below lg here as well as inside the component, so the
              empty grid child cannot add a phantom row and double gap. */}
          <motion.div className="hidden lg:col-span-5 lg:block" style={clusterStyle}>
            <IntroSpatial />
          </motion.div>

          <motion.div className="lg:col-span-6 lg:col-start-7" style={copyStyle}>
            <RevealText>
              <p className="t-mono text-[var(--muted)]">Optara Digital</p>
              {/* Reworded 2026-08-04 on instruction: the old line dismissed
                  exposure, and Optara sells both. Two balanced sentences —
                  exposure first, enquiries as the pay-off the accent lands on. */}
              <h2 className="t-display-lg mt-6 max-w-[20ch]">
                The exposure you want.{" "}
                <span className="text-accent">The enquiries you need.</span>
              </h2>
            </RevealText>
            <RevealText delay={0.08}>
              <p className="t-body-lg mt-7 max-w-[52ch] text-ink/75">
                We build visibility and demand together: brand, search, paid
                media, social, websites and apps working as one connected
                system, every channel amplifying the others. Growth moves in
                clear, deliberate phases, every engagement is measured against
                cost per qualified lead — and if a channel is not earning its
                keep, we are the first to tell you.
              </p>
              <Link
                href="/about"
                className="group mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
              >
                How we work
                <ArrowIcon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </RevealText>
          </motion.div>
        </div>

        {/* The cue toward Services: a flat accent hairline drawing downward
            late in the scene. Decorative only, and only meaningful while the
            stage is pinned, so it renders nothing when the scene is off. */}
        {enabled ? (
          <motion.span
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 h-14 w-px -translate-x-1/2 bg-accent"
            style={{ scaleY: cueScale, transformOrigin: "top" }}
          />
        ) : null}
      </div>
    </section>
  );
}
