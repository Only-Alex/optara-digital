import { phases } from "@/lib/content";
import { RevealText } from "@/components/ui/RevealText";

/**
 * The process, staged the way the reference does it: each phase is a tall
 * chapter — phase label, a large gradient numeral beside the name, the steps
 * as numbered chips, the body copy — with generous air so scrolling through
 * feels like turning pages rather than reading a list. No pinning and no
 * scroll hijacking: the height does the pacing, the scroll stays native, and
 * every chapter is complete as a still.
 *
 * The section dresses the ink ground with a violet glow at the top, a faint
 * engineering grid, and a ghost numeral behind each chapter; each chapter
 * closes on a segmented progress bar showing how far through the four it
 * sits. All of it decorative and aria-hidden — the "Phase n / 4" label
 * carries the same information as text.
 *
 * Gradient text on ink uses lightened tints of the brand ramp (#6FA8FF,
 * #8E7BFF, #B07BFF) rather than the logo hexes, for contrast on the dark
 * ground — the same reasoning as --accent-fg in globals.css.
 *
 * Content is the approved four-phase process from lib/content, verbatim.
 */
export function ProcessPhases() {
  const count = phases.items.length;

  return (
    <section data-theme="ink" className="section relative overflow-hidden bg-[var(--bg)]">
      {/* Ambient dressing: a brand glow bleeding in from the top edge and a
          faint grid, both far below text contrast thresholds. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-14rem] h-[32rem] w-[76rem] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(closest-side,rgba(91,61,245,0.22),rgba(43,127,255,0.10)_55%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:44px_44px]"
      />

      <div className="shell relative">
        <RevealText>
          <p className="t-mono text-[var(--muted)]">{phases.eyebrow}</p>
          <h2 className="t-display-lg mt-6 max-w-[16ch] text-paper">
            {phases.title.lead}{" "}
            <span className="bg-[linear-gradient(92deg,#6FA8FF,#8E7BFF_55%,#B07BFF)] bg-clip-text text-transparent">
              {phases.title.accent}
            </span>
          </h2>
        </RevealText>

        <ol className="mt-4 flex flex-col">
          {phases.items.map((item, i) => (
            <li
              key={item.phase}
              className="relative grid content-center gap-8 border-t border-[rgba(255,255,255,0.10)] py-16 first:border-t-0 md:min-h-[75vh] lg:grid-cols-12 lg:gap-x-[clamp(3rem,5vw,6rem)]"
            >
              {/* Ghost numeral: the chapter's number at architectural scale,
                  well below any contrast that could compete with the copy. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 select-none text-[clamp(10rem,24vw,20rem)] font-medium leading-none tracking-[-0.05em] text-[rgba(255,255,255,0.035)]"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="lg:col-span-6">
                <RevealText>
                  <p className="t-mono flex items-center gap-3 text-[var(--accent-fg)]">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-[linear-gradient(135deg,#2B7FFF,#7B2FF7)]"
                    />
                    {item.phase}
                  </p>
                  <h3 className="mt-6 flex items-start gap-5">
                    <span
                      aria-hidden="true"
                      className="bg-[linear-gradient(180deg,#6FA8FF,#8E7BFF_60%,#B07BFF)] bg-clip-text text-[clamp(3rem,5.5vw,5rem)] font-medium leading-[0.9] tracking-[-0.04em] text-transparent"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="t-display-lg text-[clamp(2rem,4.4vw,3.5rem)] text-paper">
                      {item.name}
                    </span>
                  </h3>
                  <ul className="mt-8 flex flex-wrap gap-2.5">
                    {item.steps.map((step, j) => (
                      <li
                        key={step}
                        className="flex items-center gap-2.5 rounded-full border border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.04)] px-4 py-2.5 backdrop-blur-sm"
                      >
                        <span className="t-mono text-[var(--accent-fg)]">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[0.875rem] text-[rgba(255,255,255,0.80)]">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ul>
                </RevealText>
              </div>

              <div className="lg:col-span-5 lg:col-start-8 lg:self-center">
                <RevealText delay={0.08}>
                  <p className="t-body-lg max-w-[52ch] text-[rgba(255,255,255,0.78)]">
                    {item.body}
                  </p>
                  {/* Segmented progress through the four phases. Decorative;
                      the "Phase n / 4" label above carries it as text. */}
                  <div aria-hidden="true" className="mt-12 flex items-center gap-4">
                    <div className="flex flex-1 gap-2">
                      {phases.items.map((_, j) => (
                        <span
                          key={j}
                          className={
                            j <= i
                              ? "h-[3px] flex-1 rounded-full bg-[linear-gradient(90deg,#2B7FFF,#5B3DF5,#7B2FF7)] shadow-[0_0_12px_rgba(91,61,245,0.55)]"
                              : "h-[3px] flex-1 rounded-full bg-[rgba(255,255,255,0.10)]"
                          }
                        />
                      ))}
                    </div>
                    <span className="t-mono text-[rgba(255,255,255,0.50)]">
                      {String(i + 1).padStart(2, "0")} — {String(count).padStart(2, "0")}
                    </span>
                  </div>
                </RevealText>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
