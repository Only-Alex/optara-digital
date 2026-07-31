/**
 * Interface sketches for the Services section — one per service.
 *
 * Deliberately straight-on rather than isometric: the rest of the page is flat
 * hairlines and mono labels, and a skewed panel reads as a stock illustration
 * dropped into an editorial layout. Depth comes from layering and opacity.
 *
 * Every value is a token, so the same SVG works on paper, bone and ink. Accent
 * marks one idea per drawing — the mark, the cited answer, the conversion, the
 * loop, the call to action, the live flow — even where that idea is drawn with
 * several shapes. More than one accented idea and the eye has nowhere to land.
 *
 * Nothing here states a number. No rankings, spend, follower counts, ratings or
 * percentages: the drawings show how the work is structured, and a figure drawn
 * into a diagram is a claim whether or not it is labelled as one.
 *
 * These are decorative — every frame is aria-hidden and the service copy beside
 * it carries the whole meaning.
 */

const LINE = "var(--hairline)";
const ACCENT = "var(--accent-fg)";
const FILL = "color-mix(in srgb, var(--fg) 8%, transparent)";
const FILL_SOFT = "color-mix(in srgb, var(--fg) 5%, transparent)";

type Props = { index: number; className?: string };

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 320 240"
      className="h-full w-full"
      role="presentation"
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="319"
        height="239"
        rx="13"
        fill="none"
        stroke={LINE}
        vectorEffect="non-scaling-stroke"
      />
      {children}
    </svg>
  );
}

/** 01 — An identity system: the mark on its construction grid, its type and
 *  tokens, and the same mark holding across three touchpoints. */
function BrandSystem() {
  return (
    <Frame>
      {/* Construction grid — the mark is built, not drawn freehand */}
      <g stroke={LINE} vectorEffect="non-scaling-stroke" fill="none">
        <rect x="28" y="34" width="86" height="86" rx="8" />
        <line x1="28" y1="77" x2="114" y2="77" />
        <line x1="71" y1="34" x2="71" y2="120" />
      </g>
      {/* The mark: concentric arcs and the signature dot, per the logo */}
      <circle cx="71" cy="77" r="27" fill="none" stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="112 30" transform="rotate(-38 71 77)" />
      <circle cx="71" cy="77" r="15" fill="none" stroke={ACCENT} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeDasharray="62 18" transform="rotate(-38 71 77)" />
      <circle cx="71" cy="50" r="3.4" fill={ACCENT} />

      {/* Type specimen: one voice, three weights */}
      <rect x="136" y="38" width="70" height="11" rx="3" fill={FILL} />
      <rect x="136" y="57" width="104" height="6" rx="3" fill={FILL_SOFT} />
      <rect x="136" y="70" width="88" height="6" rx="3" fill={FILL_SOFT} />

      {/* Colour tokens */}
      <circle cx="142" cy="98" r="8" fill={ACCENT} />
      <circle cx="164" cy="98" r="8" fill={FILL} />
      <circle cx="186" cy="98" r="8" fill={FILL_SOFT} />
      <circle cx="208" cy="98" r="8" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />

      <line x1="28" y1="146" x2="292" y2="146" stroke={LINE} vectorEffect="non-scaling-stroke" />

      {/* The same identity carried across touchpoints */}
      {[28, 122, 216].map((x) => (
        <g key={x}>
          <rect x={x} y="166" width="76" height="48" rx="7" fill={FILL_SOFT} stroke={LINE} vectorEffect="non-scaling-stroke" />
          <circle cx={x + 15} cy="181" r="5" fill="none" stroke={ACCENT} strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
          <rect x={x + 26} y="178" width="34" height="5" rx="2.5" fill={FILL} />
          <rect x={x + 12} y="196" width="52" height="4" rx="2" fill={FILL_SOFT} />
        </g>
      ))}
    </Frame>
  );
}

/** 02 — Discoverability: a query resolving into a cited answer above the
 *  organic listings, fed by a graph of related topics. */
