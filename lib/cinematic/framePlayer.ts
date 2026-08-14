/**
 * Imperative canvas player for the approved cinematic frame sequence
 * (Stage 2E.1). Zero React, zero scroll listeners, zero animation loops:
 * the owning component pushes the canonical story progress in via
 * `setProgress`, and the player's only job is to have the matching frame
 * on the canvas. Everything is a pure function of that progress — no
 * direction detection, no playback queue, no rewind mode.
 *
 * Decode strategy: frames are fetched and decoded to ImageBitmap
 * (off-main-thread where supported) inside a rolling window around the
 * current frame (WINDOW_BACK / WINDOW_FWD). Bitmaps that fall outside
 * EVICT_RADIUS are closed immediately, so repeated full-page
 * forward/reverse passes hold a bounded decoded set instead of climbing.
 * Encoded bytes for the rest of the sequence are warmed into the HTTP
 * cache by a low-priority background prefetch, one request at a time,
 * so a fast scrollbar jump lands on cache instead of the network.
 *
 * Frame-miss behaviour: if the exact frame is not decoded yet, the
 * nearest decoded neighbour is drawn and the exact frame replaces it as
 * soon as its decode resolves — the canvas never clears, never flashes
 * black, and the poster underneath covers the moments before the very
 * first decode.
 */

import {
  ENGINE_SEQUENCE,
  progressToFrame,
} from "@/lib/cinematic/intelligenceEngineManifest";

export type FramePlayer = {
  setProgress(progress: number): void;
  setRunning(running: boolean): void;
  destroy(): void;
};

const WINDOW_BACK = 8;
const WINDOW_FWD = 14;
const EVICT_RADIUS = 18;
const MAX_CONCURRENT_FETCHES = 6;
const DPR_CAP = 1.5;

type Decoded = ImageBitmap | HTMLImageElement;

