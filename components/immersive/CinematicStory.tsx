"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useTransform } from "motion/react";
import { ENGINE_SEQUENCE } from "@/lib/cinematic/intelligenceEngineManifest";
import { createFramePlayer, type FramePlayer } from "@/lib/cinematic/framePlayer";
import { useProtoProgress, useStory } from "@/components/sections/services/story";

/**
 * The cinematic Optara Intelligence Engine (Stage 2E.1).
 *
 * Replaces the procedural Three.js renderer in the ACTIVE visual path
 * with the externally approved pre-rendered frame sequence. Same island
 * contract as the renderer it replaces: it mounts only when the shared
 * immersive gate is on, subscribes to the canonical `useProtoProgress`
 * clock (no scroll listener, no competing RAF loop of its own — the
 * player draws once per progress change), parks on
 * IntersectionObserver/visibilitychange, and tears down fully on
 * unmount. The frame player is a pure function of that one progress
 * value, so forward and reverse scrolling replay the identical film.
 *
 * Layering: the resolved-state poster sits beneath the canvas as the
 * permanent failure floor — before the first decode, on any fetch or
 * AVIF-decode failure, the poster shows and the layer is never blank.
 * The wrapper's opacity ramp is the page-integration treatment (and the
 * only treatment): a reveal under the hero exit and a fade to the
 * section's bone ground at the zone's release, mirroring the tonal
 * clock's own lightening. The artwork itself is untouched — no filters,
 * no blend modes, no overlays.
 */
export function CinematicStory() {
  const { enabled } = useStory();
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<FramePlayer | null>(null);
  const protoP = useProtoProgress();
  const protoPRef = useRef(0);

  /* Reveal beneath the hero exit; hold; release into the light section
     ground exactly where the tonal clock lightens (0.955–0.995). */
  const opacity = useTransform(protoP, [0, 0.08, 0.955, 0.995], [0, 1, 1, 0]);

  useMotionValueEvent(protoP, "change", (v) => {
    protoPRef.current = v;
    playerRef.current?.setProgress(v);
  });

  useEffect(() => {
    if (!enabled) return;
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const player = createFramePlayer(canvas);
    playerRef.current = player;
    if (!player) return; // 2D context unavailable → poster stands in
    player.setProgress(protoPRef.current);

    const onVisibility = () => {
      player.setRunning(!document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => player.setRunning(entry.isIntersecting && !document.hidden),
      { threshold: 0 },
    );
    observer.observe(host);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      player.destroy();
      playerRef.current = null;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0"
      style={{ opacity }}
    >
      {/* Failure floor: the approved resolved state. loading="lazy" keeps
          it un-fetched anywhere the layer is display:none. */}
      <picture>
        <source srcSet={ENGINE_SEQUENCE.posterAvif} type="image/avif" />
        <img
          src={ENGINE_SEQUENCE.posterWebp}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </motion.div>
  );
}