function SearchVisibility() {
  return (
    <Frame>
      {/* Query */}
      <rect x="24" y="24" width="272" height="28" rx="14" fill={FILL_SOFT} />
      <circle cx="42" cy="38" r="5" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="56" y="35" width="96" height="6" rx="3" fill={FILL} />

      {/* The generated answer, with its citation back to the site */}
      <rect x="24" y="68" width="168" height="76" rx="9" fill="none" stroke={ACCENT} vectorEffect="non-scaling-stroke" />
      <rect x="36" y="80" width="44" height="6" rx="3" fill={ACCENT} />
      <rect x="36" y="96" width="140" height="5" rx="2.5" fill={FILL} />
      <rect x="36" y="108" width="118" height="5" rx="2.5" fill={FILL} />
      <circle cx="40" cy="128" r="3.5" fill={ACCENT} />
      <rect x="50" y="125" width="56" height="5" rx="2.5" fill={ACCENT} opacity="0.55" />

      {/* Topic graph feeding it — semantic relationships, not a chart */}
      <g stroke={LINE} vectorEffect="non-scaling-stroke">
        <line x1="238" y1="82" x2="212" y2="108" />
        <line x1="238" y1="82" x2="266" y2="106" />
        <line x1="212" y1="108" x2="240" y2="132" />
        <line x1="266" y1="106" x2="240" y2="132" />
      </g>
      <circle cx="238" cy="82" r="7" fill={ACCENT} />
      <circle cx="212" cy="108" r="5" fill={FILL} />
      <circle cx="266" cy="106" r="5" fill={FILL} />
      <circle cx="240" cy="132" r="5" fill={FILL} />

      {/* Organic listings below */}
      {[164, 200].map((y) => (
        <g key={y}>
          <rect x="24" y={y} width="150" height="7" rx="3.5" fill={FILL} />
          <rect x="24" y={y + 15} width="248" height="5" rx="2.5" fill={FILL_SOFT} />
        </g>
      ))}
    </Frame>
  );
}

/** 03 — The paid-search journey: intent, targeting, message, landing page,
 *  conversion, and the optimisation loop feeding back into targeting. */
function PaidJourney() {
  const steps = [
    { x: 24, label: 34 },
    { x: 96, label: 30 },
    { x: 168, label: 36 },
    { x: 240, label: 28 },
  ];
  return (
    <Frame>
      {/* Intent query enters the system */}
      <rect x="24" y="26" width="140" height="22" rx="11" fill={FILL_SOFT} />
      <circle cx="39" cy="37" r="4.5" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="52" y="34" width="72" height="5" rx="2.5" fill={FILL} />

      {/* The chain: targeting, ad, landing page, conversion */}
      <g stroke={LINE} vectorEffect="non-scaling-stroke">
        <line x1="80" y1="108" x2="96" y2="108" />
        <line x1="152" y1="108" x2="168" y2="108" />
        <line x1="224" y1="108" x2="240" y2="108" />
      </g>
      {steps.map((s, i) => {
        const last = i === steps.length - 1;
        return (
          <g key={s.x}>
            <rect
              x={s.x}
              y="80"
              width="56"
              height="56"
              rx="9"
              fill={last ? "none" : FILL_SOFT}
              stroke={last ? ACCENT : LINE}
              vectorEffect="non-scaling-stroke"
            />
            <rect x={s.x + 12} y="98" width={s.label} height="5" rx="2.5" fill={last ? ACCENT : FILL} />
            <rect x={s.x + 12} y="110" width={s.label - 10} height="5" rx="2.5" fill={FILL_SOFT} />
          </g>
        );
      })}

      {/* Optimisation loop: what the conversion teaches goes back to targeting */}
      <path
        d="M268 142 C268 178, 200 186, 130 186 C86 186, 52 172, 52 142"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.6"
        strokeDasharray="5 5"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M52 148 L52 138 L58 143 Z" fill={ACCENT} />
      <rect x="128" y="196" width="64" height="5" rx="2.5" fill={FILL_SOFT} />
    </Frame>
  );
}

