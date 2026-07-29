"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import { connectedSystem, type ConnectedService } from "@/lib/content";
import { EASE } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useScrollProgress } from "@/lib/hooks/useScrollProgress";
import { RevealText } from "@/components/ui/RevealText";
import { ArrowIcon, LogoMark } from "@/components/ui/Icons";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

/* ------------------------------------------------------------------ *
 * Geometry
 *
 * The scene is drawn in one fixed coordinate space and the stage box is
 * given the matching aspect ratio, so SVG units and HTML percentages map
 * to the same pixels. Nodes sit on a loose hexagon around the core, as
 * in the approved reference, and the nested rings are texture centred
 * behind them.
 * ------------------------------------------------------------------ */

const VIEW = { w: 1000, h: 800 };
const CENTRE = { x: 500, y: 400 };
// The core anchors the composition: ~240px at the desktop stage width.
const CORE_R = 165;

// Server and client V8 builds can disagree in the last bit of a cosine,
// which is enough to make React flag a hydration mismatch on an SVG
// attribute. Every geometric output is rounded to a stable precision so
// both sides serialise identically.
const round2 = (n: number) => Math.round(n * 100) / 100;
const rad = (deg: number) => (deg * Math.PI) / 180;

/** Where a service's node lands on screen, in view units. */
const seat = (service: ConnectedService) => ({
  x: CENTRE.x + service.x,
  y: CENTRE.y + service.y,
});

const px = (value: number) => `${round2((value / VIEW.w) * 100)}%`;
const py = (value: number) => `${round2((value / VIEW.h) * 100)}%`;

/* Depth planes for the node tiers. */
const NODE_Z: Record<ConnectedService["orbit"], number> = {
  back: -36,
  mid: 0,
  front: 40,
};

/* ------------------------------------------------------------------ *
 * Rings: nested ellipses centred on the core, per the reference. One
 * crosses the core's face and is split so its far half genuinely
 * disappears behind the opaque core; one bright foreground ring passes
 * in front. Three carry a slow dash drift.
 * ------------------------------------------------------------------ */

type RingDef = {
  rx: number;
  ry: number;
  roll: number;
  z: number;
  opacity: number;
  width: number;
  tier: "back" | "mid" | "front";
  dashed?: boolean;
  drift?: { duration: number; reverse?: boolean };
  split?: boolean;
  /** Deterministic bead seats, degrees along the ellipse. */
  beads?: number[];
};

const RINGS: RingDef[] = [
  // Inner bright ring, crossing the core's face (split far/near).
  {
    rx: 212,
    ry: 64,
    roll: -4,
    z: 6,
    opacity: 0.55,
    width: 1.2,
    tier: "mid",
    split: true,
    beads: [24, 118, 204, 297],
  },
  {
    rx: 268,
    ry: 94,
    roll: 3,
    z: -14,
    opacity: 0.3,
    width: 1,
    tier: "mid",
    beads: [61, 152, 246, 335],
  },
  {
    rx: 322,
    ry: 120,
    roll: -7,
    z: -26,
    opacity: 0.26,
    width: 1,
    tier: "back",
    dashed: true,
    drift: { duration: 44 },
  },
  {
    rx: 378,
    ry: 150,
    roll: 5,
    z: -38,
    opacity: 0.22,
    width: 1,
    tier: "back",
    beads: [14, 87, 141, 199, 262, 328],
  },
  {
    rx: 428,
    ry: 177,
    roll: -3,
    z: -48,
    opacity: 0.17,
    width: 1,
    tier: "back",
    dashed: true,
    drift: { duration: 64, reverse: true },
  },
  {
    rx: 472,
    ry: 202,
    roll: 8,
    z: -56,
    opacity: 0.13,
    width: 1,
    tier: "back",
    dashed: true,
    drift: { duration: 32 },
    beads: [39, 171, 293],
  },
  // Bright foreground ring, passing in front of the core.
  {
    rx: 342,
    ry: 132,
    roll: -12,
    z: 30,
    opacity: 0.5,
    width: 1.3,
    tier: "front",
    beads: [8, 76, 133, 187, 244, 311, 352],
  },
];

/** Point on a rolled ellipse, view units. */
function ringPoint(ring: RingDef, angle: number) {
  const a = rad(angle);
  const r = rad(ring.roll);
  const x = ring.rx * Math.cos(a);
  const y = ring.ry * Math.sin(a);
  return {
    x: round2(CENTRE.x + x * Math.cos(r) - y * Math.sin(r)),
    y: round2(CENTRE.y + x * Math.sin(r) + y * Math.cos(r)),
  };
}

