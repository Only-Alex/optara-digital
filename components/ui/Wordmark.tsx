import { Fragment } from "react";
import { site } from "@/lib/content";

/**
 * Spacing taken from the logo, measured against its cap height so the ratio
 * holds at any size: the wordmark runs about 18.5 cap heights wide, and the
 * gap between its two words is about twice a letter gap.
 *
 * TRACKING is shared with the apex below, which has to reproduce it as a
 * margin — see there for why. Keeping one constant stops the two drifting.
 */
const TRACKING = 0.39;
const WORD_SPACING = 0.08;

/**
 * The apex that stands in for a capital A in the lockup. The logo's A has no
 * crossbar, so it is the face's own V turned through 180 degrees — which is
 * how the logo itself is drawn.
 *
 * Using the real glyph rather than a drawn shape means stroke weight, width
 * and cap height match the surrounding letters exactly, for free: in this
 * face V and A share an advance of 0.636em and an ink width of 0.618em. The
 * rotation happens about the box centre, and with a line-height of 1 that
 * lands the flipped ink within 0.005em of where a real A sits on the baseline.
 */
function Apex() {
  return (
    <span
      className="inline-block rotate-180 leading-none"
      // letter-spacing sits *inside* the box, so a 180 degree rotation swings
      // that trailing gap round to the left — putting space before the A and
      // butting it against the next letter. Zero it and re-add the gap as a
      // margin, which the transform cannot move.
      style={{ letterSpacing: 0, marginInlineEnd: `${TRACKING}em` }}
    >
      V
    </span>
  );
}

/**
 * The company wordmark: the site name in the lockup's light geometric face,
 * uppercase and widely tracked, with every A replaced by the flipped V.
 *
 * The visible run is decorative, so assistive technology reads the real name
 * from the screen-reader copy rather than a V where an A belongs. Where a
 * consumer already labels the link (the header lockup), that label wins and
 * this copy is simply ignored.
 *
 * `decorative` drops that copy, for the oversized ghost wordmarks that open
 * the hero and close the footer: they are texture, and the name is already
 * announced by the lockup on the same page.
 */
export function Wordmark({
  className = "",
  decorative = false,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const chunks = site.name.toUpperCase().split("A");

  return (
    <>
      <span
        aria-hidden="true"
        className={`font-[family-name:var(--font-wordmark)] font-medium uppercase leading-none ${className}`}
        style={{
          letterSpacing: `${TRACKING}em`,
          wordSpacing: `${WORD_SPACING}em`,
        }}
      >
        {chunks.map((chunk, index) => (
          <Fragment key={index}>
            {chunk}
            {index < chunks.length - 1 && <Apex />}
          </Fragment>
        ))}
      </span>
      {!decorative && <span className="sr-only">{site.name}</span>}
    </>
  );
}