/** 04 — A content system: themes planned across a calendar, published in
 *  several formats, reaching an audience that feeds insight back in. */
function ContentSystem() {
  return (
    <Frame>
      {/* Editorial calendar — themes placed deliberately, not a heat map */}
      <rect x="24" y="26" width="164" height="7" rx="3.5" fill={FILL} />
      <g>
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4].map((col) => {
            const on = (row === 1 && col === 1) || (row === 2 && col === 3);
            return (
              <rect
                key={`${row}-${col}`}
                x={24 + col * 34}
                y={46 + row * 26}
                width="28"
                height="20"
                rx="5"
                fill={on ? ACCENT : FILL_SOFT}
                opacity={on ? 0.85 : 1}
              />
            );
          }),
        )}
      </g>

      {/* Formats the themes are published in */}
      <rect x="212" y="46" width="38" height="50" rx="6" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="258" y="46" width="38" height="30" rx="6" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="258" y="82" width="38" height="14" rx="6" fill={FILL_SOFT} />
      <rect x="212" y="104" width="84" height="5" rx="2.5" fill={FILL_SOFT} />

      {/* Audience reached, and the signal returning to strategy */}
      <g stroke={LINE} vectorEffect="non-scaling-stroke" fill="none">
        <path d="M212 168 A44 44 0 0 1 268 168" />
        <path d="M204 182 A56 56 0 0 1 276 182" />
      </g>
      {[224, 240, 256].map((cx) => (
        <circle key={cx} cx={cx} cy="196" r="6" fill={FILL} />
      ))}
      <circle cx="240" cy="152" r="8" fill={ACCENT} />

      <path
        d="M228 152 C160 152, 96 156, 60 172"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.6"
        strokeDasharray="5 5"
        vectorEffect="non-scaling-stroke"
      />
      <path d="M66 166 L56 173 L66 178 Z" fill={ACCENT} />
      <rect x="24" y="192" width="76" height="6" rx="3" fill={FILL_SOFT} />
    </Frame>
  );
}

/** 05 — One responsive system: the same layout and the same call to action
 *  holding from desktop through tablet to handset. */
function ResponsiveSystem() {
  return (
    <Frame>
      {/* Desktop surface */}
      <rect x="24" y="28" width="196" height="140" rx="9" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <line x1="24" y1="50" x2="220" y2="50" stroke={LINE} vectorEffect="non-scaling-stroke" />
      {[36, 46, 56].map((cx) => (
        <circle key={cx} cx={cx} cy="39" r="2.5" fill={FILL} />
      ))}
      <rect x="40" y="66" width="112" height="10" rx="5" fill={FILL} />
      <rect x="40" y="84" width="84" height="6" rx="3" fill={FILL_SOFT} />
      {/* The one call to action, carried across every surface */}
      <rect x="40" y="102" width="56" height="18" rx="9" fill={ACCENT} />
      <rect x="40" y="136" width="54" height="20" rx="5" fill={FILL_SOFT} />
      <rect x="102" y="136" width="54" height="20" rx="5" fill={FILL_SOFT} />
      <rect x="164" y="136" width="42" height="20" rx="5" fill={FILL_SOFT} />

      {/* Tablet */}
      <rect x="150" y="96" width="76" height="112" rx="9" fill="var(--bg)" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="162" y="112" width="48" height="7" rx="3.5" fill={FILL} />
      <rect x="162" y="126" width="36" height="5" rx="2.5" fill={FILL_SOFT} />
      <rect x="162" y="142" width="40" height="14" rx="7" fill={ACCENT} />
      <rect x="162" y="166" width="52" height="26" rx="5" fill={FILL_SOFT} />

      {/* Handset */}
      <rect x="240" y="76" width="56" height="132" rx="12" fill="var(--bg)" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="258" y="86" width="20" height="3.5" rx="1.75" fill={FILL_SOFT} />
      <rect x="250" y="102" width="36" height="6" rx="3" fill={FILL} />
      <rect x="250" y="115" width="26" height="4" rx="2" fill={FILL_SOFT} />
      <rect x="250" y="130" width="36" height="13" rx="6.5" fill={ACCENT} />
      <rect x="250" y="152" width="36" height="20" rx="5" fill={FILL_SOFT} />
      <rect x="250" y="178" width="36" height="20" rx="5" fill={FILL_SOFT} />

      {/* Shared grid guides — one system, three widths */}
      <g stroke={ACCENT} strokeWidth="1" opacity="0.28" strokeDasharray="3 5" vectorEffect="non-scaling-stroke">
        <line x1="40" y1="22" x2="40" y2="214" />
        <line x1="286" y1="22" x2="286" y2="214" />
      </g>
    </Frame>
  );
}