/** Half of a split ring as an arc command: the far half runs on top. */
function arc(ring: RingDef, half: "far" | "near") {
  const { x, y } = CENTRE;
  const a = ring.rx;
  const b = ring.ry;
  return half === "far"
    ? `M ${x - a} ${y} A ${a} ${b} 0 0 1 ${x + a} ${y}`
    : `M ${x + a} ${y} A ${a} ${b} 0 0 1 ${x - a} ${y}`;
}

/* ------------------------------------------------------------------ *
 * Motion configuration, in one place.
 * ------------------------------------------------------------------ */

const MOTION = {
  signalDuration: 12,
  signalPause: 4,
  pointer: { rotateX: 2, rotateY: 3.5 },
} as const;

/* ------------------------------------------------------------------ *
 * The signal route: one luminous point visiting every service in
 * sequence, then entering the core. Each leg is a quadratic bézier
 * bowed away from the centre so the route reads as orbital travel
 * rather than straight hops.
 * ------------------------------------------------------------------ */

const SEQUENCE = [...connectedSystem.services].sort((a, b) => a.order - b.order);

type Point = { x: number; y: number };
type Leg = { from: Point; to: Point; ctrl: Point };

const LEGS: Leg[] = (() => {
  const stops = [...SEQUENCE.map(seat), { x: CENTRE.x, y: CENTRE.y }];
  return stops.slice(0, -1).map((from, i) => {
    const to = stops[i + 1];
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const outward =
      (mx - CENTRE.x) * nx + (my - CENTRE.y) * ny >= 0 ? 1 : -1;
    const bow = (i === stops.length - 2 ? 0.12 : 0.24) * len * outward;
    return { from, to, ctrl: { x: mx + nx * bow, y: my + ny * bow } };
  });
})();

const easeLeg = (t: number) => t * t * (3 - 2 * t);

/** Position along the whole route for a sequence value in [0, 1]. */
function routePoint(v: number): Point {
  const clamped = Math.min(0.9999, Math.max(0, v));
  const scaled = clamped * LEGS.length;
  const leg = LEGS[Math.floor(scaled)];
  const t = easeLeg(scaled - Math.floor(scaled));
  const u = 1 - t;
  return {
    x: u * u * leg.from.x + 2 * u * t * leg.ctrl.x + t * t * leg.to.x,
    y: u * u * leg.from.y + 2 * u * t * leg.ctrl.y + t * t * leg.to.y,
  };
}

/* ------------------------------------------------------------------ *
 * The scroll-linked entrance, expressed as named windows on one 0 → 1
 * value. The value is latched — it only ever advances — so small
 * scroll reversals never replay the build.
 * ------------------------------------------------------------------ */

const CUE = {
  core: [0.02, 0.3],
  ring: { back: [0.16, 0.42], mid: [0.26, 0.52], front: [0.36, 0.62] },
  nodeFirst: 0.4,
  nodeStep: 0.045,
  nodeSpan: 0.14,
  connector: 0.12,
} as const;

const DEPTH_ORDER: ConnectedService["orbit"][] = ["back", "mid", "front"];

const nodeOrder = (service: ConnectedService) =>
  DEPTH_ORDER.indexOf(service.orbit) * 2 +
  (connectedSystem.services
    .filter((item) => item.orbit === service.orbit)
    .findIndex((item) => item.id === service.id) %
    2);

/* ------------------------------------------------------------------ *
 * Layers
 * ------------------------------------------------------------------ */

