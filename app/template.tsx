/**
 * Route transition: every navigation remounts this template, so the fresh
 * page enters on the .page-enter fade defined in globals.css.
 *
 * Deliberately a server component animating with CSS alone:
 * - opacity only, never transform — a transform here would make this div the
 *   containing block for every position: fixed descendant (the custom cursor,
 *   the floating Speak bubble) for the duration of the animation;
 * - CSS runs without JavaScript, so a no-JS visitor still ends at opacity 1,
 *   where a JS-driven entrance would strand them on the initial frame;
 * - the global reduced-motion override collapses the duration to nothing.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
