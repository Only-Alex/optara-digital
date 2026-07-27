/**
 * Interface sketches for the Capabilities tabs — one per service group.
 *
 * Deliberately straight-on rather than the isometric the blueprint sketched:
 * the rest of the page is flat hairlines and mono labels, and a skewed panel
 * reads as a stock illustration dropped into an editorial layout. Depth comes
 * from layering and opacity, per §4.
 *
 * Every value is a token, so the same SVG works on paper, bone and ink. Accent
 * marks one idea per drawing — the cited answer, the winning row, the call to
 * action, the trend — even where that idea is drawn with several shapes. More
 * than one accented idea and the eye has nowhere to land. These are decorative:
 * the panel is aria-hidden and the tab copy carries the whole meaning.
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

/** Search results with an AI answer above the organic listings. */
function SearchPanel() {
  return (
    <Frame>
      <rect x="24" y="24" width="272" height="28" rx="14" fill={FILL_SOFT} />
      <circle cx="42" cy="38" r="5" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="56" y="35" width="96" height="6" rx="3" fill={FILL} />

      {/* The cited answer block — the one accented element */}
      <rect x="24" y="68" width="272" height="62" rx="9" fill="none" stroke={ACCENT} vectorEffect="non-scaling-stroke" />
      <rect x="36" y="80" width="52" height="6" rx="3" fill={ACCENT} />
      <rect x="36" y="96" width="232" height="5" rx="2.5" fill={FILL} />
      <rect x="36" y="108" width="204" height="5" rx="2.5" fill={FILL} />
      <rect x="36" y="120" width="128" height="5" rx="2.5" fill={FILL} />

      {[148, 196].map((y) => (
        <g key={y}>
          <rect x="24" y={y} width="150" height="7" rx="3.5" fill={FILL} />
          <rect x="24" y={y + 16} width="248" height="5" rx="2.5" fill={FILL_SOFT} />
          <rect x="24" y={y + 28} width="196" height="5" rx="2.5" fill={FILL_SOFT} />
        </g>
      ))}
    </Frame>
  );
}

/** Campaign table ranked by cost per lead, best row picked out. */
function CampaignTable() {
  const rows = [96, 128, 160, 192];
  return (
    <Frame>
      <rect x="24" y="28" width="88" height="7" rx="3.5" fill={FILL} />

      {[24, 150, 208, 254].map((x, i) => (
        <rect key={x} x={x} y="62" width={i === 0 ? 44 : 34} height="5" rx="2.5" fill={FILL_SOFT} />
      ))}
      <line x1="24" y1="78" x2="296" y2="78" stroke={LINE} vectorEffect="non-scaling-stroke" />

      {rows.map((y, i) => {
        const best = i === 1;
        const tone = best ? ACCENT : FILL;
        return (
          <g key={y}>
            {best && <rect x="18" y={y - 9} width="284" height="26" rx="6" fill={FILL_SOFT} />}
            {best && <rect x="18" y={y - 9} width="2" height="26" rx="1" fill={ACCENT} />}
            <rect x="24" y={y} width={i === 3 ? 74 : 96} height="6" rx="3" fill={tone} />
            <rect x="150" y={y} width="30" height="6" rx="3" fill={best ? ACCENT : FILL_SOFT} />
            <rect x="208" y={y} width="26" height="6" rx="3" fill={best ? ACCENT : FILL_SOFT} />
            <rect x="254" y={y} width="34" height="6" rx="3" fill={best ? ACCENT : FILL_SOFT} />
          </g>
        );
      })}
    </Frame>
  );
}

/** Browser and handset sharing one layout, with the CTA called out. */
function DeviceSet() {
  return (
    <Frame>
      <rect x="24" y="30" width="216" height="152" rx="9" fill="none" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <line x1="24" y1="52" x2="240" y2="52" stroke={LINE} vectorEffect="non-scaling-stroke" />
      {[36, 46, 56].map((cx) => (
        <circle key={cx} cx={cx} cy="41" r="2.5" fill={FILL} />
      ))}

      <rect x="40" y="68" width="118" height="9" rx="4.5" fill={FILL} />
      <rect x="40" y="86" width="88" height="6" rx="3" fill={FILL_SOFT} />
      {/* Primary call to action */}
      <rect x="40" y="104" width="58" height="18" rx="9" fill={ACCENT} />

      <rect x="40" y="140" width="60" height="26" rx="6" fill={FILL_SOFT} />
      <rect x="110" y="140" width="60" height="26" rx="6" fill={FILL_SOFT} />
      <rect x="180" y="140" width="44" height="26" rx="6" fill={FILL_SOFT} />

      {/* Handset, overlapping to imply one system across breakpoints */}
      <rect x="228" y="86" width="68" height="126" rx="12" fill="var(--bg)" stroke={LINE} vectorEffect="non-scaling-stroke" />
      <rect x="250" y="96" width="24" height="4" rx="2" fill={FILL_SOFT} />
      <rect x="240" y="112" width="44" height="7" rx="3.5" fill={FILL} />
      <rect x="240" y="126" width="32" height="5" rx="2.5" fill={FILL_SOFT} />
      <rect x="240" y="144" width="44" height="14" rx="7" fill={ACCENT} />
      <rect x="240" y="168" width="44" height="22" rx="5" fill={FILL_SOFT} />
    </Frame>
  );
}

/** Enquiry trend over a funnel — the qualified step is what gets measured. */
function AnalyticsBoard() {
  return (
    <Frame>
      {[24, 122, 220].map((x, i) => (
        <g key={x}>
          <rect x={x} y="26" width="76" height="46" rx="8" fill={FILL_SOFT} />
          <rect x={x + 12} y="38" width="26" height="5" rx="2.5" fill={FILL} />
          <rect x={x + 12} y="50" width={i === 1 ? 40 : 30} height="9" rx="4.5" fill={FILL} />
        </g>
      ))}

      <polyline
        points="30,158 72,142 114,148 156,120 198,126 240,98 288,88"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx="288" cy="88" r="3.5" fill={ACCENT} />
      <line x1="24" y1="176" x2="296" y2="176" stroke={LINE} vectorEffect="non-scaling-stroke" />

      {[
        { x: 24, w: 272 },
        { x: 24, w: 186 },
        { x: 24, w: 104 },
      ].map((bar, i) => (
        <rect key={bar.w} x={bar.x} y={192 + i * 16} width={bar.w} height="9" rx="4.5" fill={FILL} />
      ))}
    </Frame>
  );
}

const MOCKUPS = [SearchPanel, CampaignTable, DeviceSet, AnalyticsBoard];

export function ServiceMockup({ index, className }: Props) {
  const Drawing = MOCKUPS[index] ?? MOCKUPS[0];
  return (
    <div className={className}>
      <Drawing />
    </div>
  );
}