function Layer({ z, children }: { z: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0"
      // --depth flattens the whole stack on smaller screens without
      // changing any geometry maths.
      style={{
        transform: `translateZ(calc(var(--depth) * ${z}px))`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

function Plane({ children }: { children: React.ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      preserveAspectRatio="none"
    >
      {children}
    </svg>
  );
}

/** One ring, with its luminous beads. Contrast carries the hierarchy. */
function Ring({
  ring,
  half,
  progress,
}: {
  ring: RingDef;
  half?: "far" | "near";
  progress: MotionValue<number>;
}) {
  const cue = CUE.ring[ring.tier];
  const reveal = useTransform(progress, [cue[0], cue[1]], [0, ring.opacity]);
  const beadReveal = useTransform(
    progress,
    [cue[1], Math.min(1, cue[1] + 0.18)],
    [0, 1],
  );
  const grow = useTransform(progress, [cue[0], cue[1]], [0.94, 1]);

  const shared = {
    fill: "none",
    stroke: "var(--accent-fg)",
    strokeWidth: ring.width,
    vectorEffect: "non-scaling-stroke" as const,
    strokeDasharray: ring.dashed ? "1 7" : undefined,
    className: ring.drift ? "cs-drift" : undefined,
    style: ring.drift
      ? ({
          animationDuration: `${ring.drift.duration}s`,
          animationDirection: ring.drift.reverse ? "reverse" : "normal",
        } as React.CSSProperties)
      : undefined,
  };

  return (
    <>
      <motion.g
        style={{
          opacity: reveal,
          scale: grow,
          originX: `${CENTRE.x}px`,
          originY: `${CENTRE.y}px`,
        }}
      >
        {half ? (
          <path d={arc(ring, half)} {...shared} />
        ) : (
          <ellipse
            cx={CENTRE.x}
            cy={CENTRE.y}
            rx={ring.rx}
            ry={ring.ry}
            transform={`rotate(${ring.roll} ${CENTRE.x} ${CENTRE.y})`}
            {...shared}
          />
        )}
      </motion.g>
      {/* Small lights seated along the path, as in the reference. The
          seats are fixed, so nothing sparkles or wanders. On a split
          ring only the near half carries them. */}
      {ring.beads && (
        <motion.g style={{ opacity: beadReveal }}>
          {ring.beads
            .filter((angle) => !half || (half === "near") === (angle < 180))
            .map((angle, i) => {
              const p = ringPoint(ring, angle);
              const bright = i % 3 === 0;
              return (
                <g key={angle} opacity={i % 2 === 0 ? 1 : 0.65}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={bright ? 9 : 6}
                    fill="var(--accent-fg)"
                    opacity={0.22}
                  />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={bright ? 3.4 : 2.4}
                    fill={bright ? "#e6e6ff" : "#b9aefc"}
                    opacity={0.95}
                  />
                </g>
              );
            })}
        </motion.g>
      )}
    </>
  );
}

/** A service's lit stem in to the core. */
function Connector({
  point,
  order,
  lit,
  entrance,
  glowAll,
}: {
  point: Point;
  order: number;
  lit: boolean;
  entrance: MotionValue<number>;
  glowAll: MotionValue<number>;
}) {
  const start = CUE.nodeFirst + order * CUE.nodeStep + CUE.connector;
  const reveal = useTransform(entrance, [start, start + 0.16], [0, 1]);
  const opacity = useTransform(
    [reveal, glowAll] as [MotionValue<number>, MotionValue<number>],
    ([r, g]: number[]) => r * (lit ? 0.85 : 0.38 + g * 0.2),
  );

  const dx = CENTRE.x - point.x;
  const dy = CENTRE.y - point.y;
  const length = Math.hypot(dx, dy) || 1;
  const endX = round2(CENTRE.x - (dx / length) * CORE_R);
  const endY = round2(CENTRE.y - (dy / length) * CORE_R);
  // Node edge, so the stem starts at the frame rather than under it.
  const startX = round2(point.x + (dx / length) * 46);
  const startY = round2(point.y + (dy / length) * 46);

  return (
    <motion.g style={{ opacity }}>
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="var(--accent-fg)"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
      {/* Junction lights where the stem leaves the node and meets the
          core, each with a soft halo. */}
      <circle cx={endX} cy={endY} r={8} fill="var(--accent-fg)" opacity={0.25} />
      <circle cx={endX} cy={endY} r={3.6} fill="#cfd4ff" opacity={0.95} />
      <circle cx={startX} cy={startY} r={2.6} fill="var(--accent-fg)" opacity={0.8} />
    </motion.g>
  );
}

/* ------------------------------------------------------------------ *
 * One service node: a real link — a luminous double-ring frame with
 * the shared line icon, label seated outside the composition's centre.
 * ------------------------------------------------------------------ */

function Node({
  service,
  point,
  active,
  hovered,
  anyHover,
  reduced,
  onHover,
  entrance,
}: {
  service: ConnectedService;
  point: Point;
  active: boolean;
  hovered: boolean;
  anyHover: boolean;
  reduced: boolean;
  onHover: (id: string | null) => void;
  entrance: MotionValue<number>;
}) {
  const start = CUE.nodeFirst + nodeOrder(service) * CUE.nodeStep;
  const appear = useTransform(entrance, [start, start + CUE.nodeSpan], [0, 1]);
  const rise = useTransform(entrance, [start, start + CUE.nodeSpan], [12, 0]);

  const lit = active || hovered;
  // Top and bottom nodes carry their labels above/below; side nodes
  // carry them outside, as in the reference.
  const side =
    Math.abs(point.x - CENTRE.x) < 140
      ? point.y < CENTRE.y
        ? "above"
        : "below"
      : point.x < CENTRE.x
        ? "left"
        : "right";

  return (
    <motion.li
      className="absolute"
      style={{
        left: px(point.x),
        top: py(point.y),
        opacity: appear,
        y: rise,
        z: NODE_Z[service.orbit],
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 ${
          side === "above"
            ? "flex-col-reverse"
            : side === "below"
              ? "flex-col"
              : side === "left"
                ? "flex-row-reverse"
                : "flex-row"
        }`}
        initial={false}
        animate={
          reduced
            ? { scale: 1, z: 0 }
            : { scale: hovered ? 1.04 : 1, z: hovered ? 12 : 0 }
        }
        transition={{ duration: 0.3, ease: EASE }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link
          href={service.href}
          aria-label={service.spoken ?? service.title}
          className="relative flex h-16 w-16 items-center justify-center rounded-full text-paper outline-offset-4"
          onPointerEnter={(event) =>
            event.pointerType === "mouse" && onHover(service.id)
          }
          onPointerLeave={() => onHover(null)}
          onFocus={() => onHover(service.id)}
          onBlur={() => onHover(null)}
        >
          {/* Outer luminous ring plus inner dark disc — the reference's
              double-ring frame. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full border transition-[border-color,box-shadow] duration-300"
            style={{
              borderColor: lit
                ? "rgba(236,234,255,0.95)"
                : "rgba(216,216,246,0.75)",
              boxShadow: lit
                ? "0 0 30px 5px rgba(142,123,255,0.6), inset 0 0 14px rgba(142,123,255,0.35)"
                : "0 0 18px 2px rgba(142,123,255,0.38), inset 0 0 10px rgba(142,123,255,0.2)",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-[9%] rounded-full border border-paper/12 transition-[background-color] duration-300"
            style={{
              background: lit
                ? "color-mix(in srgb, var(--accent-fg) 16%, rgba(9,10,17,0.94))"
                : "rgba(9,10,17,0.9)",
            }}
          />
          <ServiceIcon name={service.icon} className="relative h-6 w-6 text-paper" />
        </Link>
        <span
          aria-hidden="true"
          className="whitespace-nowrap font-mono text-[0.75rem] uppercase leading-tight tracking-[0.16em] transition-[color,opacity] duration-300 lg:text-[0.8125rem]"
          style={{
            color: lit ? "var(--color-paper)" : "rgba(255,255,255,0.88)",
            opacity: anyHover && !hovered ? 0.8 : 1,
          }}
        >
          {service.title}
        </span>
      </motion.div>
    </motion.li>
  );
}

/* ------------------------------------------------------------------ *
 * The central Optara System core: the genuine logo mark on a layered
 * dark surface with fine concentric rings and a strong controlled halo.
 * ------------------------------------------------------------------ */

function Core({
  entrance,
  seq,
  reduced,
}: {
  entrance: MotionValue<number>;
  seq: MotionValue<number>;
  reduced: boolean;
}) {
  const coreOpacity = useTransform(
    entrance,
    [CUE.core[0], CUE.core[1]],
    [0, 1],
  );
  const coreScale = useTransform(entrance, [CUE.core[0], 0.34], [0.86, 1]);
  const coreZ = useTransform(entrance, [CUE.core[0], 0.34], [-110, 16]);

  const arrival = (LEGS.length - 1) / LEGS.length;
  const coreLight = useTransform(
    seq,
    [-1, arrival, 0.97, 1],
    [0.55, 0.55, 1, 0.65],
  );
  const coreRing = useTransform(seq, [arrival, 0.97, 1], [0.98, 1.03, 1.04]);
  const coreRingOpacity = useTransform(seq, [arrival, 0.94, 1], [0, 0.45, 0]);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        width: `${round2(((CORE_R * 2) / VIEW.w) * 100)}%`,
        aspectRatio: "1",
        opacity: coreOpacity,
        scale: coreScale,
        z: coreZ,
        transformStyle: "preserve-3d",
      }}
    >
      {/* The wide soft halo that lifts the core off the ink, per the
          reference. A static gradient, never animated. */}
      <span
        className="pointer-events-none absolute inset-[-38%] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(97,66,255,0.42) 0%, rgba(97,66,255,0.16) 44%, transparent 70%)",
        }}
      />
      <span
        className="relative flex h-full w-full flex-col items-center justify-center rounded-full"
        style={{
          // Opaque layered surfaces with a lit edge — solid, so the far
          // arcs genuinely vanish behind it. Not glass, not a planet.
          background:
            "radial-gradient(circle at 50% 30%, #312c66 0%, #191938 52%, #0e0e20 100%)",
          boxShadow:
            "inset 0 0 0 1.5px rgba(160,140,255,0.7), inset 0 0 60px rgba(90,60,255,0.4), inset 0 2px 0 rgba(255,255,255,0.12), 0 0 72px rgba(90,60,255,0.42), 0 30px 70px -34px rgba(0,0,0,0.95)",
        }}
      >
        {/* Crisp specular arc on the upper edge, per the reference. */}
        <span
          className="pointer-events-none absolute inset-[1.5%] rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "rgba(205,195,255,0.85)",
            transform: "rotate(-26deg)",
          }}
        />
        <span className="pointer-events-none absolute inset-[5%] rounded-full border border-paper/12" />
        <span className="pointer-events-none absolute inset-[10%] rounded-full border border-[color-mix(in_srgb,var(--accent-fg)_26%,transparent)]" />
        {/* Internal light that answers the signal's arrival. */}
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            opacity: reduced ? 0.55 : coreLight,
            background:
              "radial-gradient(circle at 50% 44%, rgba(151,131,255,0.36), transparent 62%)",
          }}
        />
        {/* One restrained ring that expands as the core receives. */}
        {!reduced && (
          <motion.span
            className="pointer-events-none absolute inset-[-5%] rounded-full border border-[var(--accent-fg)]"
            style={{ opacity: coreRingOpacity, scale: coreRing }}
          />
        )}

        <LogoMark className="relative h-[30%] w-[30%] text-[var(--accent-fg)] [filter:drop-shadow(0_0_14px_rgba(142,123,255,0.55))]" />
        <span className="relative mt-[6%] text-center font-mono text-[0.6875rem] font-medium uppercase leading-[1.65] tracking-[0.22em] text-paper lg:text-[0.8125rem]">
          {connectedSystem.core.line1}
          <br />
          {connectedSystem.core.line2}
        </span>
      </span>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ *
 * The scene
 * ------------------------------------------------------------------ */

function Scene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  /* The entrance is scroll-linked but latched: it follows the section's
     scroll progress forward and never runs backwards, so the build plays
     once as the reader arrives and small reversals change nothing. */
  const scroll = useScrollProgress(stageRef, ["start 95%", "start 32%"]);
  const entrance = useMotionValue(reduced ? 1 : 0);
  const seq = useMotionValue(-1);
  const seqControls = useRef<AnimationPlaybackControls | null>(null);
  const settled = useRef(false);

  useMotionValueEvent(scroll, "change", (v) => {
    if (reduced) return;
    if (v > entrance.get()) entrance.set(v);
  });

  /* When the build completes, hand over to the calm ambient loop: one
     dominant signal at a time, a quiet pause between passes. */
  useMotionValueEvent(entrance, "change", (v) => {
    if (reduced || settled.current || v < 0.999) return;
    settled.current = true;
    seqControls.current = animate(seq, [0, 1], {
      duration: MOTION.signalDuration,
      ease: "linear",
      repeat: Infinity,
      repeatDelay: MOTION.signalPause,
    });
  });

  useEffect(() => {
    if (reduced) {
      entrance.set(1);
      seq.set(-1);
    }
    return () => {
      seqControls.current?.stop();
      seqControls.current = null;
    };
  }, [reduced, entrance, seq]);

  /* Offscreen and hidden-tab behaviour: the signal loop and the CSS dash
     drift both pause, and resume without replaying the entrance. */
  useEffect(() => {
    const element = stageRef.current;
    if (!element || reduced) return;

    let offscreen = false;
    let hidden = false;
    const apply = () => {
      const stop = offscreen || hidden;
      setPaused(stop);
      if (stop) seqControls.current?.pause();
      else seqControls.current?.play();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        offscreen = !entry.isIntersecting;
        apply();
      },
      { threshold: 0 },
    );
    observer.observe(element);

    const onVisibility = () => {
      hidden = document.hidden;
      apply();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  /* Which service the signal has reached. Discrete: six updates per
     twelve-second cycle, never per frame. */
  useMotionValueEvent(seq, "change", (v) => {
    if (v < 0) return;
    const legIndex = Math.min(LEGS.length - 1, Math.floor(v * LEGS.length));
    const id = legIndex < SEQUENCE.length ? SEQUENCE[legIndex].id : null;
    setActiveId((current) => (current === id ? current : id));
  });

  /* Signal dot and its short tail, anchored to the route. */
  const signalX = useTransform(seq, (v) => px(routePoint(v).x));
  const signalY = useTransform(seq, (v) => py(routePoint(v).y));
  const tailX = useTransform(seq, (v) => px(routePoint(v - 0.014).x));
  const tailY = useTransform(seq, (v) => py(routePoint(v - 0.014).y));
  const signalOpacity = useTransform(
    seq,
    [-1, -0.001, 0, 0.015, 0.985, 1],
    [0, 0, 0, 1, 1, 0],
  );

  const glowAll = useTransform(seq, [0.94, 0.97, 1], [0, 1, 0]);

  /* Pointer-led depth: motion values only, springs, parked offscreen,
     never attached without a fine pointer. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springConf = { stiffness: 55, damping: 20, mass: 0.6 };
  const rotateY = useSpring(
    useTransform(
      pointerX,
      [-0.5, 0.5],
      [-MOTION.pointer.rotateY, MOTION.pointer.rotateY],
    ),
    springConf,
  );
  const rotateX = useSpring(
    useTransform(
      pointerY,
      [-0.5, 0.5],
      [MOTION.pointer.rotateX, -MOTION.pointer.rotateX],
    ),
    springConf,
  );

  useEffect(() => {
    const element = stageRef.current;
    if (!element || reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let live = false;
    const onMove = (event: PointerEvent) => {
      if (!live || event.pointerType !== "mouse") return;
      const rect = element.getBoundingClientRect();
      pointerX.set(
        Math.max(
          -0.5,
          Math.min(0.5, (event.clientX - rect.left) / rect.width - 0.5),
        ),
      );
      pointerY.set(
        Math.max(
          -0.5,
          Math.min(0.5, (event.clientY - rect.top) / rect.height - 0.5),
        ),
      );
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        live = entry.isIntersecting;
        if (!live) {
          pointerX.set(0);
          pointerY.set(0);
        }
      },
      { threshold: 0 },
    );
    observer.observe(element);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, pointerX, pointerY]);

  const emphasised = hovered ?? activeId;

  const ringsFor = (tier: RingDef["tier"], where: "backdrop" | "foreground") =>
    RINGS.filter(
      (ring) =>
        !ring.split &&
        ring.tier === tier &&
        (where === "foreground" ? ring.z > 0 : ring.z <= 0),
    );

  return (
    <div
      ref={stageRef}
      data-paused={paused || undefined}
      className="relative mx-auto aspect-[1000/800] w-full max-w-[46rem] max-[1279px]:max-w-[40rem] [--depth:0.55] [perspective:1100px] md:[--depth:0.8] xl:[--depth:1] xl:[perspective:1250px]"
    >
      {/* The dash drift lives in CSS so it costs nothing per frame; the
          stage's data-paused attribute freezes it offscreen. The whole
          scene also breathes fractionally so the stillness never reads
          as a static image — nodes ride with it, so nothing detaches. */}
      <style>{`
        @keyframes cs-dash { to { stroke-dashoffset: -160; } }
        @keyframes cs-breathe {
          from { transform: rotate(-0.4deg); }
          to { transform: rotate(0.4deg); }
        }
        .cs-drift { animation: cs-dash linear infinite; }
        .cs-breathe { animation: cs-breathe 24s ease-in-out infinite alternate; }
        [data-paused] .cs-drift,
        [data-paused] .cs-breathe { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .cs-drift, .cs-breathe { animation: none; }
        }
      `}</style>

      {/* Atmosphere: one pool of light behind the system, one restrained
          vignette. Flat, outside the 3D stack, so it never parallaxes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(48%_48%_at_50%_50%,rgba(120,95,255,0.16),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(78%_78%_at_50%_50%,transparent_55%,rgba(9,9,14,0.5))]"
      />

      <motion.div
        className="absolute inset-0"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div
          className={`absolute inset-0 [transform-style:preserve-3d] ${
            reduced ? "" : "cs-breathe"
          }`}
        >
          {/* Background rings, deepest first. */}
          {ringsFor("back", "backdrop").map((ring) => (
            <Layer key={`${ring.rx}`} z={ring.z}>
              <Plane>
                <Ring
                  ring={reduced && ring.drift ? { ...ring, drift: undefined } : ring}
                  progress={entrance}
                />
              </Plane>
            </Layer>
          ))}
          {ringsFor("mid", "backdrop").map((ring) => (
            <Layer key={`${ring.rx}`} z={ring.z}>
              <Plane>
                <Ring ring={ring} progress={entrance} />
              </Plane>
            </Layer>
          ))}

          {/* Far half of the split ring: disappears behind the core. */}
          <Layer z={-8}>
            <Plane>
              <Ring
                ring={RINGS.find((r) => r.split)!}
                half="far"
                progress={entrance}
              />
            </Plane>
          </Layer>

          {/* Rear stems, then the core above them. */}
          <Layer z={2}>
            <Plane>
              {connectedSystem.services
                .filter((s) => s.orbit !== "front")
                .map((s) => (
                  <Connector
                    key={s.id}
                    point={seat(s)}
                    order={nodeOrder(s)}
                    lit={emphasised === s.id}
                    entrance={entrance}
                    glowAll={glowAll}
                  />
                ))}
            </Plane>
          </Layer>
          <Layer z={16}>
            <Core entrance={entrance} seq={seq} reduced={reduced} />
          </Layer>

          {/* Near half of the split ring: draws across the core's face,
              then the front stems above it. */}
          <Layer z={26}>
            <Plane>
              <Ring
                ring={RINGS.find((r) => r.split)!}
                half="near"
                progress={entrance}
              />
              {connectedSystem.services
                .filter((s) => s.orbit === "front")
                .map((s) => (
                  <Connector
                    key={s.id}
                    point={seat(s)}
                    order={nodeOrder(s)}
                    lit={emphasised === s.id}
                    entrance={entrance}
                    glowAll={glowAll}
                  />
                ))}
            </Plane>
          </Layer>

          {/* Foreground ring, and the travelling signal above it. */}
          {ringsFor("front", "foreground").map((ring) => (
            <Layer key={`${ring.rx}`} z={ring.z}>
              <Plane>
                <Ring ring={ring} progress={entrance} />
              </Plane>
            </Layer>
          ))}
          <Layer z={NODE_Z.front}>
            {!reduced && (
              <>
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-fg)]"
                  style={{ left: tailX, top: tailY, opacity: signalOpacity }}
                />
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-fg)]"
                  style={{
                    left: signalX,
                    top: signalY,
                    opacity: signalOpacity,
                    boxShadow: "0 0 12px 2px rgba(142,123,255,0.6)",
                  }}
                />
              </>
            )}
          </Layer>

          {/* All six services, each a real link seated on its plane. */}
          <ul
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {connectedSystem.services.map((service) => (
              <Node
                key={service.id}
                service={service}
                point={seat(service)}
                active={activeId === service.id}
                hovered={hovered === service.id}
                anyHover={hovered !== null}
                reduced={reduced}
                onHover={setHovered}
                entrance={entrance}
              />
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Small screens get a purpose-built system, not a shrunken orbit: the
 * core at the top with two faint depth arcs behind it, a spine, and the
 * six services paired either side with one signal running through.
 * ------------------------------------------------------------------ */

function CompactSystem() {
  const reduced = useReducedMotion();
  const ordered = [...connectedSystem.services].sort(
    (a, b) => a.order - b.order,
  );
  const rows = [0, 1, 2].map((row) => ordered.slice(row * 2, row * 2 + 2));

  return (
    <motion.div
      className="relative mx-auto mt-12 max-w-sm md:hidden"
      initial={reduced ? undefined : "hidden"}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, margin: "-12%" }}
      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(52%_60%_at_50%_28%,rgba(120,95,255,0.16),transparent_72%)]"
      />

      <div className="relative flex justify-center">
        {/* Simplified depth arcs, so even the compact system reads as
            layered rather than flat. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 320 140"
          className="pointer-events-none absolute top-1/2 w-[320px] -translate-y-1/2"
        >
          <ellipse
            cx="160"
            cy="70"
            rx="152"
            ry="52"
            fill="none"
            stroke="var(--accent-fg)"
            strokeWidth="1"
            opacity="0.2"
          />
          <ellipse
            cx="160"
            cy="70"
            rx="112"
            ry="36"
            fill="none"
            stroke="var(--accent-fg)"
            strokeWidth="1"
            strokeDasharray="1 6"
            opacity="0.28"
          />
        </svg>
        <motion.div
          className="relative flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full"
          variants={{
            hidden: { opacity: 0, scale: 0.86 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.6, ease: EASE },
            },
          }}
          style={{
            background:
              "radial-gradient(circle at 50% 32%, #2b2750 0%, #191831 52%, #101020 100%)",
            boxShadow:
              "inset 0 0 0 1.5px rgba(151,131,255,0.6), 0 0 34px rgba(84,56,255,0.3), 0 22px 46px -28px rgba(0,0,0,0.9)",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[5%] rounded-full border border-paper/12"
          />
          <LogoMark className="relative h-8 w-8 text-[var(--accent-fg)]" />
          <span className="relative mt-2 text-center font-mono text-[0.625rem] font-medium uppercase leading-[1.6] tracking-[0.2em] text-paper">
            {connectedSystem.core.line1}
            <br />
            {connectedSystem.core.line2}
          </span>
        </motion.div>
      </div>

      <ol className="relative mt-7">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-7 left-1/2 h-[calc(100%+1.75rem)] w-px -translate-x-1/2 bg-gradient-to-b from-[rgba(142,123,255,0.55)] via-[rgba(142,123,255,0.28)] to-transparent"
        />
        {!reduced && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--accent-fg)]"
            style={{ boxShadow: "0 0 12px 3px rgba(142,123,255,0.6)" }}
            initial={{ top: "0%", opacity: 0 }}
            whileInView={{ top: "100%", opacity: [0, 1, 1, 0] }}
            viewport={{ once: true, margin: "-12%" }}
            transition={{ duration: 1.6, ease: EASE, delay: 0.5 }}
          />
        )}

        {rows.map((pair, rowIndex) => (
          <li key={rowIndex}>
            <div className="grid grid-cols-2 items-center gap-x-4 py-3">
              {pair.map((service, sideIndex) => (
                <motion.div
                  key={service.id}
                  className={`flex items-center gap-2 ${
                    sideIndex === 0
                      ? "justify-end"
                      : "flex-row-reverse justify-end"
                  }`}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: EASE },
                    },
                  }}
                  style={{ opacity: 1 - rowIndex * 0.05 }}
                >
                  <span
                    aria-hidden="true"
                    className="whitespace-nowrap font-mono text-[0.75rem] uppercase tracking-[0.02em] text-paper/90"
                  >
                    {service.title}
                  </span>
                  <Link
                    href={service.href}
                    aria-label={service.spoken ?? service.title}
                    className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-paper/90"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-1 rounded-full border border-[color-mix(in_srgb,var(--accent-fg)_45%,rgba(255,255,255,0.16))] bg-[rgba(12,12,18,0.86)]"
                      style={{ boxShadow: "0 0 10px rgba(142,123,255,0.2)" }}
                    />
                    <ServiceIcon
                      name={service.icon}
                      className="relative h-3.5 w-3.5"
                    />
                  </Link>
                </motion.div>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

export function ConnectedSystem() {
  return (
    // Ink: the homepage's mid-page dark moment. The Optara System draws in
    // light on dark, which is where the depth treatment earns its keep.
    <section id="system" data-theme="ink" className="section relative overflow-x-clip bg-[#080911]">
      {/* Chapter seam in: a fine lit line and a falling wash, so the ground
          change reads as a new chapter rather than a background swap. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(142,123,255,0.45)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(55%_100%_at_50%_0%,rgba(142,123,255,0.06),transparent_72%)]"
      />
      {/* And out: the ink lifts fractionally towards the light section
          below, so the handover is deliberate rather than a hard cut. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.03))]"
      />

      <div className="shell">
        <div className="grid items-center gap-12 xl:grid-cols-12 xl:gap-6">
          {/* Editorial column: eyebrow, heading, paragraph, CTA. */}
          <div className="xl:col-span-5">
            <RevealText>
              <p className="t-mono bg-[linear-gradient(92deg,#63aaff_0%,#8e7bff_100%)] bg-clip-text text-transparent">
                {connectedSystem.eyebrow}
              </p>
              <h2 className="mt-6 max-w-[15ch] font-[family-name:var(--font-display-serif)] text-[clamp(2.5rem,4.5vw,4rem)] font-normal leading-[1.06] tracking-[-0.01em]">
                {connectedSystem.heading.lead}{" "}
                {/* The approved blue-to-purple treatment, on this line
                    only. */}
                <span className="bg-[linear-gradient(92deg,#63aaff_0%,#8e7bff_55%,#a98bff_100%)] bg-clip-text pb-[0.08em] text-transparent">
                  {connectedSystem.heading.accent}
                </span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[46ch] text-paper/85">
                {connectedSystem.body}
              </p>
              <div className="mt-9">
                <Link
                  href={connectedSystem.cta.href}
                  className="group/cta inline-flex items-center gap-4 rounded-[8px] border border-[color-mix(in_srgb,var(--accent-fg)_50%,transparent)] px-8 py-4 font-mono text-[0.8125rem] uppercase tracking-[0.2em] text-paper transition-[border-color,background-color] duration-300 hover:border-[var(--accent-fg)] hover:bg-accent/[0.07]"
                >
                  {connectedSystem.cta.label}
                  <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </Link>
              </div>
            </RevealText>
          </div>

          {/* The Optara System. Below md it is replaced, not shrunk; below
              xl the copy stacks above a centred stage, per the tablet
              guidance — a quarter-narrower split cannot hold the hexagon.
              The right inset keeps the right-hand nodes clear of the
              floating Speak-to-us button, which overlaps the shell until
              ~1600px. */}
          <div className="hidden md:block xl:col-span-7 xl:max-[1440px]:pr-20 min-[1440px]:max-[1600px]:pr-10">
            <Scene />
          </div>
        </div>

        <CompactSystem />
      </div>
    </section>
  );
}
