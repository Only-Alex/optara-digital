"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
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
import { RevealText } from "@/components/ui/RevealText";
import { ServiceIcon } from "@/components/ui/ServiceIcon";

/* ------------------------------------------------------------------ *
 * Geometry
 *
 * The scene is drawn in one fixed coordinate space and the stage box is
 * given the matching aspect ratio, so SVG units and HTML percentages map
 * to the same pixels. That is what keeps the orbital paths (SVG) and the
 * node icons and labels (real HTML) locked together at every width.
 * ------------------------------------------------------------------ */

const VIEW = { w: 1000, h: 640 };
const CENTRE = { x: 500, y: 320 };
const SCENE_R = 240;
const CORE_R = 96;

type Orbit = {
  /** Multiple of the scene radius. */
  radius: number;
  /** Degrees tipped away from the viewer. Higher is flatter on screen. */
  tilt: number;
  /** Degrees of roll in the picture plane. */
  roll: number;
  /** Depth plane, px, inside the stage's perspective. */
  z: number;
};

// Three node-bearing planes at different radii, tilts and roll, so the
// system reads as one architecture seen in perspective rather than a
// diagram. `mid` is the flattest — flat enough that its projected height
// is inside the core's radius, which is what makes the occlusion real:
// its far half hides behind the core, its near half draws across it.
const ORBITS: Record<ConnectedService["orbit"], Orbit> = {
  back: { radius: 1.5, tilt: 64, roll: 8, z: -56 },
  mid: { radius: 1.28, tilt: 76, roll: -5, z: 0 },
  front: { radius: 1.4, tilt: 60, roll: 12, z: 48 },
};

// Decorative dashed paths. No nodes; their dash patterns crawl slowly to
// carry the sense of live orbital drift without moving any geometry the
// nodes are seated on. Mixed directions and durations.
const DRIFT_ORBITS: (Orbit & {
  opacity: number;
  duration: number;
  reverse?: boolean;
})[] = [
  { radius: 1.12, tilt: 70, roll: 3, z: -30, opacity: 0.16, duration: 44 },
  {
    radius: 1.62,
    tilt: 67,
    roll: -9,
    z: -44,
    opacity: 0.13,
    duration: 60,
    reverse: true,
  },
  { radius: 0.92, tilt: 78, roll: 16, z: 26, opacity: 0.18, duration: 32 },
];

// Central knobs for the motion system, rather than magic numbers spread
// through the component.
const MOTION = {
  entranceDuration: 2.8,
  signalDuration: 12,
  signalPause: 3.5,
  pointer: { rotateX: 2.5, rotateY: 4 },
} as const;

const rad = (deg: number) => (deg * Math.PI) / 180;

/** Where a seat on an orbit lands on screen, in view units. */
function seat(orbit: Orbit, angle: number) {
  const a = rad(angle);
  const t = rad(orbit.tilt);
  const r = rad(orbit.roll);
  const radius = SCENE_R * orbit.radius;
  const x = radius * Math.cos(a);
  const y = -radius * Math.sin(a) * Math.cos(t);
  return {
    x: CENTRE.x + x * Math.cos(r) - y * Math.sin(r),
    y: CENTRE.y + x * Math.sin(r) + y * Math.cos(r),
  };
}

const px = (value: number) => `${(value / VIEW.w) * 100}%`;
const py = (value: number) => `${(value / VIEW.h) * 100}%`;

