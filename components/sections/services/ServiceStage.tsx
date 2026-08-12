"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { OptaraSystem3D } from "@/components/sections/services/OptaraSystem3D";
import { BrandingScene } from "@/components/sections/services/scenes";
import {
  useProtoProgress,
  useStory,
} from "@/components/sections/services/story";

/**
 * The visual layer of the continuous experience (Stage 2C.3A): a
 * full-viewport sticky host for the persistent Three.js protagonist, no
 * longer a right-hand media column. The canvas is transparent over the
 * page's own tonal story (paper ramping into bone), carries no border,
 * radius, card or frame, and sits beneath the typography layer — the
 * object system is the centre of the experience and the copy orbits it.
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
 * the CSS variant) the Three system never mounts; a static resolved
 * scene stands in so the layer is never an empty void. The provisional
 * Branding MP4 is disabled from this desktop prototype — the files stay
 * in /public for later use.
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
  /* Rail emerges once Branding has essentially resolved (stateFloat ≈1 is
     protoP 0.5) and stays for the chapter run. */
  const railOpacity = useTransform(protoP, [0.46, 0.56], [0, 1]);

  return (
    <div ref={rootRef} aria-hidden="true" className="relative h-svh w-full">
      {/* The protagonist. Transparent canvas, no frame. */}
      <div className="absolute inset-0">
        {enabled ? (
          <OptaraSystem3D />
        ) : (
          /* Static resolved representation for reduced-motion desktops
             whose window still matches the immersive CSS variant. */
          <div className="mx-auto h-full w-full max-w-[64rem] pt-24 text-accent">
            <BrandingScene />
          </div>
        )}
      </div>

      {/* Progress rail, aligned to the shell so it sits under the copy
          column, clear of the floating Speak bubble bottom-right. */}
      <div className="shell relative h-full">
        <motion.div
          className="absolute bottom-8 left-[var(--gutter)] flex items-center gap-4"
          style={enabled ? { opacity: railOpacity } : undefined}
        >
          <p className="t-mono text-ink/60">
            {String(active + 1).padStart(2, "0")} / {String(names.length).padStart(2, "0")}
          </p>
          <div className="flex items-center gap-1.5">
            {names.map((name, i) => (
              <span
                key={name}
                className={`h-1 rounded-full transition-all duration-300 motion-reduce:transition-none ${
                  i === active ? "w-6 bg-accent" : "w-2.5 bg-ink/15"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
