import { Fragment } from "react";
import { site } from "@/lib/content";

/**
 * The apex that stands in for a capital A in the lockup. The logo's A has no
 * crossbar, and no web face ships one, so it is drawn: two strokes meeting at
 * the apex, sized in em off the surrounding type and sitting on the baseline,
 * so it tracks the wordmark's size and colour exactly.
 *
 * Stroke is 0.95 units against a 14-unit cap height — the stem-to-cap ratio of
 * the light geometric face the rest of the wordmark is set in.
 */
function Apex() {
  return (
    <svg
      viewBox="0 0 10 14"
      className="inline-block h-[0.72em] w-[0.62em] align-baseline"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.95"
      strokeLinecap="butt"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0.7 14 L5 0.5 L9.3 14" />
    </svg>
  );
}

/**
 * The company wordmark: the site name in the lockup's light geometric face,
 * uppercase and widely tracked, with every A replaced by the drawn apex.
 *
 * Tracking and word spacing are set from the logo's own proportions, measured
 * against its cap height so the ratio holds at any size: the wordmark runs
 * about 18.5 cap heights wide, and the gap between the two words is about
 * twice a letter gap.
 *
 * The visible run is decorative, so assistive technology reads the real name
 * from the screen-reader copy instead of a string peppered with SVGs. Where a
 * consumer already labels the link (the header lockup), that label wins and
 * this copy is simply ignored.
 */
export function Wordmark({ className = "" }: { className?: string }) {
  const chunks = site.name.toUpperCase().split("A");

  return (
    <>
      <span
        aria-hidden="true"
        className={`font-[family-name:var(--font-wordmark)] font-light uppercase leading-none tracking-[0.57em] [word-spacing:0.31em] ${className}`}
      >
        {chunks.map((chunk, index) => (
          <Fragment key={index}>
            {chunk}
            {index < chunks.length - 1 && <Apex />}
          </Fragment>
        ))}
      </span>
      <span className="sr-only">{site.name}</span>
    </>
  );
}