/** Half of an orbit as an arc command: the far half runs over the top. */
function arc(orbit: Orbit, half: "far" | "near") {
  const a = SCENE_R * orbit.radius;
  const b = a * Math.cos(rad(orbit.tilt));
  const { x, y } = CENTRE;
  return half === "far"
    ? `M ${x - a} ${y} A ${a} ${b} 0 0 1 ${x + a} ${y}`
    : `M ${x + a} ${y} A ${a} ${b} 0 0 1 ${x - a} ${y}`;
}

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
  const seats = SEQUENCE.map((s) => seat(ORBITS[s.orbit], s.angle));
  const stops = [...seats, { x: CENTRE.x, y: CENTRE.y }];
  return stops.slice(0, -1).map((from, i) => {
    const to = stops[i + 1];
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    // Perpendicular of the leg, signed so the bow points away from the
    // centre; the final leg into the core bows only gently.
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
 * Entrance cues, named windows on one 0 → 1 value.
 * ------------------------------------------------------------------ */

const CUE = {
  core: [0, 0.25],
  ring: { back: [0.12, 0.4], mid: [0.22, 0.5], front: [0.32, 0.6] },
  nodeFirst: 0.42,
  nodeStep: 0.055,
  nodeSpan: 0.16,
  connector: 0.14,
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

/** One orbital path; contrast, not thickness, carries the hierarchy. */
function Ring({
  orbit,
  half,
  opacity,
  width,
  progress,
  window: cue,
  dashed,
  drift,
}: {
  orbit: Orbit;
  half?: "far" | "near";
  opacity: number;
  width: number;
  progress: MotionValue<number>;
  window: readonly [number, number];
  dashed?: boolean;
  drift?: { duration: number; reverse?: boolean };
}) {
  const reveal = useTransform(progress, [cue[0], cue[1]], [0, opacity]);
  const grow = useTransform(progress, [cue[0], cue[1]], [0.94, 1]);
  const a = SCENE_R * orbit.radius;
  const b = a * Math.cos(rad(orbit.tilt));

  const shared = {
    fill: "none",
    stroke: "var(--accent-fg)",
    strokeWidth: width,
    vectorEffect: "non-scaling-stroke" as const,
    strokeDasharray: dashed ? "1 7" : undefined,
    className: drift ? "cs-drift" : undefined,
    style: drift
      ? ({
          animationDuration: `${drift.duration}s`,
          animationDirection: drift.reverse ? "reverse" : "normal",
        } as React.CSSProperties)
      : undefined,
  };

  return (
    <motion.g
      style={{
        opacity: reveal,
        scale: grow,
        originX: `${CENTRE.x}px`,
        originY: `${CENTRE.y}px`,
      }}
    >
      {half ? (
        <path d={arc(orbit, half)} {...shared} />
      ) : (
        <ellipse
          cx={CENTRE.x}
          cy={CENTRE.y}
          rx={a}
          ry={b}
          transform={`rotate(${orbit.roll} ${CENTRE.x} ${CENTRE.y})`}
          {...shared}
        />
      )}
    </motion.g>
  );
}

/** A service's fine line in to the core. Subtle until its node is lit. */
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
  const reveal = useTransform(entrance, [start, start + 0.18], [0, 1]);
  // The core's "redistribute" beat lifts every connector together for a
  // moment; an individually lit connector overrides that with more.
  const opacity = useTransform(
    [reveal, glowAll] as [MotionValue<number>, MotionValue<number>],
    ([r, g]: number[]) => r * (lit ? 0.75 : 0.15 + g * 0.2),
  );

  const dx = CENTRE.x - point.x;
  const dy = CENTRE.y - point.y;
  const length = Math.hypot(dx, dy) || 1;

  return (
    <motion.line
      x1={point.x}
      y1={point.y}
      x2={CENTRE.x - (dx / length) * CORE_R}
      y2={CENTRE.y - (dy / length) * CORE_R}
      stroke="var(--accent-fg)"
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      style={{ opacity }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * One service node: a real link, with the shared line icon in a fine
 * circular frame and a front-facing label seated on its orbit.
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
  // Label sits on the side of the node facing away from the centre, so it
  // never lies across the busiest part of the composition.
  const side =
    Math.abs(point.x - CENTRE.x) < SCENE_R * 0.5
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
        z: ORBITS[service.orbit].z,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 ${
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
            : { scale: hovered ? 1.04 : 1, z: hovered ? 14 : 0 }
        }
        transition={{ duration: 0.3, ease: EASE }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <Link
          href={service.href}
          aria-label={service.spoken ?? service.title}
          className="relative flex h-11 w-11 items-center justify-center rounded-full text-paper/90 outline-offset-4"
          onPointerEnter={(event) =>
            event.pointerType === "mouse" && onHover(service.id)
          }
          onPointerLeave={() => onHover(null)}
          onFocus={() => onHover(service.id)}
          onBlur={() => onHover(null)}
        >
          <span
            aria-hidden="true"
            className="absolute inset-1 rounded-full border transition-[border-color,background-color,box-shadow] duration-300"
            style={{
              borderColor: lit
                ? "color-mix(in srgb, var(--accent-fg) 75%, transparent)"
                : "rgba(255,255,255,0.22)",
              background: lit
                ? "color-mix(in srgb, var(--accent-fg) 14%, rgba(18,19,26,0.85))"
                : "rgba(18,19,26,0.72)",
              boxShadow: lit
                ? "0 0 16px 2px rgba(142,123,255,0.4)"
                : "0 0 8px rgba(142,123,255,0.12)",
            }}
          />
          <ServiceIcon name={service.icon} className="relative h-4 w-4" />
        </Link>
        <span
          aria-hidden="true"
          className="whitespace-nowrap font-mono text-[0.75rem] uppercase leading-tight tracking-[0.05em] transition-[color,opacity] duration-300 xl:text-[0.8125rem]"
          style={{
            color: lit ? "var(--color-paper)" : "rgba(255,255,255,0.84)",
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
 * The scene
 * ------------------------------------------------------------------ */

function Scene() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const inView = useInView(stageRef, {
    once: true,
    margin: "0px 0px -18% 0px",
  });

  /* One value each for the entrance and the looping signal sequence. */
  const entrance = useMotionValue(reduced ? 1 : 0);
  const seq = useMotionValue(-1);
  const seqControls = useRef<AnimationPlaybackControls | null>(null);

  useEffect(() => {
    if (reduced) {
      entrance.set(1);
      seq.set(-1);
      return;
    }
    if (!inView) return;
    const controls = animate(entrance, 1, {
      duration: MOTION.entranceDuration,
      ease: EASE,
      delay: 0.1,
    });
    const settle = controls.then(() => {
      // The live loop: one full signal run, a quiet pause, repeat. The
      // first run doubles as the entrance's own signal pass.
      seqControls.current = animate(seq, [0, 1], {
        duration: MOTION.signalDuration,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: MOTION.signalPause,
      });
    });
    void settle;
    return () => {
      controls.stop();
      seqControls.current?.stop();
      seqControls.current = null;
    };
  }, [inView, reduced, entrance, seq]);

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

  /* Core: entrance from depth, then a restrained answer as the signal
     arrives (last leg), and one soft lift of every connector as it
     "redistributes". */
  const coreOpacity = useTransform(
    entrance,
    [CUE.core[0], CUE.core[1]],
    [0, 1],
  );
  const coreScale = useTransform(entrance, [0, 0.28], [0.86, 1]);
  const coreZ = useTransform(entrance, [0, 0.28], [-120, 10]);
  const arrival = (LEGS.length - 1) / LEGS.length;
  const coreLight = useTransform(
    seq,
    [-1, arrival, 0.97, 1],
    [0.35, 0.35, 1, 0.5],
  );
  const coreRing = useTransform(seq, [arrival, 0.97, 1], [0.9, 1.08, 1.12]);
  const coreRingOpacity = useTransform(seq, [arrival, 0.94, 1], [0, 0.5, 0]);
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

  return (
    <div
      ref={stageRef}
      data-paused={paused || undefined}
      className="relative mx-auto aspect-[1000/640] w-full max-w-[46rem] [--depth:0.55] [perspective:1100px] lg:[--depth:1] lg:[perspective:1200px]"
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

      {/* Atmosphere: one pool of light behind the core, one restrained
          vignette. Flat, outside the 3D stack, so it never parallaxes. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(46%_46%_at_50%_50%,rgba(142,123,255,0.14),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(76%_76%_at_50%_50%,transparent_55%,rgba(10,10,14,0.5))]"
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
          {/* Background planes */}
          <Layer z={DRIFT_ORBITS[1].z}>
            <Plane>
              <Ring
                orbit={DRIFT_ORBITS[1]}
                opacity={DRIFT_ORBITS[1].opacity}
                width={1}
                progress={entrance}
                window={CUE.ring.back}
                dashed
                drift={reduced ? undefined : DRIFT_ORBITS[1]}
              />
            </Plane>
          </Layer>
          <Layer z={ORBITS.back.z}>
            <Plane>
              <Ring
                orbit={ORBITS.back}
                opacity={0.32}
                width={1}
                progress={entrance}
                window={CUE.ring.back}
              />
              {connectedSystem.services
                .filter((s) => s.orbit === "back")
                .map((s) => (
                  <Connector
                    key={s.id}
                    point={seat(ORBITS.back, s.angle)}
                    order={nodeOrder(s)}
                    lit={emphasised === s.id}
                    entrance={entrance}
                    glowAll={glowAll}
                  />
                ))}
            </Plane>
          </Layer>
          <Layer z={DRIFT_ORBITS[0].z}>
            <Plane>
              <Ring
                orbit={DRIFT_ORBITS[0]}
                opacity={DRIFT_ORBITS[0].opacity}
                width={1}
                progress={entrance}
                window={CUE.ring.mid}
                dashed
                drift={reduced ? undefined : DRIFT_ORBITS[0]}
              />
            </Plane>
          </Layer>

          {/* Far half of the mid orbit: disappears behind the core. */}
          <Layer z={-16}>
            <Plane>
              <Ring
                orbit={ORBITS.mid}
                half="far"
                opacity={0.36}
                width={1}
                progress={entrance}
                window={CUE.ring.mid}
              />
            </Plane>
          </Layer>

          {/* The core and the mid plane's connectors */}
          <Layer z={0}>
            <motion.div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{
                width: `${((CORE_R * 2) / VIEW.w) * 100}%`,
                aspectRatio: "1",
                opacity: coreOpacity,
                scale: coreScale,
                z: coreZ,
                // Opaque layered surfaces with a fine lit edge — solid so
                // the far arc genuinely vanishes behind it. Not glass.
                background:
                  "radial-gradient(circle at 50% 36%, #23213a 0%, #16161f 56%, #101017 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(142,123,255,0.4), inset 0 1px 0 rgba(255,255,255,0.07), 0 26px 60px -30px rgba(0,0,0,0.95)",
              }}
            >
              {/* Fine concentric detail, and an internal light that
                  answers the signal's arrival. */}
              <span className="pointer-events-none absolute inset-[8%] rounded-full border border-paper/10" />
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  opacity: reduced ? 0.4 : coreLight,
                  background:
                    "radial-gradient(circle at 50% 46%, rgba(142,123,255,0.32), transparent 62%)",
                }}
              />
              {/* One restrained ring that expands as the core receives. */}
              {!reduced && (
                <motion.span
                  className="pointer-events-none absolute inset-[-7%] rounded-full border border-[var(--accent-fg)]"
                  style={{ opacity: coreRingOpacity, scale: coreRing }}
                />
              )}
              <span className="relative max-w-[76%] text-center font-mono text-[0.6875rem] font-medium uppercase leading-[1.7] tracking-[0.12em] text-paper/95 lg:text-[0.8125rem]">
                One
                <br />
                Connected
                <br />
                System
              </span>
            </motion.div>

            <Plane>
              {connectedSystem.services
                .filter((s) => s.orbit === "mid")
                .map((s) => (
                  <Connector
                    key={s.id}
                    point={seat(ORBITS.mid, s.angle)}
                    order={nodeOrder(s)}
                    lit={emphasised === s.id}
                    entrance={entrance}
                    glowAll={glowAll}
                  />
                ))}
            </Plane>
          </Layer>

          {/* Near half of the mid orbit: draws across the core's face. */}
          <Layer z={16}>
            <Plane>
              <Ring
                orbit={ORBITS.mid}
                half="near"
                opacity={0.85}
                width={1.4}
                progress={entrance}
                window={CUE.ring.mid}
              />
            </Plane>
          </Layer>

          {/* Foreground planes, and the travelling signal above them */}
          <Layer z={DRIFT_ORBITS[2].z}>
            <Plane>
              <Ring
                orbit={DRIFT_ORBITS[2]}
                opacity={DRIFT_ORBITS[2].opacity}
                width={1}
                progress={entrance}
                window={CUE.ring.front}
                dashed
                drift={reduced ? undefined : DRIFT_ORBITS[2]}
              />
            </Plane>
          </Layer>
          <Layer z={ORBITS.front.z}>
            <Plane>
              <Ring
                orbit={ORBITS.front}
                opacity={0.68}
                width={1.2}
                progress={entrance}
                window={CUE.ring.front}
              />
              {connectedSystem.services
                .filter((s) => s.orbit === "front")
                .map((s) => (
                  <Connector
                    key={s.id}
                    point={seat(ORBITS.front, s.angle)}
                    order={nodeOrder(s)}
                    lit={emphasised === s.id}
                    entrance={entrance}
                    glowAll={glowAll}
                  />
                ))}
            </Plane>
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
                point={seat(ORBITS[service.orbit], service.angle)}
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
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[radial-gradient(52%_60%_at_50%_26%,rgba(142,123,255,0.14),transparent_72%)]"
      />

      <div className="relative flex justify-center">
        {/* Two simplified depth arcs, so even the compact system reads as
            layered rather than flat. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 320 120"
          className="pointer-events-none absolute top-1/2 w-[320px] -translate-y-1/2"
        >
          <ellipse
            cx="160"
            cy="60"
            rx="150"
            ry="44"
            fill="none"
            stroke="var(--accent-fg)"
            strokeWidth="1"
            opacity="0.2"
          />
          <ellipse
            cx="160"
            cy="60"
            rx="110"
            ry="30"
            fill="none"
            stroke="var(--accent-fg)"
            strokeWidth="1"
            strokeDasharray="1 6"
            opacity="0.28"
          />
        </svg>
        <motion.div
          className="relative flex h-[108px] w-[108px] items-center justify-center rounded-full"
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
              "radial-gradient(circle at 50% 36%, #23213a 0%, #16161f 56%, #101017 100%)",
            boxShadow:
              "inset 0 0 0 1px rgba(142,123,255,0.4), 0 22px 46px -28px rgba(0,0,0,0.9)",
          }}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-[8%] rounded-full border border-paper/10"
          />
          <span className="relative text-center font-mono text-[0.625rem] font-medium uppercase leading-[1.7] tracking-[0.1em] text-paper/95">
            One
            <br />
            Connected
            <br />
            System
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
                      className="absolute inset-1.5 rounded-full border border-paper/20 bg-[rgba(18,19,26,0.72)]"
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
    // Ink: the homepage's mid-page dark moment. The orbital system draws in
    // light on dark, which is where the depth treatment earns its keep.
    <section id="system" data-theme="ink" className="section relative">
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
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Editorial column: eyebrow, heading, one paragraph. */}
          <div className="lg:col-span-5">
            <RevealText>
              <p className="t-mono text-paper/70">{connectedSystem.eyebrow}</p>
              <h2 className="t-display-lg mt-6 max-w-[16ch]">
                {connectedSystem.heading.lead}{" "}
                <span className="text-[var(--accent-fg)]">
                  {connectedSystem.heading.accent}
                </span>
              </h2>
              <p className="t-body-lg mt-7 max-w-[44ch] text-paper/85">
                {connectedSystem.body}
              </p>
            </RevealText>
          </div>

          {/* The orbital system. Below md it is replaced, not shrunk. The
              right inset keeps the lower-right node clear of the floating
              Speak-to-us button, which overlaps the shell until ~1600px. */}
          <div className="hidden md:block lg:col-span-7 lg:pr-10 min-[1600px]:pr-0">
            <Scene />
          </div>
        </div>

        <CompactSystem />
      </div>
    </section>
  );
}
