/**
 * The six temporary service scenes for the Stage 2B immersive stage —
 * architectural/fallback visuals that establish each service's composition,
 * focal point and transition logic ahead of the Stage 2C media pass.
 *
 * Pure presentational SVG: no hooks, no state, importable from both the
 * server-rendered mobile chapters (compact, static) and the client stage.
 * Every scene shares one visual grammar so the six read as a single Optara
 * system evolving rather than six slides:
 *
 * - one 900×720 frame with a shared horizon (y=600) drawn as a hairline;
 * - one flat-accent SIGNAL PATH entering at left mid-height (y=360) and
 *   resolving at the ANCHOR NODE on the right (x=800, y=360) — the same
 *   entry and destination in every scene, so transitions read as the same
 *   signal being re-routed through a new discipline;
 * - materials limited to the permanent system: bone ground (inherited),
 *   ink hairlines, paper planes, flat accent light. No gradient-ramp
 *   backgrounds, no glass, no imitated product UI, no readable fake data.
 *
 * Colour is carried by two wrapper groups per scene: hairline geometry uses
 * a low-alpha ink stroke; signal geometry uses the accent as `currentColor`
 * (text-accent on the light bone ground — AA is irrelevant for decorative
 * strokes but the flat accent keeps them unmistakably brand light).
 */

const INK = "rgba(18,19,26,0.16)";
const INK_SOFT = "rgba(18,19,26,0.09)";
const PAPER = "#ffffff";

/** Shared frame: horizon hairline + anchor node. Rendered by every scene so
 *  the recurring motif survives any crossfade mid-state. */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 900 720"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {/* Horizon */}
      <line x1="60" y1="600" x2="840" y2="600" stroke={INK} strokeWidth="1" />
      {children}
      {/* Anchor node — the destination every scene resolves to. */}
      <g className="text-accent">
        <circle cx="800" cy="360" r="22" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <circle cx="800" cy="360" r="7" fill="currentColor" />
      </g>
    </svg>
  );
}

/** 01 Branding — scattered identity fragments resolve into one system. */
export function BrandingScene() {
  return (
    <Frame>
      {/* Fragments, loose and rotated on the left. */}
      <g stroke={INK} fill={PAPER}>
        <rect x="90" y="150" width="120" height="86" rx="10" transform="rotate(-9 150 193)" />
        <rect x="130" y="330" width="96" height="96" rx="48" transform="rotate(6 178 378)" />
        <rect x="80" y="470" width="150" height="52" rx="8" transform="rotate(-5 155 496)" />
        <rect x="250" y="240" width="70" height="70" rx="10" transform="rotate(12 285 275)" />
      </g>
      <g className="text-accent" stroke="currentColor">
        <rect x="240" y="430" width="110" height="14" rx="7" fill="currentColor" stroke="none" opacity="0.85" transform="rotate(-7 295 437)" />
      </g>
      {/* The resolved system: one coherent lockup grid on the right. */}
      <g stroke={INK} fill={PAPER}>
        <rect x="520" y="220" width="230" height="280" rx="16" />
        <rect x="548" y="256" width="64" height="64" rx="32" />
        <rect x="548" y="352" width="174" height="12" rx="6" fill="rgba(18,19,26,0.08)" stroke="none" />
        <rect x="548" y="380" width="140" height="12" rx="6" fill="rgba(18,19,26,0.08)" stroke="none" />
        <rect x="548" y="408" width="156" height="12" rx="6" fill="rgba(18,19,26,0.08)" stroke="none" />
      </g>
      <g className="text-accent">
        <rect x="632" y="268" width="90" height="14" rx="7" fill="currentColor" opacity="0.9" />
        <rect x="548" y="448" width="86" height="24" rx="12" fill="currentColor" opacity="0.9" />
      </g>
      {/* Signal path: through the fragments, into the system, to the anchor. */}
      <g className="text-accent" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M40 360 C 180 360 300 330 430 330 S 560 360 520 360 H 750" opacity="0.7" />
      </g>
    </Frame>
  );
}

/** 02 SEO & GEO — one source expands into structured and generative
 *  discovery paths. */
