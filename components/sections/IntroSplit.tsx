"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { IdentityField } from "@/components/ui/IdentityField";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon } from "@/components/ui/Icons";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * The post-hero intro, redesigned as the opening move of one continuous
 * spatial sequence that runs straight into the Branding chapter.
 *
 * Composition: copy sits LEFT on the same column the service chapters use;
 * the IdentityField visual sits RIGHT, breaking out of the shell to the
 * viewport edge — the exact zone the services stage occupies. So the
 * hand-off is spatial, not decorative: the assembling system deepens and
 * recedes as the intro exits, the paper ground ramps into bone, and the
 * cinematic stage arrives in the same place the system just occupied.
 *
 * Scroll choreography (desktop scene, gate identical to the services gate —
 * min-width 1100px AND min-height 680px, so on any machine the two
 * sections agree about being immersive):
 * - the section deepens to 170vh and pins its stage;
 * - entry: copy and visual settle from below (transform only, opacity is
 *   never used to gate the copy);
 * - dwell: the field breathes on pointer parallax;
 * - exit: the visual deepens in perspective (IdentityField spreads its
 *   plane depths ~1.6× and pitches), lifts, and dissolves as the seam
 *   into Services begins; the copy drifts up more gently.
 *
 * Everything below the gate — phones, tablets, short viewports, reduced
 * motion, no JS — is a plain flow section: copy, then nothing pinned,
 * IdentityField only where it can be shown statically. The /about link and
 * every word render in the server HTML regardless.
 */

/** True only on viewports with room for the pinned stage, motion allowed.
 *  Same media condition as the services immersive gate on purpose. */
function useSceneEnabled() {
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

export function IntroSplit() {
  const sectionRef = useRef<HTMLElement>(null);
  const enabled = useSceneEnabled();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 0.3, 0.68, 1], [50, 0, 0, -28]);
  const fieldY = useTransform(scrollYProgress, [0, 0.3, 0.68, 1], [90, 0, 0, -70]);
  const fieldScale = useTransform(scrollYProgress, [0, 0.3, 0.68, 1], [0.94, 1, 1, 1.07]);
  const fieldOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 1, 0]);
  const cueScale = useTransform(scrollYProgress, [0.44, 0.66], [0, 1]);

  const copyStyle = enabled ? { y: copyY } : { y: 0 };
  const fieldStyle = enabled
    ? { y: fieldY, scale: fieldScale, opacity: fieldOpacity }
    : { y: 0, scale: 1, opacity: 1 };

  return (
    <section
      ref={sectionRef}
      data-theme="paper"
      className={
        enabled
          ? "relative h-[170vh] bg-[var(--bg)] text-[var(--fg)]"
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
        <div className="shell grid w-full items-center gap-14 lg:grid-cols-12 lg:gap-x-[clamp(2.5rem,4vw,5rem)]">
          <motion.div className="lg:col-span-5" style={copyStyle}>
            <RevealText>
              <p className="t-mono flex items-center gap-3 text-[var(--muted)]">
                <span aria-hidden="true" className="h-px w-10 bg-accent" />
                Optara Digital
              </p>
              {/* Reworded 2026-08-04 on instruction: Optara sells both.
                  Exposure first, enquiries as the pay-off. */}
              <h2 className="t-display-lg mt-7 max-w-[14ch]">
                The exposure you want.{" "}
                <span className="text-accent">The enquiries you need.</span>
              </h2>
            </RevealText>
            <RevealText delay={0.08}>
              <p className="mt-8 max-w-[40ch] text-[1.0625rem] leading-[1.75] text-ink/70">
                We build visibility and demand as one connected system — brand,
                search, paid media, social, websites and apps, every channel
                amplifying the others. Each engagement is measured against cost
                per qualified lead, and if a channel is not earning its keep, we
                are the first to tell you.
              </p>
              <Link
                href="/about"
                className="group mt-9 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-accent"
              >
                How we work
                <ArrowIcon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </RevealText>
          </motion.div>

          {/* The system, assembling in the zone the services stage will
              occupy. Breaks out of the shell to the viewport's right edge
              with the same margin recovery the stage uses. */}
          <motion.div
            className="hidden lg:col-span-7 lg:block lg:mr-[calc((min(100vw,1360px)-100vw)/2-var(--gutter))] lg:pl-6"
            style={fieldStyle}
          >
            <IdentityField progress={scrollYProgress} />
          </motion.div>
        </div>

        {/* The cue toward Services: a flat accent hairline drawing downward
            during the settled phase. Decorative; scene-only. */}
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
