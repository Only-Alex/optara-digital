"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { CinematicStory } from "@/components/immersive/CinematicStory";
import { ENGINE_SEQUENCE } from "@/lib/cinematic/intelligenceEngineManifest";
import {
  useProtoProgress,
  useStory,
  useTonalColors,
} from "@/components/sections/services/story";

/**
 * The visual layer of the continuous experience: a full-viewport sticky
 * host for the cinematic Optara Intelligence Engine (Stage 2E.1 — the
 * externally approved pre-rendered frame sequence, which replaced the
 * procedural Three.js renderer in the active path). The frame canvas
 * carries no border, radius, card or frame, and sits beneath the
 * typography layer — the engine is the centre of the experience and the
 * copy orbits it.
 *
 * This layer keeps only one piece of HTML UI: the 01–06 progress rail,
 * fading in as Branding resolves (the transitional chapter identity in
 * StoryCopy is the single visible heading during the handoff, so the old
 * top-right text label is gone — one chapter identity at a time).
 *
 * Active-chapter tracking is unchanged from the approved architecture:
 * the provider's combined progress against measured chapter bands.
 *
 * Under reduced motion (or below the gate on a window that still matches
 * the CSS variant) no frame sequence is fetched or scrubbed; the
 * approved resolved-state poster stands in so the layer is never an
 * empty void.
 */
export function ServiceStage({ names }: { names: string[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { combined, bands, enabled } = useStory();
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const bandsRef = useRef(bands);
  bandsRef.current = bands;

  useMotionValueEvent(combined!, "change", (p) => {
    const b = bandsRef.current;
    if (!b) return;
    const idx = Math.min(
      names.length - 1,
      Math.max(0, Math.round((p - b.firstCenterP) / b.chapterFrac)),
    );
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  });

  const protoP = useProtoProgress();
  /* Rail emerges as Branding resolves, then leaves WITH the dark world
     (2E.1A): it belongs to the cinematic passage, so it must never float
     over the light released stage as if a scene were still pending. */
  const railOpacity = useTransform(protoP, [0.72, 0.82, 0.93, 0.97], [0, 1, 1, 0]);
  const { bg, fg, accentFg } = useTonalColors();

  return (
    <div ref={rootRef} data-service-stage aria-hidden="true" className="relative h-svh w-full">
      {/* The tonal ground: one flat cinematic passage (paper → graphite
          at Branding → bone toward SEO) on the same canonical clock. */}
      {enabled ? (
        <motion.div className="absolute inset-0" style={{ backgroundColor: bg }} />
      ) : null}

      {/* The protagonist. Frame canvas, no frame chrome. */}
      <div className="absolute inset-0">
        {enabled ? (
          <CinematicStory />
        ) : (
          /* Static resolved poster for reduced-motion desktops whose
             window still matches the immersive CSS variant. Held to the
             right of the layer with a soft page-integration edge so the
             left column's ink copy stays on the section's own light
             ground (the tonal dark passage never runs under reduced
             motion). loading="lazy" keeps it un-fetched where the layer
             is display:none. */
          <div className="absolute inset-y-0 right-0 w-[58%] [mask-image:linear-gradient(to_right,transparent,black_22%)]">
            <picture>
              <source srcSet={ENGINE_SEQUENCE.posterAvif} type="image/avif" />
              <img
                src={ENGINE_SEQUENCE.posterWebp}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        )}
      </div>

      {/* Progress rail, aligned to the shell so it sits under the copy
          column, clear of the floating Speak bubble bottom-right. */}
      <div className="shell relative h-full">
        <motion.div
          className="absolute bottom-8 left-[var(--gutter)] flex items-center gap-4"
          style={enabled ? { opacity: railOpacity, color: fg } : undefined}
        >
          <p className="t-mono text-current opacity-70">
            {String(active + 1).padStart(2, "0")} / {String(names.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1.5">
            {names.map((name, i) =>
              i === active ? (
                <motion.span
                  key={name}
                  className="h-1 w-6 rounded-full bg-accent"
                  style={enabled ? { backgroundColor: accentFg } : undefined}
                />
              ) : (
                <span
                  key={name}
                  className="h-1 w-2.5 rounded-full bg-current opacity-25"
                />
              ),
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
