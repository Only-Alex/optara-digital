import { Fragment } from "react";
import { site } from "@/lib/content";

/**
 * Lockup spacing taken from the logo, measured against its cap height so the
 * ratio holds at any size: the wordmark runs about 18.5 cap heights wide, and
 * the gap between its two words is about twice a letter gap.
 */
const LOCKUP_TRACKING = 0.39;
const WORD_SPACING = 0.08;

/**
 * At display scale the logo's lockup tracking would force the glyphs small to
 * keep the name inside the viewport. The oversized ghosts therefore track
 * tightly — larger type needs less spacing anyway — which buys back the size
 * the ghosts had before the logo restyle while keeping the logo's face and its
 * crossbar-less A.
 */
const DISPLAY_TRACKING = 0.01;

/**
 * The apex that stands in for a capital A. The logo's A has no crossbar, so it
 * is the face's own V turned through 180 degrees — which is how the logo itself
 * is drawn.
 *
 * Using the real glyph rather than a drawn shape means stroke weight, width and
 * cap height match the surrounding letters exactly, for free: in this face V
 * and A share an advance and an ink width. The rotation happens about the box
 * centre, and with a line-height of 1 that lands the flipped ink within
 * 0.005em of where a real A sits on the baseline.
 */
function Apex({ tracking }: { tracking: number }) {
  return (
    <span
      className="inline-block rotate-180 leading-none"
      // letter-spacing sits *inside* the box, so a 180 degree rotation swings
      // that trailing gap round to the left — putting space before the A and
      // butting it against the next letter. Zero it and re-add the gap as a
      // margin, which the transform cannot move. It has to match the run's own
      // tracking, so it is passed in rather than read from a constant.
      style={{ letterSpacing: 0, marginInlineEnd: `${tracking}em` }}
    >
      V
    </span>
  );
}

/**
 * The company wordmark: the site name in the logo's geometric face, uppercase
 * and tracked, with every A replaced by the flipped V.
 *
 * The visible run is decorative, so assistive technology reads the real name
 * from the screen-reader copy rather than a V where an A belongs. Where a
 * consumer already labels the link (the header lockup), that label wins and
 * this copy is simply ignored.
 *
 * `display` is for the oversized ghosts that open the hero and close the
 * footer: it tracks tightly so the type can run large, and drops the
 * screen-reader copy, since those are texture and the lockup on the same page
 * already announces the name.
 */
export function Wordmark({
  className = "",
  display = false,
}: {
  className?: string;
  display?: boolean;
}) {
  const chunks = site.name.toUpperCase().split("A");
  const tracking = display ? DISPLAY_TRACKING : LOCKUP_TRACKING;

  return (
    <>
      <span
        aria-hidden="true"
        className={`font-[family-name:var(--font-wordmark)] font-semibold uppercase leading-none ${className}`}
        style={{
          letterSpacing: `${tracking}em`,
          wordSpacing: `${WORD_SPACING}em`,
        }}
      >
        {chunks.map((chunk, index) => (
          <Fragment key={index}>
            {chunk}
            {index < chunks.length - 1 && <Apex tracking={tracking} />}
          </Fragment>
        ))}
      </span>
      {!display && <span className="sr-only">{site.name}</span>}
    </>
  );
}
