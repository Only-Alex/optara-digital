/**
 * Manifest for the approved Optara Intelligence Engine cinematic frame
 * sequence (Stage 2E.1).
 *
 * The artwork is 180 externally rendered production frames extracted from
 * five approved 16:9 transition renders — Hero Exit → Engine Reveal →
 * Audience Intelligence → Data Routing → Brand/Content Organisation →
 * Branding Resolved — 36 frames per transition, in strict chronological
 * order. The browser never re-times or re-interprets the film: scroll
 * progress maps deterministically onto a frame index and nothing else.
 *
 * Chapter bands are STORY-PROGRESS proportions on the canonical
 * `useProtoProgress` clock (the same clock that drives the HTML
 * choreography in story.tsx), tuned against the existing copy timing:
 * the routing energy peak plays while the intro headline clears
 * (headline is gone by storyP 0.56), organisation plays under the
 * transitional Branding identity, and the resolved state holds through
 * the chapter dwell so it can be read. The final band pins the resolved
 * frame — a deliberate rest, not a missing segment.
 */

export type CinematicChapter = {
  name: string;
  /** [start, end] on the 0..1 proto progress clock. Bands tile [0, 1]. */
  p: [number, number];
  /** [first, last] global frame index for this band (inclusive). */
  f: [number, number];
};

export const ENGINE_SEQUENCE = {
  frameCount: 180,
  width: 1600,
  height: 900,
  posterAvif: "/media/intelligence-engine/poster.avif",
  posterWebp: "/media/intelligence-engine/poster.webp",
  framePath: (index: number) =>
    `/media/intelligence-engine/frames/frame-${String(index).padStart(3, "0")}.avif`,
  chapters: [
    { name: "Hero Exit → Engine Reveal", p: [0, 0.12], f: [0, 35] },
    { name: "Engine Reveal → Audience Intelligence", p: [0.12, 0.28], f: [36, 71] },
    { name: "Audience Intelligence → Data Routing", p: [0.28, 0.47], f: [72, 107] },
    { name: "Data Routing → Brand Organisation", p: [0.47, 0.67], f: [108, 143] },
    { name: "Brand Organisation → Branding Resolved", p: [0.67, 0.87], f: [144, 179] },
    { name: "Branding Resolved (dwell)", p: [0.87, 1], f: [179, 179] },
  ] satisfies CinematicChapter[] as CinematicChapter[],
} as const;

export type EngineSequence = typeof ENGINE_SEQUENCE;

/**
 * The one canonical progress → frame mapping. Piecewise-linear across the
 * chapter bands, clamped at both ends. A pure function of progress: the
 * same value always returns the same frame, forward and reverse, so the
 * player can never accumulate directional state.
 */
export function progressToFrame(progress: number): number {
  const p = Math.min(1, Math.max(0, progress));
  const chapters = ENGINE_SEQUENCE.chapters;
  for (let i = 0; i < chapters.length; i++) {
    const { p: [p0, p1], f: [f0, f1] } = chapters[i];
    if (p <= p1 || i === chapters.length - 1) {
      const t = p1 === p0 ? 0 : (p - p0) / (p1 - p0);
      const frame = Math.round(f0 + Math.min(1, Math.max(0, t)) * (f1 - f0));
      return Math.min(ENGINE_SEQUENCE.frameCount - 1, Math.max(0, frame));
    }
  }
  return ENGINE_SEQUENCE.frameCount - 1;
}