export function SeoScene() {
  return (
    <Frame>
      {/* Source node with reach rings. */}
      <g className="text-accent">
        <circle cx="170" cy="360" r="12" fill="currentColor" />
        <circle cx="170" cy="360" r="34" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
        <circle cx="170" cy="360" r="58" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.18" />
      </g>
      {/* Structured path: ranked, orderly nodes. */}
      <g stroke={INK} fill="none">
        <path d="M200 340 C 300 260 340 220 420 200" />
        <path d="M200 350 C 300 300 350 270 420 262" />
        <path d="M200 360 C 300 340 350 328 420 324" />
      </g>
      <g stroke={INK} fill={PAPER}>
        <rect x="430" y="182" width="150" height="34" rx="8" />
        <rect x="430" y="244" width="128" height="34" rx="8" />
        <rect x="430" y="306" width="138" height="34" rx="8" />
      </g>
      {/* Generative path: an irregular mesh of answer nodes. */}
      <g stroke={INK_SOFT} fill="none">
        <path d="M200 380 L 330 450 L 430 420 M330 450 L 380 520 M430 420 L 520 470 L 560 420 M380 520 L 520 470 M330 450 L 430 420" />
      </g>
      <g className="text-accent">
        <circle cx="330" cy="450" r="7" fill="currentColor" opacity="0.85" />
        <circle cx="430" cy="420" r="9" fill="currentColor" opacity="0.9" />
        <circle cx="380" cy="520" r="6" fill="currentColor" opacity="0.6" />
        <circle cx="520" cy="470" r="7" fill="currentColor" opacity="0.75" />
        <circle cx="560" cy="420" r="5" fill="currentColor" opacity="0.6" />
      </g>
      {/* Both routes converge on the anchor. */}
      <g className="text-accent" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M580 200 C 680 220 720 300 762 344" opacity="0.5" />
        <path d="M560 420 C 640 410 700 386 758 368" opacity="0.7" />
        <path d="M40 360 H 140" opacity="0.7" />
      </g>
    </Frame>
  );
}

/** 03 Google Ads — many intent signals narrow through one precise aperture
 *  toward a single commercial destination. */
export function AdsScene() {
  return (
    <Frame>
      {/* Incoming intent signals, unqualified and scattered. */}
      <g stroke={INK} fill="none">
        <path d="M40 160 C 180 200 280 280 396 330" />
        <path d="M40 240 C 180 260 280 300 392 342" />
        <path d="M40 440 C 180 430 290 400 394 376" />
        <path d="M40 520 C 190 490 300 430 398 388" />
        <path d="M40 580 C 200 540 310 450 402 396" />
      </g>
      <g className="text-accent" stroke="currentColor" fill="none">
        <path d="M40 320 C 180 330 280 340 390 352" opacity="0.55" />
        <path d="M40 400 C 180 395 280 380 392 366" opacity="0.55" />
      </g>
      {/* The aperture: qualification. */}
      <g fill="none" stroke={INK}>
        <circle cx="450" cy="360" r="86" />
        <circle cx="450" cy="360" r="56" strokeDasharray="4 7" />
      </g>
      <g className="text-accent" fill="none" stroke="currentColor">
        <circle cx="450" cy="360" r="26" strokeWidth="2" />
      </g>
      {/* One qualified line out, budget spent on intent that converts. */}
      <g className="text-accent" stroke="currentColor">
        <path d="M476 360 H 750" strokeWidth="3" fill="none" opacity="0.9" />
        <circle cx="613" cy="360" r="5" fill="currentColor" />
      </g>
    </Frame>
  );
}

/** 04 Social Media — content propagates through an engagement ecosystem
 *  while staying tied to one central strategy. */
export function SocialScene() {
  return (
    <Frame>
      {/* Orbits around the strategy node. */}
      <g fill="none" stroke={INK}>
        <circle cx="430" cy="360" r="105" />
        <circle cx="430" cy="360" r="185" strokeDasharray="3 8" />
      </g>
      {/* Strategy node. */}
      <g className="text-accent">
        <circle cx="430" cy="360" r="16" fill="currentColor" />
        <circle cx="430" cy="360" r="30" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      </g>
      {/* Content nodes on the inner orbit, tethered to strategy. */}
      <g stroke={INK} fill={PAPER}>
        <line x1="430" y1="360" x2="430" y2="255" />
        <line x1="430" y1="360" x2="529" y2="325" />
        <line x1="430" y1="360" x2="482" y2="452" />
        <line x1="430" y1="360" x2="331" y2="395" />
        <line x1="430" y1="360" x2="378" y2="268" />
        <circle cx="430" cy="255" r="14" />
        <circle cx="529" cy="325" r="14" />
        <circle cx="482" cy="452" r="14" />
        <circle cx="331" cy="395" r="14" />
        <circle cx="378" cy="268" r="11" />
      </g>
      {/* Propagation: engagement arcs reaching the outer orbit. */}
      <g className="text-accent" fill="none" stroke="currentColor">
        <path d="M430 255 C 470 210 520 190 585 196" opacity="0.6" />
        <path d="M529 325 C 590 300 620 280 612 240" opacity="0.45" />
        <path d="M482 452 C 540 490 590 500 615 480" opacity="0.5" />
      </g>
      <g className="text-accent">
        <circle cx="585" cy="196" r="6" fill="currentColor" opacity="0.8" />
        <circle cx="612" cy="240" r="4.5" fill="currentColor" opacity="0.6" />
        <circle cx="615" cy="480" r="5" fill="currentColor" opacity="0.7" />
      </g>
      {/* Signal in, resolved reach out. */}
      <g className="text-accent" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M40 360 H 322" opacity="0.7" />
        <path d="M615 340 C 680 348 720 354 756 358" opacity="0.7" />
      </g>
    </Frame>
  );
}

