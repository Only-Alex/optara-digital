"use client";

import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { SERVICE_SCENES } from "@/components/sections/services/scenes";
import { ServiceMedia } from "@/components/sections/services/ServiceMedia";
import { useStory } from "@/components/sections/services/story";

/**
 * The one persistent visual stage for the continuous Intro → Branding →
 * Services experience (Stage 2C.2).
 *
 * There is exactly one stage for the whole run. It pins at the top of the
 * experience and stays anchored while its CONTENT evolves through three
 * states, all derived from the StoryProvider's single combined progress:
 *
 * 1. STORY FIELD (intro established → system deepens): a deliberately
 *    simple placeholder of depth planes, identity fragments and the
 *    recurring signal line — infrastructure for the future art-directed
 *    Higgsfield intro media, not final art. A camera-push (differential
 *    scale per depth) makes the page feel like it travels into the scene;
 *    fragments converge toward the point where Branding resolves.
 * 2. REVEAL (discipline reveal → Branding resolution): the field dissolves
 *    while the chapter stack — Branding media on top — fades up in place.
 *    Same stage, same geometry; content transforms, nothing swaps boxes.
 * 3. CHAPTERS (Branding established → SEO and beyond): the existing
 *    scene-crossfade system continues exactly as approved in 2B/2C.1,
 *    driven by measured chapter bands from the same combined progress.
 *
 * Reversibility: every state is a pure function of scroll position (ramps
 * clamp and hold), so scrolling backwards replays the sequence exactly.
 * The reveal ramp sits on an outer layer; the chapter crossfade on inner
 * layers — they compose without fighting.
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

  /* Story progress: 0..1 across the pinned story region, clamped so every
     derived ramp holds its end state through the chapter run. */
  const storyP = useTransform(() => {
    const b = bandsRef.current;
    const p = combined ? combined.get() : 0;
    if (!b) return 0;
    return Math.min(1, Math.max(0, p / b.storyEndP));
  });

  /* The reveal: chapter stack (Branding media first) fades up as the story
     field dissolves. Holds at 1 forever after — reversible by scrubbing. */
  const revealOpacity = useTransform(storyP, [0.5, 0.68], [0, 1]);
  const fieldOpacity = useTransform(storyP, [0, 0.52, 0.7], [1, 1, 0]);

  /* Camera push: depth planes scale at different rates so the page reads
     as moving through the scene rather than objects sliding on it. */
  const zoomBack = useTransform(storyP, [0, 0.7], [1, 1.18]);
  const zoomMid = useTransform(storyP, [0, 0.7], [1, 1.34]);
  const zoomNear = useTransform(storyP, [0, 0.7], [1, 1.6]);
  const convergeX = useTransform(storyP, [0.12, 0.6], [0, -60]);
  const convergeY = useTransform(storyP, [0.12, 0.6], [0, 34]);
  /* Hoisted (never conditional): hooks must not live inside the
     enabled-gated JSX branch. */
  const convergeXInv = useTransform(convergeX, (v) => -v);
  const convergeYInv = useTransform(convergeY, (v) => -v);

  /* Chapter-run depth: token scale/lift. Never above 1 — the stage's right
     edge sits on the viewport edge, so any overscale leaks scrollWidth. */
  const depthScale = useTransform(combined!, [0, 0.5, 1], [0.985, 1, 1]);
  const depthY = useTransform(combined!, [0, 0.5, 1], [10, 0, -8]);

  return (
    <div ref={rootRef} aria-hidden="true" className="h-full">
      <div data-service-stage className="sticky top-[6.5rem]">
        <motion.div
          style={enabled ? { scale: depthScale, y: depthY } : undefined}
          className="relative h-[calc(100svh-7.5rem)] overflow-hidden"
        >
          {/* Directional masks: strongest dissolve on the left where the
              typography sits; the right edge stays solid so the world
              continues past the viewport. */}
          <div className="absolute inset-0 [mask-image:linear-gradient(to_right,transparent,black_14%)]">
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]">
              {/* STATE 3 — the chapter stack, revealed once Branding
                  resolves and persistent from then on. */}
              <motion.div
                className="absolute inset-0"
                style={enabled ? { opacity: revealOpacity } : undefined}
              >
                {SERVICE_SCENES.map((Scene, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                      i === active
                        ? "translate-y-0 scale-100 opacity-100"
                        : i < active
                          ? "-translate-y-4 scale-[1.015] opacity-0"
                          : "translate-y-5 scale-[0.985] opacity-0"
                    }`}
                  >
                    {i === 0 && enabled ? (
                      <ServiceMedia
                        src="/media/services/branding.mp4"
                        poster="/media/services/branding-poster.jpg"
                      />
                    ) : (
                      <Scene />
                    )}
                  </div>
                ))}
              </motion.div>

              {/* STATES 1–2 — the story field. Placeholder infrastructure
                  for the future intro media: depth planes, fragments, the
                  recurring signal. Dissolves into the reveal. */}
              {enabled ? (
                <motion.div
                  className="absolute inset-0"
                  style={{ opacity: fieldOpacity }}
                >
                  <motion.div
                    className="absolute left-[6%] top-[10%] h-[64%] w-[58%] rounded-[20px] border border-[var(--hairline)] bg-paper/60 shadow-[0_28px_80px_rgba(18,19,26,0.06)]"
                    style={{ scale: zoomBack }}
                  />
                  <motion.svg
                    viewBox="0 0 900 640"
                    className="absolute inset-0 h-full w-full"
                    style={{ scale: zoomMid }}
                  >
                    <line x1="60" y1="520" x2="840" y2="520" stroke="rgba(18,19,26,0.14)" />
                    <g className="text-accent">
                      <path
                        d="M40 330 C 240 330 420 290 560 300 S 780 330 800 330"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        opacity="0.7"
                      />
                      <circle cx="800" cy="330" r="18" fill="none" stroke="currentColor" opacity="0.4" />
                      <circle cx="800" cy="330" r="5.5" fill="currentColor" />
                    </g>
                  </motion.svg>
                  <motion.div
                    className="absolute right-[16%] top-[18%] h-16 w-16 rounded-full border border-accent/50"
                    style={{ scale: zoomNear, x: convergeX, y: convergeY }}
                  />
                  <motion.div
                    className="absolute left-[24%] bottom-[18%] h-3 w-3 bg-accent"
                    style={{ scale: zoomNear, x: convergeXInv, y: convergeYInv }}
                  />
                  <motion.div
                    className="absolute left-[46%] top-[6%] h-16 w-px bg-[var(--hairline)]"
                    style={{ scale: zoomMid }}
                  />
                </motion.div>
              ) : null}
            </div>
          </div>

          {/* Chapter UI, emerging with the reveal: active-service label and
              the 01–06 progress rail. Same state as the scenes. */}
          <motion.div style={enabled ? { opacity: revealOpacity } : undefined}>
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="t-mono absolute right-6 top-3 text-ink/55"
            >
              {String(active + 1).padStart(2, "0")} — {names[active]}
            </motion.p>
            <div className="absolute bottom-2 left-2 flex items-center gap-4">
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
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
