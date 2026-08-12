"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Decorative cinematic media for the service stage (Stage 2C.1) — the
 * smallest component that can own a stage video correctly, not a media
 * framework.
 *
 * Behaviour:
 * - autoplay, muted, looped, playsInline, no controls — Safari's full
 *   autoplay requirement set;
 * - poster set on the element, so the frame before readiness is the
 *   art-directed still rather than a blank flash;
 * - preload="metadata" until the section is near; one tiny
 *   IntersectionObserver (media lifecycle only, never scroll
 *   storytelling) plays the clip when the stage is on or near screen and
 *   pauses it once it is clearly gone (±25% viewport margin), so an
 *   8.7MB-master-derived 2.3MB loop never spins pixels nobody sees;
 * - pointer-events none and aria-hidden — the video is scenery; every
 *   real word and link lives in the chapter column's HTML;
 * - under prefers-reduced-motion the video element is never rendered at
 *   all: the poster ships as a plain static image, which also covers
 *   Safari Low Power Mode's autoplay refusal by making stillness the
 *   designed state rather than a failure.
 */
export function ServiceMedia({ src, poster }: { src: string; poster: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* Autoplay refusal (e.g. Low Power Mode) leaves the poster. */
          });
        } else {
          video.pause();
        }
      },
      { rootMargin: "25% 0px 25% 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  if (reduced) {
    return (
      // Fixed local decorative frame; the optimisation pipeline buys
      // nothing here.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        className="pointer-events-none h-full w-full object-cover"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      className="pointer-events-none h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
}