/** 05 Website Design — layered interface architecture forms one route from
 *  information to a conversion destination. */
export function WebScene() {
  return (
    <Frame>
      {/* Three receding planes: information, hierarchy, conversion. */}
      <g stroke={INK} fill={PAPER}>
        <path d="M300 150 L 640 150 L 700 230 L 360 230 Z" />
        <path d="M240 290 L 660 290 L 720 380 L 300 380 Z" />
        <path d="M180 440 L 680 440 L 740 540 L 240 540 Z" />
      </g>
      {/* Wireframe structure on the planes — abstract bars, nothing readable. */}
      <g fill="rgba(18,19,26,0.08)">
        <path d="M340 172 L 560 172 L 570 186 L 350 186 Z" />
        <path d="M352 200 L 500 200 L 508 212 L 360 212 Z" />
        <path d="M300 316 L 430 316 L 440 332 L 310 332 Z" />
        <path d="M460 316 L 590 316 L 602 332 L 472 332 Z" />
        <path d="M312 348 L 500 348 L 510 362 L 322 362 Z" />
      </g>
      {/* The conversion destination on the closest plane. */}
      <g className="text-accent">
        <path d="M420 480 L 540 480 L 552 508 L 432 508 Z" fill="currentColor" opacity="0.9" />
      </g>
      {/* The route: one line threading all three planes to the destination,
          then away to the anchor. */}
      <g className="text-accent" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M40 360 C 140 360 190 300 260 250 C 330 200 400 190 470 190 M470 190 C 500 230 480 280 460 324 M460 324 C 450 380 460 430 486 492" opacity="0.65" />
        <path d="M552 494 C 650 470 720 420 764 380" opacity="0.7" />
      </g>
      <g className="text-accent">
        <circle cx="470" cy="190" r="5" fill="currentColor" opacity="0.8" />
        <circle cx="460" cy="324" r="5" fill="currentColor" opacity="0.8" />
      </g>
    </Frame>
  );
}

/** 06 App Development — separate product modules exchange signals and dock
 *  into one functioning system. */
export function AppScene() {
  return (
    <Frame>
      {/* Modules, loosely placed. */}
      <g stroke={INK} fill={PAPER}>
        <rect x="120" y="170" width="130" height="96" rx="14" />
        <rect x="150" y="420" width="120" height="90" rx="14" />
        <rect x="330" y="280" width="140" height="104" rx="14" />
      </g>
      {/* Module internals: abstract ports, not UI. */}
      <g fill="rgba(18,19,26,0.08)">
        <rect x="140" y="192" width="60" height="10" rx="5" />
        <rect x="140" y="214" width="90" height="10" rx="5" />
        <rect x="170" y="444" width="70" height="10" rx="5" />
        <rect x="352" y="304" width="70" height="10" rx="5" />
        <rect x="352" y="326" width="96" height="10" rx="5" />
      </g>
      {/* Exchange lines with in-flight signals. */}
      <g stroke={INK} strokeDasharray="5 7" fill="none">
        <path d="M250 218 C 300 230 320 260 340 290" />
        <path d="M270 440 C 300 420 320 400 336 384" />
        <path d="M470 332 C 520 332 560 340 600 348" />
      </g>
      <g className="text-accent">
        <circle cx="300" cy="252" r="5" fill="currentColor" opacity="0.8" />
        <circle cx="305" cy="412" r="5" fill="currentColor" opacity="0.8" />
        <circle cx="535" cy="336" r="5" fill="currentColor" opacity="0.8" />
      </g>
      {/* The composed system: modules docked into one outlined unit. */}
      <g stroke={INK} fill={PAPER}>
        <rect x="600" y="280" width="160" height="160" rx="18" />
        <line x1="600" y1="360" x2="760" y2="360" />
        <line x1="680" y1="280" x2="680" y2="440" />
      </g>
      <g className="text-accent" fill="currentColor">
        <rect x="622" y="306" width="36" height="12" rx="6" opacity="0.85" />
        <rect x="702" y="386" width="36" height="12" rx="6" opacity="0.85" />
      </g>
      {/* Signal in, through the modules, to the anchor. */}
      <g className="text-accent" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M40 360 C 120 360 200 350 330 340" opacity="0.6" />
      </g>
    </Frame>
  );
}

export const SERVICE_SCENES = [
  BrandingScene,
  SeoScene,
  AdsScene,
  SocialScene,
  WebScene,
  AppScene,
] as const;