/** 06 — A product: connected modules and states, one journey running through
 *  them, on both a handset and a desktop surface. */
function ProductSystem() {
  return (
    <Frame>
      {/* Product surface with its module rail */}
      <rect x="24" y="30" width="180" height="150" rx="9" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <line x1="70" y1="30" x2="70" y2="180" stroke={LINE} vectorEffect="non-scaling-stroke" />
      {[46, 66, 86, 106].map((y, i) => (
        <rect key={y} x="36" y={y} width="22" height="8" rx="4" fill={i === 1 ? ACCENT : FILL_SOFT} />
      ))}

      {/* Workflow: three states connected by the live flow */}
      <g stroke={LINE} vectorEffect="non-scaling-stroke">
        <line x1="118" y1="66" x2="118" y2="94" />
        <line x1="118" y1="122" x2="118" y2="150" />
      </g>
      <rect x="84" y="46" width="106" height="22" rx="6" fill={FILL_SOFT} />
      <rect x="96" y="54" width="46" height="6" rx="3" fill={FILL} />
      <rect x="84" y="96" width="106" height="26" rx="6" fill="none" stroke={ACCENT} vectorEffect="non-scaling-stroke" />
      <rect x="96" y="106" width="56" height="6" rx="3" fill={ACCENT} />
      <rect x="84" y="150" width="106" height="22" rx="6" fill={FILL_SOFT} />
      <rect x="96" y="158" width="38" height="6" rx="3" fill={FILL} />

      {/* Data flowing out to the second surface */}
      <path
        d="M190 109 C216 109, 222 128, 240 128"
        fill="none"
        stroke={ACCENT}
        strokeWidth="1.6"
        strokeDasharray="5 5"
        vectorEffect="non-scaling-stroke"
      />

      {/* Handset surface running the same product */}
      <rect x="238" y="58" width="58" height="140" rx="12" fill="var(--bg)" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="256" y="68" width="22" height="3.5" rx="1.75" fill={FILL_SOFT} />
      <rect x="248" y="84" width="38" height="6" rx="3" fill={FILL} />
      <rect x="248" y="98" width="28" height="4" rx="2" fill={FILL_SOFT} />
      <rect x="248" y="116" width="38" height="22" rx="6" fill={FILL_SOFT} />
      <rect x="248" y="144" width="38" height="22" rx="6" fill={FILL_SOFT} />
      <circle cx="267" cy="182" r="8" fill={ACCENT} />

      <rect x="24" y="196" width="112" height="5" rx="2.5" fill={FILL_SOFT} />
    </Frame>
  );
}

const MOCKUPS = [
  BrandSystem,
  SearchVisibility,
  PaidJourney,
  ContentSystem,
  ResponsiveSystem,
  ProductSystem,
];

export function ServiceMockup({ index, className }: Props) {
  const Drawing = MOCKUPS[index] ?? MOCKUPS[0];
  return (
    <div className={className}>
      <Drawing />
    </div>
  );
}