export function createFramePlayer(canvas: HTMLCanvasElement): FramePlayer | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const abort = new AbortController();
  const decoded = new Map<number, Decoded>();
  const pending = new Set<number>();
  const failed = new Set<number>();
  const queue: number[] = [];
  let activeFetches = 0;
  let currentFrame = 0;
  let drawnFrame = -1;
  let rafId = 0;
  let running = true;
  let destroyed = false;
  let prefetchCursor = 0;
  let prefetching = false;

  /* ── decode pipeline ──────────────────────────────────────────────── */

  const decodeBlob = async (blob: Blob): Promise<Decoded> => {
    if (typeof createImageBitmap === "function") {
      return createImageBitmap(blob);
    }
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    try {
      await img.decode();
    } finally {
      URL.revokeObjectURL(img.src);
    }
    return img;
  };

  const release = (frame: number) => {
    const bmp = decoded.get(frame);
    if (bmp && "close" in bmp) bmp.close();
    decoded.delete(frame);
  };

  const pump = () => {
    while (activeFetches < MAX_CONCURRENT_FETCHES && queue.length > 0) {
      const frame = queue.shift()!;
      if (decoded.has(frame) || pending.has(frame) || failed.has(frame)) continue;
      if (Math.abs(frame - currentFrame) > EVICT_RADIUS) continue; // stale request
      pending.add(frame);
      activeFetches++;
      fetch(ENGINE_SEQUENCE.framePath(frame), { signal: abort.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`frame ${frame}: ${res.status}`);
          return res.blob();
        })
        .then(decodeBlob)
        .then((bmp) => {
          if (destroyed) {
            if ("close" in bmp) bmp.close();
            return;
          }
          decoded.set(frame, bmp);
          if (frame === currentFrame) scheduleDraw();
        })
        .catch(() => {
          /* Failed frames are remembered so we do not hammer the network;
             the nearest decoded neighbour keeps the canvas alive. */
          if (!destroyed) failed.add(frame);
        })
        .finally(() => {
          pending.delete(frame);
          activeFetches--;
          if (!destroyed) pump();
        });
    }
  };

  const ensureWindow = () => {
    /* Priority: exact frame, then forward frames nearest-first, then
       reverse frames nearest-first. Symmetric enough to serve both scroll
       directions without any directional state. */
    queue.length = 0;
    const want = (frame: number) => {
      if (frame < 0 || frame >= ENGINE_SEQUENCE.frameCount) return;
      if (!decoded.has(frame) && !pending.has(frame) && !failed.has(frame)) {
        queue.push(frame);
      }
    };
    want(currentFrame);
    for (let d = 1; d <= WINDOW_FWD; d++) {
      want(currentFrame + d);
      if (d <= WINDOW_BACK) want(currentFrame - d);
    }
    for (const frame of decoded.keys()) {
      if (Math.abs(frame - currentFrame) > EVICT_RADIUS) release(frame);
    }
    pump();
  };

  /* Warm the HTTP cache for the whole sequence at low priority so fast
     scrollbar jumps mostly decode from cache. Bytes only — decoding stays
     inside the rolling window. */
  const prefetchNext = () => {
    if (destroyed || prefetching || !running) return;
    while (
      prefetchCursor < ENGINE_SEQUENCE.frameCount &&
      (decoded.has(prefetchCursor) || pending.has(prefetchCursor) || failed.has(prefetchCursor))
    ) {
      prefetchCursor++;
    }
    if (prefetchCursor >= ENGINE_SEQUENCE.frameCount) return;
    const frame = prefetchCursor++;
    prefetching = true;
    fetch(ENGINE_SEQUENCE.framePath(frame), {
      signal: abort.signal,
      priority: "low",
    } as RequestInit)
      .then((res) => res.blob())
      .catch(() => undefined)
      .finally(() => {
        prefetching = false;
        if (!destroyed) {
          const idle =
            typeof requestIdleCallback === "function"
              ? requestIdleCallback
              : (cb: () => void) => window.setTimeout(cb, 150);
          idle(() => prefetchNext());
        }
      });
  };

  /* ── drawing ──────────────────────────────────────────────────────── */

  const nearestDecoded = (target: number): number => {
    if (decoded.has(target)) return target;
    let best = -1;
    let bestDist = Infinity;
    for (const frame of decoded.keys()) {
      const dist = Math.abs(frame - target);
      if (dist < bestDist) {
        bestDist = dist;
        best = frame;
      }
    }
    return best;
  };

  const draw = () => {
    rafId = 0;
    if (destroyed || !running) return;
    const frame = nearestDecoded(currentFrame);
    if (frame < 0 || frame === drawnFrame) return;
    const bmp = decoded.get(frame)!;
    const cw = canvas.width;
    const ch = canvas.height;
    if (cw === 0 || ch === 0) return;
    /* Cinematic cover, centred: the artwork was authored with the left
       portion as HTML-safe negative space and the engine centre/right —
       a centred crop preserves that composition at every aspect. */
    const iw = ENGINE_SEQUENCE.width;
    const ih = ENGINE_SEQUENCE.height;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    drawnFrame = frame;
  };

  const scheduleDraw = () => {
    if (rafId || destroyed) return;
    rafId = requestAnimationFrame(draw);
  };

  /* ── canvas backing store ─────────────────────────────────────────── */

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (w === 0 || h === 0 || (canvas.width === w && canvas.height === h)) return;
    canvas.width = w;
    canvas.height = h;
    drawnFrame = -1; // backing store was cleared — repaint
    scheduleDraw();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  /* ── public handle ────────────────────────────────────────────────── */

  let prefetchStarted = false;

  if (process.env.NODE_ENV !== "production") {
    (window as unknown as Record<string, unknown>).__cine = {
      get frame() { return currentFrame; },
      get drawn() { return drawnFrame; },
      get decodedCount() { return decoded.size; },
      get pendingCount() { return pending.size; },
      get failedCount() { return failed.size; },
      get prefetchCursor() { return prefetchCursor; },
    };
  }

  return {
    setProgress(progress: number) {
      /* The whole-sequence warm-up starts only once the visitor actually
         enters the story — a load-time mount at progress 0 primes just
         the initial decode window (~0.5MB), not 11MB of frames. */
      if (!prefetchStarted && progress > 0.02) {
        prefetchStarted = true;
        prefetchNext();
      }
      const frame = progressToFrame(progress);
      if (frame === currentFrame && drawnFrame === frame) return;
      currentFrame = frame;
      ensureWindow();
      scheduleDraw();
    },
    setRunning(next: boolean) {
      if (running === next) return;
      running = next;
      if (running) {
        drawnFrame = -1;
        ensureWindow();
        scheduleDraw();
        prefetchNext();
      }
    },
    destroy() {
      destroyed = true;
      running = false;
      abort.abort();
      ro.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      for (const frame of [...decoded.keys()]) release(frame);
      queue.length = 0;
    },
  };
}
